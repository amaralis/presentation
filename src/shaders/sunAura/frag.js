const frag = `

/////////////// K.jpg's Simplex-like Re-oriented 4-Point BCC Noise ///////////////
//////////////////// Output: vec4(dF/dx, dF/dy, dF/dz, value) ////////////////////

// Inspired by Stefan Gustavson's noise
vec4 permuteB(vec4 t) {
    return t * (t * 34.0 + 133.0);
}

// Gradient set is a normalized expanded rhombic dodecahedron
vec3 grad(float hash) {
    
    // Random vertex of a cube, +/- 1 each
    vec3 cube = mod(floor(hash / vec3(1.0, 2.0, 4.0)), 2.0) * 2.0 - 1.0;
    
    // Random edge of the three edges connected to that vertex
    // Also a cuboctahedral vertex
    // And corresponds to the face of its dual, the rhombic dodecahedron
    vec3 cuboct = cube;
    cuboct[int(hash / 16.0)] = 0.0;
    
    // In a funky way, pick one of the four points on the rhombic face
    float type = mod(floor(hash / 8.0), 2.0);
    vec3 rhomb = (1.0 - type) * cube + type * (cuboct + cross(cube, cuboct));
    
    // Expand it so that the new edges are the same length
    // as the existing ones
    vec3 grad = cuboct * 1.22474487139 + rhomb;
    
    // To make all gradients the same length, we only need to shorten the
    // second type of vector. We also put in the whole noise scale constant.
    // The compiler should reduce it into the existing floats. I think.
    grad *= (1.0 - 0.042942436724648037 * type) * 32.80201376986577;
    
    return grad;
}

// BCC lattice split up into 2 cube lattices
vec4 bccNoiseBase(vec3 X) {
    
    // First half-lattice, closest edge
    vec3 v1 = round(X);
    vec3 d1 = X - v1;
    vec3 score1 = abs(d1);
    vec3 dir1 = step(max(score1.yzx, score1.zxy), score1);
    vec3 v2 = v1 + dir1 * sign(d1);
    vec3 d2 = X - v2;
    
    // Second half-lattice, closest edge
    vec3 X2 = X + 144.5;
    vec3 v3 = round(X2);
    vec3 d3 = X2 - v3;
    vec3 score2 = abs(d3);
    vec3 dir2 = step(max(score2.yzx, score2.zxy), score2);
    vec3 v4 = v3 + dir2 * sign(d3);
    vec3 d4 = X2 - v4;
    
    // Gradient hashes for the four points, two from each half-lattice
    vec4 hashes = permuteB(mod(vec4(v1.x, v2.x, v3.x, v4.x), 289.0));
    hashes = permuteB(mod(hashes + vec4(v1.y, v2.y, v3.y, v4.y), 289.0));
    hashes = mod(permuteB(mod(hashes + vec4(v1.z, v2.z, v3.z, v4.z), 289.0)), 48.0);
    
    // Gradient extrapolations & kernel function
    vec4 a = max(0.5 - vec4(dot(d1, d1), dot(d2, d2), dot(d3, d3), dot(d4, d4)), 0.0);
    vec4 aa = a * a; vec4 aaaa = aa * aa;
    vec3 g1 = grad(hashes.x); vec3 g2 = grad(hashes.y);
    vec3 g3 = grad(hashes.z); vec3 g4 = grad(hashes.w);
    vec4 extrapolations = vec4(dot(d1, g1), dot(d2, g2), dot(d3, g3), dot(d4, g4));
    
    // Derivatives of the noise
    vec3 derivative = -8.0 * mat4x3(d1, d2, d3, d4) * (aa * a * extrapolations)
        + mat4x3(g1, g2, g3, g4) * aaaa;
    
    // Return it all as a vec4
    return vec4(derivative, dot(aaaa, extrapolations));
}

// Use this if you don't want Z to look different from X and Y
vec4 bccNoiseClassic(vec3 X) {
    
    // Rotate around the main diagonal. Not a skew transform.
    vec4 result = bccNoiseBase(dot(X, vec3(2.0/3.0)) - X);
    return vec4(dot(result.xyz, vec3(2.0/3.0)) - result.xyz, result.w);
}

// Use this if you want to show X and Y in a plane, and use Z for time, etc.
vec4 bccNoisePlaneFirst(vec3 X) {
    
    // Rotate so Z points down the main diagonal. Not a skew transform.
    mat3 orthonormalMap = mat3(
        0.788675134594813, -0.211324865405187, -0.577350269189626,
        -0.211324865405187, 0.788675134594813, -0.577350269189626,
        0.577350269189626, 0.577350269189626, 0.577350269189626);
    
    vec4 result = bccNoiseBase(orthonormalMap * X);
    return vec4(result.xyz * orthonormalMap, result.w);
}

//////////////////////////////// End noise code ////////////////////////////////

varying vec2 vUv;
varying vec3 vPos;

uniform sampler2D uTexGradient;
uniform float u_Time;
uniform vec2 uResolution;

float sdCircle( vec2 p, float r ){
    return length(p) - r;
}

void main() {
    vec3 pos = vPos;
    vec2 centeredUv = vUv * 2.0 - 1.0;
    float time = u_Time;
    float scale = 1.0;
    float timeMult = 0.30;

    // float pulseMinMax = mix(2.8, 3.0, sin(time * 0.8) * 0.7 );
    float pulseMinMax = mix(5.0, 5.5, sin(time * 0.5));

    // Multiplication of centeredUv by pulse minmax manipulates pulse amplitude
    float len = length(centeredUv * pulseMinMax);

    // Manipulate gradient by multiplying len by different values or by mixing it between different intervals of the gradient
    vec4 texel = texture(uTexGradient, vec2(0.0, len * 0.3));

    float red = mix(0.0, 1.0, texel.r);
    float green = mix(0.0, 1.0, texel.g);
    float blue = mix(0.0, 1.0, texel.b);
    float alpha = mix(0.0, 1.0, texel.w);
    
    // vec4 gradientColor = vec4(red, green, blue, gradientAlpha);
    vec4 gradientColor = vec4(red, green, blue, 1.0);
    
    
    

    // Multiply at the end of the equation softens the edges
    vec4 noiseX = bccNoisePlaneFirst(vec3(centeredUv.x * 5.0, centeredUv.y * 5.0, sin(time * timeMult))) * 0.5;
    vec4 noiseY = bccNoisePlaneFirst(vec3(centeredUv.x * 5.0, centeredUv.y * 5.0, cos(time * timeMult))) * 0.5;
    vec4 fineNoiseX = bccNoisePlaneFirst(vec3(centeredUv.x * 30.0, centeredUv.y * 30.0, sin(time * timeMult)));
    vec4 fineNoiseY = bccNoisePlaneFirst(vec3(centeredUv.x * 30.0, centeredUv.y * 30.0, cos(time * timeMult)));
    
    // Ridge noise
    vec4 ridgeNoise = 1.0 - (vec4(noiseX.x + noiseX.y + noiseX.z) * vec4(noiseY.x + noiseY.y + noiseY.z) * 0.005);

    // Fine ridge noise - final multiplication makes it smoother or sharper
    vec4 fineRidgeNoise = 1.0 - (vec4(fineNoiseX.x + fineNoiseX.y + fineNoiseX.z) * vec4(fineNoiseY.x + fineNoiseY.y + fineNoiseY.z) * 5.0);
    
    
    
    
    
    
    
    vec4 billboard = vec4(0.0);
    
    float circle = (1.0 - sdCircle(centeredUv, 0.2)); // Manipulate gradient size by multiplying uv, so it doesn't get cut at the edges of the billboard; radius will affect gradient alpha
    float fineCircle = (1.0 - sdCircle(centeredUv * 4.0, 0.2)); // Manipulate gradient size by multiplying uv, so it doesn't get cut at the edges of the billboard; radius will affect gradient alpha

    // Cut ridge noise off when gradient's alpha reaches 0, otherwise noise reappears at billboard's edges
    ridgeNoise *= max(circle, 0.0);
    fineRidgeNoise *= max(fineCircle, 0.0);
    
    billboard += circle;
    billboard *= gradientColor;
    billboard *= ridgeNoise;
    billboard += fineRidgeNoise * 0.0005;



    // gl_FragColor = ridgeNoise;
    gl_FragColor = billboard;
    // gl_FragColor = vec4(1.0);
}
`

export default frag;