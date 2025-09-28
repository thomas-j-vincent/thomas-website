import { products } from "./products.js";

 const variable = {
 itemsInBasket: 0,
 basketProducts: [],
 basketDisplay: [], 
 viewedProduct: []
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
 const container = document.getElementById("container");    // SAME LINE 1. Clear the DOM END
 if (container) {
   container.innerHTML = "";   // SAME LINE removes all product rows END
 }
 console.log("products removed!")
 set("basketProducts", []);  // SAME LINE empty product list END
 set("basketDisplay", []);
 set("itemsInBasket", 0);    // SAME LINE reset counter END
 set ("viewedProducts", []);
 updateBasketMessage();      // SAME LINE 3. Update the basket message or UI END
 checkBasket();
 }
 window.removeAllItems = removeAllItems;

 loadFromStorage();

export function existingSearchResults(itemName) {
  let array = get("viewedProducts") || [];
  array.unshift(itemName);
  let lastIndex = array.lastIndexOf(itemName);

  if (lastIndex > 0) {
    array.splice(lastIndex, 1);
  }

  const newResults = array.slice(0, 10);
  set("viewedProducts", newResults);
  console.log(get("viewedProducts"));
}


export function universalDisplay(item) {
  const colours = item.colour || []; // make sure it’s an array
  const extraColours = Math.max(colours.length - 1, 0); // subtract the default first colour
  const additionalInfo = item.additionalInfo || "&nbsp;";

  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  // SAME LINE (66) item colour shows non default, or if only one colour displays last END
  let row1 = tbody.insertRow(); 
  row1.innerHTML = `
      <td class="itemImg"> 
          <img src="${formatImage(item,item.colour[1] || item.colour[0], 1)}" 
           alt="${item.name}" width="128" height="128">
      </td>
  `;

  // Simple price row for now
  tbody.insertRow().innerHTML = `
       <td class="itemName">${item.name}</td>
  `;

    // Simple price row for now SAME LINE format price? END
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
  return table;
}

 export function checkBasket() {
  console.log(("basket items are"), get("basketProducts"));
  console.log(("display items:"), get("basketDisplay"));
 }
 window.checkBasket = checkBasket;

 export function get(key) {
 return variable[key];
 }

 export function set(key, value) {
 variable[key] = value;
 saveToStorage();
 } 
  
export function addToBasket(item) {
  let newItems = get("itemsInBasket");
  const newBasket = get("basketProducts");
  const existing = newBasket.findIndex (obj =>
  obj.item.name === item.name &&
  obj.item.selectedColour === item.selectedColour &&
  obj.item.selectedSize === item.selectedSize
  );
  if (existing === -1) {
    const clonedItem = { ...item };  // shallow copy
    newBasket.push({
    item: clonedItem,
    quantity: 1
  });
  newItems++;
  addProduct(item);
  set("itemsInBasket", 1);
  } else {
    newBasket[existing].quantity ++;
    newItems ++; 
    const productContainer = Array.from(document.querySelectorAll(".product-container"))
    .find(div => 
      div.querySelector(".itemName").textContent === item.name &&
      div.querySelector(".itemSize").textContent === item.selectedSize &&
      div.querySelector(".itemColour").textContent === item.selectedColour
    );
    if (productContainer) {
      const qtyCell = productContainer.querySelector(".qty-cell");
      const totalPriceCell = productContainer.querySelector(".itemPrice");
      qtyCell.textContent = newBasket[existing].quantity;
      totalPriceCell.textContent = formatPrice(item.price * newBasket[existing].quantity);
    }
  }
  set("ItemsInBasket", newItems);
  set ("basketProducts", newBasket);
  console.log(get("basketProducts"));
  updateBasketMessage();
  saveToStorage();
  
} 

export function removeFromBasket(item) {
  let newItems = get("itemsInBasket") || 0;
  let newBasket = get("basketProducts") || [];
  const existing = newBasket.findIndex (obj =>
  obj.item.name === item.name &&
  obj.item.selectedColour === item.selectedColour &&
  obj.item.selectedSize === item.selectedSize
  );
  if (existing !== -1) {
    newBasket[existing].quantity --; 
    newItems --;
    if (newBasket[existing].quantity === 0) {
      newBasket = newBasket.filter((_, i) => i !== existing);
    }
  set ("basketProducts", newBasket);
  }  else {
    console.log("item not found");
  }
  set("itemsInBasket", newItems);
}
  
 export function formatPrice(amount) {
 return `£ ${amount.toFixed(2)}`;
 }

export function formatImage(item, selectedColour, value = 1) {
  // fallback: use the item's selectedColour if no param is passed
  const colour = selectedColour || item.selectedColour || "";
  // normalise name and colour (remove spaces, make lowercase, etc.)
  const safeName = String(item.name).replace(/\s+/g, "_");
  const safeColour = String(colour).replace(/\s+/g, "_");
  const safeNumber = String(value).replace(/\s+/g, "_");

 // let path = 0;

  if (colour === undefined) {
    // fallback if no colour is defined
   const path = `./images/${safeName}-oneColour-${safeNumber}.JPEG`;
  }
  const path = `images/${safeName}/${safeColour}-${safeNumber}.JPEG`;

  console.log("trying image:", path);
  return (path);
}

let currentImageIndex = 1;
export function showImage(item, selectedColour, index) {
  const img = document.querySelector("imageDiv");
  if (!img) return;
  img.src = formatImage(item, colour, index);
}

export function nextImage (item) {
  const maxImages = item.imageCount || 1;
  currentImageIndex++;
if (currentImageIndex > maxImages) {
  currentImageIndex = 1;
}
  showImage(item, item,selectedColour, currentImageIndex);
} 

export function prevImage(item) {
  const maxImages = item.imageCount || 1;
  if (currentImageIndex > 1){
    currentImageIndex--;
  }
    if (currentImageIndex < 1) {
    currentImageIndex = maxImages; // wrap to last
  }
  showImage(item, item,selectedColour, currentImageIndex);
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

export function addProduct(item) {  //SAME LINE displays the items in the basket to the basket dropdown END
 // Create new product container END
  const basketProducts = get("basketProducts") || [];
  const basketItem = basketProducts.find(obj =>
  obj.item.name === item.name &&
  obj.item.selectedColour === item.selectedColour &&
  obj.item.selectedSize === item.selectedSize
);

// Use its saved quantity (or default to 1 if new)
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

 // Plus button
 newDiv.querySelector(".plus-btn").addEventListener("click", () => {
 let qtyCell = newDiv.querySelector(".qty-cell");
 let quantity = parseInt(qtyCell.textContent, 10) + 1;
 qtyCell.textContent = quantity;
    const basket = get("basketProducts") || [];
    const existingIndex = basket.findIndex(obj =>
        obj.item.name === item.name &&
        obj.item.selectedSize === item.selectedSize &&
        obj.item.selectedColour === item.selectedColour
    );

    if (existingIndex !== -1) {
        basket[existingIndex].quantity = quantity;
        set("basketProducts", basket);

        // Update total items in basket
        const totalItems = basket.reduce((sum, obj) => sum + obj.quantity, 0);
        set("itemsInBasket", totalItems);
    }

 newDiv.querySelector(".itemPrice").textContent = formatPrice(item.price * quantity);
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
   removeFromBasket(item)
   updateBasketMessage();
 } else {
   newDiv.remove();
   removeFromBasket(item)
   updateBasketMessage();
 }
 });

 updateBasketMessage();
 saveToStorage();
 const newDisplay = get("basketProducts");
 set("basketDisplay", newDisplay);
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