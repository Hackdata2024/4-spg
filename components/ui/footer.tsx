import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Top area: Blocks */}
          <div className="grid md:grid-cols-12 gap-8 lg:gap-20 mb-8 md:mb-12">

            {/* 1st block */}
            <div className="md:col-span-4 lg:col-span-5">
              <div className="mb-2">
                {/* Logo */}
                <img src="https://i.ibb.co/5FjF0QK/lund4.png" style={{ width: '30px', height: 'auto' }} />
              </div>
              <div className="text-gray-400">This project aims to address the limitations of existing navigation apps for pedestrians by creating a hyper-local navigation platform.</div>
            </div>

  


          </div>

          {/* Bottom area */}
          <div className="md:flex md:items-center md:justify-between">





          </div>

        </div>
      </div>
    </footer>
  )
}
