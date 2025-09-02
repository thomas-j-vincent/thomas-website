import { products } from "./products.js";

const variable = {
  itemsInBasket: 0,
  basketProducts: []
};

// Save state to localStorage
function saveToStorage() {
  localStorage.setItem("basketState", JSON.stringify(variable));
}

// Load state from localStorage
export function loadFromStorage() {
  const stored = localStorage.getItem("basketState");
  if (stored) {
    const parsed = JSON.parse(stored);
    Object.assign(variable, parsed);
  }
}

// Remove all items from basket
export function removeAllItems() {
  // 1. Clear DOM
  const container = document.getElementById("container");
  if (container) {
    container.innerHTML = "";
  }

  // 2. Clear basket state
  variable.basketProducts = [];
  variable.itemsInBasket = 0;
  saveToStorage();

  // 3. Update UI
  updateBasketMessage();
}

window.removeAllItems = removeAllItems;

// Utility: format price
export function formatPrice(amount) {
  return `£ ${amount.toFixed(2)}`;
}

// Update basket message UI
export function updateBasketMessage() {
  if (variable.itemsInBasket === 0) {
    document.getElementById("warning").style.visibility = 'visible';
    document.getElementById("warning").innerHTML = "You have no items in your basket!";
    document.getElementById("checkout").style.display = "none";
  } else {
    document.getElementById("warning").style.visibility = 'hidden';
    document.getElementById("checkout").style.display = "block";
    document.getElementById("checkout").addEventListener("click", () => {
      window.location.href = "checkout.html";
    });
  }
}

