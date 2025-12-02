import { products } from "./products.js";
import {get, set, enableTouchHover, loadFromStorage, updateBasketMessage, newReleases, exploreByCategory, scrollCarousel, split, exploreProducts, formatImage, removeAllItems, formatCollectionImage} from "./functions.js";

updateBasketMessage();
enableTouchHover();
loadFromStorage();

let query = "men";

    newReleases(query, "header", 0);

query = "women";

    exploreByCategory(query);

query = "children"; // SAME LINE doesn't work because there are no child products yet END

    newReleases(query, "carousel", 1, 1);
    scrollCarousel("carousel");

query = "men";

    split(query);

query = "women";

    exploreProducts(query);