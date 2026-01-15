async function loadSites(){
  const app = document.getElementById('app');
  const loading = document.getElementById('loading');
  try{
    const res = await fetch('sites.json');
    if(!res.ok) throw new Error('sites.json yüklenemedi');
    const data = await res.json();
    loading?.remove();
    renderCategories(app, data);
  }catch(err){
    if(loading) loading.textContent = 'Veri yüklenirken hata oluştu.';
    console.error(err);
  }
}

function renderCategories(container, data){
  if(!data || Object.keys(data).length===0){
    container.innerHTML = '<div class="loading">Gösterilecek site yok.</div>';
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

    sites.forEach(site=>{
      const a = document.createElement('a');
      a.className = 'card';
      a.href = site.url || '#';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';

      const thumb = document.createElement('div');
      thumb.className = 'thumb';
      // allow either absolute URL or local filename
      const img = site.image || '';
      thumb.style.backgroundImage = `url(${img})`;
      a.appendChild(thumb);

      const meta = document.createElement('div');
      meta.className = 'meta';
      const fav = document.createElement('div');
      fav.className = 'favicon';
      fav.textContent = (site.name||'S').slice(0,2).toUpperCase();
      const txt = document.createElement('div');
      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = site.name || site.url;
      const desc = document.createElement('div');
      desc.className = 'desc';
      if(site.description){
        desc.textContent = site.description;
        desc.title = site.description;
      }

      txt.appendChild(title);
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

document.addEventListener('DOMContentLoaded', loadSites);
