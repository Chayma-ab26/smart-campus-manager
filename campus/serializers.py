from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Role, EnseignantProfile, EtudiantProfile


# serializers.py
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)  # Change from motDePasse to password

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])  # Change here too
        if user is None:
            raise serializers.ValidationError("Email ou mot de passe incorrect")
        data['user'] = user
        return data

# ---------- PROFILS ----------
class EnseignantProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnseignantProfile
        fields = ['departement', 'grade']


class EtudiantProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EtudiantProfile
        fields = ['niveau', 'filiere', 'matricule']


# ---------- UTILISATEUR ----------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'nom', 'email', 'role']


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    enseignant_profile = EnseignantProfileSerializer(required=False)
    etudiant_profile = EtudiantProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ['id', 'nom', 'email', 'password', 'role', 'enseignant_profile', 'etudiant_profile']

    def create(self, validated_data):
        password = validated_data.pop('password')
        role = validated_data.get('role')
        enseignant_data = validated_data.pop('enseignant_profile', None)
        etudiant_data = validated_data.pop('etudiant_profile', None)

        user = User.objects.create(
            email=validated_data['email'],
            nom=validated_data['nom'],
            role=role
        )
        user.set_password(password)
        user.save()

        if role == Role.ENSEIGNANT and enseignant_data:
            EnseignantProfile.objects.create(user=user, **enseignant_data)
        elif role == Role.ETUDIANT and etudiant_data:
            EtudiantProfile.objects.create(user=user, **etudiant_data)

        return user


class UserDetailSerializer(serializers.ModelSerializer):
    enseignant_profile = EnseignantProfileSerializer(read_only=True)
    etudiant_profile = EtudiantProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'nom', 'email', 'role', 'enseignant_profile', 'etudiant_profile']