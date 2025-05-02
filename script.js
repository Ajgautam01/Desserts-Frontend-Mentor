document.addEventListener('DOMContentLoaded', function() {
  // Cart state
  const cart = {
    items: [],
    total: 0
  };

  // 1. Handle "Add to Cart" button clicks
  document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      const item = this.closest('.item');
      
      // Hide the add button and show quantity controls
      this.classList.add('hidden');
      item.querySelector('.pre-cart-controls').classList.remove('hidden');
      
      // Highlight the item
      item.querySelector('img').classList.add('active');
    });
  });

  // 2. Handle quantity adjustments
  document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const controls = this.closest('.pre-cart-controls');
      const quantityEl = controls.querySelector('.quantity');
      let quantity = parseInt(quantityEl.textContent);
      
      if (this.classList.contains('decrease') && quantity > 1) {
        quantity--;
      } else if (this.classList.contains('increase')) {
        quantity++;
      }
      
      quantityEl.textContent = quantity;
      
      // If this is for an item already in cart, update it
      const item = this.closest('.item');
      const itemName = item.querySelector('h4').textContent;
      const existingItem = cart.items.find(item => item.name === itemName);
      
      if (existingItem) {
        existingItem.quantity = quantity;
        existingItem.total = existingItem.price * quantity;
        updateCart();
      }
    });
  });

  // 3. Handle adding items to cart (when quantity controls are visible)
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.pre-cart-controls') && !e.target.classList.contains('add-btn')) {
      const activeControls = document.querySelector('.pre-cart-controls:not(.hidden)');
      if (activeControls) {
        const item = activeControls.closest('.item');
        addItemToCart(item);
        
        // Reset controls
        activeControls.classList.add('hidden');
        activeControls.querySelector('.quantity').textContent = '1';
        item.querySelector('.add-btn').classList.remove('hidden');
        item.querySelector('img').classList.remove('active');
      }
    }
  });

  // 4. Add item to cart function
  function addItemToCart(itemElement) {
    const name = itemElement.querySelector('h4').textContent;
    const price = parseFloat(itemElement.querySelector('p').textContent.replace('$', ''));
    const quantity = parseInt(itemElement.querySelector('.quantity').textContent);
    const imageSrc = itemElement.querySelector('img').src;
    const category = itemElement.querySelector('.category-title').textContent;
    const total = price * quantity;

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => item.name === name);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].total += total;
    } else {
      // Add new item
      cart.items.push({
        name,
        price,
        quantity,
        imageSrc,
        category,
        total
      });
    }

    updateCart();
  }

  // 5. Update cart display
  function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    
    cart.total = 0;
    
    cart.items.forEach(item => {
      cart.total += item.total;
      
      const cartItemElement = document.createElement('div');
      cartItemElement.className = 'cart-item';
      cartItemElement.innerHTML = `
        <div class="item-info">
          <img src="${item.imageSrc}" alt="${item.name}">
          <div class="item-details">
            <p>${item.name}</p>
            <small>$${item.price.toFixed(2)} × ${item.quantity}</small>
          </div>
        </div>
        <div class="item-total">
          $${item.total.toFixed(2)}
          <button class="remove-item" data-name="${item.name}">×</button>
        </div>
      `;
      cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Update order total
    document.getElementById('order-total').textContent = `$${cart.total.toFixed(2)}`;
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', function() {
        const itemName = this.getAttribute('data-name');
        cart.items = cart.items.filter(item => item.name !== itemName);
        updateCart();
      });
    });
  }

  // 6. Handle order confirmation
  document.querySelector('.confirm-btn').addEventListener('click', function() {
    if (cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    alert(`Order confirmed! Total: $${cart.total.toFixed(2)}`);
    cart.items = [];
    cart.total = 0;
    updateCart();
  });
});