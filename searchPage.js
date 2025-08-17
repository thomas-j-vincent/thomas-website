const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get("q");



if (query) {
  console.log("Search page query:", query);
  document.getElementById("searchQuery").textContent = query;

  // Fetch products again (same JSON file)
  fetch("products.json")
    .then(res => res.json())
    .then(products => {

const { addProduct } = require('./myScript.js');

  let item1 = products[0];
  console.log(item1.name);

  let item2 = products[1];
  console.log(item2.name);

      // Filter by query
      const results = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.productType.toLowerCase().includes(query.toLowerCase()) ||
        product.colour.some(c => c.toLowerCase().includes(query.toLowerCase()))
      );

      // Show results
      const resultsContainer = document.getElementById("results");
      resultsContainer.innerHTML = "";
      if (results.length > 0) {
        results.forEach(product => {
          const div = document.createElement("div");
          div.textContent = `${product(item)}`;
          resultsContainer.appendChild(div);
        });
      } else {
        resultsContainer.textContent = "No results found.";
      }
    });
}
