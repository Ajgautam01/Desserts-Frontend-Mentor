document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('cards-container');
  const cart = {
    items: [],
    total: 0
  };

  // DOM Elements for Confirmation Modal
  const confirmationModal = document.querySelector('.confirmation-modal');
  const newOrderBtn = document.querySelector('.new-order-btn');
  const confirmationItems = document.getElementById('confirmation-items');
  const confirmationTotal = document.getElementById('confirmation-total');
  const confirmBtn = document.querySelector('.confirm-btn');

  // Fetch data from JSON file
  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      // Loop through data to generate cards dynamically
      data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'item';

        div.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" />

                    <div class="pre-cart-controls hidden">
                        <button class="quantity-btn decrease">-</button>
                        <span class="quantity">1</span>
                        <button class="quantity-btn increase">+</button>
                    </div>

                    <div class="btn-con">
                        <button class="add-btn">
                            <img src="assets/images/icon-add-to-cart.svg" alt="cart icon" class="cart-cons">
                            Add to Cart
                        </button>
                    </div>

                    <div class="category-title">${item.category}</div>
                    <div class="info">
                        <h4>${item.title}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                `;
        container.appendChild(div);
      });
    })
    .catch(error => {
      console.log('Error loading data:', error);
    });

  // Handle Add to Cart Button
  container.addEventListener('click', function (e) {
    if (e.target.closest('.add-btn')) {
      const button = e.target.closest('.add-btn');
      const item = button.closest('.item');
      button.classList.add('hidden');
      item.querySelector('.pre-cart-controls').classList.remove('hidden');
      item.querySelector('img').classList.add('active');
      addItemToCart(item);
    }
  });

  // Handle Quantity Adjustments (Increase / Decrease)
  container.addEventListener('click', function (e) {
    const btn = e.target.closest('.quantity-btn');
    if (!btn) return;

    const controls = btn.closest('.pre-cart-controls');
    const quantityEl = controls.querySelector('.quantity');
    let quantity = parseInt(quantityEl.textContent);

    const item = e.target.closest('.item');
    if (btn.classList.contains('decrease')) {
      if (quantity === 1) {
        removeItemFromCart(item);  // Remove item if quantity is 1 and "-" is clicked
        resetControls(item);       // Reset item controls
      } else {
        quantity = Math.max(1, quantity - 1);  // Don't go below 1
        updateItemQuantityInCart(item, quantity);
      }
    } else if (btn.classList.contains('increase')) {
      quantity++;  // Increase quantity
      updateItemQuantityInCart(item, quantity);
    }

    // Update displayed quantity
    quantityEl.textContent = quantity;
  });

  // Add item to the cart
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

  // Update item quantity in the cart
  function updateItemQuantityInCart(itemElement, newQuantity) {
    const name = itemElement.querySelector('h4').textContent;
    const existingItem = cart.items.find(item => item.name === name);

    if (existingItem) {
      existingItem.quantity = newQuantity;
      existingItem.total = existingItem.price * newQuantity;
      updateCart();
    }
  }

  // Remove item from cart
  function removeItemFromCart(itemElement) {
    const name = itemElement.querySelector('h4').textContent;
    cart.items = cart.items.filter(item => item.name !== name);
    updateCart();
  }

  // Reset item controls
  function resetControls(item) {
    const controls = item.querySelector('.pre-cart-controls');
    controls.querySelector('.quantity').textContent = '1';
    item.querySelector('.add-btn').classList.remove('hidden');
    item.querySelector('.pre-cart-controls').classList.add('hidden');
    item.querySelector('img').classList.remove('active');
  }

  // Update Cart Display
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
      btn.addEventListener('click', function () {
        const itemName = this.getAttribute('data-name');
        cart.items = cart.items.filter(item => item.name !== itemName);
        updateCart();
      });
    });

    // Enable/disable confirm button based on cart items
    confirmBtn.disabled = cart.items.length === 0;
  }

  // Confirm Order Button
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

  // New Order Button
  newOrderBtn.addEventListener('click', function () {
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

  // Close Confirmation Modal
  function closeConfirmationModal() {
    confirmationModal.classList.remove('active');
    setTimeout(() => {
      confirmationModal.classList.add('hidden');
      document.body.classList.remove('no-scroll');
    }, 300);
  }

  // Close modal when clicking outside
  confirmationModal.addEventListener('click', function (e) {
    if (e.target === confirmationModal) {
      closeConfirmationModal();
    }
  });

  // Initialize cart
  updateCart();
});