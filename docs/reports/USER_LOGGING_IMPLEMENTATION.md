````markdown
# User Data Logging & Duplicate Signup Prevention

## Implementation Summary

### Changes Made

#### 1. Frontend (`web/app/login/page.tsx`)
- **Added duplicate email checking** before signup using `fetchSignInMethodsForEmail()`
- **Implemented user data logging** to Firestore `users` collection
- **Automatic mode switching**: If user tries to signup with existing email, automatically switches to login mode

... (canonicalized and moved)

````
