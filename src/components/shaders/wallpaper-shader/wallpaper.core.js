// Living wallpaper for the home OS hero. The painting is drawn through a fragment
// shader that only ever nudges texture coordinates: wind rolls through the grass, the
// sky breathes, and each whale swims in place inside its own soft-edged region.
// Nothing is composited on top, so the artwork stays exactly the artwork.

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// Coordinates below are in image space: origin top-left, both axes 0-1.
const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform float uTime;
uniform float uAspect;
uniform float uStrength;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

// A whale, described by where its tail and head sit in the painting. It swims in place:
// a wave travels down the body (strongest at the fluke, nearly still at the head) while
// the whole animal drifts on a slower rhythm. The mask fades to zero past the body so the
// surrounding clouds are pulled along softly instead of tearing.
vec2 swim(vec2 uv, vec2 tail, vec2 head, float girth, float phase, float amount) {
  vec2 scale = vec2(uAspect, 1.0);
  vec2 axis = (head - tail) * scale;
  float len = length(axis);
  vec2 dir = axis / len;
  vec2 perp = vec2(-dir.y, dir.x);

  vec2 p = (uv - tail) * scale;
  float along = dot(p, dir) / len;
  float across = dot(p, perp);

  float mask = smoothstep(-0.35, 0.05, along) * (1.0 - smoothstep(0.9, 1.25, along));
  mask *= 1.0 - smoothstep(girth * 0.45, girth, abs(across));

  float wave = sin(along * 4.5 - uTime * 1.15 + phase) * mix(1.0, 0.2, clamp(along, 0.0, 1.0));
  vec2 drift = vec2(sin(uTime * 0.21 + phase), sin(uTime * 0.34 + phase * 1.7) * 0.8);

  vec2 move = perp * wave * amount + drift * amount * 0.7;
  return mask * move / scale;
}

