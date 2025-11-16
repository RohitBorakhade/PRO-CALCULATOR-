// graph.js - simple plotter
const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const input = document.getElementById('graph-fn');
const plotBtn = document.getElementById('plotBtn');
const clearPlot = document.getElementById('clearPlot');

function clearCanvas(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // draw axes
  ctx.strokeStyle = '#223';
  ctx.beginPath(); ctx.moveTo(0,canvas.height/2); ctx.lineTo(canvas.width,canvas.height/2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(canvas.width/2,0); ctx.lineTo(canvas.width/2,canvas.height); ctx.stroke();
}
function plotFunction(){
  const expr = input.value.trim();
  if(!expr) return alert('Enter function');
  clearCanvas();
  try{
    const fn = makeFn(expr);
    // view window: x from -10 to 10
    const xmin=-10,xmax=10;
    const w = canvas.width, h = canvas.height;
    ctx.beginPath();
    ctx.strokeStyle = '#00f6ff';
    for(let px=0; px<=w; px++){
      const x = xmin + (px/w)*(xmax-xmin);
      let y = fn(x);
      if(!isFinite(y)) { continue; }
      const py = h/2 - (y*(h/20)); // scale y: 1 unit = h/20 px
      if(px===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.stroke();
  }catch(e){ alert('Plot error: '+e.message); }
}
function makeFn(expr){
  // simple parser: replace ^ with ** and common funcs
  const sanitized = expr.replace(/\^/g,'**')
    .replace(/sin\(/g,'Math.sin(').replace(/cos\(/g,'Math.cos(')
    .replace(/tan\(/g,'Math.tan(').replace(/exp\(/g,'Math.exp(')
    .replace(/log\(/g,'Math.log(');
  // return function
  return function(x){
    return Function('x','with(Math){ return ('+sanitized+'); }')(x);
  };
}
plotBtn?.addEventListener('click', plotFunction);
clearPlot?.addEventListener('click', clearCanvas);
clearCanvas();
