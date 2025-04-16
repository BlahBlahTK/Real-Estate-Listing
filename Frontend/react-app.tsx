// src/App.js
import React, { useState, useEffect } from 'react';

function App() {
  const [listings, setListings] = useState<{ id: number; title: string; description: string; price: number; location: string; city: string }[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    city: ''
  });
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: ''
  });

  // Fetch listings
  const fetchListings = async () => {
    const { city, minPrice, maxPrice } = filters;
    let url = 'http://localhost:8000/listings/?';
    
    if (city) url += `city=${city}&`;
    if (minPrice) url += `min_price=${minPrice}&`;
    if (maxPrice) url += `max_price=${maxPrice}&`;
    
    const response = await fetch(url);
    const data = await response.json();
    setListings(data);
  };

  useEffect(() => {
    fetchListings();
  }, [filters]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8000/listings/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      fetchListings();
      setFormData({
        title: '',
        description: '',
        price: '',
        location: '',
        city: ''
      });
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <h1>Real Estate Listings</h1>
      
      {/* Filter Section */}
      <div>
        <h2>Filters</h2>
        <input
          type="text"
          name="city"
          placeholder="Filter by city"
          value={filters.city}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="minPrice"
          placeholder="Min price"
          value={filters.minPrice}
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="maxPrice"
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={handleFilterChange}
        />
      </div>
      
      {/* Listing Form */}
      <form onSubmit={handleSubmit}>
        <h2>Add New Listing</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
      
      {/* Listings Display */}
      <div>
        <h2>Available Listings</h2>
        {listings.map((listing) => (
          <div key={listing.id}>
            <h3>{listing.title}</h3>
            <p>{listing.description}</p>
            <p>Price: ${listing.price}</p>
            <p>Location: {listing.location}, {listing.city}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;