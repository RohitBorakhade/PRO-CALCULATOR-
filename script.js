// main app bootstrap - uses module scripts in /modules
import './modules/storage.js';
import './modules/calculator.js';
import './modules/graph.js';
import './modules/ai-solver.js';
import './modules/cas.js';
import './modules/converter.js';
import './modules/programmer.js';
import './modules/matrix.js';
import './modules/finance.js';
import './modules/constants.js';

const menuBtns = document.querySelectorAll('.menu-btn');
const tabs = document.querySelectorAll('.tab');
menuBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelector('.menu-btn.active').classList.remove('active');
    btn.classList.add('active');
    const id = btn.dataset.tab;
    document.querySelector('.tab.active').classList.remove('active');
    document.getElementById(id).classList.add('active');
  });
});

/* Theme toggle (keeps neon blue glass) */
const toggleTheme = document.getElementById('toggle-theme');
toggleTheme?.addEventListener('click', ()=>{
  const root=document.documentElement;
  const dark = root.style.getPropertyValue('--bg') !== '#ffffff';
  if(dark){
    root.style.setProperty('--bg','#ffffff');
    document.body.style.background = '#f3f7fb';
    document.body.style.color = '#012';
  } else {
    document.body.style.background = 'linear-gradient(180deg,#07111a 0%, #071725 100%)';
    document.body.style.color = '';
  }
});

/* Clear storage */
document.getElementById('clear-storage')?.addEventListener('click', ()=>{
  if(confirm('Clear saved data and history?')) localStorage.clear(), location.reload();
});

/* Install PWA prompt (basic) */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=> navigator.serviceWorker.register('pwa/service-worker.js').catch(()=>{}));
}
