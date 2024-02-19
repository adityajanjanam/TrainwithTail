// Display the cart when the page is loaded
document.addEventListener('DOMContentLoaded', function() {
    displayCartItems();
});

// Function to display cart items
function displayCartItems() {
    var cartItemsElement = document.getElementById("cartItems");
    cartItemsElement.innerHTML = "";

    // Initialize the cart summary variables
    var subtotal = 0;
    var tax = 0;
    var total = 0;

    // Retrieve the cart item count from sessionStorage
    var cartItemCount = parseInt(sessionStorage.getItem('cartItemCount')) || 0;

    // Iterate over the cart items in sessionStorage
    for (var i = 1; i <= cartItemCount; i++) {
        // Get the product details from sessionStorage
        var product = JSON.parse(sessionStorage.getItem('cartItem' + i));

        // Create the cart item element
        var row = document.createElement("tr");
        row.classList.add("cartItem");

        // Set the data-product attribute with the product details
        row.setAttribute('data-product', JSON.stringify(product));

        // Create the image cell
        var imageCell = document.createElement("td");
        var div = document.createElement("div");
        var image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.width = "100";  // Set the width to 100 pixels
        image.height = "100"; // Set the height to 100 pixels
        div.appendChild(image);
        imageCell.appendChild(div);
        row.appendChild(imageCell);

        // Create the name cell
        var nameCell = document.createElement("td");
        var name = document.createElement("span");
        name.textContent = product.name;
        nameCell.appendChild(name);
        row.appendChild(nameCell);

        // Create the price cell
        var priceCell = document.createElement("td");
        priceCell.textContent = "$" + product.price.toFixed(2);
        row.appendChild(priceCell);

        // Create the quantity cell
        var quantityCell = document.createElement("td");
        var quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.value = product.quantity;
        quantityInput.min = "1";
        quantityInput.addEventListener('input', function(event) {
            // Get the current quantity value
            var currentQuantity = parseInt(event.target.value);

            // Get the row index
            var rowIndex = event.target.closest("tr").rowIndex;

            // Get the product details from sessionStorage
            var product = JSON.parse(sessionStorage.getItem('cartItem' + rowIndex));

            // Update the quantity in the sessionStorage
            product.quantity = currentQuantity;
            sessionStorage.setItem('cartItem' + rowIndex, JSON.stringify(product));

            // Trigger the cartUpdated event
            window.dispatchEvent(new Event('cartUpdated'));
            location.reload();
        });
        quantityCell.appendChild(quantityInput);
        row.appendChild(quantityCell);

        // Create the total cell
        var totalCell = document.createElement("td");
        totalCell.textContent = "$" + (product.price * product.quantity).toFixed(2);
        row.appendChild(totalCell);

        // Create the remove button cell
        var removeCell = document.createElement("td");
        var removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.addEventListener('click', function(event) {
            var product = JSON.parse(event.target.closest("tr").dataset.product);
            removeFromCart(product);
            location.reload();
        });
        removeCell.appendChild(removeButton);
        row.appendChild(removeCell);

        cartItemsElement.appendChild(row);

        // Update the subtotal for each item
        subtotal += product.price * product.quantity;
    }

    // Calculate the tax and total
    tax = subtotal * 0.13;
    total = subtotal + tax;

    // Update the cart summary
    document.getElementById("subtotal").textContent = "$"+subtotal.toFixed(2);
    document.getElementById("tax").textContent = "$"+tax.toFixed(2);
    document.getElementById("total").textContent = "$"+total.toFixed(2);
}



// Function to toggle the cart button
function toggleCart() {
    // Retrieve the cartItemCount from sessionStorage
    var cartItemCount = parseInt(sessionStorage.getItem('cartItemCount')) || 0;

    // Update the cartItemCount in the sessionStorage
    sessionStorage.setItem('cartItemCount', cartItemCount);

    // Update the cart count in the DOM
    document.getElementById('cartItemCount').textContent = cartItemCount;

    // Update the cart button based on the cartItemCount
    var cartButton = document.querySelector('.cart-button');
    if (cartItemCount > 0) {
        cartButton.classList.add('active');
    } else {
        cartButton.classList.remove('active');
    }
}

// Call the toggleCart function on DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    toggleCart();
});

// Function to add a product to the cart
function addToCart(product) {
    // Retrieve the cartItemCount from sessionStorage
    var cartItemCount = parseInt(sessionStorage.getItem('cartItemCount')) || 0;

    // Increment the cartItemCount
    cartItemCount++;

    // Update the cartItemCount in the sessionStorage
    sessionStorage.setItem('cartItemCount', cartItemCount);

    // Update the cart items in the sessionStorage
    sessionStorage.setItem('cartItem' + cartItemCount, JSON.stringify(product));

    // Trigger the cartUpdated event
    window.dispatchEvent(new Event('cartUpdated'));

    // Update the cart button
    toggleCart();
}

// Function to remove a product from the cart
function removeFromCart(product) {
    var cartItemCount = parseInt(sessionStorage.getItem('cartItemCount')) || 0;
    var updatedCartItems = [];

    for (var i = 1; i <= cartItemCount; i++) {
        var item = JSON.parse(sessionStorage.getItem('cartItem' + i));
        if (JSON.stringify(item) !== JSON.stringify(product)) {
            updatedCartItems.push(item);
        }
    }

    sessionStorage.setItem('cartItemCount', updatedCartItems.length);
    updatedCartItems.forEach((item, index) => {
        sessionStorage.setItem('cartItem' + (index + 1), JSON.stringify(item));
    });

    // Reload the page to reflect the updated cart
    window.location.reload();
}




// Function to clear the cart
function clearCart() {
    // Retrieve the cartItemCount from sessionStorage
    var cartItemCount = parseInt(sessionStorage.getItem('cartItemCount')) || 0;

    // Remove all cart items from the sessionStorage
    for (var i = 1; i <= cartItemCount; i++) {
        sessionStorage.removeItem('cartItem' + i);
    }

    // Clear the cartItemCount in the sessionStorage
    sessionStorage.setItem('cartItemCount', 0);

    // Trigger the cartUpdated event
    window.dispatchEvent(new Event('cartUpdated'));

    // Update the cart button
    toggleCart();
}