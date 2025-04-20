
window.addEventListener("DOMContentLoaded", () => {
    const cart = JSON.parse(localStorage.getItem("orderCart")) || [];
    const categoryButtons = document.querySelectorAll(".category-button");
    const filterButtons = document.querySelectorAll(".additional-filters button");
    const dishItems = document.querySelectorAll(".dish-item");
    // To track active filters
    let activeCategory = null;
    let activeDishType = null;
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


    function filterDishes() {
        dishItems.forEach(dish => {
            const dishCategory = dish.getAttribute("data-category").toLowerCase();
            const dishType = dish.getAttribute("data-type").toLowerCase().replace("-", " ");
            

            // Check if the dish matches the active category and type filters
            const categoryMatches = activeCategory ? dishCategory === activeCategory : true;
            const typeMatches = activeDishType ? dishType === activeDishType : true;

            // Show or hide dish based on filters
            if (categoryMatches && typeMatches) {
                dish.style.display = "block"; // Show dish
            } else {
                dish.style.display = "none"; // Hide dish
            }
        });
    }

    // Handle category button click
    categoryButtons.forEach(button => {
       

        button.addEventListener("click", function () {
            const category = this.getAttribute("data-category").toLowerCase();
            

            // If the category is already active, reset filters to show all dishes
            if (activeCategory === category) {
                activeCategory = null;
            } else {
                activeCategory = category;
            }

            // Update category button styles
            categoryButtons.forEach(btn => {
                if (btn.getAttribute("data-category").toLowerCase() === activeCategory) {
                    btn.classList.add("bg-indigo-700"); // Active state
                } else {
                    btn.classList.remove("bg-indigo-700"); // Inactive state
                }
            });

            // Apply the filters
            filterDishes();
        });
    });


       // Handle type filter button click (Veg/Non-Veg)
       filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            const type = this.innerText.toLowerCase();
    

            // If the type is already active, reset the type filter
            if (activeDishType === type) {
                activeDishType = null;
            } else {
                activeDishType = type;
            }

            // Apply the filters
            filterDishes();

            // Update filter button styles
            filterButtons.forEach(btn => {
                if (btn.innerText.toLowerCase() === activeDishType) {
                    btn.style.backgroundColor = "#16A34A"; // Active state
                } else {
                    btn.style.backgroundColor = "#34D399"; // Inactive state
                }
            });
        });
    });

});