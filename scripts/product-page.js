
//---------------------------------------------------------------------Purchasing options

function createQuantitySelect() {
    const select = document.createElement('select');
    for (let i = 1; i <= 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        select.appendChild(option);
    }
    return select;
}

function createAddToCartButton(productId) {
    const button = document.createElement('button');
    button.textContent = 'Add to Cart';

    button.addEventListener('click', function() {
        const quantity = document.querySelector('.product-page-purchase select').value;
        addToCart(productId, quantity);
    });

    return button;
}

//-----------------------------------------------------------------Full screen image function

function openModal(imgSrc) {
    var modal = document.getElementById("imageModal");
    var modalImg = document.getElementById("fullImage");
    modal.style.display = "block";
    modalImg.src = imgSrc;
}

//----------------------------------------------------Two functions for the nagviiation arrows

// Get the current product ID from the URL
function getProductId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id'));
}

// Navigate to the next or previous product based on the arrow clicked
function navigateToProduct(direction) {
    let currentProductId = getProductId();
    
    // Determine next or previous product based on direction
    if (direction === 'next') {
        currentProductId += 1;  // Increase product ID
    } else if (direction === 'prev') {
        currentProductId -= 1;  // Decrease product ID
    }

    // Ensure the product ID stays within valid bounds (you can adjust as per your product range)
    if (currentProductId < 1) {
        currentProductId = 1;  // Prevent negative or zero IDs
    }
    
    // Redirect to the new product page
    window.location.href = `product.html?id=${currentProductId}`;
}

//----------------------------------------------------This basically generates the entire page on load. 

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    console.log('Product ID from URL:', productId);

    // Fetch and parse the product and description JSON
    Promise.all([
        fetch('../scripts/products.json').then(response => response.json()),
        fetch('../scripts/descriptions.json').then(response => response.json())
                ]).then(([products, descriptions]) => {
        globalProducts = products;
        console.log('Successfully parsed JSON:');

        // Find the product and description that match the ID
        let product, description;

        if (Array.isArray(products)) {
            product = products.find(p => p.id == productId);
        } else if (typeof products === 'object') {
            product = products[productId];
        }

        if (Array.isArray(descriptions)) {
            description = descriptions.find(d => d.id == productId);
        } else if (typeof descriptions === 'object') {
            description = descriptions[productId];
        }
        console.log('Found product:', product);

        if (product && description) {
            // Populate the product details
            document.querySelector('.product-page-name').textContent = product.name;
            document.querySelector('.product-page-description').textContent = description.description;
            
            // Set the product image
            const imgElement = document.createElement('img');
            imgElement.src = `../images/products/${productId}.png`;
            imgElement.alt = product.name;
            const imageContainer = document.querySelector('.product-page-image');
            imageContainer.appendChild(imgElement);

            // Create price element
            const priceElement = document.createElement('div');
            priceElement.className = 'product-page-price';
            priceElement.textContent = `£${product.cost.toFixed(2)}`;

            // Add click event to open modal
            imgElement.onclick = function() {
                openModal(this.src);
            }

            // Create quantity select and add to cart button
            const quantitySelect = createQuantitySelect();
            const addToCartButton = createAddToCartButton(product.id);
            const purchaseDiv = document.querySelector('.product-page-purchase');
            purchaseDiv.appendChild(priceElement);
            purchaseDiv.appendChild(quantitySelect);
            purchaseDiv.appendChild(addToCartButton);

            document.querySelector('.product-page-fulldescription').textContent = description.longDescription;
        } else {
            console.error('Product not found');
            console.error('Product ID:', productId);
            console.error('Products:', products);
            console.error('Descriptions:', descriptions);
        }
    }).catch(error => {
        console.error('Error fetching data:', error);
    });

    // Modal functionality
    var modal = document.getElementById("imageModal");
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});