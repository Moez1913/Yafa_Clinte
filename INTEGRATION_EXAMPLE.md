/**
 * ROLE-BASED AUTHENTICATION INTEGRATION EXAMPLE
 * 
 * This file shows how to integrate role-based authentication into your main.jsx
 * You can copy these patterns and apply them to your existing routes.
 * 
 * Key Changes:
 * 1. Import the role-protected component (AdminDashboard in this example)
 * 2. Wrap protected routes with PrivetRout and specify requiredRole
 * 3. Update your main.jsx with the new routes
 */

import PrivetRout from './components/Routes/PrivetRout';
import AdminDashboard from './components/AdminDashboard'; // New component

// OPTION 1: Update individual routes (Recommended)
// In your main.jsx, update the router config:

export const routerConfig = [
  {
    path: "/",
    element: <Routes></Routes>,
    children: [
      // Public routes (no change needed)
      {
        path: "/",
        element: <Home></Home>
      },
      {
        path: '/login',
        element: <Login></Login>
      },
      {
        path: '/signup',
        element: <SignUp></SignUp>
      },

      // Protected routes - Authenticated users only
      {
        path: '/cart',
        element: (
          <PrivetRout>
            <Cart></Cart>
          </PrivetRout>
        ),
      },
      {
        path: 'wishlist',
        element: (
          <PrivetRout>
            <WishList></WishList>
          </PrivetRout>
        )
      },
      {
        path: '/OrderPage',
        element: (
          <PrivetRout>
            <OrderPage></OrderPage>
          </PrivetRout>
        )
      },

      // Admin-only routes (NEW)
      {
        path: '/admin',
        element: (
          <PrivetRout requiredRole="admin">
            <AdminDashboard></AdminDashboard>
          </PrivetRout>
        )
      },
      {
        path: '/addproduct',
        element: (
          <PrivetRout requiredRole={['admin', 'moderator']}>
            <AddProduct></AddProduct>
          </PrivetRout>
        )
      },

      // Other routes
      {
        path: '/allProducts',
        element: <AllProducts></AllProducts>,
        loader: () => fetch('http://localhost:5000/products')
      },
      {
        path: '/products',
        element: <Products></Products>,
        loader: () => fetch('http://localhost:5000/products')
      },
      // ... other routes
    ]
  },
];

/**
 * HOW TO USE THIS:
 * 
 * 1. In your main.jsx, replace the current router config with this structure
 * 2. Import the new AdminDashboard component at the top
 * 3. Update other routes as shown above
 * 
 * TESTING THE IMPLEMENTATION:
 * 
 * Step 1: Create an admin user manually via Firebase Console
 *   - Go to Firestore Database
 *   - Create collection: users
 *   - Create document with uid of the user
 *   - Set role field to "admin"
 * 
 * Step 2: Try accessing the route
 *   - Login as regular user: Should see "Access Denied"
 *   - Login as admin user: Should see AdminDashboard
 * 
 * ALTERNATIVE: Make yourself an admin programmatically
 *   - Import: import { setUserRole } from './utils/roleUtils';
 *   - Call: await setUserRole(currentUser.uid, 'admin');
 * 
 * For development/testing, you can temporarily add a button in Home.jsx:
 * 
 *   import { setUserRole } from './utils/roleUtils';
 *   
 *   <button onClick={() => setUserRole(user.uid, 'admin')}>
 *     Make Me Admin (Dev Only)
 *   </button>
 */
