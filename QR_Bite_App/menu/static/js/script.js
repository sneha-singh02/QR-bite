// Wait for the DOM to fully load
window.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("orderCart")) || [];

    // Function to update localStorage
    function updateCartStorage(cart) {
        localStorage.setItem("orderCart", JSON.stringify(cart));
    }

    // Function to create quantity controls and Remove button
    function createQuantityControls(dishItem, dishName, price) {
        const container = document.createElement("div");
        container.className = "flex items-center gap-2 mt-2";

        const minusBtn = document.createElement("button");
        minusBtn.textContent = "-";
        minusBtn.className = "bg-gray-200 px-3 py-1 rounded text-lg font-bold";

        const qtySpan = document.createElement("span");
        qtySpan.className = "font-semibold text-gray-800";

        const plusBtn = document.createElement("button");
        plusBtn.textContent = "+";
        plusBtn.className = "bg-gray-200 px-3 py-1 rounded text-lg font-bold";

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.className = "bg-red-500 text-white px-4 py-1 rounded text-lg font-bold mt-2 ml-2";

        let currentItem = cart.find(item => item.name === dishName);
        if (!currentItem) {
            currentItem = { name: dishName, price, quantity: 1 };
            cart.push(currentItem);
        }
        qtySpan.textContent = currentItem.quantity;
        updateCartStorage(cart);

        // Minus button logic
        minusBtn.addEventListener("click", () => {
            if (currentItem.quantity > 1) {
                currentItem.quantity--;
                qtySpan.textContent = currentItem.quantity;
                updateCartStorage(cart);
            }
        });

        // Plus button logic
        plusBtn.addEventListener("click", () => {
            currentItem.quantity++;
            qtySpan.textContent = currentItem.quantity;
            updateCartStorage(cart);
        });

        // Remove button logic
        removeBtn.addEventListener("click", () => {
            const index = cart.findIndex(item => item.name === dishName);
            if (index > -1) {
                cart.splice(index, 1);  // Remove item from cart
                updateCartStorage(cart);
            }

            // Revert to the original state in menu
            // Show the original "Add to Cart" and "Order Now" buttons
            dishItem.querySelectorAll(".add-button").forEach(btn => btn.style.display = "inline-block");

            // Remove the quantity controls and Remove button
            dishItem.querySelector(".dish-details").removeChild(container);
        });

        container.appendChild(minusBtn);
        container.appendChild(qtySpan);
        container.appendChild(plusBtn);
        container.appendChild(removeBtn);

        dishItem.querySelector(".dish-details").appendChild(container);
    }

    // Modify "Add to Cart" button logic
    document.querySelectorAll(".add-button").forEach(button => {
        if (button.innerText === "Add to Cart") {
            button.addEventListener("click", e => {
                const dishItem = e.target.closest(".dish-item");
                const name = dishItem.querySelector(".dish-name").innerText.trim();
                const price = parseFloat(
                    dishItem.querySelector(".dish-price").innerText.replace("Price: $", "").trim()
                );

                // Hide both buttons
                dishItem.querySelectorAll(".add-button").forEach(btn => btn.style.display = "none");

                // Show "Remove" button and create quantity controls
                createQuantityControls(dishItem, name, price);
            });
        }
    });

    // Order Now stays untouched
    document.querySelectorAll(".add-button").forEach(button => {
        if (button.innerText === "Order Now") {
            button.addEventListener("click", e => {
                const dishItem = e.target.closest(".dish-item");
                const name = dishItem.querySelector(".dish-name").innerText.trim();
                const price = parseFloat(
                    dishItem.querySelector(".dish-price").innerText.replace("Price: $", "").trim()
                );

                let cart = JSON.parse(localStorage.getItem("orderCart")) || [];
                const existing = cart.find(item => item.name === name);
                if (!existing) {
                    cart.push({ name, price, quantity: 1 });
                }
                localStorage.setItem("orderCart", JSON.stringify(cart));

                window.location.href = "/order_summary/";  // Redirect to order summary page
            });
        }
    });
});
