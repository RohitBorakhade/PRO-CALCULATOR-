// finance.js - EMI calc
const loanAmt = document.getElementById('loan-amt');
const loanRate = document.getElementById('loan-rate');
const loanYears = document.getElementById('loan-years');
const finOut = document.getElementById('finance-output');

document.getElementById('calc-emi')?.addEventListener('click', ()=>{
  const P = Number(loanAmt.value);
  const r = Number(loanRate.value)/100/12;
  const n = Number(loanYears.value)*12;
  if(!P||!n) { finOut.textContent='Enter principal and years'; return; }
  const EMI = (P * r * Math.pow(1+r,n)) / (Math.pow(1+r,n)-1);
  finOut.textContent = `EMI = ${EMI.toFixed(2)}\nTotal Payment = ${(EMI*n).toFixed(2)}\nTotal Interest = ${(EMI*n - P).toFixed(2)}`;
});
