import { products } from "./products.js";
import { get, set, updateBasketMessage, addProduct, formatPrice, enableTouchHover, loadFromStorage, universalDisplay} from "./functions.js";

updateBasketMessage();
enableTouchHover();
loadFromStorage();

  const basketProducts = get("basketProducts") || [];
 basketProducts.forEach(({ item }) => { //SAME LINE takes basket products and converts to item END
    console.log(item.name);
    let resultTable = document.getElementById("results")
    let table = universalDisplay(item);
    resultTable.appendChild(table);
 });