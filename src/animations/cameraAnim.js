import * as THREE from 'three/build/three.module';
import { gsap } from "gsap";
import { CameraHelper } from "three";
import { volcanic1, dry1, gasGiant1, moon1GasGiant, moon2GasGiant, primordial1, savannah1 } from '../objects/planets';
import sun from '../objects/sun';

import focusBody from './focusTL';

export default function animateCamera(camera, shaders, scene, renderer, prevBody){
    // const masterTL = gsap.timeline({paused: true});
    // masterTL.add(focusBody(camera, dry1, {focusShader: shaders.focusShader}, scene));
    // masterTL.play();

    focusBody(camera, dry1, {focusShader: shaders.focusShader}, scene, renderer, prevBody)
    .eventCallback('onComplete', focusBody, [camera, primordial1, {focusShader: shaders.focusShader}, scene, renderer, dry1])

    
    // let cameraRelativePos = new THREE.Vector3();
    let sunWorldPos = new THREE.Vector3();
    let volcanic1OrbitWorldPos = new THREE.Vector3();
    let volcanic1WorldPos = new THREE.Vector3();
    let dry1OrbitWorldPos = new THREE.Vector3();
    let dry1WorldPos = new THREE.Vector3();
    let primordial1OrbitWorldPos = new THREE.Vector3();
    let primordial1WorldPos = new THREE.Vector3();
    let gasGiant1OrbitWorldPos = new THREE.Vector3();
    let gasGiant1WorldPos = new THREE.Vector3();
    
    // camera.getWorldPosition(cameraRelativePos);
    sun.getWorldPosition(sunWorldPos);
    volcanic1.parent.getWorldPosition(volcanic1OrbitWorldPos);
    volcanic1.getWorldPosition(volcanic1WorldPos);
    dry1.parent.getWorldPosition(dry1OrbitWorldPos);
    dry1.getWorldPosition(dry1WorldPos);
    primordial1.parent.getWorldPosition(primordial1OrbitWorldPos);
    primordial1.getWorldPosition(primordial1WorldPos);
    gasGiant1.parent.getWorldPosition(gasGiant1OrbitWorldPos);
    gasGiant1.getWorldPosition(gasGiant1WorldPos);
    
    // const tl = gsap.timeline();
    // tl.to(camera.userData.camTargetObj.position, {x: volcanic1WorldPos.x, y: volcanic1WorldPos.y, z: volcanic1WorldPos.z, delay: 1, duration: 3, ease: "elastic.out(1,1)",
    //     onStart: function(){
    //         // camera.userData.setCamTargetObj(volcanic1).updateCamTargetObj.position();
    //         // console.log(camera.userData.camTargetObj.position);
    //     },
    //     onUpdate: function(){
    //     },
    //     onComplete: function(){
    //         // console.log(camera.userData.camTargetObj.position)
    //         // camera.userData.insertCamIntoOrbit(camera, volcanic1.parent);

    //         // console.log(camera.userData.camTargetObj.position)
    //         camera.userData.insertCamTargetIntoOrbit(volcanic1.parent);
    //         // console.log(camera.userData.camTargetObj.position)
    //     }})
    // .to(camera.userData.camTargetObj.position, {x: volcanic1.position.x, y: volcanic1.position.y, z: volcanic1.position.z, ease: "power2.out", duration: 3,
    //     onStart: function(){
    //         // console.log(volcanic1.position)
    //         // console.log(camera.userData.camTargetObj.position)
    //         camera.userData.insertCamIntoOrbit(camera, dry1.parent);
    //     },
    //     onUpdate: () => {
    //     },
    //     onComplete: function(){
    //         camera.userData.removeCamTargetFromOrbit();
    //         camera.userData.removeCamFromOrbit(camera);
    //     }})
    // .to(camera.userData.camTargetObj.position, {x: dry1.position.x, y: dry1.position.y, z: dry1.position.z, ease: "power2.out", duration: 3,
    //     onStart: function(){
    //         // console.log(dry1.position)
    //         // console.log(camera.userData.camTargetObj.position)
    //     },
    //     onUpdate: () => {
    //     },
    //     onComplete: function(){
    //         camera.userData.insertCamTargetIntoOrbit(primordial1.parent);
    //     }})
    // .to(camera.userData.camTargetObj.position, {x: primordial1.position.x, y: primordial1.position.y, z: primordial1.position.z, ease: "power2.out", duration: 3,
    //     onStart: function(){
    //         // console.log(primordial1.position)
    //         // console.log(camera.userData.camTargetObj.position)
    //     },
    //     onUpdate: () => {
    //     },
    //     onComplete: function(){
    //         camera.userData.insertCamTargetIntoOrbit(gasGiant1.parent);
    //     }})
    // .to(camera.userData.camTargetObj.position, {x: gasGiant1.position.x, y: gasGiant1.position.y, z: gasGiant1.position.z, ease: "power2.out", duration: 3,
    //     onStart: function(){
    //         // console.log(gasGiant1.position)
    //         // console.log(camera.userData.camTargetObj.position)
    //     },
    //     onUpdate: () => {
    //     },
    //     onComplete: function(){
    //         camera.userData.insertCamTargetIntoOrbit(sun.parent);
    //     }})
    // .to(camera.userData.camTargetObj.position, {x: sun.position.x, y: sun.position.y, z: sun.position.z, ease: "power2.out", duration: 3,
    //     onStart: function(){
    //         // console.log(sun.position)
    //         // console.log(camera.userData.camTargetObj.position)
    //     },
    //     onUpdate: () => {
    //     },
    //     onComplete: function(){
    //         camera.userData.removeCamFromOrbit();
    //     }})
}
