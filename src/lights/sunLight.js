import * as THREE from 'three/build/three.module';

const color = 0x554433;
const intensity = 5;
const distance = 200;
const sunLight = new THREE.PointLight(color, intensity, distance);
sunLight.position.set(0,0,0);

export default sunLight;