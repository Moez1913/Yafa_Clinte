# Role-Based Authentication Implementation Guide

This guide explains how to use the role-based authentication system implemented in your application.

## Overview

The role-based authentication system uses Firebase Authentication for user login/signup and Firestore to store user roles. Three default roles are supported:
- **user** - Default role for regular users
- **admin** - Full administrative access
- **moderator** - Moderation capabilities

## Components and Hooks

### 1. AuthProvider (Updated)
Located in `src/providers/AuthProvider.jsx`

**Features:**
- Handles user authentication via Firebase
- Automatically fetches and manages user roles from Firestore
- Creates user documents with default 'user' role on first login

**Usage:**
```jsx
// Already wrapped around your app in main.jsx
import AuthProvider from './providers/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}
```

### 2. UseRole Hook (New)
Located in `src/Hooks/UseRole.jsx`

**Available methods:**
```jsx
import UseRole from './Hooks/UseRole';

function MyComponent() {
  const { user, userRole, loading, isAdmin, isUser, isModerator, hasRole } = UseRole();

  if (loading) return <div>Loading...</div>;

  if (isAdmin()) {
    return <div>Admin Panel</div>;
  }

  if (hasRole(['admin', 'moderator'])) {
    return <div>Admin or Moderator Panel</div>;
  }

  return <div>Regular User Content</div>;
}
```

### 3. PrivateRoute Component (Updated)
Located in `src/components/Routes/PrivetRout.jsx`

**Basic Authentication (unchanged):**
```jsx
import PrivetRout from './components/Routes/PrivetRout';

function Routes() {
  return (
    <BrowserRouter>
      <PrivetRout>
        <CartPage />
      </PrivetRout>
    </BrowserRouter>
  );
}
```

**Role-Based Access (NEW):**
```jsx
// Only admin can access
<PrivetRout requiredRole="admin">
  <AdminPanel />
</PrivetRout>

// Multiple roles allowed
<PrivetRout requiredRole={['admin', 'moderator']}>
  <ModerationPanel />
</PrivetRout>
```

## Role Utilities (New)
Located in `src/utils/roleUtils.js`

### Available Functions

#### `setUserRole(uid, role)`
Update a user's role in Firestore
```jsx
import { setUserRole } from './utils/roleUtils';

// Make user an admin
await setUserRole(userId, 'admin');
```

#### `getUserRole(uid)`
Get a user's current role
```jsx
import { getUserRole } from './utils/roleUtils';

const role = await getUserRole(userId);
(role); // 'admin', 'moderator', or 'user'
```

#### `getUsersByRole(role)`
Get all users with a specific role
```jsx
import { getUsersByRole } from './utils/roleUtils';

const admins = await getUsersByRole('admin');
const moderators = await getUsersByRole('moderator');
```

#### `isUserAdmin(uid)` / `isUserModerator(uid)`
Check if user has specific role
```jsx
import { isUserAdmin, isUserModerator } from './utils/roleUtils';

const isAdmin = await isUserAdmin(userId);
const isMod = await isUserModerator(userId);
```

#### `createUserDocument(uid, email, role)`
Manually create user document
```jsx
import { createUserDocument } from './utils/roleUtils';

await createUserDocument(uid, email, 'user');
```

## Firestore Structure

The system expects the following Firestore structure:

```
firestore
└── users (collection)
    └── {uid} (document)
        ├── uid: string
        ├── email: string
        ├── role: string ('user', 'admin', 'moderator')
        ├── createdAt: timestamp
        ├── updatedAt: timestamp
        └── roleUpdatedAt: timestamp (optional)
```

## Implementation Examples

### Example 1: Admin Dashboard
```jsx
import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import PrivetRout from './Routes/PrivetRout';

function AdminDashboard() {
  return (
    <PrivetRout requiredRole="admin">
      <div>
        <h1>Admin Dashboard</h1>
        <p>Only admins can see this</p>
      </div>
    </PrivetRout>
  );
}
```

### Example 2: Role-Based Content Rendering
```jsx
import UseRole from '../Hooks/UseRole';

function UserProfile() {
  const { userRole, isAdmin } = UseRole();

  return (
    <div>
      <h1>User Profile</h1>
      <p>Current Role: {userRole}</p>
      
      {isAdmin() && (
        <button>Manage Users</button>
      )}
    </div>
  );
}
```

### Example 3: Making User an Admin (Backend Example)
Add this to your Node.js backend route:

```javascript
// routes/admin.js
const { setUserRole } = require('../utils/roleUtils');

app.put('/api/users/:uid/role', async (req, res) => {
  try {
    const { uid } = req.params;
    const { role } = req.body;
    
    // Verify requesting user is admin
    if (!await isUserAdmin(req.user.uid)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    await setUserRole(uid, role);
    res.json({ success: true, message: `User role updated to ${role}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Usage in Routes

Update your `Routes.jsx` to use role-based protection:

```jsx
import PrivetRout from './PrivetRout';

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Authenticated user routes */}
        <Route path="/cart" element={<PrivetRout><Cart /></PrivetRout>} />
        <Route path="/wishlist" element={<PrivetRout><WishList /></PrivetRout>} />
        
        {/* Admin only routes */}
        <Route path="/admin" element={<PrivetRout requiredRole="admin"><AdminPanel /></PrivetRout>} />
        
        {/* Moderator routes */}
        <Route path="/moderation" element={<PrivetRout requiredRole={['admin', 'moderator']}><ModerationPanel /></PrivetRout>} />
      </Switch>
    </BrowserRouter>
  );
};
```

## Setting Up Backend Integration

### 1. Create Admin User (One-time setup)
```bash
# Use Firebase Console to manually set a user as admin in Firestore
# Or use Firebase Admin SDK in your backend
```

### 2. Backend Middleware to Verify Admin Role
```javascript
// middleware/adminCheck.js
const { getUserRole } = require('../utils/roleUtils');

const adminOnly = async (req, res, next) => {
  try {
    const uid = req.user.uid; // From JWT token
    const role = await getUserRole(uid);
    
    if (role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = adminOnly;
```

## Security Notes

1. **Backend Verification**: Always verify roles on the backend before processing sensitive operations
2. **JWT Token**: Include role information in JWT claims for efficient backend checks
3. **Firestore Rules**: Set up Firestore security rules to allow only admins to update roles:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{document=**} {
         allow read: if request.auth.uid == resource.id;
         allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
       }
     }
   }
   ```

## Troubleshooting

### Users don't see their role
- Check if Firestore collection `users` exists
- Verify user document structure matches expected format
- Check browser console for errors

### PrivateRoute not working
- Ensure AuthProvider wraps your app at the top level
- Verify `requiredRole` prop is spelled correctly
- Check that `loading` state is handled properly

### Role not updating
- Manually verify in Firebase Console that role was updated
- Clear browser cache and reload
- Check Firestore security rules aren't blocking writes

## Next Steps

1. Update your backend JWT endpoint to include user role
2. Create an admin panel component for managing user roles
3. Set up proper Firestore security rules
4. Test role-based access control across your application
