import { products } from "./products.js";
import {get, set, updateBasketMessage, addProduct, enableTouchHover, loadFromStorage} from "./functions.js";

updateBasketMessage();
enableTouchHover();
loadFromStorage();

window.addEventListener("DOMContentLoaded", () => {
  const basketProducts = get("basketProducts") || [];
  basketProducts.forEach(({ item }) => {
    // Rebuild DOM from item data
   addProduct(item);
  });
 // updateBasketMessage();
});

const myDiv = document.getElementsByClassName('search-box')[0];
const searchInput = document.querySelector('.search-box input');

// listen for typing
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase(); // get typed text
  console.log("User typed:", query);

  // filter products (assuming products[] is already loaded with JSON)
   const results = products.filter(product => 
    product.name.toLowerCase().includes(query) ||
    product.productType.some(c =>c.toLowerCase().includes(query)) ||
    product.colour.some(c => c.toLowerCase().includes(query))
  );  
  // optional: display results live
  const resultsContainer = document.getElementById("results");
  if (resultsContainer) {
    resultsContainer.innerHTML = "";
    results.forEach(product => {
      const div = document.createElement("div");
      div.textContent = `${product.name} - £${product.price}`;
      resultsContainer.appendChild(div);
    });
  }
});

// Pressing Enter
searchInput.addEventListener('keydown', (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const query = searchInput.value.trim();

    if (query !== "") {
      console.log("Redirecting with query:", query);
      
      //  only update if element exists
      const display = document.getElementById("searchInputDisplay");
      if (display) {
        display.innerHTML = query;
      }

      // redirect
      window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
  }
});



  let item1 = products[0];

  let item2 = products[1];

document.getElementById("addItem1Btn").addEventListener("click", function() {
addProduct(item1);
});
document.getElementById("addItem2Btn").addEventListener("click", function() {
addProduct(item2);
});
document.getElementById("removeItem1Btn").addEventListener("click", function() {
removeProduct(item1);
});
document.getElementById("removeItem2Btn").addEventListener("click", function() {
removeProduct(item2);

let quantity = basketItem ? basketItem.quantity : 1;
let totalPrice = item.price * quantity;
 const newDiv = document.createElement("div");
 newDiv.classList.add("product-container");
 const table = document.createElement("table");
 table.classList.add("basket-table");
 table.border = "0"; table.cellSpacing = "0";
 table.cellPadding = "5";

 const tbody = document.createElement("tbody");

 // Row 1: Image + Name
 tbody.insertRow().innerHTML =`
 <td colspan="4" rowspan="4" class="itemImg">
 <img src="${formatImage(item, item.selectedColour, 1)}" alt="${item.name}" width="128" height="128">
 </td>
 <td rowspan="7" style="width:50px;">&nbsp;</td>
 <td colspan="6" style="border-bottom: 1px solid #ddd;" class="itemName">${item.name}</td>`
 ;

 // Row 2: Empty
 tbody.insertRow().innerHTML = `<td colspan="3">&nbsp;</td>`;

 // Row 3: Price
 tbody.insertRow().innerHTML =
 `<td colspan="6" style="width:150px; border-bottom: 1px solid #ddd;" class="itemPrice">${formatPrice(totalPrice)}</td>`
 ;

 // Row 4: Empty
 tbody.insertRow().innerHTML = `<td colspan="3">&nbsp;</td>`;

 // Row 5: Qty / Size / Colour
 tbody.insertRow().innerHTML =`
 <td style="width:25px; border: 1px solid; text-align:center;" class="plus-btn"><i class="fa-solid fa-plus"></i></td>
 <td style="width:50px; text-align:center;" colspan="2" class="qty-cell">${quantity}</td>
 <td style="width:25px; border:1px solid; text-align:center;" class="minus-btn"><i class="fa-solid fa-minus"></i></td>
 <td style="width:75px; border-bottom:1px solid #ddd;" colspan="3" class="itemSize">${item.selectedSize}</td>
 <td style="width:25px; text-align:center;"><i class="fa-solid fa-grip-lines-vertical"></i></td>
 <td style="width:50px; border-bottom:1px solid #ddd;" colspan="2" class="itemColour">${item.selectedColour}</td>`
 ;

 table.appendChild(tbody);
 newDiv.appendChild(table);
 document.getElementById("container").appendChild(newDiv);
});
