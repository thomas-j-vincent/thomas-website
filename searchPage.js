const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("q");

if (query) {
  console.log("Search page query:", query);
  document.getElementById("searchQuery").textContent = query;

  // Fetch products again (same JSON file)
  fetch("products.json")
    .then(res => res.json())
    .then(products => {

  let item1 = products[0];
  console.log(item1);

  let item2 = products[1];
  console.log(item2);

function displayResults(item) {
  const newDiv = document.createElement("div");
  newDiv.classList.add("product-container");

  const table = document.createElement("table");
  table.classList.add("basket-table");
  table.border = "0";
  table.cellSpacing = "0";
  table.cellPadding = "5";

  const tbody = document.createElement("tbody");

  // Row 1: Image + Name
  let row1 = tbody.insertRow();
  row1.innerHTML = `
      <td colspan="4" rowspan="4" class="itemImg">
          <img src="${item.image}" alt="${item.name}" width="128" height="128">
      </td>
      <td rowspan="7" style="width:50px;">&nbsp;</td>
      <td colspan="6" style="border-bottom: 1px solid #ddd;" class="itemName">${item.name}</td>
  `;

  // Simple price row for now
  tbody.insertRow().innerHTML = `
      <td colspan="6" class="itemPrice">£${item.price}</td>
  `;

  table.appendChild(tbody);
  newDiv.appendChild(table);

  document.getElementById("searchResult").appendChild(newDiv);
}
 

      // Filter by query
      const results = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.productType.toLowerCase().includes(query.toLowerCase()) ||
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
    });
}
