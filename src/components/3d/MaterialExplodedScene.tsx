import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createMdfTexture, createFrostedAcrylicTexture, createSublimationGraphicTexture, detectSoftwareGl } from '../../utils/proceduralTextures';
import { Layers, Info, RotateCw, ZoomIn, CheckCircle } from 'lucide-react';

interface LayerMeta {
  id: string;
  name: string;
  material: string;
  thickness: string;
  role: string;
  spec: string;
  color: string;
}

const LAYERS: LayerMeta[] = [
  {
    id: 'masking',
    name: '1. Laser-Safe Masking Barrier',
    material: 'Polymer Kraft Film',
    thickness: '0.12 mm',
    role: 'Flash & Smoke Shield',
    spec: 'Prevents back-flash scorch marks, easily peels residue-free',
    color: '#38bdf8',
  },
  {
    id: 'acrylic',
    name: '2. Optical Cast Acrylic Face',
    material: 'Cast PMMA (Poly-Methyl Methacrylate)',
    thickness: '4.5 mm',
    role: 'Front Optical Lens / Neon Bed',
    spec: '92.5% light transmission, diamond bevelled edges',
    color: '#00f2fe',
  },
  {
    id: 'sublimation',
    name: '3. Heat-Cured Polymer Glaze',
    material: 'Cross-linked Polyester',
    thickness: '0.25 mm',
    role: 'Sublimation Graphic Receptor',
    spec: 'Bonds molecularly with disperse inks at 200°C',
    color: '#ec4899',
  },
  {
    id: 'mdf',
    name: '4. High-Density Pine MDF Core',
    material: 'Calibrated E1 Fiberboard',
    thickness: '8.0 mm',
    role: 'Structural Rigidity & Weight',
    spec: '780 kg/m³ density with laser micro-kerf tolerance',
    color: '#f59e0b',
  },
  {
    id: 'standoff',
    name: '5. CNC Mounting Hardware & Standoffs',
    material: 'Anodized 6061 Aluminum',
    thickness: '25 mm Standoff',
    role: 'Wall Float & Cable Concealment',
    spec: 'Threaded barrel with silicone gasket cushions',
    color: '#94a3b8',
  },
];

