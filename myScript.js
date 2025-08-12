let itemsInBasket = 0;

updateBasketMessage();

function updateBasketMessage() {
    if (itemsInBasket === 0) {
        document.getElementById("warning").innerHTML = "You have no items in your basket!";
        document.getElementById("checkout").style.display = "none";
    } else {
        document.getElementById("warning").innerHTML = "You have " + itemsInBasket+" item"+(itemsInBasket>1?"s":"")+" in your basket.";
        document.getElementById("checkout").style.display = "block";
    }
}
document.getElementById("addItemBtn").addEventListener("click", function() {
    // Create wrapper for the product
    const newDiv = document.createElement("div");
    newDiv.classList.add("product-container");

    // Create table (no duplicate IDs!)
    const table = document.createElement("table");
    table.classList.add("basket-table");
    table.border = "0";
    table.cellSpacing = "0";
    table.cellPadding = "5";

    const tbody = document.createElement("tbody");

    // Row 1: Image + Name
    let row1 = tbody.insertRow();
    row1.innerHTML = `
        <td colspan="4" rowspan="4">Img</td>
        <td colspan="6" style="border-bottom: 1px solid #ddd;">Name</td>
    `;

    // Row 2: Empty space
    let row2 = tbody.insertRow();
    row2.innerHTML = `<td colspan="3">&nbsp;</td>`;

    // Row 3: Price
    let row3 = tbody.insertRow();
    row3.innerHTML = `<td colspan="6" style="width:150px; border-bottom: 1px solid #ddd;">Price</td>`;

    // Row 4: Empty space
    let row4 = tbody.insertRow();
    row4.innerHTML = `<td colspan="3">&nbsp;</td>`;

    // Row 5: Quantity / Size / Colour controls
    let row5 = tbody.insertRow();
    row5.innerHTML = `
        <td style="width:25px; border: 1px solid; text-align: center;" class="plus-btn"><i class="fa-solid fa-plus"></i></td>
        <td style="width:50px; text-align: center;" colspan="2" class="qty-cell">1</td>
        <td style="width:25px; border: 1px solid; text-align: center;"class="minus-btn"><i class="fa-solid fa-minus"></i></td>
        <td style="width:75px; border-bottom: 1px solid #ddd;" colspan="3">Size</td>
        <td style="width:25px; text-align: center;"><i class="fa-solid fa-grip-lines-vertical"></i></td>
        <td style="width:50px; border-bottom: 1px solid #ddd;" colspan="2">Colour</td>
    `;

    // Put it all together
    table.appendChild(tbody);
    newDiv.appendChild(table);
    document.getElementById("container").appendChild(newDiv);

  const qtyCell = newDiv.querySelector(".qty-cell");
  const plusBtn = newDiv.querySelector(".plus-btn");
  const minusBtn = newDiv.querySelector(".minus-btn");

  let quantity = 1;

    plusBtn.addEventListener("click", () => {
    quantity++;
    qtyCell.textContent = quantity;
  });

  minusBtn.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      qtyCell.textContent = quantity;
    }
  });

    // Update counter
    itemsInBasket++;
    updateBasketMessage();
});
document.getElementById("removeItemBtn").addEventListener("click", function() {
    const container = document.getElementById("container");

    // Only try to remove if there's something in the basket
    if (itemsInBasket > 0 && container.lastElementChild) {
        container.removeChild(container.lastElementChild);
        itemsInBasket--; // decrease counter
        updateBasketMessage();
    }
});

