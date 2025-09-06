import { products } from "./products.js";
import { get, set, updateBasketMessage, addProduct, formatPrice, enableTouchHover, loadFromStorage} from "./functions.js";

updateBasketMessage();
enableTouchHover();
loadFromStorage();

console.log(get("basketProducts"));