void main() {
  vec2 uv = vUv;

  // The meadow starts at the horizon and sways harder toward the viewer.
  float grass = smoothstep(0.68, 0.92, uv.y);
  // Keep the desks (and the name-tag hotspots over them) perfectly still.
  vec2 desk = (uv - vec2(0.5, 0.79)) / vec2(0.17, 0.075);
  grass *= smoothstep(0.8, 1.35, length(desk));

  // Gusts travel left to right as broad bands, with finer blades riding on them.
  float gust = noise(vec2(uv.x * 3.0 - uTime * 0.22, uv.y * 5.0));
  float blades = sin(uv.x * 90.0 + uv.y * 40.0 - uTime * 1.7 + gust * 6.0);
  vec2 offset = vec2(blades * 0.0016 + (gust - 0.5) * 0.004, 0.0) * grass;

  // Sky: a slow, large-scale drift so the clouds never sit quite still.
  float sky = 1.0 - smoothstep(0.55, 0.72, uv.y);
  vec2 flow = vec2(
    noise(uv * 2.5 + vec2(uTime * 0.035, 0.0)),
    noise(uv * 2.5 + vec2(7.3, uTime * 0.03))
  ) - 0.5;
  offset += flow * 0.005 * sky;

  offset += swim(uv, vec2(0.205, 0.610), vec2(0.435, 0.420), 0.150, 0.0, 0.016);
  offset += swim(uv, vec2(0.405, 0.535), vec2(0.522, 0.530), 0.055, 1.9, 0.008);
  offset += swim(uv, vec2(0.568, 0.440), vec2(0.695, 0.410), 0.070, 3.4, 0.010);
  offset += swim(uv, vec2(0.625, 0.650), vec2(0.910, 0.420), 0.150, 4.8, 0.016);

  vec3 colour = texture2D(uTex, uv + offset * uStrength).rgb;
  // Light catches the grass where a gust passes.
  colour += (gust - 0.5) * 0.07 * grass * uStrength;

  gl_FragColor = vec4(colour, 1.0);
}`;

export const WALLPAPER_DEFAULTS = {
  strength: 1,
  speed: 1,
  maxFps: 30,
  maxDpr: 1.5,
};

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`wallpaper shader: ${log}`);
  }
  return shader;
}

/**
 * @param {HTMLElement} host
 * @param {HTMLImageElement} image
 * @param {Partial<import('./wallpaper.core').WallpaperOptions>} [options]
 * @returns {import('./wallpaper.core').WallpaperHandle | null}
 */
export function createWallpaper(host, image, options = {}) {
  const opts = { ...WALLPAPER_DEFAULTS, ...options };

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  // Reduced motion keeps the plain <img>: there is nothing for a canvas to add.
  if (motion.matches) return null;

  const canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    opacity: "0",
    transition: "opacity 600ms ease",
  });

  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  // A software rasteriser would run this per-pixel on the CPU — not worth it.
  const dbg = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
  if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) return null;

  let prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (error) {
    console.warn(error);
    return null;
  }
  gl.useProgram(prog);

  // One oversized triangle covers the viewport.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const loc = {
    uTime: gl.getUniformLocation(prog, "uTime"),
    uAspect: gl.getUniformLocation(prog, "uAspect"),
    uStrength: gl.getUniformLocation(prog, "uStrength"),
  };

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  let destroyed = false;
  let ready = false;

  // Upload whatever candidate the browser picked for the <img>. It can upgrade to a
  // larger one after a resize, so this re-runs on every `load`.
  function upload() {
    if (destroyed || !image.complete || image.naturalWidth === 0) return;
    try {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    } catch (error) {
      console.warn(error);
      return;
    }
    if (!ready) {
      ready = true;
      host.appendChild(canvas);
      requestAnimationFrame(() => (canvas.style.opacity = "1"));
    }
    sync();
  }
  image.addEventListener("load", upload);

  function resize() {
    const rect = host.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, Math.max(1, opts.maxDpr));
    // No point rendering past the source: the shader only resamples it.
    const scale = Math.min(1, 2880 / Math.max(1, rect.width * dpr));
    const w = Math.max(1, Math.round(rect.width * dpr * scale));
    const h = Math.max(1, Math.round(rect.height * dpr * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, w, h);
  }

  // Resizing a canvas clears it. Observer callbacks run before paint, so redrawing right
  // here (rather than on the loop's next tick) means a cleared frame is never shown — the
  // hero resizes every frame while it grows to full screen.
  const ro = new ResizeObserver(() => {
    resize();
    if (ready) draw(0);
    sync();
  });
  ro.observe(host);

  let visible = true;
  const io = new IntersectionObserver(
    (entries) => {
      visible = entries.some((entry) => entry.isIntersecting);
      sync();
    },
    { rootMargin: "96px" },
  );
  io.observe(host);

  const onVisibilityChange = () => sync();
  document.addEventListener("visibilitychange", onVisibilityChange);
  motion.addEventListener("change", onVisibilityChange);

  let raf = 0;
  let last = 0;
  let time = 0;

  function draw(dt) {
    time += dt * opts.speed;
    gl.uniform1f(loc.uTime, time);
    gl.uniform1f(loc.uAspect, canvas.width / Math.max(1, canvas.height));
    gl.uniform1f(loc.uStrength, opts.strength);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = (now - last) / 1000;
    if (dt < 1 / Math.max(1, opts.maxFps)) return;
    last = now;
    // Clamp so a backgrounded tab does not lurch on return.
    draw(Math.min(dt, 1 / 20));
  }

  function stop() {
    if (!raf) return;
    cancelAnimationFrame(raf);
    raf = 0;
  }

  function sync() {
    if (!ready) return;
    if (!visible || document.hidden || motion.matches) {
      stop();
      // A resize clears the canvas, so a held frame has to be redrawn.
      draw(0);
      return;
    }
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  resize();
  upload();

  return {
    setOptions(next) {
      Object.assign(opts, next);
    },
    destroy() {
      destroyed = true;
      stop();
      ro.disconnect();
      io.disconnect();
      image.removeEventListener("load", upload);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      motion.removeEventListener("change", onVisibilityChange);
      gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(prog);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    },
  };
}
