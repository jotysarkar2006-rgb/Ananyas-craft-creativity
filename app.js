/* Ananya's Craft & Creativity — complete storefront */
const WA_NUMBER="917890605022";
const DEFAULT_CATEGORIES=["All","Rakhi","Jewellery","Hair Accessories","Gifts","Custom Creations","Home Decor","Skincare","New Arrivals","Best Sellers"];

const DEFAULT_PRODUCTS=[
 {id:1,name:"Blush Bloom Rakhi",cat:"Rakhi",price:249,desc:"A delicate handmade floral rakhi.",stock:10,image:"",badge:"New"},
 {id:2,name:"Pearl Petal Bracelet",cat:"Jewellery",price:399,desc:"Soft pearls with a handcrafted finish.",stock:8,image:"",badge:""},
 {id:3,name:"Little Love Gift",cat:"Gifts",price:499,desc:"A thoughtful handmade gift set.",stock:5,image:"",badge:"Best Seller"},
 {id:4,name:"Butterfly Charm",cat:"Jewellery",price:349,desc:"A playful little charm made with care.",stock:7,image:"",badge:""},
 {id:5,name:"Floral Hair Bow",cat:"Hair Accessories",price:199,desc:"A pretty handmade accessory.",stock:12,image:"",badge:""},
 {id:6,name:"Custom Keepsake",cat:"Custom Creations",price:599,desc:"Made specially for your story.",stock:4,image:"",badge:"Custom"},
 {id:7,name:"Handmade Glow",cat:"Skincare",price:299,desc:"A gentle handmade self-care pick.",stock:9,image:"",badge:""},
 {id:8,name:"Festive Mini Gift",cat:"Gifts",price:449,desc:"A sweet little handmade surprise.",stock:6,image:"",badge:""}
];
let products=JSON.parse(localStorage.getItem("ananyaProducts")||"null")||DEFAULT_PRODUCTS;
let cart=JSON.parse(localStorage.getItem("ananyaCart")||"[]");
let wishlist=JSON.parse(localStorage.getItem("ananyaWish")||"[]");
let currentCategory="All";
let searchTerm="";
const money=n=>"₹"+Number(n).toLocaleString("en-IN");
const qs=s=>document.querySelector(s);
const qsa=s=>[...document.querySelectorAll(s)];
function persist(){localStorage.setItem("ananyaProducts",JSON.stringify(products));localStorage.setItem("ananyaCart",JSON.stringify(cart));localStorage.setItem("ananyaWish",JSON.stringify(wishlist));updateCounts();}
function updateCounts(){const c=cart.reduce((a,x)=>a+x.qty,0);const w=wishlist.length;const cc=qs("#cartCount"),wc=qs("#wishCount");if(cc)cc.textContent=c;if(wc)wc.textContent=w;}
function imageMarkup(p){return p.image?`<img src="${p.image}" alt="${p.name}" loading="lazy">`:`<span class="product-placeholder">♡<small>handmade</small></span>`;}
function productCard(p){
 const liked=wishlist.includes(p.id), sold=Number(p.stock||0)<=0;
 return `<article class="product-card" data-name="${p.name.toLowerCase()}">
  <div class="product-image">${imageMarkup(p)}${p.badge?`<b class="product-badge">${p.badge}</b>`:""}<button class="wish ${liked?"liked":""}" data-wish="${p.id}" aria-label="Wishlist">${liked?"♥":"♡"}</button></div>
  <div class="product-info"><small>${p.cat}</small><h3>${p.name}</h3><p class="product-price">${money(p.price)}</p><p class="product-desc">${p.desc||""}</p>
   <div class="stock-note">${sold?"Sold out":`${p.stock} available`}</div>
   <div class="product-actions"><button class="mini-btn add" data-add="${p.id}" ${sold?"disabled":""}>${sold?"Sold out":"Add to cart"}</button><button class="mini-btn" data-buy="${p.id}" ${sold?"disabled":""}>WhatsApp</button></div>
  </div></article>`;
}
function filteredProducts(){
 return products.filter(p=>(currentCategory==="All"||p.cat===currentCategory||currentCategory==="Best Sellers"&&p.badge==="Best Seller"||currentCategory==="New Arrivals"&&p.badge==="New") && (!searchTerm||`${p.name} ${p.cat} ${p.desc}`.toLowerCase().includes(searchTerm)));
}
function renderProducts(){
 const grid=qs("#productGrid"); if(!grid)return;
 const list=filteredProducts(); grid.innerHTML=list.length?list.map(productCard).join(""):`<div class="empty-state"><h3>No pieces found.</h3><p>Try another search or category.</p></div>`;
 qsa("[data-add]").forEach(b=>b.onclick=()=>addToCart(Number(b.dataset.add)));
 qsa("[data-wish]").forEach(b=>b.onclick=()=>toggleWish(Number(b.dataset.wish)));
 qsa("[data-buy]").forEach(b=>b.onclick=()=>buyWhatsApp(Number(b.dataset.buy)));
}
function renderCategories(){
 const box=qs("#categoryList");if(!box)return;
 box.innerHTML=DEFAULT_CATEGORIES.map(c=>`<button class="category-pill ${c===currentCategory?"active":""}" data-cat="${c}">${c}</button>`).join("");
 qsa("[data-cat]").forEach(b=>b.onclick=()=>{currentCategory=b.dataset.cat;renderCategories();renderProducts();document.querySelector("#shop")?.scrollIntoView({behavior:"smooth"});});
}
function addToCart(id){const p=products.find(x=>x.id===id);if(!p||p.stock<=0)return;const item=cart.find(x=>x.id===id);if(item){if(item.qty<p.stock)item.qty++;}else cart.push({id,qty:1});persist();renderCart();openPanel("cartPanel");}
function removeCart(id){cart=cart.filter(x=>x.id!==id);persist();renderCart();}
function changeQty(id,d){const p=products.find(x=>x.id===id),i=cart.find(x=>x.id===id);if(!i||!p)return;i.qty=Math.max(1,Math.min(p.stock,i.qty+d));persist();renderCart();}
function renderCart(){
 const box=qs("#cartItems"),total=qs("#cartTotal");if(!box)return;
 if(!cart.length){box.innerHTML='<div class="empty-state small"><p>Your cart is waiting for something lovely.</p></div>';if(total)total.textContent="₹0";return;}
 let sum=0;
 box.innerHTML=cart.map(i=>{const p=products.find(x=>x.id===i.id);if(!p)return"";sum+=p.price*i.qty;return `<div class="cart-item"><div class="cart-thumb">${imageMarkup(p)}</div><div><h4>${p.name}</h4><small>${money(p.price)} × ${i.qty}</small><div class="qty"><button data-minus="${p.id}">−</button><span>${i.qty}</span><button data-plus="${p.id}">+</button><button class="remove" data-remove="${p.id}">Remove</button></div></div></div>`;}).join("");
 qsa("[data-minus]").forEach(b=>b.onclick=()=>changeQty(Number(b.dataset.minus),-1));qsa("[data-plus]").forEach(b=>b.onclick=()=>changeQty(Number(b.dataset.plus),1));qsa("[data-remove]").forEach(b=>b.onclick=()=>removeCart(Number(b.dataset.remove)));if(total)total.textContent=money(sum);
}
function toggleWish(id){wishlist.includes(id)?wishlist=wishlist.filter(x=>x!==id):wishlist.push(id);persist();renderProducts();}
function buyWhatsApp(id){
 const p=products.find(x=>x.id===id);if(!p)return;
 const msg=`Hello Ananya's Craft & Creativity!%0A%0AI want to order:%0A• ${encodeURIComponent(p.name)}%0A• Price: ${encodeURIComponent(money(p.price))}%0A• Quantity: 1%0A%0APlease confirm availability and delivery details.`;
 window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`,"_blank");
}
function checkoutWhatsApp(){
 if(!cart.length)return;
 const lines=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `• ${p.name} × ${i.qty} — ${money(p.price*i.qty)}`;}).join("%0A");
 const total=cart.reduce((s,i)=>{const p=products.find(x=>x.id===i.id);return s+p.price*i.qty},0);
 const msg=`Hello Ananya's Craft & Creativity!%0A%0AI'd like to place an order:%0A${lines}%0A%0ATotal: ${encodeURIComponent(money(total))}%0A%0AName:%0AAddress:%0APincode:%0APhone:%0A%0APlease confirm the order and delivery charge.`;
 window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`,"_blank");
}
function openPanel(id){qsa(".side-panel").forEach(x=>x.classList.remove("open"));qs("#"+id)?.classList.add("open");qs("#overlay")?.classList.add("open");}
function closePanels(){qsa(".side-panel").forEach(x=>x.classList.remove("open"));qs("#overlay")?.classList.remove("open");}
function init(){
 renderCategories();renderProducts();renderCart();updateCounts();
 const search=qs("#searchInput");if(search)search.oninput=e=>{searchTerm=e.target.value.toLowerCase().trim();renderProducts();};
 qs("#cartBtn")?.addEventListener("click",()=>openPanel("cartPanel"));
 qs("#wishBtn")?.addEventListener("click",()=>{currentCategory="All";searchTerm="";if(search)search.value="";renderProducts();document.querySelector("#shop")?.scrollIntoView({behavior:"smooth"});});
 qs("#closePanels")?.addEventListener("click",closePanels);qs("#overlay")?.addEventListener("click",closePanels);
 qs("#checkoutBtn")?.addEventListener("click",checkoutWhatsApp);
 qs("#accountBtn")?.addEventListener("click",()=>qs("#loginModal")?.classList.add("open"));
 qs("#loginClose")?.addEventListener("click",()=>qs("#loginModal")?.classList.remove("open"));
 qs("#mobileAccount")?.addEventListener("click",e=>{e.preventDefault();qs("#loginModal")?.classList.add("open");qs("#mobileMenu")?.classList.remove("open")});
 qs("#menuBtn")?.addEventListener("click",()=>qs("#mobileMenu")?.classList.toggle("open"));
 qs("#googleLogin")?.addEventListener("click",()=>alert("Secure Google authentication will be connected when the backend is added."));
 qs("#emailLoginBtn")?.addEventListener("click",()=>alert("Secure email authentication will be connected when the backend is added."));
 qs("#signupBtn")?.addEventListener("click",()=>alert("Account creation will be connected when the backend is added."));
 qs("#adminLink")?.addEventListener("click",()=>location.href="admin.html");
}
document.addEventListener("DOMContentLoaded",init);
