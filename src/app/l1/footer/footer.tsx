import React from 'react'

function Footer() {
  return (
    <div>
      <div className="bg-gray-800 text-white py-6 ">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col md:flex-row justify-between items-center">
      {/* Logo and Tagline */}
      <div className="mb-4 md:mb-0">
        <h1 className="text-xl font-bold"> Sanathanaveershivadharma</h1>
        <p className="text-sm text-gray-400">Empowering Your Vision</p>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-6 mb-4 md:mb-0">
        <a href="#" className="text-sm text-gray-300 hover:text-white transition">
          Home
        </a>
        <a href="#" className="text-sm text-gray-300 hover:text-white transition">
          About
        </a>
        <a href="#" className="text-sm text-gray-300 hover:text-white transition">
          Services
        </a>
        <a href="#" className="text-sm text-gray-300 hover:text-white transition">
          Contact
        </a>
      </div>

      {/* Social Media Links */}
      <div className="flex space-x-4">
        <a
          href="#"
          className="text-gray-400 hover:text-white transition"
          aria-label="Facebook"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M22.675 0h-21.35C.596 0 0 .596 0 1.325v21.35C0 23.404.596 24 1.325 24h11.497v-9.294H9.905v-3.622h2.917V8.413c0-2.891 1.763-4.468 4.337-4.468 1.233 0 2.294.092 2.602.133v3.017l-1.785.001c-1.399 0-1.669.664-1.669 1.637v2.147h3.339l-.435 3.622h-2.904V24h5.69c.729 0 1.325-.596 1.325-1.325v-21.35C24 .596 23.404 0 22.675 0z" />
          </svg>
        </a>
        <a
          href="#"
          className="text-gray-400 hover:text-white transition"
          aria-label="Twitter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 4.557a9.846 9.846 0 0 1-2.828.775 4.926 4.926 0 0 0 2.165-2.717 9.865 9.865 0 0 1-3.127 1.195 4.916 4.916 0 0 0-8.379 4.482c-4.084-.205-7.702-2.161-10.126-5.13a4.822 4.822 0 0 0-.664 2.475c0 1.71.87 3.214 2.19 4.096a4.897 4.897 0 0 1-2.229-.616c-.054 2.28 1.581 4.415 3.934 4.89a4.93 4.93 0 0 1-2.224.085c.627 1.956 2.445 3.379 4.604 3.419a9.872 9.872 0 0 1-6.102 2.103c-.396 0-.787-.023-1.176-.068a13.978 13.978 0 0 0 7.548 2.212c9.057 0 14.012-7.504 14.012-14.014 0-.213-.004-.425-.014-.637A10.003 10.003 0 0 0 24 4.557z" />
          </svg>
        </a>
        <a
          href="#"
          className="text-gray-400 hover:text-white transition"
          aria-label="LinkedIn"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 0h-14c-2.762 0-5 2.238-5 5v14c0 2.762 2.238 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.762-2.238-5-5-5zm-11 20h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.783-1.75-1.75s.784-1.75 1.75-1.75 1.75.783 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-1.337-.482-2.255-1.689-2.255-.921 0-1.469.621-1.711 1.221-.089.217-.111.519-.111.822v5.816h-3v-11h3v1.482c.397-.618 1.108-1.482 2.695-1.482 1.967 0 3.439 1.285 3.439 4.043v6.957z" />
          </svg>
        </a>
      </div>
    </div>

    {/* Footer Bottom */}
    <div className="mt-6 text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()} YourCompany. All rights reserved.
    </div>
  </div>
</div>

    </div>
  )
}

export default Footer
