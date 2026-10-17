# Role-Based Authentication System Architecture

## System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        APPLICATION FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ 1. USER SIGNUP/LOGIN                                                │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ SignUp.jsx / Login.jsx                                          │ │
│ │     ↓                                                            │ │
│ │ AuthProvider.creatUser() / signInUser()                         │ │
│ │     ↓                                                            │ │
│ │ Firebase Authentication (auth.js)                               │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 2. ROLE FETCHING                                                    │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ AuthProvider.fetchUserRole()                                    │ │
│ │     ↓                                                            │ │
│ │ Check Firestore: db.collection('users').doc(uid)               │ │
│ │     ↓                                                            │ │
│ │ Role exists? YES → setUserRole()                                │ │
│ │            NO  → Create new user doc with role: "user"          │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 3. AUTH CONTEXT UPDATE                                              │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ AuthContext.Provider stores:                                    │ │
│ │ - user (Firebase user object)                                   │ │
│ │ - userRole ("admin", "moderator", "user")                       │ │
│ │ - loading (boolean)                                              │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ 4. PAGE ACCESS                                                      │
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │ PrivetRout component checks:                                    │ │
│ │ ├─ Is user authenticated? (user !== null)                       │ │
│ │ ├─ Does user have required role? (userRole === requiredRole)    │ │
│ │ │                                                                │ │
│ │ ├─ YES → Render children                                        │ │
│ │ └─ NO  → Show appropriate error modal                           │ │
│ └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     FRONTEND ARCHITECTURE                           │
└─────────────────────────────────────────────────────────────────────┘

                            main.jsx
                        (App Entry Point)
                              ↓
                    ┌─────────────────┐
                    │  AuthProvider   │  ← Wraps entire app
                    │  (Auth Context) │
                    └────────┬────────┘
                             ↓
                      ┌─────────────┐
                      │  ShopProvider
                      │ (ShopContext)│
                      └──────┬───────┘
                             ↓
               ┌─────────────────────────┐
               │   Router / Routes       │
               └─────────┬───────────────┘
                         ↓
        ┌────────────────────────────────┐
        │     Routes.jsx (Layout)        │
        ├────────────────────────────────┤
        │ ├─ NavBar                      │
        │ └─ <Outlet>                    │
        │    (Child Routes)              │
        └─────────┬──────────────────────┘
                  ↓
    ┌─────────────────────────────────┐
    │    Child Routes (Outlets)       │
    │                                 │
    │ ├─ Public routes:               │
    │ │  ├─ Home                      │
    │ │  ├─ Login                     │
    │ │  └─ Products                  │
    │ │                               │
    │ ├─ Protected routes:            │
    │ │  ├─ PrivetRout                │
    │ │  │  ├─ Cart                   │
    │ │  │  ├─ WishList               │
    │ │  │  └─ Order Page             │
    │ │                               │
    │ └─ Admin routes:                │
    │    └─ PrivetRout                │
    │       requiredRole="admin"      │
    │       ├─ AdminDashboard        │
    │       └─ AddProduct             │
    └─────────────────────────────────┘
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                   DATA FLOW: USER ACTION                            │
└─────────────────────────────────────────────────────────────────────┘

User Clicks Login
    ↓
┌──────────────────┐
│  Login Page      │  Uses: signInUser()
│                  │  ↓
└──────────────────┘  Firebase Auth
    ↓
onAuthStateChanged triggers
    ↓
┌────────────────────────────┐
│ AuthProvider checks:       │
│ - User has email?          │
│ - Call fetchUserRole()     │
│ - Store role in state      │
│ - Send JWT to backend      │
└────────────────────────────┘
    ↓
Context value updated
    ↓
Component subscribes to:
AuthContext → re-renders
    ↓
PrivetRout checks:
    ├─ user !== null?
    └─ userRole === requiredRole?
    ↓
Decision:
├─ ALLOW → render children
└─ DENY  → show access denied modal
```

## File Organization

```
korean_dewdrop/
│
├── src/
│   ├── firebase/
│   │   └── firebase.init.js          ✅ (UPDATED with Firestore)
│   │
│   ├── providers/
│   │   ├── AuthProvider.jsx          ✅ (UPDATED with roles)
│   │   └── ShopProvider.jsx
│   │
│   ├── Hooks/
│   │   ├── UseAxios.jsx
│   │   └── UseRole.jsx               ✨ (NEW - Role checking)
│   │
│   ├── utils/
│   │   └── roleUtils.js              ✨ (NEW - Role operations)
│   │
│   ├── components/
│   │   ├── Routes/
│   │   │   ├── Routes.jsx
│   │   │   ├── PrivetRout.jsx        ✅ (UPDATED with roles)
│   │   │   └── [other route files]
│   │   │
│   │   ├── AdminDashboard.jsx        ✨ (NEW - Admin panel)
│   │   │
│   │   ├── Users/
│   │   │   ├── Login.jsx
│   │   │   └── SignUp.jsx
│   │   │
│   │   └── [other components]
│   │
│   └── main.jsx                      (See INTEGRATION_EXAMPLE.md)
│
├── IMPLEMENTATION_SUMMARY.md         ✨ (NEW - This file)
├── ROLE_BASED_AUTH_GUIDE.md         ✨ (NEW - Complete guide)
└── INTEGRATION_EXAMPLE.md           ✨ (NEW - Route setup)
```

## Role Hierarchy

```
┌──────────────────────────────────────────────────────────────────┐
│                    ROLE HIERARCHY                                │
└──────────────────────────────────────────────────────────────────┘

