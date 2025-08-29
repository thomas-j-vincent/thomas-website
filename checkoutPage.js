import { products } from "./products.js";
import { get, set, updateBasketMessage, addProduct, formatPrice, enableTouchHover } from "./functions.js";

updateBasketMessage();
enableTouchHover();

console.log(get("basketProducts"));