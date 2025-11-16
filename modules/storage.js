// storage.js - history + memory
export const Storage = {
  key: 'ultrapro_history_v1',
  memKey: 'ultrapro_memory_v1',
  saveHistory(item){
    let arr = JSON.parse(localStorage.getItem(this.key) || '[]');
    arr.unshift({ts:Date.now(), item});
    localStorage.setItem(this.key, JSON.stringify(arr.slice(0,500)));
    this._emit();
  },
  getHistory(){ return JSON.parse(localStorage.getItem(this.key) || '[]'); },
  clearHistory(){ localStorage.removeItem(this.key); this._emit(); },
  exportHistory(){
    const data = this.getHistory();
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    return url;
  },
  saveMemory(v){ localStorage.setItem(this.memKey, String(v)); },
  readMemory(){ return localStorage.getItem(this.memKey) ?? '0'; },
  clearMemory(){ localStorage.removeItem(this.memKey); }
};

// UI hooks
function renderHistory(){
  const list = document.getElementById('history-list');
  if(!list) return;
  const arr = Storage.getHistory();
  list.innerHTML = '';
  arr.forEach(h=>{
    const li = document.createElement('li');
    const txt = document.createElement('div');
    txt.textContent = `${new Date(h.ts).toLocaleString()}  •  ${h.item}`;
    const act = document.createElement('div');
    act.className='act';
    act.innerHTML = '<button data-val="'+encodeURIComponent(h.item)+'">Use</button> <button data-del="'+h.ts+'">Delete</button>';
    li.appendChild(txt); li.appendChild(act);
    list.appendChild(li);
  });
}
window.addEventListener('load', renderHistory);
window.addEventListener('storage', renderHistory);

document.getElementById('history-export')?.addEventListener('click', ()=>{
  const u = Storage.exportHistory();
  const a = document.createElement('a'); a.href = u; a.download = 'ultrapro_history.json'; a.click();
});
document.getElementById('history-clear')?.addEventListener('click', ()=>{
  if(confirm('Clear all history?')) { Storage.clearHistory(); renderHistory(); }
});
document.getElementById('history-list')?.addEventListener('click', (e)=>{
  if(e.target.tagName === 'BUTTON'){
    if(e.target.dataset.val){
      const val = decodeURIComponent(e.target.dataset.val);
      const display = document.getElementById('display');
      if(display) display.value = val;
      // switch to calculator tab
      document.querySelector('[data-tab="calculator"]').click();
    } else if(e.target.dataset.del){
      const ts = Number(e.target.dataset.del);
      const arr = Storage.getHistory().filter(x=>x.ts !== ts);
      localStorage.setItem(Storage.key, JSON.stringify(arr));
      renderHistory();
    }
  }
});
document.getElementById('history-search')?.addEventListener('input', (e)=>{
  const q = e.target.value.toLowerCase();
  const list = document.getElementById('history-list');
  if(!list) return;
  Array.from(list.children).forEach(li=>{
    li.style.display = li.textContent.toLowerCase().includes(q)?'flex':'none';
  });
});
