import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createMdfTexture, createFrostedAcrylicTexture, createSublimationGraphicTexture, createCustomEngravingTexture, detectSoftwareGl } from '../../utils/proceduralTextures';
import { RotateCw } from 'lucide-react';

export interface CustomizerState {
  material: 'mdf-pine' | 'mdf-primed' | 'acrylic-frosted' | 'acrylic-clear' | 'acrylic-gold' | 'sublimation-gloss';
  thicknessMm: number;
  widthMm: number;
  heightMm: number;
  shape: 'rect' | 'rounded' | 'circle' | 'arch' | 'hexagon';
  hasStandoffs: boolean;
  engravedText: string;
  finish: string;
}

interface Customizer3DViewerProps {
  config: CustomizerState;
}

export const Customizer3DViewer: React.FC<Customizer3DViewerProps> = ({ config }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const buildPartRef = useRef<(() => void) | null>(null);
  const configRef = useRef(config);
  configRef.current = config;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030508, 0.04);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 3.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight.position.set(4, 5, 4);
    scene.add(dirLight);

    const rimLight = new THREE.PointLight(0x00f2fe, 2.5, 8);
    rimLight.position.set(-3, 2, -1);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xf59e0b, 1.5, 8);
    fillLight.position.set(3, -2, 2);
    scene.add(fillLight);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);
    meshGroupRef.current = rootGroup;

    // Contact Shadow
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 5, 64, 64, 64);
      grad.addColorStop(0, 'rgba(0, 242, 254, 0.25)');
      grad.addColorStop(0.5, 'rgba(5, 7, 10, 0.5)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.8,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.2;
    scene.add(shadowMesh);

    // Active Mesh Container
    let activePartGroup: THREE.Group | null = null;

    const buildPart = () => {
      if (activePartGroup) {
        rootGroup.remove(activePartGroup);
        activePartGroup.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            obj.geometry?.dispose();
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material?.dispose();
            }
          }
        });
      }

      const current = configRef.current;
      activePartGroup = new THREE.Group();

      // Normalize dimensions to 3D unit scale (e.g., 300mm -> 1.5 units)
      const scaleFactor = 1.5 / Math.max(current.widthMm, current.heightMm, 100);
      const w3d = current.widthMm * scaleFactor;
      const h3d = current.heightMm * scaleFactor;
      // Realistic extruded thickness (scaled appropriately for visibility)
      const t3d = Math.max(0.02, (current.thicknessMm / 100) * 1.5);

      // Geometry based on shape
      let geo: THREE.BufferGeometry;

      if (current.shape === 'circle') {
        const radius = Math.min(w3d, h3d) / 2;
        geo = new THREE.CylinderGeometry(radius, radius, t3d, 48);
        // cylinder is along Y by default, rotate so face is Z
        geo.rotateX(Math.PI / 2);
      } else if (current.shape === 'hexagon') {
        const radius = Math.min(w3d, h3d) / 2;
        geo = new THREE.CylinderGeometry(radius, radius, t3d, 6);
        geo.rotateX(Math.PI / 2);
        geo.rotateZ(Math.PI / 6);
      } else {
        // Rectangle, Rounded, or Arch
        geo = new THREE.BoxGeometry(w3d, h3d, t3d);
      }

      // Material setup
      let faceMat: THREE.Material;
      let edgeMat: THREE.Material;

      const mdfTex = createMdfTexture(512, 512);
      const acrylicTex = createFrostedAcrylicTexture(512, 512);
      const subTex = createSublimationGraphicTexture(current.engravedText || 'CUSTOM MMD BLANK');
      const textTex = createCustomEngravingTexture(current.engravedText, current.material);

      if (current.material === 'mdf-pine') {
        faceMat = new THREE.MeshStandardMaterial({
          map: mdfTex,
          roughness: 0.7,
          metalness: 0.05,
        });
        edgeMat = new THREE.MeshStandardMaterial({
          color: 0x2b1505, // Scorched laser edge
          roughness: 0.9,
        });
      } else if (current.material === 'mdf-primed') {
        faceMat = new THREE.MeshStandardMaterial({
          color: 0xf8fafc,
          roughness: 0.4,
          metalness: 0.0,
        });
        edgeMat = new THREE.MeshStandardMaterial({
          color: 0x334155,
          roughness: 0.7,
        });
      } else if (current.material === 'acrylic-frosted') {
        faceMat = new THREE.MeshPhysicalMaterial({
          map: acrylicTex,
          roughness: 0.25,
          transmission: isSoftwareGl ? 0 : 0.85,
          transparent: true,
          opacity: isSoftwareGl ? 0.7 : 0.9,
          ior: 1.49,
          thickness: t3d,
          attenuationColor: new THREE.Color(0x00f2fe),
          clearcoat: 0.9,
        });
        edgeMat = new THREE.MeshStandardMaterial({
          color: 0x00f2fe,
          roughness: 0.2,
          emissive: new THREE.Color(0x00f2fe),
          emissiveIntensity: 0.3,
        });
      } else if (current.material === 'acrylic-gold') {
        faceMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          metalness: 0.95,
          roughness: 0.1,
        });
        edgeMat = new THREE.MeshStandardMaterial({
          color: 0x78350f,
          roughness: 0.5,
        });
      } else if (current.material === 'sublimation-gloss') {
        faceMat = new THREE.MeshPhysicalMaterial({
          map: subTex,
          roughness: 0.05,
          clearcoat: 1.0,
        });
        edgeMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          roughness: 0.7,
        });
      } else {
        // acrylic-clear
        faceMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          roughness: 0.05,
          transmission: isSoftwareGl ? 0 : 0.95,
          transparent: true,
          opacity: isSoftwareGl ? 0.4 : 0.95,
          ior: 1.5,
          thickness: t3d,
          clearcoat: 1.0,
        });
        edgeMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          roughness: 0.1,
        });
      }

      // Main Mesh
      let mainMesh: THREE.Mesh;
      if (geo instanceof THREE.BoxGeometry) {
        mainMesh = new THREE.Mesh(geo, [edgeMat, edgeMat, edgeMat, edgeMat, faceMat, edgeMat]);
      } else {
        mainMesh = new THREE.Mesh(geo, [edgeMat, faceMat, faceMat]);
      }
      activePartGroup.add(mainMesh);

      // Engraved Text Decal Plane on front face if text provided
      if (current.engravedText.trim()) {
        const textGeo = new THREE.PlaneGeometry(w3d * 0.85, h3d * 0.85);
        const textMat = new THREE.MeshBasicMaterial({
          map: textTex,
          transparent: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1,
        });
        const textMesh = new THREE.Mesh(textGeo, textMat);
        textMesh.position.z = t3d / 2 + 0.002;
        activePartGroup.add(textMesh);
      }

      // Standoff Hardware Pins if enabled
      if (current.hasStandoffs) {
        const pinGeo = new THREE.CylinderGeometry(0.04, 0.04, t3d + 0.08, 16);
        const pinMat = new THREE.MeshStandardMaterial({
          color: 0xd1d5db,
          metalness: 0.95,
          roughness: 0.15,
        });

        const offsetW = w3d / 2 - 0.12;
        const offsetH = h3d / 2 - 0.12;
        const pins = [
          [-offsetW, offsetH],
          [offsetW, offsetH],
          [-offsetW, -offsetH],
          [offsetW, -offsetH],
        ];

        pins.forEach(([px, py]) => {
          const pin = new THREE.Mesh(pinGeo, pinMat);
          pin.rotation.x = Math.PI / 2;
          pin.position.set(px, py, 0);
          activePartGroup?.add(pin);
        });
      }

      rootGroup.add(activePartGroup);
    };

    // Keep rebuild function accessible
    buildPartRef.current = buildPart;
    buildPart();

    // Interaction
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
      const dx = (e.clientX - prevX) * 0.008;
      const dy = (e.clientY - prevY) * 0.008;
      rootGroup.rotation.y += dx;
      rootGroup.rotation.x = Math.max(-0.6, Math.min(0.6, rootGroup.rotation.x + dy));
      prevX = e.clientX;
      prevY = e.clientY;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (!isDragging) {
        rootGroup.rotation.y += delta * 0.2;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Rebuild when config changes
    const configObserver = setInterval(() => {
      // Checked via effect below
    }, 100);

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
      clearInterval(configObserver);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);

      shadowGeo.dispose();
      shadowTexture.dispose();
      shadowMat.dispose();

      if (activePartGroup) {
        rootGroup.remove(activePartGroup);
      }

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Trigger rebuild when props update
  useEffect(() => {
    if (buildPartRef.current) {
      buildPartRef.current();
    }
    const group = meshGroupRef.current;
    if (group && group.children.length > 0) {
      group.scale.set(1.05, 1.05, 1.05);
      setTimeout(() => {
        group.scale.set(1, 1, 1);
      }, 150);
    }
  }, [config]);

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] rounded-2xl bg-gradient-to-b from-[#080d18] to-[#04060b] border border-cyan-500/30 overflow-hidden flex items-center justify-center shadow-xl">
      <div className="absolute inset-0 bg-cyber-dots opacity-30 pointer-events-none" />

      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Badge */}
      <div className="absolute top-3 left-4 flex items-center gap-2 bg-black/70 px-3 py-1 rounded-md border border-cyan-500/30 text-[11px] font-mono text-cyan-400">
        <span className="w-2 h-2 rounded-full bg-cyan-400" />
        <span>LIVE 3D SPEC CALIBRATOR</span>
      </div>

      <div className="absolute top-3 right-4 text-xs font-mono text-slate-400 bg-black/60 px-2.5 py-1 rounded border border-slate-800">
        {config.widthMm} × {config.heightMm} mm | {config.thicknessMm}mm
      </div>

      {/* Bottom Hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-mono text-slate-500 tracking-wider uppercase pointer-events-none bg-black/60 px-3 py-0.5 rounded-full border border-slate-800">
        Drag to inspect bevel & laser edges in 360°
      </div>
    </div>
  );
};
