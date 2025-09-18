import { products } from "./products.js";
import { get, set, enableTouchHover, loadFromStorage, addProduct, universalDisplay, updateBasketMessage, existingSearchResults, addToBasket, formatImage} from "./functions.js";
    const itemName = new URLSearchParams(window.location.search).get("q");
    console.log("URL itemName:", itemName);

updateBasketMessage();
enableTouchHover();
loadFromStorage();
existingSearchResults(itemName);

  function displayImages(item) {

  console.log(item.selectedColour);

  let newDiv = document.createElement("div");
  newDiv.className = "image-table";
  newDiv.border = "1";
  newDiv.cellPadding = "5";
  newDiv.cellSpacing = "0";

  const colour = item.selectedColour || item.colour[1] ||item.colour[0]  ||"";
  let i= 0;

  while (i < item.imageCount) {
    if (i === 1) {
      let rowDiv = document.createElement("div");
      rowDiv.className = "image-row";
//      rowDiv.id = "myImg";
      let img1 = document.createElement("img");
      img1.src = `${formatImage(item, colour, i)}`;
      img1.alt = `${item.name}${colour}`;
      img1.className = "unstacked-image";
      img1.id = "myImg";
      rowDiv.appendChild(img1);

      if (i + 1 < item.imageCount) {
        let img2 = document.createElement("img");
        img2.src = `${formatImage(item, colour, i + 1)}`;
        img2.alt = `${item.name}${colour}`;
        img2.className = "unstacked-image";
        rowDiv.appendChild(img2);
        i++;
      }

      newDiv.appendChild(rowDiv);
    } else {
      let img = document.createElement("img");
      img.src = `${formatImage(item, colour, i)}`;
      img.alt = `${item.name}${colour}`;
      img.className = "stacked-image";
      img.id = "myImg";
      newDiv.appendChild(img);
    }
    i++;
  }
  return newDiv;
}

function displayResults2(item) {
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
  `<td colspan="9" style="border-bottom: 1px solid #ddd; border: 1px solid black;" class="productName">
  ${item.name}</td>`;

 // Spacer Row END
  tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">
  &nbsp;</td>`;

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
  tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">
  &nbsp;</td>`;

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
  tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">
  &nbsp;</td>`;
 
 // Row 4: Price END
  tbody.insertRow().innerHTML = `<td style="width:100px; border: 1px solid black;" class="productPrice">
  Price:</td>
  <td colspan="8" style="border: 1px solid black;" class="productPriceValue">
  £${item.price}</td>`;
 // Spacer Row END
  tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9" id="unselected"></td>`;

 // Row 5: Add to Basket END
  let row5 = tbody.insertRow();
  row5.innerHTML = `<td colspan="9" style="border: 1px solid black; text-align:center; cursor:pointer;" class="addToBasket">
  Add to Basket</td>`;
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
  `<td colspan="9" style="border: 1px solid black; text-align:center; cursor:pointer;" id = "checkout">
  Checkout</td>`;
  row6.addEventListener("click", () => {
    window.location.href="checkout.html";
  });

  tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">
  &nbsp;</td>`;

  let row7 = tbody.insertRow()
  row7.innerHTML = 
  `<td colspan="9" style="border: 1px solid black; text-align:center; cursor:pointer;" id = "Product description">
  Product Description</td>`;

  tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

  let row8 = tbody.insertRow()
  row8.innerHTML = 
  `<td colspan="9" style="border: 1px solid black; text-align:left; cursor:pointer;" id = "description">
  ${item.description}</td>`;

  tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">
  &nbsp;</td>`;

  let row9 = tbody.insertRow()
  row9.innerHTML = 
  `<td colspan="9" style="border: 1px solid black; text-align:center; cursor:pointer;" id = "Delivery Details">
  Delivery Details</td>`;

  tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

  let row10 = tbody.insertRow()
  row10.innerHTML = 
  `<td colspan="9" style="border: 1px solid black; text-align:left; cursor:pointer;" id = "description">
  ${item.deliveryDetails}</td>`;

  tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

    let row11 = tbody.insertRow()
  row11.innerHTML = 
  `<td colspan="9" style="border: 1px solid black; text-align:center; cursor:pointer;" id = "Complete the look">
  Complete the look</td>`;

  tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

  let row12 = tbody.insertRow();
  let cell = row12.insertCell();
  cell.colSpan = 9;
  cell.style.border = "1px solid black";

  const lookTable = completeLook(item);

  cell.appendChild(lookTable);
  table.appendChild(tbody);
  newDiv.appendChild(table);

 // Attach to productDetails END
  document.querySelector(".productDetails").appendChild(newDiv);
}

