import * as THREE from 'three/build/three.module';


export default function createTargetHud(body){
    const geometry1 = new THREE.CylinderGeometry( body.geometry.parameters.radius * 0.5, body.geometry.parameters.radius * 0.5, 0.3, 30, 1, true );
    const geometry2 = new THREE.CylinderGeometry( body.geometry.parameters.radius * 0.5, body.geometry.parameters.radius * 0.5, 0.3, 30, 1, true );
    const geometry3 = new THREE.CylinderGeometry( body.geometry.parameters.radius * 0.5, body.geometry.parameters.radius * 0.5, 0.3, 30, 1, true );
    const material1 = new THREE.MeshBasicMaterial( { color: new THREE.Color("rgb(67, 52, 235)"), side: THREE.DoubleSide, transparent: true, opacity: 0.5, depthWrite: false } );
    const ring1 = new THREE.Mesh( geometry1, material1 );
    const ring2 = new THREE.Mesh( geometry2, material1 );
    const ring3 = new THREE.Mesh( geometry3, material1 );
    body.add(ring1)
    body.add(ring2)
    body.add(ring3)

    return {ring1, ring2, ring3};
    // return ring1;
}