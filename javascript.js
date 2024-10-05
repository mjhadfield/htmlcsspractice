function loadHeader() {
    // Check if the header is already loaded
    if (!document.querySelector('#header-content')) {
        return fetch('header.html')
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML('afterbegin', data);
                attachEventListeners(); // Attach event listeners after loading
                updateCartDisplay(); // Ensure the cart display updates after loading
            })
            .catch(error => console.error('Error loading header:', error));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadHeader(); // Call the loadHeader function
});

function attachEventListeners() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileNavigation = document.querySelector('.mobile-navigation');
    const cartMenu = document.querySelector('.cart-menu');
    const desktopCart = document.querySelector('.desktop-cart');
    const cartContents = document.querySelector('.cart-contents');
    const shopLink = document.querySelector('.shop-link');
    const dropdownContent = document.querySelector('.mobile-dropdown');

    hamburgerMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileNavigation.classList.toggle('active');
    });

    cartMenu.addEventListener('click', function() {
        this.classList.toggle('active');
        cartContents.classList.toggle('active');
    });

    desktopCart.addEventListener('click', function() {
        this.classList.toggle('active');
        cartContents.classList.toggle('active');
    });

    // Add click event to the shop link
    shopLink.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default action
        dropdownContent.classList.toggle('active');
    });
}

//

document.addEventListener('DOMContentLoaded', function() {
    const requiredFields = document.querySelectorAll('input[required], textarea[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.classList.add('touched');
            } else {
                this.classList.remove('touched');
            }
        });

        field.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.remove('touched');
            }
        });
    });
});