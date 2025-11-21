import { products } from "./products.js";
import { get, set, enableTouchHover, loadFromStorage, updateBasketMessage, newReleases, exploreByCategory, split, exploreProducts, formatImage, removeAllItems, formatCollectionImage} from "./functions.js";

const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("q");
console.log(query);

updateBasketMessage();
enableTouchHover();
loadFromStorage();

newReleases(query, "header");
exploreByCategory(query);
newReleases(query, "carousel", 1);
split(query);
exploreProducts(query);

/*  allows us to change what the website does depending on the button clicked 
if (query === "Men"){
    console.log ("wow!");
    newReleases(query, "header");
    exploreByCategory(query);
    newReleases(query, "carousel", 1);
    split(query);
    exploreProducts(query);
} else if (query === "Women") {
    console.log ("Women!");
    newReleases(query, "header");
    exploreByCategory(query);
    newReleases(query, "carousel", 1);
    split(query);
    exploreProducts(query);
} else if (query === "Children") {
    console.log ("Kids these days!");
    newReleases(query, "header");
    exploreByCategory(query);
    newReleases(query, "carousel", 1);
    split(query);
    exploreProducts(query);
} else {
    console.log ("error");
    newReleases(query, "header");
    exploreByCategory(query);
    newReleases(query, "carousel", 1);
    split(query);
    exploreProducts(query);
}
*/