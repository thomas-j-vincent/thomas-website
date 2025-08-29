import { products } from "./products.js";
import { get, set, updateBasketMessage, addProduct, formatPrice, enableTouchHover, loadFromStorage} from "./functions.js";

updateBasketMessage();
enableTouchHover();
loadFromStorage();

window.addEventListener("DOMContentLoaded", () => {
  const basketProducts = get("basketProducts") || [];
  basketProducts.forEach(({ item }) => {
    // Rebuild DOM from item data
    addProduct(item, true);
  });
  updateBasketMessage();
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
    product.productType.toLowerCase().includes(query) ||
    product.colour.some(c => c.toLowerCase().includes(query)) // check colours too
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
  console.log(products[0].name);

  let item2 = products[1];
  console.log(item2.name);

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
});
