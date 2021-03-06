import * as THREE from 'three/build/three.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const helperGeo = new THREE.SphereGeometry(0.9, 3, 3);
const helperMat = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
export const camtarg = new THREE.Mesh(helperGeo, helperMat);
    

const fov = 90; // vertical, in degrees
const aspect = 2;
const near= 5;
const far = 5000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.x = 0;
camera.position.y = 50;
camera.position.z = 50;
camera.userData = {
    camTargetBody: undefined,
    camTargetOrbitalSystem: [],
    camTargetObj: new THREE.Object3D(),
    // camTargetObj: camtarg,
    camTargetRelativePos: new THREE.Vector3(0,0,0),
    camRelativePos: new THREE.Vector3(),
    clearOrbitalSystem: function(scene){
        this.camTargetOrbitalSystem.forEach(id => {
            // Some ids might be holo-rings that have already been deleted, or some other non-existent junk - store the gotten object in a variable first
            const object = scene.getObjectById(id);
            if(object){
                object.visible = false;
            }
        });
        // console.log("Clearing orbital system")
        this.camTargetOrbitalSystem = [];
        // console.log("Orbital system after clearing", camera.userData.camTargetOrbitalSystem);
    },
    pushBodyIntoOrbitalSystem: function(){
        if(this.camTargetBody && this.camTargetBody.name !== 'sun' && !this.camTargetOrbitalSystem.includes(this.camTargetBody.id)){ // Optional chaining still unsuported by webpack
            this.camTargetBody.traverse(child => {
                // console.log("Traversing", this.camTargetBody.name);
                // console.log("Children of", this.camTargetBody.name, "Found:", child)
                this.camTargetOrbitalSystem.push(child.id);
            });
        }
    },
    // camTest: new THREE.Vector3(),
    setCamTargetPos: function(position){
        this.camTargetObj.position.set(position.x, position.y, position.z);
    },
    setCamPos: function(camera, position){
        camera.position.set(position.x, position.y, position.z);
    },
    insertCamTargetIntoOrbit: function(newOrbit){
        // Set camTargetRelativePos to be camTargetObj's world position
        this.camTargetObj.getWorldPosition(this.camTargetRelativePos);
        // console.log('camTargetObj.position:', this.camTargetObj.position)
        // console.log('camTarget relative pos:', this.camTargetRelativePos)
        
        // Convert camTargetRelativePos, which is currently the camera target's world position, to the local coordinate space of newOrbit
        newOrbit.worldToLocal(this.camTargetRelativePos);
        // console.log('camTargetObj.position:', this.camTargetObj.position)
        // console.log('camTarget relative pos:', this.camTargetRelativePos)
        
        // Make camTargetObj a child of newOrbit
        this.camTargetObj.parent = newOrbit;
        // console.log('camTargetObj.position:', this.camTargetObj.position)
        // console.log('camTarget relative pos:', this.camTargetRelativePos)
        
        // Set camTargetObj's pos to be in newOrbit's coordinate space (relativePos was put there when we called newOrbit.worldToLocal)
        this.camTargetObj.position.set(this.camTargetRelativePos.x, this.camTargetRelativePos.y, this.camTargetRelativePos.z)
        // console.log('camTargetObj.position:', this.camTargetObj.position)
        // console.log('camTarget relative pos:', this.camTargetRelativePos)
        
    },
    removeCamTargetFromOrbit: function(){
        this.camTargetObj.getWorldPosition(this.camTargetRelativePos);
        this.camTargetObj.parent = null;
        this.camTargetObj.position.set(this.camTargetRelativePos.x, this.camTargetRelativePos.y, this.camTargetRelativePos.z)
    },
    insertCamIntoOrbit: function(camera, newOrbit){
        // Set camRelativePos to be the camera's world position
        camera.getWorldPosition(this.camRelativePos);
        // Convert camRelativePos, which is currently the camera's world position, to the local coordinate space of newOrbit
        newOrbit.worldToLocal(this.camRelativePos);
        // Set the camera's parent to be newOrbit, so the camera inherits all transforms from it (like rotation)
        camera.parent = newOrbit;
        // Set the camera's position (which is now in a new parent's coordinate space) to be the same as it was when it was in the world's coordinate space
        camera.position.set(this.camRelativePos.x, this.camRelativePos.y, this.camRelativePos.z)
    },
    removeCamFromOrbit: function(camera){
        camera.getWorldPosition(this.camRelativePos);
        camera.parent = null;
        camera.position.set(this.camRelativePos.x, this.camRelativePos.y, this.camRelativePos.z)
    },
    orbit: function(canvas, camera, body){
        this.insertCamIntoOrbit(camera, body.parent);
        this.insertCamTargetIntoOrbit(body.parent);
        this.setCamTargetPos({x:body.position.x, y:body.position.y, z:body.position.z});
        this.setCamPos(camera, {x:body.position.x - 10, y:body.position.y, z:body.position.z});
        // Camera orbit controls    
        const controls = new OrbitControls(camera, canvas);
        controls.target.set(body.position.x, body.position.y, body.position.z);
        controls.update();
    },
    lookAtTarget: function(){
        const targetPosition = new THREE.Vector3();
        this.camTargetObj.getWorldPosition(targetPosition);
        camera.lookAt(targetPosition);
    }
}

export default camera;