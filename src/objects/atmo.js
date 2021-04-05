import * as THREE from 'three/build/three.module';
import vert from '../shaders/atmo/vert';
import frag from '../shaders/atmo/frag';

const width = window.innerWidth;
const height = window.innerHeight;
// const resolution = width / height;

function makeAtmo(celestialBody, color, atmoH){
    const uniforms = {
        uTime: {value: 0.0},
        uResolution: {value: new THREE.Vector2(width, height)},
        uAtmoColor: {value: new THREE.Color(color)}
    }

    const diameter = celestialBody.geometry.parameters.radius * 2;
    const atmoHeight = diameter * atmoH;
    
    const geo = new THREE.PlaneGeometry(diameter + atmoHeight, diameter + atmoHeight);
    const mat = new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms,
        transparent: true
    });
    
    const atmo = new THREE.Mesh(geo, mat);
    celestialBody.add(atmo);

    return atmo
}

export default makeAtmo;