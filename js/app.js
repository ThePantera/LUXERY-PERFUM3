// Manejo global del estado del carrito
let cart = JSON.parse(localStorage.getItem('luxery_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
});

function addToCart(productId) {
  cart.push(productId);
  localStorage.setItem('luxery_cart', JSON.stringify(cart));
  updateCartBadge();
  alert('Producto agregado al carrito');
}

function updateCartBadge() {
  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.innerText = cart.length;
  }
}
