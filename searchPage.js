import { products } from "./products.js";
import { get, set, enableTouchHover, loadFromStorage, updateBasketMessage, universalDisplay, existingSearchResults, removeAllItems, addToBasket, removeFromBasket, addProduct, formatImage} from "./functions.js";
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("q");

updateBasketMessage();
enableTouchHover();
loadFromStorage();

 function displayResults(item) {
  const newDiv = document.createElement("div");
  newDiv.classList.add("result-container");
  newDiv.classList.add(item.name.replace(/\s+/g, '-').toLowerCase());
  const productSlug = item.name.replace(/\s+/g, '-').toLowerCase();
  newDiv.addEventListener("click", function() {
    window.location.href = `product.html?q=${encodeURIComponent(item.name)}`;
 });

  const table = universalDisplay(item);
  table.classList.add("basket-table");
  table.border = "0";
  table.cellSpacing = "0";
  table.cellPadding = "5";


 // table.appendChild(tbody);
  newDiv.appendChild(table);

  document.getElementById("searchResult").appendChild(newDiv);
}

if (query) {
  console.log("Search page query:", query);
  document.getElementById("searchQuery").textContent = query;
      // Filter by query
  const results = products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.productType.some(c => c.toLowerCase().includes(query.toLowerCase())) ||
    product.colour.some(c => c.toLowerCase().includes(query.toLowerCase()))
  );
  existingSearchResults(query);
      // Show results
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";
  if (results.length > 0) {
    results.forEach(product => {
      const div = document.createElement("div");
      //div.textContent = `${product.name} - £${product.price}`;
      displayResults(product);
      resultsContainer.appendChild(div);
    });
  } else {
    resultsContainer.textContent = "No results found.";
  }
}

