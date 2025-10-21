import { products } from "./products.js";
import { get, set, enableTouchHover, loadFromStorage, addProduct, universalDisplay, updateBasketMessage, existingSearchResults, addToBasket, formatImage, isMobileDevice} from "./functions.js";
    const itemName = new URLSearchParams(window.location.search).get("q"); 

updateBasketMessage();
enableTouchHover();
loadFromStorage();
existingSearchResults(itemName);

console.log(window.innerWidth);
let mobileImageCell = null;
let mobileImageCell2 = null;

function displayImages(item) {
  const imageDiv = document.querySelector(".imageDiv");
  const imageDiv2 = document.querySelector(".imageDiv2");

  let rowContainer = document.createElement("div");
  rowContainer.className = "image-table";

  let mobileThirdRow = document.createElement("div");
  mobileThirdRow.className = "image-table";

  const colour = item.selectedColour || item.colour[1] || item.colour[0] || "";
  let i = 0;

  while (i < item.imageCount) {

    if (i === 0) {     // SAME LINE FOR THE FIRST IMAGE (imageDiv) END
      let rowDiv = document.createElement("div");
      rowDiv.className = "image-row";

      let img1 = document.createElement("img");
      img1.src = `${formatImage(item, colour, 0)}`;
      img1.alt = `${item.name}${colour}`;
      img1.className = "unstacked-image";
      img1.id = "myImg";

      rowDiv.appendChild(img1);
      rowContainer.appendChild(rowDiv);
      imageDiv.appendChild(rowContainer);
    }

    else if (i === 1) { // SAME LINE for the SECOND + THIRD IMAGES, WHEN ON MOBILE GETS APPENDED ELSEWHERE END
      let rowDiv = document.createElement("div");
      rowDiv.className = "image-row";

      let img1 = document.createElement("img");
      img1.src = `${formatImage(item, colour, 1)}`;
      img1.alt = `${item.name}${colour}`;
      img1.className = "unstacked-image";
      img1.id = "myImg";

      rowDiv.appendChild(img1);

      if (i + 1 < item.imageCount) {       // SAME LINE IF A 3RD IMAGE EXISTS END
        let img2 = document.createElement("img");
        img2.src = `${formatImage(item, colour, i + 1)}`;
        img2.alt = `${item.name}${colour}`;
        img2.className = "unstacked-image";
        img2.id = "myImg";

        if (!isMobileDevice()) {       // SAME LINE ON DESKTOP  place 2nd & 3rd in same row END
          rowDiv.appendChild(img2);
        } else {           // SAME LINE ON MOBILE THE THIRD IMAGE GOES TO mobileImageCell2 END
          let thirdDiv = document.createElement("div");
          thirdDiv.className = "image-row";
          thirdDiv.appendChild(img2);
          mobileThirdRow.appendChild(thirdDiv);
        }
        i++; // SAME LINE SKIP THE THIRD IMAGE ON THE NEXT LOOP END
      }  // SAME LINE (BELOW) MOBILE LOGIC PUT 2ND IMAGE IN mobileImageCell END

      if (isMobileDevice() && typeof mobileImageCell !== "undefined") {
        mobileImageCell.appendChild(rowDiv);
        if (typeof mobileImageCell2 !== "undefined") {
          mobileImageCell2.appendChild(mobileThirdRow);
        }
      } else {

        imageDiv2.appendChild(rowDiv);         // SAME LINE ON DESKTOP ACT NORMAL FLOW END
      }

    }

    else { // SAME LINE, for any REMAINING IMAGES END
      let img = document.createElement("img");
      img.src = `${formatImage(item, colour, i)}`;
      img.alt = `${item.name}${colour}`;
      img.className = "stacked-image";
      img.id = "myImg";

      imageDiv2.appendChild(img);
    }

    i++;
    cropOverflowingImages();
  }
}


function cropOverflowingImages() {
  const container = document.querySelector('.imageColumn2');
  const containerBottom = container.getBoundingClientRect().bottom;

  const images = container.querySelectorAll('.stacked-image');

  images.forEach(img => {
    const rect = img.getBoundingClientRect();

    if (rect.bottom > containerBottom) {
      const overflow = rect.bottom - containerBottom;
      img.style.clipPath = `inset(0 0 ${overflow}px 0)`;
    } else {
      img.style.clipPath = 'none';
    }
  });
}