export const MaterialExplodedScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [explosionAmount, setExplosionAmount] = useState(0.65);
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  const stateRef = useRef({
    explosionAmount: 0.65,
    selectedLayer: null as number | null,
    isRotating: true,
  });

  useEffect(() => {
    stateRef.current = { explosionAmount, selectedLayer, isRotating };
  }, [explosionAmount, selectedLayer, isRotating]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();
    const width = container.clientWidth || 700;
    const height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030508, 0.05);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(2.8, 1.8, 4.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    const cyanLight = new THREE.PointLight(0x00f2fe, 3.0, 10);
    cyanLight.position.set(-3, 1, 2);
    scene.add(cyanLight);

    const amberLight = new THREE.PointLight(0xf59e0b, 2.5, 10);
    amberLight.position.set(3, -2, -2);
    scene.add(amberLight);

    // Exploded Group
    const assemblyGroup = new THREE.Group();
    scene.add(assemblyGroup);

    // Common dimensions: 2.2 x 1.6
    const W = 2.2;
    const H = 1.6;

    // Layer Meshes
    const mdfTexture = createMdfTexture(512, 512);
    const acrylicTexture = createFrostedAcrylicTexture(512, 512);
    const subTexture = createSublimationGraphicTexture('MMD COMPOSITE CORE');

    // 1. Masking Layer (Semi-translucent frosted amber film)
    const maskGeo = new THREE.BoxGeometry(W + 0.04, H + 0.04, 0.015);
    const maskMat = new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      roughness: 0.3,
      transparent: true,
      opacity: 0.45,
      wireframe: false,
    });
    const maskMesh = new THREE.Mesh(maskGeo, maskMat);
    assemblyGroup.add(maskMesh);

    // 2. Acrylic Plate
    const acrylicGeo = new THREE.BoxGeometry(W, H, 0.06);
    const acrylicMat = new THREE.MeshPhysicalMaterial({
      map: acrylicTexture,
      roughness: 0.1,
      transmission: isSoftwareGl ? 0 : 0.88,
      transparent: true,
      opacity: isSoftwareGl ? 0.6 : 0.92,
      ior: 1.5,
      thickness: 0.08,
      attenuationColor: new THREE.Color(0x00f2fe),
      clearcoat: 1.0,
    });
    const acrylicMesh = new THREE.Mesh(acrylicGeo, acrylicMat);
    assemblyGroup.add(acrylicMesh);

    // 3. Sublimation Coating Layer
    const subGeo = new THREE.BoxGeometry(W - 0.02, H - 0.02, 0.02);
    const subMat = new THREE.MeshPhysicalMaterial({
      map: subTexture,
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
    });
    const subMesh = new THREE.Mesh(subGeo, subMat);
    assemblyGroup.add(subMesh);

    // 4. MDF Core Board
    const mdfGeo = new THREE.BoxGeometry(W, H, 0.12);
    const mdfMat = new THREE.MeshStandardMaterial({
      map: mdfTexture,
      roughness: 0.7,
      metalness: 0.02,
    });
    const mdfMesh = new THREE.Mesh(mdfGeo, mdfMat);
    assemblyGroup.add(mdfMesh);

    // 5. Standoff Hardware Group
    const standoffGroup = new THREE.Group();
    const pinGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.35, 16);
    const pinMat = new THREE.MeshStandardMaterial({
      color: 0xcfd8dc,
      metalness: 0.95,
      roughness: 0.2,
    });

    const corners = [
      [-(W / 2) + 0.15, H / 2 - 0.15],
      [W / 2 - 0.15, H / 2 - 0.15],
      [-(W / 2) + 0.15, -(H / 2) + 0.15],
      [W / 2 - 0.15, -(H / 2) + 0.15],
    ];

    corners.forEach(([x, y]) => {
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.rotation.x = Math.PI / 2;
      pin.position.set(x, y, 0);
      standoffGroup.add(pin);
    });
    assemblyGroup.add(standoffGroup);

    // Mouse drag rotation
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName !== 'CANVAS') return;
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMouseUp = () => { isDragging = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = (e.clientX - prevX) * 0.007;
      const dy = (e.clientY - prevY) * 0.007;
      assemblyGroup.rotation.y += dx;
      assemblyGroup.rotation.x = Math.max(-0.6, Math.min(0.6, assemblyGroup.rotation.x + dy));
      prevX = e.clientX;
      prevY = e.clientY;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const layerMeshes = [maskMesh, acrylicMesh, subMesh, mdfMesh, standoffGroup];

    // Base Z spacing offsets when fully separated
    const baseSpacings = [1.2, 0.6, 0.0, -0.6, -1.3];

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const factor = stateRef.current.explosionAmount;
      const selected = stateRef.current.selectedLayer;

      // Auto rotation when not dragging
      if (stateRef.current.isRotating && !isDragging) {
        assemblyGroup.rotation.y += delta * 0.35;
      }

      // Smooth layer z positioning based on explosionAmount
      layerMeshes.forEach((mesh, index) => {
        const targetZ = baseSpacings[index] * factor;
        mesh.position.z = THREE.MathUtils.damp(mesh.position.z, targetZ, 5, delta);

        // Highlight selected layer or dim others
        if (selected !== null) {
          const isTarget = selected === index;
          const targetScale = isTarget ? 1.08 : 0.88;
          mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 6);
        } else {
          mesh.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 6);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);

      maskGeo.dispose();
      acrylicGeo.dispose();
      subGeo.dispose();
      mdfGeo.dispose();
      pinGeo.dispose();

      mdfTexture.dispose();
      acrylicTexture.dispose();
      subTexture.dispose();

      maskMat.dispose();
      acrylicMat.dispose();
      subMat.dispose();
      mdfMat.dispose();
      pinMat.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const activeLayerInfo = selectedLayer !== null ? LAYERS[selectedLayer] : null;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#070b13] border border-cyan-500/20 rounded-3xl p-6 lg:p-8 relative overflow-hidden shadow-2xl shadow-black">
      {/* 3D Viewport Column */}
      <div className="lg:col-span-7 relative h-[420px] sm:h-[480px] rounded-2xl bg-gradient-to-b from-black/80 to-[#04060a] border border-slate-800/80 overflow-hidden">
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Viewport Floating Info */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 px-3 py-1 rounded-md border border-cyan-500/30 text-xs font-mono text-cyan-400">
          <Layers className="w-3.5 h-3.5" />
          <span>EXPLODED ARCHITECTURE (5 LAYERS)</span>
        </div>

        {/* Bottom Dock Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-black/80 backdrop-blur-md px-4 py-3 rounded-xl border border-cyan-500/30 shadow-xl flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-mono text-cyan-400 uppercase tracking-wider text-[11px]">Exploded Separation</span>
            <span className="font-mono text-slate-400">{Math.round(explosionAmount * 100)}%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-slate-500">ASSEMBLED</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={explosionAmount}
              onChange={(e) => setExplosionAmount(parseFloat(e.target.value))}
              className="flex-1 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <span className="text-[10px] font-mono text-cyan-400">EXPANDED</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
              {isRotating ? 'Pause Orbit' : 'Rotate'}
            </button>
            <button
              onClick={() => setSelectedLayer(null)}
              className="text-[11px] font-mono text-slate-500 hover:text-white"
            >
              Reset Selection
            </button>
          </div>
        </div>
      </div>

      {/* Layer Specs & Interactive Explorer Column */}
      <div className="lg:col-span-5 flex flex-col justify-center space-y-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400 mb-3">
            <span>PRECISION ENGINEERING ANATOMY</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white tracking-tight">
            Multi-Substrate Fusion Technology
          </h3>
          <p className="text-sm text-slate-400 mt-2">
            Click any layer to isolate its microscopic tolerances, material composition, and CNC manufacturing specs.
          </p>
        </div>

        {/* Layer Selector Stack */}
        <div className="space-y-2">
          {LAYERS.map((layer, idx) => {
            const isSelected = selectedLayer === idx;
            return (
              <button
                key={layer.id}
                onClick={() => setSelectedLayer(isSelected ? null : idx)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-400 shadow-md shadow-cyan-950'
                    : 'bg-black/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3.5 h-3.5 rounded-sm"
                    style={{ backgroundColor: layer.color }}
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{layer.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{layer.material}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-cyan-400 font-semibold">{layer.thickness}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{layer.role}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Layer Technical Callout Card */}
        {activeLayerInfo ? (
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-cyan-300 font-mono font-semibold">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> SPECIFICATION SHEET
              </span>
              <span>CALIBRATED FOR PRODUCTION</span>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">
              {activeLayerInfo.spec}
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-black/30 border border-slate-800 text-xs text-slate-500 font-mono flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-400" />
            <span>Select a layer above or drag the 3D model to inspect internal cross-sections.</span>
          </div>
        )}
      </div>
    </div>
  );
};
