document.addEventListener('DOMContentLoaded', function() {

  const items = document.querySelectorAll('.item');

  items.forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.add-btn')) return;

      items.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
    });
  });

  const addButtons = document.querySelectorAll('.add-btn');
  const cartItemsContainer = document.getElementById('cart-items');
  const orderTotalElement = document.getElementById('order-total');
  const confirmBtn = document.querySelector('.confirm-btn');

  let cartItems = [];
  let total = 0;

  addButtons.forEach(button => {
    button.addEventListener('click', function () {
      const item = this.closest('.item');
      const itemName = item.querySelector('h4').textContent.trim();
      const itemPriceText = item.querySelector('p').textContent.trim();
      const itemPrice = parseFloat(itemPriceText.replace('$', ''));
      const itemImage = item.querySelector('img').getAttribute('src');

      const existingItem = cartItems.find(i => i.name === itemName);

      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.totalPrice = existingItem.quantity * itemPrice;
      } else {
        cartItems.push({
          name: itemName,
          price: itemPrice,
          quantity: 1,
          totalPrice: itemPrice,
          image: itemImage
        });
      }

      total = cartItems.reduce((sum, i) => sum + i.totalPrice, 0);
      updateCart();
    });
  });

  function updateCart() {
    cartItemsContainer.innerHTML = '';

    if (cartItems.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.textContent = 'Your cart is empty';
      cartItemsContainer.appendChild(emptyMessage);
    } else {
      cartItems.forEach((item, index) => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
          <div class="item-info">
            <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px; margin-right: 10px;">
            <div>
              <p>${item.name}</p>
              <small>$${item.price.toFixed(2)} each</small>
            </div>
          </div>
          <div class="quantity-controls">
            <button class="quantity-btn decrease" data-index="${index}">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn increase" data-index="${index}">+</button>
          </div>
          <span class="item-total">$${item.totalPrice.toFixed(2)}</span>
        `;
        cartItemsContainer.appendChild(cartItemElement);
      });

      document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function () {
          const index = parseInt(this.getAttribute('data-index'));
          const item = cartItems[index];

          if (this.classList.contains('increase')) {
            item.quantity += 1;
          } else if (this.classList.contains('decrease')) {
            item.quantity -= 1;
            if (item.quantity <= 0) {
              cartItems.splice(index, 1);
            }
          }

          if (item) {
            item.totalPrice = item.quantity * item.price;
          }

          total = cartItems.reduce((sum, i) => sum + (i ? i.totalPrice : 0), 0);
          updateCart();
        });
      });
    }

    orderTotalElement.textContent = `$${total.toFixed(2)}`;
  }

  confirmBtn.addEventListener('click', function () {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
    } else {
      alert(`Order confirmed! Total: $${total.toFixed(2)}`);
      cartItems = [];
      total = 0;
      updateCart();
    }
  });

  updateCart();
});
