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
  console.log(item1.name);

  let item2 = products[1];
  console.log(item2.name);

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
        <td colspan="6" style="border-bottom: 1px solid #ddd;" class="itemName"> ${item.name}</td>
    `;

    // Row 2: Empty
    tbody.insertRow().innerHTML = `<td colspan="3">&nbsp;</td>`;

    // Row 3: Price
    tbody.insertRow().innerHTML = `
        <td colspan="6" style="width:150px; border-bottom: 1px solid #ddd;" class="itemPrice"> ${formatPrice(totalPrice)} </td>
    `;

    // Row 4: Empty
    tbody.insertRow().innerHTML = `<td colspan="3">&nbsp;</td>`;

    // Row 5: Quantity / Size / Colour controls
    let row5 = tbody.insertRow();
    row5.innerHTML = `
        <td style="width:25px; border: 1px solid; text-align: center;" class="plus-btn"><i class="fa-solid fa-plus"></i></td>
        <td style="width:50px; text-align: center;" colspan="2" class="qty-cell">${quantity}</td>
        <td style="width:25px; border: 1px solid; text-align: center;" class="minus-btn"><i class="fa-solid fa-minus"></i></td>
        <td style="width:75px; border-bottom: 1px solid #ddd;" colspan="3" class="itemSize">${item.selectedSize}</td>
        <td style="width:25px; text-align: center;"><i class="fa-solid fa-grip-lines-vertical"></i></td>
        <td style="width:50px; border-bottom: 1px solid #ddd;" colspan="2" class="itemColour">${item.selectedColour}</td>
    `;

    table.appendChild(tbody);
    newDiv.appendChild(table);
    document.getElementById("searchResult").appendChild(newDiv);
    updateBasketMessage();

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
          displayResults(item);
console.log(displayResults);
          resultsContainer.appendChild(div);
        });
      } else {
        resultsContainer.textContent = "No results found.";
      }
    });
}
