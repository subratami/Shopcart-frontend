import React from 'react';
import { Link } from 'react-router-dom';
import './ShopByCategories.css';

type Category = {
  name: string;
  slug: string;
};

const categories: Category[] = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Clothing', slug: 'clothing' },
  { name: 'Home & Kitchen', slug: 'home-kitchen' },
  // Add more categories as needed
];

const ShopByCategories: React.FC = () => (
  <section className="shop-by-categories">
    <h2>Shop by Categories</h2>
    <div className="categories-list">
      {categories.map(cat => (
        <Link key={cat.slug} to={`/category/${cat.slug}`} className="category-card">
          {cat.name}
        </Link>
      ))}
    </div>
  </section>
);

export default ShopByCategories;