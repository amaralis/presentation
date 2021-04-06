import * as THREE from 'three/build/three.module';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import sun from './objects/sun';
import { volcanic1, dry1, gasGiant1, moon1GasGiant, moon2GasGiant, primordial1, savannah1 } from './objects/planets';
import createOrbit from './utils/createOrbit';
import sunAura from './objects/sunAura';
import makeAtmo from './objects/atmo';

import sunLight from './lights/sunLight';
import gasGiantReflectiveLight from './lights/gasGiantReflectiveLight';
import ambientLight from './lights/ambientLight';


import posX from './img/skybox/px.png';
import negX from './img/skybox/nx.png';
import posY from './img/skybox/py.png';
import negY from './img/skybox/ny.png';
import posZ from './img/skybox/pz.png';
import negZ from './img/skybox/nz.png';

// !!! Import ONLY WHAT IS NEEDED from external libraries. Plenty of broken stuff

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
// import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';

function startSolarSystem(){
    
    // Canvas //
    
    const canvas = document.createElement('canvas');
    document.body.appendChild( canvas );
    canvas.style.width = '100%';
    canvas.style.height = '100vh';
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    // const resolution = width / height;
    
    // Renderer //
    
    // const renderer = new THREE.WebGLRenderer({canvas});
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    
    // Camera //
    
    const fov = 75; // vertical, in degrees
    const aspect = 2;
    const near= 0.01;
    const far = 500;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 20;
    
    // Scene //
    
    const scene = new THREE.Scene();
    
    // Post processing //
    
    const composer = new EffectComposer(renderer);
    composer.setSize(width, height);
    
    const renderPass = new RenderPass(scene, camera);
    const unrealBloomPass = new UnrealBloomPass({x: width, y: height}, 2.0, 1.0, 0.29);
    // const glitchPass = new GlitchPass();
    
    composer.addPass(renderPass);
    composer.addPass(unrealBloomPass);
    // composer.addPass(glitchPass);
    
    // Add Object3Ds to scene graph //
    
    scene.add(sun);
    sun.add(sunAura);
    const volcanicOrbit = createOrbit(scene, volcanic1, 15, 0.3);
    const dryOrbit = createOrbit(scene, dry1, 45, 0.2);
    const primordial1Orbit = createOrbit(scene, primordial1, 95, -0.15);
    const savannah1Orbit = createOrbit(primordial1, savannah1, 10, 0.35);
    const gasGiantOrbit = createOrbit(scene, gasGiant1, 160, 0.2);
    const moon1GasGiantOrbit = createOrbit(gasGiant1, moon1GasGiant, 12, 0.3);
    const moon2GasGiantOrbit = createOrbit(gasGiant1, moon2GasGiant, 25, -0.2);
    
    const volcanic1Atmo = makeAtmo(volcanic1, 'rgb(189, 0, 0)', 0.5);
    const dry1Atmo = makeAtmo(dry1, 'rgb(181, 145, 25)', 0.5);
    const primordial1Atmo = makeAtmo(primordial1, 'rgb(113, 185, 227)', 0.5);
    const savannah1Atmo = makeAtmo(savannah1, 'rgb(113, 185, 227)', 0.45);
    const gasGiant1Atmo = makeAtmo(gasGiant1, 'rgb(113, 130, 248)', 0.5);
    
    // Light //
    
    scene.add(ambientLight);
    
    //Set up shadow properties for the light
    sunLight.shadow.mapSize.width = 2048; // default
    sunLight.shadow.mapSize.height = 2048; // default
    sunLight.shadow.camera.near = 15; // default
    sunLight.shadow.camera.far = 200; // default
    
    
    scene.add(sunLight);
    gasGiantOrbit.add(gasGiantReflectiveLight);
    gasGiantReflectiveLight.position.x = gasGiant1.position.x - 3.0;
    gasGiantReflectiveLight.position.y = 0;
    // const shadowHelper = new THREE.CameraHelper(gasGiantReflectiveLight.shadow.camera)
    // scene.add(shadowHelper)
    
    sunLight.castShadow = true;
    
    // const spotLightHelper = new THREE.SpotLightHelper( gasGiantReflectiveLight );
    // scene.add( spotLightHelper );
    
    // Skybox //
    
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
    posX,
    negX,
    posY,
    negY,
    posZ,
    negZ,
    ]);
    scene.background = texture;
    
    
    // Render scene //
    
    renderer.render(scene, camera);
    
    // Animate //
    
    requestAnimationFrame(render);
    
    // Make canvas responsive //
    
    function resizeRendererToDisplaySize(renderer){
        const canvas = renderer.domElement;
        
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
    
        const needResize = canvas.width !== width || canvas.height !== height;
    
        if(needResize){
            renderer.setSize(width, height, false);
            renderer.setPixelRatio(window.devicePixelRatio);
        }
    
        return needResize;
    }
    
    volcanicOrbit.rotateY(0.95);
    dryOrbit.rotateY(1.7);
    primordial1Orbit.rotateY(4.5);
    savannah1Orbit.rotateY(-0.004);
    gasGiantOrbit.rotateY(5.003);
    moon1GasGiantOrbit.rotateY(0.03);
    moon2GasGiantOrbit.rotateY(0.014);
    moon1GasGiantOrbit.rotateX(0.03);
    moon2GasGiantOrbit.rotateX(0.014);
    
    function render(time){ // requestAnimationFrame(callback) passes the time since the page loaded to the callback function
        time *= 0.001; // convert time to seconds
        sun.material.uniforms.u_Time.value = time;
        sunAura.material.uniforms.u_Time.value = time;
    
        // Check if renderer needs to be resized and update camera properties //
        
        if(resizeRendererToDisplaySize(renderer)){
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }  
        
        moon1GasGiantOrbit.rotation.y += 0.03;
        moon2GasGiantOrbit.rotation.y += 0.005;
        
        
        sun.rotation.y = 0.01;
        volcanic1.rotation.y += 0.01
        dry1.rotation.y += 0.008;
        primordial1.rotation.y += 0.02
        savannah1.rotation.y += 0.01
        gasGiant1.rotation.y += 0.01;
        moon1GasGiant.rotation.y += 0.01
        moon2GasGiant.rotation.y += 0.08
        
        sunAura.lookAt(camera.getWorldPosition(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z)));
        volcanic1Atmo.lookAt(camera.getWorldPosition(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z)));
        dry1Atmo.lookAt(camera.getWorldPosition(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z)));
        primordial1Atmo.lookAt(camera.getWorldPosition(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z)));
        savannah1Atmo.lookAt(camera.getWorldPosition(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z)));
        gasGiant1Atmo.lookAt(camera.getWorldPosition(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z)));
    
        // Use renderer if not using composer for postprocessing
        // renderer.render(scene, camera);
        
        requestAnimationFrame(render);
        composer.render();
    }
    
    // Camera orbit controls
    
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0,0,0);
    controls.update();

}

export default startSolarSystem;