from rest_framework import serializers
from django.contrib.auth import authenticate
from django.db import models
from .models import User, Role, Classe  # Assure-toi d'importer Classe

# ---------- LOGIN ----------
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
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

        # Validation pour enseignants
        if role == Role.ENSEIGNANT:
            if not data.get('departement'):
                raise serializers.ValidationError({
                    "departement": "Le département est obligatoire pour un enseignant"
                })

        # Validation pour étudiants
        elif role == Role.ETUDIANT:
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

        # Ajouter l'étudiant à une classe disponible
        if user.role == Role.ETUDIANT and user.niveau and user.filiere:
            classe_disponible = Classe.objects.filter(
                niveau=user.niveau,
                filiere=user.filiere
            ).annotate(
                nb_etudiants=models.Count('etudiants')
            ).filter(nb_etudiants__lt=models.F('capacite_max')).first()

            if classe_disponible:
                classe_disponible.etudiants.add(user)
            else:
                raise serializers.ValidationError(
                    f"Aucune classe disponible pour le niveau {user.niveau} et la filière {user.filiere}."
                )

        return user

class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'nom', 'prenom', 'email', 'role', 'departement', 'grade', 'niveau', 'filiere', 'matricule']

    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data.pop('password')
        return super().update(instance, validated_data)


      # ---------- CLASSE ----------

  
class ClasseSerializer(serializers.ModelSerializer):
    etudiants_count = serializers.SerializerMethodField()

    class Meta:
        model = Classe
        fields = ['id', 'nom', 'niveau', 'filiere', 'capacite_max', 'etudiants', 'etudiants_count']

    def get_etudiants_count(self, obj):
        return obj.etudiants.count()