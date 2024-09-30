function getCurrentCategory() {
    // Get the current page filename
    const path = window.location.pathname;
    const page = path.split("/").pop();
    
    // Remove the .html extension and convert to lowercase
    return page.replace('.html', '').toLowerCase();
  }

  function populateProductGrid() {
    const category = getCurrentCategory();
  
    fetch('/scripts/products.json')
      .then(response => response.json())
      .then(products => {
        const productGrid = document.getElementById('product-grid');
        productGrid.innerHTML = ''; // Clear existing products
  
        products
          .filter(product => category === 'all' || product.category.toLowerCase() === category)
          .forEach(product => {
            const productItem = createProductItem(product);
            productGrid.appendChild(productItem);
          });
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