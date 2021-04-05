const vert = `
varying vec2 v_Uv;
varying vec4 v_Pos;
varying float v_Scale;

void main() {    
    v_Uv = uv;
    v_Scale = 6.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
`

export default vert;