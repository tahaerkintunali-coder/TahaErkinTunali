import * as T from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import {CYLINDER_CENTERS,CYLINDER_PHASES,CRANK_Y,CRANK_RADIUS,ROD_LENGTH,PIVOT_Y,PIVOT_Z,CAM_Y,CAM_Z,FOLLOWER_Y,FOLLOWER_Z,FOLLOWER_RADIUS,BRIDGE_Y,SPRING_BASE,SPRING_LENGTH,ROCKER_LAYOUT,cylinderState,camLift,camProfilePoint,rockerAngle} from './EngineKinematics';
import {ENGINE_PARTS, type EngineSelection} from './EngineStudy';
import {createEngineMaterials} from './EngineMaterials';

/** Six-cylinder cutaway: paired intake/exhaust bridges and a dedicated brake rocker. */
export function createValvetrain(software: boolean) {
  const group=new T.Group(), geometries=new Set<T.BufferGeometry>();
  let activeParent:T.Object3D=group;
  const geometry=<G extends T.BufferGeometry>(g:G)=>{geometries.add(g);return g;};
  const {steel,polished,cast,blackSteel,bronze,blockPaint,cutMetal,brakeMetal,intakeMetal,exhaustMetal,springIntake,springExhaust,valveIntake,valveExhaust,guideMetal,housingMetal,bearingMetal,gearMetal,pistonMetal,air,materials,disposeTextures}=createEngineMaterials(software);
  const sides=software?20:64;
  const cylinder=geometry(new T.CylinderGeometry(1,1,1,sides));
  const smallCylinder=geometry(new T.CylinderGeometry(1,1,1,software?12:32));
  const rounded=geometry(new RoundedBoxGeometry(1,1,1,software?1:2,.028));
  const mesh=(g:T.BufferGeometry,m:T.Material,parent:T.Object3D=activeParent)=>{const o=new T.Mesh(g,m);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;};
  const cyl=(r:number,h:number,x:number,y:number,z:number,m=steel,parent:T.Object3D=activeParent)=>{const o=mesh(r<.08?smallCylinder:cylinder,m,parent);o.scale.set(r,h,r);o.position.set(x,y,z);return o;};
  const axial=(r:number,h:number,x:number,y:number,z:number,m=steel,parent:T.Object3D=activeParent)=>{const o=cyl(r,h,x,y,z,m,parent);o.rotation.z=Math.PI/2;return o;};
  const block=(sx:number,sy:number,sz:number,x:number,y:number,z:number,m=steel,parent:T.Object3D=activeParent)=>{const o=mesh(rounded,m,parent);o.scale.set(sx,sy,sz);o.position.set(x,y,z);return o;};
  const turned=(points:[number,number][],m:T.Material,parent:T.Object3D=activeParent)=>mesh(geometry(new T.LatheGeometry(points.map(([r,y])=>new T.Vector2(r,y)),sides)),m,parent);
  const ringGeo=(outer:number,inner:number,depth:number)=>{
    const s=new T.Shape();s.absarc(0,0,outer,0,Math.PI*2,false);const h=new T.Path();h.absarc(0,0,inner,0,Math.PI*2,true);s.holes.push(h);
    const g=geometry(new T.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSize:.004,bevelThickness:.004,bevelSegments:software?1:2,curveSegments:software?8:24}));g.rotateY(Math.PI/2);g.translate(-depth/2,0,0);return g;
  };
  const ring=(outer:number,inner:number,depth:number,m:T.Material,parent:T.Object3D=activeParent)=>mesh(ringGeo(outer,inner,depth),m,parent);
  const camY=CAM_Y,camZ=CAM_Z,pivotY=PIVOT_Y,pivotZ=PIVOT_Z;
  const banks=[-.22,.22],centers=CYLINDER_CENTERS;
  const valves:{axis:T.Group;spring:T.Mesh;cylinder:number;bank:number;offset:number}[]=[];
  const rockers:T.Group[][]=[],bridges:T.Group[][]=[],brakePins:T.Mesh[]=[];
  const rockerSpecs=ROCKER_LAYOUT.map((spec,index)=>({...spec,material:[intakeMetal,exhaustMetal,brakeMetal][index]}));
  const lobeGeometries=rockerSpecs.map((_,index)=>{
    const shape=new T.Shape(),segments=software?192:384;
    for(let i=0;i<segments;i++){
      const p=camProfilePoint(i/segments*Math.PI*2,index);
      i?shape.lineTo(p.z,p.y):shape.moveTo(p.z,p.y);
    }
    shape.closePath();
    // Inverse roller-envelope profile; its surface stays tangent to the follower.
    const g=geometry(new T.ExtrudeGeometry(shape,{depth:.11,bevelEnabled:false,curveSegments:1}));
    g.rotateY(-Math.PI/2);g.translate(.055,0,0);return g;
  });
  const springPoints=Array.from({length:193},(_,i)=>{const t=i/192,a=t*Math.PI*2*8;return new T.Vector3(Math.cos(a)*.106,t*SPRING_LENGTH,Math.sin(a)*.106);});
  const springGeo=geometry(new T.TubeGeometry(new T.CatmullRomCurve3(springPoints),software?64:160,.019,software?5:8,false));
  const valveProfile:[number,number][]=[[0,0],[.176,0],[.183,.008],[.179,.026],[.155,.046],[.097,.07],[.048,.09],[.028,.12],[.025,1.17]];
  const retainerProfile:[number,number][]=[[.026,0],[.113,0],[.128,.014],[.128,.028],[.087,.042],[.04,.052],[.026,.052]];
  const hexGeo=geometry(new T.CylinderGeometry(1,1,1,6));
  const bolt=(x:number,y:number,z:number,parent:T.Object3D=activeParent)=>{
    const head=mesh(hexGeo,polished,parent);head.scale.set(.034,.027,.034);head.position.set(x,y,z);
    cyl(.014,.001,x,y+.014,z,blackSteel,parent);
  };
  // A single overhead cam carries intake, exhaust and dedicated brake lobes.
  const cam=new T.Group();cam.position.set(0,camY,camZ);cam.userData.studyPart='camshaft';group.add(cam);
  axial(.091,8.28,0,0,0,blackSteel,cam);
  axial(.085,8.15,0,pivotY,pivotZ,blackSteel);
  for(const x of [-3.75,-2.5,-1.25,0,1.25,2.5,3.75]){
    axial(.122,.18,x,0,0,polished,cam);
    const support=ring(.19,.124,.14,housingMetal);support.position.set(x,camY,camZ);
    block(.17,.63,.17,x,.88,camZ,housingMetal);
    const rockerSupport=ring(.165,.088,.14,bearingMetal);rockerSupport.position.set(x,pivotY,pivotZ);
    block(.15,.41,.15,x,1.15,pivotZ,bearingMetal);bolt(x,1.54,pivotZ);
    block(.18,.11,.43,x,.68,-.655,blockPaint);
  }
  const rockerBody=(reach:number)=>{
    const shape=new T.Shape();
    // Forged arm: broad bearing boss, a tapered web and rounded contact lands.
    shape.moveTo(-.34,-.04);
    shape.quadraticCurveTo(-.35,.08,-.28,.09);
    shape.lineTo(-.19,.10);shape.quadraticCurveTo(-.12,.165,0,.165);
    shape.quadraticCurveTo(.14,.165,.22,.10);
    shape.lineTo(reach-.09,.052);shape.quadraticCurveTo(reach+.075,.07,reach+.075,-.02);
    shape.quadraticCurveTo(reach+.07,-.065,reach-.055,-.07);
    shape.lineTo(.21,-.067);shape.quadraticCurveTo(.11,-.16,0,-.16);
    shape.quadraticCurveTo(-.12,-.16,-.20,-.073);
    shape.lineTo(-.29,-.073);shape.quadraticCurveTo(-.34,-.073,-.34,-.04);shape.closePath();
    const bore=new T.Path();bore.absarc(0,0,.088,0,2*Math.PI,true);shape.holes.push(bore);
    const g=geometry(new T.ExtrudeGeometry(shape,{depth:.17,bevelEnabled:true,bevelSize:.016,bevelThickness:.012,bevelSegments:software?1:3,curveSegments:software?12:32}));
    g.rotateY(-Math.PI/2);g.translate(.085,0,0);return g;
  };
  const rockerBodies=rockerSpecs.map(spec=>rockerBody(spec.reach));
  const bridgeShape=new T.Shape();bridgeShape.moveTo(-.26,-.065);bridgeShape.lineTo(.26,-.065);bridgeShape.lineTo(.26,.065);bridgeShape.lineTo(-.26,.065);bridgeShape.closePath();
  const pinHole=new T.Path();pinHole.absarc(.18,0,.034,0,2*Math.PI,true);bridgeShape.holes.push(pinHole);
  const bridgeGeo=geometry(new T.ExtrudeGeometry(bridgeShape,{depth:.05,bevelEnabled:true,bevelSize:.007,bevelThickness:.007,bevelSegments:1,curveSegments:software?10:24}));bridgeGeo.rotateX(-Math.PI/2);bridgeGeo.translate(0,-.025,0);
  centers.forEach((cx,i)=>{
    const pair:T.Group[]=[],levers:T.Group[]=[];
    banks.forEach((z,bank)=>{
      const bridge=new T.Group();bridge.position.set(cx,BRIDGE_Y,z);bridge.userData.studyPart=bank?'exhaust-valves':'intake-valves';bridge.userData.studyCylinder=i;group.add(bridge);pair.push(bridge);
      mesh(bridgeGeo,bank?exhaustMetal:intakeMetal,bridge);bridge.userData.part=bank?'exhaust valve bridge':'intake valve bridge';
      for(const off of [-.18,.18]){
        const axis=new T.Group();axis.position.set(cx+off,0,z);axis.userData.studyPart=bank?'exhaust-valves':'intake-valves';axis.userData.studyCylinder=i;group.add(axis);
        const valve=turned(valveProfile,bank?valveExhaust:valveIntake,axis);valve.userData.part=bank?'exhaust valve':'intake valve';valve.userData.bank=bank;valve.position.y=.17;
        const retainer=turned(retainerProfile,bank?springExhaust:springIntake,axis);retainer.position.y=SPRING_BASE+SPRING_LENGTH;
        cyl(.031,.030,0,1.305,0,blackSteel,axis);
        // Independent actuating pin passes through the exhaust bridge.
        if(bank===1 && off>0)cyl(.028,.045,0,1.3625,0,polished,axis);
        const spring=mesh(springGeo,bank?springExhaust:springIntake);spring.position.set(cx+off,SPRING_BASE,z);spring.userData.part='valve spring';spring.userData.studyPart='valve-springs';spring.userData.studyCylinder=i;spring.userData.cylinder=i;spring.userData.bank=bank;spring.userData.offset=off;
        cyl(.118,.016,cx+off,.565,z,steel);
        const guide=ring(.046,.028,.19,guideMetal);guide.rotation.z=Math.PI/2;guide.position.set(cx+off,.48,z);
        cyl(.05,.055,cx+off,.565,z,blackSteel);
        valves.push({axis,spring,cylinder:i,bank,offset:off});
      }
    });bridges.push(pair);
    rockerSpecs.forEach((spec,k)=>{
      const lobe=mesh(lobeGeometries[k],polished,cam);lobe.position.x=cx+spec.x;lobe.userData.part='cam lobe';lobe.userData.profile=k;lobe.userData.cylinder=i;
      lobe.rotation.x=CYLINDER_PHASES[i]/2;
      const arm=new T.Group();arm.position.set(cx+spec.x,pivotY,pivotZ);arm.userData.part=spec.name+' rocker';arm.userData.studyPart=['intake-rocker','exhaust-rocker','brake-rocker'][k];arm.userData.studyCylinder=i;arm.userData.reach=spec.reach;group.add(arm);levers.push(arm);
      mesh(rockerBodies[k],spec.material,arm);
      // Forged top rib and relieved side web, with separate turned bearing collars.
      if(k>0){
        block(.054,.047,spec.reach*.60,0,.069,spec.reach*.54,polished,arm);
        for(const side of [-1,1])block(.006,.040,spec.reach*.43,side*.093,.025,spec.reach*.55,blackSteel,arm);
      }
      ring(.150,.088,.192,spec.material,arm);ring(.108,.088,.204,bronze,arm);
      // Machined roller shoulders and retaining screw recesses.
      for(const side of [-1,1]){axial(.059,.016,side*.074,-.005,-.27,blackSteel,arm);axial(.029,.020,side*.085,-.005,-.27,polished,arm);}
      const roller=axial(FOLLOWER_RADIUS,.115,0,FOLLOWER_Y,FOLLOWER_Z,polished,arm);roller.userData.part='cam roller';roller.userData.cylinder=i;roller.userData.profile=k;
      axial(.028,.16,0,-.005,-.27,blackSteel,arm);
      block(Math.abs(spec.tipX)+.12,.055,.12,spec.tipX/2,-.015,spec.reach,spec.material,arm);
      if(k<2){
        cyl(.027,.14,spec.tipX,.02,spec.reach,polished,arm);
        const nut=mesh(hexGeo,bronze,arm);nut.scale.set(.055,.03,.055);nut.position.set(spec.tipX,.050,spec.reach);
        cyl(.053,.05,spec.tipX,-.03,spec.reach,polished,arm);
      }else{
        // Collapsible hydraulic tip transmits the dedicated lobe only when enabled.
        cyl(.090,.15,spec.tipX,.062,spec.reach,brakeMetal,arm);
        cyl(.065,.016,spec.tipX,.143,spec.reach,blackSteel,arm);
        const pin=cyl(.034,.085,spec.tipX,-.0125,spec.reach,polished,arm);brakePins.push(pin);
        cyl(.048,.075,-.015,.15,spec.reach*.55,blackSteel,arm);
        const oilPoints=[new T.Vector3(-.015,.15,spec.reach*.55),new T.Vector3(spec.tipX,.18,spec.reach*.78),new T.Vector3(spec.tipX,.14,spec.reach)];
        mesh(geometry(new T.TubeGeometry(new T.CatmullRomCurve3(oilPoints),12,.012,5,false)),steel,arm);
      }
    });rockers.push(levers);
  });
  // Open head casting: valve bores, fasteners and a machined gasket rail.
  const headShape=new T.Shape();
  headShape.moveTo(-3.95,-1.03);headShape.lineTo(3.95,-1.03);
  headShape.lineTo(3.95,.54);headShape.lineTo(-3.95,.54);headShape.closePath();
  centers.forEach(cx=>{
    for(const z of banks)for(const off of [-.18,.18]){
      const hole=new T.Path();hole.absarc(cx+off,z,.14,0,Math.PI*2,true);headShape.holes.push(hole);
    }
    const gallery=new T.Path();gallery.absellipse(cx,-.78,.40,.12,0,Math.PI*2,true,0);headShape.holes.push(gallery);
  });
  const headGeo=geometry(new T.ExtrudeGeometry(headShape,{depth:.16,bevelEnabled:true,bevelSize:.015,bevelThickness:.015,bevelSegments:software?1:3,curveSegments:software?10:24}));
  headGeo.rotateX(Math.PI/2);
  const head=mesh(headGeo,cast);head.position.y=.445;head.userData.part='open cylinder head casting';
  for(const z of [-1.04,.55]){
    block(7.95,.055,.055,0,.47,z,cutMetal);
    centers.forEach(cx=>bolt(cx,.49,z));
  }
  centers.forEach(cx=>{
    for(const x of [cx-.54,cx+.54])block(.055,.11,1.46,x,.29,-.245,housingMetal);
    // Cut faces around the guides are polished; the rest of the head remains cast.
    for(const z of banks)for(const off of [-.18,.18]){
      const seat=ring(.145,.12,.022,polished);seat.rotation.z=Math.PI/2;seat.position.set(cx+off,.463,z);
    }
  });
  // Exposed guide rail and bearing spine follow the supplied CAD arrangement.
  block(7.78,.10,.075,0,.49,.47,guideMetal);
  centers.forEach(cx=>{
    block(.54,.07,.21,cx,.49,.40,guideMetal);
    for(const x of [cx-.23,cx+.23]){block(.07,.23,.07,x,.61,.46,guideMetal);bolt(x,.75,.46);}
    block(1.03,.10,.24,cx,1.23,pivotZ,housingMetal);
    for(const x of [cx-.45,cx+.45])bolt(x,1.31,pivotZ);
  });
  const spine=new T.Shape();spine.moveTo(-3.97,-.16);spine.lineTo(3.97,-.16);spine.lineTo(3.97,.16);spine.lineTo(-3.97,.16);spine.closePath();
  centers.forEach(cx=>{for(const off of [-.20,.20]){const h=new T.Path();h.absellipse(cx+off,0,.10,.057,0,2*Math.PI,true,0);spine.holes.push(h);}});
  const spineGeo=geometry(new T.ExtrudeGeometry(spine,{depth:.045,bevelEnabled:true,bevelSize:.01,bevelThickness:.006,bevelSegments:1,curveSegments:software?8:20}));spineGeo.rotateX(-Math.PI/2);
  const spineMesh=mesh(spineGeo,blackSteel);spineMesh.position.set(0,1.62,-.94);
  centers.forEach(cx=>{for(const off of [-.40,.40]){const boltHead=mesh(hexGeo,bearingMetal);boltHead.scale.set(.045,.032,.045);boltHead.position.set(cx+off,1.70,-.94);}});
  const frontBearing=ring(.24,.10,.24,housingMetal);frontBearing.position.set(3.92,camY,camZ);
  block(.26,.62,.32,3.92,.92,camZ,housingMetal);
  const driveDistance=Math.hypot(camY-CRANK_Y,camZ);
  const crankPitch=driveDistance/12,camPitch=crankPitch*2,idlerPitch=crankPitch*1.5;
  const gear=(pitch:number,teeth:number,parent:T.Object3D)=>{
    const module=2*pitch/teeth,base=pitch*Math.cos(20*Math.PI/180),tip=pitch+module,root=pitch-1.25*module;
    const inv=(r:number)=>{const t=Math.sqrt(Math.max(0,(r/base)**2-1));return t-Math.atan(t);};
    const half=Math.PI/(2*teeth),atPitch=inv(pitch),shape=new T.Shape();
    let started=false;
    const point=(r:number,a:number)=>{const x=r*Math.cos(a),y=r*Math.sin(a);started?shape.lineTo(x,y):shape.moveTo(x,y);started=true;};
    for(let j=0;j<teeth;j++){
      const a=j/teeth*Math.PI*2;
      const radii=[root,Math.max(root,base),pitch,tip];
      for(const r of radii)point(r,a-half-atPitch+inv(Math.max(base,r)));
      for(const r of radii.slice().reverse())point(r,a+half+atPitch-inv(Math.max(base,r)));
    }
    shape.closePath();
    const hubHole=new T.Path();hubHole.absarc(0,0,.09,0,2*Math.PI,true);shape.holes.push(hubHole);
    const holes=pitch>.4?6:4;
    for(let j=0;j<holes;j++){const a=j/holes*Math.PI*2,h=new T.Path();h.absarc(Math.cos(a)*pitch*.62,Math.sin(a)*pitch*.62,pitch*.115,0,Math.PI*2,true);shape.holes.push(h);}
    const g=geometry(new T.ExtrudeGeometry(shape,{depth:.085,bevelEnabled:true,bevelSize:.002,bevelThickness:.002,bevelSegments:1,curveSegments:software?8:20}));g.rotateY(-Math.PI/2);g.translate(.0425,0,0);
    const assembly=new T.Group();parent.add(assembly);mesh(g,gearMetal,assembly);
    ring(pitch*.35,.091,.12,steel,assembly);axial(.065,.16,0,0,0,blackSteel,assembly);
    assembly.userData.part='timing gear';assembly.userData.teeth=teeth;return assembly;
  };
  const camGear=gear(camPitch,64,cam);camGear.position.x=4.15;
  const engineGroup=new T.Group();group.add(engineGroup);activeParent=engineGroup;
  // Engine casting is sectioned along its front face: the liners and pistons remain visible.
  const deckShape=new T.Shape();deckShape.moveTo(-3.95,-.81);deckShape.lineTo(3.95,-.81);deckShape.lineTo(3.95,.81);deckShape.lineTo(-3.95,.81);deckShape.closePath();
  centers.forEach(cx=>{const hole=new T.Path();hole.absarc(cx,0,.562,0,Math.PI*2,true);deckShape.holes.push(hole);});
  const deckGeo=geometry(new T.ExtrudeGeometry(deckShape,{depth:.11,bevelEnabled:true,bevelSize:.009,bevelThickness:.009,bevelSegments:1,curveSegments:software?12:32}));deckGeo.rotateX(-Math.PI/2);mesh(deckGeo,cutMetal);
  block(7.92,1.57,.17,0,-.74,-.76,blockPaint);
  block(7.98,.16,.27,0,-1.52,-.66,blockPaint);
  block(.19,1.7,.80,-3.91,-.77,-.36,blockPaint);block(.19,1.7,.80,3.91,-.77,-.36,blockPaint);
  const linerMetal=polished.clone();linerMetal.side=T.DoubleSide;materials.push(linerMetal);
  const linerGeo=geometry(new T.CylinderGeometry(.56,.56,1.76,sides,1,true,Math.PI/2,Math.PI));
  const outerLinerGeo=geometry(new T.CylinderGeometry(.645,.645,1.76,sides,1,true,Math.PI/2,Math.PI));
  linerGeo.computeVertexNormals();
  const pistons:T.Group[]=[],rods:T.Group[]=[],cranks:T.Group[]=[],jets:T.Mesh[][]=[];
  const pistonGeo=geometry(new T.LatheGeometry([[0,-.45],[.47,-.45],[.511,-.425],[.523,-.12],[.535,-.065],[.537,.012],[.528,.020],[.528,.037],[.542,.044],[.542,.055],[.528,.058],[.528,.073],[.543,.080],[.543,.093],[.529,.096],[.529,.113],[.546,.120],[.546,.137],[.535,.149],[.327,.149],[.307,.140],[.290,.122],[.271,.077],[.249,.062],[0,.062]].map(([r,y])=>new T.Vector2(r,y)),sides));
  const pistonRingGeo=ringGeo(.548,.527,.014);pistonRingGeo.rotateZ(Math.PI/2);
  const bearingGeo=ringGeo(.155,.083,.16),smallBearingGeo=ringGeo(.087,.064,.16);
  const jetGeo=geometry(new T.SphereGeometry(.026,software?6:12,software?4:8));
  centers.forEach((cx,i)=>{
    const liner=mesh(linerGeo,linerMetal);liner.position.set(cx,-.87,0);
    const outer=mesh(outerLinerGeo,blockPaint);outer.position.copy(liner.position);
    // Flat cut edges distinguish an engine-block section from free-standing pipes.
    for(const sign of [-1,1])block(.085,1.76,.075,cx+sign*.60,-.87,0,cutMetal);
    block(.10,1.40,.10,cx,-.77,-.82,blockPaint);
    for(const z of [-.68,.68]){bolt(cx-.40,.16,z);bolt(cx+.40,.16,z);}
    // Partial head/port casting keeps the upper mechanism exposed.
    block(.99,.25,.12,cx,.32,-.69,cast);
    const portPlate=new T.Shape();portPlate.moveTo(-.50,.19);portPlate.lineTo(.50,.19);portPlate.lineTo(.50,.46);portPlate.lineTo(-.50,.46);portPlate.closePath();
    for(const off of [-.18,.18]){const h=new T.Path();h.absarc(off,.325,.086,0,Math.PI*2,true);portPlate.holes.push(h);}
    const portPlateMesh=mesh(geometry(new T.ExtrudeGeometry(portPlate,{depth:.10,bevelEnabled:true,bevelSize:.008,bevelThickness:.008,bevelSegments:1,curveSegments:software?8:24})),cast);portPlateMesh.position.set(cx,0,.66);
    for(const off of [-.18,.18]){
      const port=ring(.115,.083,.11,cutMetal);port.position.set(cx+off,.32,-.74);port.rotation.y=Math.PI/2;
    }
    const piston=new T.Group();piston.position.x=cx;piston.userData.part='piston';piston.userData.studyPart='piston';piston.userData.studyCylinder=i;piston.userData.cylinder=i;engineGroup.add(piston);pistons.push(piston);mesh(pistonGeo,pistonMetal,piston);
    for(const y of [.10,.062,.027]){const pr=mesh(pistonRingGeo,blackSteel,piston);pr.position.y=y;}
    axial(.064,1.12,0,0,0,steel,piston);
    const rod=new T.Group();rod.userData.part='connecting rod';rod.userData.studyPart='connecting-rod';rod.userData.studyCylinder=i;rod.userData.cylinder=i;engineGroup.add(rod);rods.push(rod);
    mesh(bearingGeo,steel,rod);const small=mesh(smallBearingGeo,steel,rod);small.position.y=ROD_LENGTH;
    const rodShape=new T.Shape();
    rodShape.moveTo(-.105,.11);rodShape.quadraticCurveTo(-.07,.26,-.049,.40);
    rodShape.lineTo(-.043,ROD_LENGTH-.16);rodShape.lineTo(.043,ROD_LENGTH-.16);
    rodShape.lineTo(.049,.40);rodShape.quadraticCurveTo(.07,.26,.105,.11);rodShape.closePath();
    const rodGeo=geometry(new T.ExtrudeGeometry(rodShape,{depth:.13,bevelEnabled:true,bevelSize:.009,bevelThickness:.009,bevelSegments:software?1:2}));
    rodGeo.rotateY(-Math.PI/2);rodGeo.translate(.065,0,0);mesh(rodGeo,steel,rod);
    for(const side of [-1,1])block(.017,ROD_LENGTH-.36,.10,side*.075,ROD_LENGTH/2,0,polished,rod);
    const crank=new T.Group();crank.position.set(cx,CRANK_Y,0);crank.userData.studyPart='crankshaft';crank.userData.studyCylinder=i;engineGroup.add(crank);cranks.push(crank);
    for(const x of [-.14,.14]){
      axial(.255,.105,x,0,0,blackSteel,crank);
      block(.105,CRANK_RADIUS,.14,x,CRANK_RADIUS/2,0,steel,crank);
      axial(.123,.107,x,CRANK_RADIUS,0,polished,crank);
    }
    axial(.083,.31,0,CRANK_RADIUS,0,polished,crank);
    const support=ring(.16,.089,.13,cast);support.position.set(cx,CRANK_Y,0);
    block(.14,.29,.21,cx,CRANK_Y-.24,0,blockPaint);
    const particles:T.Mesh[]=[];
    for(let j=0;j<7;j++){const p=mesh(jetGeo,air,group);p.visible=false;particles.push(p);}jets.push(particles);
  });
  const mainCrank=axial(.086,8.36,0,CRANK_Y,0,polished);mainCrank.userData.studyPart='crankshaft';
  block(8.02,.17,1.34,0,-2.64,-.20,blockPaint);
  for(const x of [-3.6,-2.4,-1.2,0,1.2,2.4,3.6])bolt(x,-2.54,.46);
  const drive=gear(crankPitch,32,engineGroup);drive.position.set(4.15,CRANK_Y,0);
  const idlers:T.Group[]=[];
  const direction=new T.Vector3(0,camY-CRANK_Y,camZ).normalize();
  for(let i=0;i<3;i++){
    const idler=gear(idlerPitch,48,engineGroup),distance=crankPitch+idlerPitch+i*2*idlerPitch;
    idler.position.set(4.15,CRANK_Y+direction.y*distance,direction.z*distance);idlers.push(idler);
    const bearing=ring(.11,.066,.17,housingMetal,engineGroup);bearing.position.set(4.03,idler.position.y,idler.position.z);
    block(.13,.17,.17,3.99,idler.position.y,idler.position.z,blockPaint,engineGroup);
  }
  const gearPath=[drive,...idlers,camGear],meshDirection=Math.atan2(camY-CRANK_Y,camZ);
  let previousPhase=0;
  for(let i=1;i<gearPath.length;i++){
    const a=gearPath[i-1],b=gearPath[i],na=a.userData.teeth,nb=b.userData.teeth;
    const phase=(Math.PI-na*(meshDirection+previousPhase)-nb*(meshDirection+Math.PI))/nb;
    b.userData.phase=phase;b.rotation.x=phase;previousPhase=phase;
  }
  let explosion=0,selection:EngineSelection|null=null;
  const pickableMeshes:T.Mesh<T.BufferGeometry,T.MeshPhysicalMaterial>[]=[];
  const baseMaterials=new Map<T.Mesh,T.MeshPhysicalMaterial>();
  const highlightedMaterials=new Map<string,T.MeshPhysicalMaterial>();
  group.traverse(object=>{
    if(!(object instanceof T.Mesh))return;
    let parent:T.Object3D|null=object;
    while(parent&&!parent.userData.studyPart)parent=parent.parent;
    if(!parent)return;
    object.userData.studyPart=parent.userData.studyPart;
    object.userData.studyCylinder=parent.userData.studyCylinder??null;
    pickableMeshes.push(object as T.Mesh<T.BufferGeometry,T.MeshPhysicalMaterial>);
    baseMaterials.set(object,object.material as T.MeshPhysicalMaterial);
  });
  const selectedMaterial=(object:T.Mesh,base:T.MeshPhysicalMaterial)=>{
    if(!selection||object.userData.studyPart!==selection.part||(selection.cylinder!==null&&object.userData.studyCylinder!==null&&object.userData.studyCylinder!==selection.cylinder))return base;
    const key=`${base.uuid}/${selection.part}`;
    let material=highlightedMaterials.get(key);
    if(!material){
      material=base.clone();const accent=new T.Color(ENGINE_PARTS[selection.part].color);
      material.color.lerp(accent,.18);material.emissive.copy(accent);material.emissiveIntensity=.07;
      highlightedMaterials.set(key,material);materials.push(material);
    }
    material.wireframe=base.wireframe;
    return material;
  };
  const bounds=(part:EngineSelection)=>{
    group.updateMatrixWorld(true);
    const box=new T.Box3(),local=new T.Box3();
    pickableMeshes.forEach(object=>{
      if(object.userData.studyPart!==part.part||(part.cylinder!==null&&object.userData.studyCylinder!==null&&object.userData.studyCylinder!==part.cylinder))return;
      if(!object.geometry.boundingBox)object.geometry.computeBoundingBox();
      local.copy(object.geometry.boundingBox!).applyMatrix4(object.matrixWorld);box.union(local);
    });
    return box;
  };
  return {group,materials,pickableMeshes,bounds,
    highlight(part:EngineSelection|null){selection=part;pickableMeshes.forEach(object=>{object.material=selectedMaterial(object,baseMaterials.get(object)!);});},
    explode(amount:number){explosion=Math.max(0,Math.min(1,amount));cam.position.y=camY+explosion*2;cam.position.z=camZ-explosion*.4;engineGroup.position.y=-explosion;},
    cutaway(enabled:boolean){engineGroup.visible=enabled;},
    update(crankAngle:number,brakeOn=true){
      const states=centers.map((_,i)=>cylinderState(crankAngle,i,brakeOn));
      cam.rotation.x=crankAngle/2;drive.rotation.x=crankAngle;idlers.forEach((g,i)=>{g.rotation.x=(i%2?1:-1)*crankAngle*2/3+g.userData.phase;});
      valves.forEach(({axis,spring,cylinder,bank,offset})=>{
        const state=states[cylinder],lift=bank?Math.max(state.exhaustLift,offset>0?state.brakeLift:0):state.intakeLift;
        axis.position.y=-lift+explosion*.6;axis.position.z=banks[bank]+(bank?1:-1)*explosion*.5;
        spring.position.y=SPRING_BASE+explosion*.6;spring.position.z=axis.position.z;spring.scale.y=1-lift/SPRING_LENGTH;
      });
      states.forEach((state,i)=>{
        pistons[i].position.y=state.pistonPinY;
        rods[i].position.set(centers[i],state.crankPinY,state.crankPinZ);rods[i].rotation.x=Math.atan2(-state.crankPinZ,state.pistonPinY-state.crankPinY);
        cranks[i].rotation.x=state.angle;
        const camBrakeLift=camLift(state.angle,2);
        rockers[i][0].rotation.x=rockerAngle(state.intakeLift,rockerSpecs[0].reach);
        rockers[i][1].rotation.x=rockerAngle(state.exhaustLift,rockerSpecs[1].reach);
        rockers[i][2].rotation.x=rockerAngle(camBrakeLift,rockerSpecs[2].reach);
        rockers[i].forEach((arm,k)=>{arm.position.y=pivotY+explosion*1.4;arm.position.x=centers[i]+rockerSpecs[k].x*(1+explosion*.8);});
        bridges[i][0].position.y=BRIDGE_Y-state.intakeLift+explosion;
        bridges[i][1].position.y=BRIDGE_Y-state.exhaustLift+explosion;
        bridges[i].forEach((bridge,bank)=>{bridge.position.z=banks[bank]+(bank?1:-1)*explosion*.5;});
        // OFF: the slave tip retracts and absorbs brake cam travel.
        brakePins[i].position.y=brakeOn?-.0125:.0975;
        const pinBase=brakeOn?polished:blackSteel;baseMaterials.set(brakePins[i],pinBase);brakePins[i].material=selectedMaterial(brakePins[i],pinBase);
        jets[i].forEach((p,j)=>{
          p.visible=state.brakeLift>.008;
          const t=((state.angle-(Math.PI*2-.37))/.58+j/7)%1;
          p.position.set(centers[i]+.18+(j%2-.5)*.08,.18+t*.32+explosion*.6,.22+t*.68+explosion*.5);p.scale.setScalar(.6+t*.6);
        });
      });
      const focus=states[states.length-1];return {phase:focus.phase,brakeLift:focus.brakeLift,angle:focus.angle};
    },
    dispose(){geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());disposeTextures();}
  };
}
