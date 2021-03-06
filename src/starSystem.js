import * as THREE from 'three/build/three.module';
import animateCamera from './animations/cameraAnim';
import camera from './cameras/introCam';
import createTargetHud from './objects/targetHud';
import { camtarg } from './cameras/introCam';
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
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { FocusShader } from 'three/examples/jsm/shaders/FocusShader';
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
    
    // Scene //
    
    const scene = new THREE.Scene();
    
    // Post processing //
    
    const composer = new EffectComposer(renderer);
    composer.setSize(width, height);
    
    const renderPass = new RenderPass(scene, camera);
    const unrealBloomPass = new UnrealBloomPass({x: width, y: height}, 3.0, 0.8, 0.4);
    const focusShader = new ShaderPass(FocusShader);
    focusShader.uniforms['sampleDistance'].value = 0.0;
    focusShader.uniforms['screenWidth'].value = width;
    focusShader.uniforms['screenHeight'].value = height;
    // const glitchPass = new GlitchPass();
    
    composer.addPass(renderPass);
    composer.addPass(unrealBloomPass);
    composer.addPass(focusShader);
    // composer.addPass(glitchPass);
    
    // Add Object3Ds to scene graph //

    scene.add(camtarg)
    
    scene.add(sun);
    // sun.add( new THREE.GridHelper( 150, 5, 0xFF0000, 0xFF0000 ) );
    sun.add(sunAura);
    const volcanicOrbit = createOrbit(scene, volcanic1, 15, 0.3);
    // volcanicOrbit.add( new THREE.GridHelper( 150, 5, 0xFF0000, 0xFF0000 ) );
    const dryOrbit = createOrbit(scene, dry1, 75, 0.2);
    // dryOrbit.add( new THREE.GridHelper( 150, 5 ) );
    const primordial1Orbit = createOrbit(scene, primordial1, 155, -0.15);
    // primordial1Orbit.add( new THREE.GridHelper( 300, 5 ) );
    const savannah1Orbit = createOrbit(primordial1, savannah1, 10, 0.35);
    // savannah1Orbit.add( new THREE.GridHelper( 300, 5 ) );
    const gasGiantOrbit = createOrbit(scene, gasGiant1, 215, 0.2);
    const moon1GasGiantOrbit = createOrbit(gasGiant1, moon1GasGiant, 20, 0.3);
    const moon2GasGiantOrbit = createOrbit(gasGiant1, moon2GasGiant, 35, -0.2);
    
    const volcanic1Atmo = makeAtmo(volcanic1, 'rgb(189, 0, 0)', 0.5);
    const dry1Atmo = makeAtmo(dry1, 'rgb(181, 145, 25)', 0.5);
    const primordial1Atmo = makeAtmo(primordial1, 'rgb(113, 185, 227)', 0.5);
    const savannah1Atmo = makeAtmo(savannah1, 'rgb(113, 185, 227)', 0.45);
    const gasGiant1Atmo = makeAtmo(gasGiant1, 'rgb(209, 197, 125)', 0.4);
    
    // Light //
    
    scene.add(ambientLight);
    scene.add(sunLight);
    //Set up shadow properties for the sunLight
    sunLight.shadow.mapSize.width = 2048; // default
    sunLight.shadow.mapSize.height = 2048; // default
    sunLight.shadow.camera.near = 15; // default
    sunLight.shadow.camera.far = sunLight.distance; // default
    sunLight.castShadow = true;
    gasGiantOrbit.add(gasGiantReflectiveLight);
    gasGiantReflectiveLight.position.x = gasGiant1.position.x - 3.0;
    gasGiantReflectiveLight.position.y = 0;

    // const shadowHelper = new THREE.CameraHelper(gasGiantReflectiveLight.shadow.camera)
    // scene.add(shadowHelper)
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
    
    requestAnimationFrame(animate);
    
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
    
    // volcanicOrbit.rotateY(0.95);
    // dryOrbit.rotateY(1.7);
    // primordial1Orbit.rotateY(4.5);
    // savannah1Orbit.rotateY(-0.004);
    // gasGiantOrbit.rotateY(5.003);
    // moon1GasGiantOrbit.rotateY(0.03);
    // moon2GasGiantOrbit.rotateY(0.014);
    // moon1GasGiantOrbit.rotateX(0.03);
    // moon2GasGiantOrbit.rotateX(0.014);

    // const targetFx = createTargetHud(dry1);
    // targetFx.ring1.visible = false;
    // targetFx.ring2.visible = false;
    // targetFx.ring3.visible = false;

    
    // animateCamera(camera, {focusShader}, scene, renderer, sun);
    camera.userData.orbit(canvas, camera, sun);
    
    // setTimeout(() => {
    //     animateCamera(camera, {focusShader}, scene, renderer, sun);
        
    // }, 60000);


    function animate(time){ // requestAnimationFrame(callback) passes the time since the page loaded to the callback function
        time *= 0.001; // convert time to seconds
        camera.userData.lookAtTarget();
        sun.material.uniforms.u_Time.value = time;
        sunAura.material.uniforms.u_Time.value = time;

        // Check if renderer needs to be resized and update camera properties //
        
        if(resizeRendererToDisplaySize(renderer)){
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }  
        
        volcanicOrbit.rotation.y += 0.008;
        dryOrbit.rotation.y += 0.006;
        primordial1Orbit.rotation.y += 0.004;
        savannah1Orbit.rotation.y -= 0.003;
        gasGiantOrbit.rotation.y += 0.001;
        moon1GasGiantOrbit.rotation.y += 0.002;
        // moon2GasGiantOrbit.rotation.y += 0.005;

        sun.rotation.y = 0.01;
        volcanic1.rotation.y += 0.01
        dry1.rotation.y += 0.008;
        primordial1.rotation.y += 0.007
        savannah1.rotation.y += 0.01
        gasGiant1.rotation.y += 0.003;
        moon1GasGiant.rotation.y += 0.01
        moon2GasGiant.rotation.y += 0.007
        
        sunAura.lookAt(camera.getWorldPosition(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z)));
        volcanic1Atmo.lookAt(camera.getWorldPosition(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z)));
        dry1Atmo.lookAt(camera.getWorldPosition(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z)));
        primordial1Atmo.lookAt(camera.getWorldPosition(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z)));
        savannah1Atmo.lookAt(camera.getWorldPosition(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z)));
        gasGiant1Atmo.lookAt(camera.getWorldPosition(new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z)));

        // Spin target rings (created and disposed of by gsap)
        if(camera.userData.camTargetBody){
            camera.userData.camTargetBody.traverse(child => {
                if(child.name === 'holoRing1'){
                    child.rotation.z += 0.007;
                }
                if(child.name === 'holoRing2'){
                    child.rotation.z += 0.013;
                }
                if(child.name === 'holoRing3'){
                    child.rotation.x -= 0.01;
                    child.rotation.z += 0.008;
                }
            });
        }

        // Use renderer if not using composer for postprocessing
        // renderer.render(scene, camera);
        
        requestAnimationFrame(animate);
        composer.render();
    }

}

export default startSolarSystem;