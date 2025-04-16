import React, { useState, useEffect } from 'react';
import './App.css';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
}

function App() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [newListing, setNewListing] = useState<Omit<Listing, 'id'>>({
    title: '',
    description: '',
    price: 0,
    location: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/listings/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setListings(data);
    } catch (error) {
      setError('Failed to fetch listings. Please try again later.');
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/listings/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(newListing),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setListings(prev => [...prev, data]);
      setNewListing({
        title: '',
        description: '',
        price: 0,
        location: '',
        city: ''
      });
    } catch (error) {
      setError('Failed to create listing. Please try again.');
      console.error('Error creating listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (listingId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/listings/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setListings(prev => prev.filter(listing => listing.id !== listingId));
    } catch (error) {
      setError('Failed to delete listing. Please try again.');
      console.error('Error deleting listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewListing(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Real Estate Listings</h1>
      </header>
      <main>
        <section className="new-listing">
          <h2>Add New Listing</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newListing.title}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newListing.description}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newListing.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              disabled={loading}
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={newListing.location}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={newListing.city}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Listing'}
            </button>
          </form>
        </section>

        <section className="listings">
          <h2>Current Listings</h2>
          {loading && <div className="loading">Loading listings...</div>}
          {error && <div className="error-message">{error}</div>}
          <div className="listing-grid">
            {listings.length === 0 && !loading ? (
              <div className="no-listings">No listings available. Add your first listing!</div>
            ) : (
              listings.map(listing => (
                <div key={listing.id} className="listing-card">
                  <h3>{listing.title}</h3>
                  <p>{listing.description}</p>
                  <p className="price">${listing.price.toLocaleString()}</p>
                  <p className="location">{listing.location}, {listing.city}</p>
                  <button 
                    className="delete-button"
                    onClick={() => handleDelete(listing.id)}
                    disabled={loading}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
