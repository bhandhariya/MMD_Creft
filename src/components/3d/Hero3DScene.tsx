import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { createMdfTexture, createFrostedAcrylicTexture, createSublimationGraphicTexture, detectSoftwareGl } from '../../utils/proceduralTextures';
import { Eye, RotateCw, Sparkles, Layers, Sliders } from 'lucide-react';

const _pointer = new THREE.Vector2();
const _targetRotation = new THREE.Vector2(0, 0);

export const Hero3DScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activePreset, setActivePreset] = useState<'all' | 'mdf' | 'acrylic' | 'sublimation'>('all');
  const [lightingMode, setLightingMode] = useState<'cyber' | 'studio' | 'amber'>('cyber');
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [hudCollapsed, setHudCollapsed] = useState(false);

  // References to communicate with 3D animation loop without tearing down canvas
  const stateRef = useRef({
    activePreset: 'all',
    lightingMode: 'cyber',
    isAutoRotating: true,
  });

  useEffect(() => {
    stateRef.current = { activePreset, lightingMode, isAutoRotating };
  }, [activePreset, lightingMode, isAutoRotating]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030508, 0.045);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 5.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 2. Studio Environment for realistic reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    pmremGenerator.dispose();

    // 3. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0x00f2fe, 0x05070a, 0.6);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const cyanRimLight = new THREE.PointLight(0x00f2fe, 3.5, 12);
    cyanRimLight.position.set(-3, 2, -1);
    scene.add(cyanRimLight);

    const amberFillLight = new THREE.PointLight(0xf59e0b, 2.0, 10);
    amberFillLight.position.set(3, -1, 2);
    scene.add(amberFillLight);

    // 4. Contact Shadow Plane Grounding
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 64);
      grad.addColorStop(0, 'rgba(0, 242, 254, 0.28)');
      grad.addColorStop(0.5, 'rgba(5, 7, 10, 0.7)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(7, 7);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      opacity: 0.8,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.5;
    scene.add(shadowMesh);

    // 5. Hero Subject: Composite 3D Craft Assembly
    const heroGroup = new THREE.Group();
    scene.add(heroGroup);

    // A. Rotating MDF Panel (Multi-tier laser cut craft)
    const mdfGroup = new THREE.Group();
    const mdfTexture = createMdfTexture(512, 512);

    const mdfMat = new THREE.MeshStandardMaterial({
      map: mdfTexture,
      roughness: 0.65,
      metalness: 0.05,
      bumpMap: mdfTexture,
      bumpScale: 0.015,
    });

    const mdfEdgeMat = new THREE.MeshStandardMaterial({
      color: 0x2d1706, // Scorched laser-cut wood edge
      roughness: 0.85,
      metalness: 0.0,
    });

    // Base MDF Panel
    const mdfBaseGeo = new THREE.BoxGeometry(1.6, 2.2, 0.06);
    const mdfBaseMesh = new THREE.Mesh(mdfBaseGeo, [
      mdfEdgeMat, mdfEdgeMat, mdfEdgeMat, mdfEdgeMat, mdfMat, mdfMat
    ]);
    mdfBaseMesh.castShadow = !isSoftwareGl;
    mdfBaseMesh.receiveShadow = !isSoftwareGl;
    mdfGroup.add(mdfBaseMesh);

    // Tier 2: Laser cutout rosette / mandala layer on MDF
    const mdfTier2Geo = new THREE.CylinderGeometry(0.55, 0.55, 0.05, 32);
    const mdfTier2Mesh = new THREE.Mesh(mdfTier2Geo, [mdfEdgeMat, mdfMat, mdfMat]);
    mdfTier2Mesh.rotation.x = Math.PI / 2;
    mdfTier2Mesh.position.z = 0.06;
    mdfGroup.add(mdfTier2Mesh);

    mdfGroup.position.set(-1.0, 0.1, -0.2);
    heroGroup.add(mdfGroup);

    // B. Floating Acrylic Sheet (Frosted ice with neon rim and bevels)
    const acrylicGroup = new THREE.Group();
    const acrylicTexture = createFrostedAcrylicTexture(512, 512);

    const acrylicMat = new THREE.MeshPhysicalMaterial({
      map: acrylicTexture,
      roughness: 0.25,
      transmission: isSoftwareGl ? 0 : 0.85,
      transparent: true,
      opacity: isSoftwareGl ? 0.65 : 0.9,
      ior: 1.49,
      thickness: 0.06,
      attenuationColor: new THREE.Color(0x00f2fe),
      attenuationDistance: 1.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });

    const acrylicEdgeMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      roughness: 0.1,
      metalness: 0.2,
      emissive: new THREE.Color(0x00f2fe),
      emissiveIntensity: 0.35,
    });

    const acrylicGeo = new THREE.BoxGeometry(1.5, 2.0, 0.05);
    const acrylicMesh = new THREE.Mesh(acrylicGeo, [
      acrylicEdgeMat, acrylicEdgeMat, acrylicEdgeMat, acrylicEdgeMat, acrylicMat, acrylicMat
    ]);
    acrylicMesh.castShadow = !isSoftwareGl;
    acrylicGroup.add(acrylicMesh);

    // Standoff mount cylinders (Metallic chrome)
    const standoffGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.1, 16);
    const standoffMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.15,
    });

    const standoffPositions = [
      [-0.65, 0.9],
      [0.65, 0.9],
      [-0.65, -0.9],
      [0.65, -0.9],
    ];

    standoffPositions.forEach(([x, y]) => {
      const pin = new THREE.Mesh(standoffGeo, standoffMat);
      pin.rotation.x = Math.PI / 2;
      pin.position.set(x, y, 0.05);
      acrylicGroup.add(pin);
    });

    acrylicGroup.position.set(0.2, 0.3, 0.5);
    heroGroup.add(acrylicGroup);

    // C. Sublimation Gloss Hardboard Blank
    const subGroup = new THREE.Group();
    const subTexture = createSublimationGraphicTexture();

    const subFaceMat = new THREE.MeshPhysicalMaterial({
      map: subTexture,
      roughness: 0.08,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    const subBackMat = new THREE.MeshStandardMaterial({
      color: 0x8b5a2b, // Brown hardboard backing
      roughness: 0.7,
    });

    const subGeo = new THREE.BoxGeometry(1.3, 1.3, 0.04);
    const subMesh = new THREE.Mesh(subGeo, [
      mdfEdgeMat, mdfEdgeMat, mdfEdgeMat, mdfEdgeMat, subFaceMat, subBackMat
    ]);
    subMesh.castShadow = !isSoftwareGl;
    subGroup.add(subMesh);

    subGroup.position.set(1.2, -0.2, -0.1);
    heroGroup.add(subGroup);

    // 6. Floating Laser Micro-Sparks / Holographic particles
    const particleCount = isSoftwareGl ? 35 : 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8;
      particlePositions[i + 1] = (Math.random() - 0.5) * 5;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x00f2fe,
      size: 0.035,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Interaction and pointer tracking
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      _pointer.set(x, y);
      _targetRotation.x = y * 0.25;
      _targetRotation.y = x * 0.4;
    };

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName !== 'CANVAS') return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleMouseMoveDrag = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = (e.clientX - prevMouseX) * 0.005;
      const deltaY = (e.clientY - prevMouseY) * 0.005;
      heroGroup.rotation.y += deltaX;
      heroGroup.rotation.x = Math.max(-0.5, Math.min(0.5, heroGroup.rotation.x + deltaY));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    window.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMoveDrag);

    // 8. Animation & Render Loop
    let animId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Handle Lighting preset
      const currentMode = stateRef.current.lightingMode;
      if (currentMode === 'cyber') {
        cyanRimLight.color.setHex(0x00f2fe);
        cyanRimLight.intensity = 3.5;
        amberFillLight.intensity = 1.0;
      } else if (currentMode === 'studio') {
        cyanRimLight.color.setHex(0xffffff);
        cyanRimLight.intensity = 2.0;
        amberFillLight.intensity = 2.0;
      } else {
        // Amber warm
        cyanRimLight.color.setHex(0xf59e0b);
        cyanRimLight.intensity = 1.5;
        amberFillLight.intensity = 4.0;
      }

      // Handle preset focus
      const preset = stateRef.current.activePreset;
      const targetMdfScale = preset === 'all' || preset === 'mdf' ? 1 : 0.3;
      const targetAcrylicScale = preset === 'all' || preset === 'acrylic' ? 1 : 0.3;
      const targetSubScale = preset === 'all' || preset === 'sublimation' ? 1 : 0.3;

      mdfGroup.scale.lerp(new THREE.Vector3(targetMdfScale, targetMdfScale, targetMdfScale), delta * 4);
      acrylicGroup.scale.lerp(new THREE.Vector3(targetAcrylicScale, targetAcrylicScale, targetAcrylicScale), delta * 4);
      subGroup.scale.lerp(new THREE.Vector3(targetSubScale, targetSubScale, targetSubScale), delta * 4);

      // Auto rotation & hovering floats
      if (stateRef.current.isAutoRotating && !isDragging) {
        heroGroup.rotation.y += delta * 0.25;
      }

      // Smooth pointer parallax
      if (!isDragging) {
        heroGroup.rotation.x = THREE.MathUtils.damp(heroGroup.rotation.x, _targetRotation.x, 3, delta);
      }

      // Floating wave dynamics for individual panels
      mdfGroup.position.y = 0.1 + Math.sin(elapsed * 1.2) * 0.08;
      mdfGroup.rotation.z = Math.sin(elapsed * 0.8) * 0.03;

      acrylicGroup.position.y = 0.3 + Math.sin(elapsed * 1.4 + 1) * 0.09;
      acrylicGroup.rotation.x = Math.sin(elapsed * 1.0) * 0.05;

      subGroup.position.y = -0.2 + Math.cos(elapsed * 1.3 + 2) * 0.07;
      subGroup.rotation.y = Math.sin(elapsed * 0.9) * 0.04;

      // Particle slow drift
      particles.rotation.y = elapsed * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMoveDrag);

      // Clean up geometries and materials
      mdfBaseGeo.dispose();
      mdfTier2Geo.dispose();
      acrylicGeo.dispose();
      standoffGeo.dispose();
      subGeo.dispose();
      particleGeo.dispose();
      shadowGeo.dispose();

      mdfTexture.dispose();
      acrylicTexture.dispose();
      subTexture.dispose();
      shadowTexture.dispose();

      mdfMat.dispose();
      mdfEdgeMat.dispose();
      acrylicMat.dispose();
      acrylicEdgeMat.dispose();
      standoffMat.dispose();
      subFaceMat.dispose();
      subBackMat.dispose();
      particleMat.dispose();
      shadowMat.dispose();

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[620px] lg:h-[720px] select-none overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-[#070b12] to-[#030508] shadow-2xl shadow-cyan-950/30">
      {/* Background Cybernetic Grid & Glow */}
      <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[350px] h-[250px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Badge & Specs (Zero Pill Discipline - clean structural typography) */}
      <div className="absolute top-5 left-6 right-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-cyan-500/30 text-xs font-mono text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>INTERACTIVE 3D MULTI-SUBSTRATE VIEW</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 hidden sm:inline">DRAG TO ORBIT</span>
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-amber-400 font-bold">MDF:</span> 780 kg/m³
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-cyan-400 font-bold">ACRYLIC:</span> 92% Clr
          </div>
          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-pink-400 font-bold">SUBLIMATION:</span> 200°C
          </div>
        </div>
      </div>

      {/* Collapsible Ergonomic Bottom Control Dock (Follows 3D Skill Directives: Zero Viewport Occlusion) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-2xl pointer-events-auto transition-transform duration-300">
        <div className="flex justify-center -mb-2">
          <button
            onClick={() => setHudCollapsed(!hudCollapsed)}
            className="px-3 py-1 text-[11px] font-mono uppercase tracking-wider bg-black/80 hover:bg-slate-900 text-slate-400 hover:text-cyan-400 rounded-t-lg border-t border-x border-cyan-500/20 backdrop-blur-md transition-colors"
          >
            {hudCollapsed ? '▴ Expand 3D Dock' : '▾ Collapse Controls'}
          </button>
        </div>

        {!hudCollapsed && (
          <div className="glass-panel p-3 rounded-2xl border border-cyan-500/30 shadow-2xl backdrop-blur-xl flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Material Focus Tabs */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActivePreset('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activePreset === 'all'
                    ? 'bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Materials
              </button>
              <button
                onClick={() => setActivePreset('mdf')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activePreset === 'mdf'
                    ? 'bg-amber-500 text-black font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pine MDF
              </button>
              <button
                onClick={() => setActivePreset('acrylic')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activePreset === 'acrylic'
                    ? 'bg-cyan-400 text-black font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Frosted Acrylic
              </button>
              <button
                onClick={() => setActivePreset('sublimation')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activePreset === 'sublimation'
                    ? 'bg-pink-500 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sublimation
              </button>
            </div>

            {/* Lighting & Rotation Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setLightingMode('cyber')}
                  title="Cyber Cyan Lighting"
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono ${
                    lightingMode === 'cyber' ? 'bg-cyan-900/60 text-cyan-300 border border-cyan-500/50' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Cyan
                </button>
                <button
                  onClick={() => setLightingMode('studio')}
                  title="Studio Clean Light"
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono ${
                    lightingMode === 'studio' ? 'bg-slate-700/60 text-white border border-slate-500/50' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Studio
                </button>
                <button
                  onClick={() => setLightingMode('amber')}
                  title="Amber Workshop Glow"
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono ${
                    lightingMode === 'amber' ? 'bg-amber-900/60 text-amber-300 border border-amber-500/50' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Amber
                </button>
              </div>

              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`p-2 rounded-xl border transition-all ${
                  isAutoRotating
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title={isAutoRotating ? 'Pause Rotation' : 'Resume Auto Rotation'}
              >
                <RotateCw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
