import { products } from "./products.js";
import { get, set, enableTouchHover, loadFromStorage, updateBasketMessage, formatImage, removeAllItems, formatCollectionImage} from "./functions.js";

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("q");

updateBasketMessage();
enableTouchHover();
loadFromStorage();

function newReleases(query, appendTo, functionNumber) {
  let number = functionNumber || 0; 
    const header = document.querySelector(`.${appendTo}`);
    const newDiv = document.createElement("div");
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    let row1 = tbody.insertRow(); 
    row1.innerHTML = `
        <td class="itemImg"> 
        <img src="${formatCollectionImage(query, number, 1)}" 
            alt="${query}" width="128" height="128">
        </td>
    `;
    table.appendChild(tbody);
    newDiv.appendChild(table);
    header.style.background = "green";
    header.innerHTML= "";
    header.append(newDiv);
}
function mayAlsoLike(query) {
  /*
  let productTable;
  const productsByGender = {};   // SAME LINE filter by gender, get product types (trousers etc), if there are items display box, pass on type when clicked
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

  const productsByClothType = {};   // SAME LINE filter by gender, get product types (trousers etc), if there are items display box, pass on type when clicked
  category.forEach(product => {
    const key = product.productType[0];
    if (!key) return;
    if (!productsByClothType[key]) productsByClothType[key] = [];
    productsByClothType[key].push(product);
  });

  Object.keys(productsByClothType).forEach(type => {
    console.log(`Found type: ${type} with ${productsByClothType[type].length} items`);
    const items = productsByClothType[type]
    items.forEach(item => {
      productTable = universalDisplay(type);
    });
  //  const itemsOfThisType = productsByClothType[type];
  });
  */

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
  headerCell.textContent = "Explore by category:";
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
  let safeItem = (query || "").toLowerCase();

  if (safeItem === "children") {
    category = productsByGender["children"] || [];
  } else {
    category =  (productsByGender[safeItem] || []).concat(productsByGender["unisex"] || []);   
  }  // SAME LINE category is a list of all the items sorted by gender END 

  const productsByClothType = {};   // SAME LINE filter by gender, get product types (trousers etc), if there are items display box, pass on type when clicked
  category.forEach(product => {
    const key = product.productType[0];
    if (!key) return;
    if (!productsByClothType[key]) productsByClothType[key] = [];
    productsByClothType[key].push(product);
  });

  Object.keys(productsByClothType).forEach(type => {
    console.log(`Found type: ${type} with ${productsByClothType[type].length} items`);
      productsByClothType[type] = [productsByClothType[type][0]]
    const items = productsByClothType[type]
    items.forEach(item => {

  let result = category;
    console.log(result);
    const newDiv = document.createElement("div");
    newDiv.classList.add("completeLook");
    newDiv.style.width = itemWidth + "px";
    newDiv.style.flexShrink = "0";

    newDiv.addEventListener("click", () => {
      window.location.href = `search.html?q=${encodeURIComponent(type)}&source=collection`;  //SAME LINE needs changing! END
    });

    console.log(result);
    const productTable = universalDisplay(type);
    productTable.style.width = "100%";
    newDiv.appendChild(productTable);

    wrapper.appendChild(newDiv);
    });
  //  const itemsOfThisType = productsByClothType[type];
  });
  table.appendChild(tbody);
  document.getElementById("category").appendChild(table);

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
function universalDisplay(item) {
  const colours = item.colour || []; // make sure it’s an array
  const extraColours = Math.max(colours.length - 1, 0); // subtract the default first colour
  const additionalInfo = item.additionalInfo || "&nbsp;";

  const table = document.createElement("table");
  const tbody = document.createElement("tbody");

  // SAME LINE (66) item colour shows non default, or if only one colour displays last END
  let row1 = tbody.insertRow(); 
  row1.innerHTML = `
      <td class="itemImg"> 
          <img src="${formatCollectionImage(1, "men", 0)}" 
            alt="${item.name}" width="128" height="128">
      </td>
  `;

  table.appendChild(tbody);
  return table;
}

function split(query) {
  const table = document.createElement("table");     // SAME LINE Table for header + carousel row ENDs
  const tbody = document.createElement("tbody");     // SAME LINE next lines renders results END

  const productsByGender = {};   // SAME LINE filter by gender, get product types (trousers etc), if there are items display box, pass on type when clicked
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
  const productsByPopularity = {}; //SAME LINE was clothType filter by popularity,  if there are items display box, pass on type when clicked
  filteredCategory.forEach(product => {
    console.log(product.additionalInfo); // SAME LINE if undefined, remove from list 
    const key = product.additionalInfo;
    if (!key) return;
    if (!productsByPopularity[key]) productsByPopularity[key] = [];
    productsByPopularity[key].push(product);
  });

  if (filteredCategory.length < 2) {     // SAME LINE get a random product from category (not the one already in the array); END
    let randomProductNumber = Math.floor(Math.random() * (category.length - 1 + 1)) + 1;
    if (category[randomProductNumber]) {
      filteredCategory.push(category[randomProductNumber]);
    }
  };

    const items = filteredCategory;
    items.forEach(item => { 
      let type = item;
      let result = filteredCategory;
      console.log(type.name);
      const newDiv = document.createElement("div");
      newDiv.classList.add("split");
      newDiv.addEventListener("click", () => {
        window.location.href = `product.html?q=${encodeURIComponent(type.name)}&source=${query}`;  //SAME LINE needs changing! END
      });

      console.log(result);
      const productTable = universalDisplay(type);
      productTable.style.width = "100%";
      newDiv.appendChild(productTable);
      document.getElementById("bestseller").appendChild(newDiv); 
    });

  table.appendChild(tbody);   //SAME LINE appends to stuff END
  }

function exploreProducts(query) {

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
  let safeItem = (query || "").toLowerCase();

  if (safeItem === "children") {
    category = productsByGender["children"] || [];
  } else {
    category =  (productsByGender[safeItem] || []).concat(productsByGender["unisex"] || []);   
  }  // SAME LINE category is a list of all the items sorted by gender END 

  const productsByClothType = {};   // SAME LINE filter by gender, get product types (trousers etc), if there are items display box, pass on type when clicked
  category.forEach(product => {
    let result = category;
    console.log(product.name);
    const newDiv = document.createElement("div");
    newDiv.classList.add("completeLook");
    newDiv.style.width = itemWidth + "px";
    newDiv.style.flexShrink = "0";
    newDiv.addEventListener("click", () => {
      window.location.href = `product.html?q=${encodeURIComponent(product.name)}&source=${query}`;  //SAME LINE needs changing! END
    });

    console.log(result);
    const productTable = universalDisplay(result); //SAME LINE was type END
    productTable.style.width = "100%";
    newDiv.appendChild(productTable);

    wrapper.appendChild(newDiv);
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

    newReleases(query, "header");
    mayAlsoLike(query);
    newReleases(query, "carousel", 1);
    split(query);
    exploreProducts(query);

/*  allows us to change what the website does depending on the button clicked 
if (query === "Men"){
    console.log ("wow!");
    newReleases(query, "header");
    mayAlsoLike(query);
    newReleases(query, "carousel", 1);
    split(query);
    exploreProducts(query);
} else if (query === "Women") {
    console.log ("Women!");
    newReleases(query, "header");
    mayAlsoLike(query);
    newReleases(query, "carousel", 1);
    split(query);
    exploreProducts(query);
} else if (query === "Children") {
    console.log ("Kids these days!");
    newReleases(query, "header");
    mayAlsoLike(query);
    newReleases(query, "carousel", 1);
    split(query);
    exploreProducts(query);
} else {
    console.log ("error");
    newReleases(query, "header");
    mayAlsoLike(query);
    newReleases(query, "carousel", 1);
    split(query);
    exploreProducts(query);
}
*/