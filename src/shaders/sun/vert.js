const vert = `
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

varying vec2 v_Uv;
varying float v_Scale;
varying float v_timeMultCoarse;
varying float v_timeMultMedium;
varying float v_timeMultFine;

uniform float u_Time;

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

void main() {    
    v_Uv = uv;
    v_Scale = 6.0;
    
    v_timeMultCoarse = 0.025;
    v_timeMultMedium = 0.075;
    v_timeMultFine = 0.125;
    // v_timeMultCoarse = 0.05;
    // v_timeMultMedium = 0.15;
    // v_timeMultFine = 0.25;
    
    float timeMultCoarse = v_timeMultCoarse;
    float timeMultMedium = v_timeMultMedium;
    float timeMultFine = v_timeMultFine;

    float lacunarity = 2.0;
    // Persistence (affects amplitude) can be different in frag and vert shaders. Lacunarity can't, as it affects the blending of the noises.
    float persistence = 0.5;
    vec3 offset = position;

    float coarseNoise = psrnoise(vec2(u_Time * timeMultCoarse + uv.x * v_Scale * applyFrequency(lacunarity, 0.0), u_Time * timeMultCoarse + uv.y * v_Scale * applyFrequency(lacunarity, 0.0)), vec2(2.0, 4.0), u_Time * timeMultCoarse) * applyAmplitude(persistence, 0.0);
    coarseNoise *= 0.04;

    float mediumNoise = psrnoise(vec2(u_Time * timeMultMedium - uv.x * v_Scale * applyFrequency(lacunarity, 1.0), u_Time * timeMultMedium - uv.y * v_Scale * applyFrequency(lacunarity, 1.0)), vec2(2.0, 6.0), u_Time * timeMultMedium) * applyAmplitude(persistence, 1.0);
    mediumNoise *= 0.05;
    
    float fineNoise = psrnoise(vec2(u_Time * timeMultFine - uv.x * v_Scale * applyFrequency(lacunarity, 2.0), u_Time * timeMultFine + uv.y * v_Scale * applyFrequency(lacunarity, 2.0)), vec2(4.0, 8.0), u_Time * timeMultFine) * applyAmplitude(persistence, 2.0);
    fineNoise *= 0.05;

    // Offset vertex along normal according to noise
    offset += normal * mediumNoise + normal * coarseNoise + normal * fineNoise;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( offset, 1.0 );

}
`

export default vert;