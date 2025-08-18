  fetch("products.json")
    .then(res => res.json())
    .then(products => {
const urlParams = new URLSearchParams(window.location.search);
    const item = urlParams.get("item");

  let item1 = products[0];
  console.log(item1);

  let item2 = products[1];
  console.log(item2);

function displayResults(item) {
 const detailsDiv = document.querySelector(".productLayout");
      detailsDiv.innerHTML = "hello";
      console.log("hello");
    }

displayResults(item1);
})
.catch(error => console.error('Error loading JSON:', error))
;