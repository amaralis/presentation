import * as THREE from 'three/build/three.module';
import { gsap } from "gsap";
import { CameraHelper } from "three";
import { volcanic1, dry1, gasGiant1, moon1GasGiant, moon2GasGiant, primordial1, savannah1 } from '../objects/planets';
import sun from '../objects/sun';

export default function animateCamera(camera){
    const tl = gsap.timeline();

    const cameraLocalPos = new THREE.Vector3();
    
    let cameraRelativePos = new THREE.Vector3();
    let sunWorldPos = new THREE.Vector3();
    let volcanic1OrbitWorldPos = new THREE.Vector3();
    let volcanic1WorldPos = new THREE.Vector3();
    let dry1OrbitWorldPos = new THREE.Vector3();
    let dry1WorldPos = new THREE.Vector3();
    let primordial1OrbitWorldPos = new THREE.Vector3();
    let primordial1WorldPos = new THREE.Vector3();
    let gasGiant1OrbitWorldPos = new THREE.Vector3();
    let gasGiant1WorldPos = new THREE.Vector3();
    
    camera.getWorldPosition(cameraRelativePos);
    sun.getWorldPosition(sunWorldPos);
    volcanic1.parent.getWorldPosition(volcanic1OrbitWorldPos);
    volcanic1.getWorldPosition(volcanic1WorldPos);
    dry1.parent.getWorldPosition(dry1OrbitWorldPos);
    dry1.getWorldPosition(dry1WorldPos);
    primordial1.parent.getWorldPosition(primordial1OrbitWorldPos);
    primordial1.getWorldPosition(primordial1WorldPos);
    gasGiant1.parent.getWorldPosition(gasGiant1OrbitWorldPos);
    gasGiant1.getWorldPosition(gasGiant1WorldPos);
    
    tl.to(camera.userData.camTargetWorldPos, {x: volcanic1WorldPos.x, y: volcanic1WorldPos.y, z: volcanic1WorldPos.z, duration: 3,
        onStart: function(){
            // camera.userData.setCamTargetObj(volcanic1).updateCamTargetWorldPos();
            console.log(camera.userData.camTargetWorldPos);
        },
        onUpdate: function(){
        },
        onComplete: function(){
            console.log('camWorldPos', cameraRelativePos);
            console.log('camTargetWorldPos', camera.userData.camTargetWorldPos);
            // Below changes cameraRelativePos
            volcanic1.parent.worldToLocal(cameraRelativePos);
            console.log('camWorldPos', cameraRelativePos);
            camera.parent = volcanic1.parent;
            camera.position.set(cameraRelativePos.x, cameraRelativePos.y, cameraRelativePos.z)
            
            // goToDestination(camera, volcanic1);
        }})
    // .to(camera.userData.camTargetWorldPos, {x: volcanic1.position.x, y: volcanic1.position.y, z: volcanic1.position.z, duration: 3,
    //     onStart: function(){
    //     },
    //     onUpdate: () => {
    //     },
    //     onComplete: function(){
    //         camera.userData.setCamTargetObj(volcanic1);
    //     }})
    // .to(camera.userData.camTargetWorldPos, {x: primordial1WorldPos.x, y: primordial1WorldPos.y, z: primordial1WorldPos.z, duration: 3, delay: 1, onUpdate: () => {
    // }, onComplete: function(){
    //     camera.userData.setCamTargetObj(primordial1);
    // }})
    // .to(camera.userData.camTargetWorldPos, {x: gasGiant1WorldPos.x, y: gasGiant1WorldPos.y, z: gasGiant1WorldPos.z, duration: 3, delay: 1, onUpdate: () => {
    // }, onComplete: function(){
    //     camera.userData.setCamTargetObj(gasGiant1);
    // }});
    
    function goToDestination(camera, body){
        // console.log('camWorldPos', cameraRelativePos);
        // console.log('camTargetWorldPos', camera.userData.camTargetWorldPos);

        // Below changes cameraRelativePos
        volcanic1.parent.worldToLocal(cameraRelativePos);
        // console.log('camWorldPos', cameraRelativePos);
        camera.parent = volcanic1.parent;
        camera.position.set(cameraRelativePos.x, cameraRelativePos.y, cameraRelativePos.z)
    }
}
