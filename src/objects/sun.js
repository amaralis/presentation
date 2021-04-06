import * as THREE from 'three/build/three.module';
import fireGradientTex from '../img/noise/fireGradient.png';
import vert from '../shaders/sun/vert';
import frag from '../shaders/sun/frag';

const sphereGeometry = new THREE.SphereGeometry(3, 64, 64);

// Uniforms to pass into the shader

const fireGradient =  new THREE.TextureLoader().load(fireGradientTex);

const uniforms = {
    u_Time: {value: 0.0},
    u_Gradient: {value: fireGradient},
    u_Resolution: {value: window.innerWidth / window.innerHeight}
}

// Material //

const sphereMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vert,
    fragmentShader: frag
});

const sun = new THREE.Mesh(sphereGeometry, sphereMaterial);

export default sun;