function completeLook(item) {
  const query = item.productType[1];   // e.g. "clothing"
  const compare = item.productType[0]; // e.g. "shirt"
  let results;
  if (query === "non-clothing"){
    results = products.filter(product => 
      product.productType.includes(query));
    results.splice (0,1);
  } else {
    results = products.filter(product => 
    product.productType.includes(query) &&
    !product.productType.includes(compare))
    if (results === 0) {
      results = products.filter(product => 
      product.productType.includes(query));
    }
  }
  results.splice (3);
  let i = 0;
  const containerDiv = document.createElement("div");

//  let resultsLength = results.length;
  for (let i = 0; i < results.length; i++){
  const item = results[i]; 
const newDiv = document.createElement("div");
 newDiv.classList.add("completeLook");
  newDiv.style.border = "1px solid black";
   newDiv.addEventListener("click", function() {
     window.location.href = `product.html?
     q=${encodeURIComponent(item.name)}`;
     });
      const table = universalDisplay(item);
       //table.border = "0";
       //  // table.classList.add("basket-table");
         table.cellSpacing = "1";
          table.cellPadding = "5";
           newDiv.appendChild(table);
            containerDiv.appendChild(newDiv);
//  const element = wrappedUniversalDisplay(item);
//  containerDiv.appendChild(element);

    if (i < results.length - 1) {
    const spacer = document.createElement("div");
    spacer.innerHTML = `<table><tbody>
       <tr><td style="height: 50px;" colspan="9">&nbsp;</td></tr>
     </tbody></table>`;
    containerDiv.appendChild(spacer);
  }
}

 return containerDiv;
};

// this is to make the images zoom-in-able on phone or mouse
/*function zoomable() {
  let scale = 1;
let posX = 0, posY = 0;
let isDragging = false;
let startX, startY;

// Reset zoom when modal opens
function showImage(index) {
  currentIndex = index;
  modal.style.display = "block";
  modalImg.src = images[index].src;
  captionText.innerHTML = images[index].alt;
  scale = 1;
  posX = 0;
  posY = 0;
  modalImg.style.transform = `translate(0px, 0px) scale(1)`;
}

// Zoom with mouse scroll
modalImg.addEventListener("wheel", function(e) {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.1 : 0.1;
  scale = Math.min(Math.max(0.5, scale + delta), 5); // clamp between 0.5x and 5x
  modalImg.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
});

// Drag image with mouse
modalImg.addEventListener("mousedown", function(e) {
  isDragging = true;
  startX = e.clientX - posX;
  startY = e.clientY - posY;
  modalImg.style.cursor = "grabbing";
}); 

window.addEventListener("mouseup", function() {
  isDragging = false;
  modalImg.style.cursor = "grab";
});

window.addEventListener("mousemove", function(e) {
  if (!isDragging) return;
  posX = e.clientX - startX;
  posY = e.clientY - startY;
  modalImg.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
});

// Touch pinch-to-zoom
let initialDistance = 0;
modalImg.addEventListener("touchstart", function(e) {
  if (e.touches.length === 2) {
    initialDistance = Math.hypot(
      e.touches[0].pageX - e.touches[1].pageX,
      e.touches[0].pageY - e.touches[1].pageY
    );
  }
}, { passive: false });

modalImg.addEventListener("touchmove", function(e) {
  if (e.touches.length === 2) {
    e.preventDefault();
    const newDistance = Math.hypot(
      e.touches[0].pageX - e.touches[1].pageX,
      e.touches[0].pageY - e.touches[1].pageY
    );
    const delta = (newDistance - initialDistance) / 200; // sensitivity
    scale = Math.min(Math.max(0.5, scale + delta), 5);
    modalImg.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
    initialDistance = newDistance;
  }
}, { passive: false });
}
*/

