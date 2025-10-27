from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin

# ---------- RÔLES ----------
class Role(models.TextChoices):
    ADMINISTRATEUR = 'ADMINISTRATEUR', 'Administrateur'
    ENSEIGNANT = 'ENSEIGNANT', 'Enseignant'
    ETUDIANT = 'ETUDIANT', 'Étudiant'


# ---------- GESTIONNAIRE UTILISATEUR ----------
class UserManager(BaseUserManager):
    def create_user(self, email, nom, role, password=None):
        if not email:
            raise ValueError("Email obligatoire")
        email = self.normalize_email(email)
        user = self.model(email=email, nom=nom, role=role)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, nom, password=None):
        user = self.create_user(email, nom, Role.ADMINISTRATEUR, password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user


# ---------- MODÈLE UTILISATEUR ----------
class User(AbstractBaseUser, PermissionsMixin):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    # Champs spécifiques pour les enseignants
    departement = models.CharField(max_length=100, blank=True, null=True)
    grade = models.CharField(max_length=100, blank=True, null=True)

    # Champs spécifiques pour les étudiants
    niveau = models.CharField(max_length=50, blank=True, null=True)
    filiere = models.CharField(max_length=100, blank=True, null=True)
    matricule = models.CharField(max_length=50, unique=True, blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nom']

    def __str__(self):
        return f"{self.nom} ({self.role})"




# ---------- AUTRES MODÈLES ----------

class Salle(models.Model):
    nom = models.CharField(max_length=100)
    disponibilite = models.BooleanField(default=True)

    def __str__(self):
        return self.nom

class Cours(models.Model):
    titre = models.CharField(max_length=200)
    horaire = models.DateTimeField()
    salle = models.ForeignKey(Salle, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.titre} - {self.horaire}"

class Evenement(models.Model):
    TYPE_CHOICES = [
        ('conference', 'Conférence'),
        ('atelier', 'Atelier'),
        ('club', 'Club étudiant'),
        ('examen', 'Examen'),
    ]
    titre = models.CharField(max_length=200)
    date = models.DateTimeField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    
    # ✅ Tous les rôles peuvent organiser
    organisateur = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='evenements_org'
    )
    
    # ✅ Seuls les étudiants peuvent participer
    participants = models.ManyToManyField(
        User,
        related_name='evenements_part',
        blank=True,
        limit_choices_to={'role': Role.ETUDIANT}  # ← Restreint l'admin/enseignant
    )

    def clean(self):
        # Optionnel : validation supplémentaire au niveau modèle
        if self.organisateur.role not in [Role.ADMINISTRATEUR, Role.ENSEIGNANT, Role.ETUDIANT]:
            raise ValidationError("L'organisateur doit être un utilisateur valide (admin, enseignant ou étudiant).")
        super().clean()

    def __str__(self):
        return f"{self.titre} ({self.type}) le {self.date}"


class Classe(models.Model):
    nom = models.CharField(max_length=50)
    niveau = models.CharField(max_length=50)
    filiere = models.CharField(max_length=100)
    capacite_max = models.PositiveIntegerField(default=20)  # nombre maximum d'étudiants
    etudiants = models.ManyToManyField(
        'User',
        limit_choices_to={'role': Role.ETUDIANT},
        related_name='classes',
        blank=True
    )

    def __str__(self):
        return f"{self.nom} ({self.niveau} - {self.filiere})"

    def clean(self):
        # Vérifier que le nombre d'étudiants ne dépasse pas la capacité maximale
        if self.etudiants.count() > self.capacite_max:
            raise ValidationError(f"Cette classe ne peut pas dépasser {self.capacite_max} étudiants.")
        super().clean()
