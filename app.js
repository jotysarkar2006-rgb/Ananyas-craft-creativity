const WA="917890605022";
const cats=["All","Rakhi","Jewellery","Hair Accessories","Gifts","Custom Creations","Home Decor","Skincare","New Arrivals","Best Sellers"];
const defaults=[
{id:1,name:"Blush Bloom Rakhi",cat:"Rakhi",price:249,stock:10,badge:"New",desc:"A delicate handmade floral rakhi.",image:""},
{id:2,name:"Pearl Petal Bracelet",cat:"Jewellery",price:399,stock:8,badge:"",desc:"Soft pearls with a handcrafted finish.",image:""},
{id:3,name:"Little Love Gift",cat:"Gifts",price:499,stock:5,badge:"Best Seller",desc:"A thoughtful handmade gift set.",image:""},
{id:4,name:"Butterfly Charm",cat:"Jewellery",price:349,stock:7,badge:"",desc:"A playful handmade charm.",image:""},
{id:5,name:"Floral Hair Bow",cat:"Hair Accessories",price:199,stock:12,badge:"",desc:"A pretty handmade accessory.",image:""},
{id:6,name:"Custom Keepsake",cat:"Custom Creations",price:599,stock:4,badge:"Custom",desc:"Made specially for your story.",image:""},
{id:7,name:"Handmade Glow",cat:"Skincare",price:299,stock:9,badge:"",desc:"A gentle handmade self-care pick.",image:""},
{id:8,name:"Festive Mini Gift",cat:"Gifts",price:449,stock:6,badge:"",desc:"A sweet little handmade surprise.",image:""}];
let products=JSON.parse(localStorage.getItem("ananyaProducts")||"null")||defaults;
let cart=JSON.parse(localStorage.getItem("ananyaCart")||"[]"),wish=JSON.parse(localStorage.getItem("ananyaWish")||"[]");
let category="All",query="";
const money=n=>"₹"+Number(n).toLocaleString("en-IN"), $=s=>document.querySelector(s);
function save(){localStorage.setItem("ananyaProducts",JSON.stringify(products));localStorage.setItem("ananyaCart",JSON.stringify(cart));localStorage.setItem("ananyaWish",JSON.stringify(wish));counts();}
function counts(){$("#cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);$("#wishCount").textContent=wish.length}
function image(p){return p.image?`<img src="${p.image}" alt="${p.name}">`:`<span>${p.cat==="Jewellery"?"💍":p.cat==="Skincare"?"🌸":p.cat==="Gifts"?"🎁":"✿"}</span>`}
function filtered(){return products.filter(p=>(category==="All"||p.cat===category||(category==="New Arrivals"&&p.badge==="New")||(category==="Best Sellers"&&p.badge==="Best Seller"))&&(!query||(`${p.name} ${p.cat} ${p.desc}`).toLowerCase().includes(query)))}
function renderCats(){let el=$("#categoryList");el.innerHTML=cats.map(c=>`<button class="cat ${c===category?"active":""}" data-cat="${c}">${c}</button>`).join("");document.querySelectorAll("[data-cat]").forEach(b=>b.onclick=()=>{category=b.dataset.cat;renderCats();renderProducts();location.hash="shop"})}
function card(p){let liked=wish.includes(p.id),sold=p.stock<=0;return `<article class="product"><div class="photo">${image(p)}${p.badge?`<b class="badge">${p.badge}</b>`:""}<button class="wish" data-wish="${p.id}">${liked?"♥":"♡"}</button></div><div class="product-body"><small>${p.cat}</small><h3>${p.name}</h3><p>${p.desc}</p><p class="price">${money(p.price)}</p><small>${sold?"Sold out":p.stock+" available"}</small><div class="product-actions"><button class="add" data-add="${p.id}" ${sold?"disabled":""}>${sold?"Sold out":"Add to cart"}</button><button data-buy="${p.id}" ${sold?"disabled":""}>WhatsApp</button></div></div></article>`}
function renderProducts(){let list=filtered();$("#products").innerHTML=list.length?list.map(card).join(""):'<div class="empty"><h3>No pieces found</h3><p>Try another search or category.</p></div>';document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>add(+b.dataset.add));document.querySelectorAll("[data-buy]").forEach(b=>b.onclick=()=>buy(+b.dataset.buy));document.querySelectorAll("[data-wish]").forEach(b=>b.onclick=()=>toggleWish(+b.dataset.wish))}
function add(id){let p=products.find(x=>x.id===id);if(!p||p.stock<1)return;let i=cart.find(x=>x.id===id);if(i){if(i.qty<p.stock)i.qty++}else cart.push({id,qty:1});save();renderCart();openCart()}
function toggleWish(id){wish=wish.includes(id)?wish.filter(x=>x!==id):[...wish,id];save();renderProducts()}
function buy(id){let p=products.find(x=>x.id===id);let text=encodeURIComponent(`Hello Ananya's Craft & Creativity!%0A%0AI want to order:%0A${p.name}%0APrice: ${money(p.price)}%0AQuantity: 1%0A%0AName:%0AAddress:%0APincode:%0APhone:`);window.open(`https://wa.me/${WA}?text=${text}`,"_blank")}
function renderCart(){let box=$("#cartItems");if(!cart.length){box.innerHTML='<div class="empty">Your cart is waiting for something lovely. ♥</div>';$("#total").textContent="₹0";return}let total=0;box.innerHTML=cart.map(i=>{let p=products.find(x=>x.id===i.id);if(!p)return"";total+=p.price*i.qty;return `<div class="cart-row"><div class="cart-img">${image(p)}</div><div><h4>${p.name}</h4><small>${money(p.price)} × ${i.qty}</small><div class="qty"><button data-q="${p.id}" data-d="-1">−</button><span>${i.qty}</span><button data-q="${p.id}" data-d="1">+</button><button data-r="${p.id}">Remove</button></div></div></div>`}).join("");$("#total").textContent=money(total);document.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>qty(+b.dataset.q,+b.dataset.d));document.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{cart=cart.filter(x=>x.id!==+b.dataset.r);save();renderCart()})}
function qty(id,d){let i=cart.find(x=>x.id===id),p=products.find(x=>x.id===id);if(!i)return;i.qty=Math.max(1,Math.min(p.stock,i.qty+d));save();renderCart()}
function openCart(){$("#cartPanel").classList.add("show");$("#overlay").classList.add("show")}
function closeAll(){$("#cartPanel").classList.remove("show");$("#overlay").classList.remove("show");$("#loginModal").classList.remove("show")}
function checkout(){if(!cart.length)return;let lines=cart.map(i=>{let p=products.find(x=>x.id===i.id);return `• ${p.name} × ${i.qty} — ${money(p.price*i.qty)}`}).join("%0A"),total=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);let text=`Hello Ananya's Craft & Creativity!%0A%0AI'd like to place an order:%0A${lines}%0A%0ATotal: ${encodeURIComponent(money(total))}%0A%0AName:%0AAddress:%0APincode:%0APhone:%0A%0APlease confirm availability and delivery charge.`;window.open(`https://wa.me/${WA}?text=${text}`,"_blank")}
function toast(t){let x=$("#toast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2000)}
document.addEventListener("DOMContentLoaded",()=>{renderCats();renderProducts();renderCart();counts();
$("#search").oninput=e=>{query=e.target.value.toLowerCase().trim();renderProducts()};
$("#cartBtn").onclick=openCart;$("#closeCart").onclick=closeAll;$("#overlay").onclick=closeAll;$("#checkout").onclick=checkout;
$("#wishlistBtn").onclick=()=>{category="All";query="";$("#search").value="";renderCats();renderProducts();location.hash="shop"};
$("#accountBtn").onclick=()=>$("#loginModal").classList.add("show");$("#closeLogin").onclick=closeAll;
$("#googleLogin").onclick=()=>toast("Google login will be connected with the secure backend.");
$("#emailLogin").onclick=()=>toast("Email login will be connected with the secure backend.");
$("#signup").onclick=()=>toast("Signup will be connected with the secure backend.");
$("#newsletter").onsubmit=e=>{e.preventDefault();toast("Thank you for joining our newsletter!");e.target.reset()};
$("#menuBtn").onclick=()=>$("#nav").classList.toggle("open")});
