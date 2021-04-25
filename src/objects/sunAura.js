import * as THREE from 'three/build/three.module';
import vert from '../shaders/sunAura/vert';
import frag from '../shaders/sunAura/frag';

import auraTex from '../img/sunAura/sunAuraGradientSharp4.png';
// import auraTex from '../img/sunAura/newGradient.png';

const width = window.innerWidth;
const height = window.innerHeight;
// const resolution = width / height;

const uniforms = {
    uTexGradient: {value: new THREE.TextureLoader().load(auraTex)},
    u_Time: {value: 0.0},
    uResolution: {value: new THREE.Vector2(width, height)}
}

const geo = new THREE.PlaneGeometry(35, 35);
const mat = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms,
    transparent: true,
    depthWrite: false
});

const sunAura = new THREE.Mesh(geo, mat);

export default sunAura;