function displayResults2(item) {
  document.getElementById("added").style.visibility = "hidden";
  const imageDiv = document.querySelector(".imageDiv");
  const imageDiv2 = document.querySelector(".imageDiv2");

  const newDiv = document.createElement("div");
  newDiv.classList.add("product-container");
  const table = document.createElement("table");
  table.classList.add("basket-table");
  const tbody = document.createElement("tbody");

 // Row 1: Product Name END 
  let row1 = tbody.insertRow();
  row1.innerHTML =
  `<td colspan="9" style="border-bottom: 1px solid #ddd; border: 1px solid black;" class="productName">
  ${item.name}</td>`;

 // Spacer Row END
  let row100 = tbody.insertRow()
  row100.innerHTML = `<td colspan="9">
  &nbsp;</td>`;
  row100.classList.add("spacer");

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
      const colourIndex = i + 1;
      const cellWidth = 100/item.colour.length;
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
        imageDiv2.innerHTML = "";
        //imageDiv.appendChild(displayImages(item));
        imageDiv2.appendChild(displayImages(item));
        cropOverflowingImages();
      });
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
      imageDiv2.innerHTML = "";
      imageDiv.appendChild(displayImages(item));
      imageDiv2.appendChild(displayImages(item));
      cropOverflowingImages();
    });
  };
 // Spacer Row END
  let row200 = tbody.insertRow()
  row200.innerHTML = `<td colspan="9">
  &nbsp;</td>`;
  row200.classList.add("spacer");

 // Row 3: Sizes END
  let row3 = tbody.insertRow();
  let sizeLabel = row3.insertCell();
  sizeLabel.textContent = "Size:";
  sizeLabel.style.width = "100px";
  sizeLabel.style.border = "1px solid black";
  let row3Width;
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
      row3Width = cellWidth + "%";
      console.log (row3Width);
      let sizeCell = row3.insertCell();
      sizeCell.textContent = item.size[sizeIndex];
      sizeCell.classList.add("productSize");
      sizeCell.style.width = cellWidth + "%";
      sizeCell.style.border = "1px solid black";
      const thisSize = item.size[sizeIndex];
      sizeCell.addEventListener("click", () => {
        item.selectedSize = thisSize;
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
    row3Width = sizeCell.style.width
    console.log(row3Width);
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
  let row300 = tbody.insertRow()
  row300.innerHTML = `<td colspan="9">
  &nbsp;</td>`;
  row300.classList.add("spacer");

 // Row 4: Price END
  let row301 = tbody.insertRow()
  row301.innerHTML = `<td style="width:100px; border: 1px solid black;" class="productPrice">
  Price:</td>
  <td colspan="8" style="border: 1px solid black; width: ${row3Width}" class="productPriceValue">
  £${item.price}</td>`;
  //row301.style.width = row3Width + "%";
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
  if (isMobileDevice()) {
      let row500 = tbody.insertRow()
  row500.innerHTML = `<td colspan="9">
  &nbsp;</td>`;
  row500.classList.add("spacer"); 

  let row501 = tbody.insertRow();
  mobileImageCell = row501.insertCell();
  mobileImageCell.colSpan = 9;
  mobileImageCell.style.border = "1px solid black";
  mobileImageCell.classList.add("mobileImageCell");

  } else {

  let row6 = tbody.insertRow()    // SAME LINE Row 6: Checkout END 
  row6.innerHTML =
  `<td colspan="9" style="border: 1px solid black; text-align:center; cursor:pointer;" id = "checkout">
  Checkout</td>`;
  row6.addEventListener("click", () => {
    window.location.href="checkout.html";
  });
  }

  let row600 = tbody.insertRow()
  row600.innerHTML = `<td colspan="9">
  &nbsp;</td>`;
  row600.classList.add("spacer");

  let row7 = tbody.insertRow()
  row7.innerHTML = 
  `<td colspan="9" style="border: 1px solid black; text-align:center; cursor:pointer; width: 950px" id = "Product description">
  Product Description</td>`;
  let clicks2 = 0;
  if (isMobileDevice()) {
  row7.addEventListener("click", () => {
        clicks2 ++;
    const itemDescription = document.getElementById("itemDescription");
    if (clicks2 & 1 == 1) {
      itemDescription.style.display = "block";
    } else {
      itemDescription.style.display = "none";
    }
  });
}

  let row700 = tbody.insertRow()
  row700.innerHTML = `<td colspan="9">
  &nbsp;</td>`;
  row700.classList.add("spacer");

  let row8 = tbody.insertRow()
  row8.innerHTML = 
  `<td colspan="9" class="description" style="border: 1px solid black; text-align:left; cursor:pointer;" id = "itemDescription">
  ${item.description}</td>`;

  let row800 = tbody.insertRow()
  row800.innerHTML = `<td colspan="9">
  &nbsp;</td>`;
  row800.classList.add("spacer");
  row800.classList.add("description2");

  let row9 = tbody.insertRow()
  row9.innerHTML = 
  `<td colspan="9" class= "description2" style="border: 1px solid black; text-align:center; cursor:pointer;" id = "Delivery Details">
  Delivery Details</td>`;
  let clicks = 0;
  if (isMobileDevice()) {
  row9.addEventListener("click", () => {
    clicks ++;
    const deliveryDetails = document.getElementById("deliveryDetails");
    if (clicks & 1 == 1) {
      deliveryDetails.style.display = "block";
    } else {
      deliveryDetails.style.display = "none";
    }
  });
}

  let row900 = tbody.insertRow()
  row900.innerHTML = `<td colspan="9">
  &nbsp;</td>`;
  row900.classList.add("spacer");

  let row10 = tbody.insertRow()
  row10.innerHTML = 
  `<td colspan="9" class="description" style="border: 1px solid black; text-align:left; cursor:pointer;" id = "deliveryDetails">
  ${item.deliveryDetails}</td>`;

  if (isMobileDevice()) {
    let row1001 = tbody.insertRow();
    mobileImageCell2 = row1001.insertCell();
    mobileImageCell2.colSpan = 9;
    mobileImageCell2.style.border = "1px solid black";
    mobileImageCell2.classList.add("mobileImageCell");

    let row1000 = tbody.insertRow()
    row1000.innerHTML = `<td colspan="9">
    &nbsp;</td>`;
    row1000.classList.add("spacer");

  } else {
    let row1000 = tbody.insertRow()
    row1000.innerHTML = `<td colspan="9">
    &nbsp;</td>`;
    row1000.classList.add("spacer");
    row1000.classList.add("description");
    }

  imageDiv.innerHTML = ""; // clear old stuff
  imageDiv2.innerHTML = "";
  displayImages(item);

    let row11 = tbody.insertRow()
  row11.innerHTML = 
  `<td colspan="9" style="border: 1px solid black; text-align:center; cursor:pointer;" id= "Complete the look" class="fullWidth">
  Complete the look</td>`;

  let row1100 = tbody.insertRow()
  row1100.innerHTML = `<td colspan="9">
  &nbsp;</td>`;
  row1100.classList.add("spacer");

  let row12 = tbody.insertRow();
  let cell = row12.insertCell();
  cell.colSpan = 9;
  cell.style.border = "1px solid black";
  cell.classList.add("fullWidth");
  const lookTable = completeLook(item);
  cell.appendChild(lookTable);

  table.appendChild(tbody);
  newDiv.appendChild(table);

 // Attach to productDetails END
  document.querySelector(".productDetails").appendChild(newDiv);
  /*
    if (imageDiv) {
    imageDiv.innerHTML = ""; // clear old stuff
    imageDiv2.innerHTML = "";
    displayImages(item);
  //  imageDiv.appendChild(displayImages(item));
  //  imageDiv2.appendChild(displayImages(item));  
    }*/
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
  for (let i = 0; i < results.length; i++){
    const item = results[i]; 
    const newDiv = document.createElement("div");
    newDiv.classList.add("completeLook");
    newDiv.addEventListener("click", function() {
      window.location.href = `product.html?q=${encodeURIComponent(item.name)}&source=completeLook`;
    });
    const table = universalDisplay(item);
    newDiv.appendChild(table);
    containerDiv.appendChild(newDiv);
    if (i < results.length - 1) {
      const spacer = document.createElement("div");
      spacer.innerHTML = `<table><tbody>
        <tr><td colspan="9">&nbsp;</td></tr>
      </tbody></table>`;
      spacer.classList.add("spacer");
      containerDiv.appendChild(spacer);
    }
  } 
 return containerDiv;
};

// this is to make the images zoom-in-able on phone or mouse END
/*function zoomable() {
  let scale = 1;
  let posX = 0, posY = 0;
  let isDragging = false;
  let startX, startY;

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
// this supposidly resizes the images to fit the space END
function fillImageColumn() {
  const column = document.querySelector('.imageColumn2');
  if (!column) return;

  const tables = column.querySelectorAll('.image-table');
  if (tables.length === 0) return;

  // Reset any previous inline height (in case of resize or re-render)
  column.querySelectorAll('img').forEach(img => img.style.height = '');

  // Measure total image-table height
  const columnHeight = column.clientHeight;
  let totalHeight = 0;

  tables.forEach(table => {
    totalHeight += table.offsetHeight;
  });

  // If there's empty space, stretch the last image
  if (totalHeight < columnHeight) {
    const extraSpace = columnHeight - totalHeight;
    const lastImage = tables[tables.length - 1].querySelector('img:last-child');

    if (lastImage) {
      const currentHeight = lastImage.offsetHeight;
      lastImage.style.height = `${currentHeight + extraSpace}px`;
      lastImage.style.objectFit = 'cover'; // ensures clean scaling
    }
  }
}

// this makes the imageColumn (1) the same height as product details (not required) END
function updateHeights() {       
  const productLayout = document.querySelector('.productLayout');
  const productDetails = document.querySelector('.productDetails');
  const image2 = document.querySelector('.imageColumn2');
  const image = document.querySelector('.imageColumn');
  if (productLayout && productDetails && image && image2) {
    const detailsHeight = productDetails.offsetHeight;
    const imageHeight = image.offsetHeight;
    console.log(detailsHeight);
    const image2Height = (detailsHeight - imageHeight);
    productLayout.style.minHeight = `${detailsHeight}px`;
    if(!isMobileDevice()){
    image2.style.minHeight = `${image2Height}px`;
    } else {
      productLayout.style.width= "100%";
    };
  }
}

function mayAlsoLike(item) {
  const compare = item.productType[0];
  let results = products.filter(product => product.productType.includes(compare));
  results = results.filter(product => product.name !== item.name);

  const itemWidth = 200; // px per card
  const gap = 20;        // px between cards
  const screenWidth = window.innerWidth;

  const itemsPerRow = Math.floor(screenWidth / (itemWidth + gap));  // SAME LINE how many fit fully on screen END
  const visibleWidth = itemsPerRow * (itemWidth + gap);

  const table = document.createElement("table");     // SAME LINE Table for header + carousel row ENDs
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
  leftBtn.style.padding = "41px";
  leftBtn.disabled = true;
  leftCell.appendChild(leftBtn);

  // Flex wrapper
  const flexCell = row.insertCell();
  const wrapper = document.createElement("div");
  wrapper.style.gap = gap + "px";
  wrapper.style.width = visibleWidth + "px"; // fill screen width exactly
  wrapper.classList.add("no-scrollbar");
  flexCell.appendChild(wrapper);

  // Right arrow
  const rightCell = row.insertCell();
  const rightBtn = document.createElement("button");
  rightBtn.textContent = "›";
  rightCell.appendChild(rightBtn);

  // Render ALL results
  let i= 0;
  results.forEach(result => {
    const newDiv = document.createElement("div");
    newDiv.classList.add("completeLook");
    newDiv.style.width = itemWidth + "px";
    newDiv.style.flexShrink = "0";

    newDiv.addEventListener("click", () => {
      window.location.href = `product.html?q=${encodeURIComponent(result.name)}&source=mayAlsoLike`;
    });

    const productTable = universalDisplay(result);
    productTable.style.width = "100%";

    newDiv.appendChild(productTable);
    wrapper.appendChild(newDiv);
  if(isMobileDevice()){
  productTable.querySelectorAll(".itemAdditionalInfo").forEach(el => el.remove());
  productTable.querySelectorAll(".availableColours").forEach(el => el.remove());
  productTable.querySelectorAll("tr").forEach(tr => {
  if (!tr.textContent.trim() && tr.children.length === 0) {
    tr.remove();
  }
});
  }
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

// the function to display the searches from existingSearchResults
function previousSearches() {  
  let results = get("viewedProducts");
  //results = results.filter(name => name !== selectedProduct.name);
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
  leftBtn.style.padding = "41px";
  leftBtn.disabled = true;
  leftCell.appendChild(leftBtn);

  // Flex wrapper
  const flexCell = row.insertCell();
  const wrapper = document.createElement("div");
  wrapper.style.gap = gap + "px";
  wrapper.style.width = visibleWidth + "px"; // fill screen width exactly
  wrapper.classList.add("no-scrollbar");
  flexCell.appendChild(wrapper);

  // Right arrow
  const rightCell = row.insertCell();
  const rightBtn = document.createElement("button");
  rightBtn.textContent = "›";
  rightCell.appendChild(rightBtn);

  // Render ALL results
  results.forEach(resultName => {

    const product = products.find(p => p.name === resultName);
    if (!product) return; // skip if not found

    const newDiv = document.createElement("div");
    newDiv.classList.add("previousSearches");
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

function autoZoomImages() {
  const layout = document.querySelector('.productLayout');
  const details = document.querySelector('.productDetails');
  const imageDiv = document.querySelector('.imageDiv');

  if (!layout || !details || !imageDiv) return;

  // Get available width for images (match productDetails width)
  const availableWidth = details.clientWidth;

  // Get all images inside imageDiv
  const images = imageDiv.querySelectorAll('img');
  if (images.length === 0) return;

  images.forEach(img => {
    // Reset styles
    img.style.width = '';
    img.style.height = '';
    img.style.objectFit = 'contain';

    // Wait for image to load to get natural dimensions
    if (img.complete) {
      scaleImage(img, availableWidth);
    } else {
      img.onload = () => scaleImage(img, availableWidth);
    }
  });

  function scaleImage(img, availableWidth) {
    // Set width to fill the available space
    img.style.width = availableWidth + 'px';
    // Set height to maintain aspect ratio
    const aspectRatio = img.naturalHeight / img.naturalWidth;
    img.style.height = (availableWidth * aspectRatio) + 'px';
    img.style.objectFit = 'cover';
  }
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

  document.getElementById("back").addEventListener("click", () => {
    let searchInput = get("searchInput");
    let viewedProducts = get("viewedProducts")
    let viewedProduct = viewedProducts.slice (1,2);
//    let safeItem = (query || "").toLowerCase();
    console.log(viewedProduct);
    const params = new URLSearchParams(window.location.search);
    let source = params.get("source");
    if (source === "completeLook" || source === "mayAlsoLike") {
      window.location.href = `product.html?q=${encodeURIComponent(viewedProduct)}`
    } else if (source === "Men" || "Women" || "Children"){
      window.location.href = `page.html?q=${encodeURIComponent(source)}`
    }
    else{
      window.location.href = `search.html?q=${encodeURIComponent(searchInput)}&scroll=${get("scrollAmount")}`;
    }
  });
    // Find product in JSON
    const selectedProduct = products.find(p => p.name === itemName);

    if (!selectedProduct) {
      console.error("No product found with name:", itemName);
      document.querySelector(".productDetails").textContent = "Product not found.";
    //  return;
    }
    
  window.addEventListener('load', () =>{
    setTimeout(updateHeights, 100);
    cropOverflowingImages();
    const img = document.querySelector('.imageDiv .image-row img');
    //const img = document.querySelector('img[src="images/Zain_mugshot/one_colour-0.jpeg"]');
    img.style.removeProperty('width');
    img.style.removeProperty('height');
    //fillImageColumn();
  } );
  window.addEventListener('resize', () => {
    updateHeights();
    cropOverflowingImages();
    autoZoomImages();
    const img = document.querySelector('img[src="images/Zain_mugshot/one_colour-0.jpeg"]');
    img.style.removeProperty('width');
    img.style.removeProperty('height');
    //fillImageColumn();
  } );

  displayResults2(selectedProduct); //SAME LINE finally displays all the functions END
  mayAlsoLike(selectedProduct);
  previousSearches(selectedProduct);
  
  if (isMobileDevice()) {
  console.log("Mobile detected!");
  const imageColumn2 = document.querySelector('imageColumn2');
  //imageColumn2.style.removeProperty('min-height');
  let length = document.getElementsByClassName("description").length;
  console.log(length);
  let i= 0 ;
  while (i< length){
    document.getElementsByClassName("description")[i].style.display = "none";
    i++;
  }

  // Run mobile-specific behaviour here
} else {
  console.log("Desktop detected!");
}


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