import * as THREE from 'three/build/three.module';
import coarseNoiseTex from '../img/noise/coarseNoise.png';
import mediumNoiseTex from '../img/noise/mediumNoise2.png';
import fineNoiseTex from '../img/noise/fineNoise.png';
import fireGradientTex from '../img/noise/fireGradient2.png';
import vert from '../shaders/sun/vert';
import frag from '../shaders/sun/frag';

const sphereGeometry = new THREE.SphereGeometry(3, 32, 64);
// const sphereGeometry = new THREE.IcosahedronGeometry( 20, 4 );

// Uniforms to pass into the shader

// const coarseNoise = new THREE.TextureLoader().load('tiledNoise.jpg');
const coarseNoise = new THREE.TextureLoader().load(coarseNoiseTex);
coarseNoise.wrapS = THREE.RepeatWrapping;
coarseNoise.wrapT = THREE.RepeatWrapping;

const mediumNoise = new THREE.TextureLoader().load(mediumNoiseTex);
mediumNoise.wrapS = THREE.RepeatWrapping;
mediumNoise.wrapT = THREE.RepeatWrapping;

const fineNoise = new THREE.TextureLoader().load(fineNoiseTex);
// const fineNoise = new THREE.TextureLoader().load('img/turb.png');
// const fineNoise = new THREE.TextureLoader().load('img/turbContrast.png');
fineNoise.wrapS = THREE.RepeatWrapping;
fineNoise.wrapT = THREE.RepeatWrapping;

const fireGradient =  new THREE.TextureLoader().load(fireGradientTex);

const uniforms = {
    u_Time: {value: 0.0},
    u_Gradient: {value: fireGradient},
    u_Resolution: {value: window.innerWidth / window.innerHeight}
}

// Material //

// const material = new THREE.MeshPhongMaterial({color: 0x55FFFF});
const sphereMaterial = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vert,
    fragmentShader: frag
});

const sun = new THREE.Mesh(sphereGeometry, sphereMaterial);

export default sun;