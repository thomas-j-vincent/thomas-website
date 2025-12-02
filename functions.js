import { products } from "./products.js";

const variable = {
  itemsInBasket: 0,
  scrollAmount: 0,   // SAME LINE might work without END
  searchInput: "",
  basketProducts: [],
  basketDisplay: [], 
  viewedProduct: [],
  previousSource: [],
}

  const nextIndex = looper(5); // 5 is the maximum number of images for the carousel

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
  set ("itemsInBasket", 0);    // SAME LINE reset counter END
  set ("scrollAmount", 0);     // SAME LINE might work without END
  set ("basketProducts", []);  // SAME LINE empty product list END
  set ("basketDisplay", []);
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

  let altText;

  if(item.name.length > 20) {
    altText = item.name.substring(0,20);
  } else {
    altText = item.name;
  }

  // SAME LINE (66) item colour shows non default, or if only one colour displays last END
  let row1 = tbody.insertRow(); 
  row1.innerHTML = `
    <td class="itemImg"> 
        <img src="${formatImage(item,item.selectedColour || item.colour[0], 1)}" 
          alt="${altText}" width="128" height="128">
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

function universalDisplay2(item, i) {
  const colours = item.colour || []; // make sure it’s an array

  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  let row1 = tbody.insertRow(); 
  row1.innerHTML = `
      <td class="itemImg"> 
          <img src="${formatCollectionImage("men", 3, i)}" 
            alt="${item.name}" width="100%" height="auto;">
      </td>
  `;

  table.appendChild(tbody);
  return table;
}

export function newReleases(query, appendTo, functionNumber, i) {

  const header = document.querySelector(`.${appendTo}`);
  console.log(query);
  let safeItem = (query || "").toLowerCase();

  if (functionNumber === 0){
  let number = functionNumber || 0; 
  header.innerHTML = `
    <td class="itemImg"> 
      <img src="${formatCollectionImage(safeItem, number, 1)}" 
      alt="${query}">
    </td>
  `;
  return;

  } else if (functionNumber === 1){

    const productsByGender = {};    
    products.forEach(product => {    // SAME LINE filter by gender, pass to next filter
      const key = product.productType[2];
      if (!key) return;
      if (!productsByGender[key]) productsByGender[key] = [];
      productsByGender[key].push(product);
    });

    let category;
    console.log(category);

    if (safeItem === "children") { 
      category = productsByGender["children"] || [];
    } else {
      category =  (productsByGender[safeItem] || []).concat(productsByGender["unisex"] || []);   
    }  // SAME LINE category is a list of all the items sorted by gender END 

    if (i == "undefined"){
      i=0
    }
    console.log(category);
    let index = i % category.length;   // ensures valid index
    console.log(category.length);
    let result = category[index];   //increments
    console.log(result.name);  // safe

    const oldImg = header.querySelector("img");

    if (oldImg) {
      // Slide the old image out
      oldImg.style.transform = "translateX(-100%)";
      oldImg.style.transition = "transform 0.5s ease";
      setTimeout(() => {

        header.innerHTML = `
          <td class="itemImg"> 
            <img src="${formatImage(result, "oneColour", 99)}"   
              alt="${result.name}"
              style="transform: translateX(100%); transition: transform 0.5s ease;">
          </td>
        `; // 99 is special number for the carousel format

        requestAnimationFrame(() => {
          const newImg = header.querySelector("img");
          newImg.style.transform = "translateX(0)";
        });
      }, 500);

    } else {
      // FIRST TIME: no animation needed
      header.innerHTML = `
      <td class="itemImg carousel-slide">
          <img src="${formatImage(result, "oneColour", 99)}"
            alt="${result.name}">
        </td>
      `;
    }

    header.addEventListener("click", e =>{
      console.log("go to product");
      window.location.href = `product.html?q=${encodeURIComponent(result.name)}&source=${safeItem}`;
      // on click go to product // collection
    });
};
}

export function exploreByCategory(query) {

  const itemWidth = 200; // SAME LINE px per card END
  const gap = 20;        // SAME LINE px between cards END
  const screenWidth = document.documentElement.clientWidth;
  console.log(screenWidth);

  const itemsPerRow = Math.floor(screenWidth / (itemWidth + gap));  // SAME LINE how many fit fully on screen END
  const visibleWidth = itemsPerRow * (itemWidth + gap);

  const table = document.createElement("table");     // SAME LINE Table for header + carousel row END
  const tbody = document.createElement("tbody");

  const headerRow = tbody.insertRow();   // SAME LINE Header END
  const headerCell = headerRow.insertCell();
  headerCell.textContent = "Explore by category:";
  headerCell.colSpan = 3;
  headerCell.style.fontWeight = "bold";
  headerCell.style.padding = "10px";

  const row = tbody.insertRow();    // SAME LINE Carousel row END

  const leftCell = row.insertCell();    // SAME LINE Left arrow END
  const leftBtn = document.createElement("button");
  leftBtn.classList.add("carousel-arrow");
  leftBtn.textContent = "‹";
  leftBtn.disabled = true;
  leftCell.appendChild(leftBtn);

  const flexCell = row.insertCell();    // SAME LINE Flex wrapper END
  const wrapper = document.createElement("div");
  wrapper.style.gap = gap + "px";
  wrapper.style.width = visibleWidth + "px"; // SAME LINE fill screen width exactly END 
  wrapper.classList.add("no-scrollbar");
  flexCell.appendChild(wrapper);

  const rightCell = row.insertCell();   // SAME LINE Right arrow END
  const rightBtn = document.createElement("button");
  rightBtn.classList.add("carousel-arrow");
  rightBtn.textContent = "›";
  rightCell.appendChild(rightBtn);

  const headerRow2 = tbody.insertRow();
  const headerCell2 = headerRow2.insertCell();
  headerCell2.textContent = "";
  headerCell2.colSpan = 3;
  headerCell2.style.fontWeight = "bold";
  headerCell2.style.padding = "10px";

  const productsByGender = {};    
  products.forEach(product => {    // SAME LINE filter by gender, pass to next filter
    const key = product.productType[2];
    if (!key) return;
    if (!productsByGender[key]) productsByGender[key] = [];
    productsByGender[key].push(product);
  });

  let category;
  let i = 0;
  let safeItem = (query || "").toLowerCase();

  if (safeItem === "children") { 
    category = productsByGender["children"] || [];
  } else {
    category =  (productsByGender[safeItem] || []).concat(productsByGender["unisex"] || []);   
  }  // SAME LINE category is a list of all the items sorted by gender END 

  const productsByClothType = {}; // SAME LINE filter by product type (trousers etc)
  category.forEach(product => {
    const key = product.productType[0];
    if (!key) return;
    if (!productsByClothType[key]) productsByClothType[key] = [];
    productsByClothType[key].push(product);
  });

  Object.keys(productsByClothType).forEach(type => {
  //  console.log(`Found type: ${type} with ${productsByClothType[type].length} items`);
    productsByClothType[type] = [productsByClothType[type][0]]
    const items = productsByClothType[type]
    items.forEach(item => {  // SAME LINE display result for each product type
      let result = category;
    //console.log(result);
    const newDiv = document.createElement("div");
    newDiv.classList.add("completeLook");
    newDiv.style.width = itemWidth + "px";
    newDiv.style.flexShrink = "0";

    newDiv.addEventListener("click", () => {
      window.location.href = `search.html?q=${encodeURIComponent(type)}&source=collection`;
    });

    //console.log(i);
    const img = document.createElement("img");
    img.src = formatCollectionImage(safeItem, 2, i);  // same as universalDisplay
    img.alt = type.name;//SAMELINE   ^^^safeitem?
    img.style.width = "100%";
    img.style.height = "auto";
    newDiv.appendChild(img);
    wrapper.appendChild(newDiv);
    i ++;
    });
  });
  table.appendChild(tbody);
  document.getElementById("category").appendChild(table);

  const scrollAmount = itemWidth + gap;    // SAME LINE Arrow scroll logic END
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

  window.addEventListener("resize", () => {  // SAME  LINE Adjust on resize END
    const newItemsPerRow = Math.floor(window.innerWidth / (itemWidth + gap));
    wrapper.style.width = (newItemsPerRow * (itemWidth + gap)) + "px";
    updateArrows();
  });
}

export function split(query) {
  const table = document.createElement("table");     // SAME LINE Table for header + carousel row ENDs
  const tbody = document.createElement("tbody");     // SAME LINE next lines renders results END

  const productsByGender = {};  // SAME LINE filter by gender, pass results on 
  products.forEach(product => {
    const key = product.productType[2];
    if (!key) return;
    if (!productsByGender[key]) productsByGender[key] = [];
    productsByGender[key].push(product);
  });

  let category;
  let safeItem = (query || "").toLowerCase();

  if (safeItem === "children") {
    category = productsByGender["children"] || [];
  } else {
    category =  (productsByGender[safeItem] || []).concat(productsByGender["unisex"] || []);   
  }  // SAME LINE category is a list of all the items sorted by gender END 

  const filteredCategory = category.filter(product => 
    product && product.additionalInfo && product.additionalInfo.trim() !== ""
  );

  console.log(filteredCategory);
  const productsByPopularity = {}; //SAME LINE was clothType filter by popularity
  filteredCategory.forEach(product => {
    console.log(product.additionalInfo); // SAME LINE if undefined, remove from list 
    const key = product.additionalInfo;
    if (!key) return;
    if (!productsByPopularity[key]) productsByPopularity[key] = [];
    productsByPopularity[key].push(product);
  });

  if (filteredCategory.length < 2) {     // SAME LINE get a random product from category if only one result; END
    for (let attempts = 0; attempts < 10 && filteredCategory.length < 2; attempts++) {
  let randomProductNumber = Math.floor(Math.random() * category.length);
  if (category[randomProductNumber]) {
    filteredCategory.push(category[randomProductNumber]);
  }
  if (filteredCategory.length > 5) break;
}
  };
    let i = 0;
    const items = filteredCategory;
    items.forEach(item => { 
      let type = item;
      let result = filteredCategory;
      console.log(type.name);
      const newDiv = document.createElement("div");
      newDiv.classList.add("split");
      newDiv.addEventListener("click", () => {
        window.location.href = `product.html?q=${encodeURIComponent(type.name)}&source=${query}`; 
      });

      console.log(result);
      const img = document.createElement("img");
      img.src = formatCollectionImage(`${query}`, 3, i);  // same as universalDisplay
      console.log(formatCollectionImage(`${query}`, 3, i));
      img.alt = type.name;
      img.style.width = "100%";
      img.style.height = "auto";
      img.style.border = "1px, solid, black";
      newDiv.appendChild(img);
      document.getElementById("bestseller").appendChild(newDiv); 
      i++;
    });

  table.appendChild(tbody);   //SAME LINE appends to stuff END
}

export function exploreProducts(query) {

  const itemWidth = 200; // px per card
  const gap = 20;        // px between cards
  const screenWidth = document.documentElement.clientWidth;

  const itemsPerRow = Math.floor(screenWidth / (itemWidth + gap));  // SAME LINE how many fit fully on screen END
  const visibleWidth = itemsPerRow * (itemWidth + gap);

  const table = document.createElement("table");     // SAME LINE Table for header + carousel row ENDs
  const tbody = document.createElement("tbody");

  // Header
  const headerRow = tbody.insertRow();
  const headerCell = headerRow.insertCell();
  headerCell.textContent = "More to explore:";
  headerCell.colSpan = 3;
  headerCell.style.fontWeight = "bold";
  headerCell.style.padding = "10px";

  // Carousel row
  const row = tbody.insertRow();

  // Left arrow
  const leftCell = row.insertCell();
  const leftBtn = document.createElement("button");
  leftBtn.classList.add("carousel-arrow");
  leftBtn.textContent = "‹";
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
  rightBtn.classList.add("carousel-arrow");
  rightBtn.textContent = "›";
  rightCell.appendChild(rightBtn);

  const headerRow2 = tbody.insertRow();
  const headerCell2 = headerRow2.insertCell();
  headerCell2.textContent = "";
  headerCell2.colSpan = 3;
  headerCell2.style.fontWeight = "bold";
  headerCell2.style.padding = "10px";

  // Render ALL results
    let productTable;
  const productsByGender = {};   // SAME LINE filter by gender, get product types (trousers etc), if there are items display box, pass on type when clicked
  products.forEach(product => {
    const key = product.productType[2];
    if (!key) return;
    if (!productsByGender[key]) productsByGender[key] = [];
    productsByGender[key].push(product);
  });

  let category;
    let i = 0;
  let safeItem = (query || "").toLowerCase();

  if (safeItem === "children") {
    category = productsByGender["children"] || [];
  } else {
    category =  (productsByGender[safeItem] || []).concat(productsByGender["unisex"] || []);   
  }  // SAME LINE category is a list of all the items sorted by gender END 

  const productsByClothType = {};   // SAME LINE filter by gender, get product types (trousers etc), if there are items display box, pass on type when clicked
  category.forEach(product => {
    let result = category;
    const newDiv = document.createElement("div");
    newDiv.classList.add("completeLook");
    newDiv.style.width = itemWidth + "px";
    newDiv.style.flexShrink = "0";
    newDiv.addEventListener("click", () => {
      window.location.href = `product.html?q=${encodeURIComponent(product.name)}&source=${query}`;  //SAME LINE needs changing! END
    });

    //console.log(i);
    const img = document.createElement("img");
    img.src = formatCollectionImage(safeItem, 4, i);  // same as universalDisplay
    img.alt = safeItem;//SAMELINE   ^^^safeitem?
    img.style.width = "100%";
    img.style.height = "auto";
    newDiv.appendChild(img);
    wrapper.appendChild(newDiv);
    i ++;
    });
  table.appendChild(tbody);
  document.getElementById("explore").appendChild(table);

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

function looper(max) { // SAME LINE starts on one END 
  let i = 1;

  return function() {
    i = (i + 1) % max;   // SAME LINE increments + wraps back to 0 automatically END
    return i;
  };
}

  function autoScroll(element) {
    const index = nextIndex();
    newReleases("men", "carousel", 1, index);
  }

  export function scrollCarousel (element) {
    console.log(element);
  const carousel = document.getElementById(element);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log("Carousel is on screen.");
       // autoScroll(element); // your function
      }
    });
  }, {
    threshold: 0.1 // 10% visible counts as "on screen"
  });

  observer.observe(carousel);

  let lastX = null;
  let totalMovement = 0;

  window.addEventListener("mousemove", (e) => {
    if (lastX === null) {
      lastX = e.clientX;
      return;
    }

    const delta = Math.abs(e.clientX - lastX);
    totalMovement += delta;
    lastX = e.clientX;

    if (totalMovement > 9000) {  // 100px threshold
      console.log("Mouse moved enough, scrolling carousel");
      console.log(totalMovement);
      autoScroll(element);
      totalMovement = 0; // reset counter
    }
  });

  let lastScroll = window.scrollY;

  window.addEventListener("scroll", () => {
    const current = window.scrollY;
    const difference = Math.abs(current - lastScroll);

    if (difference > 40) { // 40px of scrolling triggers auto-scroll
      console.log("User scrolled page");
      autoScroll(element);
    }

    lastScroll = current;
  });
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
  const colour = selectedColour || item.selectedColour || "oneColour" || "";

  // normalise name and colour (remove spaces, make lowercase, etc.)
  const safeName = String(item.name).replace(/\s+/g, "_");
  const safeColour = String(colour).replace(/\s+/g, "_");
  const safeNumber = String(value).replace(/\s+/g, "_");
  if (colour === undefined) {
    // fallback if no colour is defined
    const path = `./images/${safeName}-oneColour-${safeNumber}.jpeg`;
  }
  const path = `images/${safeName}/${safeColour}-${safeNumber}.jpeg`;
  return (path);
}

export function formatCollectionImage(type,functionNumber,i ){
  const number = functionNumber || 0;
  const path = `images/collection/${number}/${type}/${i}.jpeg`;
  return (path);
}

// helper: try loading image without blocking
function imageExists(url) {
  const img = new Image();
  img.src = url;
  return img.complete || img.height > 0;
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

 // Row 1: Image + Name                                                       // VVVV width="128" height="128"//`
  tbody.insertRow().innerHTML =`
    <td  colspan="4" rowspan="4" class="itemImg" style="width:128px; height:128px">
    <img src="${formatImage(item, item.selectedColour, 1)}" alt="${item.name}"width="128" height="128"> 
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
    <td style="width:25px; border: 1px solid; text-align:center;" class="minus-btn"><i class="fa-solid fa-minus"></i></td>
    <td style="width:50px; text-align:center;" colspan="2" class="qty-cell">${quantity}</td>
    <td style="width:25px; border:1px solid; text-align:center;" class="plus-btn"><i class="fa-solid fa-plus"></i></td>
    <td style="width:75px; border-bottom:1px solid #ddd;" colspan="3" class="itemSize">${item.selectedSize}</td>
    <td style="width:25px; text-align:center;"><i class="fa-solid fa-grip-lines-vertical"></i></td>
    <td style="width:50px; border-bottom:1px solid #ddd;" colspan="2" class="itemColour">${item.selectedColour}</td>
  `;

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

export function isMobileDevice() {
  const touchCapable = ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const smallScreen = window.innerWidth <= 600;
  return smallScreen || touchCapable;
}