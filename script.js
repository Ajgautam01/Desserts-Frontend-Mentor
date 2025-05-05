document.addEventListener('DOMContentLoaded', function() {
  const cart = {
    items: [],
    total: 0
  };

  // DOM Elements
  const confirmationModal = document.querySelector('.confirmation-modal');
  const newOrderBtn = document.querySelector('.new-order-btn');
  const confirmationItems = document.getElementById('confirmation-items');
  const confirmationTotal = document.getElementById('confirmation-total');
  const confirmBtn = document.querySelector('.confirm-btn');
  
  // Track current editing item
  let currentEditingItem = null;

  // 1. Handle "Add to Cart" button
  document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      const item = this.closest('.item');
      currentEditingItem = item;
      
      // Show quantity controls
      this.classList.add('hidden');
      item.querySelector('.pre-cart-controls').classList.remove('hidden');
      item.querySelector('img').classList.add('active');
    });
  });

  // 2. Handle quantity adjustments
  document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const controls = this.closest('.pre-cart-controls');
      const quantityEl = controls.querySelector('.quantity');
      let quantity = parseInt(quantityEl.textContent);

      if (this.classList.contains('decrease')) {
        quantity = Math.max(1, quantity - 1);
      } else {
        quantity++;
      }
      quantityEl.textContent = quantity;
    });
  });

  // 3. Add item to cart when clicking outside
  document.addEventListener('click', function(e) {
    if (!currentEditingItem) return;
    
    const controls = currentEditingItem.querySelector('.pre-cart-controls');
    if (!e.target.closest('.pre-cart-controls') && !e.target.classList.contains('add-btn')) {
      addItemToCart(currentEditingItem);
      resetControls(currentEditingItem);
      currentEditingItem = null;
    }
  });

  // Helper functions
  function resetControls(item) {
    const controls = item.querySelector('.pre-cart-controls');
    controls.classList.add('hidden');
    controls.querySelector('.quantity').textContent = '1';
    item.querySelector('.add-btn').classList.remove('hidden');
    item.querySelector('img').classList.remove('active');
  }

  function addItemToCart(itemElement) {
    const name = itemElement.querySelector('h4').textContent;
    const price = parseFloat(itemElement.querySelector('p').textContent.replace('$', ''));
    const quantity = parseInt(itemElement.querySelector('.quantity').textContent);
    const imageSrc = itemElement.querySelector('img').src;
    const category = itemElement.querySelector('.category-title').textContent;
    const total = price * quantity;

    const existingItem = cart.items.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total = existingItem.price * existingItem.quantity;
    } else {
      cart.items.push({ name, price, quantity, imageSrc, category, total });
    }

    updateCart();
  }

  function updateCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    cart.total = 0;

    cart.items.forEach(item => {
      item.total = item.price * item.quantity;
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

    document.getElementById('order-total').textContent = `$${cart.total.toFixed(2)}`;

    // Update remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', function() {
        const itemName = this.getAttribute('data-name');
        cart.items = cart.items.filter(item => item.name !== itemName);
        updateCart();
      });
    });

    // Enable/disable confirm button based on cart items
    confirmBtn.disabled = cart.items.length === 0;
  }

  // 4. Confirm Order Button
  confirmBtn.addEventListener('click', showConfirmationModal);

  function showConfirmationModal() {
    if (cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    confirmationItems.innerHTML = '';
    let calculatedTotal = 0;
  
    cart.items.forEach(item => {
      calculatedTotal += item.price * item.quantity;
  
      const itemElement = document.createElement('div');
      itemElement.className = 'confirmation-item';
      itemElement.innerHTML = `
        <img src="${item.imageSrc}" alt="${item.name}" class="confirmation-item-img">
        <div class="confirmation-item-details">
          <div class="confirmation-item-name">${item.name}</div>
          <div class="confirmation-item-quantity">${item.quantity}x @ $${item.price.toFixed(2)}</div>
        </div>
        <div class="confirmation-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
      `;
      confirmationItems.appendChild(itemElement);
    });
  
    confirmationTotal.textContent = `$${calculatedTotal.toFixed(2)}`;
    confirmationModal.classList.remove('hidden');
    confirmationModal.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  // 5. New Order Button
  newOrderBtn.addEventListener('click', function() {
    closeConfirmationModal();
    
    // Reset cart
    cart.items = [];
    cart.total = 0;
    updateCart();
    
    // Reset all item controls
    document.querySelectorAll('.item').forEach(item => {
      resetControls(item);
    });
  });

  function closeConfirmationModal() {
    confirmationModal.classList.remove('active');
    setTimeout(() => {
      confirmationModal.classList.add('hidden');
      document.body.classList.remove('no-scroll');
    }, 300);
  }

  // 6. Close modal when clicking outside
  confirmationModal.addEventListener('click', function(e) {
    if (e.target === confirmationModal) {
      closeConfirmationModal();
    }
  });

  // Initialize cart
  updateCart();
});