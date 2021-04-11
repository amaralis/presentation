import * as THREE from 'three/build/three.module';

const color = 0xFFFF33;
const distance = 40;
const gasGiantReflectiveLight = new THREE.SpotLight(color, 1, distance, 1.4, 0.1);
gasGiantReflectiveLight.castShadow = true;
gasGiantReflectiveLight.shadow.camera.far = distance;
gasGiantReflectiveLight.shadow.camera.fov = 170
gasGiantReflectiveLight.shadow.mapSize.width = 1000

export default gasGiantReflectiveLight;