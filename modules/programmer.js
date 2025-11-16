// programmer.js - conversions and bitwise
const pIn = document.getElementById('prog-input');
const pOut = document.getElementById('prog-output');

document.getElementById('toBin')?.addEventListener('click', ()=>{
  const n = Number(pIn.value);
  pOut.textContent = isNaN(n)?'Invalid': (n>>>0).toString(2);
});
document.getElementById('toDec')?.addEventListener('click', ()=>{
  const s = pIn.value.trim();
  if(/^[01]+$/.test(s)) pOut.textContent = parseInt(s,2);
  else pOut.textContent = 'Invalid binary';
});
document.getElementById('toHex')?.addEventListener('click', ()=>{
  const n = Number(pIn.value);
  pOut.textContent = isNaN(n)?'Invalid': (n>>>0).toString(16).toUpperCase();
});
function bitOp(op){
  const parts = pIn.value.split(',');
  if(parts.length<2) { pOut.textContent='Enter two ints separated by comma'; return; }
  const a=Number(parts[0]), b=Number(parts[1]);
  if(op==='AND') pOut.textContent = (a & b);
  if(op==='OR') pOut.textContent = (a | b);
  if(op==='XOR') pOut.textContent = (a ^ b);
}
document.getElementById('bitAnd')?.addEventListener('click', ()=>bitOp('AND'));
document.getElementById('bitOr')?.addEventListener('click', ()=>bitOp('OR'));
document.getElementById('bitXor')?.addEventListener('click', ()=>bitOp('XOR'));
