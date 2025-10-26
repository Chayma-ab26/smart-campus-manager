# TODO: Convert Create and Edit User to SweetAlert Modals

## Tasks
- [x] Modify AdminUsersList.jsx to add "Create User" button
- [x] Integrate SweetAlert2 for Create User modal
- [x] Integrate SweetAlert2 for Edit User modal
- [x] Remove separate AdminCreateUser.jsx and AdminEditUser.jsx pages
- [x] Update routing in App.js if necessary
- [ ] Test the modals functionality

## Information Gathered
- AdminUsersList.jsx: Displays list of users with edit and delete buttons. Currently navigates to separate pages for create/edit.
- AdminCreateUser.jsx: Full page form for creating users.
- AdminEditUser.jsx: Full page form for editing users.
- User wants create and edit functionality in SweetAlert modals instead of separate pages.

## Plan
1. Install SweetAlert2 (done).
2. Create modal components for create and edit forms using SweetAlert2.
3. Update AdminUsersList.jsx to use modals instead of navigating to separate components.
4. Remove or deprecate AdminCreateUser.jsx and AdminEditUser.jsx if no longer needed.
5. Ensure all form logic is preserved in the modals.

## Dependent Files
- src/admin/users/AdminUsersList.jsx (main changes)
- src/admin/users/AdminCreateUser.jsx (to be removed or integrated)
- src/admin/users/AdminEditUser.jsx (to be removed or integrated)
- src/App.js (check routing)

## Followup Steps
- Test create user modal
- Test edit user modal
- Verify delete functionality still works
- Check if any routing needs update
