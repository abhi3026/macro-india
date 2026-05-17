## Plan

1. **Fix role-loading timing**
   - Update the auth hook so `loading` stays true until both the user session and role query are complete.
   - Ensure auth state changes also wait for roles before allowing protected routes to evaluate access.

2. **Handle role query failures safely**
   - Track role-loading errors and clear roles only when the role query actually finishes.
   - Avoid showing “not authorised” during the short moment between login and role fetch.

3. **Improve the protected admin route state**
   - Keep showing the loading screen while roles are being fetched.
   - Only show “not authorised” after the user is logged in and the role fetch has completed with no roles.

## Technical details

- The backend already shows `abhigourav13@gmail.com` has the `admin` role.
- The issue is in `src/hooks/useAuth.tsx`: `onAuthStateChange` sets the user immediately, but role loading is deferred with `setTimeout`, so `ProtectedAdminRoute` can see `user` + empty `roles` and incorrectly render the unauthorized message.
- No database changes are needed.