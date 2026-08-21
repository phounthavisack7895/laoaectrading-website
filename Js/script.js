document.addEventListener("DOMContentLoaded", function () {
  var revealItems = document.querySelectorAll(
    ".about-intro, .about-statement, .strength-card, .about-cta"
  );

  if (!revealItems.length) {
    return;
  }

  revealItems.forEach(function (item) {
    item.classList.add("about-reveal");
  });

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18
    }
  );

  revealItems.forEach(function (item) {
    observer.observe(item);
  });
});


(function () {
  var shopPage = document.querySelector(".shop-page");
  if (!shopPage) return;
  var storageKey = "laoAecShoppingCart";
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem(storageKey) || "[]"); } catch (error) { cart = []; }
  var panel = document.querySelector(".cart-panel");
  var backdrop = document.querySelector(".cart-backdrop");
  var itemsBox = document.querySelector(".cart-items");
  var countBoxes = document.querySelectorAll(".cart-count");
  var language = document.querySelector(".order-form").dataset.language;
  var copy = language === "lo" ? {
    empty:"ກະຕ່າຂອງທ່ານຍັງວ່າງ.", cartons:"ລັງ", remove:"ລຶບ",
    subject:"ຄຳຂໍສັ່ງຊື້ຈາກເວັບໄຊ", business:"ທຸລະກິດ", contact:"ຜູ້ຕິດຕໍ່", phone:"ເບີໂທ", location:"ສະຖານທີ່ຈັດສົ່ງ", order:"ລາຍການສັ່ງຊື້"
  } : {
    empty:"Your cart is empty.", cartons:"cartons", remove:"Remove",
    subject:"Website order request", business:"Business", contact:"Contact", phone:"Phone", location:"Delivery location", order:"Order items"
  };
  function save(){ localStorage.setItem(storageKey,JSON.stringify(cart)); }
  function total(){ return cart.reduce(function(sum,item){ return sum+item.qty; },0); }
  function render(){
    countBoxes.forEach(function(el){ el.textContent=total(); });
    if(!cart.length){ itemsBox.innerHTML='<p class="empty-cart">'+copy.empty+'</p>'; return; }
    itemsBox.innerHTML=cart.map(function(item,index){
      return '<div class="cart-item"><div><strong>'+item.name+'</strong><p>'+item.qty+' '+copy.cartons+'</p></div><div class="cart-actions"><button type="button" data-cart-action="minus" data-index="'+index+'">−</button><span>'+item.qty+'</span><button type="button" data-cart-action="plus" data-index="'+index+'">+</button><button type="button" data-cart-action="remove" data-index="'+index+'" aria-label="'+copy.remove+'">×</button></div></div>';
    }).join("");
  }
  function openCart(){ panel.classList.add("is-open"); panel.setAttribute("aria-hidden","false"); backdrop.hidden=false; document.body.classList.add("cart-open"); document.querySelector(".cart-toggle").setAttribute("aria-expanded","true"); }
  function closeCart(){ panel.classList.remove("is-open"); panel.setAttribute("aria-hidden","true"); backdrop.hidden=true; document.body.classList.remove("cart-open"); document.querySelector(".cart-toggle").setAttribute("aria-expanded","false"); }
  document.querySelectorAll(".add-cart").forEach(function(button){
    button.addEventListener("click",function(){
      var qty=Math.max(1,parseInt(button.closest(".shop-card").querySelector(".product-qty").value,10)||1);
      var existing=cart.find(function(item){ return item.id===button.dataset.id; });
      if(existing) existing.qty+=qty; else cart.push({id:button.dataset.id,name:button.dataset.name,qty:qty});
      save(); render(); openCart();
    });
  });
  document.querySelector(".cart-toggle").addEventListener("click",openCart);
  document.querySelector(".cart-close").addEventListener("click",closeCart);
  backdrop.addEventListener("click",closeCart);
  document.addEventListener("keydown",function(event){ if(event.key==="Escape") closeCart(); });
  itemsBox.addEventListener("click",function(event){
    var button=event.target.closest("[data-cart-action]"); if(!button) return;
    var index=parseInt(button.dataset.index,10), action=button.dataset.cartAction;
    if(action==="plus") cart[index].qty+=1;
    if(action==="minus") cart[index].qty=Math.max(1,cart[index].qty-1);
    if(action==="remove") cart.splice(index,1);
    save(); render();
  });
  document.querySelector(".order-form").addEventListener("submit",function(event){
    event.preventDefault();
    if(!cart.length){ openCart(); return; }
    var data=new FormData(event.currentTarget);
    var lines=cart.map(function(item){ return "- "+item.name+": "+item.qty+" "+copy.cartons; });
    var body=[copy.business+": "+data.get("business"),copy.contact+": "+data.get("contact"),copy.phone+": "+data.get("phone"),copy.location+": "+data.get("location"),"",copy.order+":",lines.join("\n")].join("\n");
    window.location.href="mailto:info@laoaectrading.com?subject="+encodeURIComponent(copy.subject)+"&body="+encodeURIComponent(body);
  });
  render();
})();