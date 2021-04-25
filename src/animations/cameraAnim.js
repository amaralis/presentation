import * as THREE from 'three/build/three.module';
import { gsap } from "gsap";
import { CameraHelper } from "three";
import disposeOfObjects from '../utils/disposeOfObjects';
import { volcanic1, dry1, gasGiant1, moon1GasGiant, moon2GasGiant, primordial1, savannah1 } from '../objects/planets';
import sun from '../objects/sun';

import focusBody from './focusTL';

export default function animateCamera(camera, shaders, scene, renderer, prevBody){

    const tl0 = focusBody(camera, prevBody, {focusShader: shaders.focusShader}, scene, renderer, volcanic1);
    const tl1 = focusBody(camera, volcanic1, {focusShader: shaders.focusShader}, scene, renderer, dry1);
    const tl2 = focusBody(camera, dry1, {focusShader: shaders.focusShader}, scene, renderer, primordial1);
    const tl3 = focusBody(camera, primordial1, {focusShader: shaders.focusShader}, scene, renderer, savannah1);
    const tl4 = focusBody(camera, savannah1, {focusShader: shaders.focusShader}, scene, renderer, gasGiant1);
    const tl5 = focusBody(camera, gasGiant1, {focusShader: shaders.focusShader}, scene, renderer, moon1GasGiant);
    const tl6 = focusBody(camera, moon1GasGiant, {focusShader: shaders.focusShader}, scene, renderer, moon2GasGiant);
    const tl7 = focusBody(camera, moon2GasGiant, {focusShader: shaders.focusShader}, scene, renderer, sun);

    // Not repeatable with repeat property. animateCamera needs to be called again fresh
    const master = gsap.timeline();


    master.add(tl0)
    .add(tl1)
    .add(tl2)
    .add(tl3)
    .add(tl4)
    .add(tl5)
    .add(tl6)
    .add(tl7).eventCallback('onComplete', function(){
        camera.userData.camTargetOrbitalSystem.forEach(id => {
            // Some ids might be holo-rings that have already been deleted, or some other non-existent junk
            const object = scene.getObjectById(id);
            if(object){
                object.visible = false;
            }

        });
        // console.log("Clearing orbital system")
        camera.userData.camTargetOrbitalSystem = [];

        disposeOfObjects("all", [], scene, renderer);

        // Debug for memory leaks
        scene.traverse(child => {
            if(child.name === 'holoRing1' || child.name === 'holoRing2' || child.name === 'holoRing3'){
                console.log("Holo-rings still in scene:");
                console.log(child)
            }
        })
    });

    return master;
}
