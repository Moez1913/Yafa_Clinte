import { useState } from 'react';
import UseAxiosSecure from './Axios/UseAxiosSecure';

/**
 * Hook to search products on the server.
 * Returns { results, loading, error, search }.
 */
const useProductSearch = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const axiosSecure = UseAxiosSecure();

  const search = async (query) => {
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axiosSecure.get(`/products/search?q=${encodeURIComponent(query)}`);
      setResults(res.data || []);
    } catch (err) {
      setError(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
};

export default useProductSearch;
