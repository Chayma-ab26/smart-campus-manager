# TODO: Consolidate User Fields into Single Table

- [x] Update models.py: Remove EnseignantProfile and EtudiantProfile models
- [x] Update serializers.py: Modify UserCreateSerializer to set fields directly on User instead of creating profiles
- [x] Update serializers.py: Modify UserDetailSerializer to include role-specific fields directly in the response
- [x] Check views.py: Ensure no breaking changes (likely none needed)
- [x] Generate migrations: Run makemigrations to create migration for removing profile models (no changes detected, models already removed)
- [x] Apply migrations: Run migrate to apply changes to database (no migrations to apply)
