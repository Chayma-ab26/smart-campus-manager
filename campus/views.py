from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer, UserCreateSerializer, UserDetailSerializer
from .models import User
from .permissions import IsAdminUserCustom





class LoginAPIView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'nom': user.nom,
                'email': user.email,
                'role': user.role
            }
        }, status=status.HTTP_200_OK)


# ✅ Créer un utilisateur (enseignant / étudiant)
class AdminCreateUserAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [IsAuthenticated, IsAdminUserCustom]


# ✅ Liste complète des utilisateurs (réservé à l'admin)
class AdminListUsersAPIView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated, IsAdminUserCustom]


# ✅ Voir, mettre à jour ou supprimer un utilisateur
class AdminManageUserAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated, IsAdminUserCustom]


# ✅ Chaque utilisateur voit ses propres infos
class MeAPIView(generics.RetrieveAPIView):
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user