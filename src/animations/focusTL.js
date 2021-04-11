import * as THREE from 'three/build/three.module';
import { gsap } from "gsap";

export default function focusBody(camera, body, {focusShader}){
    const { camTargetObj, insertCamTargetIntoOrbit, removeCamTargetFromOrbit, insertCamIntoOrbit, removeCamFromOrbit } = camera.userData;
    const tl = new gsap.timeline();

    camera.userData.insertCamTargetIntoOrbit(body.parent);

    tl.to(camTargetObj.position, {x: body.position.x, y: body.position.y, z: body.position.z, duration: 4, delay: 1, ease: "elastic.out(1,1)"})
    .to(camera, {fov:5, duration: 2, ease: "elastic.out(0.8,1)", curviness: 0, onUpdate: function(){
        camera.updateProjectionMatrix();
        }
    }, '<2')
    .to(focusShader.uniforms['sampleDistance'], {value:20.0, duration: 0.5, repeat: 1, yoyo: true, onUpdate: function(){
        // camera.updateProjectionMatrix();
        }
    }, '-=1.5')
    

    return tl;
}
