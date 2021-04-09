import * as THREE from 'three/build/three.module';
import { gsap } from "gsap";
import { CameraHelper } from "three";
import { volcanic1, dry1, gasGiant1, moon1GasGiant, moon2GasGiant, primordial1, savannah1 } from '../objects/planets';
import sun from '../objects/sun';

export default function animateCamera(camera){
    const tl = gsap.timeline();
    
    let cameraWorldPos = new THREE.Vector3();
    let sunWorldPos = new THREE.Vector3();
    let volcanic1OrbitWorldPos = new THREE.Vector3();
    let volcanic1WorldPos = new THREE.Vector3();
    let dry1OrbitWorldPos = new THREE.Vector3();
    let dry1WorldPos = new THREE.Vector3();
    let primordial1OrbitWorldPos = new THREE.Vector3();
    let primordial1WorldPos = new THREE.Vector3();
    let gasGiant1OrbitWorldPos = new THREE.Vector3();
    let gasGiant1WorldPos = new THREE.Vector3();
    
    camera.getWorldPosition(cameraWorldPos);
    sun.getWorldPosition(sunWorldPos);
    volcanic1.parent.getWorldPosition(volcanic1OrbitWorldPos);
    volcanic1.getWorldPosition(volcanic1WorldPos);
    dry1.parent.getWorldPosition(dry1OrbitWorldPos);
    dry1.getWorldPosition(dry1WorldPos);
    primordial1.parent.getWorldPosition(primordial1OrbitWorldPos);
    primordial1.getWorldPosition(primordial1WorldPos);
    gasGiant1.parent.getWorldPosition(gasGiant1OrbitWorldPos);
    gasGiant1.getWorldPosition(gasGiant1WorldPos);

    tl.progress(0);
    console.log(camera);
    const testVec = new THREE.Vector3(0,0,0)
    tl.to(camera.userData.camTargetWorldPos, {x: gasGiant1WorldPos.x, y: gasGiant1WorldPos.y, z: gasGiant1WorldPos.z, duration: 3, delay: 1, onUpdate: function(){
        // camera.userData.camTargetWorldPos.lerp(gasGiant1WorldPos, tl.progress());
        // camera.userData.updateCamTargetWorldPos();
        gasGiant1.getWorldPosition(gasGiant1WorldPos);

        console.log(tl.progress());
        console.log(camera.userData.camTargetWorldPos);
        console.log(gasGiant1WorldPos);
        // console.log(camera.position);
    }, onComplete: function(){
        camera.userData.setCamTargetObj(gasGiant1);

    }})
    .to(camera.userData.camTargetWorldPos, {x: volcanic1WorldPos.x, y: volcanic1WorldPos.y, z: volcanic1WorldPos.z, duration: 3, delay: 1, onUpdate: () => {
        // camera.userData.camTargetWorldPos.lerp(volcanic1WorldPos, tl.progress());
        // volcanic1.getWorldPosition(volcanic1WorldPos);

        console.log(tl.progress());
        console.log(camera.userData.camTargetWorldPos);
        console.log(volcanic1WorldPos);
        // console.log(camera.position);
    }, onComplete: function(){
        camera.userData.setCamTargetObj(volcanic1);

    }});

}