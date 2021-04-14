import * as THREE from 'three/build/three.module';
import { gsap } from "gsap";
import createTargetHud from '../objects/targetHud';
import { volcanic1, dry1, gasGiant1, moon1GasGiant, moon2GasGiant, primordial1, savannah1 } from '../objects/planets';

export default function focusBody(camera, body, {focusShader}, scene, renderer, nextBody){
    const { camTargetObj } = camera.userData;
    const tl = gsap.timeline();

    // scene.traverseVisible(child => {
    //     if(child.name === 'holoRing1' || child.name === 'holoRing2' || child.name === 'holoRing3'){
    //         child.geometry.dispose();
    //         child.material.dispose();
    //         console.log("Disposed of holo-ring geometry and material");
    //     }
    // })
    
    tl.to(camTargetObj.position, {x: body.position.x, y: body.position.y, z: body.position.z, duration: 1, ease: "power2.inOut", onStart: function(){
        camera.userData.insertCamTargetIntoOrbit(body.parent);
        // console.log("cam target pos going to", body.name, camTargetObj.position)
    },
    onComplete: function(){
        // console.log("cam target pos arrived at", body.name, camTargetObj.position)

        // Make previous body invisible again and delete the holo rings (targetHud)
        if(body){
            // Delete the rings. We'll have to recreate them for every target because of the radius
            let ids = [];
            scene.traverseVisible(child => {
                if(child.name === 'holoRing1' || child.name === 'holoRing2' || child.name === 'holoRing3'){                    
                    ids.push(child.id)
                }
            })
            
            ids.forEach(id => {
                const object = scene.getObjectById(id);
                object.geometry.dispose();
                object.material.dispose();
                object.parent.remove(object);
            })
            renderer.renderLists.dispose()
            
            // Make sure the rings are no longer in the scene
            // scene.traverseVisible(child => {
            //     if(child.name === 'holoRing1' || child.name === 'holoRing2' || child.name === 'holoRing3'){
            //         console.log("Holo-rings still in scene:");
            //         console.log(child)
            //     }
            // })
                    
            // Make previous body invisible again
            // body.visible = false;
        }
    }})
    .to(camera, {fov:10, duration: 1, ease: "back.inOut(1)", onUpdate: function(){
        camera.updateProjectionMatrix();
        },
        onStart: function(){
            if(body.userData.isMoon){
                // Parent is orbit, orbit's parent is planet. Planet needs to be visible in order for the moon to inherit the property.
                body.parent.parent.visible = true;
            } else {
                body.visible = true;
            }
        },
        onComplete: function(){

        }
    }, '-=1')
    .to(focusShader.uniforms['sampleDistance'], {value:20.0, duration: 1, repeat: 1, yoyo: true, onUpdate: function(){
        // camera.updateProjectionMatrix();
        },
        onComplete: function(){
            createTargetHud(body);
        }
    }, '-=0.7')
    .to(camera, {fov:75, duration: 1, ease: "back.inOut(1)", delay: 4,
        onUpdate: function(){
            camera.updateProjectionMatrix();
        },
        onStart: function(){
            // if(body.userData.isMoon){
            //     // Parent is orbit, orbit's parent is planet. Planet needs to be visible in order for the moon to inherit the property.
            //     body.parent.parent.visible = true;
            // } else {
            //     body.visible = true;
            // }
        },
        onComplete: function(){
            // camera.userData.removeCamTargetFromOrbit();
            // console.log("position at animation complete:", camera.userData.camTargetObj.position);
            // console.log("relative position at animation complete:", camera.userData.camTargetRelativePos);

            // camera.userData.insertCamTargetIntoOrbit(primordial1.parent);
            // gsap.to(camTargetObj.position, {x: primordial1.position.x, y: primordial1.position.y, z: primordial1.position.z, duration: 2, delay: 2, 
            //     onComplete: function(){
            //         // camera.userData.removeCamTargetFromOrbit();

            //         camera.userData.insertCamTargetIntoOrbit(volcanic1.parent);
            //         gsap.to(camTargetObj.position, {x: volcanic1.position.x, y: volcanic1.position.y, z: volcanic1.position.z, duration: 2, delay: 6})
            //     }
            // })

            // if(nextBody){
            //     focusBody(camera, nextBody, {focusShader}, scene, renderer, body)
            // }
            
            camera.userData.insertCamTargetIntoOrbit(nextBody.parent);
            console.log(nextBody.parent)
            // camera.userData.insertCamIntoOrbit(camera, dry1.parent);
            
            scene.traverse(child => {
                if(child.name === 'holoRing1' || child.name === 'holoRing2' || child.name === 'holoRing3'){
                    console.log("Holo-rings still in scene:");
                    console.log(child)
                }
            })
        }
    })

    return tl;
}
