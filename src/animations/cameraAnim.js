import { gsap } from "gsap";
import { CameraHelper } from "three";
import { volcanic1, dry1, gasGiant1, moon1GasGiant, moon2GasGiant, primordial1, savannah1 } from '../objects/planets';

export default function animateCamera(camera){
    // gsap.to(camera.position, {x: primordial1.position.x, y: primordial1.position.y, z: primordial1.position.z + 5, duration: 10});
    gsap.to(camera.position, {x: primordial1.position.x, y: primordial1.position.y, z: primordial1.position.z + 5, duration: 10, onUpdate: () => {
        camera.lookAt(primordial1.position.x, primordial1.position.y, primordial1.position.z);
    }});
}