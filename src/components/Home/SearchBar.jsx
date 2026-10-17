import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import UseAxios from '../../Hooks/Axios/UseAxios';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState([]);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();
  const axiosPublic = UseAxios();

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('yafaa_recent_searches') || '[]');
      setRecentSearches(saved.slice(0, 5));
    } catch {
      setRecentSearches([]);
    }
  }, []);

  const saveRecentSearch = (term) => {
    try {
      const saved = JSON.parse(localStorage.getItem('yafaa_recent_searches') || '[]');
      const updated = [term, ...saved.filter((s) => s !== term)].slice(0, 5);
      localStorage.setItem('yafaa_recent_searches', JSON.stringify(updated));
      setRecentSearches(updated);
    } catch {}
  };

  const clearRecentSearches = () => {
    localStorage.removeItem('yafaa_recent_searches');
    setRecentSearches([]);
  };

  // Debounced search
  const doSearch = useCallback(
    (q) => {
      if (!q.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      axiosPublic
        .get(`/products?search=${encodeURIComponent(q.trim())}`)
        .then((res) => {
          setResults(res.data || []);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    },
    [axiosPublic]
  );

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.trim().length >= 1) {
      debounceRef.current = setTimeout(() => doSearch(query), 200);
    } else {
      setResults([]);
    }
    setActiveIndex(-1);
    return () => clearTimeout(debounceRef.current);
  }, [query, doSearch]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFocus = () => setShowDropdown(true);

  const handleSelect = (product) => {
    saveRecentSearch(product.productName || product.name || '');
    setQuery('');
    setShowDropdown(false);
    navigate(`/product/${product._id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    saveRecentSearch(query.trim());
    setShowDropdown(false);
    navigate(`/allProducts?search=${encodeURIComponent(query.trim())}`);
  };

  const handleRecentClick = (term) => {
    setQuery(term);
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    const list = results.length > 0 ? results.slice(0, 6) : [];
    if (!showDropdown) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, list.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && list[activeIndex]) {
        handleSelect(list[activeIndex]);
      } else {
        handleSubmit(e);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      inputRef.current?.blur();
    }
  };

  const hasDropdownContent =
    showDropdown && (loading || results.length > 0 || (query === '' && recentSearches.length > 0));

  return (
    <div className="relative w-full max-w-xl">
      {/* Search Input */}
      <form onSubmit={handleSubmit} autoComplete="off">
        <div
          className={`flex items-center bg-white border-2 rounded-full px-4 py-1.5 gap-2 transition-all duration-200 ${
            showDropdown
              ? 'border-purple-500 shadow-lg shadow-purple-100'
              : 'border-gray-200 hover:border-purple-300'
          }`}
        >
          {/* Search Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 text-gray-400 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
              clipRule="evenodd"
            />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder="পণ্য খুঁজুন... (Search products)"
            className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 min-w-0"
            aria-label="Search products"
            aria-autocomplete="list"
            aria-expanded={showDropdown}
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                inputRef.current?.focus();
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          )}

          {/* Loading Spinner */}
          {loading && (
            <span className="loading loading-spinner loading-xs text-purple-500 shrink-0" />
          )}

          {/* Search Button */}
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-150 shrink-0"
          >
            Search
          </button>
        </div>
      </form>

      {/* Dropdown */}
      {hasDropdownContent && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[999] overflow-hidden"
        >
          {/* Recent Searches (shown when query is empty) */}
          {query === '' && recentSearches.length > 0 && (
            <div className="px-4 pt-3 pb-2">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Recent Searches
                </p>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-purple-500 hover:text-purple-700 font-medium"
                >
                  Clear all
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleRecentClick(term)}
                    className="flex items-center gap-1 text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-1 rounded-full transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && query && (
            <div className="px-4 py-3 space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-lg bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && query && results.length === 0 && (
            <div className="flex flex-col items-center gap-2 py-8 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 15.803a7.5 7.5 0 0 0 10.607 0Z"
                />
              </svg>
              <p className="text-sm font-medium text-gray-500">
                "<span className="text-purple-600">{query}</span>" — কোনো পণ্য পাওয়া যায়নি
              </p>
              <p className="text-xs text-gray-400">অন্য কীওয়ার্ড দিয়ে চেষ্টা করুন</p>
            </div>
          )}

          {/* Results List */}
          {!loading && results.length > 0 && (
            <>
              <div className="px-4 pt-3 pb-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  পণ্য — {results.length} results
                </p>
              </div>
              <ul role="listbox" className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {results.slice(0, 6).map((product, idx) => {
                  const name = product.productName || product.name || 'Product';
                  const price = product.price ?? 0;
                  const discount = product.discount ?? 0;
                  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : null;
                  const image = product.image || product.imgUrl || product.img;
                  const category = product.category || product.AdCategory || '';
                  const isActive = idx === activeIndex;

                  return (
                    <li
                      key={product._id}
                      role="option"
                      aria-selected={isActive}
                      onMouseDown={() => handleSelect(product)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                        isActive ? 'bg-purple-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      {/* Product Image */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                        {image ? (
                          <img
                            src={image}
                            alt={name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate leading-tight">
                          {name}
                        </p>
                        {category && (
                          <p className="text-xs text-purple-500 mt-0.5">{category}</p>
                        )}
                        <div className="flex items-center gap-2 mt-0.5">
                          {discountedPrice ? (
                            <>
                              <span className="text-sm font-bold text-purple-700">
                                ৳{discountedPrice.toFixed(0)}
                              </span>
                              <span className="text-xs text-gray-400 line-through">
                                ৳{price}
                              </span>
                              <span className="text-xs bg-green-100 text-green-700 px-1.5 rounded-full font-medium">
                                -{discount}%
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-purple-700">৳{price}</span>
                          )}
                        </div>
                      </div>

                      {/* Arrow icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? 'text-purple-400' : 'text-gray-300'
                        }`}
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </li>
                  );
                })}
              </ul>

              {/* View All */}
              {results.length > 0 && (
                <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                  <button
                    onMouseDown={() => {
                      saveRecentSearch(query);
                      setShowDropdown(false);
                      navigate(`/allProducts?search=${encodeURIComponent(query.trim())}`);
                    }}
                    className="w-full text-center text-sm text-purple-600 hover:text-purple-800 font-medium py-1 flex items-center justify-center gap-1.5"
                  >
                    "{query}" — সব {results.length}টি পণ্য দেখুন
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
