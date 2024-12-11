import { useState, useEffect } from "react"
import "./App.css"

function FilterableProductTable() {

  const [filterText, setFilterText] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://172.18.2.165:3000/list")
        .then(response => response.json())
        .then(data => setProducts(data))
        .catch(error => console.error("Error fetching data: ", error));
    };

    fetchData();  // Esegui immediatamente la prima volta

    const intervalId = setInterval(fetchData, 5000);  // Aggiorna i dati ogni 5 secondi

    return () => clearInterval(intervalId);  // Pulizia: rimuove l'intervallo quando il componente viene smontato
  }, []);  // array vuoto = questo effetto non ha dipendenze e viene eseguito solo al montaggio

  return (
    <div className="filterable-product-table">
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
    </div>
  );
}

function SearchBar({ filterText, inStockOnly, onFilterTextChange, onInStockOnlyChange }) {
  return (
    <>
      <div className="search-bar">
        <input
          type="text"
          id="search"
          placeholder="Search..."
          value={filterText}
          onChange={(e) => onFilterTextChange(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            id="instock"
            checked={inStockOnly}
            onChange={(e) => onInStockOnlyChange(e.target.checked)}
          />
          Only show products in stock
        </label>
      </div>
    </>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {

  let rows = [];

  if (inStockOnly) {
    products = products.filter(p => p.stocked === true); // tieni solo prodotti in stock
  }

  if (filterText !== "") {
    products = products.filter(p => p.name.toLowerCase().includes(filterText.toLowerCase())); // tieni solo prodotti che contengono filterText
  }

  let fruits = products.filter(p => p.category === "Fruits"); // vettore con solo frutta
  let vegetables = products.filter(p => p.category === "Vegetables"); // vettore con solo verdura

  rows.push(<ProductCategoryRow category={"Fruits"} />); // metti l'header frutta
  fruits.forEach(p => rows.push(<ProductRow productName={p.name} price={p.price} stocked={p.stocked} />)); // metti ogni frutto

  rows.push(<ProductCategoryRow category={"Vegetables"} />); // metti l'header verdura
  vegetables.forEach(p => rows.push(<ProductRow productName={p.name} price={p.price} stocked={p.stocked} />)); // metti ogni verdura

  return (
    <div className="product-table">
      <div className="product-table-header">
        <span className="name-header">Name</span>
        <span className="price-header">Price</span>
      </div>
      {rows}
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <div className="product-category-row">
      {category}
    </div>
  );
}

function ProductRow({ productName, price, stocked }) {

  if (stocked === false) {
    productName = <span className="out-of-stock">{productName}</span>
  }

  return (
    <>
      <div className="product-row">
        <span className="name">{productName}</span>
        <span className="price">{price}</span>
      </div>
    </>
  );
}

export default FilterableProductTable