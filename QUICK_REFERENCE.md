# Role-Based Authentication - Quick Reference

## Quick Commands

### Check if User is Admin
```jsx
import UseRole from './Hooks/UseRole';

const { isAdmin } = UseRole();
if (isAdmin()) { /* show admin content */ }
```

### Protect Route (Admin Only)
```jsx
<PrivetRout requiredRole="admin">
  <AdminDashboard />
</PrivetRout>
```

### Protect Route (Multiple Roles)
```jsx
<PrivetRout requiredRole={['admin', 'moderator']}>
  <Component />
</PrivetRout>
```

### Make User Admin
```jsx
import { setUserRole } from './utils/roleUtils';
await setUserRole(userId, 'admin');
```

### Get All Users with Role
```jsx
import { getUsersByRole } from './utils/roleUtils';
const users = await getUsersByRole('admin');
```

### Get Current User's Role
```jsx
import UseRole from './Hooks/UseRole';
const { userRole } = UseRole();
```

---

## Hook: UseRole()

```jsx
const { 
  user,           // Current Firebase user object
  userRole,       // 'admin', 'moderator', or 'user'
  loading,        // true while checking auth
  isAdmin(),      // Returns: true/false
  isUser(),       // Returns: true/false
  isModerator(),  // Returns: true/false
  hasRole(role)   // Returns: true/false
} = UseRole();
```

**Example with all methods:**
```jsx
import UseRole from './Hooks/UseRole';

function MyComponent() {
  const { userRole, isAdmin, hasRole, loading } = UseRole();

  if (loading) return <Spinner />;

  return (
    <>
      <p>Your role: {userRole}</p>
      {isAdmin() && <AdminButton />}
      {hasRole(['admin', 'moderator']) && <ModPanel />}
      {!hasRole('admin') && <UserContent />}
    </>
  );
}
```

---

## Component: PrivetRout

```jsx
// Basic - Check authentication only
<PrivetRout>
  <CartPage />
</PrivetRout>

// Admin only
<PrivetRout requiredRole="admin">
  <AdminPanel />
</PrivetRout>

// Multiple roles (admin OR moderator)
<PrivetRout requiredRole={['admin', 'moderator']}>
  <ModerationPanel />
</PrivetRout>

// Single role as string
<PrivetRout requiredRole="moderator">
  <ModeratorOnly />
</PrivetRout>
```

---

## Utility Functions: roleUtils

### `setUserRole(uid, role)`
Make user an admin/moderator/user
```jsx
await setUserRole("user-id-123", "admin");
// role: "admin" | "moderator" | "user"
```

### `getUserRole(uid)`
Get a user's current role
```jsx
const role = await getUserRole("user-id-123");
// Returns: "admin", "moderator", or "user"
```

### `getUsersByRole(role)`
Get all users with specific role
```jsx
const admins = await getUsersByRole('admin');
// Returns: Array of user objects
```

### `isUserAdmin(uid)`
Check if user is admin
```jsx
const isAdmin = await isUserAdmin("user-id-123");
// Returns: true | false
```

### `isUserModerator(uid)`
Check if user is moderator
```jsx
const isMod = await isUserModerator("user-id-123");
// Returns: true | false
```

### `createUserDocument(uid, email, role)`
Manually create user document (auto-done on signup)
```jsx
await createUserDocument("uid-123", "user@example.com", "user");
// Only needed if manually creating users
```

---

## Common Patterns

### Show/Hide Admin Menu
```jsx
import UseRole from './Hooks/UseRole';

function NavBar() {
  const { isAdmin } = UseRole();

  return (
    <nav>
      <a href="/">Home</a>
      {isAdmin() && <a href="/admin">Admin</a>}
    </nav>
  );
}
```

### Admin Dashboard Integration
```jsx
import AdminDashboard from './components/AdminDashboard';
import PrivetRout from './components/Routes/PrivetRout';

// In router config:
{
  path: '/admin',
  element: (
    <PrivetRout requiredRole="admin">
      <AdminDashboard />
    </PrivetRout>
  )
}
```

