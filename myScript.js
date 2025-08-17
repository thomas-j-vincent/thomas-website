let itemsInBasket = 0;
let basketProducts = [];
let products = {};

fetch('products.json')
  .then(response => response.json())
  .then(products => {
// const item1 = {name:"Elle mugshot", image:"./images/Elle.JPEG", price:7.00, colour:"one colour", size:"one size"};
//const item2 = {name:"Monil mugshot", image:"./images/Monil.JPEG", price: 6.00, colour:"one colour", size:"one size"};

updateBasketMessage();
console.log(basketProducts);

const myDiv = document.getElementsByClassName('search-box')[0];

myDiv.addEventListener('click', () => {
    console.log('Div was clicked!');
});

myDiv.addEventListener('mouseenter', () => {
    console.log('search was entered');
});

myDiv.addEventListener('mouseleave', () => {
    console.log('mouseleaved?');
});

const searchInput = document.querySelector('.search-box input');

// listen for typing
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase(); // get typed text
  console.log("User typed:", query);

  // filter products (assuming products[] is already loaded with JSON)
  const results = products.filter(product => 
    product.name.toLowerCase().includes(query) ||
    product.productType.toLowerCase().includes(query) ||
    product.colour.some(c => c.toLowerCase().includes(query)) // check colours too
  );  
  // optional: display results live
  const resultsContainer = document.getElementById("results");
  if (resultsContainer) {
    resultsContainer.innerHTML = "";
    results.forEach(product => {
      const div = document.createElement("div");
      div.textContent = `${product.name} - £${product.price}`;
      resultsContainer.appendChild(div);
    });
  }
});

// Pressing Enter
searchInput.addEventListener('keydown', (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const query = searchInput.value.trim();

    if (query !== "") {
      console.log("Redirecting with query:", query);
      
      // ✅ only update if element exists
      const display = document.getElementById("searchInputDisplay");
      if (display) {
        display.innerHTML = query;
      }

      // redirect
      window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
  }
});



  let item1 = products[0];
  console.log(item1.name);

  let item2 = products[1];
  console.log(item2.name);


// function to add 1 or remove 1 to the basket counter
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
// Function to add an item to the basket (numerical)
function addToBasket(item) {
    basketProducts.push({item: item});
    console.log("Basket now contains:", basketProducts);
}

document.getElementById("addItem1Btn").addEventListener("click", function() {
addProduct(item1);
});
document.getElementById("addItem2Btn").addEventListener("click", function() {
addProduct(item2);
});
document.getElementById("removeItem1Btn").addEventListener("click", function() {
removeProduct(item1);
});
document.getElementById("removeItem2Btn").addEventListener("click", function() {
removeProduct(item2);
});
// Function to put a product in the basket (with the table structure)
 function addProduct(item) {

        if (!item.selectedColour) {
        item.selectedColour = item.colour[0];
    }
    if (!item.selectedSize) {
        item.selectedSize = item.size[0];
    }

    const index = basketProducts.findIndex (obj => 
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
    document.getElementById("container").appendChild(newDiv);

    // Add to basket array
    basketProducts.push({ item: item });

    // Plus button
newDiv.querySelector(".plus-btn").addEventListener("click", () => {
    let qtyCell = newDiv.querySelector(".qty-cell");
    let quantity = parseInt(qtyCell.textContent, 10); //  read from DOM
    quantity++;
    itemsInBasket++;
    let totalPrice = item.price * quantity;
    qtyCell.textContent = quantity;
    newDiv.querySelector(".itemPrice").textContent = formatPrice(totalPrice)
    updateBasketMessage();
});

// Minus button
newDiv.querySelector(".minus-btn").addEventListener("click", () => {
    let qtyCell = newDiv.querySelector(".qty-cell");
    let quantity = parseInt(qtyCell.textContent, 10); //  read from DOM
    if (quantity > 1) {
        quantity--;
        itemsInBasket--;
        let totalPrice = item.price * quantity;
        qtyCell.textContent = quantity;
        newDiv.querySelector(".itemPrice").textContent = formatPrice(totalPrice)
        updateBasketMessage();
    }
});


    document.getElementById("container").appendChild(newDiv);

    // ✅ Push with colour and size included
    basketProducts.push({
        item: item,
    //    colour: item.selectedColour,
    //    size: item.selectedSize,
        element: newDiv
    });

    // Update count & message
    itemsInBasket++;
    updateBasketMessage();


}

//Function to remove a product from the basket by name
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
Module.exports = {addProduct };
});
//.catch(error => console.error('Error loading JSON:', error))
//;
