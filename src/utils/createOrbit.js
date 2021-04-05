import * as THREE from 'three/build/three.module';

export default function createOrbit(object3dCenter, planet, orbitalDistX, orbitalInclination){
    const orbit = new THREE.Object3D();
    object3dCenter.add(orbit);
    orbit.add(planet);
    planet.position.x = orbitalDistX;
    orbit.rotateX(orbitalInclination);

    return orbit;
}