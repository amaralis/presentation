import * as THREE from 'three/build/three.module';

const color = 0x554433;
const intensity = 2;
const distance = 500;
const sunLight = new THREE.PointLight(color, intensity, distance);
sunLight.position.set(0,0,0);

export default sunLight;