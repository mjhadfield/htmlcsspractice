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
  document.querySelector('.hamburger-menu').addEventListener('click', function() {
      this.classList.toggle('active');
      document.querySelector('.mobile-navigation').classList.toggle('active');
  });

  document.querySelector('.cart-menu').addEventListener('click', function() {
      this.classList.toggle('active');
      document.querySelector('.cart-contents').classList.toggle('active');
  });

  document.querySelector('.desktop-cart').addEventListener('click', function() {
      this.classList.toggle('active');
      document.querySelector('.cart-contents').classList.toggle('active');
  });

  // Get the shop link and dropdown content
  const shopLink = document.querySelector('.shop-link');
  const dropdownContent = document.querySelector('.mobile-dropdown');

  // Add click event to the shop link
  shopLink.addEventListener('click', function(event) {
      event.preventDefault(); // Prevent the default action
      // Toggle active class on mobile dropdown
      dropdownContent.classList.toggle('active');
  });
}