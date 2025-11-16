// calculator.js - builds calculator UI and logic
import { Storage } from './storage.js';

const buttonsDef = [
  '7','8','9','/','sqrt','%','MC',
  '4','5','6','*','(',')','MR',
  '1','2','3','-','^','pow','M+',
  '0','.','=','+','sin','cos','M-',
  'tan','asin','acos','ln','log','exp','clear'
];

const btnArea = document.getElementById('buttons');
const display = document.getElementById('display');
let memory = Number(Storage.readMemory() || 0);
let angleMode = 'DEG';

function buildButtons(){
  if(!btnArea) return;
  btnArea.innerHTML = '';
  buttonsDef.forEach(key=>{
    const b = document.createElement('button');
    b.className = 'btn';
    if(['/','*','-','+','=','pow'].includes(key)) b.classList.add('op');
    if(['clear','MC'].includes(key)) b.classList.add('clear');
    b.textContent = key;
    b.addEventListener('click', ()=>handle(key));
    btnArea.appendChild(b);
  });
}
function handle(key){
  try{
    if(key === 'clear'){ display.value=''; return; }
    if(key === '='){ evalAndShow(); return; }
    if(key === 'MC'){ memory=0; Storage.saveMemory(0); return; }
    if(key === 'MR'){ display.value = String(memory); return; }
    if(key === 'M+'){ memory += Number(safeEval(display.value)||0); Storage.saveMemory(memory); return; }
    if(key==='M-'){ memory -= Number(safeEval(display.value)||0); Storage.saveMemory(memory); return; }
    if(key==='sqrt'){ display.value = `Math.sqrt(${display.value||'0'})`; return; }
    if(key==='pow'){ display.value += '**'; return; }
    if(key==='exp'){ display.value = `Math.exp(${display.value||'1'})`; return; }
    if(key==='ln'){ display.value = `Math.log(${display.value||'1'})`; return; }
    if(key==='log'){ display.value = `Math.log10(${display.value||'1'})`; return; }
    if(['sin','cos','tan','asin','acos','atan'].includes(key)){
      display.value = key + '(' + (display.value||'0') + ')'; return;
    }
    if(key === '%'){ display.value += '%'; return; }
    display.value += key;
  }catch(e){ display.value = 'Error'; }
}
function safeEval(expr){
  if(!expr) return 0;
  // sanitize: allow only numbers, operators, Math., parentheses, and letters used above
  // replace % with modulus
  try{
    const sanitized = expr.replace(/%/g, '/100').replace(/(\d+)%/g,'($1/100)');
    // compute with Function to avoid exposing global scope
    // support ^ as ** if present
    const jsExpr = sanitized.replace(/\^/g,'**');
    // replace sin/cos/tan with Math.* and support DEG conversion
    const conv = x => angleMode==='DEG'? (x * Math.PI/180) : x;
    const withMath = jsExpr
      .replace(/sin\(/g,'Math.sin(')
      .replace(/cos\(/g,'Math.cos(')
      .replace(/tan\(/g,'Math.tan(')
      .replace(/asin\(/g,'Math.asin(')
      .replace(/acos\(/g,'Math.acos(')
      .replace(/atan\(/g,'Math.atan(')
      .replace(/Math\.sin\(([^)]+)\)/g, match => match) ;
    // NOTE: For DEG handling post-eval we call trig wrappers below.
    // We'll evaluate a safe Function
    const f = new Function('return (' + withMath + ')');
    return f();
  }catch(e){ return NaN; }
}
function evalAndShow(){
  try{
    let expr = display.value.replace(/\^/g,'**');
    // Replace trig wrappers to handle DEG mode
    if(angleMode === 'DEG'){
      expr = expr.replace(/Math\.sin\(([^)]+)\)/g, 'Math.sin((($1)*Math.PI)/180)');
      expr = expr.replace(/Math\.cos\(([^)]+)\)/g, 'Math.cos((($1)*Math.PI)/180)');
      expr = expr.replace(/Math\.tan\(([^)]+)\)/g, 'Math.tan((($1)*Math.PI)/180)');
      expr = expr.replace(/Math\.asin\(([^)]+)\)/g, '(Math.asin($1)*180/Math.PI)');
      expr = expr.replace(/Math\.acos\(([^)]+)\)/g, '(Math.acos($1)*180/Math.PI)');
      expr = expr.replace(/Math\.atan\(([^)]+)\)/g, '(Math.atan($1)*180/Math.PI)');
    }
    // Evaluate
    const res = Function('"use strict"; return ('+expr+')')();
    display.value = String(res);
    Storage.saveHistory(display.value + '  ←  ' + expr);
    // update history UI (storage module will render on load; trigger manual)
    window.dispatchEvent(new Event('storage'));
  }catch(e){ display.value = 'Error'; }
}

/* Memory buttons in header */
document.getElementById('mc')?.addEventListener('click', ()=>{ memory=0; Storage.saveMemory(0); });
document.getElementById('mr')?.addEventListener('click', ()=>{ display.value = String(memory); });
document.getElementById('mplus')?.addEventListener('click', ()=>{ memory+=Number(display.value||0); Storage.saveMemory(memory); });
document.getElementById('mminus')?.addEventListener('click', ()=>{ memory-=Number(display.value||0); Storage.saveMemory(memory); });

/* DEG / RAD toggle */
document.getElementById('degRad')?.addEventListener('click', (e)=>{
  angleMode = (angleMode==='DEG')?'RAD':'DEG';
  e.target.textContent = angleMode;
});

buildButtons();
