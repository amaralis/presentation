const frag = `
varying vec2 vUv;
varying vec3 vPos;

uniform float uTime;
uniform vec2 uResolution;
uniform vec3 uAtmoColor;

void main() {
    vec3 pos = vPos;
    vec2 centeredFragCoord = vUv * 2.0 - 1.0;
    float time = uTime;
    vec3 color = uAtmoColor;
    float alpha = 1.0 - length(centeredFragCoord) * 1.2;

    // color = vec3(length(centeredFragCoord) * color);

    vec4 canvas = vec4(color, alpha);

    gl_FragColor = canvas;
}
`

export default frag;