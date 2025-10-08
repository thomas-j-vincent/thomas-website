import { products } from "./products.js";
import {get, updateBasketMessage, addProduct, enableTouchHover, loadFromStorage, set} from "./functions.js";

updateBasketMessage();
enableTouchHover();
loadFromStorage();

window.addEventListener("DOMContentLoaded", () => {
  const basketProducts = get("basketProducts") || [];
  basketProducts.forEach(({ item }) => {
    addProduct(item); // SAME LINE Rebuild DOM from item data END
  });
  updateBasketMessage();
});

const myDiv = document.getElementsByClassName('search-box')[0];
const searchInput = document.querySelector('.search-box input');

// listen for typing
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase(); // get typed text
  console.log("User typed:", query);
  set ("searchInput", query);
  console.log(get("searchInput"));

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
