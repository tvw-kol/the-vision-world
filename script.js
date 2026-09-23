const menu=document.querySelector(".menu"),nav=document.querySelector(".nav");if(menu){menu.addEventListener("click",()=>{const open=menu.getAttribute("aria-expanded")==="true";menu.setAttribute("aria-expanded",String(!open));nav.style.display=open?"none":"flex";nav.style.position="absolute";nav.style.top="70px";nav.style.left="0";nav.style.right="0";nav.style.padding="22px";nav.style.background="var(--paper)";nav.style.flexDirection="column";nav.style.borderBottom="1px solid var(--line)"})}
const lightbox=document.querySelector(".lightbox"),art=document.querySelector(".lightbox-art"),caption=document.querySelector(".lightbox-content p");document.querySelectorAll(".gallery-item").forEach(item=>item.addEventListener("click",()=>{art.className="lightbox-art "+item.className.replace("gallery-item ","");caption.textContent=item.dataset.caption;lightbox.classList.add("open");lightbox.setAttribute("aria-hidden","false")}));document.querySelector(".close").addEventListener("click",()=>{lightbox.classList.remove("open");lightbox.setAttribute("aria-hidden","true")});lightbox.addEventListener("click",e=>{if(e.target===lightbox)document.querySelector(".close").click()});document.addEventListener("keydown",e=>{if(e.key==="Escape"&&lightbox.classList.contains("open"))document.querySelector(".close").click()});
(function(){
  const data=window.TVWCatalog||[];
  const grid=document.getElementById('catalog-grid');
  const input=document.getElementById('catalog-search');
  const count=document.getElementById('catalog-count');
  const modal=document.getElementById('product-modal');
  const modalImg=document.getElementById('product-modal-img');
  const modalTitle=document.getElementById('product-modal-title');
  const modalWa=document.getElementById('product-modal-wa');
  const filters=[...document.querySelectorAll('.filter')];
  if(!grid)return;

  let activeFilter='all';

  function typeFor(model){
    const m=model.toUpperCase();
    return (m.endsWith('S') || m.includes('S-') || m.includes('SK')) ? 'sun' : 'optical';
  }

  function render(q=''){
    const term=q.trim().toLowerCase();
    const filtered=data.filter(x=>{
      const matchesSearch=!term || x.model.toLowerCase().includes(term);
      const matchesFilter=activeFilter==='all' || typeFor(x.model)===activeFilter;
      return matchesSearch && matchesFilter;
    });
    count.textContent=`${filtered.length} ${filtered.length===1?'model':'models'}`;
    grid.innerHTML=filtered.map(x=>{
      const path='/assets/catalog/'+encodeURIComponent(x.file);
      const msg=encodeURIComponent(`Hello The Vision World, I am enquiring about model ${x.model}. Please let me know availability, colour options and price.`);
      const kind=typeFor(x.model)==='sun'?'Sunglasses':'Optical';
      return `<article class="product-card">
        <button class="product-image" type="button" data-model="${x.model}" data-file="${x.file}" aria-label="View ${x.model}">
          <img src="${path}" alt="The Vision World ${kind} model ${x.model}" loading="lazy" decoding="async">
        </button>
        <div class="product-info"><span class="product-model">${x.model}</span><a class="product-enquire" href="https://wa.me/919830187170?text=${msg}" target="_blank" rel="noopener noreferrer">Enquire ↗</a></div>
      </article>`;
    }).join('') || '<p class="catalog-note">No models match that search.</p>';
  }

  function openProduct(model,file){
    if(window.fbq) window.fbq('track','ViewContent',{content_name:model,content_type:'product'});
    const path='/assets/catalog/'+encodeURIComponent(file);
    modalImg.src=path;
    modalImg.alt='The Vision World eyewear model '+model;
    modalTitle.textContent=model;
    modalWa.href='https://wa.me/919830187170?text='+encodeURIComponent(`Hello The Vision World, I am enquiring about model ${model}. Please let me know availability, colour options and price.`);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }
  function closeProduct(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    modalImg.src='';
    document.body.style.overflow='';
  }

  render();
  input?.addEventListener('input',e=>render(e.target.value));
  filters.forEach(btn=>btn.addEventListener('click',()=>{
    activeFilter=btn.dataset.filter;
    filters.forEach(b=>b.classList.toggle('active',b===btn));
    render(input?.value||'');
  }));
  grid.addEventListener('click',e=>{
    const btn=e.target.closest('.product-image');
    if(btn) openProduct(btn.dataset.model,btn.dataset.file);
  });
  modal?.addEventListener('click',e=>{if(e.target.matches('[data-close-product]'))closeProduct()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal?.classList.contains('open'))closeProduct()});
  document.addEventListener('click',e=>{
    const link=e.target.closest('a[href^="https://wa.me/"],a[href^="tel:"]');
    if(link && window.fbq) window.fbq('track','Contact',{method:link.href.startsWith('tel:')?'phone':'whatsapp'});
  });
})();