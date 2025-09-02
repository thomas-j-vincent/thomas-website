import { products } from "./products.js";

 const variable = {
 itemsInBasket: 0,
 basketProducts: []
 }

 function saveToStorage() {
 localStorage.setItem("basketState", JSON.stringify(variable));
 }

 export function loadFromStorage() {
 const stored = localStorage.getItem("basketState");
 if (stored) {
  const parsed = JSON.parse(stored);
  Object.assign(variable, parsed);  // SAME LINE copy saved values back into variable END
 } 
}

 export function removeAllItems() {
 // 1. Clear the DOM END
 const container = document.getElementById("container");
 if (container) {
 container.innerHTML = "";   // SAME LINE removes all product rows END
 }

 // 2. Clear storage
 set("basketProducts", []);  // SAME LINE empty product list END
 set("itemsInBasket", 0);    // SAME LINE reset counter END

 updateBasketMessage();      // SAME LINE 3. Update the basket message or UI END
 }

 window.removeAllItems = removeAllItems;

 loadFromStorage();

 export function get(key) {
 return variable[key];
 }

 export function set(key, value) {
 variable[key] = value;
 saveToStorage();
 } 

  /*export function addToBasket(item) {
  basketProducts.push({item: item});
  console.log("Basket now contains:", basketProducts);
  } 
  */ 

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
 document.getElementById("checkout").addEventListener("click", () => {
 window.location.href="checkout.html";
 })
 }
 }

 export function addProduct(item, restoring = false) {
 if (!item.selectedColour) item.selectedColour = item.colour[0];
 if (!item.selectedSize) item.selectedSize = item.size[0];

 const basketItem = {
 ...item,
 // selectedColour: item.selectedColour,
 // selectedSize: item.selectedSize
 };

 // Find index in basketProducts END
 const basketProducts = get("basketProducts") || [];
 const index = basketProducts.findIndex(obj =>
 obj.item.name === basketItem.name &&
 obj.item.selectedColour === basketItem.selectedColour &&
 obj.item.selectedSize === basketItem.selectedSize
 );

 if (!restoring) { 
// Only check for duplicates when user adds normally END
//const index = basketProducts.findIndex(obj => 
// obj.item.name === basketItem.name && 
// obj.item.selectedColour === basketItem.selectedColour && 
// obj.item.selectedSize === basketItem.selectedSize 
// );

 if (index > -1) {
 const container = document.querySelectorAll('.product-container')[index];
 const qtyCell = container.querySelector('.qty-cell'); const priceCell = container.querySelector('.itemPrice');

 let quantity = parseInt(qtyCell.textContent, 10) + 1;
 qtyCell.textContent = quantity;
 priceCell.textContent = formatPrice(basketItem.price * quantity);

 set("itemsInBasket", get("itemsInBasket"));
 updateBasketMessage();
 return;
 }
 }
 // Create new product container END
 let quantity = 1;
 let totalPrice = item.price;
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
 <img src="${item.image}" alt="${item.name}" width="128" height="128">
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

 // Add to basketProducts via shared state
 basketProducts.push({ item: basketItem, quantity: 1 });
 set("basketProducts", basketProducts);

 // Plus button
 newDiv.querySelector(".plus-btn").addEventListener("click", () => {
 let qtyCell = newDiv.querySelector(".qty-cell");
 let quantity = parseInt(qtyCell.textContent, 10) + 1;
 qtyCell.textContent = quantity;
 newDiv.querySelector(".itemPrice").textContent = formatPrice(item.price * quantity);
 basketProducts[index].quantity += 1; set("itemsInBasket", get("itemsInBasket") + 1);
 updateBasketMessage();
 });

 // Minus button
 newDiv.querySelector(".minus-btn").addEventListener("click", () => {
 const qtyCell = newDiv.querySelector(".qty-cell");
 let quantity = parseInt(qtyCell.textContent, 10);

 if (quantity > 1) {
 quantity--;
 qtyCell.textContent = quantity;
 newDiv.querySelector(".itemPrice").textContent = formatPrice(item.price * quantity);

 // Update storage quantity END
 const basket = get("basketProducts") || [];
 const index = basket.findIndex(obj =>
 obj.item.name === item.name &&
 obj.item.selectedColour === item.selectedColour &&
 obj.item.selectedSize === item.selectedSize
 );
 if (index > -1) {
 basket[index].quantity = quantity;
 set("basketProducts", basket);
 }

 basket[index].quantity = quantity;
 set("basketProducts", basket);

 set("itemsInBasket", get("itemsInBasket") - 1);
 updateBasketMessage();
 } else {
 newDiv.remove();
 const basket = get("basketProducts") || [];
 const updated = basket.filter(obj =>
 !(obj.item.name === item.name &&
 obj.item.selectedColour === item.selectedColour &&
 obj.item.selectedSize === item.selectedSize)
 );
 set("basketProducts", updated);

 set("itemsInBasket", get("itemsInBasket") - 1);
 updateBasketMessage();
 }
 });

 // basketProducts.push({ item: basketItem }); // element not needed END
 // set("basketProducts", basketProducts); 
 // Update basket count END
 // set("itemsInBasket", get("itemsInBasket") + 1);
 updateBasketMessage();
}

 export function displayResults(item) {
 const newDiv = document.createElement("div");
 newDiv.classList.add("result-container");
 newDiv.classList.add(item.name.replace(/\s+/g, '-').toLowerCase());
 const productSlug = item.name.replace(/\s+/g, '-').toLowerCase();
 newDiv.addEventListener("click", function() {
 window.location.href = `product.html?
 q=${encodeURIComponent(item.name)}`;
 });

 const table = document.createElement("table");
 table.classList.add("basket-table");
 table.border = "0";
 table.cellSpacing = "0";
 table.cellPadding = "5";

 const colours = item.colour || [];   // make sure it’s an array END 
 const extraColours = Math.max(colours.length - 1, 0); // subtract the default first colour END

 const additionalInfo = item.additionalInfo || "&nbsp;";

 const tbody = document.createElement("tbody");

 // Row 1: Image + Name END
 let row1 = tbody.insertRow();
 row1.innerHTML =`
 <td class="itemImg">
 <img src="${item.image}" alt="${item.name}" width="128"
 height="128">
 </td>
 `;
 // Simple price row for now END
tbody.insertRow().innerHTML =
` <td class="itemName">${item.name}</td>`
 ;
 // Simple price row for now
 tbody.insertRow().innerHTML =
 `<td class="itemPrice">£${item.price}</td>`
 ; 
 // Simple price row for now END 
 tbody.insertRow().innerHTML =
` <td style=" font-size: 10px;" class="itemAdditionalInfo"> ${additionalInfo} </td>`
 ;
 // Simple price row for now END
 tbody.insertRow().innerHTML =
`<td style=" font-size: 10px;" class="availableColours">Available colours: ${extraColours}</td>`
 ;

 table.appendChild(tbody);
 newDiv.appendChild(table);

 document.getElementById("searchResult").appendChild(newDiv);
 }

 export function displayResults2(item) {
 console.log("Displaying item:", item);
 document.getElementById("added").style.visibility = "hidden";
 document.getElementById("unselected").style.visibility = "hidden";
 const imageDiv = document.querySelector(".imageDiv");
 if (imageDiv) {
 imageDiv.innerHTML =` <img src="${item.image}" alt="${item.name}">;`
 }

 const newDiv = document.createElement("div");
 newDiv.classList.add("product-container");

 const table = document.createElement("table");
 table.classList.add("basket-table");
 table.border = "0";
 table.cellSpacing = "0";
 table.cellPadding = "5";

 const tbody = document.createElement("tbody");
 
 // Row 1: Product Name END 
 let row1 = tbody.insertRow();
 row1.innerHTML =
 `<td colspan="9" style="border-bottom: 1px solid #ddd; border: 1px solid black;" class="productName"> ${item.name}
 </td>`
 ;

 // Spacer Row END
 tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

 // Row 2: Colours END
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
 const extraColours = item.colour.length - 1; //SAME LINE subtract the default first colour END
 for (let i = 0; i < extraColours; i++) {
 //i++;
 const colourIndex = i + 1;
 const cellWidth = 100/item.colour.length;
 // console.log("Cell width:", cellWidth);
 let colourCell = row2.insertCell();
 colourCell.textContent = item.colour[colourIndex];
 colourCell.classList.add("productColour");
 colourCell.style.width = cellWidth + "%";
 colourCell.style.border = "1px solid black";

 const thisColour = item.colour[colourIndex];
 colourCell.addEventListener("click", () => {
 item.selectedColour = thisColour;
 console.log("User selected colour:", thisColour);
 console.log(item.selectedColour);
 row2.querySelectorAll(".productColour").forEach(c =>
 c.style.background = "");
 colourCell.style.background = "lightblue";
 });
 i++;
 };
 } else {

 let colourSpace = row2.insertCell();
 colourSpace.textContent = ""
 colourSpace.style.width = "50%";
 
 let colourCell = row2.insertCell();
 colourCell.textContent = item.colour[0];   //SAME LINE safer than item.colour END
 colourCell.classList.add("productColour");
 colourCell.style.width = "120px"; //SAME LINE fixed width END
 colourCell.style.border = "1px solid black";

 colourCell.addEventListener("click", () => {
 item.selectedColour = item.colour[0];
 console.log("User selected colour:", item.colour[0]);
 row2.querySelectorAll(".productColour").forEach(c => c.style.background = "");
 colourCell.style.background = "lightblue";
 });
 };
 // Spacer Row END
 tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

 // Row 3: Sizes END
 let row3 = tbody.insertRow();

 let sizeLabel = row3.insertCell();
 sizeLabel.textContent = "Size:";
 sizeLabel.style.width = "100px";
 sizeLabel.style.border = "1px solid black";

 let ii = 0;
 if (item.size.length > 1) {
 let sizeSpace = row3.insertCell();
 sizeSpace.textContent = ""
 sizeSpace.style.width = (100/item.size.length) + "%";
 console.log(item.size || []);
 const extraSizes = Math.max(item.size.length - 1, 0); //SAME LINE subtract the default first colour END
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
 console.log("User selected size:", thisSize);
 item.selectedSize = thisSize;
 console.log(item.selectedSize);
 row3.querySelectorAll(".productSize").forEach(c => c.style.background = "");
 sizeCell.style.background = "lightblue";
 });
 ii++;
 };
 } else {

 let sizeSpace = row3.insertCell();
 sizeSpace.textContent = "";
  sizeSpace.style.width = "50%";

 let sizeCell = row3.insertCell();
 sizeCell.textContent = item.size[0]; //SAME LINE safer than item.size END
 sizeCell.classList.add("productSize");
 sizeCell.style.width = "120px"; //SAME LINE fixed width END
 sizeCell.style.border = "1px solid black";

 sizeCell.addEventListener("click", () => {
 console.log("User selected size:", item.size[0]);
 item.selectedSize = item.size[0];
 console.log(item.selectedSize);
 row3.querySelectorAll(".productSize").forEach(c => c.style.background = "");
 sizeCell.style.background = "lightblue";
 });
 };
 // Spacer Row END
 tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;
 
 // Row 4: Price END
 tbody.insertRow().innerHTML = `<td style="width:100px; border: 1px solid black;" class="productPrice">Price:</td>
 <td colspan="8" style="border: 1px solid black;" class="productPriceValue">£${item.price}</td>`
 ;
 // Spacer Row END
 tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

 // Row 5: Add to Basket END
 let row5 = tbody.insertRow();
 row5.innerHTML = `<td colspan="9" style="border: 1px solid black;
  text-align:center; cursor:pointer;" class="addToBasket">
 Add to Basket
 </td>`
 ;
 row5.addEventListener("click", () => {

 if (item.selectedColour === undefined || item.selectedSize === undefined) {
 document.getElementById("added").style.visibility = "hidden";
 document.getElementById("unselected").style.visibility = "visible";
 document.getElementById("unselected").innerHTML = "You have not selected the required options";
 console.log("item not added!");
 } else {
 addProduct(item);
 console.log( item.selectedSize, item.selectedColour);
 document.getElementById("unselected").style.visibility = "hidden";
 document.getElementById("added").style.visibility = "visible";
 document.getElementById("added").innerHTML = "item added!";
 }
 });

 // Spacer Row END
 tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

 // Row 6: Checkout
 let row6 = tbody.insertRow()
  row6.innerHTML =
` <td colspan="9" style="border: 1px solid black; text-align:center; cursor:pointer;" id = "checkout">
 Checkout
 </td>`
 ;
 row6.addEventListener("click", () => {
 window.location.href="checkout.html";
 });

 table.appendChild(tbody);
 newDiv.appendChild(table);

 // Attach to productDetails END
 document.querySelector(".productDetails").appendChild(newDiv);
 }

 export function enableTouchHover(selector = ".hoverable", dropdownSelector = ".dropdown") {
 if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
 // Simulate hover for generic elements END
 document.querySelectorAll(selector).forEach(el => {
 el.addEventListener("click", () => {
 el.classList.toggle("active");
 });
 });

 // Toggle dropdowns on tap END
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

 // Close dropdowns when tapping elsewhere END
 document.body.addEventListener('click', function() {
 document.querySelectorAll('.dropdown-content').forEach(content => {
 content.style.display = 'none';
 });
 });
 }
 }