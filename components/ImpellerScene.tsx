"use client";
import {useEffect,useRef,useState} from 'react';
import {Pause,Play,RotateCcw,Box} from 'lucide-react';

export default function ImpellerScene(){
 const host=useRef<HTMLDivElement>(null),api=useRef<{wire:(v:boolean)=>void;pause:(v:boolean)=>void;reset:()=>void}|null>(null);
 const[ready,setReady]=useState(false),[wire,setWire]=useState(false),[paused,setPaused]=useState(false),[failed,setFailed]=useState(false);
 useEffect(()=>{let clean=()=>{},disposed=false;
  Promise.all([import('three'),import('three/examples/jsm/controls/OrbitControls.js'),import('three/examples/jsm/environments/RoomEnvironment.js')]).then(([T,{OrbitControls},{RoomEnvironment}])=>{
   if(disposed||!host.current)return;const el=host.current;
   const renderer=new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(el.clientWidth,el.clientHeight);renderer.setClearColor(0,0);renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.5;el.appendChild(renderer.domElement);
   const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,el.clientWidth/el.clientHeight,.1,100);camera.position.set(0,1.1,7.7);
   const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
   const controls=new OrbitControls(camera,renderer.domElement);controls.enableZoom=false;controls.enablePan=false;controls.enableDamping=true;controls.dampingFactor=.055;controls.autoRotate=!matchMedia('(prefers-reduced-motion: reduce)').matches;controls.autoRotateSpeed=.65;controls.rotateSpeed=.55;setPaused(!controls.autoRotate);
   const group=new T.Group();group.rotation.set(.65,-.38,-.3);scene.add(group);
   const metal=new T.MeshStandardMaterial({color:0xa3aca9,metalness:1,roughness:.26,side:T.DoubleSide});
   const rimMat=new T.MeshStandardMaterial({color:0xc4f36a,metalness:.75,roughness:.3,emissive:0x304d07,emissiveIntensity:.25});
   const disk=new T.Mesh(new T.CylinderGeometry(1.78,1.68,.16,96),metal);disk.rotation.x=Math.PI/2;disk.position.z=-.3;group.add(disk);
   const ring=new T.Mesh(new T.TorusGeometry(1.75,.025,8,96),rimMat);ring.position.z=-.21;group.add(ring);
   const points=[new T.Vector2(.0,.99),new T.Vector2(.17,.95),new T.Vector2(.26,.8),new T.Vector2(.34,.52),new T.Vector2(.43,.18),new T.Vector2(.56,-.25)];
   const hub=new T.Mesh(new T.LatheGeometry(points,64),metal);hub.rotation.x=Math.PI/2;group.add(hub);
   // Parametric ruled blade surfaces: radius, twist and taper define the family.
   for(let blade=0;blade<15;blade++){const pos:number[]=[],idx:number[]=[],steps=36;
    for(let i=0;i<=steps;i++){const t=i/steps,r=.38+t*1.36,angle=blade/15*Math.PI*2+t*.82;
     for(let j=0;j<2;j++){const a=angle+j*.14*(1-t*.6),z=j*(.86*(1-t)+.16)-.21;pos.push(Math.cos(a)*r,Math.sin(a)*r,z);}
     if(i<steps){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2);}}
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();group.add(new T.Mesh(geo,metal));
   }
   scene.add(new T.AmbientLight(0xffffff,.5));const light=new T.DirectionalLight(0xebffcd,6);light.position.set(-3,2,4);scene.add(light);const edge=new T.DirectionalLight(0x9dfa34,7);edge.position.set(4,-1,-1);scene.add(edge);
   let visible=true,running=true,frame=0,last=0;const reduce=matchMedia('(prefers-reduced-motion: reduce)');
   const draw=(now:number)=>{if(!running)return;frame=requestAnimationFrame(draw);if(!visible||document.hidden||now-last<30)return;last=now;controls.update();renderer.render(scene,camera)};frame=requestAnimationFrame(draw);
   const resize=new ResizeObserver(()=>{if(!el.clientWidth||!el.clientHeight)return;camera.aspect=el.clientWidth/el.clientHeight;camera.updateProjectionMatrix();renderer.setSize(el.clientWidth,el.clientHeight)});resize.observe(el);
   const observe=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting});observe.observe(el);
   const lost=(e:Event)=>{e.preventDefault();setFailed(true);running=false};renderer.domElement.addEventListener('webglcontextlost',lost);
   const reduced=()=>{if(reduce.matches){controls.autoRotate=false;setPaused(true)}};reduce.addEventListener('change',reduced);
   api.current={wire:v=>{metal.wireframe=v;metal.color.set(v?0xc4f36a:0xa3aca9)},pause:v=>{controls.autoRotate=!v},reset:()=>{controls.reset()}};
   setReady(true);clean=()=>{running=false;cancelAnimationFrame(frame);resize.disconnect();observe.disconnect();reduce.removeEventListener('change',reduced);controls.dispose();scene.traverse(o=>{if(o instanceof T.Mesh)o.geometry.dispose()});metal.dispose();rimMat.dispose();env.dispose();renderer.dispose();renderer.domElement.remove();api.current=null};
  }).catch(()=>setFailed(true));return()=>{disposed=true;clean()};
 },[]);
 return <><img className={ready&&!failed?'scene-poster hidden-poster':'scene-poster'} src="/TahaErkinTunali/images/impeller.jpg" alt="Titanium centrifugal impeller with curved radial blades"/><div className={'scene-canvas '+(failed?'scene-failed':'')} ref={host} aria-label="Interactive 3D impeller. Drag to rotate." role="img"/><span className="technical-label top">FIG. 01 / CENTRIFUGAL IMPELLER</span><div className="model-label"><span>IMPELLER / 001</span><small>{failed?'STUDIO VIEW':'PARAMETRIC DESIGN STUDY'}</small></div>{ready&&!failed&&<div className="scene-controls"><span>DRAG TO EXPLORE</span><button aria-label="Toggle wireframe" aria-pressed={wire} onClick={()=>{api.current?.wire(!wire);setWire(!wire)}}><Box size={16}/></button><button aria-label={paused?'Play rotation':'Pause rotation'} onClick={()=>{api.current?.pause(!paused);setPaused(!paused)}}>{paused?<Play size={15}/>:<Pause size={15}/>}</button><button aria-label="Reset model view" onClick={()=>api.current?.reset()}><RotateCcw size={15}/></button></div>}</>;
}
