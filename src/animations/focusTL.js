import * as THREE from 'three/build/three.module';
import { gsap } from "gsap";
import createTargetHud from '../objects/targetHud';

export default function focusBody(camera, body, {focusShader}, targetFx){
    const { camTargetObj } = camera.userData;
    const tl = new gsap.timeline();

    camera.userData.insertCamTargetIntoOrbit(body.parent);

    tl.to(camTargetObj.position, {x: body.position.x, y: body.position.y, z: body.position.z, duration: 4, delay: 1, /*ease: "elastic.out(1,1)",*/ onStart: function(){
        body.add(targetFx.ring1);
        body.add(targetFx.ring2);
        body.add(targetFx.ring3);
        targetFx.ring1.visible = true;
        targetFx.ring2.visible = true;
        targetFx.ring3.visible = true;
    },
    onComplete: function(){
    }})
    .to(camera, {fov:20, duration: 2, ease: "elastic.out(0.8,1)", onUpdate: function(){
        camera.updateProjectionMatrix();
        },
        onStart: function(){
            body.visible = true;
        }
    }, '<0.5')
    .to(focusShader.uniforms['sampleDistance'], {value:20.0, duration: 0.5, repeat: 1, yoyo: true, onUpdate: function(){
        // camera.updateProjectionMatrix();
        },
        onComplete: function(){
        }
    }, '<0.5')
    

    return tl;
}
