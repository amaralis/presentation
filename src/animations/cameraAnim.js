import * as THREE from 'three/build/three.module';
import { gsap } from "gsap";
import { CameraHelper } from "three";
import { volcanic1, dry1, gasGiant1, moon1GasGiant, moon2GasGiant, primordial1, savannah1 } from '../objects/planets';
import sun from '../objects/sun';

import focusBody from './focusTL';

export default function animateCamera(camera, shaders, scene, renderer, prevBody){
    // Needs tweaking for moon orbits
    
    const tl1 = focusBody(camera, volcanic1, {focusShader: shaders.focusShader}, scene, renderer, prevBody, dry1);
    const tl2 = focusBody(camera, dry1, {focusShader: shaders.focusShader}, scene, renderer, prevBody, primordial1);
    const tl3 = focusBody(camera, primordial1, {focusShader: shaders.focusShader}, scene, renderer, prevBody, savannah1);
    const tl4 = focusBody(camera, savannah1, {focusShader: shaders.focusShader}, scene, renderer, prevBody, gasGiant1);
    const tl5 = focusBody(camera, gasGiant1, {focusShader: shaders.focusShader}, scene, renderer, prevBody, moon1GasGiant);
    const tl6 = focusBody(camera, moon1GasGiant, {focusShader: shaders.focusShader}, scene, renderer, prevBody, moon2GasGiant);
    const tl7 = focusBody(camera, moon2GasGiant, {focusShader: shaders.focusShader}, scene, renderer, prevBody, sun);

    const master = gsap.timeline();
    master.add(tl1)
    .add(tl2)
    .add(tl3)
    .add(tl4)
    .add(tl5)
    .add(tl6)
    .add(tl7);


    // // let cameraRelativePos = new THREE.Vector3();
    // let sunWorldPos = new THREE.Vector3();
    // let volcanic1OrbitWorldPos = new THREE.Vector3();
    // let volcanic1WorldPos = new THREE.Vector3();
    // let dry1OrbitWorldPos = new THREE.Vector3();
    // let dry1WorldPos = new THREE.Vector3();
    // let primordial1OrbitWorldPos = new THREE.Vector3();
    // let primordial1WorldPos = new THREE.Vector3();
    // let gasGiant1OrbitWorldPos = new THREE.Vector3();
    // let gasGiant1WorldPos = new THREE.Vector3();
    
    // // camera.getWorldPosition(cameraRelativePos);
    // sun.getWorldPosition(sunWorldPos);
    // volcanic1.parent.getWorldPosition(volcanic1OrbitWorldPos);
    // volcanic1.getWorldPosition(volcanic1WorldPos);
    // dry1.parent.getWorldPosition(dry1OrbitWorldPos);
    // dry1.getWorldPosition(dry1WorldPos);
    // primordial1.parent.getWorldPosition(primordial1OrbitWorldPos);
    // primordial1.getWorldPosition(primordial1WorldPos);
    // gasGiant1.parent.getWorldPosition(gasGiant1OrbitWorldPos);
    // gasGiant1.getWorldPosition(gasGiant1WorldPos);
}
