//Create global variables

let cart = {};
let globalProducts = [];


//Event listener to load everything required
document.addEventListener('DOMContentLoaded', function() {
  populateProductGrid();
  loadCart();
  updateCartDisplay();
  updateCartIconQuantity();
  loadProducts();
});
// Fetch products and store them in the global variable
function loadProducts() {
    return fetch('scripts/products.json')
        .then(response => response.json())
        .then(products => {
            globalProducts = products;
            console.log('Products loaded successfully');
        })
        .catch(error => {
            console.error('Error loading products:', error);
        });
}

// Call this function when your page loads
loadProducts();

//Display products based on page title
function getCurrentCategory() {
  const path = window.location.pathname;
  const page = path.split("/").pop();
  return page.replace('.html', '').toLowerCase();
}

function populateProductGrid() {
  const category = getCurrentCategory();

  fetch('scripts/products.json')
    .then(response => response.json())
    .then(products => {
      const productGrid = document.getElementById('product-grid');
      productGrid.innerHTML = '';

      const filteredProducts = products.filter(product =>
        category === 'all' || product.category.toLowerCase() === category
      );

      if (filteredProducts.length === 0) {
        const noItemsMessage = document.createElement('p');
        noItemsMessage.textContent = "No homeware found, only beer. You have enough glasses. Check a different category.";
        productGrid.appendChild(noItemsMessage);
      } else {
        filteredProducts.forEach(product => {
          const productItem = createProductItem(product);
          productGrid.appendChild(productItem);
        });
      }
    })
    .catch(error => console.error('Error fetching products:', error));
}

function createProductItem(product) {
  const productItem = document.createElement('div');
  productItem.className = 'product-item';

  productItem.innerHTML = `
    <img src="${product.imageUrl}" alt="${product.name}" class="product-card-image">
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
function addToCart(productId) {
  const quantityInput = document.getElementById(`quantity-${productId}`);
  const quantity = parseInt(quantityInput.value);

  if (isNaN(quantity) || quantity < 1) {
    showNotification('Please enter a valid quantity');
    return;
  }
  const product = globalProducts.find(p => p.id === parseInt(productId));

  if (!product) {
      showNotification('Product not found');
      return;
  }


  if (cart[productId]) {
    cart[productId] += quantity;
  } else {
    cart[productId] = quantity;
  }

  saveCart();
  updateCartDisplay();
  updateCartIconQuantity();

  showNotification(`${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to cart`);

  quantityInput.value = 1;
}

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

// Update the cart display based on the current cart data
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
          cartDiv.appendChild(itemDiv);
        }
      }

      const totalDiv = document.createElement('div');
      totalDiv.className = 'cart-total';
      totalDiv.textContent = `Total: £${total.toFixed(2)}`;
      cartDiv.appendChild(totalDiv);

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