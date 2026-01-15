// Single, clean app.js
const STORAGE_KEY = 'mybest_sites_v1';

// Fallback seed if fetch fails (so the page still works when opened as file://)
const DEFAULT_SEED = {
  "Image": [
    {"name":"ezgif","url":"https://ezgif.com/split?err=expired","image":"ezgifWallpaper.png","description":"Hızlı GIF düzenleme ve bölme aracı — küçük GIF dosyalarını kesmek veya kareleri ayırmak için kullanıyorum."}
  ],
  "Audio": [
    {"name":"mp3cut","url":"https://mp3cut.net/audio-editor","image":"mp3cutWallpaper.png","description":"Çevrimiçi MP3 kırpma ve ses düzenleme — basit kesme/ayırma işlemleri için pratik."}
  ]
};

function saveToStorage(data){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getData(){
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

function renderCategories(container, data){
  container.querySelectorAll('.category').forEach(n=>n.remove());
  if(!data || Object.keys(data).length===0){
    container.insertAdjacentHTML('beforeend','<div class="loading">Gösterilecek site yok.</div>');
    return;
  }

  Object.entries(data).forEach(([category, sites])=>{
    const section = document.createElement('section');
    section.className = 'category';
    const h2 = document.createElement('h2');
    h2.textContent = category;
    section.appendChild(h2);

    const list = document.createElement('div');
    list.className = 'cards';

    sites.forEach((site, idx)=>{
      const a = document.createElement('a');
      a.className = 'card';
      a.href = site.url || '#';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';

      const thumb = document.createElement('div');
      thumb.className = 'thumb';
      const img = site.image || '';
      thumb.style.backgroundImage = `url(${img})`;
      a.appendChild(thumb);

      const controls = document.createElement('div');
      controls.className = 'controls';
      const editBtn = document.createElement('button');
      editBtn.textContent = 'Düzenle';
      editBtn.addEventListener('click', (e)=>{ e.preventDefault(); openEditForm(category, idx); });
      const delBtn = document.createElement('button');
      delBtn.textContent = 'Sil';
      delBtn.addEventListener('click', (e)=>{ e.preventDefault(); deleteSite(category, idx); });
      controls.appendChild(editBtn);
      controls.appendChild(delBtn);
      a.appendChild(controls);

      const meta = document.createElement('div');
      meta.className = 'meta';
      const fav = document.createElement('div');
      fav.className = 'favicon';
      fav.textContent = (site.name||'S').slice(0,2).toUpperCase();
      const txt = document.createElement('div');
      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = site.name || site.url;
      const url = document.createElement('div');
      url.className = 'url';
      url.textContent = site.url.replace(/https?:\/\//,'');
      const desc = document.createElement('div');
      desc.className = 'desc';
      if(site.description){
        desc.textContent = site.description;
        desc.title = site.description;
      }

      txt.appendChild(title);
      txt.appendChild(url);
      if(site.description) txt.appendChild(desc);
      meta.appendChild(fav);
      meta.appendChild(txt);
      a.appendChild(meta);

      list.appendChild(a);
    });

    section.appendChild(list);
    container.appendChild(section);
  });
}

function downloadJSON(){
  const data = getData();
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sites.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function copyJSON(){
  const data = getData();
  const text = JSON.stringify(data, null, 2);
  try{
    await navigator.clipboard.writeText(text);
    alert('JSON kopyalandı.');
  }catch(e){
    console.error(e);
    alert('Kopyalama desteklenmiyor.');
  }
}

function mergeData(dest, src){
  const out = {...dest};
  Object.entries(src).forEach(([cat, sites])=>{
    if(!out[cat]) out[cat] = [];
    out[cat] = out[cat].concat(sites);
  });
  return out;
}

function handleUploadFile(file, mode){
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const parsed = JSON.parse(reader.result);
      if(mode==='overwrite'){
        saveToStorage(parsed);
      }else{
        const merged = mergeData(getData(), parsed);
        saveToStorage(merged);
      }
      renderCategories(document.getElementById('app'), getData());
      alert('JSON başarıyla yüklendi.');
    }catch(e){
      alert('Geçersiz JSON dosyası.');
    }
  };
  reader.readAsText(file);
}

function openEditForm(category, index){
  const data = getData();
  const site = data[category][index];
  if(!site) return;
  document.getElementById('formContainer').classList.remove('hidden');
  document.getElementById('formTitle').textContent = 'Düzenle';
  document.getElementById('siteCategory').value = category;
  document.getElementById('siteName').value = site.name || '';
  document.getElementById('siteUrl').value = site.url || '';
  document.getElementById('siteImage').value = site.image || '';
  document.getElementById('siteDescription').value = site.description || '';
  document.getElementById('editCategory').value = category;
  document.getElementById('editIndex').value = index;
}

function deleteSite(category, index){
  if(!confirm('Kesinlikle silinsin mi?')) return;
  const data = getData();
  data[category].splice(index,1);
  if(data[category].length===0) delete data[category];
  saveToStorage(data);
  renderCategories(document.getElementById('app'), data);
}

function wireControls(){
  document.getElementById('downloadBtn').addEventListener('click', downloadJSON);
  document.getElementById('copyBtn').addEventListener('click', copyJSON);
  document.getElementById('uploadJson').addEventListener('change', (e)=>{
    const f = e.target.files[0];
    if(!f) return;
    const mode = document.querySelector('input[name="importMode"]:checked').value;
    handleUploadFile(f, mode);
    e.target.value = '';
  });

  const toggle = document.getElementById('toggleAdd');
  const formContainer = document.getElementById('formContainer');
  toggle.addEventListener('click', ()=>{
    formContainer.classList.toggle('hidden');
    document.getElementById('formTitle').textContent = 'Yeni Site Ekle';
    document.getElementById('siteForm').reset();
    document.getElementById('editCategory').value = '';
    document.getElementById('editIndex').value = '';
  });

  document.getElementById('cancelForm').addEventListener('click', ()=>{
    formContainer.classList.add('hidden');
  });

  document.getElementById('siteForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const category = document.getElementById('siteCategory').value.trim();
    const name = document.getElementById('siteName').value.trim();
    const url = document.getElementById('siteUrl').value.trim();
    const image = document.getElementById('siteImage').value.trim();
    const description = document.getElementById('siteDescription').value.trim();
    const editCat = document.getElementById('editCategory').value;
    const editIdx = document.getElementById('editIndex').value;

    const data = getData();
    if(editCat !== ''){
      // edit existing
      data[editCat][parseInt(editIdx,10)] = {name, url, image, description};
      // if category changed, move
      if(editCat !== category){
        const item = data[editCat].splice(parseInt(editIdx,10),1)[0];
        if(data[editCat].length===0) delete data[editCat];
        if(!data[category]) data[category] = [];
        data[category].push(item);
      }
    }else{
      if(!data[category]) data[category] = [];
      data[category].push({name, url, image, description});
    }
    saveToStorage(data);
    renderCategories(document.getElementById('app'), data);
    document.getElementById('formContainer').classList.add('hidden');
    document.getElementById('siteForm').reset();
  });
}

async function loadSites(){
  const app = document.getElementById('app');
  const loading = document.getElementById('loading');
  let data = null;
  try{
    const stored = localStorage.getItem(STORAGE_KEY);
    if(stored){
      data = JSON.parse(stored);
    }else{
      // try to fetch seed json (works on GitHub Pages)
      const res = await fetch('sites.json');
      if(res.ok){
        data = await res.json();
      }else{
        data = DEFAULT_SEED;
      }
      saveToStorage(data);
    }
  }catch(err){
    console.error('loadSites error', err);
    data = DEFAULT_SEED;
    saveToStorage(data);
  }
  loading?.remove();
  renderCategories(app, data);
  wireControls();
}

// Initialize
document.addEventListener('DOMContentLoaded', loadSites);
