import { products } from "./products.js";

const variable = {
itemsInBasket: 0,
basketProducts: []
}

export function get(key) {
return variable[key];
}

export function set(key, value) {
  variable[key] = value;
}

export function addToBasket(item) {
    basketProducts.push({item: item});
    console.log("Basket now contains:", basketProducts);
}

export function formatPrice(amount) {
    return `£ ${amount.toFixed(2)}`;
}

export function updateBasketMessage() {
    if (get("itemsInBasket") === 0) {
        document.getElementById("warning").style.visibility = 'visible';
        document.getElementById("warning").innerHTML = "You have no items in your basket!";
        document.getElementById("checkout").style.display = "none";
    } else {
        document.getElementById("warning").style.visibility = 'hidden';
        //document.getElementById("warning").innerHTML = "You have " + itemsInBasket+" item"+(itemsInBasket>1?"s":"")+" in your basket.";
        document.getElementById("checkout").style.display = "block";
    }
}

export function removeProduct(item) {
let basket = get("basketProducts") || [];
basket = basket.filter(obj => 
    !(obj.item.name === item.name &&
      obj.item.selectedColour === item.selectedColour &&
      obj.item.selectedSize === item.selectedSize)
);
set("basketProducts", basket);

    // Remove DOM containers as before
    const containers = document.querySelectorAll('.product-container');
    containers.forEach(container => {
        const nameCell = container.querySelector('.itemName');
        if (nameCell && nameCell.textContent.trim() === item.name) {
            container.remove();
        }
    });

    // Update basket count
    let totalQty = 0;
    document.querySelectorAll('.qty-cell').forEach(cell => {
        totalQty += parseInt(cell.textContent, 10);
    });
    set("itemsInBasket", totalQty);

    updateBasketMessage();
    console.log(`Removed all ${item.name} from basket`);
}
export function addProduct(item) {
    // Default selections
    if (!item.selectedColour) item.selectedColour = item.colour[0];
    if (!item.selectedSize) item.selectedSize = item.size[0];

    // Find index in basketProducts
    const basketProducts = get("basketProducts") || [];
    const index = basketProducts.findIndex(obj =>
        obj.item.name === item.name &&
        obj.item.selectedColour === item.selectedColour &&
        obj.item.selectedSize === item.selectedSize
    );

    if (index > -1) {
        const container = document.querySelectorAll('.product-container')[index];
        const qtyCell = container.querySelector('.qty-cell');
        const priceCell = container.querySelector('.itemPrice');

        let quantity = parseInt(qtyCell.textContent, 10) + 1;
        qtyCell.textContent = quantity;
        priceCell.textContent = formatPrice(item.price * quantity);

        set("itemsInBasket", get("itemsInBasket") + 1);
        updateBasketMessage();
        return;
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

    // Add to basketProducts via shared state
    basketProducts.push({ item: item, element: newDiv });

    // Plus button
    newDiv.querySelector(".plus-btn").addEventListener("click", () => {
        let qtyCell = newDiv.querySelector(".qty-cell");
        let quantity = parseInt(qtyCell.textContent, 10) + 1;
        qtyCell.textContent = quantity;
        newDiv.querySelector(".itemPrice").textContent = formatPrice(item.price * quantity);

        set("itemsInBasket", get("itemsInBasket") + 1);
        updateBasketMessage();
    });

    // Minus button
    newDiv.querySelector(".minus-btn").addEventListener("click", () => {
        let qtyCell = newDiv.querySelector(".qty-cell");
        let quantity = parseInt(qtyCell.textContent, 10);
        if (quantity > 1) {
            quantity--;
            qtyCell.textContent = quantity;
            newDiv.querySelector(".itemPrice").textContent = formatPrice(item.price * quantity);

            set("itemsInBasket", get("itemsInBasket") - 1);
            updateBasketMessage();
        }
    });

    // Update basket count
    set("itemsInBasket", get("itemsInBasket") + 1);
    updateBasketMessage();
}

export function displayResults(item) {
  const newDiv = document.createElement("div");
  newDiv.classList.add("result-container");
  newDiv.classList.add(item.name.replace(/\s+/g, '-').toLowerCase());
  const productSlug = item.name.replace(/\s+/g, '-').toLowerCase();
 newDiv.addEventListener("click", function() {
      window.location.href = `product.html?q=${encodeURIComponent(item.name)}`;
 });

  const table = document.createElement("table");
  table.classList.add("basket-table");
  table.border = "0";
  table.cellSpacing = "0";
  table.cellPadding = "5";

const colours = item.colour || []; // make sure it’s an array
const extraColours = Math.max(colours.length - 1, 0); // subtract the default first colour

const additionalInfo = item.additionalInfo || "&nbsp;";

  const tbody = document.createElement("tbody");

  // Row 1: Image + Name
  let row1 = tbody.insertRow();
  row1.innerHTML = `
      <td class="itemImg">
          <img src="${item.image}" alt="${item.name}" width="128" height="128">
      </td>
  `;
  // Simple price row for now
  tbody.insertRow().innerHTML = `
       <td class="itemName">${item.name}</td>
  `;
    // Simple price row for now
  tbody.insertRow().innerHTML = `
       <td class="itemPrice">£${item.price}</td>
  `;
      // Simple price row for now
  tbody.insertRow().innerHTML = `
       <td  style=" font-size: 10px;" class="itemAdditionalInfo">
       ${additionalInfo}
       </td>
  `;
      // Simple price row for now
  tbody.insertRow().innerHTML = `
       <td  style=" font-size: 10px;" class="availableColours">Available colours: ${extraColours}</td>
  `;


  table.appendChild(tbody);
  newDiv.appendChild(table);

  document.getElementById("searchResult").appendChild(newDiv);
}

export     function displayResults2(item) {
      console.log("Displaying item:", item);

      const newDiv = document.createElement("div");
      newDiv.classList.add("product-container");

      const table = document.createElement("table");
      table.classList.add("basket-table");
      table.border = "0";
      table.cellSpacing = "0";
      table.cellPadding = "5";

      const tbody = document.createElement("tbody");

      // Row 1: Product Name
      let row1 = tbody.insertRow();
      row1.innerHTML = `
        <td colspan="9" style="border-bottom: 1px solid #ddd; border: 1px solid black;" class="productName">
          ${item.name}
        </td>
      `;

      // Spacer Row
      tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

      // Row 2: Colours
let row2 = tbody.insertRow();

let colourLabel = row2.insertCell();
colourLabel.textContent = "Colour:";
colourLabel.style.width = "100px";
colourLabel.style.border = "1px solid black";

      let i = 0;
    if (item.colour.length > 1) {
      let colourSpace = row2.insertCell();
      colourSpace.textContent = ""
      colourSpace.style.width = (100/item.colour.length)+ "%";

      const extraColours = item.colour.length - 1; // subtract the default first colour
      for (let i = 0; 1 < extraColours; i++) {
        //i++;
        const colourIndex = i + 1;
        const cellWidth = 100/item.colour.length;
//        console.log("Cell width:", cellWidth);
        let colourCell = row2.insertCell();
        colourCell.textContent = item.colour[colourIndex];
        colourCell.classList.add("productColour");
        colourCell.style.width = cellWidth + "%";
        colourCell.style.border = "1px solid black";

        const thisColour = item.colour[colourIndex];
        colourCell.addEventListener("click", () => {
          console.log("User selected colour:", thisColour);
          row2.querySelectorAll(".productColour").forEach(c => c.style.background = "");
          colourCell.style.background = "lightblue";
        });
        i++;
      };
    }
    else {  

      let colourSpace = row2.insertCell();
      colourSpace.textContent = ""
      colourSpace.style.width = "50%";

      let colourCell = row2.insertCell();
      colourCell.textContent = item.colour[0]; // safer than item.colour
      colourCell.classList.add("productColour");
      colourCell.style.width = "120px"; // fixed width
      colourCell.style.border = "1px solid black";

      colourCell.addEventListener("click", () => {
        console.log("User selected colour:", item.colour[0]);
        row2.querySelectorAll(".productColour").forEach(c => c.style.background = "");
        colourCell.style.background = "lightblue";
       });
      };
      // Spacer Row
      tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

      // Row 3: Sizes
let row3 = tbody.insertRow();

let sizeLabel = row3.insertCell();
sizeLabel.textContent = "Colour:";
sizeLabel.style.width = "100px";
sizeLabel.style.border = "1px solid black";

      let ii = 0;
    if (item.size.length > 1) {
      let sizeSpace = row3.insertCell();
      sizeSpace.textContent = ""
      sizeSpace.style.width = (100/item.size.length) + "%";
      console.log(item.size || []);
      const extraSizes = Math.max(item.size.length - 1, 0); // subtract the default first colour
      console.log(extraSizes);
      while (ii < extraSizes) {
        //ii++;
        const sizeIndex = ii + 1;
        const cellWidth = Math.max(100/item.size.length);
        console.log("Cell width:", cellWidth);
        let sizeCell = row3.insertCell();
        sizeCell.textContent = item.size[sizeIndex];
        sizeCell.classList.add("productSize");
        sizeCell.style.width = cellWidth + "%";
        sizeCell.style.border = "1px solid black";

        const thisSize = item.size[sizeIndex];
        sizeCell.addEventListener("click", () => {
          console.log("User selected colour:", thisSize);
          row3.querySelectorAll(".productSize").forEach(c => c.style.background = "");
          sizeCell.style.background = "lightblue";
        });
        ii++;
      };
    }
    else {  

      let sizeSpace = row3.insertCell();
      sizeSpace.textContent = ""
      sizeSpace.style.width = "50%";

      let sizeCell = row3.insertCell();
      sizeCell.textContent = item.size[0]; // safer than item.size
      sizeCell.classList.add("productSize");
      sizeCell.style.width = "120px"; // fixed width
      sizeCell.style.border = "1px solid black";

      sizeCell.addEventListener("click", () => {
        console.log("User selected colour:", item.size[0]);
        row3.querySelectorAll(".productSize").forEach(c => c.style.background = "");
        sizeCell.style.background = "lightblue";
       });
      };
      // Spacer Row
      tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

      // Row 4: Price
      tbody.insertRow().innerHTML = `
        <td style="width:100px; border: 1px solid black;" class="productPrice">Price:</td>
        <td colspan="8" style="border: 1px solid black;" class="productPriceValue">£${item.price}</td>
      `;

      // Spacer Row
      tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

      // Row 5: Add to Basket
      let row5 = tbody.insertRow();
      row5.innerHTML = `
        <td colspan="9" style="border: 1px solid black; text-align:center; cursor:pointer;" class="addToBasket">
          Add to Basket
        </td>
      `;
      row5.addEventListener("click", () => {
        console.log("Added to basket:", item.name);
      });

      // Spacer Row
      tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

      // Row 6: Checkout
      tbody.insertRow().innerHTML = `
        <td colspan="9" style="border: 1px solid black; text-align:center; cursor:pointer;">
          Checkout
        </td>
      `;

      table.appendChild(tbody);
      newDiv.appendChild(table);

      // Attach to productDetails
      document.querySelector(".productDetails").appendChild(newDiv);
    }

export function enableTouchHover(selector = ".hoverable") {
  // Only run on touch-capable devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener("click", () => {
        el.classList.toggle("active");
      });
    });
  }
}