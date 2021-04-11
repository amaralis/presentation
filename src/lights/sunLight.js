import * as THREE from 'three/build/three.module';

const color = 0x554433;
const intensity = 4;
const distance = 250;
const sunLight = new THREE.PointLight(color, intensity, distance);
sunLight.position.set(0,0,0);

export default sunLight;