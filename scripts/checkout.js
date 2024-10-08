cart = {};
let shippingCost = 5; // Default to standard shipping

// Load the cart from localStorage
function loadCart() {
    try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            cart = JSON.parse(storedCart);
        }
    } catch (error) {
        console.error('Error loading cart from localStorage:', error);
    }
}

// Update the cart display on the checkout page
function updateCheckoutDisplay() {
    const checkoutDiv = document.getElementById('checkout-cart');
    checkoutDiv.innerHTML = ''; // Clear the existing display
    notifyCartUpdate()

    if (Object.keys(cart).length === 0) {
        checkoutDiv.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    // Fetch products to display with the cart
    fetch('scripts/products.json')
        .then(response => response.json())
        .then(products => {
            let subtotal = 0;
            for (const [productId, quantity] of Object.entries(cart)) {
                const product = products.find(p => p.id === parseInt(productId));
                if (product) {
                    const itemTotal = product.cost * quantity;
                    subtotal += itemTotal;

                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'checkout-item';
                    itemDiv.innerHTML = `
                        <div class="checkout-item-name">${product.name}</div>
                        <div class="checkout-item-quantity">
                            <input type="number" value="${quantity}" min="1" max="10" id="quantity-${productId}" onchange="updateQuantity(${productId}, this.value)">
                        </div>
                        <div class="checkout-item-price">£${itemTotal.toFixed(2)}</div>
                        <button onclick="removeFromCart(${productId})">Remove</button>
                    `;
                    checkoutDiv.appendChild(itemDiv);
                }
            }

            updateShippingOptions(subtotal);
            updateTotalDisplay(subtotal);
        })
        .catch(error => console.error('Error fetching products:', error));
}

function updateShippingOptions(subtotal) {
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    const freeShippingOption = document.getElementById('shipping-1');
    const freeShippingLabel = document.querySelector('label[for="shipping-1"]');

    if (subtotal >= 50) {
        freeShippingOption.disabled = false;
        freeShippingLabel.classList.remove('disabled');
    } else {
        freeShippingOption.disabled = true;
        freeShippingOption.checked = false;
        freeShippingLabel.classList.add('disabled');
        document.getElementById('shipping-2').checked = true; // Select standard shipping
    }

    shippingOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            shippingCost = parseFloat(e.target.value);
            updateTotalDisplay(subtotal);
            notifyCartUpdate()
        });
    });

    // Set initial shipping cost based on selected option
    const selectedShipping = document.querySelector('input[name="shipping"]:checked');
    if (selectedShipping) {
        shippingCost = parseFloat(selectedShipping.value);
    }
}

function updateTotalDisplay(subtotal) {
    const totalDiv = document.getElementById('checkout-total') || document.createElement('div');
    totalDiv.id = 'checkout-total';
    totalDiv.className = 'checkout-total';
    const grandTotal = subtotal + shippingCost;
    totalDiv.innerHTML = `
        <strong>Subtotal: £${subtotal.toFixed(2)}</strong><br>
        <strong>Shipping: £${shippingCost.toFixed(2)}</strong><br>
        <strong>Total: £${grandTotal.toFixed(2)}</strong>
    `;
    const checkoutDiv = document.getElementById('checkout-cart');
    if (!document.getElementById('checkout-total')) {
        checkoutDiv.appendChild(totalDiv);
        notifyCartUpdate()
    }
}

// Update the quantity in the cart when changed
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1 || newQuantity > 10) return; // Validation
    cart[productId] = parseInt(newQuantity);
    saveCart();
    updateCheckoutDisplay();
    notifyCartUpdate()
}

// Save the updated cart to localStorage
function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
    }
}

// Remove an item from the cart
function removeFromCart(productId) {
    delete cart[productId];
    saveCart();
    updateCheckoutDisplay();
    notifyCartUpdate()
}

function notifyCartUpdate() {
    window.dispatchEvent(new CustomEvent('cartUpdated'));
}

// Initialize the checkout page
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    updateCheckoutDisplay();
});