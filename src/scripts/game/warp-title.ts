// 作品の詳細の、ゆがむ見出し。見出しの文字を画像にして WebGL に渡し、
// カーソルの跡に沿った波紋と、色のずれをシェーダーで足す。WebGL が使えなければ何もしない（<h1> がそのまま見える）

const MAX_POINTS = 10;

const VERTEX = `attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;uv.y=1.-uv.y;gl_Position=vec4(p,0.,1.);}`;

// テクスチャは文字の形だけ（透明の地に白い文字）。色は ink で塗り、文字の外は透明にして背景のドットを見せる。
// 赤・緑・青で少しずつずらして読むので、波が強いところほど文字の縁に色が出る。
// P[i] = (x, y, 経過秒)。経過秒が負なら使わない
const FRAGMENT = `precision mediump float;
varying vec2 uv;uniform sampler2D tex;uniform float t;uniform vec2 res;uniform vec3 P[${MAX_POINTS}];
uniform vec3 ink;uniform vec3 ground;
vec3 split(vec2 u,vec2 o){return vec3(texture2D(tex,u+o).a,texture2D(tex,u).a,texture2D(tex,u-o).a);}
void main(){
  vec2 d=vec2(0.);float asp=res.x/res.y;
  for(int i=0;i<${MAX_POINTS};i++){
    vec3 q=P[i];if(q.z<0.)continue;
    vec2 v=uv-q.xy;v.x*=asp;float r=length(v);
    float w=sin(r*48.-q.z*11.)*exp(-r*5.)*exp(-q.z*1.6);
    d+=v/(r+.001)*w*.016;
  }
  d+=vec2(sin(uv.y*7.+t*.8),0.)*.0012;
  vec2 o=vec2(length(d)*.9+.0007,0.);
  vec3 m=split(uv+d,o);
  float a=max(m.r,max(m.g,m.b));
  gl_FragColor=vec4(mix(ground,ink,m),a);
}`;

type Point = { x: number; y: number; t: number };

export const mountWarp = (host: HTMLElement): (() => void) => {
  const title = host.dataset.warp ?? '';
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', { premultipliedAlpha: false });
  if (!gl) return () => {};

  const shader = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERTEX));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAGMENT));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return () => {};
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const uT = gl.getUniformLocation(prog, 't');
  const uRes = gl.getUniformLocation(prog, 'res');
  const uP = gl.getUniformLocation(prog, 'P[0]');
  const uInk = gl.getUniformLocation(prog, 'ink');
  const uGround = gl.getUniformLocation(prog, 'ground');
  // 合成はしない。シェーダーが出す色と不透明度をそのまま書き、ブラウザに背景と重ねてもらう
  gl.clearColor(0, 0, 0, 0);

  // CSS の色を 0〜1 の RGB にする。2D canvas に一度入れると #rrggbb の形にそろう
  const toRgb = (c: CanvasRenderingContext2D, color: string): [number, number, number] => {
    c.fillStyle = color.trim();
    const hex = String(c.fillStyle).replace('#', '');
    return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
  };

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  let W = 0;
  let H = 0;
  // 見出しの <h1> と同じ大きさ・位置で文字を描き、テクスチャにする
  const paint = () => {
    const r = host.getBoundingClientRect();
    const h1 = host.querySelector('h1');
    if (!h1 || r.width < 10) return;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    W = r.width;
    H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    const css = getComputedStyle(document.documentElement);
    const hs = getComputedStyle(h1);
    const hr = h1.getBoundingClientRect();
    const off = document.createElement('canvas');
    off.width = canvas.width;
    off.height = canvas.height;
    const c = off.getContext('2d')!;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    gl.uniform3fv(uInk, toRgb(c, css.getPropertyValue('--ink')));
    gl.uniform3fv(uGround, toRgb(c, css.getPropertyValue('--ground')));
    c.fillStyle = '#ffffff';
    c.font = `900 ${hs.fontSize} "Roboto Flex", sans-serif`;
    c.textBaseline = 'bottom';
    let fs = parseFloat(hs.fontSize);
    const fit = W / Math.max(1, c.measureText(title).width);
    if (fit < 1) {
      fs *= fit;
      c.font = `900 ${fs}px "Roboto Flex", sans-serif`;
    }
    c.fillText(title, hr.left - r.left, hr.bottom - r.top);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, off);
  };

  // 開いた瞬間に、見出しの左下から 1 回だけ大きな波紋を出す
  const now = performance.now();
  const points: Point[] = [0, 120, 240].map((d) => ({ x: 0.1, y: 0.75, t: now - d }));
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    const p = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, t: performance.now() };
    const last = points[0];
    if (!last || Math.hypot(p.x - last.x, p.y - last.y) > 0.04) {
      points.unshift(p);
      points.length = Math.min(MAX_POINTS, points.length);
    }
  };

  const arr = new Float32Array(MAX_POINTS * 3);
  let raf = 0;
  const loop = (t: number) => {
    for (let i = 0; i < MAX_POINTS; i++) {
      const p = points[i];
      arr[i * 3] = p ? p.x : 0;
      arr[i * 3 + 1] = p ? p.y : 0;
      arr[i * 3 + 2] = p ? (t - p.t) / 1000 : -1;
    }
    gl.uniform1f(uT, t / 1000);
    gl.uniform2f(uRes, W, H);
    gl.uniform3fv(uP, arr);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    raf = requestAnimationFrame(loop);
  };

  const ro = new ResizeObserver(paint);
  host.appendChild(canvas);
  paint();
  host.classList.add('is-gl');
  ro.observe(host);
  host.addEventListener('pointermove', onMove);
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    host.removeEventListener('pointermove', onMove);
    host.classList.remove('is-gl');
    canvas.remove();
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
};
