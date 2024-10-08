console.log('Look at you peeking in the console! Good for you 💕')

// Main function to initialize everything
function initializeApp() {
    loadHeader()
        .then(() => {
            attachEventListeners();
            updateCartDisplay();
            setupFormValidation();
            setupQuantityButtons();
            
            // Add this line
            window.addEventListener('cartUpdated', () => updateCartDisplay(true));
        })
        .catch(error => console.error('Error initializing app:', error));
}

// Load header function
async function loadHeader() {
    if (document.querySelector('#header-content')) return;

    try {
        const response = await fetch('../header.html');
        const data = await response.text();
        document.body.insertAdjacentHTML('afterbegin', data);
        console.log ('Header loaded successfully')
    } catch (error) {
        console.error('Error loading header:', error);
        throw error;
    }
}

// Attach event listeners
function attachEventListeners() {
    const elements = {
        hamburgerMenu: document.querySelector('.hamburger-menu'),
        mobileNavigation: document.querySelector('.mobile-navigation'),
        cartMenu: document.querySelector('.cart-menu-mobile'),
        desktopCart: document.querySelector('.desktop-cart'),
        cartContents: document.querySelector('.cart-contents'),
        shopLink: document.querySelector('.shop-link'),
        dropdownContent: document.querySelector('.mobile-dropdown')
    };

    elements.hamburgerMenu.addEventListener('click', () => toggleClasses(elements.hamburgerMenu, elements.mobileNavigation));
    elements.cartMenu.addEventListener('click', () => toggleClasses(elements.cartMenu, elements.cartContents));
    elements.desktopCart.addEventListener('click', () => toggleClasses(elements.desktopCart, elements.cartContents));
    elements.shopLink.addEventListener('click', (event) => {
        event.preventDefault();
        elements.dropdownContent.classList.toggle('active');
    });
}

// Helper function to toggle classes
function toggleClasses(...elements) {
    elements.forEach(el => el.classList.toggle('active'));
}

// Setup form validation
function setupFormValidation() {
    const requiredFields = document.querySelectorAll('input[required], textarea[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => validateField(field));
    });
}

// Helper function to validate a field
function validateField(field) {
    if (field.value.trim() === '') {
        field.classList.add('touched');
    } else {
        field.classList.remove('touched');
    }
}

// Setup quantity buttons
function setupQuantityButtons() {
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', () => addTemporaryClass(button, 'hover-effect', 1000));
    });
}

// Helper function to add and remove a class after a delay
function addTemporaryClass(element, className, delay) {
    element.classList.add(className);
    setTimeout(() => element.classList.remove(className), delay);
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired. Initializing app...');
    initializeApp();
});