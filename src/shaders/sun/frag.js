const frag = `

varying vec2 vUv;

uniform sampler2D uCoarseNoise;
uniform sampler2D uMediumNoise;
uniform sampler2D uFineNoise;

uniform sampler2D uGradient;

uniform float uTime;

varying float vCoarseTimeMult;
varying float vMediumTimeMult;
varying float vFineTimeMult;

void main() {
    
    // Look up the texel position vertically in the gradient according to the noise; needs to yield a vec 2, to pass through to a texture2D
    // This one is a brain twister.

    // !!! texture must be set to repeat, with three.js, if we want to scroll it !!! //
    
    // 1.- We need a noise value per pixel. We'll use a texture here.
    vec4 coarseNoise = texture2D(uCoarseNoise, vec2(vUv.x + vCoarseTimeMult, vUv.y - vCoarseTimeMult));
    // vec4 coarseNoise = texture2D(uCoarseNoise, vUv); // This is just for not scrolling the noise

    // 2.- We sample the noise value at this fragment's position. r, g, or b is irrelevant.
    float coarseNoiseSample = coarseNoise.r;

    // 3.- We get a Y coord in the gradient texture according to the noise sample at this fragment's coord    
    // X is always 0, we only care about Y: the noise sample between 0 and 1 will give us a coordinate in the Y axis to sample the gradient
    vec2 retrievedTexelPos = vec2(0.0, coarseNoiseSample);

    // 4.- We create the final color for this pixel by sampling the gradient in its Y axis according to this the pixel's position. texture2D yields a vec4 ready for use.
    vec4 coarseColor = texture2D(uGradient, retrievedTexelPos);

    // Mess around with how much each color weighs
    coarseColor *= 0.45;
    // coarseColor *= mix(0.9, 1.0, cos(uTime) + 1.0 / 2.0);
    
    // Repeat for other two noise maps

    // vec4 mediumNoise = texture2D(uMediumNoise, vUv);
    vec4 mediumNoise = texture2D(uMediumNoise, vec2(vUv.x, vUv.y - vMediumTimeMult));
    float mediumNoiseSample = mediumNoise.r;
    retrievedTexelPos = vec2(0.0, mediumNoiseSample);
    vec4 mediumColor = texture2D(uGradient, retrievedTexelPos);

    // Mess around with how much each color weighs
    mediumColor *= 0.55;
    // mediumColor *= mix(0.2, 0.4, cos(uTime) + 1.0 / 2.0);
    
    // vec4 fineNoise = texture2D(uFineNoise, vUv);
    vec4 fineNoise = texture2D(uFineNoise, vec2(vUv.x - vFineTimeMult, vUv.y));
    float fineNoiseSample = fineNoise.r;
    retrievedTexelPos = vec2(0.0, fineNoiseSample);
    vec4 fineColor = texture2D(uGradient, retrievedTexelPos);

    // Mess around with how much each color weighs
    // fineColor *= 1.0;
    // fineColor *= clamp((sin(uTime) * 2.0 - 1.0), 0.5, 1.0);
    // fineColor *= clamp(sin(uTime) + 1.0 / 2.0, 0.7, 1.0);
    fineColor *= mix(0.5, 0.6, sin(uTime) + 1.0 / 2.0);

    // The colors have been multiplied down, so now we can do additive blending instead of direct multiplication here!
    // Well, after a bit of fiddling, this is more interesting, but the colors lose connection to the displacement
    vec4 finalColor = (coarseColor + mediumColor) * (mediumColor + fineColor) * (coarseColor + fineColor);
    // vec4 finalColor = (mediumColor) * (mediumColor + fineColor) * (fineColor + coarseColor);

    gl_FragColor = finalColor;
    // gl_FragColor = fineColor;
    // gl_FragColor = mediumColor;
    // gl_FragColor = coarseColor;
}
`

export default frag;