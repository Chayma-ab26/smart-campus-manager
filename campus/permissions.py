from rest_framework import permissions

class IsAdminUserCustom(permissions.BasePermission):
    """
    Seuls les admins peuvent créer, modifier ou supprimer des utilisateurs.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ADMINISTRATEUR'
