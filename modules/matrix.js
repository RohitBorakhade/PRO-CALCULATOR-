// matrix.js - parse matrix, add, multiply, det, inverse (small matrices)
const matA = document.getElementById('mat-a');
const matB = document.getElementById('mat-b');
const matOut = document.getElementById('mat-output');

function parseMat(s){
  if(!s) return null;
  const rows = s.split(';').map(r=> r.split(',').map(c=>Number(c)));
  return rows;
}
function matAdd(A,B){
  if(A.length !== B.length || A[0].length !== B[0].length) throw 'Dimension mismatch';
  return A.map((r,i)=> r.map((v,j)=> v + B[i][j]));
}
function matMul(A,B){
  if(A[0].length !== B.length) throw 'Dimension mismatch';
  const R = Array.from({length:A.length}, ()=> Array(B[0].length).fill(0));
  for(let i=0;i<A.length;i++) for(let j=0;j<B[0].length;j++) for(let k=0;k<A[0].length;k++) R[i][j]+=A[i][k]*B[k][j];
  return R;
}
function det2(A){ return A[0][0]*A[1][1]-A[0][1]*A[1][0]; }
function det(A){
  if(A.length===1) return A[0][0];
  if(A.length===2) return det2(A);
  // recursive
  let sum=0;
  for(let j=0;j<A.length;j++){
    const sub = A.slice(1).map(r=> r.filter((_,c)=> c!==j));
    sum += ((j%2===0?1:-1) * A[0][j] * det(sub));
  }
  return sum;
}
function inv(A){
  const d = det(A);
  if(d===0) throw 'Singular';
  if(A.length===2){
    const [[a,b],[c,d2]] = A;
    return [[d2/d, -b/d],[-c/d, a/d]];
  }
  // adjugate method (slow)
  const n = A.length;
  const cof = Array.from({length:n}, ()=> Array(n).fill(0));
  for(let i=0;i<n;i++) for(let j=0;j<n;j++){
    const sub = A.filter((_,r)=> r!==i).map(rw=> rw.filter((_,c)=> c!==j));
    cof[i][j] = (( (i+j)%2===0?1:-1) * det(sub));
  }
  // transpose cof and divide by det
  const adj = cof[0].map((_,i)=> cof.map(r=> r[i]));
  return adj.map(r=> r.map(v=> v/d));
}

// hooks
document.getElementById('mat-add')?.addEventListener('click', ()=>{
  try{
    const A=parseMat(matA.value), B=parseMat(matB.value);
    matOut.textContent = JSON.stringify(matAdd(A,B));
  }catch(e){ matOut.textContent = 'Error: '+e; }
});
document.getElementById('mat-mul')?.addEventListener('click', ()=>{
  try{ matOut.textContent = JSON.stringify(matMul(parseMat(matA.value), parseMat(matB.value))); }catch(e){ matOut.textContent='Error:'+e }
});
document.getElementById('mat-det')?.addEventListener('click', ()=>{
  try{ matOut.textContent = String(det(parseMat(matA.value))); }catch(e){ matOut.textContent='Error:'+e }
});
document.getElementById('mat-inv')?.addEventListener('click', ()=>{
  try{ matOut.textContent = JSON.stringify(inv(parseMat(matA.value))); }catch(e){ matOut.textContent='Error:'+e }
});
