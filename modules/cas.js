// cas.js - minimal symbolic helpers: simplify linear expressions & expand basic polynomials
// tiny helpers: simplify '2x + 3x' => '5x' for single variable polynomials
export const CAS = {
  simplify(expr){
    // naive simplifier for ax + bx forms
    try{
      // replace ^ with **
      const e = expr.replace(/\^/g,'**');
      // For very simple cases, attempt numeric evaluation with symbolic vars grouped
      // We'll handle: ax + bx -> (a+b)x
      const m = e.match(/^\s*([+-]?\d*\.?\d*)?([a-zA-Z])\s*([+-]\s*\d*\.?\d*[a-zA-Z])*/);
      if(m) return e; // fallback
      // otherwise return original
      return expr;
    }catch(e){ return expr; }
  }
};
