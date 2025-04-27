document.addEventListener('DOMContentLoaded', function() {
    // Select all add to cart buttons
    const addButtons = document.querySelectorAll('.add-btn');
    
    // Create cart items container if it doesn't exist
    const cart = document.querySelector('.cart');
    let cartItemsContainer = document.querySelector('.cart-items');
    
    if (!cartItemsContainer) {
      cartItemsContainer = document.createElement('div');
      cartItemsContainer.className = 'cart-items';
      const totalElement = document.querySelector('.total');
      cart.insertBefore(cartItemsContainer, totalElement);
    }
    
    const orderTotalElement = document.querySelector('.total strong');
    const confirmBtn = document.querySelector('.confirm-btn');
  
    let cartItems = [];
    let total = 0;
  
    // Add to Cart functionality
    addButtons.forEach(button => {
      button.addEventListener('click', function() {
        const item = this.closest('.item');
        const itemName = item.querySelector('h4').textContent.trim();
        const itemPriceText = item.querySelector('p').textContent.trim();
        const itemPrice = parseFloat(itemPriceText.replace('$', ''));
        
        // Check if item already exists in cart
        const existingItem = cartItems.find(item => item.name === itemName);
        
        if (existingItem) {
          existingItem.quantity += 1;
          existingItem.totalPrice = existingItem.quantity * itemPrice;
        } else {
          cartItems.push({
            name: itemName,
            price: itemPrice,
            quantity: 1,
            totalPrice: itemPrice
          });
        }
        
        // Recalculate total
        total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
        
        // Update UI
        updateCart();
      });
    });
  
    // Update cart display
    function updateCart() {
      cartItemsContainer.innerHTML = '';
      
      if (cartItems.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Your cart is empty';
        cartItemsContainer.appendChild(emptyMessage);
      } else {
        cartItems.forEach(item => {
          const cartItemElement = document.createElement('div');
          cartItemElement.className = 'cart-item';
          cartItemElement.innerHTML = `
            <div class="item-info">
              <p>${item.name}</p>
              <small>${item.quantity}x @ $${item.price.toFixed(2)}</small>
            </div>
            <span>$${item.totalPrice.toFixed(2)}</span>
          `;
          cartItemsContainer.appendChild(cartItemElement);
        });
      }
      
      orderTotalElement.textContent = `$${total.toFixed(2)}`;
    }
  
    // Confirm order
    confirmBtn.addEventListener('click', function() {
      if (cartItems.length === 0) {
        alert('Your cart is empty!');
      } else {
        alert(`Order confirmed! Total: $${total.toFixed(2)}`);
        cartItems = [];
        total = 0;
        updateCart();
      }
    });
  
    // Initialize cart
    updateCart();
  });