// Cart state
let cart = [];
const SHIPPING_COST = 3500;
const WHATSAPP_NUMBER = '573222553397';

// Age verification
function ageVerification(isAdult) {
    const modal = document.getElementById('age-modal');
    const content = document.getElementById('content');
    
    modal.style.display = 'none';
    
    if (isAdult) {
        content.style.display = 'block';
    } else {
        window.location.href = 'https://www.google.com';
    }
}

// Cart functions
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    updateCartDisplay();
    updateTotal();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartDisplay();
    updateTotal();
}

function updateQuantity(id, newQuantity) {
    if (newQuantity < 1) return;
    
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = newQuantity;
        updateCartDisplay();
        updateTotal();
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div>
                <span>${item.name}</span>
                <span class="price">$${(item.price * item.quantity).toLocaleString()}</span>
            </div>
            <div>
                <input type="number" 
                       value="${item.quantity}" 
                       min="1" 
                       onchange="updateQuantity('${item.id}', this.value)"
                       style="width: 60px; margin: 0 10px;">
                <button onclick="removeFromCart('${item.id}')">Eliminar</button>
            </div>
        `;
        cartItems.appendChild(itemElement);
    });
}

function updateTotal() {
    const includeDelivery = document.getElementById('delivery-checkbox').checked;
    const addressContainer = document.getElementById('address-container');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + (includeDelivery ? SHIPPING_COST : 0);
    
    document.getElementById('total-price').textContent = `Total: $${total.toLocaleString()}`;
    addressContainer.classList.toggle('hidden', !includeDelivery);
}

function finalizePurchase() {
    const includeDelivery = document.getElementById('delivery-checkbox').checked;
    const address = document.getElementById('delivery-address').value;
    const phone = document.getElementById('phone-number').value;
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;

    // Validation
    if (!phone) {
        alert('Por favor ingresa tu número de teléfono');
        return;
    }
    if (includeDelivery && !address) {
        alert('Por favor ingresa tu dirección de envío');
        return;
    }
    if (!paymentMethod) {
        alert('Por favor selecciona un método de pago');
        return;
    }
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    // Create WhatsApp message
    let message = '🛒 *Nuevo Pedido*\n\n';
    message += '*Productos:*\n';
    cart.forEach(item => {
        message += `▫ ${item.name} x${item.quantity} - $${(item.price * item.quantity).toLocaleString()}\n`;
    });
    
    if (includeDelivery) {
        message += `\n*Envío:* $${SHIPPING_COST.toLocaleString()}`;
        message += `\n*Dirección:* ${address}`;
    }
    
    message += `\n\n*Teléfono:* ${phone}`;
    message += `\n*Método de pago:* ${paymentMethod}`;
    message += `\n\n*Total:* $${(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + (includeDelivery ? SHIPPING_COST : 0)).toLocaleString()}`;

    // Open WhatsApp
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
}