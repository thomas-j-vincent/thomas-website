import { products } from "./products.js";
import { get, set, enableTouchHover, displayResults, loadFromStorage, updateBasketMessage, removeAllItems, addToBasket, removeFromBasket, addProduct, formatImage} from "./functions.js";
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("q");

updateBasketMessage();
enableTouchHover();
loadFromStorage();

if (query) {
  console.log("Search page query:", query);
  document.getElementById("searchQuery").textContent = query;
      // Filter by query
  const results = products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.productType.some(c => c.toLowerCase().includes(query.toLowerCase())) ||
    product.colour.some(c => c.toLowerCase().includes(query.toLowerCase()))
  );
      // Show results
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";
  if (results.length > 0) {
    results.forEach(product => {
      const div = document.createElement("div");
      //div.textContent = `${product.name} - £${product.price}`;
      displayResults(product);
      console.log(displayResults);
      resultsContainer.appendChild(div);
    });
  } else {
    resultsContainer.textContent = "No results found.";
  }
}
