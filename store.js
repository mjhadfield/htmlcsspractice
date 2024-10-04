let cart = {};

// Load the cart from localStorage as soon as the script is executed

document.addEventListener('DOMContentLoaded', function() {
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.body.insertAdjacentHTML('afterbegin', data);

      // Attach event listeners after the header is added
      attachEventListeners();

      // Call updateCartDisplay after the header and cart div are loaded
      updateCartDisplay();
      populateProductGrid();
      loadCart();

    })
    .catch(error => console.error('Error loading header:', error));
});

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
      <h3 class="product-title">${product.name}</h3>
      <p class="product-description">${product.description}</p>
    </div>
    <div class="product-bottom">
      <span class="price">$${product.cost.toFixed(2)}</span>
      <div class="quantity">
        <label for="quantity-${product.id}">Qty:</label>
        <input type="number" id="quantity-${product.id}" value="1" min="1" max="10" class="quantity-input" onchange="handleQuantityChange(event, ${product.id})">
      </div>
      <div class="button-container">
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    </div>
  `;

  return productItem;
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
    alert('Please enter a valid quantity');
    return;
  }

  if (cart[productId]) {
    cart[productId] += quantity;
  } else {
    cart[productId] = quantity;
  }

  saveCart();
  updateCartDisplay();

  alert(`Added ${quantity} item(s) to the cart`);

  quantityInput.value = 1;
}

// Update the cart display based on the current cart data
function updateCartDisplay() {
  const cartDiv = document.getElementById('cart');
  if (!cartDiv) return; // Exit if cart div doesn't exist

  cartDiv.innerHTML = '';

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
              <span class="cart-item-name">${product.name}</span>
              <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
            </div>
            <button onclick="removeFromCart(${product.id})">Remove</button>
          `;
          cartDiv.appendChild(itemDiv);
        }
      }

      const totalDiv = document.createElement('div');
      totalDiv.className = 'cart-total';
      totalDiv.textContent = `Total: $${total.toFixed(2)}`;
      cartDiv.appendChild(totalDiv);
    })
    .catch(error => console.error('Error updating cart:', error));
}

// Remove an item from the cart
function removeFromCart(productId) {
  if (cart[productId]) {
    delete cart[productId];
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