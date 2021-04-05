const vert = `

varying vec2 vUv;
varying float vCoarseTimeMult;
varying float vMediumTimeMult;
varying float vFineTimeMult;


uniform sampler2D uCoarseNoise;
uniform sampler2D uMediumNoise;
uniform sampler2D uFineNoise;

uniform float uTime;

void main() {
    
    vUv = uv;
    vec3 coarsePos = position;
    
    vCoarseTimeMult = uTime * 0.05;
    vMediumTimeMult = uTime * 0.09;
    vFineTimeMult = uTime * -0.06;

    float lacunarity = 2.0; // Will affect how much frequency will increase (exponential) - irrelevant when using texture sampling
    float persistence = 0.1;  // Will affect how much amplitude will decrease (exponential)

    vec4 coarseNoise = texture2D(uCoarseNoise, vec2(vUv.x + vCoarseTimeMult, vUv.y - vCoarseTimeMult));
    // vec4 coarseNoise = texture2D(uCoarseNoise, vUv); // This is just for not scrolling the noise
    
    // Change coarsePos along normals according to noise (the webgl program passes the normals to the shader by default)
    // coarsePos = coarsePos + normal; // This would simply make the object seem bigger

    // Weigh how much the position changes for this particular octave
    float coarseFrequency = pow(lacunarity, 0.0); // Irrelevant in case of texture sampling
    float coarseAmplitude = pow(persistence, 0.5); // Decrease exponent to increase amplitude
    // Position should be noise + amplitude; we need to correct to do it along the vertex normal
    coarsePos += (coarseNoise.xyz * normal.xyz) * coarseAmplitude;
    
    // Repeat for other two noise maps
    
    vec4 mediumNoise = texture2D(uMediumNoise, vec2(vUv.x, vUv.y - vMediumTimeMult));
    // vec4 mediumNoise = texture2D(uMediumNoise, vUv);
    vec3 mediumPos = position;

    // Weigh how much the position changes for this particular octave
    float mediumFrequency = pow(lacunarity, 1.0); // Irrelevant in case of texture sampling
    float mediumAmplitude = pow(persistence, 0.5); // Decrease exponent to increase amplitude
    // Position should be noise + amplitude; we need to correct to do it along the vertex normal
    mediumPos += ((mediumNoise.xyz) * normal.xyz) * mediumAmplitude;
    
    // vec4 fineNoise = texture2D(uFineNoise, vec2(vUv.x / 2.0 - vFineTimeMult, vUv.y));
    vec4 fineNoise = texture2D(uFineNoise, vec2(vUv.x - vFineTimeMult, vUv.y));
    // vec4 fineNoise = texture2D(uFineNoise, vUv);
    vec3 finePos = position;

    // Weigh how much the position changes for this particular octave
    float fineFrequency = pow(lacunarity, 2.0); // Irrelevant in case of texture sampling
    float fineAmplitude = pow(persistence, 0.49); // Decrease exponent to increase amplitude
    finePos += fineNoise.xyz * normal.xyz * fineAmplitude;

    vec3 finalPos = coarsePos + mediumPos + finePos;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( mix(0.0, 0.5, finalPos.x), mix(0.0, 0.5, finalPos.y), mix(0.0, 0.5, finalPos.z), 1.0 );
    // gl_Position = projectionMatrix * modelViewMatrix * vec4( finePos, 1.0 );
    // gl_Position = projectionMatrix * modelViewMatrix * vec4( mediumPos, 1.0 );
    // gl_Position = projectionMatrix * modelViewMatrix * vec4( coarsePos, 1.0 );
    // gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
`

export default vert;