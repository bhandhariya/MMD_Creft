import * as THREE from 'three';

/**
 * Creates a procedural wood grain fiber texture on an HTML5 canvas for realistic MDF rendering.
 */
export function createMdfTexture(width = 512, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Warm fiber base
    ctx.fillStyle = '#b88a56';
    ctx.fillRect(0, 0, width, height);

    // Wood fiber / composite particulate noise
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 28;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.9));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.7));
    }
    ctx.putImageData(imgData, 0, 0);

    // Subtle pressed fiber streaks
    ctx.strokeStyle = 'rgba(120, 80, 40, 0.12)';
    ctx.lineWidth = 1.5;
    for (let y = 0; y < height; y += 4) {
      if (Math.random() > 0.4) {
        ctx.beginPath();
        ctx.moveTo(0, y + (Math.random() - 0.5) * 4);
        ctx.bezierCurveTo(
          width * 0.33,
          y + (Math.random() - 0.5) * 6,
          width * 0.66,
          y + (Math.random() - 0.5) * 6,
          width,
          y + (Math.random() - 0.5) * 4
        );
        ctx.stroke();
      }
    }

    // Laser cut burnt edge border indicator
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0, 'rgba(50, 25, 5, 0.45)');
    grad.addColorStop(0.04, 'rgba(50, 25, 5, 0)');
    grad.addColorStop(0.96, 'rgba(50, 25, 5, 0)');
    grad.addColorStop(1, 'rgba(50, 25, 5, 0.45)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Creates a procedural holographic frosted acrylic surface texture.
 */
export function createFrostedAcrylicTexture(width = 512, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Pale translucent ice cyan base
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#e0f7fa');
    grad.addColorStop(0.5, '#f0fdfa');
    grad.addColorStop(1, '#cffafe');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Micro frosted noise
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const frost = (Math.random() - 0.5) * 18;
      data[i] = Math.min(255, Math.max(0, data[i] + frost));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + frost));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + frost + 4));
    }
    ctx.putImageData(imgData, 0, 0);

    // Subtle laser grid alignment markings
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 12]);
    for (let x = 32; x < width; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 32; y < height; y += 64) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates high-gloss dye-sublimation test print pattern on white ceramic-polymer.
 */
export function createSublimationGraphicTexture(label = 'MMD CRAFT HIGH-GLOSS BLANK', width = 512, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Clean ceramic ultra-white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Vivid geometric spectrum gradient (simulating high-gamut dye sublimation)
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#00f2fe');
    grad.addColorStop(0.35, '#4facfe');
    grad.addColorStop(0.7, '#7928ca');
    grad.addColorStop(1, '#ff0080');

    // Decorative geometric laser hexagon lattice
    ctx.strokeStyle = grad;
    ctx.lineWidth = 4;
    ctx.save();
    ctx.translate(width / 2, height / 2);
    for (let r = 0; r < 6; r++) {
      ctx.beginPath();
      for (let a = 0; a < 6; a++) {
        const rad = (a * 60 * Math.PI) / 180;
        const radDist = 80 + r * 28;
        const px = Math.cos(rad) * radDist;
        const py = Math.sin(rad) * radDist;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Modern center typography
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 22px "Orbitron", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('MMD CRAFT', 0, -20);

    ctx.fillStyle = '#06b6d4';
    ctx.font = '600 13px "Space Grotesk", sans-serif';
    ctx.fillText('PRECISION SUBLIMATION BLANK', 0, 10);

    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    ctx.fillText('CALIBRATED 200°C HEAT CURED', 0, 32);

    ctx.restore();

    // High gloss corner target registers
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    const corner = 24;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(corner, corner + 20);
    ctx.lineTo(corner, corner);
    ctx.lineTo(corner + 20, corner);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(width - corner - 20, corner);
    ctx.lineTo(width - corner, corner);
    ctx.lineTo(width - corner, corner + 20);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(corner, height - corner - 20);
    ctx.lineTo(corner, height - corner);
    ctx.lineTo(corner + 20, height - corner);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(width - corner - 20, height - corner);
    ctx.lineTo(width - corner, height - corner);
    ctx.lineTo(width - corner, height - corner - 20);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates custom text/logo texture for the 3D customizer live view
 */
export function createCustomEngravingTexture(text: string, material: string, width = 512, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.clearRect(0, 0, width, height);

    if (text.trim()) {
      ctx.save();
      ctx.translate(width / 2, height / 2);

      // Engraved appearance based on material
      if (material.includes('mdf')) {
        // Dark scorched laser burn
        ctx.fillStyle = 'rgba(40, 20, 5, 0.9)';
        ctx.shadowColor = 'rgba(20, 10, 0, 0.8)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
      } else if (material.includes('acrylic')) {
        // Laser frosted white / neon cyan glow
        ctx.fillStyle = 'rgba(240, 255, 255, 0.95)';
        ctx.shadowColor = 'rgba(0, 242, 254, 0.8)';
        ctx.shadowBlur = 8;
      } else {
        // High contrast sublimation print
        ctx.fillStyle = '#0f172a';
        ctx.shadowColor = 'rgba(0,0,0,0.15)';
        ctx.shadowBlur = 2;
      }

      ctx.font = 'bold 36px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Auto wrap long text if needed
      const maxTextWidth = width * 0.8;
      if (ctx.measureText(text).width > maxTextWidth) {
        ctx.font = 'bold 24px "Space Grotesk", sans-serif';
      }

      ctx.fillText(text.toUpperCase(), 0, 0);

      // Subtle border contour
      ctx.strokeStyle = material.includes('mdf') ? 'rgba(50, 25, 5, 0.5)' : 'rgba(0, 242, 254, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-width * 0.42, -height * 0.42, width * 0.84, height * 0.84);

      ctx.restore();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Detects software WebGL renderer (SwiftShader, llvmpipe, WARP) to adjust performance.
 */
export function detectSoftwareGl(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const gl = document.createElement('canvas').getContext('webgl2') ||
               document.createElement('canvas').getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return false;
  }
}
