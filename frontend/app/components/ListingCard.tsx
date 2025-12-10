import Link from 'next/link'
import Image from 'next/image'

interface ListingCardProps {
  id: number
  title: string
  location: string
  price: number
  image: string
  rating?: number
  reviewCount?: number
}

export default function ListingCard({ id, title, location, price, image, rating = 4.8, reviewCount = 0 }: ListingCardProps) {
  return (
    <Link href={`/listings/${id}`} className="listing-card">
      <div className="listing-image-container">
        <div 
          className="listing-image"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="listing-badge">New</div>
      </div>
      <div className="listing-info">
        <div className="listing-header-info">
          <h3 className="listing-title">{title}</h3>
          <div className="listing-rating">
            <span className="star">⭐</span>
            <span>{rating}</span>
            {reviewCount > 0 && <span className="review-count">({reviewCount})</span>}
          </div>
        </div>
        <p className="listing-location">{location}</p>
        <div className="listing-footer">
          <span className="listing-price">
            <span className="price-amount">${price}</span>
            <span className="price-period">/ night</span>
          </span>
        </div>
      </div>
    </Link>
  )
}

