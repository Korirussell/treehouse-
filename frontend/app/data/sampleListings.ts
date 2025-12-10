// Sample listings data for Treehouse
export interface Listing {
  id: number
  title: string
  location: string
  price: number
  image: string
  rating: number
  reviewCount: number
  host_input_facts: {
    location: string
    amenities: string
    vibe: string
    capacity: string
    additional_details?: string
  }
  ai_description?: string
}

export const sampleListings: Listing[] = [
  {
    id: 1,
    title: "Cozy Forest Treehouse Retreat",
    location: "Redwood National Park, CA",
    price: 145,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop",
    rating: 4.9,
    reviewCount: 127,
    host_input_facts: {
      location: "Redwood National Park, California",
      amenities: "Hot tub, Wi-Fi, Fully equipped kitchen, Fireplace, Hiking trails access",
      vibe: "Rustic forest cabin, cozy and magical",
      capacity: "4 guests, 2 bedrooms, 1 bathroom",
      additional_details: "Built among ancient redwoods, surrounded by nature"
    },
    ai_description: `Nestled among the towering giants of Redwood National Park, this enchanting treehouse offers a truly magical escape into nature. Perched high among ancient redwoods, you'll wake up to birdsong and fall asleep to the gentle rustling of leaves. The rustic yet comfortable interior features a fully equipped kitchen, cozy fireplace, and stunning forest views from every window.

After a day of exploring the nearby hiking trails, unwind in the private hot tub under the stars. The treehouse is equipped with modern amenities including reliable Wi-Fi, ensuring you can stay connected while disconnecting from the everyday. The space comfortably accommodates up to four guests across two beautifully appointed bedrooms, making it perfect for families or small groups seeking adventure.

What makes this stay truly special is the feeling of being completely immersed in nature while still enjoying the comforts of home. Whether you're sipping coffee on the deck as the morning mist rolls through the trees, or stargazing from the hot tub after dark, this is more than just accommodation—it's an experience you'll treasure forever.`
  },
  {
    id: 2,
    title: "Modern Treehouse Overlooking Valley",
    location: "Asheville, North Carolina",
    price: 189,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop",
    rating: 4.8,
    reviewCount: 89,
    host_input_facts: {
      location: "Asheville, North Carolina",
      amenities: "Full kitchen, Wi-Fi, Hot tub, Deck with mountain views, Fire pit",
      vibe: "Modern minimalist, sleek design with nature",
      capacity: "6 guests, 3 bedrooms, 2 bathrooms",
      additional_details: "Stunning valley views, close to Blue Ridge Parkway"
    },
    ai_description: `Perched on the edge of a lush valley in the heart of the Blue Ridge Mountains, this stunning modern treehouse combines sleek contemporary design with the raw beauty of nature. Floor-to-ceiling windows frame breathtaking panoramic views that change with every season, from vibrant spring greens to the fiery colors of autumn. The open-concept living space features a fully equipped kitchen, perfect for preparing meals while enjoying the scenery.

The property boasts three comfortable bedrooms and two modern bathrooms, comfortably accommodating up to six guests. Step outside onto the expansive deck to find a private hot tub and fire pit area, ideal for evening relaxation under the stars. With reliable Wi-Fi throughout, you can work remotely while surrounded by nature, or simply disconnect and immerse yourself in the peaceful mountain setting.

What sets this treehouse apart is its perfect balance of modern luxury and natural tranquility. Located just minutes from the Blue Ridge Parkway and downtown Asheville's vibrant food and arts scene, you have the best of both worlds—secluded mountain serenity and easy access to world-class dining and entertainment.`
  },
  {
    id: 3,
    title: "Rustic Cabin in the Pines",
    location: "Bend, Oregon",
    price: 125,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop",
    rating: 4.7,
    reviewCount: 203,
    host_input_facts: {
      location: "Bend, Oregon",
      amenities: "Wood stove, Full kitchen, Outdoor shower, Hiking trails, Ski access",
      vibe: "Rustic cabin, cozy mountain retreat",
      capacity: "4 guests, 2 bedrooms, 1 bathroom",
      additional_details: "Surrounded by pine forest, perfect for outdoor enthusiasts"
    },
    ai_description: `Tucked away in a serene pine forest just outside Bend, this charming rustic cabin offers the perfect mountain retreat for outdoor enthusiasts and nature lovers. The cozy interior features a crackling wood stove, comfortable furnishings, and a fully equipped kitchen where you can prepare hearty meals after a day of adventure. With two bedrooms and a full bathroom, the cabin comfortably sleeps up to four guests.

The property is a paradise for outdoor activities, with hiking trails right at your doorstep and world-class skiing just a short drive away. After a day on the slopes or trails, rinse off in the unique outdoor shower surrounded by trees—an invigorating experience that connects you directly with nature. The cabin's location offers the perfect balance of seclusion and accessibility, with Bend's vibrant downtown just 15 minutes away.

What makes this cabin special is its authentic rustic charm combined with modern comforts. Whether you're warming up by the wood stove after a winter ski day, or enjoying morning coffee on the deck listening to the sounds of the forest, this is a place where memories are made and the stresses of everyday life simply melt away.`
  },
  {
    id: 4,
    title: "Luxury Treehouse with River Views",
    location: "Sedona, Arizona",
    price: 225,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop",
    rating: 5.0,
    reviewCount: 156,
    host_input_facts: {
      location: "Sedona, Arizona",
      amenities: "Infinity pool, Full kitchen, Wi-Fi, Hot tub, Private deck, River access",
      vibe: "Luxury nature retreat, elegant and serene",
      capacity: "8 guests, 4 bedrooms, 3 bathrooms",
      additional_details: "Overlooking Oak Creek, stunning red rock views"
    },
    ai_description: `Experience the ultimate in luxury treehouse living at this stunning property overlooking Oak Creek in the heart of Sedona's red rock country. This architectural masterpiece seamlessly blends high-end amenities with the natural beauty of the desert landscape. The spacious interior features four beautifully designed bedrooms and three modern bathrooms, comfortably accommodating up to eight guests in style.

The property's crown jewel is the infinity pool that appears to merge with the horizon, offering breathtaking views of the surrounding red rock formations. A fully equipped gourmet kitchen, reliable Wi-Fi, and multiple private decks ensure every comfort is met. Step down to the creek for a refreshing dip, or relax in the hot tub as the sun sets over the dramatic landscape.

What makes this treehouse extraordinary is its perfect fusion of luxury and nature. You're surrounded by the spiritual energy and stunning beauty that makes Sedona world-famous, yet you have all the amenities of a five-star resort. Whether you're seeking a romantic getaway, a family adventure, or a spiritual retreat, this is a place where dreams become reality and the ordinary becomes extraordinary.`
  },
  {
    id: 5,
    title: "Secluded Bamboo Treehouse",
    location: "Big Island, Hawaii",
    price: 199,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop",
    rating: 4.9,
    reviewCount: 94,
    host_input_facts: {
      location: "Big Island, Hawaii",
      amenities: "Outdoor kitchen, Solar power, Rainwater collection, Hiking trails, Ocean views",
      vibe: "Eco-friendly tropical paradise, sustainable living",
      capacity: "2 guests, 1 bedroom, 1 bathroom",
      additional_details: "Off-grid experience, surrounded by tropical forest"
    },
    ai_description: `Escape to a true tropical paradise at this unique bamboo treehouse nestled in the lush forests of the Big Island. This eco-friendly retreat offers an authentic off-grid experience without sacrificing comfort, powered entirely by solar energy and featuring a sophisticated rainwater collection system. The open-air design allows you to fully immerse yourself in the tropical environment, with ocean views visible through the canopy.

The treehouse features a thoughtfully designed outdoor kitchen where you can prepare meals using fresh local ingredients, and a comfortable bedroom that opens to the sounds and scents of the tropical forest. With hiking trails leading directly from your doorstep to hidden waterfalls and pristine beaches, adventure is always just moments away. The space is perfect for couples seeking a romantic and sustainable escape.

What makes this treehouse truly special is its commitment to sustainable living while providing an unforgettable experience. You'll wake to the calls of tropical birds, spend your days exploring the island's natural wonders, and fall asleep to the gentle sounds of the forest. This is more than accommodation—it's a chance to reconnect with nature and experience Hawaii in its most authentic form.`
  },
  {
    id: 6,
    title: "Mountain View Treehouse Lodge",
    location: "Aspen, Colorado",
    price: 299,
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop",
    rating: 4.8,
    reviewCount: 178,
    host_input_facts: {
      location: "Aspen, Colorado",
      amenities: "Ski-in/ski-out access, Full kitchen, Fireplace, Hot tub, Wi-Fi, Mountain views",
      vibe: "Luxury alpine retreat, cozy and elegant",
      capacity: "10 guests, 5 bedrooms, 4 bathrooms",
      additional_details: "Prime ski location, stunning mountain vistas"
    },
    ai_description: `Experience the ultimate alpine adventure at this magnificent treehouse lodge with direct ski-in/ski-out access in the heart of Aspen. This luxurious property combines the rustic charm of a mountain retreat with the sophistication of a high-end resort. With five spacious bedrooms and four modern bathrooms, the lodge comfortably accommodates up to ten guests, making it perfect for large families or groups of friends.

The interior features a stunning great room with a massive stone fireplace, a gourmet kitchen equipped with everything a chef could desire, and multiple decks offering panoramic mountain views. After a day on the slopes, relax in the private hot tub or gather around the fire to share stories of your adventures. With reliable Wi-Fi throughout, you can stay connected while surrounded by the breathtaking beauty of the Rocky Mountains.

What makes this lodge extraordinary is its prime location and attention to detail. You're steps away from world-class skiing, yet the property feels completely secluded and private. Whether you're here for the legendary powder, the summer hiking and mountain biking, or simply to escape to the mountains, this treehouse lodge provides the perfect base for creating unforgettable memories in one of America's most beautiful destinations.`
  }
]

