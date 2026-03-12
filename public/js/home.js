let cart = JSON.parse(localStorage.getItem('garage_sale_cart')) || [];

const elements = {
    sidebar: document.getElementById('sidebar'),
    overlay: document.getElementById('overlay'),
    cartItemsList: document.getElementById('cart-items-list'),
    cartCount: document.getElementById('cart-count'),
    cartTotal: document.getElementById('cart-total'),
    cartBtn: document.getElementById('cart-btn'),
    closeBtn: document.getElementById('close-btn'),
    modal: document.getElementById('product-modal')
};

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    refreshButtonStates();
    initApp();
});

function initApp() {
    elements.cartBtn.onclick = () => { elements.sidebar.classList.add('active'); elements.overlay.classList.add('active'); };
    elements.closeBtn.onclick = closeCart;
    elements.overlay.onclick = closeCart;

    // Filter Bar Logic
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.onclick = () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            document.querySelectorAll('.product-card').forEach(card => {
                card.style.display = (filter === 'all' || card.dataset.category === filter) ? 'block' : 'none';
            });
        };
    });

    // Open Modal
    document.querySelectorAll('.view-details').forEach(el => {
        el.onclick = () => openDetails(el.closest('.product-card'));
    });

    document.querySelector('.close-modal').onclick = () => elements.modal.classList.remove('active');

    // Add to Cart Logic
    document.querySelectorAll('.buy-btn:not(.modal-buy-trigger)').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const card = btn.closest('.product-card');
            const product = {
                id: Date.now() + Math.random(),
                name: btn.dataset.name,
                price: parseFloat(btn.dataset.price),
                size: btn.dataset.size || null,
                img: card.querySelector('img').src // Captures image for the cart sidebar
            };
            addToCart(product, btn);
        };
    });

    // Buy Now Button action
    document.getElementById('buy-now-btn').onclick = () => {
        if(cart.length > 0) alert("Order Processed! Total: " + elements.cartTotal.innerText);
    };
}

function openDetails(card) {
    const btn = card.querySelector('.buy-btn');
    const images = btn.dataset.images.split(',');

    document.getElementById('modal-title').innerText = btn.dataset.name;
    document.getElementById('modal-price').innerText = `$${btn.dataset.price}`;
    document.getElementById('modal-desc').innerText = btn.dataset.desc;
    document.getElementById('modal-cat').innerText = btn.dataset.category;

    const sizeBox = document.getElementById('modal-size-box');
    sizeBox.style.display = btn.dataset.size ? 'block' : 'none';
    if(btn.dataset.size) document.getElementById('modal-size').innerText = btn.dataset.size;

    const mainImg = document.getElementById('modal-img-main');
    mainImg.src = images[0];

    const imgContainer = document.getElementById('modal-img-container');
    const oldThumbs = imgContainer.querySelector('.thumbnail-row');
    if(oldThumbs) oldThumbs.remove();

    const thumbRow = document.createElement('div');
    thumbRow.className = 'thumbnail-row';
    images.forEach((url, i) => {
        const thumb = document.createElement('img');
        thumb.src = url;
        thumb.className = `thumb ${i === 0 ? 'active' : ''}`;
        thumb.onclick = () => {
            mainImg.src = url;
            document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        };
        thumbRow.appendChild(thumb);
    });
    imgContainer.appendChild(thumbRow);

    const modalBuyBtn = document.querySelector('.modal-buy-trigger');
    modalBuyBtn.disabled = btn.disabled;
    modalBuyBtn.innerText = btn.innerText;
    modalBuyBtn.className = btn.className + " modal-buy-trigger";
    modalBuyBtn.onclick = () => btn.click();

    elements.modal.classList.add('active');
}

function addToCart(product, btn) {
    cart.push(product);
    save();
    
    btn.innerText = "✓ Added!";
    btn.classList.add('added');
    btn.disabled = true;

    setTimeout(() => {
        btn.innerText = "In Cart";
        btn.classList.remove('added');
        btn.classList.add('in-cart');
    }, 1500);

    setTimeout(() => { elements.sidebar.classList.add('active'); elements.overlay.classList.add('active'); }, 500);
}

function removeItem(id, name) {
    cart = cart.filter(item => item.id !== id);
    save();
    document.querySelectorAll('.buy-btn').forEach(btn => {
        if(btn.dataset.name === name) {
            btn.innerText = "Add to Cart";
            btn.classList.remove('in-cart');
            btn.disabled = false;
        }
    });
}

function updateCartUI() {
    elements.cartCount.innerText = cart.length;
    elements.cartItemsList.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.img}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${item.name} ${item.size ? `(${item.size})` : ''}</h4>
                <p>$${item.price.toFixed(2)}</p>
            </div>
            <button class="remove-item" onclick="removeItem(${item.id}, '${item.name}')">&times;</button>
        </div>
    `).join('');
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    elements.cartTotal.innerText = `$${total.toFixed(2)}`;
}

function refreshButtonStates() {
    const names = cart.map(i => i.name);
    document.querySelectorAll('.buy-btn').forEach(btn => {
        if(names.includes(btn.dataset.name)) {
            btn.innerText = "In Cart";
            btn.classList.add('in-cart');
            btn.disabled = true;
        }
    });
}

function closeCart() { elements.sidebar.classList.remove('active'); elements.overlay.classList.remove('active'); }
function save() { localStorage.setItem('garage_sale_cart', JSON.stringify(cart)); updateCartUI(); }
window.removeItem = removeItem;