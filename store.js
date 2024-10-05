//Create the cart and load it's contents from local storage

let cart = {};
document.addEventListener('DOMContentLoaded', function() {
  // Populate the product grid and load the cart after the header
  populateProductGrid();
  loadCart();
  updateCartDisplay();
});

//Display products based on page title
function getCurrentCategory() {
  const path = window.location.pathname;
  const page = path.split("/").pop();
  return page.replace('.html', '').toLowerCase();
}

function populateProductGrid() {
  const category = getCurrentCategory();

  fetch('products.json')
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
    <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
    <div class="product-content">
      <h3 class="product-top">${product.name} <br> £${product.cost.toFixed(2)}</h3>
    </div>
    <div class="product-bottom">
      <div class="quantity-control">
        <button class="quantity-btn minus-btn" onclick="decreaseQuantity(${product.id})">-</button>
        <input type="number" id="quantity-${product.id}" value="1" min="1" max="10" class="quantity-input" readonly>
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

  if (cart[productId]) {
    cart[productId] += quantity;
  } else {
    cart[productId] = quantity;
  }

  saveCart();
  updateCartDisplay();

  showNotification(`${quantity} added to cart`);

  quantityInput.value = 1;
}

function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;

  // Show the notification and trigger the fade-in effect
  notification.style.display = 'block'; // Make it visible first
  setTimeout(() => {
    notification.style.opacity = '1'; // Fade in
  }, 10); // Small timeout to allow the display to take effect

  // Hide the notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0'; // Start fading out
    // After the fade out is complete, hide the element
    setTimeout(() => {
      notification.style.display = 'none'; // Hide completely
    }, 500); // Match the duration of the fade out
  }, 1000); // Display for 3 seconds
}

// Update the cart display based on the current cart data
function updateCartDisplay() {
  const cartDiv = document.getElementById('cart');
  if (!cartDiv) return; // Exit if cart div doesn't exist

  cartDiv.innerHTML = ''; // Clear the cart display

  // Check if the cart is empty
  if (Object.keys(cart).length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-cart-message'; // You can add CSS for styling if needed
    emptyMessage.textContent = "There's no beer in here yet 😟";
    cartDiv.appendChild(emptyMessage);
    return; // Exit the function if cart is empty
  }

  fetch('products.json')
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
          </div>
          <div class="cart-item-details">
            <div class="cart-item-name">${product.name}</div>
            <div class="cart-item-price-remove">
              <span class="cart-item-price">£${itemTotal.toFixed(2)}</span>
            </div>
            <div class="cart-item-remove">
              <button class="button-cart" onclick="removeFromCart(${product.id})">Remove</button>
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
  }
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