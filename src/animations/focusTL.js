import * as THREE from 'three/build/three.module';
import { gsap } from "gsap";
import createTargetHud from '../objects/targetHud';
import { volcanic1, dry1, gasGiant1, moon1GasGiant, moon2GasGiant, primordial1, savannah1 } from '../objects/planets';

export default function focusBody(camera, body, {focusShader}, scene, renderer, nextBody){
    const tl = gsap.timeline();    
    
    tl.to(camera.userData.camTargetObj.position, {x: body.position.x, y: body.position.y, z: body.position.z, duration: 1, ease: "power2.inOut", onStart: function(){
        // console.log("camTargetOrbitalSystem", camera.userData.camTargetOrbitalSystem);
        camera.userData.insertCamTargetIntoOrbit(body.parent);
        camera.userData.pushBodyIntoOrbitalSystem();
    },
    onComplete: function(){
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
                // console.log("disposing of ring");
            })
            renderer.renderLists.dispose()
        }
        
        // Make sure the rings are no longer in the scene (just debug)
        scene.traverse(child => {
            if(child.name === 'holoRing1' || child.name === 'holoRing2' || child.name === 'holoRing3'){
                console.log("Holo-rings still in scene:");
                console.log(child)
            }
        });
    }})
    .to(camera, {fov:10, duration: 1, ease: "back.inOut(1)", onUpdate: function(){
        camera.updateProjectionMatrix();
        },
        onStart: function(){
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
        },
        onComplete: function(){
            createTargetHud(body);

            // Make previous body invisible again; If the current body is in the camTargetOrbitalSystem array, leave it visible
            if(camera.userData.camTargetBody && camera.userData.camTargetBody.name !== 'sun' && !camera.userData.camTargetOrbitalSystem.includes(body.id)){
                camera.userData.clearOrbitalSystem(scene);
            }

            camera.userData.camTargetBody = body;
        }
    }, '-=0.7')
    .to(camera, {fov:90, duration: 1, ease: "back.inOut(1)", delay: 3,
        onStart: function(){
        },
        onUpdate: function(){
            camera.updateProjectionMatrix();
        },
        onComplete: function(){
            // console.log("camTargetOrbitalSystem", camera.userData.camTargetOrbitalSystem);
            
            camera.userData.insertCamTargetIntoOrbit(nextBody.parent);
            
            // // Debug for memory leaks
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
