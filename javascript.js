document.querySelector('.hamburger-menu').addEventListener('click', function() {
    this.classList.toggle('active');
    document.querySelector('.mobile-navigation').classList.toggle('active');
  });

// Get the shop link and dropdown content
const shopLink = document.querySelector('.shop-link');
const dropdownContent = document.querySelector('.mobile-dropdown-content');

// Add click event to the shop link
shopLink.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default action

    // Toggle active class on mobile dropdown
    this.parentElement.classList.toggle('active');

    // Toggle the visibility of the dropdown content
    if (dropdownContent.style.display === 'block') {
        dropdownContent.style.display = 'none'; // Hide the dropdown
    } else {
        dropdownContent.style.display = 'block'; // Show the dropdown
    }
});

