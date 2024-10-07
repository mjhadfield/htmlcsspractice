//This Javascript is a hot mess. Please don't judge me.

//Global variables

let cart = {};
let globalProducts = [];

async function loadProducts() {
  const productGrid = document.getElementById('product-grid');
  if (!productGrid) {
      console.log('Product grid not found on this page. Skipping product load.');
      return;
  }

  try {
      const response = await fetch('../scripts/products.json');
      globalProducts = await response.json();
      console.log('Products loaded successfully');
      if (productGrid) {
          populateProductGrid();
      }
  } catch (error) {
      console.error('Error loading products:', error);
  }
}

//Display products based on page title
function getCurrentCategory() {
  const path = window.location.pathname;
  const page = path.split("/").pop();
  
  // Check if the page is "store.html" and return "all" in that case
  if (page.toLowerCase() === 'store.html') {
    return 'all';
  }
  
  return page.replace('.html', '').toLowerCase();
}

function populateProductGrid() {
  const category = getCurrentCategory();
  const productGrid = document.getElementById('product-grid');
  const sortSelect = document.getElementById('sort-select');
  productGrid.innerHTML = '';

  let filteredProducts = globalProducts.filter(product =>
      category === 'all' || product.category.toLowerCase() === category
  );

  // Sort the filtered products
  filteredProducts = sortProducts(filteredProducts, sortSelect.value);
  console.log("Products sorted")

  if (filteredProducts.length === 0) {
      const noItemsMessage = document.createElement('p');
      noItemsMessage.textContent = "No products found";
      productGrid.appendChild(noItemsMessage);
  } else {
      filteredProducts.forEach(product => {
          const productItem = createProductItem(product);
          productGrid.appendChild(productItem);
      });
  }
}

//Create product cards

function createProductItem(product) {
  const productItem = document.createElement('div');
  productItem.className = 'product-item';

  productItem.innerHTML = `
  <a href="product.html?id=${product.id}" class="product-image-link">
    <img src="${product.imageUrl}" alt="${product.name}" class="product-card-image">
  </a>
      <div class="product-top-container">
          <h3 class="product-top">${product.name} <br> £${product.cost.toFixed(2)}</h3>
      </div>
      <div class="quantity-control-container">
          <div class="quantity-control">
              <button class="quantity-btn minus-btn" onclick="decreaseQuantity(${product.id})">-</button>
              <input type="number" id="quantity-${product.id}" value="1" min="1" max="10" class="quantity-input">
              <button class="quantity-btn plus-btn" onclick="increaseQuantity(${product.id})">+</button>
          </div>
          <button class="button-product" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
  `;

  return productItem;
}

//Quantity to add to basket

function increaseQuantity(productId) {
  const input = document.getElementById(`quantity-${productId}`);
  const currentValue = parseInt(input.value);
  if (currentValue < parseInt(input.max)) {
      input.value = currentValue + 1;
  }
}

function decreaseQuantity(productId) {
  const input = document.getElementById(`quantity-${productId}`);
  const currentValue = parseInt(input.value);
  if (currentValue > parseInt(input.min)) {
      input.value = currentValue - 1;
  }
}

