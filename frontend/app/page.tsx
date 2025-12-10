'use client'

import { sampleListings } from './data/sampleListings'
import ListingCard from './components/ListingCard'
import Header from './components/Header'

export default function Home() {
  return (
    <>
      <Header />
      <main className="main-content">
        <div className="hero-section">
          <h1 className="hero-title">Find your perfect treehouse escape</h1>
          <p className="hero-subtitle">Discover unique stays in nature's most beautiful settings</p>
        </div>

        <div className="listings-grid">
          {sampleListings.map((listing) => (
            <ListingCard
              key={listing.id}
              id={listing.id}
              title={listing.title}
              location={listing.location}
              price={listing.price}
              image={listing.image}
              rating={listing.rating}
              reviewCount={listing.reviewCount}
            />
          ))}
        </div>
      </main>
    </>
  )
}
