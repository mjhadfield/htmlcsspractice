document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    const placeOrderButton = document.getElementById('place-order');

    let cartTotal = 0;
    let shippingCost = 0;

    function updateCartDisplay() {
        cartItemsContainer.innerHTML = '';
        cartTotal = 0;

        fetch('scripts/products.json')
            .then(response => response.json())
            .then(products => {
                for (const [productId, quantity] of Object.entries(cart)) {
                    const product = products.find(p => p.id === parseInt(productId));
                    if (product) {
                        const itemTotal = product.cost * quantity;
                        cartTotal += itemTotal;

                        const itemElement = document.createElement('div');
                        itemElement.className = 'cart-item';
                        itemElement.innerHTML = `
                            <img src="${product.imageUrl}" alt="${product.name}">
                            <span>${product.name} x ${quantity}</span>
                            <span>£${itemTotal.toFixed(2)}</span>
                        `;
                        cartItemsContainer.appendChild(itemElement);
                    }
                }
                updateTotalDisplay();
            })
            .catch(error => console.error('Error updating cart:', error));
    }

    function updateTotalDisplay() {
        const total = cartTotal + shippingCost;
        cartTotalElement.textContent = `Total: £${total.toFixed(2)}`;
    
        // Disable free shipping for orders under £50
        const freeShippingOption = document.getElementById('shipping-1');
        const freeShippingLabel = document.querySelector('label[for="shipping-1"]');
        
        if (cartTotal >= 50) {
            freeShippingOption.disabled = false;
            freeShippingLabel.classList.remove('disabled');
        } else {
            freeShippingOption.disabled = true;
            freeShippingOption.checked = false; // Uncheck if it was selected
            freeShippingLabel.classList.add('disabled');
        }
    }
    

    shippingOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            shippingCost = parseFloat(e.target.value);
            updateTotalDisplay();
        });
    });

    placeOrderButton.addEventListener('click', () => {
        // Here you would typically send the order to a server
        alert("This isn't real, I'm not hooking up a payment processor...");
        console.log("User tried to place an order on a fake website");
    });

    // Initial cart display
    updateCartDisplay();
});

window.onload = function() {
    if (window.location.pathname === '/checkout.html') {
        document.querySelector('.cart-menu-mobile').style.display = 'none';
        console.log("Checkout page - hiding basket icon")
    }
};