  console.log("searchPage.js loaded");
  
  fetch("products.json")
    .then(res => res.json())
    .then(products => {
const urlParams = new URLSearchParams(window.location.search);
    const item = urlParams.get("item");

  let item1 = products[0];
  console.log(item1);

  let item2 = products[1];
  console.log(item2);

function displayResults(item) {
  console.log("Item in displayResults:", item);

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
      <td colspan="9" style="border-bottom: 1px solid #ddd; border: 1px, solid, black;" class="productName">${item.name}</td>
  `;

  // Row 2: Empty
  tbody.insertRow().innerHTML = `<td colspan="5">&nbsp;</td>`;

// WORK ON THIS BIT \/
  // Row 3: Price
  tbody.insertRow().innerHTML = `
      <td style="width:100px; border-bottom: 1px solid #ddd; border: 1px, solid, black;" class="productColour">Colour:</td>
      <td colspan="1"style=" width:100px;">&nbsp;</td>
      <td style="width:50px; border-bottom: 1px solid #ddd; border: 1px, solid, black;" class="productColour">colour 1</td>
      <td style="width:50px; border-bottom: 1px solid #ddd; border: 1px, solid, black;" class="productColour">colour 2</td>
      <td style="width:50px; border-bottom: 1px solid #ddd; border: 1px, solid, black;" class="productColour">colour 3</td>
  `;
// WORK ON THIS BIT /\

  // Row 4: Empty
  tbody.insertRow().innerHTML = `<td colspan="5">&nbsp;</td>`;

  // Row 5: Quantity / Size / Colour controls
  let row5 = tbody.insertRow();
  row5.innerHTML = `
      <td style="width:100px; border-bottom: 1px solid #ddd; border: 1px, solid, black;" class="productSize">Size:</td>
      <td colspan="1"style=" width:100px;">&nbsp;</td>
      <td style="width:50px; border-bottom: 1px solid #ddd; border: 1px, solid, black;" class="productSize">Size 1</td>
      <td style="width:50px; border-bottom: 1px solid #ddd; border: 1px, solid, black;" class="productSize">Size 2</td>
      <td style="width:50px; border-bottom: 1px solid #ddd; border: 1px, solid, black;" class="productSize">Size 3</td>
  `;

  tbody.insertRow().innerHTML = `<td colspan="5"style="">&nbsp;</td>`;

  tbody.insertRow().innerHTML = `
    <td style="width:100px; border-bottom: 1px solid #ddd; border: 1px, solid, black;" class="productPrice">Price: </td>
    <td colspan="1"style=" width:100px;">&nbsp;</td>
    <td colspan="3" style="width:50px; border-bottom: 1px solid #ddd; border: 1px, solid, black;" class="productPriceValue">£${item.price}</td>
`;

tbody.insertRow().innerHTML = `<td colspan="5">&nbsp;</td>`;

  let row8 = tbody.insertRow();
  row8.innerHTML = `
      <td colspan="9" style="border-bottom: 1px solid #ddd; border: 1px, solid, black;" class="productName">Add to basket</td>
  `;

  tbody.insertRow().innerHTML = `<td colspan="5">&nbsp;</td>`;

    tbody.insertRow().innerHTML = `<td colspan="5"style=" border: 1px, solid, black;">Checkout</td>`;

  table.appendChild(tbody);
  newDiv.appendChild(table);

  // ⬇️ Append into product details instead of basket
  document.querySelector(".productDetails").appendChild(newDiv);
}
    console.log("Item in displayResults:", item1);
displayResults(item1);
})
.catch(error => console.error('Error loading JSON:', error))
;