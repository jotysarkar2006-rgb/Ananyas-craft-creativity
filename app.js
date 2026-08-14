const WHATSAPP="917890605022";
const products=[
 {id:1,name:"Blush Bloom Rakhi",cat:"Rakhi",price:249,desc:"A delicate handmade floral rakhi."},
 {id:2,name:"Pearl Petal Bracelet",cat:"Jewellery",price:399,desc:"Soft pearls with a handcrafted finish."},
 {id:3,name:"Little Love Gift",cat:"Gifts",price:499,desc:"A thoughtful handmade gift set."},
 {id:4,name:"Butterfly Charm",cat:"Jewellery",price:349,desc:"A playful little charm made with care."},
 {id:5,name:"Floral Hair Bow",cat:"Hair Accessories",price:199,desc:"A pretty handmade accessory."},
 {id:6,name:"Custom Keepsake",cat:"Custom Creations",price:599,desc:"Made specially for your story."},
 {id:7,name:"Handmade Glow",cat:"Skincare",price:299,desc:"A gentle handmade self-care pick."},
 {id:8,name:"Festive Mini Gift",cat:"Gifts",price:449,desc:"A sweet little handmade surprise."}
];
const categories=["Rakhi","Jewellery","Hair Accessories","Handmade Gifts","Custom Creations","Home Decor","Skincare","New Arrivals","Best Sellers"];
let cart=JSON.parse(localStorage.getItem("ananyaCart")||"[]");
let wishlist=JSON.parse(localStorage.getItem("ananyaWish")||"[]");

const money=n=>"₹"+n.toLocaleString("en-IN");
function save(){localStorage.setItem("ananyaCart",JSON.stringify(cart));localStorage.setItem("ananyaWish",JSON.stringify(wishlist));updateCounts();}
function updateCounts(){document.querySelector("#cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);document.querySelector("#wishCount").textContent=wishlist.length;}

function productCard(p){
 const liked=wishlist.includes(p.id);
 return `<article class="product-card">
  <div class="product-image"><button class="wish" data-wish="${p.id}">${liked?"♥":"♡"}</button><span>handmade</span></div>
  <div class="product-info"><small>${p.cat}</small><h3>${p.name}</h3><p>${money(p.price)}</p>
  <div class="product-actions"><button class="mini-btn add" data-add="${p.id}">Add to cart</button><button class="mini-btn" data-buy="${p.id}">WhatsApp</button></div></div>
 </article>`;
}
function renderProducts(list=products){document.querySelector("#productGrid").innerHTML=list.map(productCard).join("")||'<p class="empty">No creations found.</p>';bindProductButtons();}
function renderCategories(){document.querySelector("#categoryGrid").innerHTML=categories.slice(0,5).map((c,i)=>`<a class="category-card" href="#shop" data-cat="${c}"><span>${c}</span></a>`).join("");document.querySelectorAll(".category-card").forEach(x=>x.onclick=()=>{document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));document.querySelectorAll(".filter").forEach(b=>{if(b.dataset.filter===x.dataset.cat)b.classList.add("active")});renderProducts(products.filter(p=>p.cat===x.dataset.cat||x.dataset.cat==="New Arrivals"||x.dataset.cat==="Best Sellers"));});}
function bindProductButtons(){
 document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>addToCart(+b.dataset.add));
 document.querySelectorAll("[data-buy]").forEach(b=>b.onclick=()=>orderWhatsApp([+b.dataset.buy]));
 document.querySelectorAll("[data-wish]").forEach(b=>b.onclick=()=>toggleWish(+b.dataset.wish));
}
function addToCart(id){const p=products.find(x=>x.id===id);const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id,qty:1});save();openDrawer("cartDrawer");renderCart();}
function toggleWish(id){wishlist.includes(id)?wishlist=wishlist.filter(x=>x!==id):wishlist.push(id);save();renderProducts(currentProducts);renderWishlist();}
let currentProducts=products;
function renderCart(){
 const el=document.querySelector("#cartItems");
 if(!cart.length){el.innerHTML='<div class="empty">Your cart is waiting for something handmade. ♡</div>';document.querySelector("#cartTotal").textContent="₹0";return;}
 el.innerHTML=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `<div class="drawer-product"><div class="drawer-thumb">♡</div><div><h4>${p.name}</h4><p>${money(p.price)} × ${x.qty}</p><div><button class="remove" data-dec="${p.id}">−</button> ${x.qty} <button class="remove" data-inc="${p.id}">+</button></div></div><button class="remove" data-remove="${p.id}">×</button></div>`}).join("");
 document.querySelector("#cartTotal").textContent=money(cart.reduce((a,x)=>a+products.find(p=>p.id===x.id).price*x.qty,0));
 el.querySelectorAll("[data-inc]").forEach(b=>b.onclick=()=>{cart.find(x=>x.id===+b.dataset.inc).qty++;save();renderCart()});
 el.querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>{const x=cart.find(x=>x.id===+b.dataset.dec);x.qty--;if(x.qty<1)cart=cart.filter(y=>y.id!==x.id);save();renderCart()});
 el.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.id!==+b.dataset.remove);save();renderCart()});
}
function renderWishlist(){
 const el=document.querySelector("#wishItems");
 const items=wishlist.map(id=>products.find(p=>p.id===id)).filter(Boolean);
 el.innerHTML=items.length?items.map(p=>`<div class="drawer-product"><div class="drawer-thumb">♡</div><div><h4>${p.name}</h4><p>${money(p.price)}</p><button class="mini-btn add" data-wishcart="${p.id}">Add to cart</button></div><button class="remove" data-wishremove="${p.id}">×</button></div>`).join(""):'<div class="empty">Save the pieces you love here. ♡</div>';
 el.querySelectorAll("[data-wishcart]").forEach(b=>b.onclick=()=>addToCart(+b.dataset.wishcart));
 el.querySelectorAll("[data-wishremove]").forEach(b=>b.onclick=()=>toggleWish(+b.dataset.wishremove));
}
function openDrawer(id){document.querySelector("#overlay").style.display="block";document.querySelector("#"+id).classList.add("open")}
function closeDrawers(){document.querySelectorAll(".drawer").forEach(x=>x.classList.remove("open"));document.querySelector("#overlay").style.display="none"}
function orderWhatsApp(ids=cart.map(x=>x.id)){if(!ids.length)return;let rows=[];ids.forEach(id=>{const p=products.find(x=>x.id===id);const q=cart.find(x=>x.id===id)?.qty||1;rows.push(`${p.name} × ${q} — ${money(p.price*q)}`)});const total=ids.reduce((a,id)=>{const p=products.find(x=>x.id===id);const q=cart.find(x=>x.id===id)?.qty||1;return a+p.price*q},0);const msg=`Hello Ananya's Craft & Creativity! ♡%0A%0AI would like to place an order:%0A${rows.join("%0A")}%0A%0ATotal: ${money(total)}%0A%0APlease confirm availability and delivery details.`;window.open(`https://wa.me/${WHATSAPP}?text=${msg}`,"_blank");}

