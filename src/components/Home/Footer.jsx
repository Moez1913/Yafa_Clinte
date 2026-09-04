import React from 'react';
import { FaFacebookF, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import logo from '../../assets/yafaaLogo.png';

const Footer = () => {
  return (
    <footer className="mt-20 bg-gradient-to-br from-[#2d1b69] via-[#6b21a8] to-[#ec4899] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Korean Dewdrop logo" className="h-12 w-12 rounded-full object-cover shadow-lg" />
              <div>
                <h3 className="text-xl font-bold">Korean Dewdrop</h3>
                <p className="text-sm text-pink-100">Beauty, skincare & lifestyle</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-pink-50/90">
              Discover premium Korean essentials with elegant styling, trusted quality, and a touch of everyday luxury.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-pink-50/90">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/allProducts" className="hover:text-white transition">All Products</Link></li>
              <li><Link to="/wishlist" className="hover:text-white transition">Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-white transition">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-pink-50/90">
              <li className="flex items-center gap-2"><FaPhoneAlt className="text-pink-200" /> +880 1735-797489</li>
              <li className="flex items-center gap-2"><FaEnvelope className="text-pink-200" />Isratjahan7974@gmail.com </li>
              <li className="flex items-center gap-2"><FaMapMarkerAlt className="text-pink-200" /> Rajshahi, Bangladesh</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/share/18r7LGc5BZ/" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition">
                <FaInstagram />
              </a>
            </div>
            <p className="mt-4 text-sm text-pink-50/90">Stay updated with new arrivals and exclusive offers.</p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm text-pink-100">
          © 2026 Yafaa. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
