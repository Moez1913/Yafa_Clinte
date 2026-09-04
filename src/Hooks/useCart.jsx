import { useEffect, useState } from 'react'
import useAuth from './useAuth'
import { useQuery } from '@tanstack/react-query'
import UseAxiosSecure from './Axios/UseAxiosSecure'

const LOCAL_CART_KEY = 'public_cart'

const getLocalCart = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_CART_KEY)) || []
  } catch {
    return []
  }
}

const useCart = () => {
  const axiosSecure = UseAxiosSecure()
  const { user } = useAuth()
  const [localCart, setLocalCart] = useState(getLocalCart())

  const { data: serverCart = [], refetch } = useQuery({
    queryKey: ['cart', user?.email],
    enabled: !!user?.email && !!user?.uid,
    queryFn: async () => {
      const res = await axiosSecure.get(`/cart?email=${user.email}&userId=${user.uid}`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('access-token')}`,
        },
      })
      return res.data
    },
  })

  useEffect(() => {
    if (!user) {
      setLocalCart(getLocalCart())
    }
  }, [user])

  useEffect(() => {
    const handleCartChange = () => setLocalCart(getLocalCart())
    window.addEventListener('public_cart_change', handleCartChange)
    return () => window.removeEventListener('public_cart_change', handleCartChange)
  }, [])

  const refetchCart = () => {
    if (!user) {
      const cartData = getLocalCart()
      setLocalCart(cartData)
      return Promise.resolve(cartData)
    }
    return refetch()
  }

  return [user ? serverCart : localCart, refetchCart]
}

export default useCart