// Add product to basket
export function addProduct(item, restoring = false) {
  if (!item.selectedColour) item.selectedColour = item.colour[0];
  if (!item.selectedSize) item.selectedSize = item.size[0];

  const basketItem = { ...item };

  // Find index in basketProducts
  const basketProducts = variable.basketProducts;
  const index = basketProducts.findIndex(obj =>
    obj.item.name === basketItem.name &&
    obj.item.selectedColour === basketItem.selectedColour &&
    obj.item.selectedSize === basketItem.selectedSize
  );

  if (!restoring) {
    // Only check for duplicates when user adds normally
    if (index > -1) {
      const container = document.querySelectorAll('.product-container')[index];
      const qtyCell = container.querySelector('.qty-cell');
      const priceCell = container.querySelector('.itemPrice');

      let quantity = parseInt(qtyCell.textContent, 10) + 1;
      qtyCell.textContent = quantity;
      priceCell.textContent = formatPrice(basketItem.price * quantity);

      variable.itemsInBasket += 1;
      saveToStorage();
      updateBasketMessage();
      return;
    }
  }

  // Create new product container
  let quantity = 1;
  let totalPrice = item.price;

  const newDiv = document.createElement("div");
  newDiv.classList.add("product-container");

  const table = document.createElement("table");
  table.classList.add("basket-table");
  table.border = "0";
  table.cellSpacing = "0";
  table.cellPadding = "5";

  const tbody = document.createElement("tbody");

  // Row 1: Image + Name
  tbody.insertRow().innerHTML = `
      <td colspan="4" rowspan="4" class="itemImg">
          <img src="${item.image}" alt="${item.name}" width="128" height="128">
      </td>
      <td rowspan="7" style="width:50px;">&nbsp;</td>
      <td colspan="6" style="border-bottom: 1px solid #ddd;" class="itemName">${item.name}</td>
  `;

  // Row 2: Empty
  tbody.insertRow().innerHTML = `<td colspan="3">&nbsp;</td>`;

  // Row 3: Price
  tbody.insertRow().innerHTML = `
      <td colspan="6" style="width:150px; border-bottom: 1px solid #ddd;" class="itemPrice">${formatPrice(totalPrice)}</td>
  `;

  // Row 4: Empty
  tbody.insertRow().innerHTML = `<td colspan="3">&nbsp;</td>`;

  // Row 5: Qty / Size / Colour
  tbody.insertRow().innerHTML = `
      <td style="width:25px; border: 1px solid; text-align:center;" class="plus-btn"><i class="fa-solid fa-plus"></i></td>
      <td style="width:50px; text-align:center;" colspan="2" class="qty-cell">${quantity}</td>
      <td style="width:25px; border:1px solid; text-align:center;" class="minus-btn"><i class="fa-solid fa-minus"></i></td>
      <td style="width:75px; border-bottom:1px solid #ddd;" colspan="3" class="itemSize">${item.selectedSize}</td>
      <td style="width:25px; text-align:center;"><i class="fa-solid fa-grip-lines-vertical"></i></td>
      <td style="width:50px; border-bottom:1px solid #ddd;" colspan="2" class="itemColour">${item.selectedColour}</td>
  `;

  table.appendChild(tbody);
  newDiv.appendChild(table);
  document.getElementById("container").appendChild(newDiv);

  // Add to basketProducts
  basketProducts.push({ item: basketItem, quantity: 1 });
  variable.itemsInBasket += 1;
  saveToStorage();
  updateBasketMessage();

  // Plus button
  newDiv.querySelector(".plus-btn").addEventListener("click", () => {
    let qtyCell = newDiv.querySelector(".qty-cell");
    let quantity = parseInt(qtyCell.textContent, 10) + 1;
    qtyCell.textContent = quantity;
    newDiv.querySelector(".itemPrice").textContent = formatPrice(item.price * quantity);

    // Find correct index in basketProducts dynamically
    const idx = basketProducts.findIndex(obj =>
      obj.item.name === item.name &&
      obj.item.selectedColour === item.selectedColour &&
      obj.item.selectedSize === item.selectedSize
    );
    if (idx > -1) {
      basketProducts[idx].quantity += 1;
      variable.itemsInBasket += 1;
      saveToStorage();
      updateBasketMessage();
    }
  });

  // Minus button
  newDiv.querySelector(".minus-btn").addEventListener("click", () => {
    const qtyCell = newDiv.querySelector(".qty-cell");
    let quantity = parseInt(qtyCell.textContent, 10);

    if (quantity > 1) {
      quantity--;
      qtyCell.textContent = quantity;
      newDiv.querySelector(".itemPrice").textContent = formatPrice(item.price * quantity);

      const idx = basketProducts.findIndex(obj =>
        obj.item.name === item.name &&
        obj.item.selectedColour === item.selectedColour &&
        obj.item.selectedSize === item.selectedSize
      );
      if (idx > -1) {
        basketProducts[idx].quantity = quantity;
        variable.itemsInBasket -= 1;
        saveToStorage();
        updateBasketMessage();
      }
    } else {
      newDiv.remove();
      const updated = basketProducts.filter(obj =>
        !(obj.item.name === item.name &&
          obj.item.selectedColour === item.selectedColour &&
          obj.item.selectedSize === item.selectedSize)
      );
      variable.basketProducts = updated;
      variable.itemsInBasket -= 1;
      saveToStorage();
      updateBasketMessage();
    }
  });
}
export function enableTouchHover(selector = ".hoverable", dropdownSelector = ".dropdown") {
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    // Simulate hover for generic elements
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener("click", () => {
        el.classList.toggle("active");
      });
    });

    // Toggle dropdowns on tap
    document.querySelectorAll(dropdownSelector).forEach(dropdown => {
      const icon = dropdown.querySelector('.icon');
      if (icon) {
        icon.addEventListener('click', function(e) {
          e.stopPropagation();
          const content = dropdown.querySelector('.dropdown-content');
          if (content) {
            content.style.display = (content.style.display === 'block') ? 'none' : 'block';
          }
        });
      }
    });

    // Close dropdowns when tapping elsewhere
    document.body.addEventListener('click', function() {
      document.querySelectorAll('.dropdown-content').forEach(content => {
        content.style.display = 'none';
      });
    });
  }
}
loadFromStorage();
