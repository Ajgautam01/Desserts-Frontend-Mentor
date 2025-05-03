document.addEventListener('DOMContentLoaded', function () {
  const cart = {
    items: [],
    total: 0
  };

  const confirmationModal = document.querySelector('.confirmation-modal');
  const closeConfirmation = document.querySelector('.close-confirmation');
  const newOrderBtn = document.querySelector('.new-order-btn');
  const confirmationItems = document.getElementById('confirmation-items');
  const confirmationTotal = document.getElementById('confirmation-total');

  // 1. Handle "Add to Cart" button
  document.querySelectorAll('.add-btn').forEach(button => {
    button.addEventListener('click', function (e) {
      e.stopPropagation();
      const item = this.closest('.item');
      this.classList.add('hidden');
      item.querySelector('.pre-cart-controls').classList.remove('hidden');
      item.querySelector('img').classList.add('active');
    });
  });

  // 2. Quantity adjustment logic
  document.querySelectorAll('.quantity-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const controls = this.closest('.pre-cart-controls');
      const quantityEl = controls.querySelector('.quantity');
      let quantity = parseInt(quantityEl.textContent);

      if (this.classList.contains('decrease')) {
        quantity = Math.max(1, quantity - 1);
      } else if (this.classList.contains('increase')) {
        quantity++;
      }

      quantityEl.textContent = quantity;

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

  // 3. Add item to cart when clicking outside
  document.addEventListener('click', function (e) {
    const activeControls = document.querySelector('.pre-cart-controls:not(.hidden)');
    if (activeControls && !e.target.closest('.pre-cart-controls') && !e.target.classList.contains('add-btn')) {
      const item = activeControls.closest('.item');
      addItemToCart(item);
      resetControls(item);
    }
  });

  // Reset UI controls after adding to cart
  function resetControls(item) {
    const controls = item.querySelector('.pre-cart-controls');
    controls.classList.add('hidden');
    controls.querySelector('.quantity').textContent = '1';
    item.querySelector('.add-btn').classList.remove('hidden');
    item.querySelector('img').classList.remove('active');
  }

  // 4. Add item to cart
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

  // 5. Update cart UI
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

    // Add remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', function () {
        const itemName = this.getAttribute('data-name');
        cart.items = cart.items.filter(item => item.name !== itemName);
        updateCart();
      });
    });
  }

  // 6. Show confirmation modal
  function showConfirmationModal() {
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

  // 7. Close modal
  function closeConfirmationModal() {
    confirmationModal.classList.remove('active');
    setTimeout(() => {
      confirmationModal.classList.add('hidden');
      document.body.classList.remove('no-scroll');
    }, 300);
  }

  // 8. Confirm order
  document.querySelector('.confirm-btn').addEventListener('click', function () {
    if (cart.items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    showConfirmationModal();
  });

  // 9. New Order logic
  newOrderBtn.addEventListener('click', function () {
    closeConfirmationModal();
    cart.items = [];
    cart.total = 0;
    updateCart();

    // Reset all UI item states
    document.querySelectorAll('.item').forEach(item => {
      resetControls(item);
    });
  });

  // 10. Close confirmation modal
  closeConfirmation.addEventListener('click', closeConfirmationModal);

  // 11. Dismiss modal on outside click
  confirmationModal.addEventListener('click', function (e) {
    if (e.target === confirmationModal) {
      closeConfirmationModal();
    }
  });
});
