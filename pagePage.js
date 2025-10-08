import { products } from "./products.js";
import { get, set, enableTouchHover, loadFromStorage, updateBasketMessage, universalDisplay, removeAllItems, formatCollectionImage} from "./functions.js";

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("q");

updateBasketMessage();
enableTouchHover();
loadFromStorage();

function newReleases(query) {
    const header = document.querySelector(".header");
    const newDiv = document.createElement("div");
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    let row1 = tbody.insertRow(); 
    row1.innerHTML = `
        <td class="itemImg"> 
        <img src="${formatCollectionImage(query, 0, 1)}" 
            alt="${query}" width="128" height="128">
        </td>
    `;
    table.appendChild(tbody);
    newDiv.appendChild(table);
    header.style.background = "green";
    header.innerHTML= "";
    header.append(newDiv);
}
function mayAlsoLike(item) {
  const compare = item.productType[0];
  let results = products.filter(product => product.productType.includes(compare));
  results = results.filter(product => product.name !== item.name);

  const itemWidth = 200; // px per card
  const gap = 20;        // px between cards
  const screenWidth = window.innerWidth;

  const itemsPerRow = Math.floor(screenWidth / (itemWidth + gap));  // SAME LINE how many fit fully on screen END
  const visibleWidth = itemsPerRow * (itemWidth + gap);

  const table = document.createElement("table");     // SAME LINE Table for header + carousel row ENDs
  const tbody = document.createElement("tbody");

  // Header
  const headerRow = tbody.insertRow();
  const headerCell = headerRow.insertCell();
  headerCell.textContent = "May Also Like";
  headerCell.colSpan = 3;
  headerCell.style.fontWeight = "bold";
  headerCell.style.padding = "10px";

  // Carousel row
  const row = tbody.insertRow();

  // Left arrow
  const leftCell = row.insertCell();
  const leftBtn = document.createElement("button");
  leftBtn.textContent = "‹";
  leftBtn.style.padding = "41px";
  leftBtn.disabled = true;
  leftCell.appendChild(leftBtn);

  // Flex wrapper
  const flexCell = row.insertCell();
  const wrapper = document.createElement("div");
  wrapper.style.gap = gap + "px";
  wrapper.style.width = visibleWidth + "px"; // fill screen width exactly
  wrapper.classList.add("no-scrollbar");
  flexCell.appendChild(wrapper);

  // Right arrow
  const rightCell = row.insertCell();
  const rightBtn = document.createElement("button");
  rightBtn.textContent = "›";
  rightCell.appendChild(rightBtn);

  // Render ALL results
  results.forEach(result => {
    const newDiv = document.createElement("div");
    newDiv.classList.add("completeLook");
    newDiv.style.width = itemWidth + "px";
    newDiv.style.flexShrink = "0";

    newDiv.addEventListener("click", () => {
      window.location.href = `product.html?q=${encodeURIComponent(result.name)}&source=mayAlsoLike`;
    });

    const productTable = universalDisplay(result);
    productTable.style.width = "100%";
    newDiv.appendChild(productTable);

    wrapper.appendChild(newDiv);
  });

  table.appendChild(tbody);
  document.getElementById("mayLike").appendChild(table);

  // Arrow scroll logic
  const scrollAmount = itemWidth + gap;
  leftBtn.addEventListener("click", () => {
    wrapper.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  });
  rightBtn.addEventListener("click", () => {
    wrapper.scrollBy({ left: scrollAmount, behavior: "smooth" });
  });

  function updateArrows() {
    const maxScrollLeft = wrapper.scrollWidth - wrapper.clientWidth;
    leftBtn.disabled = wrapper.scrollLeft <= 0;
    rightBtn.disabled = wrapper.scrollLeft >= maxScrollLeft - 1;
  }

  wrapper.addEventListener("scroll", updateArrows);
  updateArrows();

  // Adjust on resize
  window.addEventListener("resize", () => {
    const newItemsPerRow = Math.floor(window.innerWidth / (itemWidth + gap));
    wrapper.style.width = (newItemsPerRow * (itemWidth + gap)) + "px";
    updateArrows();
  });
}

if (query === "Men"){
    console.log ("wow!");
    newReleases(query);
} else if (query === "Women") {
    console.log ("Women!");
    newReleases(query);
} else if (query === "Children") {
    console.log ("Kids these days!");
    newReleases(query);
} else {
    console.log ("error");
    newReleases(query);
}