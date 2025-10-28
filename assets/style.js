let cartCount = 0;
let currentSlide = 0;
const totalSlides = 5;
let cartItems = {};

// Danh sách sản phẩm - Chỉnh sửa ở đây!
const productPrices = {
  "Vòng alice": 2990000,
  "Vòng teddy pink    ": 1990000,
  "Vòng cosnetella": 5990000,
  "Vòng day evil eye": 6990000,
  "Vòng tay": 2490000,
  "Dây connexus": 1290000,
};

// Hero carousel
function initHeroCarousel() {
  const slider = document.getElementById("heroSlider");
  const dotsContainer = document.getElementById("heroDots");

  // Tạo dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("div");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  }

  // Tự động chuyển slide mỗi 5 giây
  setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
  }, 5000);
}

function goToSlide(index) {
  currentSlide = index;
  updateSlider();
}

function updateSlider() {
  const slider = document.getElementById("heroSlider");
  slider.classList.add("sliding");
  slider.style.transform = `translateX(-${currentSlide * 100}%)`;

  // Cập nhật dots
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });

  // Xóa class sliding sau khi animation kết thúc
  setTimeout(() => {
    slider.classList.remove("sliding");
  }, 800);
}

initHeroCarousel();

function addToCart(productName) {
  // Thêm hoặc tăng số lượng sản phẩm
  if (cartItems[productName]) {
    cartItems[productName]++;
  } else {
    cartItems[productName] = 1;
  }

  cartCount++;
  document.getElementById("cartCount").textContent = cartCount;

  const toast = document.getElementById("toast");
  toast.textContent = '✓ Đã thêm "' + productName + '" vào giỏ hàng!';
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function openCart() {
  document.getElementById("cartModal").classList.add("show");
  displayCart();
}

function closeCart() {
  document.getElementById("cartModal").classList.remove("show");
}

function displayCart() {
  const cartItemsDiv = document.getElementById("cartItems");
  const cartFooterDiv = document.getElementById("cartFooter");

  if (Object.keys(cartItems).length === 0) {
    cartItemsDiv.innerHTML =
      '<div class="cart-empty">Giỏ hàng của bạn trống </div>';
    cartFooterDiv.innerHTML = "";
    return;
  }

  let html = "";
  let totalPrice = 0;

  for (let productName in cartItems) {
    const qty = cartItems[productName];
    const price = productPrices[productName];
    const itemTotal = price * qty;
    totalPrice += itemTotal;

    html += `
                    <div class="cart-item">
                        <div class="item-name">${productName}</div>
                        <div class="item-qty">x${qty}</div>
                        <div style="min-width: 120px; text-align: right; color: #667eea; font-weight: bold;">
                            ${itemTotal.toLocaleString("vi-VN")}₫
                        </div>
                        <button class="remove-item" onclick="removeFromCart('${productName}')">Xóa</button>
                    </div>
                `;
  }

  cartItemsDiv.innerHTML = html;

  cartFooterDiv.innerHTML = `
                <div class="cart-total">
                    <div class="total-price">Tổng: ${totalPrice.toLocaleString(
                      "vi-VN"
                    )}₫</div>
                    <button class="checkout-btn" onclick="checkout()">Thanh toán</button>
                </div>
            `;
}

function removeFromCart(productName) {
  const qty = cartItems[productName];
  cartCount -= qty;
  delete cartItems[productName];
  document.getElementById("cartCount").textContent = cartCount;
  displayCart();
}

function checkout() {
  alert("Cảm ơn bạn! Đơn hàng của bạn đang được xử lý. 😊");
  cartItems = {};
  cartCount = 0;
  document.getElementById("cartCount").textContent = "0";
  closeCart();
}

// Đóng giỏ hàng khi click ngoài
document.addEventListener("click", function (event) {
  const modal = document.getElementById("cartModal");
  const cartContent = document.querySelector(".cart-content");
  const cartIcon = document.querySelector(".cart-icon");

  if (
    modal.classList.contains("show") &&
    !cartContent.contains(event.target) &&
    !cartIcon.contains(event.target)
  ) {
    closeCart();
  }
});

// Tìm kiếm sản phẩm
function searchProducts() {
  const searchTerm = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();
  const productCards = document.querySelectorAll(".product-card");
  const noResults = document.getElementById("noResults");
  let hasResults = false;

  productCards.forEach((card) => {
    const productName = card.getAttribute("data-name");

    if (productName.includes(searchTerm)) {
      card.style.display = "block";
      hasResults = true;
    } else {
      card.style.display = "none";
    }
  });

  // Hiển thị thông báo nếu không có kết quả
  if (searchTerm && !hasResults) {
    noResults.style.display = "block";
    document.getElementById("productGrid").style.display = "none";
  } else {
    noResults.style.display = "none";
    document.getElementById("productGrid").style.display = "grid";
  }
}

// Product Modal
function openProductModal(name, icon, price, desc, gradient, features) {
  document.getElementById("modalTitle").textContent = "Chi tiết sản phẩm";
  document.getElementById("modalProductName").textContent = name;
  document.getElementById("modalProductDesc").textContent = desc;
  document.getElementById("modalPrice").textContent = price;

  const modalImage = document.getElementById("modalImage");
  modalImage.textContent = icon;
  modalImage.style.background = gradient;

  const featuresList = document.getElementById("modalFeatures");
  featuresList.innerHTML = "";
  features.forEach((feature) => {
    const li = document.createElement("li");
    li.textContent = feature;
    featuresList.appendChild(li);
  });

  const addBtn = document.getElementById("modalAddCartBtn");
  addBtn.onclick = function () {
    addToCart(name);
    closeProductModal();
  };

  document.getElementById("productModal").classList.add("show");
}

function closeProductModal() {
  document.getElementById("productModal").classList.remove("show");
}

// Đóng modal khi click ngoài
document.addEventListener("click", function (event) {
  const productModal = document.getElementById("productModal");
  const modalContent = document.querySelector(".product-modal-content");

  if (
    productModal.classList.contains("show") &&
    event.target === productModal
  ) {
    closeProductModal();
  }
});

// Simple toggle
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});
