import * as THREE from 'three/build/three.module';
import { gsap } from "gsap";
import createTargetHud from '../objects/targetHud';
import { volcanic1, dry1, gasGiant1, moon1GasGiant, moon2GasGiant, primordial1, savannah1 } from '../objects/planets';

export default function focusBody(camera, body, {focusShader}, scene, renderer, nextBody){
    const { camTargetObj } = camera.userData;
    // let { camTargetOrbitalSystem } = camera.userData;
    const tl = gsap.timeline();

    // scene.traverseVisible(child => {
    //     if(child.name === 'holoRing1' || child.name === 'holoRing2' || child.name === 'holoRing3'){
    //         child.geometry.dispose();
    //         child.material.dispose();
    //         console.log("Disposed of holo-ring geometry and material");
    //     }
    // })

    
    
    tl.to(camTargetObj.position, {x: body.position.x, y: body.position.y, z: body.position.z, duration: 1, ease: "power2.inOut", onStart: function(){
        console.log("camTargetOrbitalSystem", camera.userData.camTargetOrbitalSystem);

        camera.userData.insertCamTargetIntoOrbit(body.parent);

        console.log("camTargetOrbitalSystem", camera.userData.camTargetOrbitalSystem);

        // Push all the children of current camera target body into its orbital system array, so we can find out if other modies are its moons
        // BUT only do it if it's not already in any potentially previously existing orbital system array
        if(camera.userData.camTargetBody && camera.userData.camTargetBody.name !== 'sun' && !camera.userData.camTargetOrbitalSystem.includes(camera.userData.camTargetBody.id)){ // Optional chaining still unsuported by webpack
            camera.userData.camTargetBody.traverse(child => {
                console.log("Traversing", camera.userData.camTargetBody.name);
                console.log("Children of", camera.userData.camTargetBody.name, "Found:", child)
                camera.userData.camTargetOrbitalSystem.push(child.id);
            });
        }
        console.log("camTargetBody:", camera.userData.camTargetBody);
        console.log("body:", body);
        console.log("camTargetOrbitalSystem", camera.userData.camTargetOrbitalSystem);
        camera.userData.camTargetOrbitalSystem.forEach(id => {
            console.log("object in orbital array:", scene.getObjectById(id));
        })
        console.log("Orbital system includes current body:", camera.userData.camTargetOrbitalSystem.includes(body.id));
    },
    onComplete: function(){
        // console.log("cam target pos arrived at", body.name, camTargetObj.position)

        if(camera.userData.camTargetBody){
            // Make previous body invisible again and delete the holo rings (targetHud)
            // Delete the rings. We'll have to recreate them for every target because of the radius
            let ids = [];
            camera.userData.camTargetBody.traverse(child => {
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
        }
        
        // Make sure the rings are no longer in the scene (just debug)
        scene.traverse(child => {
            if(child.name === 'holoRing1' || child.name === 'holoRing2' || child.name === 'holoRing3'){
                console.log("Holo-rings still in scene:");
                console.log(child)
            }
        })
                
        
    }})
    .to(camera, {fov:10, duration: 1, ease: "back.inOut(1)", onUpdate: function(){
        camera.updateProjectionMatrix();
        },
        onStart: function(){
            // if(body.userData.isMoon){
            //     // Parent is orbit, orbit's parent is planet. Planet needs to be visible in order for the moon to inherit the property.
            //     body.parent.parent.visible = true;
            // } else {
            //     body.visible = true;
            // }

            // Make body and moons visible as soon as zoom in starts
            body.visible = true;
            body.traverse(child => {
                child.visible = true;
            })
        },
        onComplete: function(){

        }
    }, '-=1')
    .to(focusShader.uniforms['sampleDistance'], {value:20.0, duration: 1, repeat: 1, yoyo: true, onUpdate: function(){
        // camera.updateProjectionMatrix();
        },
        onComplete: function(){
            createTargetHud(body);

            // // Make previous body invisible again; If the current body is in the camTargetOrbitalSystem array, leave it visible
            // if(camera.userData.camTargetBody && camera.userData.camTargetBody.name !== 'sun' && !camTargetOrbitalSystem.includes(body.id)){
            //     camera.userData.camTargetBody.visible = false;
            // } else {
            //     camTargetOrbitalSystem = body;
            // }

            // Make previous body invisible again; If the current body is in the camTargetOrbitalSystem array, leave it visible
            if(camera.userData.camTargetBody && camera.userData.camTargetBody.name !== 'sun' && !camera.userData.camTargetOrbitalSystem.includes(body.id)){
                // We're in a new orbital system - make every object in the existing array invisible and clear the orbital system array
                camera.userData.camTargetOrbitalSystem.forEach(id => {
                    // Some ids might be holo-rings that have already been deleted, or some other non-existent junk
                    const object = scene.getObjectById(id);
                    if(object){
                        object.visible = false;
                    }
                });
                console.log("Clearing orbital system")
                camera.userData.camTargetOrbitalSystem = [];
                console.log("Orbital system after clearing", camera.userData.camTargetOrbitalSystem);
            }

            camera.userData.camTargetBody = body;

            // console.log(camera.userData.camTargetBody)
        }
    }, '-=0.7')
    .to(camera, {fov:90, duration: 1, ease: "back.inOut(1)", delay: 4,
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

            


            console.log("camTargetOrbitalSystem", camera.userData.camTargetOrbitalSystem);
            
            camera.userData.insertCamTargetIntoOrbit(nextBody.parent);
            
            console.log("camTargetOrbitalSystem", camera.userData.camTargetOrbitalSystem);
            // console.log(nextBody.parent)
            // camera.userData.insertCamIntoOrbit(camera, dry1.parent);
            
            // scene.traverse(child => {
            //     if(child.name === 'holoRing1' || child.name === 'holoRing2' || child.name === 'holoRing3'){
            //         console.log("Holo-rings still in scene:");
            //         console.log(child)
            //     }
            // })

            

        }
    })

    return tl;
}
