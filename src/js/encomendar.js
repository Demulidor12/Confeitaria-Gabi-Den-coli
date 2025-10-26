const products = [
    { id:1, title:'Bolo Tradicional 1kg', desc:'Baunilha / Chocolate. Serve 8–10 pessoas', price:75.00, img:'imgs/bolo1.jpg', options:['Baunilha','Chocolate','Red Velvet'] },
    { id:2, title:'Caixa de Brigadeiros (12 un.)', desc:'Brigadeiro tradicional com granulado', price:28.50, img:'imgs/brigadeiro.jpg', options:[] },
    { id:3, title:'Cupcakes (6 un.)', desc:'Sortidos — pedido mínimo: 6', price:34.00, img:'imgs/cupcakes.jpg', options:['Chocolate','Baunilha','Doce de Leite'] },
    { id:4, title:'Torta de Limão inteira', desc:'Torta gelada com merengue por cima', price:62.00, img:'imgs/torta-limao.jpg', options:[] }
];

const cart = {}; // {productId: {qty, option}}


function currencyBRL(n){
    return n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}

function addToCart(id){
    const qtyEl = document.getElementById('qty-'+id);
    const qty = Number(qtyEl?.value || 0);
    if(!qty || qty <= 0){ alert('Defina uma quantidade maior que zero.'); return; }
    const optEl = document.getElementById('opt-'+id);
    const option = optEl ? optEl.value : null;
    if(!cart[id]) cart[id] = {qty:0,option};
    cart[id].qty += qty;
    if(option) cart[id].option = option;
    qtyEl.value = 0;
    renderCart();
}


function renderCart(){
    const wrap = document.getElementById('cartItems');
    wrap.innerHTML = '';
    const keys = Object.keys(cart);
    if(keys.length === 0){ wrap.innerHTML = '<p class="small">Nenhum item no carrinho</p>'; updateTotals(); return; }
    keys.forEach(k=>{
    const item = cart[k];
    const p = products.find(x=>x.id==k);
    const row = document.createElement('div');
    row.style.display='flex';row.style.alignItems='center';row.style.justifyContent='space-between';row.style.padding='6px 0';
    row.innerHTML = `<div style="flex:1">
    <div style="font-weight:600">${p.title}</div>
    <div class="small">${item.option? item.option + ' • ' : ''}Qtd: ${item.qty}</div>
    </div>
    <div style="text-align:right">
    <div>${currencyBRL(p.price * item.qty)}</div>
    <div style="margin-top:6px"><button class="btn secondary" onclick="removeFromCart(${p.id})">Remover</button></div>
    </div>`;
    wrap.appendChild(row);
    });
    updateTotals();
}


function removeFromCart(id){ delete cart[id]; renderCart(); }


function updateTotals(){
    const subtotalEl = document.getElementById('subtotal');
    const deliveryEl = document.getElementById('delivery');
    const totalEl = document.getElementById('total');
    let subtotal = 0;
    Object.keys(cart).forEach(k=>{ const p = products.find(x=>x.id==k); subtotal += p.price * cart[k].qty; });
    const pickup = document.getElementById('pickup')?.value || 'pickup';
    let delivery = 0;
    if(pickup === 'delivery' && subtotal > 0) delivery = 12.00; // taxa fixa como exemplo
    subtotalEl.textContent = currencyBRL(subtotal);
    deliveryEl.textContent = currencyBRL(delivery);
    totalEl.textContent = currencyBRL(subtotal + delivery);
}


function resetOrder(){
    for(const k in cart) delete cart[k]; renderCart(); document.getElementById('orderForm').reset();
}


function handleSubmit(e){
    e.preventDefault();
    const keys = Object.keys(cart);
    if(keys.length === 0){ alert('Adicione pelo menos um item ao carrinho antes de enviar a encomenda.'); return false; }
    // coletar dados do formulário
    const data = {
    customer: {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    },
    pickup: document.getElementById('pickup').value,
    date: document.getElementById('date').value,
    notes: document.getElementById('notes').value,
    items: keys.map(k=>{
    const p = products.find(x=>x.id==k);
    return { id:p.id, title:p.title, qty:cart[k].qty, option:cart[k].option || null, price:p.price };
    })
    };


    // Aqui normalmente você enviaria `data` para o servidor (fetch/axios).
    // Como exemplo, mostramos no console e exibimos um resumo ao usuário.
    console.log('Encomenda enviada (exemplo):', data);
    alert('Encomenda enviada! Receberemos seus dados e entraremos em contato. (Este é um exemplo sem envio real)');
    resetOrder();
    return false;
}


// atualizar totais quando mudar método de retirada
document.getElementById('pickup').addEventListener('change', updateTotals);


// iniciar
renderProducts(); renderCart();