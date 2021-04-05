import * as THREE from 'three/build/three.module';

import volcanicTex from '../img/planets/volcanic/volcanic1.png';
import volcanicNormalMap from '../img/planets/volcanic/volcanic1NormalMap.png';
import dryTex from '../img/planets/dry/texDry1.png';
import dryNormalMap from '../img/planets/dry/dryNormalMap.png';
import gasGiantTex from '../img/planets/gasGiant/gasGiant.png';
import moon1GasGiantTex from '../img/planets/rock/rock.png';
import moon1GasGiantNormalMap from '../img/planets/rock/rockNormalMap.png';
import moon2GasGiantTex from '../img/planets/dry/dry2.png';
import moon2GasGiantNormalMap from '../img/planets/dry/dry2NormalMap.png';
import primordial1Tex from '../img/planets/primordial/primordial1.png';
import primordial1NormalMap from '../img/planets/primordial/primordial1NormalMap.png';
import savannah1Tex from '../img/planets/savannah/savannah1.png';
import savannah1NormalMap from '../img/planets/savannah/savannah1NormalMap.png';

const planet1Geo = new THREE.SphereGeometry(0.2, 16, 32);
const planet1Mat = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(volcanicTex),
    normalMap: new THREE.TextureLoader().load(volcanicNormalMap)
});
export const volcanic1 = new THREE.Mesh(planet1Geo, planet1Mat);


const dry1Geo = new THREE.SphereGeometry(1, 16, 32);
const dry1Mat = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(dryTex),
    normalMap: new THREE.TextureLoader().load(dryNormalMap),
});
export const dry1 = new THREE.Mesh(dry1Geo, dry1Mat);


const gasGiant1Geo = new THREE.SphereGeometry(3, 16, 32);
const gasGiant1Mat = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(gasGiantTex)
});
export const gasGiant1 = new THREE.Mesh(gasGiant1Geo, gasGiant1Mat);


const moon1GasGiantGeo = new THREE.SphereGeometry(0.3, 16, 32);
const moon1GasGiantMat = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(moon1GasGiantTex),
    normalMap: new THREE.TextureLoader().load(moon1GasGiantNormalMap)
});
export const moon1GasGiant = new THREE.Mesh(moon1GasGiantGeo, moon1GasGiantMat);


const moon2GasGiantGeo = new THREE.SphereGeometry(0.3, 16, 32);
const moon2GasGiantMat = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(moon2GasGiantTex),
    normalMap: new THREE.TextureLoader().load(moon2GasGiantNormalMap)
});
export const moon2GasGiant = new THREE.Mesh(moon2GasGiantGeo, moon2GasGiantMat);


const primordial1Geo = new THREE.SphereGeometry(1, 16, 32);
const primordial1Mat = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(primordial1Tex),
    normalMap: new THREE.TextureLoader().load(primordial1NormalMap)
});
export const primordial1 = new THREE.Mesh(primordial1Geo, primordial1Mat);


const savannah1Geo = new THREE.SphereGeometry(0.2, 16, 32);
const savannah1Mat = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(savannah1Tex),
    normalMap: new THREE.TextureLoader().load(savannah1NormalMap)
});
export const savannah1 = new THREE.Mesh(savannah1Geo, savannah1Mat);

volcanic1.receiveShadow = true;
volcanic1.castShadow = true;
dry1.receiveShadow = true;
dry1.castShadow = true;
gasGiant1.receiveShadow = true;
gasGiant1.castShadow = true;
moon1GasGiant.receiveShadow = true;
moon1GasGiant.castShadow = true;
moon2GasGiant.receiveShadow = true;
moon2GasGiant.castShadow = true;
primordial1.receiveShadow = true;
primordial1.castShadow = true;
savannah1.receiveShadow = true;
savannah1.castShadow = true;