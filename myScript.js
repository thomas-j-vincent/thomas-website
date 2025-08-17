let itemsInBasket = 0;
let basketProducts = [];
let products = {};

export function addProduct(item) {
    if (!item.selectedColour) {
        item.selectedColour = item.colour[0];
    }
    if (!item.selectedSize) {
        item.selectedSize = item.size[0];
    }

    const index = basketProducts.findIndex(obj =>
        obj.item.name === item.name &&
        obj.item.selectedColour === item.selectedColour &&
        obj.item.selectedSize === item.selectedSize
    );

    if (index > -1) {
        const container = document.querySelectorAll('.product-container')[index];
        const qtyCell = container.querySelector('.qty-cell');
        const priceCell = container.querySelector('.itemPrice');

        let quantity = parseInt(qtyCell.textContent, 10) + 1;
        qtyCell.textContent = quantity;
        priceCell.textContent = formatPrice(item.price * quantity);
        itemsInBasket++;
        updateBasketMessage();
        return;
    }

    let quantity = 1;
    let totalPrice = item.price;

    const newDiv = document.createElement("div");
    newDiv.classList.add("product-container");

    const table = document.createElement("table");
    table.classList.add("basket-table");

    const tbody = document.createElement("tbody");

    tbody.insertRow().innerHTML = `
        <td colspan="4" rowspan="4" class="itemImg">
            <img src="${item.image}" alt="${item.name}" width="128" height="128">
        </td>
        <td rowspan="7" style="width:50px;">&nbsp;</td>
        <td colspan="6" style="border-bottom: 1px solid #ddd;" class="itemName"> ${item.name}</td>
    `;

    tbody.insertRow().innerHTML = `<td colspan="3">&nbsp;</td>`;

    tbody.insertRow().innerHTML = `
        <td colspan="6" class="itemPrice"> ${formatPrice(totalPrice)} </td>
    `;

    tbody.insertRow().innerHTML = `<td colspan="3">&nbsp;</td>`;

    let row5 = tbody.insertRow();
    row5.innerHTML = `
        <td class="plus-btn"><i class="fa-solid fa-plus"></i></td>
        <td colspan="2" class="qty-cell">${quantity}</td>
        <td class="minus-btn"><i class="fa-solid fa-minus"></i></td>
        <td colspan="3" class="itemSize">${item.selectedSize}</td>
        <td><i class="fa-solid fa-grip-lines-vertical"></i></td>
        <td colspan="2" class="itemColour">${item.selectedColour}</td>
    `;

    table.appendChild(tbody);
    newDiv.appendChild(table);
    document.getElementById("container").appendChild(newDiv);

    basketProducts.push({ item: item, element: newDiv });

    // plus button
    newDiv.querySelector(".plus-btn").addEventListener("click", () => {
        let qtyCell = newDiv.querySelector(".qty-cell");
        let quantity = parseInt(qtyCell.textContent, 10);
        quantity++;
        itemsInBasket++;
        let totalPrice = item.price * quantity;
        qtyCell.textContent = quantity;
        newDiv.querySelector(".itemPrice").textContent = formatPrice(totalPrice)
        updateBasketMessage();
    });

    // minus button
    newDiv.querySelector(".minus-btn").addEventListener("click", () => {
        let qtyCell = newDiv.querySelector(".qty-cell");
        let quantity = parseInt(qtyCell.textContent, 10);
        if (quantity > 1) {
            quantity--;
            itemsInBasket--;
            let totalPrice = item.price * quantity;
            qtyCell.textContent = quantity;
            newDiv.querySelector(".itemPrice").textContent = formatPrice(totalPrice)
            updateBasketMessage();
        }
    });

    itemsInBasket++;
    updateBasketMessage();
}

function updateBasketMessage() {
    if (itemsInBasket === 0) {
        document.getElementById("warning").style.visibility = 'visible';
        document.getElementById("warning").innerHTML = "You have no items in your basket!";
        document.getElementById("checkout").style.display = "none";
    } else {
        document.getElementById("warning").style.visibility = 'hidden';
        //document.getElementById("warning").innerHTML = "You have " + itemsInBasket+" item"+(itemsInBasket>1?"s":"")+" in your basket.";
        document.getElementById("checkout").style.display = "block";
    }
}

function formatPrice(amount) {
    return `£ ${amount.toFixed(2)}`;
}

function removeProduct(item) {
    // Remove all from basket array
    basketProducts = basketProducts.filter(obj => 
        !(obj.item.name === item.name &&
          obj.item.selectedColour === item.selectedColour &&
          obj.item.selectedSize === item.selectedSize)
    );

    // Remove all matching DOM containers
    const containers = document.querySelectorAll('.product-container');
    containers.forEach(container => {
        const nameCell = container.querySelector('.itemName');
        if (nameCell && nameCell.textContent.trim() === item.name) {
            container.remove();
        }
    });

    // Reset basket count (sum of all qtys left in DOM)
    let totalQty = 0;
    document.querySelectorAll('.qty-cell').forEach(cell => {
        totalQty += parseInt(cell.textContent, 10);
    });
    itemsInBasket = totalQty;

    updateBasketMessage();
    console.log(`Removed all ${item.name} from basket`);
    console.log(basketProducts);
}

fetch('products.json')
  .then(response => response.json())
  .then(data =>  {

      products = data;

      let item1 = products[0];
      let item2 = products[1];

      document.getElementById("addItem1Btn").addEventListener("click", () => addProduct(item1));
      document.getElementById("addItem2Btn").addEventListener("click", () => addProduct(item2));
      document.getElementById("removeItem1Btn").addEventListener("click", () => removeProduct(item1));
      document.getElementById("removeItem2Btn").addEventListener("click", () => removeProduct(item2));

      // … your search bar setup here too …
  })
  .catch(error => console.error('Error loading JSON:', error));