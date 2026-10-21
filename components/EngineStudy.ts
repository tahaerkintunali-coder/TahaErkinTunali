import {cylinderState, VALVE_EVENTS} from './EngineKinematics';

export const ENGINE_PARTS = {
  camshaft:{label:'Camshaft & lobes', color:'#a9b9ef', description:'The cam lobes time the valve train. In this study, intake, exhaust and dedicated brake lobes share a single overhead camshaft.'},
  'intake-rocker':{label:'Intake rocker', color:'#79d1e6', description:'Its roller follows the intake cam lobe. The rocker transfers that motion to a bridge that operates the two intake valves.'},
  'exhaust-rocker':{label:'Exhaust rocker', color:'#e6ae8d', description:'This rocker follows the exhaust cam lobe and drives the exhaust valve bridge during the exhaust event.'},
  'brake-rocker':{label:'Engine brake rocker', color:'#e5c17e', description:'A dedicated brake lobe moves this rocker. Engaging the hydraulic tip transmits an additional exhaust valve opening near the end of compression.'},
  'intake-valves':{label:'Intake valves', color:'#79d1e6', description:'Two intake valves per cylinder admit air in this four-valve layout. Their motion follows the intake rocker and bridge.'},
  'exhaust-valves':{label:'Exhaust valves', color:'#e6ae8d', description:'The bridge operates both exhaust valves during the exhaust event. In this study, an independent pin also opens one exhaust valve for compression-release braking.'},
  'valve-springs':{label:'Valve springs', color:'#a6d8b6', description:'The springs compress as the valves open and return the valves to their seats as the actuation closes.'},
  piston:{label:'Piston', color:'#9dccdf', description:'The piston travels inside the sectioned cylinder. Its position is linked to the connecting rod and crankshaft through the model’s slider-crank geometry.'},
  'connecting-rod':{label:'Connecting rod', color:'#a6d8b6', description:'The connecting rod links piston motion to the rotating crankshaft. Rotate the cycle manually to follow both ends of the rod.'},
  crankshaft:{label:'Crankshaft', color:'#b9a7e3', description:'The crankshaft coordinates piston travel across the six cylinders. The timing gears connect it to the overhead camshaft.'}
} as const;
export type EnginePart = keyof typeof ENGINE_PARTS;
export type EngineSelection = {part:EnginePart;cylinder:number|null};
export const CYCLE_DEGREES = 720;

export function cycleDegrees(angle:number) {
  if(angle>=0&&angle<=Math.PI*4)return angle*180/Math.PI;
  return ((angle * 180 / Math.PI) % CYCLE_DEGREES + CYCLE_DEGREES) % CYCLE_DEGREES;
}

export function valveCycleSamples(brake:boolean, count=180) {
  return Array.from({length:count+1},(_,index)=>{
    const degrees=index/count*CYCLE_DEGREES;
    const state=cylinderState(degrees*Math.PI/180,5,brake);
    const maximum=VALVE_EVENTS.intake.height;
    return {degrees,intake:state.intakeLift/maximum,exhaust:Math.max(state.exhaustLift,state.brakeLift)/maximum,brake:state.brakeLift/maximum};
  });
}
