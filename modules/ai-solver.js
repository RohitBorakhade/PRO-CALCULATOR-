// ai-solver.js - basic step-by-step solver (linear & quadratic)
const aiIn = document.getElementById('ai-input');
const aiOut = document.getElementById('ai-output');
const aiBtn = document.getElementById('aiSolve');

function solveAI(){
  const eq = aiIn.value.trim();
  if(!eq){ aiOut.textContent='Type an equation like 2x+5=15 or x^2-5x+6=0'; return; }
  try{
    const steps = [];
    if(eq.includes('=')){ // linear solve
      const [L,R] = eq.split('=');
      // detect linear in x: ax + b = c
      const vars = (L+R).match(/[a-zA-Z]/);
      if(!vars){ aiOut.textContent='No variable found.'; return; }
      const v = vars[0];
      // move everything to LHS
      const poly = `${L} - (${R})`;
      // attempt to compute simplified coefficients for x^2, x, const
      const coefs = extractCoefs(poly, v);
      if(coefs.a === 0 && coefs.b !== 0){
        // linear bx + c = 0 => x = -c/b
        steps.push(`Equation reduced to ${coefs.b}${v} + (${coefs.c}) = 0`);
        const x = -coefs.c / coefs.b;
        steps.push(`Solve: ${v} = ${x}`);
        aiOut.textContent = steps.join('\n');
        return;
      }
      if(coefs.a !== 0){
        steps.push(`Quadratic detected: ${coefs.a}${v}^2 + ${coefs.b}${v} + ${coefs.c} = 0`);
        const D = coefs.b*coefs.b - 4*coefs.a*coefs.c;
        steps.push(`Discriminant D = ${D}`);
        if(D < 0) { steps.push('No real roots'); aiOut.textContent = steps.join('\n'); return; }
        const r1 = (-coefs.b + Math.sqrt(D)) / (2*coefs.a);
        const r2 = (-coefs.b - Math.sqrt(D)) / (2*coefs.a);
        steps.push(`Roots: ${r1}, ${r2}`);
        aiOut.textContent = steps.join('\n');
        return;
      }
      aiOut.textContent = 'Could not identify equation type precisely. Try simple linear/quadratic.';
    } else {
      // expression simplify
      aiOut.textContent = 'Enter an equation using "="';
    }
  }catch(e){ aiOut.textContent = 'Solver error: '+e.message; }
}

function extractCoefs(expr, v){
  // crude extraction: evaluate coefficients by substituting x=1 and x=0 and x=2
  const f = (x)=> Function('x','with(Math){return ('+expr+');}')(x);
  const y0 = f(0), y1 = f(1), y2 = f(2);
  // For ax^2 + bx + c: y0 = c; y1 = a+b+c; y2 = 4a+2b+c
  const c = y0;
  const b = ( (y1 - c) - ( (y2 - c) - 4*(y1 - c) + 4*c )/??0 ) ; // fallback
  // Simpler approach: solve linear system
  const A = [[1,0,0],[1,1,1],[4,2,1]];
  const B = [y0,y1,y2];
  // Solve with Cramer's rule
  const det = (m)=> m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1]) - m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0]) + m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);
  const detA = det(A);
  if(!isFinite(detA) || detA===0) return {a:0,b:0,c:0};
  const A1 = [[B[0],A[0][1],A[0][2]],[B[1],A[1][1],A[1][2]],[B[2],A[2][1],A[2][2]]];
  const A2 = [[A[0][0],B[0],A[0][2]],[A[1][0],B[1],A[1][2]],[A[2][0],B[2],A[2][2]]];
  const A3 = [[A[0][0],A[0][1],B[0]],[A[1][0],A[1][1],B[1]],[A[2][0],A[2][1],B[2]]];
  const a = det(A1)/detA, b = det(A2)/detA, c = det(A3)/detA;
  return {a,b,c};
}

// Hook up
aiBtn?.addEventListener('click', solveAI);
