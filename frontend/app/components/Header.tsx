import Link from 'next/link'

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="logo">
          <span className="logo-icon">🌳</span>
          <span className="logo-text">Treehouse</span>
        </Link>
        <nav className="nav">
          <Link href="/" className="nav-link">Explore</Link>
          <Link href="/create" className="nav-link">Host Your Space</Link>
        </nav>
      </div>
    </header>
  )
}

