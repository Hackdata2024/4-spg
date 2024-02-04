import Link from 'next/link'
import MobileMenu from './mobile-menu'

export default function Header() {
  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">
            {/* Logo */}
            <img src="https://i.ibb.co/5FjF0QK/lund4.png" style={{ width: '60px', height: 'auto' }} />
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">
            {/* Desktop sign in links */}
            
          </nav>

          <MobileMenu />

        </div>
      </div>
    </header>
  )
}
