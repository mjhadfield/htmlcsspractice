function getCurrentCategory() {
    // Get the current page filename
    const path = window.location.pathname;
    const page = path.split("/").pop();
    
    // Remove the .html extension and convert to lowercase
    return page.replace('.html', '').toLowerCase();
  }

  function populateProductGrid() {
    const category = getCurrentCategory();

    fetch('products.json')
        .then(response => response.json())
        .then(products => {
            const productGrid = document.getElementById('product-grid');
            productGrid.innerHTML = ''; // Clear existing products

            const filteredProducts = products.filter(product => 
                category === 'all' || product.category.toLowerCase() === category
            );

            if (filteredProducts.length === 0) {
                // If no products are found, display the message
                const noItemsMessage = document.createElement('p');
                noItemsMessage.textContent = "No homeware found, only beer. You have enough glasses. Check a different category.";
                productGrid.appendChild(noItemsMessage);
            } else {
                // If products are found, display them
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
          <input type="number" id="quantity-${product.id}" value="1" min="1" max="10" class="quantity-input">
        </div>
        <div class="button-container">
          <button onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
    `;
  
    return productItem;
  }
  
  // Call this function when the page loads
  document.addEventListener('DOMContentLoaded', populateProductGrid);

  //Cart functionality starts here

  //Create a cart
  let cart = {};

  //Add to cart function
  function addToCart(productId) {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value);

    if (cart[productId]) {
        cart[productId] += quantity;
    } else {
        cart[productId] = quantity;
    }

    updateCartDisplay();
}

//Update the cart display
function updateCartDisplay() {
  const cartDiv = document.getElementById('cart');
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

//Remove items from the cart

function removeFromCart(productId) {
  if (cart[productId]) {
      delete cart[productId];
      updateCartDisplay();
  }
}

//Display the cart on page load

document.addEventListener('DOMContentLoaded', () => {
  populateProductGrid();
  updateCartDisplay();
});