document.querySelector("#cartBtn").onclick=()=>{renderCart();openDrawer("cartDrawer")};
document.querySelector("#wishlistBtn").onclick=()=>{renderWishlist();openDrawer("wishDrawer")};
document.querySelector("#overlay").onclick=closeDrawers;
document.querySelectorAll("[data-close]").forEach(x=>x.onclick=closeDrawers);
document.querySelector("#whatsappOrder").onclick=()=>orderWhatsApp();
document.querySelector("#menuBtn").onclick=()=>document.querySelector("#mobileMenu").classList.toggle("open");

document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentProducts=b.dataset.filter==="All"?products:products.filter(p=>p.cat===b.dataset.filter);renderProducts(currentProducts)});

const searchPanel=document.querySelector("#searchPanel");
document.querySelector("#searchBtn").onclick=()=>{searchPanel.classList.add("open");document.querySelector("#searchInput").focus()};
document.querySelector("#searchClose").onclick=()=>searchPanel.classList.remove("open");
document.querySelector("#searchInput").oninput=e=>{const q=e.target.value.toLowerCase().trim();const results=products.filter(p=>(p.name+" "+p.cat+" "+p.desc).toLowerCase().includes(q));document.querySelector("#searchResults").innerHTML=q?results.map(p=>`<div class="search-result"><span>${p.name} — ${money(p.price)}</span><button data-searchadd="${p.id}">Add</button></div>`).join(""):'<p class="empty">Type to discover a handmade favourite.</p>';document.querySelectorAll("[data-searchadd]").forEach(b=>b.onclick=()=>addToCart(+b.dataset.searchadd))};

renderCategories();renderProducts();updateCounts();

const loginModal=document.querySelector("#loginModal");
const openLogin=()=>loginModal.classList.add("open");
const closeLogin=()=>loginModal.classList.remove("open");
document.querySelector("#accountBtn").onclick=openLogin;
document.querySelector("#mobileAccount").onclick=(e)=>{e.preventDefault();openLogin();document.querySelector("#mobileMenu").classList.remove("open")};
document.querySelector("#loginClose").onclick=closeLogin;
document.querySelector("#googleLogin").onclick=()=>alert("Google Login will be connected after we add the secure authentication backend.");
document.querySelector("#emailLoginBtn").onclick=()=>alert("Secure email login will be connected after we add the authentication backend.");
document.querySelector("#signupBtn").onclick=()=>alert("Signup will be connected after we add the authentication backend.");
