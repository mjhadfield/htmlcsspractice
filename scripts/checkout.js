document.addEventListener('DOMContentLoaded', () => {

    const cartTotalElement = document.getElementById('cart-total');
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    const placeOrderButton = document.getElementById('place-order');

    let cartTotal = 0;
    let shippingCost = 0;

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