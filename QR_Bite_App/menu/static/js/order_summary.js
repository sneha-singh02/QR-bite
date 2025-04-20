document.addEventListener('DOMContentLoaded', () => {
  const orderItemsContainer = document.getElementById('order-items-container');
  const orderTotalElement = document.getElementById('order-total');
  const emptyCartMessage = document.getElementById('empty-cart-message');
  const addMoreButton = document.querySelector('.add-more-button');
  const checkoutButton = document.querySelector('.checkout-button');
  const exploreMenuBtn = document.getElementById('explore-menu-left');
  
  let orderCart = JSON.parse(localStorage.getItem("orderCart")) || [];
  let orderTotal = 0;

  if (orderCart.length === 0) {
    emptyCartMessage.style.display = "block";
    addMoreButton.style.display = "none";
    orderItemsContainer.style.display = "none";
    document.getElementById('explore-menu-wrapper').classList.remove('hidden');
  } else {
    orderCart.forEach(item => {
      const orderItemDiv = document.createElement('div');
      orderItemDiv.className = "order-item bg-white rounded-lg shadow-md p-4 mb-4 flex justify-between items-start";

      orderItemDiv.innerHTML = `
        <div class="item-details">
          <h3 class="text-lg font-semibold text-gray-800">${item.name}</h3>
          <p class="text-gray-600">Price: $${item.price.toFixed(2)}</p>
          <p class="text-gray-600">Quantity: <span class="item-quantity">${item.quantity}</span></p>
          <div class="quantity-controls flex items-center mt-2">
            <button class="quantity-button decrement-button bg-gray-200 px-2 rounded">-</button>
            <span class="mx-2 text-gray-800">${item.quantity}</span>
            <button class="quantity-button increment-button bg-gray-200 px-2 rounded">+</button>
          </div>
        </div>
        <div class="item-total text-right">
          <p class="text-lg font-semibold text-gray-800">Sub Total: <span class="subtotal">${(item.price * item.quantity).toFixed(2)}</span></p>
        </div>
        <button class="remove-button text-red-500 hover:text-red-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Remove
        </button>
      `;
      orderItemsContainer.appendChild(orderItemDiv);
      orderTotal += item.price * item.quantity;
    });
    orderTotalElement.textContent = `$${orderTotal.toFixed(2)}`;
  }

  orderItemsContainer.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('increment-button')) {
      const itemContainer = target.closest('.order-item');
      const quantitySpan = itemContainer.querySelector('.item-quantity');
      let quantity = parseInt(quantitySpan.textContent);
      quantity++;
      quantitySpan.textContent = quantity;
      itemContainer.querySelector('.quantity-controls span').textContent = quantity;

      const itemName = itemContainer.querySelector('.text-lg').textContent;
      const targetItem = orderCart.find(item => item.name === itemName);
      targetItem.quantity = quantity;
      localStorage.setItem('orderCart', JSON.stringify(orderCart));

      updateSubtotal(itemContainer, quantity);
      updateTotal();
    }

    if (target.classList.contains('decrement-button')) {
      const itemContainer = target.closest('.order-item');
      const quantitySpan = itemContainer.querySelector('.item-quantity');
      let quantity = parseInt(quantitySpan.textContent);
      if (quantity > 1) {
        quantity--;
        quantitySpan.textContent = quantity;

        const itemName = itemContainer.querySelector('.text-lg').textContent;
        const targetItem = orderCart.find(item => item.name === itemName);
        targetItem.quantity = quantity;
        localStorage.setItem('orderCart', JSON.stringify(orderCart));

        updateSubtotal(itemContainer, quantity);
        updateTotal();
      }
    }

    if (target.classList.contains('remove-button')) {
      const itemContainer = target.closest('.order-item');
      const itemName = itemContainer.querySelector('.text-lg').textContent;
      orderCart = orderCart.filter(item => item.name !== itemName);
      localStorage.setItem('orderCart', JSON.stringify(orderCart));
      itemContainer.remove();
      updateTotal();
      updateMenuAfterRemove(itemName);
      if (orderCart.length === 0) {
        emptyCartMessage.style.display = "block";
        addMoreButton.style.display = "none";
        orderItemsContainer.style.display = "none";
        document.getElementById('explore-menu-wrapper').classList.remove('hidden');
      }
    }
  });


  checkoutButton.addEventListener('click', () => {
    alert('Proceeding to checkout...');
  });

  // ✅ Fixed explore button logic here:
  if (exploreMenuBtn) {
    const targetUrl = exploreMenuBtn.dataset.url;
    exploreMenuBtn.addEventListener('click', () => {
      window.location.href = targetUrl;
    });
  }
  if (addMoreButton) {
    addMoreButton.addEventListener('click', function () {
      const redirectUrl = this.getAttribute('data-url');
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    });
  }

  function updateSubtotal(itemContainer, quantity) {
    const price = parseFloat(itemContainer.querySelector('.text-gray-600').textContent.replace('Price: $', ''));
    const subtotalElement = itemContainer.querySelector('.subtotal');
    const subtotal = quantity * price;
    subtotalElement.textContent = subtotal.toFixed(2);
  }

  function updateTotal() {
    orderTotal = orderCart.reduce((total, item) => total + (item.price *  item.quantity), 0);
    orderTotalElement.textContent = `$${orderTotal.toFixed(2)}`;
  }

  // Function to update the menu after removing an item from the order
  function updateMenuAfterRemove(itemName) {
    const menuItems = document.querySelectorAll('.dish-item');
    menuItems.forEach(item => {
      if (item.querySelector('.dish-name').innerText.trim() === itemName) {
        const addToCartBtn = item.querySelector('.add-button');
        addToCartBtn.style.display = 'inline-block'; // Show the Add to Cart button
        const removeBtn = item.querySelector('.remove-button');
        if (removeBtn) {
          removeBtn.style.display = 'none'; // Hide the Remove button
        }
      }
    });
  }
});
