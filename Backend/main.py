from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uuid

app = FastAPI()

# In-memory database
db = []

# Models
class Listing(BaseModel):
    title: str
    description: str
    price: float
    location: str
    city: str

class ListingCreate(Listing):
    pass

class ListingOut(Listing):
    id: str

# Utility functions
def get_listing_by_id(listing_id: str):
    for listing in db:
        if listing["id"] == listing_id:
            return listing
    return None

# Routes
@app.post("/listings/", response_model=ListingOut)
def create_listing(listing: ListingCreate):
    listing_dict = listing.dict()
    listing_dict["id"] = str(uuid.uuid4())
    db.append(listing_dict)
    return listing_dict

@app.get("/listings/", response_model=List[ListingOut])
def get_listings(city: Optional[str] = None, min_price: Optional[float] = None, max_price: Optional[float] = None):
    filtered_listings = db
    
    if city:
        filtered_listings = [l for l in filtered_listings if l["city"].lower() == city.lower()]
    
    if min_price is not None:
        filtered_listings = [l for l in filtered_listings if l["price"] >= min_price]
    
    if max_price is not None:
        filtered_listings = [l for l in filtered_listings if l["price"] <= max_price]
    
    return filtered_listings

@app.get("/listings/{listing_id}", response_model=ListingOut)
def get_listing(listing_id: str):
    listing = get_listing_by_id(listing_id)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing