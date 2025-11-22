// UltraPro Advanced Scientific — script.js
(function(){
  const screen = document.getElementById('screen');
  const equals = document.getElementById('equals');
  const radDegBtn = document.getElementById('radDeg');
  const AC = document.getElementById('AC');
  const DEL = document.getElementById('DEL');
  const randBtn = document.getElementById('rand');

  let expr = '';           // visible expression string
  let memory = 0;          // memory register
  let angleIsRad = true;   // default RAD; toggle shows RAD/DEG

  // helpers
  const setScreen = (v) => screen.textContent = v === '' ? '0' : v;
  const push = (s) => { expr += s; setScreen(expr); }
  const clearAll = () => { expr=''; setScreen('0'); }
  const backspace = () => { expr = expr.slice(0,-1); setScreen(expr || '0'); }

  // map constants
  const CONSTS = {
    PI: Math.PI,
    E: Math.E,
    PHI: (1 + Math.sqrt(5)) / 2
  };

  // convert current expression to safe JS expression
  function toJSExpression(raw){
    if (!raw) return '';
    // replace common symbols
    let js = raw.replace(/×/g,'*')
                .replace(/÷/g,'/')
                .replace(/−/g,'-')
                .replace(/π/g,'PI')
                .replace(/φ/g,'PHI')
                .replace(/π/gi,'PI');

    // percent handling: convert "number%" -> (number/100)
    js = js.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

    // EXP -> e notation: user enters EXP then a number -> use *10^n
    js = js.replace(/EXP\(/g,'(Math.exp('); // not typical; handle EXP as exp()
    // we'll treat EXP as Math.exp when used via function mapping

    return js;
  }

  // Evaluate expression with supported functions
  function evaluateExpression(raw){
    if (!raw) return '';
    // Preprocessing: replace constants tokens with values and handle functions
    let s = raw;

    // Replace constants for evaluation
    s = s.replace(/PI/g, `(${CONSTS.PI})`);
    s = s.replace(/E/g, `(${CONSTS.E})`);
    s = s.replace(/PHI/g, `(${CONSTS.PHI})`);

    // Replace function tokens with Math equivalents
    // We'll support: sin, cos, tan, asin, acos, atan, ln, log, sqrt, x², x³, 1/x, exp, RAND
    // Create handlers by transforming e.g. sin( ... ) -> __FUNC_sin__(... ) then evaluate with safe map
    // Simpler approach: build a Function with Math in scope and function wrappers
    const wrapped = `
      (function(){
        const isRad = ${angleIsRad};
        const sin = (x)=> Math.sin(isRad ? x : x * Math.PI / 180);
        const cos = (x)=> Math.cos(isRad ? x : x * Math.PI / 180);
        const tan = (x)=> Math.tan(isRad ? x : x * Math.PI / 180);
        const asin = (x)=> isRad ? Math.asin(x) : Math.asin(x) * 180/Math.PI;
        const acos = (x)=> isRad ? Math.acos(x) : Math.acos(x) * 180/Math.PI;
        const atan = (x)=> isRad ? Math.atan(x) : Math.atan(x) * 180/Math.PI;
        const ln = (x)=> Math.log(x);
        const log = (x)=> Math.log10 ? Math.log10(x) : Math.log(x)/Math.LN10;
        const sqrt = Math.sqrt;
        const exp = Math.exp;
        const RAND = ()=> Math.random();
        return (${s});
      })()
    `;
    // sanitize: disallow letters outside allowed function names and numbers/operators
    // Basic check: allow digits, operators, parentheses, decimal, Math words from above, spaces, commas.
    // We'll run it in Function to evaluate.
    try {
      // eslint-disable-next-line no-new-func
      const result = Function(`return ${wrapped}`)();
      if (typeof result === 'number' && !Number.isFinite(result)) throw new Error('Result is not finite');
      return result;
    } catch (e) {
      console.error('Eval error', e);
      return 'Error';
    }
  }

  // click handlers
  document.querySelectorAll('.num').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      const v = btn.dataset.num;
      // prevent multiple leading zeros
      if (expr === '0' && v !== '.') expr = '';
      push(v);
    });
  });

  document.querySelectorAll('.op').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const op = btn.dataset.op;
      if(op === '%'){
        push('%');
        return;
      }
      push(op);
    });
  });

  document.querySelectorAll('.paren').forEach(btn=>{
    btn.addEventListener('click', ()=> push(btn.dataset.val));
  });

  document.querySelectorAll('.const').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      push(btn.dataset.val);
    });
  });

  // functions
  document.querySelectorAll('.func').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const fn = btn.dataset.fn;
      switch(fn){
        case 'sin': push('sin('); break;
        case 'cos': push('cos('); break;
        case 'tan': push('tan('); break;
        case 'ln': push('ln('); break;
        case 'log': push('log('); break;
        case 'sqrt': push('sqrt('); break;
        case 'x2': push('('); push(')'); // we'll implement x² by evaluating current and squaring
                   // implement by taking last number or full expression
                   applyImmediateUnary(v=> Math.pow(v,2));
                   break;
        case 'x3': applyImmediateUnary(v=> Math.pow(v,3)); break;
        case 'recip': applyImmediateUnary(v=> 1 / v); break;
        case 'exp': push('exp('); break;
        default: break;
      }
    });
  });

  function applyImmediateUnary(opFn){
    // Try to evaluate current expression (full expr). If expression ends with operator, do nothing.
    try {
      const val = evaluateExpression(toJSExpression(expr));
      if (typeof val === 'number') {
        const out = opFn(val);
        expr = String(out);
        setScreen(expr);
      } else {
        setScreen('Error');
      }
    } catch(e){
      setScreen('Error');
    }
  }

  // RAND button
  randBtn && randBtn.addEventListener('click', ()=>{
    const r = Math.random();
    push(String(r));
  });

  // memory buttons
  document.querySelectorAll('.mem-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const action = btn.dataset.action;
      if(action === 'MC'){ memory = 0; btn.style.opacity = 0.6; return;}
      if(action === 'MR'){ push(String(memory)); return;}
      if(action === 'M+'){ memory += Number(evaluateExpression(toJSExpression(expr)) || 0); return;}
      if(action === 'M-'){ memory -= Number(evaluateExpression(toJSExpression(expr)) || 0); return;}
