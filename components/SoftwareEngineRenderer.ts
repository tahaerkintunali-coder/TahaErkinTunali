import * as T from 'three';

// Canvas fallback for devices and company browsers without a WebGL context.
// It projects the same 3D mesh and animation, rather than substituting a still.
type Face = { points: number[]; depth: number; color: string; wire: boolean };
export class SoftwareEngineRenderer {
  readonly domElement = document.createElement('canvas');
  readonly isSoftwareRenderer = true;
  toneMapping = T.NoToneMapping;
  toneMappingExposure = 1;
  private context: CanvasRenderingContext2D;
  private width = 1;
  private height = 1;
  private ratio = 1;
  private projection = new T.Matrix4();
  private a = new T.Vector3();
  private b = new T.Vector3();
  private c = new T.Vector3();
  private normal = new T.Vector3();
  private edge = new T.Vector3();
  private smooth = new T.Vector3();
  private normalMatrix = new T.Matrix3();
  private reflected = new T.Vector3();
  private center = new T.Vector3();
  private view = new T.Vector3();
  private half = new T.Vector3();
  private key = new T.Vector3(-0.4, 0.8, 0.7).normalize();
  private rim = new T.Vector3(0.5, 0.3, -0.8).normalize();
  private palettes = new Map<string, string>();

  constructor() {
    const context = this.domElement.getContext('2d', { alpha: true });
    if (!context) throw new Error('Canvas is unavailable');
    this.context = context;
  }
  setPixelRatio(value: number) { this.ratio = Math.min(value, 1.3); }
  setClearColor(_color: number, _alpha: number) {}
  setSize(width: number, height: number) {
    this.width = width; this.height = height;
    this.domElement.width = Math.round(width * this.ratio);
    this.domElement.height = Math.round(height * this.ratio);
    this.domElement.style.width = `${width}px`; this.domElement.style.height = `${height}px`;
  }
  dispose() { this.palettes.clear(); }
  render(scene: T.Scene, camera: T.PerspectiveCamera) {
    scene.updateMatrixWorld(); camera.updateMatrixWorld();
    this.projection.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    const faces: Face[] = [];
    const w = this.width / 2, h = this.height / 2;
    const { a, b, c, normal, edge, center, view, half } = this;
    scene.traverseVisible(object => {
      if (!(object instanceof T.Mesh) || !object.visible) return;
      const material = object.material as T.MeshStandardMaterial;
      if (material.opacity < 0.2 || !material.color) return;
      const positions = object.geometry.getAttribute('position');
      const index = object.geometry.index;
      const normals=object.geometry.getAttribute('normal');
      this.normalMatrix.getNormalMatrix(object.matrixWorld);
      const count = index ? index.count : positions.count;
      const base = material.color;
      for (let i = 0; i < count; i += 3) {
        a.fromBufferAttribute(positions, index ? index.getX(i) : i).applyMatrix4(object.matrixWorld);
        b.fromBufferAttribute(positions, index ? index.getX(i + 1) : i + 1).applyMatrix4(object.matrixWorld);
        c.fromBufferAttribute(positions, index ? index.getX(i + 2) : i + 2).applyMatrix4(object.matrixWorld);
        normal.subVectors(b, a).cross(edge.subVectors(c, a)).normalize();
        center.copy(a).add(b).add(c).multiplyScalar(1 / 3);
        view.subVectors(camera.position, center).normalize();
        if (normal.dot(view) < 0 && material.side !== T.DoubleSide) continue;
        if(normals){
          this.smooth.set(0,0,0);
          for(let j=0;j<3;j++){edge.fromBufferAttribute(normals,index?index.getX(i+j):i+j);this.smooth.add(edge);}
          normal.copy(this.smooth).applyNormalMatrix(this.normalMatrix);
        }
        // Neutral studio reflections, shaded in linear space before a filmic
        // response. Highlights retain detail instead of clipping to flat white.
        const ndv=Math.max(0,normal.dot(view));
        this.reflected.copy(normal).multiplyScalar(2*ndv).sub(view).normalize();
        const rough=(material.roughness??.3)*.87,metal=material.metalness??0;
        const band=(d:number,width:number)=>Math.exp(-Math.pow(d/width,4));
        const refl=this.reflected;
        const boxes=band(refl.y-.57,.14+rough*.31)*1.75+band(refl.x+.63,.065+rough*.24)*1.35+band(refl.z-.9,.06+rough*.14)*.48;
        const diffuse=.14+Math.max(0,normal.dot(this.key))*.55+Math.max(0,normal.dot(this.rim))*.20;
        const facing=.035+Math.pow(1-ndv,4)*.18;
        const luminance=diffuse*(1-metal)+metal*(facing+boxes*(1-rough*.48));
        half.copy(this.key).add(view).normalize();
        const specular=Math.pow(Math.max(0,normal.dot(half)),Math.max(8,90*(1-rough)))*.12;
        const shade=Math.round(luminance*80),shine=Math.round(specular*32);
        const colorKey=`${material.uuid}/${shade}/${shine}`;
        let color=this.palettes.get(colorKey);
        if(!color){
          const channel=(v:number,emissive:number)=>{
            const linear=(v*shade/80+shine/32+emissive*(material.emissiveIntensity??0))*this.toneMappingExposure;
            const film=Math.max(0,Math.min(1,(linear*(2.51*linear+.03))/(linear*(2.43*linear+.59)+.14)));
            const srgb=film<=.0031308?12.92*film:1.055*Math.pow(film,1/2.4)-.055;
            return Math.round(srgb*255);
          };
          color=`rgb(${channel(base.r,material.emissive?.r??0)},${channel(base.g,material.emissive?.g??0)},${channel(base.b,material.emissive?.b??0)})`;
          this.palettes.set(colorKey,color);
        }
        a.applyMatrix4(this.projection); b.applyMatrix4(this.projection); c.applyMatrix4(this.projection);
        if (a.z > 1 || b.z > 1 || c.z > 1) continue;
        faces.push({ points: [(a.x + 1) * w, (1 - a.y) * h, (b.x + 1) * w, (1 - b.y) * h, (c.x + 1) * w, (1 - c.y) * h], depth: (a.z + b.z + c.z) / 3, color, wire: material.wireframe });
      }
    });
    faces.sort((a, b) => b.depth - a.depth);
    const ctx = this.context;
    ctx.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.lineJoin = 'round';
    for (const face of faces) {
      const p = face.points;
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[2], p[3]); ctx.lineTo(p[4], p[5]); ctx.closePath();
      if (face.wire) { ctx.strokeStyle = '#bac0c2'; ctx.lineWidth = 0.5; ctx.stroke(); }
      else { ctx.fillStyle = face.color; ctx.fill(); ctx.strokeStyle = face.color; ctx.lineWidth = 0.45; ctx.stroke(); }
    }
  }
}