function mayAlsoLike(item) {
  const compare = item.productType[0];
  let results = products.filter(product => product.productType.includes(compare));
  results.splice(0, 1); // remove current product

  const itemWidth = 200; // px per card
  const gap = 20;        // px between cards
  const screenWidth = window.innerWidth;

  // how many fit fully on screen
  const itemsPerRow = Math.floor(screenWidth / (itemWidth + gap));
  const visibleWidth = itemsPerRow * (itemWidth + gap);

  // Table for header + carousel row
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  // Header
  const headerRow = tbody.insertRow();
  const headerCell = headerRow.insertCell();
  headerCell.textContent = "May Also Like";
  headerCell.colSpan = 3;
  headerCell.style.fontWeight = "bold";
  headerCell.style.padding = "10px";

  // Carousel row
  const row = tbody.insertRow();

  // Left arrow
  const leftCell = row.insertCell();
  const leftBtn = document.createElement("button");
  leftBtn.textContent = "‹";
  leftBtn.style.cursor = "pointer";
  leftBtn.style.padding = "41px";
  leftBtn.disabled = true;
  leftCell.appendChild(leftBtn);

  // Flex wrapper
  const flexCell = row.insertCell();
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.gap = gap + "px";
  wrapper.style.border = "5px";
  wrapper.style.overflowX = "auto";
  wrapper.style.scrollBehavior = "smooth";
  wrapper.style.padding = "10px, 200px, 10px, 10px";
  wrapper.style.width = visibleWidth + "px"; // fill screen width exactly
  wrapper.classList.add("no-scrollbar");
  flexCell.appendChild(wrapper);

  // Right arrow
  const rightCell = row.insertCell();
  const rightBtn = document.createElement("button");
  rightBtn.textContent = "›";
  rightBtn.style.cursor = "pointer";
  rightCell.appendChild(rightBtn);

  // Render ALL results
  results.forEach(result => {
    const newDiv = document.createElement("div");
    newDiv.classList.add("completeLook");
    newDiv.style.border = "1px solid black";
    newDiv.style.width = itemWidth + "px";
    newDiv.style.flexShrink = "0";

    newDiv.addEventListener("click", () => {
      window.location.href = `product.html?q=${encodeURIComponent(result.name)}`;
    });

    const productTable = universalDisplay(result);
    productTable.style.width = "100%";
    newDiv.appendChild(productTable);

    wrapper.appendChild(newDiv);
  });

  table.appendChild(tbody);
  document.getElementById("mayLike").appendChild(table);

  // Arrow scroll logic
  const scrollAmount = itemWidth + gap;
  leftBtn.addEventListener("click", () => {
    wrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });
  rightBtn.addEventListener("click", () => {
    wrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  function updateArrows() {
    const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
    leftBtn.disabled = wrapper.scrollLeft <= 0;
    rightBtn.disabled = wrapper.scrollLeft >= maxScrollLeft - 1;
  }

  wrapper.addEventListener("scroll", updateArrows);
  updateArrows();

  // Adjust on resize
  window.addEventListener("resize", () => {
    const newItemsPerRow = Math.floor(window.innerWidth / (itemWidth + gap));
    wrapper.style.width = (newItemsPerRow * (itemWidth + gap)) + "px";
    updateArrows();
  });
}

function previousSearches() {
  let results = get("viewedProducts");
  console.log(get("viewedProducts"));
  results = results.filter(name => name !== selectedProduct.name);
  console.log(results);

  const itemWidth = 200; // px per card
  const gap = 20;        // px between cards
  const screenWidth = window.innerWidth;

  // how many fit fully on screen
  const itemsPerRow = Math.floor(screenWidth / (itemWidth + gap));
  const visibleWidth = itemsPerRow * (itemWidth + gap);

  // Table for header + carousel row
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  // Header
  const headerRow = tbody.insertRow();
  const headerCell = headerRow.insertCell();
  headerCell.textContent = "Previously viewed: ";
  headerCell.colSpan = 3;
  headerCell.style.fontWeight = "bold";
  headerCell.style.padding = "10px";

  // Carousel row
  const row = tbody.insertRow();

  // Left arrow
  const leftCell = row.insertCell();
  const leftBtn = document.createElement("button");
  leftBtn.textContent = "‹";
  leftBtn.style.cursor = "pointer";
  leftBtn.style.padding = "41px";
  leftBtn.disabled = true;
  leftCell.appendChild(leftBtn);

  // Flex wrapper
  const flexCell = row.insertCell();
  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.gap = gap + "px";
  wrapper.style.border = "5px";
  wrapper.style.overflowX = "auto";
  wrapper.style.scrollBehavior = "smooth";
  wrapper.style.padding = "10px, 200px, 10px, 10px";
  wrapper.style.width = visibleWidth + "px"; // fill screen width exactly
  wrapper.classList.add("no-scrollbar");
  flexCell.appendChild(wrapper);

  // Right arrow
  const rightCell = row.insertCell();
  const rightBtn = document.createElement("button");
  rightBtn.textContent = "›";
  rightBtn.style.cursor = "pointer";
  rightCell.appendChild(rightBtn);

  // Render ALL results
  results.forEach(resultName => {

    const product = products.find(p => p.name === resultName);
    if (!product) return; // skip if not found

    const newDiv = document.createElement("div");
    newDiv.classList.add("completeLook");
    newDiv.style.border = "1px solid black";
    newDiv.style.width = itemWidth + "px";
    newDiv.style.flexShrink = "0";

    newDiv.addEventListener("click", () => {
      window.location.href = `product.html?q=${encodeURIComponent(product.name)}`;
    });

    const productTable = universalDisplay(product);
    productTable.style.width = "100%";
    newDiv.appendChild(productTable);

    wrapper.appendChild(newDiv);
  });

  table.appendChild(tbody);
  document.getElementById("previousSearches").appendChild(table);

  // Arrow scroll logic
  const scrollAmount = itemWidth + gap;
  leftBtn.addEventListener("click", () => {
    wrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });
  rightBtn.addEventListener("click", () => {
    wrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  function updateArrows() {
    const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
    leftBtn.disabled = wrapper.scrollLeft <= 0;
    rightBtn.disabled = wrapper.scrollLeft >= maxScrollLeft - 1;
  }

  wrapper.addEventListener("scroll", updateArrows);
  updateArrows();

  // Adjust on resize
  window.addEventListener("resize", () => {
    const newItemsPerRow = Math.floor(window.innerWidth / (itemWidth + gap));
    wrapper.style.width = (newItemsPerRow * (itemWidth + gap)) + "px";
    updateArrows();
  });
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

    // Finally display
   displayResults2(selectedProduct);
   mayAlsoLike(selectedProduct);
   previousSearches(selectedProduct);


var modal = document.getElementById("myModal");
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
var closeBtn = document.getElementsByClassName("close")[0];
var nextBtn = document.querySelector(".next");
var prevBtn = document.querySelector(".prev");

var images = document.querySelectorAll(".stacked-image, .unstacked-image");
let currentIndex = 0;

// Open modal when any image is clicked
images.forEach((img, index) => {
  img.addEventListener("click", function () {
    modal.style.display = "block";
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
    currentIndex = index;
  });
});

// Close modal
closeBtn.onclick = function () {
  modal.style.display = "none";
};

// Next image
nextBtn.onclick = function () {
  currentIndex = (currentIndex + 1) % images.length;
  modalImg.src = images[currentIndex].src;
  captionText.innerHTML = images[currentIndex].alt;
};

// Previous image
prevBtn.onclick = function () {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  modalImg.src = images[currentIndex].src;
  captionText.innerHTML = images[currentIndex].alt;
};

document.addEventListener("keydown", function(e) {
  if (modal.style.display === "block") {
    if (e.key === "ArrowRight") nextBtn.onclick();
    if (e.key === "ArrowLeft") prevBtn.onclick();
    if (e.key === "Escape") modal.style.display = "none";
  }
});
// zoomable();  SAME LINE uncomment if you want the images to be zoomable END

  
