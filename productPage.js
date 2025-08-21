console.log("productPage.js loaded");

fetch("products.json")
  .then(res => res.json())
  .then(products => {
    // Get product name from URL (?item=...)
    const itemName = new URLSearchParams(window.location.search).get("q");
    console.log("URL itemName:", itemName);

    // Find product in JSON
    const selectedProduct = products.find(p => p.name === itemName);

    if (!selectedProduct) {
      console.error("No product found with name:", itemName);
      document.querySelector(".productDetails").textContent = "Product not found.";
      return;
    }

    console.log("Selected product:", selectedProduct);

    // Build table
    function displayResults(item) {
      console.log("Displaying item:", item);

      const newDiv = document.createElement("div");
      newDiv.classList.add("product-container");

      const table = document.createElement("table");
      table.classList.add("basket-table");
      table.border = "0";
      table.cellSpacing = "0";
      table.cellPadding = "5";

      const tbody = document.createElement("tbody");

      // Row 1: Product Name
      let row1 = tbody.insertRow();
      row1.innerHTML = `
        <td colspan="9" style="border-bottom: 1px solid #ddd; border: 1px solid black;" class="productName">
          ${item.name}
        </td>
      `;

      // Spacer Row
      tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

      // Row 2: Colours
let row2 = tbody.insertRow();

let colourLabel = row2.insertCell();
colourLabel.textContent = "Colour:";
colourLabel.style.width = "100px";
colourLabel.style.border = "1px solid black";

      let i = 0;
    if (item.colour.length > 1) {
      let colourSpace = row2.insertCell();
      colourSpace.textContent = ""
      colourSpace.style.width = (100/item.colour.length)+ "%";

      const extraColours = item.colour.length - 1; // subtract the default first colour
      for (let i = 0; 1 < extraColours; i++) {
        //i++;
        const colourIndex = i + 1;
        const cellWidth = 100/item.colour.length;
        console.log("Cell width:", cellWidth);
        let colourCell = row2.insertCell();
        colourCell.textContent = item.colour[colourIndex];
        colourCell.classList.add("productColour");
        colourCell.style.width = cellWidth + "%";
        colourCell.style.border = "1px solid black";

        const thisColour = item.colour[colourIndex];
        colourCell.addEventListener("click", () => {
          console.log("User selected colour:", thisColour);
          row2.querySelectorAll(".productColour").forEach(c => c.style.background = "");
          colourCell.style.background = "lightblue";
        });
        i++;
      };
    }
    else {  

      let colourSpace = row2.insertCell();
      colourSpace.textContent = ""
      colourSpace.style.width = "50%";

      let colourCell = row2.insertCell();
      colourCell.textContent = item.colour[0]; // safer than item.colour
      colourCell.classList.add("productColour");
      colourCell.style.width = "120px"; // fixed width
      colourCell.style.border = "1px solid black";

      colourCell.addEventListener("click", () => {
        console.log("User selected colour:", item.colour[0]);
        row2.querySelectorAll(".productColour").forEach(c => c.style.background = "");
        colourCell.style.background = "lightblue";
       });
      };
      // Spacer Row
      tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

      // Row 3: Sizes
let row3 = tbody.insertRow();

let sizeLabel = row3.insertCell();
sizeLabel.textContent = "Colour:";
sizeLabel.style.width = "100px";
sizeLabel.style.border = "1px solid black";

      let ii = 0;
    if (item.size.length > 1) {
      let sizeSpace = row3.insertCell();
      sizeSpace.textContent = ""
      sizeSpace.style.width = (100/item.size.length) + "%";
      console.log(item.size || []);
      const extraSizes = Math.max(item.size.length - 1, 0); // subtract the default first colour
      console.log(extraSizes);
      while (ii < extraSizes) {
        //ii++;
        const sizeIndex = ii + 1;
        const cellWidth = Math.max(100/item.size.length);
        console.log("Cell width:", cellWidth);
        let sizeCell = row3.insertCell();
        sizeCell.textContent = item.size[sizeIndex];
        sizeCell.classList.add("productSize");
        sizeCell.style.width = cellWidth + "%";
        sizeCell.style.border = "1px solid black";

        const thisSize = item.size[sizeIndex];
        sizeCell.addEventListener("click", () => {
          console.log("User selected colour:", thisSize);
          row3.querySelectorAll(".productSize").forEach(c => c.style.background = "");
          sizeCell.style.background = "lightblue";
        });
        ii++;
      };
    }
    else {  

      let sizeSpace = row3.insertCell();
      sizeSpace.textContent = ""
      sizeSpace.style.width = "50%";

      let sizeCell = row3.insertCell();
      sizeCell.textContent = item.size[0]; // safer than item.size
      sizeCell.classList.add("productSize");
      sizeCell.style.width = "120px"; // fixed width
      sizeCell.style.border = "1px solid black";

      sizeCell.addEventListener("click", () => {
        console.log("User selected colour:", item.size[0]);
        row3.querySelectorAll(".productSize").forEach(c => c.style.background = "");
        sizeCell.style.background = "lightblue";
       });
      };
      // Spacer Row
      tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

      // Row 4: Price
      tbody.insertRow().innerHTML = `
        <td style="width:100px; border: 1px solid black;" class="productPrice">Price:</td>
        <td colspan="8" style="border: 1px solid black;" class="productPriceValue">£${item.price}</td>
      `;

      // Spacer Row
      tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

      // Row 5: Add to Basket
      let row5 = tbody.insertRow();
      row5.innerHTML = `
        <td colspan="9" style="border: 1px solid black; text-align:center; cursor:pointer;" class="addToBasket">
          Add to Basket
        </td>
      `;
      row5.addEventListener("click", () => {
        console.log("Added to basket:", item.name);
      });

      // Spacer Row
      tbody.insertRow().innerHTML = `<td style="height: 50px;" colspan="9">&nbsp;</td>`;

      // Row 6: Checkout
      tbody.insertRow().innerHTML = `
        <td colspan="9" style="border: 1px solid black; text-align:center; cursor:pointer;">
          Checkout
        </td>
      `;

      table.appendChild(tbody);
      newDiv.appendChild(table);

      // Attach to productDetails
      document.querySelector(".productDetails").appendChild(newDiv);
    }

    // Finally display
    displayResults(selectedProduct);

  })
  .catch(error => console.error("Error loading JSON:", error));
