import { products } from "./products.js";
import { get, set, enableTouchHover, loadFromStorage, addProduct, updateBasketMessage, removeAllItems, checkBasket, addToBasket, removeFromBasket, formatImage, nextImage, prevImage} from "./functions.js";
    // Get product name from URL (?item=...)
    const itemName = new URLSearchParams(window.location.search).get("q");
    console.log("URL itemName:", itemName);

updateBasketMessage();
enableTouchHover();
loadFromStorage();

 function displayImages(item) {

console.log(item.selectedColour);

  const table = document.createElement("table");
  table.classList.add("image-table");
  table.border = "1";
  table.cellPadding = "5";
  table.cellSpacing = "0";

  const tbody = document.createElement("tbody"); 
  const colour = item.selectedColour || item.colour[1] ||item.colour[0]  ||"";
  let i= 0;

  while (i < item.imageCount) {
  let row1 = tbody.insertRow();
  row1.innerHTML = `<td><img src="${formatImage(item, colour, i)}" alt="${(item.name)+(colour)}" style="max-width: 700px;"></td>`;
  table.appendChild(tbody);
  console.log("hi");
  i++;
  }
    return table;
 }

 function displayResults2(item) {
 console.log("Displaying item:", item);
 document.getElementById("added").style.visibility = "hidden";
// document.getElementById("unselected").style.visibility = "hidden";
 const imageDiv = document.querySelector(".imageDiv");
 if (imageDiv) {
  imageDiv.innerHTML = ""; // clear old stuff
  imageDiv.appendChild(displayImages(item));
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
 console.log("User selected colour:",item.selectedColour, thisColour);
 console.log(item.selectedColour);
 formatImage(item, item.selectedColour);
 row2.querySelectorAll(".productColour").forEach(c =>
 c.style.background = "");
 colourCell.style.background = "lightblue";
 imageDiv.innerHTML = ""; // clear old stuff
 imageDiv.appendChild(displayImages(item));
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
 imageDiv.innerHTML = ""; // clear old stuff
 imageDiv.appendChild(displayImages(item));
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
 const extraSizes = Math.max(item.size.length - 1, 0); //SAME LINE subtract the default first colour END
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
item.selectedSize = thisSize;
 console.log("User selected size:",item.selectedSize, thisSize);
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
tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9" id="unselected"></td>`;

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
 addToBasket(item);
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

 tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

 let row7 = tbody.insertRow()
 row7.innerHTML = 
 ` <td colspan="9" style="border: 1px solid black; text-align:center; cursor:pointer;" id = "Product description">Product Description
 </td>`
 ;

  tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

 let row8 = tbody.insertRow()
 row8.innerHTML = 
 ` <td colspan="9" style="border: 1px solid black; text-align:left; cursor:pointer;" id = "description">${item.description}
 </td>`
 ;

  tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

  let row9 = tbody.insertRow()
 row9.innerHTML = 
 ` <td colspan="9" style="border: 1px solid black; text-align:center; cursor:pointer;" id = "Delivery Details">Delivery Details
 </td>`
 ;

  tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

 let row10 = tbody.insertRow()
 row10.innerHTML = 
 ` <td colspan="9" style="border: 1px solid black; text-align:left; cursor:pointer;" id = "description">${item.deliveryDetails}
 </td>`
 ;

 table.appendChild(tbody);
 newDiv.appendChild(table);

 // Attach to productDetails END
 document.querySelector(".productDetails").appendChild(newDiv);
 }

window.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("container");
  if (container) {
    container.innerHTML = "";
  }

  const basketProducts = get("basketProducts") || [];
 basketProducts.forEach(({ item }) => {
    // Rebuild DOM from item data
    
   addProduct(item);
  });
  updateBasketMessage();
 });

    // Find product in JSON
    const selectedProduct = products.find(p => p.name === itemName);

    if (!selectedProduct) {
      console.error("No product found with name:", itemName);
      document.querySelector(".productDetails").textContent = "Product not found.";
    //  return;
    }

    console.log("Selected product:", selectedProduct);


    // Finally display
   displayResults2(selectedProduct);

    


  
