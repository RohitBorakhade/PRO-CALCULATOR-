// converter.js - basic unit converter
const convType = document.getElementById('conv-type');
const convFrom = document.getElementById('conv-from');
const convTo = document.getElementById('conv-to');
const convInput = document.getElementById('conv-input');
const convDo = document.getElementById('conv-do');
const convOutput = document.getElementById('conv-output');

const map = {
  length: ['m','cm','km'],
  temp: ['C','F'],
  weight: ['kg','g']
};

function populate(){
  const t = convType.value;
  convFrom.innerHTML = ''; convTo.innerHTML = '';
  map[t].forEach(u=>{
    convFrom.appendChild(new Option(u,u));
    convTo.appendChild(new Option(u,u));
  });
}
convType?.addEventListener('change', populate);
populate();

function convert(){
  const t = convType.value;
  const v = Number(convInput.value);
  const a = convFrom.value, b = convTo.value;
  let res = v;
  if(t==='length'){
    // normalize to meters
    const toM = {m:1, cm:0.01, km:1000};
    res = v * toM[a] / toM[b];
  } else if(t==='temp'){
    if(a==='C' && b==='F') res = (v*9/5)+32;
    if(a==='F' && b==='C') res = (v-32)*5/9;
  } else if(t==='weight'){
    const toKg = {kg:1, g:0.001};
    res = v * toKg[a] / toKg[b];
  }
  convOutput.textContent = res;
}
convDo?.addEventListener('click', convert);
