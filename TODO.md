# TODO: Convert Create and Edit User to SweetAlert Modals

## Tasks
- [x] Modify AdminUsersList.jsx to add "Create User" button
- [x] Integrate SweetAlert2 for Create User modal
- [x] Integrate SweetAlert2 for Edit User modal
- [x] Add sub-filters for students (filiere, matricule, niveau)
- [x] Add sub-filters for teachers (departement, grade)
- [x] Remove separate AdminCreateUser.jsx and AdminEditUser.jsx pages
- [x] Update routing in App.js if necessary
- [ ] Test the modals functionality (Browser tool disabled, manual testing required)

## Information Gathered
- AdminUsersList.jsx: Displays list of users with edit and delete buttons. Currently navigates to separate pages for create/edit.
- AdminCreateUser.jsx: Full page form for creating users.
- AdminEditUser.jsx: Full page form for editing users.
- User wants create and edit functionality in SweetAlert modals instead of separate pages.
- Added sub-filters for students: filiere, matricule, and niveau filters that appear when filtering by students.

## Plan
1. Install SweetAlert2 (done).
2. Create modal components for create and edit forms using SweetAlert2 (done).
3. Add sub-filters for students in the UI (done).
4. Update AdminUsersList.jsx to use modals instead of navigating to separate components (done).
5. Remove or deprecate AdminCreateUser.jsx and AdminEditUser.jsx if no longer needed (done).
6. Ensure all form logic is preserved in the modals (done).

## Dependent Files
- src/admin/users/AdminUsersList.jsx (main changes - modals and sub-filters)
- src/admin/users/AdminCreateUser.jsx (removed)
- src/admin/users/AdminEditUser.jsx (removed)
- src/App.js (routing updated)

## Followup Steps
- Test create user modal
- Test edit user modal
- Test sub-filters functionality
- Verify delete functionality still works
- Check if any routing needs update