ADMIN
├─ Full application access
├─ Can manage all users
├─ Can change any user's role
├─ Can access admin dashboard
└─ Inherits all moderator permissions

MODERATOR
├─ Can approve/reject content
├─ Can manage user-generated content
├─ Cannot manage user roles
└─ Access to moderation panel

USER (Default)
├─ Can view products
├─ Can add to cart
├─ Can place orders
├─ Cannot access admin features
└─ Cannot moderate content
```

## Firestore Database Structure

```
firestore-root
│
└── users (Collection)
    │
    ├── {userId_1} (Document)
    │   ├── uid: "userId_1"
    │   ├── email: "user@example.com"
    │   ├── role: "admin"
    │   ├── createdAt: Timestamp(2024, 1, 15)
    │   ├── updatedAt: Timestamp(2024, 1, 15)
    │   └── roleUpdatedAt: Timestamp(2024, 1, 20)
    │
    ├── {userId_2} (Document)
    │   ├── uid: "userId_2"
    │   ├── email: "user2@example.com"
    │   ├── role: "moderator"
    │   ├── createdAt: Timestamp(2024, 1, 16)
    │   ├── updatedAt: Timestamp(2024, 1, 16)
    │   └── roleUpdatedAt: Timestamp(2024, 1, 18)
    │
    └── {userId_3} (Document)
        ├── uid: "userId_3"
        ├── email: "user3@example.com"
        ├── role: "user"
        ├── createdAt: Timestamp(2024, 1, 17)
        ├── updatedAt: Timestamp(2024, 1, 17)
        └── roleUpdatedAt: (empty)
```

## Hook and Utility Usage

```
┌─────────────────────────────────────────────────────────────────┐
│                USE CASES AND WHICH TOOL TO USE                 │
└─────────────────────────────────────────────────────────────────┘

┌─ CHECKING ROLES IN COMPONENTS ─────────────────────────────────┐
│                                                                  │
│ Use Case: "Is current user an admin?"                           │
│ Tool: UseRole Hook                                              │
│ Code: const { isAdmin } = UseRole();                           │
│                                                                  │
│ Use Case: "Show admin-only button"                              │
│ Tool: PrivetRout Component                                      │
│ Code: requiredRole="admin"                                      │
│                                                                  │
│ Use Case: "Get all admins for email list"                       │
│ Tool: roleUtils.getUsersByRole()                                │
│ Code: const admins = await getUsersByRole('admin');            │
│                                                                  │
│ Use Case: "Make user an admin"                                  │
│ Tool: roleUtils.setUserRole()                                   │
│ Code: await setUserRole(userId, 'admin');                      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              REQUEST SECURITY CHECK FLOW                        │
└─────────────────────────────────────────────────────────────────┘

User Request
    ↓
┌─────────────────┐
│ Frontend Check  │  (useRole Hook / PrivetRout)
│ Role Present?   │
└────────┬────────┘
         ├─ NO → Redirect to login/access denied
         │
         └─ YES → Allow to proceed
                    ↓
         ┌─────────────────────┐
         │ Send Request to     │
         │ Backend API         │
         └────────┬────────────┘
                  ↓
         ┌──────────────────────┐
         │ Backend Verification │  ⭐ IMPORTANT
         │ - Verify JWT Token   │  (Always verify server-side)
         │ - Check User Role DB │
         │ - Check Permissions  │
         └────────┬─────────────┘
                  ├─ DENY → 403 Forbidden
                  │
                  └─ ALLOW → Process request
```

## Next Steps After Implementation

```
1. Create First Admin
   └─ Via Firebase Console or programmatically

2. Update Routes
   └─ Wrap protected routes with PrivetRout + requiredRole

3. Set Up Security Rules
   └─ Firestore rules to prevent unauthorized role changes

4. Backend Integration
   └─ Verify roles on backend for sensitive operations

5. Test Thoroughly
   ├─ Test as regular user
   ├─ Test as admin
   ├─ Test role transitions
   └─ Test access control on all protected routes

6. Deploy
   └─ Push to production with confidence
```
