from django.urls import path
from .views import LoginAPIView, AdminCreateUserAPIView, AdminListUsersAPIView, AdminManageUserAPIView, MeAPIView
from .views import ClasseListCreateAPIView, ClasseRetrieveUpdateDestroyAPIView


urlpatterns = [
    path('login/', LoginAPIView.as_view(), name='login'),
    path('users/create/', AdminCreateUserAPIView.as_view(), name='create_user'),
    path('users/', AdminListUsersAPIView.as_view(), name='list_users'),
    path('users/<int:pk>/', AdminManageUserAPIView.as_view(), name='manage_user'),
    path('me/', MeAPIView.as_view(), name='me'),


    path('classes/', ClasseListCreateAPIView.as_view(), name='list-create-classe'),
    path('classes/<int:pk>/', ClasseRetrieveUpdateDestroyAPIView.as_view(), name='manage-classe'),
    
    ]
