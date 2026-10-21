"use client";

import {useEffect,useRef,type RefObject} from 'react';
import type * as THREE from 'three';
import type {EngineSelection} from './EngineStudy';

export type SceneAPI={
  wire:(value:boolean)=>void;pause:(value:boolean)=>void;reset:()=>void;brake:(value:boolean)=>void;cutaway:(value:boolean)=>void;
  explode:(amount:number)=>void;speed:(speed:number)=>void;angle:(degrees:number)=>void;select:(selection:EngineSelection|null)=>void;readAngle:()=>number;
};
type SceneOptions={
  study:boolean;initialAngle:number;initialBrake:boolean;initialSelection:EngineSelection|null;
  onReady:()=>void;onFailure:()=>void;onPhase:(phase:string)=>void;onPose:(angle:number)=>void;onPause:(paused:boolean)=>void;onPick:(selection:EngineSelection|null)=>void;onCutaway:(enabled:boolean)=>void;
};

export function useEngineScene(host:RefObject<HTMLDivElement|null>,options:SceneOptions){
  const api=useRef<SceneAPI|null>(null);
  const callbacks=useRef(options);
  useEffect(()=>{callbacks.current=options;});
  useEffect(()=>{
    let disposed=false,cleanup=()=>{};
    Promise.all([import('three'),import('three/examples/jsm/controls/OrbitControls.js')]).then(async([T,{OrbitControls}])=>{
      if(disposed||!host.current)return;
      const el=host.current,reduce=matchMedia('(prefers-reduced-motion: reduce)');
      let renderer:THREE.WebGLRenderer|import('./SoftwareEngineRenderer').SoftwareEngineRenderer;
      let software=false;
      try{renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});}
      catch{const {SoftwareEngineRenderer}=await import('./SoftwareEngineRenderer');renderer=new SoftwareEngineRenderer();software=true;}
      if(disposed){renderer.dispose();return;}
      renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75));renderer.setSize(el.clientWidth,el.clientHeight);renderer.setClearColor(0x111310,0);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.98;
      renderer.domElement.setAttribute('aria-hidden','true');el.appendChild(renderer.domElement);
      const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,el.clientWidth/el.clientHeight,.1,80);
      camera.position.set(7.3,4.1,11.5);
      const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(.25,-.35,-.20);controls.enableZoom=false;controls.enablePan=false;controls.enableDamping=true;controls.dampingFactor=.085;controls.rotateSpeed=.48;controls.minPolarAngle=.35;controls.maxPolarAngle=Math.PI*.8;controls.update();controls.saveState();
      let isCutaway=true;
      const frameModel=()=>{const aspect=el.clientWidth/el.clientHeight;camera.fov=2*Math.atan(Math.tan(34*Math.PI/360)*Math.max(1,1.30/aspect))*180/Math.PI;camera.updateProjectionMatrix();};frameModel();
      let environment:THREE.WebGLRenderTarget|undefined;
      if(renderer instanceof T.WebGLRenderer){
        renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
        // A dark product-photography studio gives steel broad white reflections
        // separated by dark bands, rather than a blue tint or an even grey wash.
        const studio=new T.Scene();studio.background=new T.Color(0x191a18);
        const shellGeometry=new T.BoxGeometry(30,20,30),shellMaterial=new T.MeshBasicMaterial({color:0x20211e,side:T.BackSide});
        const shell=new T.Mesh(shellGeometry,shellMaterial);shell.position.y=4;studio.add(shell);
        const panels:{geometry:THREE.PlaneGeometry;material:THREE.MeshBasicMaterial}[]=[];
        const softbox=(width:number,height:number,x:number,y:number,z:number,power:number)=>{
          const geometry=new T.PlaneGeometry(width,height),material=new T.MeshBasicMaterial({color:new T.Color(power,power,power),side:T.DoubleSide});
          const panel=new T.Mesh(geometry,material);panel.position.set(x,y,z);panel.lookAt(0,0,0);studio.add(panel);panels.push({geometry,material});
        };
        softbox(10,3,-4,7,5,10);softbox(2,8,6,3,-5,12);softbox(7,1.3,0,1,9,3.5);
        const pmrem=new T.PMREMGenerator(renderer);environment=pmrem.fromScene(studio,.025);scene.environment=environment.texture;scene.environmentIntensity=.9;
        shellGeometry.dispose();shellMaterial.dispose();panels.forEach(panel=>{panel.geometry.dispose();panel.material.dispose();});pmrem.dispose();
      }
      const {createValvetrain}=await import('./ValvetrainGeometry');
      if(disposed){environment?.dispose();renderer.dispose();renderer.domElement.remove();controls.dispose();return;}
      const model=createValvetrain(software);model.cutaway(true);scene.add(model.group);
      scene.add(new T.AmbientLight(0xffffff,.25));
      const key=new T.DirectionalLight(0xfffcf6,2.4);key.position.set(-3,7,5);
      if(!software){key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-6;key.shadow.camera.right=6;key.shadow.camera.top=5;key.shadow.camera.bottom=-5;key.shadow.camera.near=.1;key.shadow.camera.far=23;key.shadow.normalBias=.009;key.shadow.bias=-.00012;key.shadow.radius=2;}
      scene.add(key);const rim=new T.DirectionalLight(0xffffff,2.8);rim.position.set(5,3,-5);scene.add(rim);const fill=new T.DirectionalLight(0xffffff,.65);fill.position.set(-5,0,3);scene.add(fill);
      const floorGeometry=new T.PlaneGeometry(18,12),floorMaterial=new T.ShadowMaterial({opacity:.25});
      const floor=new T.Mesh(floorGeometry,floorMaterial);floor.rotation.x=-Math.PI/2;floor.position.y=-2.86;floor.receiveShadow=true;floor.visible=!software;scene.add(floor);
      let frame=0,previous=0,angle=callbacks.current.initialAngle,visible=true,stopped=false,needsRender=true;
      let isPaused=reduce.matches||callbacks.current.study,brakeOn=callbacks.current.initialBrake,lastPhase='',lastPose=0,speed=1,explosion=0,explosionTarget=0;
      let cameraMove:{start:number;from:THREE.Vector3;to:THREE.Vector3;targetFrom:THREE.Vector3;targetTo:THREE.Vector3}|null=null;
      const pose=(force=false)=>{const status=model.update(angle,brakeOn);if(status.phase!==lastPhase){lastPhase=status.phase;callbacks.current.onPhase(status.phase);}if(callbacks.current.study&&(force||performance.now()-lastPose>100)){lastPose=performance.now();callbacks.current.onPose(angle);}};
      const moveCamera=(position:THREE.Vector3,target:THREE.Vector3)=>{
        if(reduce.matches){camera.position.copy(position);controls.target.copy(target);controls.update();cameraMove=null;}
        else cameraMove={start:performance.now(),from:camera.position.clone(),to:position,targetFrom:controls.target.clone(),targetTo:target};
        needsRender=true;
      };
      const overview=(animate=true)=>{
        const scale=1+explosion*.22,target=new T.Vector3(.25,isCutaway?-.35:.92,-.20),position=new T.Vector3(isCutaway?7.3:5.7,isCutaway?4.1:4.6,isCutaway?11.5:11.2).sub(target).multiplyScalar(scale).add(target);
        if(animate)moveCamera(position,target);else{cameraMove=null;camera.position.copy(position);controls.target.copy(target);controls.update();needsRender=true;}
      };
      const select=(selection:EngineSelection|null)=>{
        model.highlight(selection);
        if(!selection){overview();callbacks.current.onPick(null);return;}
        if(['piston','connecting-rod','crankshaft'].includes(selection.part)&&!isCutaway){isCutaway=true;model.cutaway(true);callbacks.current.onCutaway(true);}
        const bounds=model.bounds(selection),target=bounds.getCenter(new T.Vector3()),size=bounds.getSize(new T.Vector3());
        if(bounds.isEmpty())return;
        const direction=camera.position.clone().sub(controls.target).normalize(),radius=Math.max(size.x,size.y,size.z)*.5,distance=Math.max(3.5,radius/Math.sin(camera.fov*Math.PI/360)*1.25);
        moveCamera(target.clone().addScaledVector(direction,distance),target);callbacks.current.onPick(selection);
      };
      const draw=(now:number)=>{
        if(stopped)return;frame=requestAnimationFrame(draw);
        if(!visible||document.hidden){previous=now;return;}
        if(now-previous<(software?70:16))return;
        const dt=Math.min((now-previous)/1000,.12);previous=now;
        let changed=false;
        if(Math.abs(explosionTarget-explosion)>.0005){explosion=reduce.matches?explosionTarget:explosion+(explosionTarget-explosion)*Math.min(1,dt*11);if(Math.abs(explosionTarget-explosion)<.0005)explosion=explosionTarget;model.explode(explosion);floor.position.y=-2.86-explosion;overview(false);changed=true;}
        if(!isPaused){angle=(angle+dt*1.25*speed)%(Math.PI*4);changed=true;}
        if(changed)pose();
        if(cameraMove){const progress=Math.min(1,(now-cameraMove.start)/600),ease=1-Math.pow(1-progress,3);camera.position.lerpVectors(cameraMove.from,cameraMove.to,ease);controls.target.lerpVectors(cameraMove.targetFrom,cameraMove.targetTo,ease);if(progress===1)cameraMove=null;needsRender=true;}
        const cameraChanged=controls.update();
        if(changed||cameraChanged||needsRender){renderer.render(scene,camera);needsRender=false;}
      };
      const raycaster=new T.Raycaster(),pointer=new T.Vector2();let pointerStart:{id:number;x:number;y:number}|null=null;
      const down=(event:PointerEvent)=>{if(event.isPrimary&&event.button===0)pointerStart={id:event.pointerId,x:event.clientX,y:event.clientY};};
      const cancel=()=>{pointerStart=null;};
      const up=(event:PointerEvent)=>{
        const start=pointerStart;pointerStart=null;if(!start||start.id!==event.pointerId||Math.hypot(event.clientX-start.x,event.clientY-start.y)>7)return;
        const rect=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);model.group.updateMatrixWorld(true);camera.updateMatrixWorld();raycaster.setFromCamera(pointer,camera);
        const objects=model.pickableMeshes.filter(object=>{let parent:THREE.Object3D|null=object;while(parent){if(!parent.visible)return false;parent=parent.parent;}return true;});
        const hit=raycaster.intersectObjects(objects,false)[0];if(!hit)return;
        const selection:EngineSelection={part:hit.object.userData.studyPart,cylinder:hit.object.userData.studyCylinder};
        if(callbacks.current.study)select(selection);else callbacks.current.onPick(selection);
      };
      renderer.domElement.addEventListener('pointerdown',down);renderer.domElement.addEventListener('pointerup',up);renderer.domElement.addEventListener('pointercancel',cancel);
      const resize=new ResizeObserver(()=>{if(!el.clientWidth||!el.clientHeight)return;camera.aspect=el.clientWidth/el.clientHeight;frameModel();renderer.setSize(el.clientWidth,el.clientHeight);needsRender=true;});resize.observe(el);
      const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});observer.observe(el);
      const lost=(event:Event)=>{event.preventDefault();stopped=true;callbacks.current.onFailure();};renderer.domElement.addEventListener('webglcontextlost',lost);
      const reduced=()=>{if(reduce.matches){isPaused=true;callbacks.current.onPause(true);}};reduce.addEventListener('change',reduced);
      api.current={
        wire:value=>{model.materials.forEach(material=>{material.wireframe=value;});needsRender=true;},pause:value=>{isPaused=value;needsRender=true;},reset:()=>{model.highlight(null);overview();callbacks.current.onPick(null);},
        brake:value=>{brakeOn=value;pose(true);needsRender=true;},
        cutaway:value=>{isCutaway=value;model.cutaway(value);overview();needsRender=true;},
        explode:amount=>{explosionTarget=Math.max(0,Math.min(1,amount));if(explosionTarget>0){isPaused=true;callbacks.current.onPause(true);}needsRender=true;},
        speed:value=>{speed=Math.max(.15,Math.min(2,value));},
        angle:degrees=>{angle=Math.max(0,Math.min(720,degrees))*Math.PI/180;isPaused=true;callbacks.current.onPause(true);pose(true);needsRender=true;},select,readAngle:()=>angle
      };
      pose(true);callbacks.current.onPause(isPaused);if(callbacks.current.initialSelection)select(callbacks.current.initialSelection);
      renderer.render(scene,camera);frame=requestAnimationFrame(draw);callbacks.current.onReady();
      cleanup=()=>{
        stopped=true;cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();reduce.removeEventListener('change',reduced);
        renderer.domElement.removeEventListener('webglcontextlost',lost);renderer.domElement.removeEventListener('pointerdown',down);renderer.domElement.removeEventListener('pointerup',up);renderer.domElement.removeEventListener('pointercancel',cancel);
        controls.dispose();model.dispose();floorGeometry.dispose();floorMaterial.dispose();environment?.dispose();renderer.dispose();renderer.domElement.remove();api.current=null;
      };
    }).catch(()=>{if(!disposed)callbacks.current.onFailure();});
    return()=>{disposed=true;cleanup();};
  },[host]);
  return api;
}
