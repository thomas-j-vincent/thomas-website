import { products } from "./products.js";
import {get, set, enableTouchHover, loadFromStorage, updateBasketMessage, newReleases, exploreByCategory, split, exploreProducts, formatImage, removeAllItems, formatCollectionImage} from "./functions.js";

updateBasketMessage();
enableTouchHover();
loadFromStorage();

let query = "men";

    newReleases(query, "header");

query = "women";

exploreByCategory(query);

query = "children";

    newReleases(query, "carousel", 1);

query = "men";

    split(query);

query = "women";

    exploreProducts(query);