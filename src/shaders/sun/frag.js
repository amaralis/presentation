const frag = `

// Constants, definitions, and other nonsense
// Source: https://github.com/stegu/webgl-noise/blob/master/src/psrdnoise2D.glsl

// Modulo 289, optimizes to code without divisions
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

float mod289(float x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

// Permutation polynomial (ring size 289 = 17*17)
vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float permute(float x) {
  return mod289(((x*34.0)+1.0)*x);
}

// Hashed 2-D gradients with an extra rotation.
// (The constant 0.0243902439 is 1/41)
vec2 rgrad2(vec2 p, float rot) {
#if 0
// Map from a line to a diamond such that a shift maps to a rotation.
  float u = permute(permute(p.x) + p.y) * 0.0243902439 + rot; // Rotate by shift
  u = 4.0 * fract(u) - 2.0;
  // (This vector could be normalized, exactly or approximately.)
  return vec2(abs(u)-1.0, abs(abs(u+1.0)-2.0)-1.0);
#else
// For more isotropic gradients, sin/cos can be used instead.
  float u = permute(permute(p.x) + p.y) * 0.0243902439 + rot; // Rotate by shift
  u = fract(u) * 6.28318530718; // 2*pi
  return vec2(cos(u), sin(u));
#endif
}

// float {p}s{r}noise(vec2 pos {, vec2 per} {, float rot})
// "pos" is the input (x,y) coordinate
// "per" is the x and y period, where per.x is a positive integer
//    and per.y is a positive even integer
// "rot" is the angle to rotate the gradients (any float value,
//    where 0.0 is no rotation and 1.0 is one full turn)
// The return value is the noise value.
// Partial derivatives are not computed, making these functions faster.

//
// 2-D tiling simplex noise with rotating gradients,
// but without the analytical derivative.
//

float psrnoise(vec2 pos, vec2 per, float rot) {
  // Offset y slightly to hide some rare artifacts
  pos.y += 0.001;
  // Skew to hexagonal grid
  vec2 uv = vec2(pos.x + pos.y*0.5, pos.y);
  
  vec2 i0 = floor(uv);
  vec2 f0 = fract(uv);
  // Traversal order
  vec2 i1 = (f0.x > f0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);

  // Unskewed grid points in (x,y) space
  vec2 p0 = vec2(i0.x - i0.y * 0.5, i0.y);
  vec2 p1 = vec2(p0.x + i1.x - i1.y * 0.5, p0.y + i1.y);
  vec2 p2 = vec2(p0.x + 0.5, p0.y + 1.0);

  // Integer grid point indices in (u,v) space
  i1 = i0 + i1;
  vec2 i2 = i0 + vec2(1.0, 1.0);

  // Vectors in unskewed (x,y) coordinates from
  // each of the simplex corners to the evaluation point
  vec2 d0 = pos - p0;
  vec2 d1 = pos - p1;
  vec2 d2 = pos - p2;

  // Wrap i0, i1 and i2 to the desired period before gradient hashing:
  // wrap points in (x,y), map to (u,v)
  vec3 xw = mod(vec3(p0.x, p1.x, p2.x), per.x);
  vec3 yw = mod(vec3(p0.y, p1.y, p2.y), per.y);
  vec3 iuw = xw + 0.5 * yw;
  vec3 ivw = yw;
  
  // Create gradients from indices
  vec2 g0 = rgrad2(vec2(iuw.x, ivw.x), rot);
  vec2 g1 = rgrad2(vec2(iuw.y, ivw.y), rot);
  vec2 g2 = rgrad2(vec2(iuw.z, ivw.z), rot);

  // Gradients dot vectors to corresponding corners
  // (The derivatives of this are simply the gradients)
  vec3 w = vec3(dot(g0, d0), dot(g1, d1), dot(g2, d2));
  
  // Radial weights from corners
  // 0.8 is the square of 2/sqrt(5), the distance from
  // a grid point to the nearest simplex boundary
  vec3 t = 0.8 - vec3(dot(d0, d0), dot(d1, d1), dot(d2, d2));

  // Set influence of each surflet to zero outside radius sqrt(0.8)
  t = max(t, 0.0);

  // Fourth power of t
  vec3 t2 = t * t;
  vec3 t4 = t2 * t2;
  
  // Final noise value is:
  // sum of ((radial weights) times (gradient dot vector from corner))
  float n = dot(t4, w);
  
  // Rescale to cover the range [-1,1] reasonably well
  return 11.0*n;
}

//////////////////////////////// End noise code ////////////////////////////////

float applyFrequency(float lacunarity, float exponent){
    return pow(lacunarity, exponent);
}

float applyAmplitude(float persistence, float exponent){
    return pow(persistence, exponent);
}

float offsetNoise(float coord, float offset){
    return coord + offset;
}

float normalize01(float value){
    return value * 0.5 + 0.5;
}

vec4 normalize01xyzw(vec4 value){
    return value * 0.5 + 0.5;
}

varying vec2 v_Uv;
varying float v_Scale;

uniform sampler2D uCoarseNoise;
uniform sampler2D uMediumNoise;
uniform sampler2D uFineNoise;

uniform sampler2D uGradient;

uniform float uTime;

varying float vCoarseTimeMult;
varying float vMediumTimeMult;
varying float vFineTimeMult;

void main() {

  float frequency = 1.0;
    float timeMult = 0.3;
    float time = uTime * timeMult;

    float lacunarity = 2.0;
    float persistence = 0.5;
    // float scale = 4.0;
    float offset = 1.337;

  // float psrnoise(vec2 pos, vec2 per, float rot)
    
    // // Look up the texel position vertically in the gradient according to the noise; needs to yield a vec 2, to pass through to a texture2D
    // // This one is a brain twister.

    // // !!! texture must be set to repeat, with three.js, if we want to scroll it !!! //
    
    // // 1.- We need a noise value per pixel. We'll use a texture here.
    // vec4 coarseNoise = texture2D(uCoarseNoise, vec2(v_Uv.x + vCoarseTimeMult, v_Uv.y - vCoarseTimeMult));
    // float coarseNoise = psrnoise(vec2(v_Uv) * v_Scale, vec2(2.0, 4.0), 0.9);
    float coarseNoise = psrnoise(vec2(v_Uv.x * v_Scale * applyFrequency(lacunarity, 0.0), v_Uv.y * v_Scale * applyFrequency(lacunarity, 0.0)), vec2(2.0, 4.0), 0.9) * applyAmplitude(persistence, 0.0);;
    // // vec4 coarseNoise = texture2D(uCoarseNoise, v_Uv); // This is just for not scrolling the noise

    // // 2.- We sample the noise value at this fragment's position. r, g, or b is irrelevant.
    // float coarseNoiseSample = coarseNoise.r;

    // // 3.- We get a Y coord in the gradient texture according to the noise sample at this fragment's coord    
    // // X is always 0, we only care about Y: the noise sample between 0 and 1 will give us a coordinate in the Y axis to sample the gradient
    // vec2 retrievedTexelPos = vec2(0.0, coarseNoiseSample);
    vec2 retrievedTexelPos = vec2(0.0, coarseNoise);

    // // 4.- We create the final color for this pixel by sampling the gradient in its Y axis according to this the pixel's position. texture2D yields a vec4 ready for use.
    vec4 coarseColor = texture2D(uGradient, retrievedTexelPos);

    // // Mess around with how much each color weighs
    coarseColor *= 0.45;
    // // coarseColor *= mix(0.9, 1.0, cos(uTime) + 1.0 / 2.0);
    
    // // Repeat for other two noise maps

    // // vec4 mediumNoise = texture2D(uMediumNoise, v_Uv);
    // vec4 mediumNoise = texture2D(uMediumNoise, vec2(v_Uv.x, v_Uv.y - vMediumTimeMult));
    // float mediumNoiseSample = mediumNoise.r;
    // retrievedTexelPos = vec2(0.0, mediumNoiseSample);
    // vec4 mediumColor = texture2D(uGradient, retrievedTexelPos);

    // // Mess around with how much each color weighs
    // mediumColor *= 0.55;
    // // mediumColor *= mix(0.2, 0.4, cos(uTime) + 1.0 / 2.0);
    
    // // vec4 fineNoise = texture2D(uFineNoise, v_Uv);
    // vec4 fineNoise = texture2D(uFineNoise, vec2(v_Uv.x - vFineTimeMult, v_Uv.y));
    // float fineNoiseSample = fineNoise.r;
    // retrievedTexelPos = vec2(0.0, fineNoiseSample);
    // vec4 fineColor = texture2D(uGradient, retrievedTexelPos);

    // // Mess around with how much each color weighs
    // // fineColor *= 1.0;
    // // fineColor *= clamp((sin(uTime) * 2.0 - 1.0), 0.5, 1.0);
    // // fineColor *= clamp(sin(uTime) + 1.0 / 2.0, 0.7, 1.0);
    // fineColor *= mix(0.5, 0.6, sin(uTime) + 1.0 / 2.0);

    // // The colors have been multiplied down, so now we can do additive blending instead of direct multiplication here!
    // // Well, after a bit of fiddling, this is more interesting, but the colors lose connection to the displacement
    // vec4 finalColor = (coarseColor + mediumColor) * (mediumColor + fineColor) * (coarseColor + fineColor);
    // // vec4 finalColor = (mediumColor) * (mediumColor + fineColor) * (fineColor + coarseColor);


    float noise1 = psrnoise(vec2(v_Uv.x * v_Scale * applyFrequency(lacunarity, 0.0), v_Uv.y * v_Scale * applyFrequency(lacunarity, 0.0)), vec2(2.0, 4.0), time) * applyAmplitude(persistence, 0.0);
    float noise2 = psrnoise(vec2(v_Uv.x * v_Scale * applyFrequency(lacunarity, 1.0), v_Uv.y * v_Scale * applyFrequency(lacunarity, 1.0)), vec2(2.0, 6.0), time) * applyAmplitude(persistence, 1.0);
    float noise3 = psrnoise(vec2(v_Uv.x * v_Scale * applyFrequency(lacunarity, 2.0), v_Uv.y * v_Scale * applyFrequency(lacunarity, 2.0)), vec2(4.0, 8.0), time) * applyAmplitude(persistence, 2.0);

    float normNoise = normalize01(noise1 + noise2 + noise3);

    vec3 colorDark = vec3(61.0 / 255.0, 2.0 / 255.0, 2.0 / 255.0);
    vec3 colorBright = vec3(219.0 / 255.0, 128.0 / 255.0, 9.0 / 255.0);
    
    vec3 finalColor = vec3(0.0);

    finalColor = mix(colorDark, colorBright, normNoise);

    gl_FragColor = vec4(finalColor, normNoise);

    // gl_FragColor = finalColor;
    // gl_FragColor = fineColor;
    // gl_FragColor = mediumColor;
    // gl_FragColor = coarseColor;
}
`

export default frag;