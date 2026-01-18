
        
        // Shopping Cart Functionality
        const cart = [];
        const cartSidebar = document.querySelector('.cart-sidebar');
        const overlay = document.querySelector('.overlay');
        const closeCart = document.querySelector('.close-cart');
        // Use both cart counts (sidebar and floating button)
        const cartCountEls = document.querySelectorAll('.cart-count');
        const cartItems = document.querySelector('.cart-items');
        const totalAmount = document.querySelector('.total-amount');
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        const checkoutBtn = document.querySelector('.checkout-btn');
        const floatingCartBtn = document.getElementById('floating-cart-btn');

        // Toggle Cart (floating button)
        floatingCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            cartSidebar.classList.add('active');
            overlay.classList.add('active');
        });

        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
        });

        overlay.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
        });

        // Add to Cart
        addToCartButtons.forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                const name = button.getAttribute('data-name');
                const price = parseInt(button.getAttribute('data-price'));
                const image = button.getAttribute('data-image');

                // Check if item already in cart
                const existingItem = cart.find(item => item.id === id);

                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id,
                        name,
                        price,
                        image,
                        quantity: 1
                    });
                }

                updateCart();

                // Show confirmation
                button.innerHTML = '<i class="fas fa-check"></i> Added!';
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                }, 1500);
            });
        });

        // Update Cart
        function updateCart() {
            // Update cart count in all cart-count elements
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountEls.forEach(el => el.textContent = totalItems);

            // Update cart items
            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart-message" style="text-align: center; padding: 40px 20px; color: #666;">
                        <i class="fas fa-shopping-cart" style="font-size: 2.5rem; margin-bottom: 15px; opacity: 0.5;"></i>
                        <p>Your cart is empty</p>
                    </div>
                `;
            } else {
                cartItems.innerHTML = '';
                cart.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <div class="cart-item-price">KSH ${item.price}</div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn plus" data-id="${item.id}">+</button>
                            </div>
                            <button class="remove-item" data-id="${item.id}">Remove</button>
                        </div>
                    `;
                    cartItems.appendChild(cartItem);
                });

                // Add event listeners to quantity buttons
                document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.getAttribute('data-id');
                        const item = cart.find(item => item.id === id);
                        if (item.quantity > 1) {
                            item.quantity -= 1;
                        } else {
                            const index = cart.findIndex(item => item.id === id);
                            cart.splice(index, 1);
                        }
                        updateCart();
                    });
                });

                document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.getAttribute('data-id');
                        const item = cart.find(item => item.id === id);
                        item.quantity += 1;
                        updateCart();
                    });
                });

                document.querySelectorAll('.remove-item').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const id = btn.getAttribute('data-id');
                        const index = cart.findIndex(item => item.id === id);
                        cart.splice(index, 1);
                        updateCart();
                    });
                });
            }

            // Update total
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            totalAmount.textContent = `KSH ${total}`;
        }

        
        // Category Filtering
        const categoryChips = document.querySelectorAll('.category-chip');
        const productCards = document.querySelectorAll('.product-card');

        categoryChips.forEach(chip => {
            chip.addEventListener('click', () => {
                // Update active chip
                categoryChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                // Filter products
                const category = chip.getAttribute('data-category');

                productCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // Hamburger Menu Dropdown Toggle
        const mobileMenu = document.querySelector('.mobile-menu');
        const navUl = document.querySelector('nav ul');
        let menuOpen = false;
        mobileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
            navUl.classList.toggle('show');
            menuOpen = navUl.classList.contains('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (menuOpen && !navUl.contains(e.target) && !mobileMenu.contains(e.target)) {
                navUl.classList.remove('show');
                menuOpen = false;
            }
        });

        
const modal = document.getElementById('checkoutModal');
const closeBtn = document.querySelector('.close');
const payBtn = document.getElementById('payBtn');
const phoneInput = document.getElementById('phoneNumber');

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
    } else {
        modal.style.display = 'block';
    }
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

payBtn.addEventListener('click', async () => {
    const phone = phoneInput.value.trim();
    if (!phone.match(/^07\d{8}$/)) {
        alert('Please enter a valid phone number.');
        return;
    }

    // Convert to 12-digit format (254 + 7xxxxxxxx)
    const formattedPhone = '254' + phone.substring(1);
    
    // Prepare cart items for payment
    const paymentItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
    }));

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    try {
        payBtn.disabled = true;
        payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        // Determine API URL based on current location
        let apiUrl;
        
        // If running from file:// protocol or localhost, use localhost:10000
        if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            apiUrl = 'http://localhost:10000/merch-checkout';
        } else {
            // For production, use same origin
            apiUrl = `${window.location.origin}/merch-checkout`;
        }

        console.log('Current location:', window.location.href);
        console.log('Sending payment request to:', apiUrl);
        console.log('Payload:', { phone: formattedPhone, items: paymentItems, totalAmount });

        // Send payment request to server
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: formattedPhone,
                items: paymentItems,
                totalAmount: totalAmount
            }),
            mode: 'cors'
        });

        console.log('Response status:', response.status);
        
        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
            throw new Error(data.error || `Server error: ${response.status} - ${response.statusText}`);
        }

        const orderId = data.orderId;
        modal.style.display = 'none';
        phoneInput.value = '';

        // Listen for payment status updates via SSE
        monitorPaymentStatus(orderId, totalAmount);

        payBtn.disabled = false;
        payBtn.innerHTML = '<i class="fas fa-credit-card"></i> Pay Now';

    } catch (error) {
        console.error('Payment error:', error);
        console.error('Error stack:', error.stack);
        alert(`Error processing payment: ${error.message}\n\nMake sure the server is running on http://localhost:10000`);
        payBtn.disabled = false;
        payBtn.innerHTML = '<i class="fas fa-credit-card"></i> Pay Now';
    }
});