### Update User Role from Admin Panel
```jsx
import { setUserRole, getUsersByRole } from './utils/roleUtils';

async function updateUserRole(userId, newRole) {
  try {
    await setUserRole(userId, newRole);
    console.log(`User updated to ${newRole}`);
  } catch (error) {
    console.error('Failed to update:', error);
  }
}
```

### List All Admins
```jsx
import { getUsersByRole } from './utils/roleUtils';

async function showAdmins() {
  const admins = await getUsersByRole('admin');
  console.log('Admins:', admins);
  // admins = [{ id, email, role, createdAt }, ...]
}
```

### Conditional Content by Role
```jsx
import UseRole from './Hooks/UseRole';

function Dashboard() {
  const { userRole, loading } = UseRole();

  if (loading) return <div>Loading...</div>;

  switch(userRole) {
    case 'admin':
      return <AdminContent />;
    case 'moderator':
      return <ModeratorContent />;
    default:
      return <UserContent />;
  }
}
```

---

## Firestore Structure

```javascript
// After user signup, this is created:
users/{uid}
{
  uid: "auth-uid-123",
  email: "user@example.com",
  role: "user",              // 'user' | 'admin' | 'moderator'
  createdAt: Timestamp,
  updatedAt: Timestamp,
  roleUpdatedAt: Timestamp   // optional
}
```

---

## Testing Checklist

- [ ] Sign up new user → Auto creates role: "user"
- [ ] Login existing user → Fetches role from Firestore
- [ ] Access protected route (no role) → Shows error modal
- [ ] Access protected route (correct role) → Shows content
- [ ] Change user role in AdminDashboard → Updates in Firestore
- [ ] Refresh page → Role still reflects
- [ ] Non-admin tries to access /admin → Access denied

---

## Common Issues & Solutions

### Issue: "userRole is null"
**Solution:** Ensure Firestore collection `users` exists and has proper documents

### Issue: "Cannot read property 'role' of undefined"
**Solution:** Check user document in Firestore matches structure

### Issue: "PrivetRout always shows denied"
**Solution:** Double-check requiredRole prop matches user's role exactly

### Issue: "Admin panel not visible"
**Solution:** 
1. Verify you're actually an admin in Firestore
2. Check browser console for errors
3. Refresh page after role change

---

## Usage Stats

```
Total Files Created: 5 new files
├─ src/Hooks/UseRole.jsx
├─ src/utils/roleUtils.js
├─ src/components/AdminDashboard.jsx
├─ ROLE_BASED_AUTH_GUIDE.md
├─ INTEGRATION_EXAMPLE.md

Files Updated: 3 files
├─ src/firebase/firebase.init.js (added Firestore)
├─ src/providers/AuthProvider.jsx (added role management)
└─ src/components/Routes/PrivetRout.jsx (added role checking)

Documentation Files: 3 files
├─ IMPLEMENTATION_SUMMARY.md (overview)
├─ ARCHITECTURE.md (diagrams & structure)
└─ QUICK_REFERENCE.md (this file)
```

---

## Roles Available

| Role | Permissions | Access |
|------|------------|--------|
| **admin** | All permissions | Everything |
| **moderator** | Moderation & approval | Management pages |
| **user** | Basic operations | Cart, orders, products |

---

## Quick Setup

1. **Update Routes** → Add admin route with PrivetRout + AdminDashboard
2. **Create Admin User** → Use Firebase Console or setUserRole()
3. **Test** → Try accessing admin panel with admin/non-admin accounts
4. **Deploy** → Push to production

---

**Need more help?**
- See `ROLE_BASED_AUTH_GUIDE.md` for detailed guide
- See `ARCHITECTURE.md` for system diagrams
- See `INTEGRATION_EXAMPLE.md` for route setup
- See component JSDoc comments for function details

