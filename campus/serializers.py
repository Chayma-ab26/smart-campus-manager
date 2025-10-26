from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Role


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




# ---------- UTILISATEUR ----------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'nom', 'email', 'role']


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'nom', 'prenom', 'email', 'password', 'role', 
                 'departement', 'grade', 'niveau', 'filiere', 'matricule']

    def validate(self, data):
        role = data.get('role')
        
        # Validation pour les enseignants
        if role == 'ENSEIGNANT':
            if not data.get('departement'):
                raise serializers.ValidationError({
                    "departement": "Le département est obligatoire pour un enseignant"
                })
        
        # Validation pour les étudiants
        elif role == 'ETUDIANT':
            required_fields = ['niveau', 'filiere', 'matricule']
            for field in required_fields:
                if not data.get(field):
                    raise serializers.ValidationError({
                        field: f"Le champ {field} est obligatoire pour un étudiant"
                    })
        
        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'nom', 'prenom', 'email', 'role', 'departement', 'grade', 'niveau', 'filiere', 'matricule']
    

    def update(self, instance, validated_data):
        # Ne pas permettre la modification du mot de passe via cette vue
        if 'password' in validated_data:
            validated_data.pop('password')
        return super().update(instance, validated_data)