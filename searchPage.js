import { products } from "./products.js";
import { get, set, enableTouchHover, loadFromStorage, updateBasketMessage, universalDisplay, removeAllItems, addToBasket, removeFromBasket, addProduct, formatImage} from "./functions.js";
const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("q");

updateBasketMessage();
enableTouchHover();
loadFromStorage();

window.addEventListener("load", () => {  //SAME LINE scrolls to an amount if scroll is set within the code END 
  const params = new URLSearchParams(window.location.search);
  const scroll = parseInt(params.get("scroll"), 10);
  if (!isNaN(scroll)) {
    window.scrollTo({ top: scroll, behavior: "smooth" });
  } else {
   console.log("error");
  }
  let source = params.get("source");
  if (!isNaN(source)) { // if it is a number
  console.log(source);
  } else if (source === "menu") {
    console.log("ayo this works");
    let searchResults = document.getElementsByClassName("searchResults")[0];
    searchResults.style.visibility = "hidden";
  } else if (source === "collection") {
    // add an image to the top oop!
    console.log(source);
  }else{
  console.log("error");
  }
});

if (document.body.dataset.page === "search-result") {  // SAME LINE only adds the scroll listener to the search page END 
  document.addEventListener("scroll", () => {
  let up =  document.documentElement.scrollTop;
  set ("scrollAmount", up);
  });
}

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
  console.log(products);
      // Show results
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";
  if (results.length > 0) {
    results.forEach(product => {
      const div = document.createElement("div");
      displayResults(product);
      resultsContainer.appendChild(div);
    });
  } else {
    resultsContainer.textContent = "No results found.";
  }
}

