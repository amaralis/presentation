import { gsap } from "gsap";
import createTargetHud from '../objects/targetHud';

export default function moveCamera(camera, body, nextBody){
    const tl = gsap.timeline();

    tl.to(camera, {fov:90, duration: 1, ease: "back.inOut(1)", delay: 0,
        onStart: function(){
            camera.userData.insertCamIntoOrbit(camera, body.parent);
        },
        onUpdate: function(){
            camera.updateProjectionMatrix();
        },
        onComplete: function(){
        }
    })
    .to()
}