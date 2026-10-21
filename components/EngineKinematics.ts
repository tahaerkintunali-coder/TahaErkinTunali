// Representative heavy-duty SOHC geometry. Timings are illustrative, not an OEM calibration.
export const CYLINDER_CENTERS=[-3.125,-1.875,-.625,.625,1.875,3.125];
export const FIRING_ORDER=[1,5,3,6,2,4];
export const CYLINDER_PHASES=[2*Math.PI,10*Math.PI/3,2*Math.PI/3,8*Math.PI/3,4*Math.PI/3,0];
export const CRANK_Y=-2.32,CRANK_RADIUS=.50,ROD_LENGTH=1.56;
export const PIVOT_Y=1.44,PIVOT_Z=-.52,CAM_Y=1.205,CAM_Z=-.79;
export const FOLLOWER_Y=-.005,FOLLOWER_Z=-.27,FOLLOWER_RADIUS=.075;
export const CONTACT_Y=-.03,BRIDGE_Y=1.36,SPRING_BASE=.565,SPRING_LENGTH=.70;
const cycle=4*Math.PI,deg=Math.PI/180;
export const VALVE_EVENTS={
  intake:{center:103*deg,width:115*deg,height:.09},
  exhaust:{center:616*deg,width:116*deg,height:.09},
  precharge:{center:105*deg,width:40*deg,height:.012},
  release:{center:352*deg,width:40*deg,height:.02},
};
export const ROCKER_LAYOUT=[
  {name:'intake',x:-.30,reach:.30,tipX:.30},
  {name:'exhaust',x:0,reach:.74,tipX:0},
  {name:'engine brake',x:.30,reach:.74,tipX:-.12},
];
export function valveEvent(angle:number,center:number,width:number,height:number){
  const d=Math.atan2(Math.sin((angle-center)/2),Math.cos((angle-center)/2))*2;
  // Smooth closing ramps: velocity and acceleration return to zero at the seat.
  return Math.abs(d)<width?height*Math.cos(d/width*Math.PI/2)**4:0;
}
export function camLift(angle:number,index:number){
  if(index===2){
    const p=VALVE_EVENTS.precharge,r=VALVE_EVENTS.release;
    return Math.max(valveEvent(angle,p.center,p.width,p.height),valveEvent(angle,r.center,r.width,r.height));
  }
  const e=index===0?VALVE_EVENTS.intake:VALVE_EVENTS.exhaust;
  return valveEvent(angle,e.center,e.width,e.height);
}
export function cylinderState(crankAngle:number,index:number,brakeOn:boolean){
  const angle=((crankAngle+CYLINDER_PHASES[index])%cycle+cycle)%cycle;
  const intakeLift=camLift(angle,0),exhaustLift=camLift(angle,1),brakeLift=brakeOn?camLift(angle,2):0;
  const crankPinY=CRANK_Y+CRANK_RADIUS*Math.cos(angle),crankPinZ=CRANK_RADIUS*Math.sin(angle);
  const pistonPinY=crankPinY+Math.sqrt(ROD_LENGTH**2-crankPinZ**2);
  const phase=angle<Math.PI?'Intake':angle<2*Math.PI?'Compression':angle<3*Math.PI?(brakeOn?'Expansion · no fuel':'Power'):'Exhaust';
  const brakePhase=angle<Math.PI?'Pre-charge':'Compression release';
  return {angle,intakeLift,exhaustLift,brakeLift,crankPinY,crankPinZ,pistonPinY,phase:brakeLift>.003?brakePhase:phase};
}
export function rockerAngle(lift:number,reach:number){
  const radius=Math.hypot(reach,CONTACT_Y);
  return Math.asin(CONTACT_Y/radius)-Math.asin((CONTACT_Y-lift)/radius);
}
// The roller center expressed in cam coordinates. A roller-envelope cam profile
// follows this pitch curve; the same lift law drives the complete mechanism.
export function followerPitch(camAngle:number,index:number){
  const angle=rockerAngle(camLift(camAngle*2,index),ROCKER_LAYOUT[index].reach);
  const c=Math.cos(angle),s=Math.sin(angle);
  const y=PIVOT_Y+FOLLOWER_Y*c-FOLLOWER_Z*s-CAM_Y;
  const z=PIVOT_Z+FOLLOWER_Y*s+FOLLOWER_Z*c-CAM_Z;
  return {z:z*Math.cos(camAngle)-y*Math.sin(camAngle),y:y*Math.cos(camAngle)+z*Math.sin(camAngle)};
}
export function camProfilePoint(camAngle:number,index:number){
  const p=followerPitch(camAngle,index),eps=1e-5;
  const a=followerPitch(camAngle-eps,index),b=followerPitch(camAngle+eps,index);
  const dz=b.z-a.z,dy=b.y-a.y,len=Math.hypot(dz,dy);
  return {z:p.z-FOLLOWER_RADIUS*dy/len,y:p.y+FOLLOWER_RADIUS*dz/len};
}
