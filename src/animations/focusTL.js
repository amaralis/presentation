import * as THREE from 'three/build/three.module';
import { gsap } from "gsap";
import createTargetHud from '../objects/targetHud';

export default function focusBody(camera, body, {focusShader}, scene, renderer){
    const { camTargetObj } = camera.userData;
    const tl = gsap.timeline();

    // scene.traverseVisible(child => {
    //     if(child.name === 'holoRing1' || child.name === 'holoRing2' || child.name === 'holoRing3'){
    //         child.geometry.dispose();
    //         child.material.dispose();
    //         console.log("Disposed of holo-ring geometry and material");
    //     }
    // })

    
    tl.to(camTargetObj.position, {x: body.position.x, y: body.position.y, z: body.position.z, duration: 3, delay: 1, ease: "power2.inOut", onStart: function(){
        camera.userData.insertCamTargetIntoOrbit(body.parent);
    },
    onComplete: function(){
        
    }})
    .to(camera, {fov:5, duration: 2, ease: "back.inOut(1)", onUpdate: function(){
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
    .to(camera, {fov:20, duration: 2, ease: "back.inOut(1)", delay: 4,
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
            // Delete the rings. We'll have to recreate them for every target because of the radius
            let ids = [];
            scene.traverseVisible(child => {
                if(child.name === 'holoRing1' || child.name === 'holoRing2' || child.name === 'holoRing3'){                    
                    ids.push(child.id)
                    console.log(child)
                    console.log("Disposed of holo-ring geometry and material");
                }
            })
            
            ids.forEach(id => {
                const object = scene.getObjectById(id);
                object.geometry.dispose();
                object.material.dispose();
                object.parent.remove(object);
            })
            // renderer.renderLists.dispose()
            
            // Make sure the rings are no longer in the scene
            // scene.traverseVisible(child => {
            //     if(child.name === 'holoRing1' || child.name === 'holoRing2' || child.name === 'holoRing3'){
            //         console.log("Holo-rings still in scene:");
            //         console.log(child)
            //     }
            // })

        }
    })
    

    return tl;
}
