import * as THREE from 'three/build/three.module';
import { gsap } from "gsap";

export default function focusBody(camera, body){
    const { camTargetObj, insertCamTargetIntoOrbit } = camera.userData;
    const tl = new gsap.timeline();

    // tl.to(camera.user)
}
