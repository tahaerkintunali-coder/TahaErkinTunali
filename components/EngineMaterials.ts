import * as T from 'three';

/** Small, deterministic machining textures; no image downloads or canvas dependency. */
export function createEngineMaterials(software:boolean){
  const textures:T.DataTexture[]=[];
  const surface=(brushed:boolean)=>{
    const size=256,data=new Uint8Array(size*size*4);
    const noise=(x:number,y:number)=>{let n=Math.imul(x+1,374761393)^Math.imul(y+1,668265263);n=Math.imul(n^(n>>>13),1274126177);return ((n^(n>>>16))>>>0)/4294967295;};
    for(let y=0;y<size;y++)for(let x=0;x<size;x++){
      const grain=brushed?noise(0,y)*.78+noise(x,y)*.22:noise(x,y);
      const value=Math.round(192+grain*63),i=(y*size+x)*4;
      data[i]=data[i+1]=data[i+2]=value;data[i+3]=255;
    }
    const texture=new T.DataTexture(data,size,size,T.RGBAFormat);
    texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(brushed?4:7,brushed?5:7);
    texture.magFilter=T.LinearFilter;texture.minFilter=T.LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.needsUpdate=true;
    textures.push(texture);return texture;
  };
  const brushed=software?null:surface(true),grain=software?null:surface(false);
  const metal=(name:string,color:number,roughness:number,finish:'turned'|'satin'|'cast'='satin')=>{
    const map=finish==='cast'?grain:brushed;
    return new T.MeshPhysicalMaterial({name,color,metalness:1,roughness,
      clearcoat:0,envMapIntensity:finish==='cast'?.8:1,
      roughnessMap:map,bumpMap:map,bumpScale:finish==='cast'?.008:.0012,
      anisotropy:software||finish==='cast'?0:finish==='turned'?.45:.22,
      anisotropyRotation:Math.PI/2});
  };
  const steel=metal('Brushed steel',0xb5b6b2,.36),polished=metal('Ground steel',0xd0d1cd,.23,'turned');
  const cast=metal('Cast iron',0x646560,.72,'cast'),blackSteel=metal('Oxidised steel',0x454742,.43),bronze=metal('Bearing bronze',0x8a7c60,.42,'turned');
  const rubber=new T.MeshPhysicalMaterial({name:'Gasket',color:0x171816,roughness:.96});
  const blockPaint=metal('Engine casting',0x51544e,.68,'cast');
  const cutMetal=metal('Machined cut face',0xbbbbb5,.39),brakeMetal=metal('Brake rocker steel',0xa7aaa3,.38);
  const intakeMetal=metal('Forged intake rocker',0xb3b5ae,.43),exhaustMetal=metal('Forged exhaust rocker',0x979b94,.46);
  const springIntake=metal('Tempered spring steel',0x555851,.31,'turned'),springExhaust=springIntake.clone();
  const valveIntake=metal('Ground valve steel',0xc5c6c0,.26,'turned'),valveExhaust=metal('Exhaust valve steel',0xadb0a8,.30,'turned');
  const guideMetal=metal('Valve guide alloy',0x92958b,.45),housingMetal=metal('Cast bearing housing',0x6a6e65,.60,'cast');
  const bearingMetal=metal('Bearing cap steel',0x90958a,.40),gearMetal=metal('Cut gear steel',0xbabcb4,.33,'turned');
  const pistonMetal=metal('Turned piston alloy',0xcccdc6,.32,'turned');
  const air=new T.MeshPhysicalMaterial({name:'Brake release indicator',color:0xb9c3c2,metalness:0,roughness:.9,transparent:true,opacity:.16,depthWrite:false});
  const materials=[steel,polished,cast,blackSteel,bronze,rubber,blockPaint,cutMetal,brakeMetal,intakeMetal,exhaustMetal,springIntake,springExhaust,valveIntake,valveExhaust,guideMetal,housingMetal,bearingMetal,gearMetal,pistonMetal,air];
  return {steel,polished,cast,blackSteel,bronze,rubber,blockPaint,cutMetal,brakeMetal,intakeMetal,exhaustMetal,springIntake,springExhaust,valveIntake,valveExhaust,guideMetal,housingMetal,bearingMetal,gearMetal,pistonMetal,air,materials,disposeTextures:()=>textures.forEach(texture=>texture.dispose())};
}
