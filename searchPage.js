import { products } from "./products.js";
import { get, set, enableTouchHover, loadFromStorage, updateBasketMessage, removeAllItems, addToBasket, removeFromBasket, addProduct, formatImage} from "./functions.js";
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

  const table = document.createElement("table");
  table.classList.add("basket-table");
  table.border = "0";
  table.cellSpacing = "0";
  table.cellPadding = "5";

const colours = item.colour || []; // make sure it’s an array
const extraColours = Math.max(colours.length - 1, 0); // subtract the default first colour

const additionalInfo = item.additionalInfo || "&nbsp;";

  const tbody = document.createElement("tbody");

  // Row 1: Image + Name
  let row1 = tbody.insertRow();
  row1.innerHTML = `
      <td class="itemImg">
          <img src="${formatImage(item,item.colour[1] || item.colour[0], 1)}" alt="${item.name}" width="128" height="128">
      </td>
  `;
  // Simple price row for now
  tbody.insertRow().innerHTML = `
       <td class="itemName">${item.name}</td>
  `;
    // Simple price row for now
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
