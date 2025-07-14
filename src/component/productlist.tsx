import { useEffect, useState } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import { useCart } from "../component/CartContext";
import "./productlist.css";

interface ProductListProps {
  searchQuery: string;
}

interface Product {
  _id: string;
  Brand: string;
  Model: string;
  "Selling Price": number;
  "Original Price": number;
  Color: string;
  Memory: string;
  Storage: string;
  Rating: number;
  image?: string; // Optional, if available 
}

const BRANDS = ["Apple", "Samsung", "Realme", "Xiaomi"];

const PRICE_RANGES = [
  { label: "Below ₹10,000", min: 0, max: 10000 },
  { label: "₹10,000 - ₹20,000", min: 10000, max: 20000 },
  { label: "₹20,000 - ₹40,000", min: 20000, max: 40000 },
  { label: "Above ₹40,000", min: 40000, max: Infinity },
];
const STORAGES = ["32GB", "64GB", "128GB", "256GB"];
const RAMS = ["2GB", "4GB", "6GB", "8GB"];

const ProductList = ({ searchQuery }: ProductListProps) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(-1);
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedRam, setSelectedRam] = useState("");

  const [isFilterOpen, setIsFilterOpen] = useState(window.innerWidth >= 900);
  const [sortBy, setSortBy] = useState<string>("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const brandFromQuery = params.get("brand")
  useEffect(() => {
    const handleResize = () => setIsFilterOpen(window.innerWidth >= 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
  if(brandFromQuery) {
    setSelectedBrand(brandFromQuery);
    }
}, [brandFromQuery]);  // Fetch products based on brand from URL params
 
// Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line
  }, [searchQuery, selectedBrand, selectedPrice, selectedStorage, selectedRam]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const params = new URLSearchParams();
      if (searchQuery) params.append("keyword", searchQuery);
      if (selectedBrand) params.append("brand", selectedBrand);
      if (selectedStorage) params.append("storage", selectedStorage);
      if (selectedRam) params.append("memory", selectedRam);
      params.append("page", String(page));
      params.append("limit", "20");

      try {
        const res = await fetch(`/api/search?${params.toString()}`);
        const data = await res.json();
        let filtered = data.products;

        filtered = filtered.filter((p: Product) => {
          const priceMatch =
            selectedPrice === -1 ||
            (p["Selling Price"] >= PRICE_RANGES[selectedPrice]?.min &&
              p["Selling Price"] < PRICE_RANGES[selectedPrice]?.max);
          const storageMatch =
            !selectedStorage || p.Storage === selectedStorage;
          const ramMatch = !selectedRam || p.Memory === selectedRam;
          return priceMatch && storageMatch && ramMatch;
        });

        // Sorting logic
        if (sortBy === "price") {
          filtered = filtered.sort((a: { [x: string]: number; }, b: { [x: string]: number; }) =>
            order === "asc"
              ? a["Selling Price"] - b["Selling Price"]
              : b["Selling Price"] - a["Selling Price"]
          );
        } else if (sortBy === "rating") {
          filtered = filtered.sort((a: { Rating: number; }, b: { Rating: number; }) =>
            order === "asc"
              ? a.Rating - b.Rating
              : b.Rating - a.Rating
          );
        }

        setProducts(filtered);
        setTotal(data.total);
      } catch (err) {
        console.error("Error loading products:", err);
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedBrand, selectedPrice, selectedStorage, selectedRam, page, sortBy, order]);

  return (<>
    <div className="sort sort-flex-gap">
          <label>
            Sort:
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="">None</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
            </select>
          </label>
          <label>
            Order:
            <select value={order} onChange={e => setOrder(e.target.value as "asc" | "desc") }>
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </label>
        </div>
    <div className="productlist-wrapper productlist-flex">
      <div className="productlist-filter-btns">
        <button
          className="filter-toggle-btn"
          onClick={() => setIsFilterOpen(prev => !prev)}
        >
          {isFilterOpen ? "Filters" : "Filters"}
        </button>
      </div>

      {isFilterOpen && (
        <aside className="filter-panel filter-panel-custom">
          <h4>Filter By</h4>

          <div>
            <strong>Brand</strong>
            {BRANDS.map((brand) => (
              <label key={brand}>
                <input
                  type="radio"
                  name="brand"
                  checked={selectedBrand === brand}
                  onChange={() => {
                    setSelectedBrand(brand);
                    setPage(1);
                  }}
                />
                {brand}
              </label>
            ))}
            <label>
              <input
                type="radio"
                name="brand"
                checked={selectedBrand === ""}
                onChange={() => {
                  setSelectedBrand("");
                  setPage(1);
                }}
              />
              All
            </label>
          </div>

          <div className="filter-margin-top">
            <strong>Price</strong>
            {PRICE_RANGES.map((range, idx) => (
              <label key={range.label}>
                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice === idx}
                  onChange={() => setSelectedPrice(idx)}
                />
                {range.label}
              </label>
            ))}
            <label>
              <input
                type="radio"
                name="price"
                checked={selectedPrice === -1}
                onChange={() => setSelectedPrice(-1)}
              />
              All
            </label>
          </div>

          <div className="filter-margin-top">
            <strong>Storage</strong>
            {STORAGES.map((s) => (
              <label key={s}>
                <input
                  type="radio"
                  name="storage"
                  checked={selectedStorage === s}
                  onChange={() => setSelectedStorage(s)}
                />
                {s}
              </label>
            ))}
            <label>
              <input
                type="radio"
                name="storage"
                checked={selectedStorage === ""}
                onChange={() => setSelectedStorage("")}
              />
              All
            </label>
          </div>

          <div className="filter-margin-top">
            <strong>RAM</strong>
            {RAMS.map((r) => (
              <label key={r}>
                <input
                  type="radio"
                  name="ram"
                  checked={selectedRam === r}
                  onChange={() => setSelectedRam(r)}
                />
                {r}
              </label>
            ))}
            <label>
              <input
                type="radio"
                name="ram"
                checked={selectedRam === ""}
                onChange={() => setSelectedRam("")}
              />
              All
            </label>
          </div>
        </aside>
      )}

      <div className="productlist-container productlist-flex1">
        {loading ? (
          <div className="producterror"><span>⏳ Loading Product...</span></div>
        ) : products.length === 0 ? (
          <div className="producterror"><span>😕 No products match your search or filters.</span></div>
        ) : (
          <ul className="product-list">
            {products.map((product) => (
              <li key={product._id}>
                <div
                  className="product-item"
                  onClick={() => navigate(`/product/${product._id}`)}
                ><div className="items-details">
                  <span className="product-brand">{product.Brand}</span> <span className="product-model">{product.Model}</span> <span className="product-color">{product.Color}</span> <br />
                  <span className="product-memory">{product.Memory}</span> <span className="product-storage">{product.Storage}</span> <br />
                  <span className="product-price">₹{product["Selling Price"]}</span>{" "}
                  <del className="product-original-price">₹{product["Original Price"]}</del> <br />
                  <span className="product-rating">Rating: {product.Rating}</span>
               </div> </div>
                <button
                  className="add-to-cart"
                  onClick={() => {
                    console.log("Adding to cart:", product._id);
                    addToCart(product._id, 1, {
                      brand: product.Brand,
                      model: product.Model,
                      color: product.Color,
                      memory: product.Memory,
                      storage: product.Storage, 
                      price: product["Selling Price"],
                      image: product.image, // if available
                      //description: product.description // if available
                    });
                  }}
                >
                  Add to Cart
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        {products.length > 0 && (
          <div className="pagination-controls">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
              ⬅️ Prev
            </button>
            <span className="pagination-page">Page {page}</span>
            <button onClick={() => setPage(page + 1)}>Next ➡️</button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default ProductList;
