const state={products:[],cart:JSON.parse(localStorage.getItem('lp_cart')||'[]'),user:JSON.parse(localStorage.getItem('lp_user')||'null')};
const $=s=>document.querySelector(s);
const money=n=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);

async function init(){
  const r=await fetch('data/products.json');
  state.products=await r.json();
  render();
  updateCartCount();
}
function filtered(){
  const q=$('#searchInput').value.toLowerCase().trim();
  const cat=$('#categoryFilter').value, sub=$('#subFilter').value, sort=$('#sortFilter').value;
  let a=state.products.filter(p=>(!q||`${p.brand} ${p.name}`.toLowerCase().includes(q))&&(cat==='all'||p.category===cat)&&(sub==='all'||p.subcategory===sub));
  if(sort==='priceAsc')a.sort((x,y)=>x.priceARS-y.priceARS);
  if(sort==='priceDesc')a.sort((x,y)=>y.priceARS-x.priceARS);
  if(sort==='name')a.sort((x,y)=>x.name.localeCompare(y.name));
  return a;
}
function render(){
  const a=filtered();
  $('#resultCount').textContent=`${a.length} fragancias`;
  $('#productGrid').innerHTML=a.map(p=>`<article class="product-card">
    <div class="product-image">${p.image?`<img src="${p.image}" alt="${escapeHtml(p.name)}" style="width:100%;height:100%;object-fit:cover">`:'LP'}</div>
    <div class="product-info"><span class="tag">${escapeHtml(p.brand)} · ${escapeHtml(p.condition)}</span>
    <h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.description)}</p>
    <div class="price">${money(p.priceARS)}</div>
    <div class="card-actions"><button onclick="openProduct('${p.id}')">Ver</button><button onclick="addToCart('${p.id}')">Agregar</button></div></div>
  </article>`).join('')||'<div class="empty">No encontramos fragancias con esos filtros.</div>';
}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function addToCart(id){const p=state.products.find(x=>x.id===id);if(!p)return;const item=state.cart.find(x=>x.id===id);if(item)item.qty++;else state.cart.push({id,qty:1});saveCart();toast('Agregado al carrito');}
function saveCart(){localStorage.setItem('lp_cart',JSON.stringify(state.cart));updateCartCount();}
function updateCartCount(){$('#cartCount').textContent=state.cart.reduce((s,x)=>s+x.qty,0);}
function openProduct(id){const p=state.products.find(x=>x.id===id);showModal(`<div class="modal"><button class="close" onclick="closeModal()">×</button><p class="eyebrow">${escapeHtml(p.brand)}</p><h2>${escapeHtml(p.name)}</h2><p>${escapeHtml(p.description)}</p><h3>${money(p.priceARS)}</h3><p style="color:#888;font-size:12px">${escapeHtml(p.condition)} · Código ${p.id}</p><button class="primary-btn" onclick="addToCart('${p.id}');closeModal()">Agregar al carrito</button></div>`);}
function openCart(){let rows=state.cart.map(i=>{const p=state.products.find(x=>x.id===i.id);return p?`<div class="cart-row"><div><b>${escapeHtml(p.name)}</b><small style="display:block;color:#888">${i.qty} × ${money(p.priceARS)}</small></div><b>${money(p.priceARS*i.qty)}</b><button onclick="removeFromCart('${p.id}')">Eliminar</button></div>`:''}).join('');let total=state.cart.reduce((s,i)=>{const p=state.products.find(x=>x.id===i.id);return s+(p?p.priceARS*i.qty:0)},0);showModal(`<div class="modal"><button class="close" onclick="closeModal()">×</button><p class="eyebrow">YOUR SELECTION</p><h2>Carrito</h2>${rows||'<div class="empty">Tu carrito está vacío.</div>'}<hr style="border-color:#222"><h3>Total ${money(total)}</h3>${rows?`<button class="primary-btn" style="width:100%" onclick="checkout()">Confirmar pedido por WhatsApp</button>`:''}</div>`);}
function removeFromCart(id){state.cart=state.cart.filter(x=>x.id!==id);saveCart();openCart();}
function checkout(){if(!state.user){openLogin(true);return} const items=state.cart.map(i=>{const p=state.products.find(x=>x.id===i.id);return `• ${p.name} x${i.qty} — ${money(p.priceARS*i.qty)}`}).join('%0A');const total=state.cart.reduce((s,i)=>{const p=state.products.find(x=>x.id===i.id);return s+p.priceARS*i.qty},0);const msg=`Hola, quiero realizar este pedido en Luxery Perfum:%0A%0A${items}%0A%0ATotal: ${money(total)}%0A%0ANombre: ${state.user.name}`;alert('La integración real con el número de WhatsApp se configurará en la siguiente etapa.');console.log(msg);}
function openLogin(afterCart=false){showModal(`<div class="modal"><button class="close" onclick="closeModal()">×</button><p class="eyebrow">LUXERY ACCOUNT</p><h2>Mi cuenta</h2><form class="form" onsubmit="login(event,${afterCart})"><input id="loginName" required placeholder="Nombre"><input id="loginEmail" type="email" required placeholder="Email"><input id="loginPass" type="password" required placeholder="Contraseña"><button class="primary-btn">Ingresar / Crear cuenta</button></form><p style="color:#777;font-size:11px;margin-top:20px">Beta: la autenticación real deberá pasar al backend antes de publicar.</p></div>`);}
function login(e,afterCart){e.preventDefault();state.user={name:$('#loginName').value,email:$('#loginEmail').value};localStorage.setItem('lp_user',JSON.stringify(state.user));closeModal();toast('Sesión iniciada');if(afterCart)openCart();}
function showModal(html){$('#modalRoot').innerHTML=`<div class="modal-backdrop" onclick="if(event.target===this)closeModal()">${html}</div>`;}
function closeModal(){$('#modalRoot').innerHTML='';}
function toast(t){const x=document.createElement('div');x.textContent=t;x.style='position:fixed;bottom:25px;left:50%;transform:translateX(-50%);background:#eee8df;color:#111;padding:12px 18px;border-radius:999px;z-index:100';document.body.appendChild(x);setTimeout(()=>x.remove(),1800);}
['searchInput','categoryFilter','subFilter','sortFilter'].forEach(id=>document.addEventListener('change',e=>{if(e.target.id===id)render()}));
$('#searchInput').addEventListener('input',render);
$('#cartBtn').onclick=openCart;
$('#loginBtn').onclick=()=>openLogin(false);
init();
