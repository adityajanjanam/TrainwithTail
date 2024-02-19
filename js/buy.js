// Define the cartItemCount variable globally
let cartItemCount = 0;

// Add a click event listener to each 'Add to Cart' button
document.querySelectorAll('.add-to-cart-button').forEach(function(button) {
    button.addEventListener('click', function() {
        // Update the cartItemCount based on the button text
        if (this.textContent === 'Add to Cart') {
            cartItemCount++;
            sessionStorage.setItem('cartItemCount', cartItemCount);
            this.textContent = 'Added to Cart';
        } else {
            cartItemCount--;
            sessionStorage.setItem('cartItemCount', cartItemCount);
            this.textContent = 'Add to Cart';
        }

        // Update the cart count in the DOM
        document.getElementById('cartItemCount').textContent = cartItemCount;

        // Get the product details
        var product = {
            image: this.closest('.product-body').querySelector('img').src,
            name: this.closest('.product-body').querySelector('.product-title').textContent,
            price: parseFloat(this.closest('.product-body').querySelector('.product-price').textContent.replace('$', '')),
            quantity: 1
        };

        // Store the product details in the session storage
        sessionStorage.setItem('cartItem' + cartItemCount, JSON.stringify(product));
    });
});


// Define the toggleCart function
function toggleCart() {
    // Retrieve the cartItemCount from sessionStorage
    cartItemCount = parseInt(sessionStorage.getItem('cartItemCount')) || 0;

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