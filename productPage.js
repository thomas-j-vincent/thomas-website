import { products } from "./products.js";
import { get, set, displayResults2 } from "./functions.js";
    // Get product name from URL (?item=...)
    const itemName = new URLSearchParams(window.location.search).get("q");
    console.log("URL itemName:", itemName);

    // Find product in JSON
    const selectedProduct = products.find(p => p.name === itemName);

    if (!selectedProduct) {
      console.error("No product found with name:", itemName);
      document.querySelector(".productDetails").textContent = "Product not found.";
    //  return;
    }

    console.log("Selected product:", selectedProduct);


    // Finally display
    displayResults2(selectedProduct);


  
