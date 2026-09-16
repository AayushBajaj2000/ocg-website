/**
 * Building ASCII — GLSL source.
 *
 * One fragment pass over a fixed cell grid:
 *
 *   1. GRID     gl_FragCoord is quantised to `cell`-sized cells. Everything
 *               downstream is evaluated per cell centre, so the output reads as
 *               a character matrix rather than a continuous image.
 *   2. SAMPLE   the cell centre maps into the shape atlas through `shapeLayout`
 *               (centre xy + size). Two slots are sampled — the outgoing and
 *               incoming shape — and crossfaded by `blend`, which is what makes
 *               one object morph into the next instead of cutting.
 *   3. WOBBLE   the sample coordinate is pushed around by a sine/cosine pair
 *               scaled by sin(reveal * PI), so the distortion peaks mid-reveal
 *               and vanishes at both ends.
 *   4. GATE     a per-cell threshold built from cell hash and radial distance
 *               lets the shape resolve outward from the centre as `reveal`
 *               climbs, rather than fading in uniformly.
 *   5. GLYPH    the surviving value picks one of 9 characters from the glyph
 *               atlas. Cells below the ink threshold fall back to a faint dot,
 *               dimmed in the upper half so the CTA copy above stays readable.
 */

export const VERTEX = `attribute vec2 position;void main(){gl_Position=vec4(position,0.,1.);}`;

// highp matters: iOS GPUs implement mediump as 16-bit floats, where the hash
// (dot(grid, ...) * 43758) and the offscreen-mouse distance overflow to inf/NaN.
//
// Output is premultiplied (the context default). With premultipliedAlpha:false,
// iOS WebKit and Chromium's mobile compositor treat transparent cells
// (rgb 1, a 0) as additive white and the section renders as a white tile.
export const FRAGMENT = `#ifdef GL_FRAGMENT_PRECISION_HIGH
 precision highp float;
 #else
 precision mediump float;
 #endif
 uniform vec2 resolution;uniform vec2 mouse;uniform vec3 shapeLayout;uniform float cell;uniform float clock;
 uniform float reveal;uniform float blend;uniform float previous;uniform float current;
 uniform vec3 ink;uniform float glyphScale;uniform sampler2D masks;uniform sampler2D glyphs;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float sampleMask(vec2 uv,float i){if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.)return 0.;return texture2D(masks,vec2((uv.x+i)/4.,uv.y)).r;}
 void main(){
  vec2 xy=gl_FragCoord.xy;vec2 grid=floor(xy/cell);vec2 center=(grid+.5)*cell;
  float size=shapeLayout.z;
  vec2 uv=(center-shapeLayout.xy)/size+.5;
  float noise=hash(grid);float edge=sin(reveal*3.14159265);
  uv.x+=sin(uv.y*18.+clock*1.5+noise*3.)*.023*edge;
  uv.y+=cos(uv.x*15.+clock+noise)*.014*edge;
  float value=mix(sampleMask(uv,previous),sampleMask(uv,current),blend);
  float order=noise*.55+clamp(length(uv-.5),0.,1.)*.45;
  float gate=smoothstep(order,order+.23,reveal*1.28);
  value*=gate;
  float inside=step(.045,value);
  float shimmer=sin(clock*1.3+noise*22.)*.035;
  float glyphIndex=clamp(floor((value+shimmer)*7.5),1.,8.);
  vec2 within=fract(xy/cell);
  float glyphY=(within.y-.5)/glyphScale+.5;
  float glyph=texture2D(glyphs,vec2((within.x+glyphIndex)/9.,clamp(glyphY,0.,1.))).a*step(0.,glyphY)*step(glyphY,1.);
  float dotAlpha=1.-smoothstep(.065,.13,length(within-.5));
  float fade=1.-smoothstep(.2,.72,length((center-resolution*.5)/resolution));
  float nearMouse=1.-smoothstep(0.,100.,length(center-mouse));
  float belowCopy=1.-smoothstep(.50,.65,center.y/resolution.y);
  float base=.06+belowCopy*(.15+fade*.10)+nearMouse*.08;
  vec3 color=ink;
  float alpha=mix(dotAlpha*base,glyph*(.50+value*.50),inside);
  gl_FragColor=vec4(color*alpha,alpha);
 }`;