// Add this function to sort the products
function sortProducts(products, sortBy) {
  switch (sortBy) {
      case 'name':
          return products.sort((a, b) => a.name.localeCompare(b.name));
      case 'price-low':
          return products.sort((a, b) => a.cost - b.cost);
      case 'price-high':
          return products.sort((a, b) => b.cost - a.cost);
      case 'newest':
          return products.sort((a, b) => b.id - a.id);
      default:
          return products;
  }
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

// Save the cart to localStorage
function saveCart() {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

// Add an item to the cart and save it
function addToCart(productId, quantity) {
  const productQuantity = parseInt(quantity) || parseInt(document.getElementById(`quantity-${productId}`).value);

  if (isNaN(productQuantity) || productQuantity < 1) {
      showNotification('Please enter a valid quantity');
      return;
  }
  
  const product = globalProducts.find(p => p.id === parseInt(productId));
  
  if (!product) {
      showNotification('Product not found');
      return;
  }

  // Ensure cart quantity is treated as a number before adding
  if (cart[productId]) {
      cart[productId] = parseInt(cart[productId]) + productQuantity;
  } else {
      cart[productId] = productQuantity;
  }

  // Log the updated cart details
  console.log(`Added to cart: ${product.name}, Quantity: ${productQuantity}`);

  saveCart();
  updateCartDisplay();
  updateCartIconQuantity();

  showNotification(`${productQuantity} ${product.name}${productQuantity > 1 ? 's' : ''} added to cart`);
}


// Product notification handling

let notificationCount = 0; // Keep track of the current number of notifications
const maxNotifications = 3; // Maximum number of notifications to display

function showNotification(message) {
  const container = document.getElementById('notification-container');

  // If there are already 3 notifications, remove the oldest one
  if (notificationCount >= maxNotifications) {
    const oldestNotification = container.firstChild; // Get the first notification
    if (oldestNotification) {
      oldestNotification.remove(); // Remove the oldest notification
      notificationCount--; // Decrease the count
    }
  }

  // Create a new notification element
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.textContent = message;

  // Append the new notification to the container
  container.appendChild(notification);
  notificationCount++; // Increase the count

  // Triggering the fade-in animation
  setTimeout(() => {
    notification.style.opacity = '1'; // Fade in
  }, 10);

  // Handle fade-out and removal after a certain time
  setTimeout(() => {
    notification.style.opacity = '0'; // Fade out

    // Remove the notification from the DOM after fade-out
    notification.addEventListener('transitionend', () => {
      notification.remove();
      notificationCount--; // Decrease the count when removed
    });
  }, 2000); // Duration to show notification before fading out
}

function updateCartDisplay() {
  const cartDiv = document.getElementById('cart');
  const desktopCartQuantity = document.getElementById('desktop-cart-quantity');
  
  if (!cartDiv) return; // Exit if cart div doesn't exist

  cartDiv.innerHTML = ''; // Clear the cart display
  
  // Calculate total cart items
  let totalQuantity = 0;
  for (const quantity of Object.values(cart)) {
    totalQuantity += quantity;
  }

  // Update the desktop cart icon quantity
  if (desktopCartQuantity) {
    desktopCartQuantity.textContent = totalQuantity;
  }

  // Check if the cart is empty
  if (Object.keys(cart).length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-cart-message';
    emptyMessage.textContent = "There's no beer in here yet 😟";
    cartDiv.appendChild(emptyMessage);
    updateCartIconQuantity();
    return; // Exit the function if cart is empty
  }

  fetch('scripts/products.json')
    .then(response => response.json())
    .then(products => {
      let total = 0;
      const itemsContainer = document.createElement('div');
      itemsContainer.className = 'cart-items-container';

      for (const [productId, quantity] of Object.entries(cart)) {
        const product = products.find(p => p.id === parseInt(productId));
        if (product) {
          const itemTotal = product.cost * quantity;
          total += itemTotal;
          const itemDiv = document.createElement('div');
          itemDiv.className = 'cart-item';
          itemDiv.innerHTML = `
            <div class="cart-item-image">
              <img src="${product.imageUrl}" alt="${product.name}">
              <span class="cart-item-quantity">${quantity}</span>
              <button class="cart-item-removeall" onclick="removeAllFromCart(${productId})">x</button>
            </div>
            <div class="cart-item-container">
              <div class="cart-item-name">${product.name}</div>
              <div class="cart-item-price-container">
                <span class="cart-item-price">£${itemTotal.toFixed(2)}</span>
              </div>
              <div class="cart-item-remove">
                <button class="button-remove" onclick="removeFromCart(${product.id})">Remove</button>
              </div>
            </div>
          `;
          itemsContainer.appendChild(itemDiv);
        }
      }

// Create and append the total
const totalDiv = document.createElement('div');
totalDiv.className = 'cart-total';
totalDiv.innerHTML = `
  <div class="cart-total-amount">Total: £${total.toFixed(2)}</div>
  <a href="basket.html" class="view-basket-button">View Basket</a>
`;
cartDiv.insertBefore(totalDiv, cartDiv.firstChild);

      // Then append the items container
      cartDiv.appendChild(itemsContainer);

      updateCartIconQuantity(); // Update cart icon badge after modifying cart
    })
    .catch(error => console.error('Error updating cart:', error));
}


function removeFromCart(productId) {
  if (cart[productId]) {
    // Decrease the quantity by 1
    cart[productId]--;

    // If the quantity reaches 0, remove the product from the cart
    if (cart[productId] <= 0) {
      delete cart[productId];
    }
    saveCart();
    updateCartDisplay();
    updateCartIconQuantity();
  }
}

function removeAllFromCart(productId){
  delete cart[productId];
  saveCart();
  updateCartDisplay();
}

// Handle quantity input changes
function handleQuantityChange(event, productId) {
  const input = event.target;
  const value = parseInt(input.value);

  if (isNaN(value) || value < 1) {
    input.value = 1;
  } else if (value > 10) {
    input.value = 10;
  } else {
    updateCartQuantity(productId, value);
  }
}

// Update cart quantity and save to localStorage
function updateCartQuantity(productId, newQuantity) {
  cart[productId] = newQuantity;
  saveCart();
  updateCartDisplay();
}

function updateCartIconQuantity() {
  const cartQuantityElement = document.querySelector('.basket-icon-quantity');
  if (cartQuantityElement) {
      const totalItems = Object.values(cart).reduce((total, quantity) => total + quantity, 0);
      cartQuantityElement.textContent = totalItems === 0 ? '0' : totalItems; // Set text to totalItems or '0'
      cartQuantityElement.style.display = 'flex';
  }
}

// Event listener to load all functions on page load)
document.addEventListener('DOMContentLoaded', function() {
  loadProducts().then(() => {
      const productGrid = document.getElementById('product-grid');
      if (productGrid) {
          const sortSelect = document.getElementById('sort-select');
          sortSelect.addEventListener('change', populateProductGrid);
      }
  });
  loadCart();
  updateCartDisplay();
  updateCartIconQuantity();
});