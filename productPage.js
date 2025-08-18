  fetch("products.json")
    .then(res => res.json())
    .then(products => {
const urlParams = new URLSearchParams(window.location.search);
    const item = urlParams.get("item");

    // Example: show different info based on item
    if (item) {
      document.getElementById("productTitle").textContent = item;

      if (item === "Sofa") {
        document.getElementById("productInfo").textContent = "This is a comfy sofa with 3 seats.";
      } else if (item === "Table") {
        document.getElementById("productInfo").textContent = "A sturdy oak dining table.";
      } else {
        document.getElementById("productInfo").textContent = "No details available for this product.";
      }
    }
        })
.catch(error => console.error('Error loading JSON:', error))
;