'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '../../components/Header'
import { sampleListings } from '../../data/sampleListings'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface Listing {
  id: number
  host_input_facts: {
    location?: string
    amenities?: string
    vibe?: string
    capacity?: string
    additional_details?: string
  }
  ai_description: string
  created_at?: string
  title?: string
  location?: string
  price?: number
  image?: string
}

export default function ListingView() {
  const params = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = Number(params.id)
      
      // ALWAYS try API first - real listings from database take priority
      try {
        console.log(`Fetching listing ${listingId} from API: ${API_URL}/listings/${params.id}`)
        const response = await fetch(`${API_URL}/listings/${params.id}`)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Received listing data from API:', data)
          
          // Parse host_input_facts if it's a string
          if (typeof data.host_input_facts === 'string') {
            try {
              data.host_input_facts = JSON.parse(data.host_input_facts)
            } catch (e) {
              console.error('Error parsing host_input_facts:', e)
            }
          }
          
          setListing(data)
          setLoading(false)
          return
        } else if (response.status === 404) {
          // Only if API returns 404, check sample listings
          console.log(`API returned 404, checking sample listings for ID ${listingId}`)
          const sampleListing = sampleListings.find(l => l.id === listingId)
          if (sampleListing) {
            console.log('Found sample listing:', sampleListing.title)
            setListing({
              id: sampleListing.id,
              host_input_facts: sampleListing.host_input_facts,
              ai_description: sampleListing.ai_description || '',
              title: sampleListing.title,
              location: sampleListing.location,
              price: sampleListing.price,
              image: sampleListing.image
            })
            setLoading(false)
            return
          }
        }
        
        // If we get here, listing not found in API or samples
        throw new Error('Listing not found')
      } catch (err) {
        console.error('Error fetching listing:', err)
        setError(err instanceof Error ? err.message : 'Failed to load listing')
        setLoading(false)
      }
    }

    if (params.id) {
      fetchListing()
    }
  }, [params.id])

  if (loading) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="loading">Loading listing...</div>
        </div>
      </>
    )
  }

  if (error || !listing) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="error">{error || 'Listing not found'}</div>
          <Link href="/create" className="nav-link">
            ← Create a new listing
          </Link>
        </div>
      </>
    )
  }

  // Parse host_input_facts if it's a string (from database) or use object directly
  let facts = listing.host_input_facts
  if (typeof facts === 'string') {
    try {
      facts = JSON.parse(facts)
    } catch (e) {
      console.error('Error parsing host_input_facts:', e)
      facts = {}
    }
  }

  return (
    <>
      <Header />
      <div className="container">
        <Link href="/" className="nav-link">
          ← Back to Explore
        </Link>

        {listing.image && (
          <div className="listing-hero-image" style={{ backgroundImage: `url(${listing.image})` }} />
        )}

        <div className="card">
          <div className="listing-header">
            <h1>{listing.title || `Listing #${listing.id}`}</h1>
            {facts.location && (
              <p className="listing-location-large">{facts.location}</p>
            )}
            {listing.location && !facts.location && (
              <p className="listing-location-large">{listing.location}</p>
            )}
            {listing.price && (
              <div className="listing-price-large">
                <span className="price-amount">${listing.price}</span>
                <span className="price-period">/ night</span>
              </div>
            )}
            {listing.created_at && (
              <p style={{ color: '#7f8c8d', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Created: {new Date(listing.created_at).toLocaleString()}
              </p>
            )}
          </div>

          <div className="facts-section">
            <h2>Property Details</h2>
            {facts.location && (
              <div className="fact-item">
                <strong>Location:</strong> {facts.location}
              </div>
            )}
            {facts.capacity && (
              <div className="fact-item">
                <strong>Capacity:</strong> {facts.capacity}
              </div>
            )}
            {facts.vibe && (
              <div className="fact-item">
                <strong>Style/Vibe:</strong> {facts.vibe}
              </div>
            )}
            {facts.amenities && (
              <div className="fact-item">
                <strong>Amenities:</strong> {facts.amenities}
              </div>
            )}
            {facts.additional_details && (
              <div className="fact-item">
                <strong>Additional Details:</strong> {facts.additional_details}
              </div>
            )}
          </div>

          <div className="description-section">
            <h2>About This Space</h2>
            <div className="description-content">{listing.ai_description}</div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/create" className="btn">
            Create Your Own Listing
          </Link>
        </div>
      </div>
    </>
  )
}