// Monitor payment status via SSE
function monitorPaymentStatus(orderId, totalAmount) {
    // Determine API URL based on current location
    let eventUrl;
    
    if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        eventUrl = 'http://localhost:10000/events';
    } else {
        eventUrl = `${window.location.origin}/events`;
    }

    console.log('Connecting to SSE at:', eventUrl);
    
    const eventSource = new EventSource(eventUrl);
    let paymentProcessed = false;
    
    eventSource.addEventListener('message', (e) => {
        if (paymentProcessed) return; // Prevent duplicate processing
        
        try {
            const data = JSON.parse(e.data);
            console.log('SSE Message received:', data);
            
            if (data.checkoutId === orderId) {
                const status = data.status;
                
                if (status === 'success') {
                    paymentProcessed = true;
                    console.log('✓ Payment successful!', data);
                    eventSource.close();
                    
                    // Clear cart ONLY on successful payment
                    cart.length = 0;
                    updateCart();
                    
                    showPaymentSuccessDialog(orderId, totalAmount);
                } else if (status === 'failed') {
                    paymentProcessed = true;
                    console.log('Payment failed:', data);
                    eventSource.close();
                    // Cart is preserved for retry
                    showPaymentFailedDialog(data.resultDesc || 'Insufficient funds or invalid account');
                } else if (status === 'cancelled') {
                    paymentProcessed = true;
                    console.log('Payment cancelled by user:', data);
                    eventSource.close();
                    // Cart is preserved for retry
                    showPaymentCancelledDialog(totalAmount);
                }
            }
        } catch (err) {
            console.error('Error parsing SSE message:', err);
        }
    });

    eventSource.onerror = (e) => {
        console.error('SSE connection error:', e);
        eventSource.close();
    };

    // Auto-close after 5 minutes
    setTimeout(() => {
        console.log('Closing SSE connection after timeout');
        eventSource.close();
    }, 5 * 60 * 1000);
}

// Show success dialog
function showPaymentSuccessDialog(orderId, amount) {
    console.log('Attempting to show success dialog for order:', orderId, 'amount:', amount);
    
    const modal = document.getElementById('paymentSuccessModal');
    const successOrderId = document.getElementById('successOrderId');
    const successAmount = document.getElementById('successAmount');
    
    console.log('Modal element:', modal);
    console.log('Order ID element:', successOrderId);
    console.log('Amount element:', successAmount);
    
    if (successOrderId) successOrderId.textContent = orderId;
    if (successAmount) successAmount.textContent = amount.toLocaleString();
    
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'flex';
        console.log('Success modal displayed');
    } else {
        console.error('paymentSuccessModal not found!');
    }
    
    document.querySelector('body').style.overflow = 'hidden';
}

// Show failure dialog
function showPaymentFailedDialog(reason) {
    console.log('Attempting to show failed dialog with reason:', reason);
    
    const modal = document.getElementById('paymentFailedModal');
    const reasonElement = document.getElementById('failureReason');
    
    if (reasonElement) reasonElement.textContent = reason;
    
    if (modal) {
        modal.style.display = 'flex';
        console.log('Failed modal displayed');
    } else {
        console.error('paymentFailedModal not found!');
    }
    
    document.querySelector('body').style.overflow = 'hidden';
}

// Show insufficient funds dialog
function showInsufficientFundsDialog(amount) {
    console.log('Attempting to show insufficient funds dialog for amount:', amount);
    
    const modal = document.getElementById('insufficientFundsModal');
    const amountElement = document.getElementById('requiredAmount');
    
    if (amountElement) amountElement.textContent = amount.toLocaleString();
    
    if (modal) {
        modal.style.display = 'flex';
        console.log('Insufficient funds modal displayed');
    } else {
        console.error('insufficientFundsModal not found!');
    }
    
    document.querySelector('body').style.overflow = 'hidden';
}

// Show cancelled dialog
function showPaymentCancelledDialog(amount) {
    console.log('Attempting to show cancelled dialog for amount:', amount);
    
    const modal = document.getElementById('paymentCancelledModal');
    const amountElement = document.getElementById('cancelledAmount');
    
    if (amountElement) amountElement.textContent = amount.toLocaleString();
    
    if (modal) {
        modal.style.display = 'flex';
        console.log('Cancelled modal displayed');
    } else {
        console.error('paymentCancelledModal not found!');
    }
    
    document.querySelector('body').style.overflow = 'hidden';
}

// Close payment modal
function closePaymentModal(type) {
    const modals = {
        'success': 'paymentSuccessModal',
        'failed': 'paymentFailedModal',
        'insufficient': 'insufficientFundsModal',
        'cancelled': 'paymentCancelledModal'
    };
    
    const modal = document.getElementById(modals[type]);
    if (modal) {
        modal.style.display = 'none';
        document.querySelector('body').style.overflow = 'auto'; // Restore scrolling
    }
}

// ===== TEST FUNCTIONS (Remove in production) =====
// Add test buttons for dialog testing
window.testPaymentSuccess = function() {
    showPaymentSuccessDialog('ws_CO_20112025170653001', 1200);
};

window.testPaymentFailed = function() {
    showPaymentFailedDialog('Insufficient funds in your M-Pesa account');
};

window.testPaymentCancelled = function() {
    showPaymentCancelledDialog(1200);
};

console.log('Test functions available:');
console.log('window.testPaymentSuccess() - Show success dialog');
console.log('window.testPaymentFailed() - Show failure dialog');
console.log('window.testPaymentCancelled() - Show cancelled dialog');
