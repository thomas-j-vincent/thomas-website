let itemsInBasket = 0;
let basketProducts = [];
let products = {}; // Will hold the JSON data

updateBasketMessage();
console.log(basketProducts);

// Fetch products from JSON
fetch('products.json')
  .then(response => response.json())
  .then(data => {
    products = data;
    initializeProductButtons();
  })
  .catch(error => console.error('Error loading JSON:', error));

// Function to initialise Add/Remove buttons dynamically
function initializeProductButtons() {
  Object.keys(products).forEach(key => {
    const productArray = products[key];
    const product = productArray[0]; // Assuming each key has one product object

    // Add button
    const addBtn = document.getElementById(`add${key}Btn`);
    if (addBtn) {
      addBtn.addEventListener("click", () => addProduct(product));
    }

    // Remove button
    const removeBtn = document.getElementById(`remove${key}Btn`);
    if (removeBtn) {
      removeBtn.addEventListener("click", () => removeProduct(product));
    }
  });
}

// Function to update basket message
function updateBasketMessage() {
  if (itemsInBasket === 0) {
    document.getElementById("warning").style.visibility = 'visible';
    document.getElementById("warning").innerHTML = "You have no items in your basket!";
    document.getElementById("checkout").style.display = "none";
  } else {
    document.getElementById("warning").style.visibility = 'hidden';
    document.getElementById("checkout").style.display = "block";
  }
}

// Function to format price
function formatPrice(amount) {
  return `£ ${amount.toFixed(2)}`;
}

// Function to add a product to the basket
function addProduct(item) {
  const index = basketProducts.findIndex(obj =>
    obj.item.name === item.name &&
    obj.item.colour === item.selectedColour &&
    obj.item.size === item.selectedSize
  );

  if (index > -1) {
    const container = document.querySelectorAll('.product-container')[index];
    const qtyCell = container.querySelector('.qty-cell');
    const priceCell = container.querySelector('.itemPrice');

    let quantity = parseInt(qtyCell.textContent, 10) + 1;
    qtyCell.textContent = quantity;
    priceCell.textContent = formatPrice(item.price * quantity);
    itemsInBasket++;
    updateBasketMessage();
    return;
  }

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
  let row1 = tbody.insertRow();
  row1.innerHTML = `
    <td colspan="4" rowspan="4" class="itemImg">
      <img src="${item.image}" alt="${item.name}" width="128" height="128">
    </td>
    <td rowspan="7" style="width:50px;">&nbsp;</td>
    <td colspan="6" style="border-bottom: 1px solid #ddd;" class="itemName"> ${item.name}</td>
  `;

  tbody.insertRow().innerHTML = `<td colspan="3">&nbsp;</td>`;

  tbody.insertRow().innerHTML = `
    <td colspan="6" style="width:150px; border-bottom: 1px solid #ddd;" class="itemPrice"> ${formatPrice(totalPrice)} </td>
  `;

  tbody.insertRow().innerHTML = `<td colspan="3">&nbsp;</td>`;

  // Row 5: Quantity / Size / Colour controls
  let row5 = tbody.insertRow();
  row5.innerHTML = `
    <td style="width:25px; border: 1px solid; text-align: center;" class="plus-btn"><i class="fa-solid fa-plus"></i></td>
    <td style="width:50px; text-align: center;" colspan="2" class="qty-cell">${quantity}</td>
    <td style="width:25px; border: 1px solid; text-align: center;" class="minus-btn"><i class="fa-solid fa-minus"></i></td>
    <td style="width:75px; border-bottom: 1px solid #ddd;" colspan="3" class="itemSize">${item.selectedSize}</td>
    <td style="width:25px; text-align: center;"><i class="fa-solid fa-grip-lines-vertical"></i></td>
    <td style="width:50px; border-bottom: 1px solid #ddd;" colspan="2" class="itemColour">${item.selectedColour}</td>
  `;

  table.appendChild(tbody);
  newDiv.appendChild(table);
  document.getElementById("container").appendChild(newDiv);

  // Add to basket array
  basketProducts.push({ item: { ...item, colour: item.selectedColour, size: item.selectedSize } });

  // Plus button
  newDiv.querySelector(".plus-btn").addEventListener("click", () => {
    let qtyCell = newDiv.querySelector(".qty-cell");
    let quantity = parseInt(qtyCell.textContent, 10);
    quantity++;
    itemsInBasket++;
    let totalPrice = item.price * quantity;
    qtyCell.textContent = quantity;
    newDiv.querySelector(".itemPrice").textContent = formatPrice(totalPrice);
    updateBasketMessage();
  });

  // Minus button
  newDiv.querySelector(".minus-btn").addEventListener("click", () => {
    let qtyCell = newDiv.querySelector(".qty-cell");
    let quantity = parseInt(qtyCell.textContent, 10);
    if (quantity > 1) {
      quantity--;
      itemsInBasket--;
      let totalPrice = item.price * quantity;
      qtyCell.textContent = quantity;
      newDiv.querySelector(".itemPrice").textContent = formatPrice(totalPrice);
      updateBasketMessage();
    }
  });

  itemsInBasket++;
  updateBasketMessage();
}

// Function to remove a product from the basket
function removeProduct(item) {
  // Remove all from basket array
  basketProducts = basketProducts.filter(obj =>
    !(obj.item.name === item.name &&
      obj.item.colour === item.selectedColour &&
      obj.item.size === item.selectedSize)
  );

  // Remove all matching DOM containers
  const containers = document.querySelectorAll('.product-container');
  containers.forEach(container => {
    const nameCell = container.querySelector('.itemName');
    if (nameCell && nameCell.textContent.trim() === item.name) {
      container.remove();
    }
  });

  // Reset basket count (sum of all qtys left in DOM)
  let totalQty = 0;
  document.querySelectorAll('.qty-cell').forEach(cell => {
    totalQty += parseInt(cell.textContent, 10);
  });
  itemsInBasket = totalQty;

  updateBasketMessage();
  console.log(`Removed all ${item.name} from basket`);
  console.log(basketProducts);
}
