'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../components/Header'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface ListingData {
  location: string
  amenities: string
  vibe: string
  capacity: string
  additional_details: string
}

export default function CreateListing() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ListingData>({
    location: '',
    amenities: '',
    vibe: '',
    capacity: '',
    additional_details: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    console.log('🚀 Submitting form data:', formData)
    console.log('🌐 API URL:', `${API_URL}/listings/create`)

    try {
      const requestBody = {
        host_input_facts: formData,
      }
      console.log('📤 Request body:', JSON.stringify(requestBody, null, 2))

      const response = await fetch(`${API_URL}/listings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      console.log('📥 Response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.text()
        console.error('❌ Error response:', errorData)
        throw new Error(errorData || `Failed to create listing: ${response.status} ${response.statusText}`)
      }

      const listing = await response.json()
      console.log('✅ Listing created:', listing)
      router.push(`/listings/${listing.id}`)
    } catch (err) {
      console.error('💥 Error creating listing:', err)
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="container">
        <div className="card">
          <h1 style={{ color: '#2d5016', marginBottom: '0.5rem' }}>🌿 Host Your Treehouse</h1>
          <p style={{ marginTop: '0.5rem', marginBottom: '2rem', color: '#558b2f' }}>
            Fill in the details about your property, and our AI will generate an
            engaging listing description that captures its unique charm.
          </p>

          {error && (
            <div className="error">
              <strong>Error:</strong> {error}
              <br />
              <small style={{ marginTop: '0.5rem', display: 'block' }}>
                Check the browser console (F12) for more details. Make sure the backend (port 8080) and AI service (port 8001) are running.
              </small>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="location">Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="e.g., Redwood National Park, CA"
              />
            </div>

            <div className="form-group">
              <label htmlFor="amenities">Amenities *</label>
              <textarea
                id="amenities"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                required
                placeholder="e.g., Hot tub, Wi-Fi, Fully equipped kitchen, Fireplace, Hiking trails access"
              />
            </div>

            <div className="form-group">
              <label htmlFor="vibe">Vibe/Style *</label>
              <input
                type="text"
                id="vibe"
                name="vibe"
                value={formData.vibe}
                onChange={handleChange}
                required
                placeholder="e.g., Rustic forest cabin, cozy and magical"
              />
            </div>

            <div className="form-group">
              <label htmlFor="capacity">Capacity *</label>
              <input
                type="text"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                placeholder="e.g., 4 guests, 2 bedrooms, 1 bathroom"
              />
            </div>

            <div className="form-group">
              <label htmlFor="additional_details">Additional Details</label>
              <textarea
                id="additional_details"
                name="additional_details"
                value={formData.additional_details}
                onChange={handleChange}
                placeholder="Any other details you'd like to include (optional)"
              />
            </div>

            <button type="submit" className="btn" disabled={loading}>
              {loading ? '🌱 Generating Your Listing...' : '✨ Generate & Save Listing'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
