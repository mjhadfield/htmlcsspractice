//----------------------------------------------------------------------------------------------Global Variables

cart = {};
let shippingCost = 0; // Default to standard shipping
let debounceTimer;
let productsCache;


//----------------------------------------------------------------------------------------------Functions

// Pre-load the products
function preloadProducts() {
    return fetch('scripts/products.json')
        .then(response => response.json())
        .then(products => {
            productsCache = products;
            return products; // Return the products
        })
        .catch(error => {
            console.error('Error preloading products:', error);
            throw error; // Re-throw the error to be caught in the calling function
        });
}

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

// Unified UI Update for both Checkout and Basket
function updateCartUI() {
    updateCheckoutDisplay();  // Update checkout page
}

// Debounced Cart Update Notification
function notifyCartUpdate() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('cartUpdated'));
    }, 100);  // Adjust debounce delay as needed
}


// Update the checkout total
function updateCheckoutDisplay() {
    const checkoutDiv = document.getElementById('checkout-cart');
    checkoutDiv.innerHTML = ''; // Clear the existing display

    if (Object.keys(cart).length === 0) {
        checkoutDiv.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    if (!productsCache) {
        console.error('Products not loaded');
        return;
    }

    let subtotal = 0;
    for (const [productId, quantity] of Object.entries(cart)) {
        const product = productsCache.find(p => p.id === parseInt(productId));
        if (product) {
            const itemTotal = product.cost * quantity;
            subtotal += itemTotal;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'checkout-item';
            itemDiv.innerHTML = `
            <div class="checkout-item-details">
                <div class="checkout-item-name">
                    <a href="product.html?id=${productId}" class="product-link">${product.name}</a>
                </div>
                <div class="checkout-item-price-quantity">
                    <div class="checkout-item-price">£${itemTotal.toFixed(2)}</div>
                    <div class="checkout-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${productId}, ${quantity - 1})">-</button>
                        <span id="quantity-${productId}">${quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${productId}, ${quantity + 1})">+</button>
                    </div>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${productId})">×</button>
        `;
            checkoutDiv.appendChild(itemDiv);
        }
    }

    updateShippingOptions(subtotal);
    updateTotalDisplay(subtotal);
}

function updateShippingOptions(subtotal) {
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    const freeShippingOption = document.getElementById('shipping-1');
    const freeShippingLabel = document.querySelector('label[for="shipping-1"]');
    const standardShippingOption = document.getElementById('shipping-2');
    const expressShippingOption = document.getElementById('shipping-3');

    if (subtotal >= 50) {
        freeShippingOption.disabled = false;
        freeShippingLabel.classList.remove('disabled');
    } else {
        // Disable free shipping when subtotal is less than 50
        freeShippingOption.disabled = true;
        freeShippingOption.checked = false;  // Ensure it's unchecked
        freeShippingLabel.classList.add('disabled');

        // Only set standard shipping as checked if express shipping is not selected
        if (!expressShippingOption.checked) {
            standardShippingOption.checked = true;  // Default to standard shipping
        }
    }

    shippingOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            shippingCost = parseFloat(e.target.value);
            updateTotalDisplay(subtotal);
            notifyCartUpdate();  // Ensure UI is updated after shipping selection
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
    }
}

// Update the quantity in the cart when changed
function updateQuantity(productId, newQuantity) {
    if (newQuantity >= 1 && newQuantity <= 10) {
        cart[productId] = newQuantity;
        document.getElementById(`quantity-${productId}`).textContent = newQuantity;
        saveCart();
        notifyCartUpdate(); // Trigger the UI update for both basket and checkout
}
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
    notifyCartUpdate(); // Trigger the UI update for both basket and checkout
}

// Initialize the checkout page
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    preloadProducts()
        .then(() => {
            updateCartUI(); // Only update UI after products are loaded
            console.log('Products loaded successfully:', productsCache);
        })
        .catch(error => {
            console.error('Failed to load products:', error);
            // Handle the error, maybe show a message to the user
        });

    // Add the cartUpdated event listener
    window.addEventListener('cartUpdated', updateCartUI);
});