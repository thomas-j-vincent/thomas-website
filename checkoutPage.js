import { products } from "./products.js";
import { get, set, updateBasketMessage, addProduct, formatPrice, enableTouchHover, loadFromStorage} from "./functions.js";

updateBasketMessage();
enableTouchHover();
loadFromStorage();

window.addEventListener("DOMContentLoaded", () => {
  const basketProducts = get("basketProducts") || [];
  basketProducts.forEach(({ item }) => {
    // Rebuild DOM from item data
    addProduct(item, true);
  });
  updateBasketMessage();
});

console.log(get("basketProducts"));