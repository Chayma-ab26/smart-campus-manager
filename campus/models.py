from django.db import models

from django.core.exceptions import ValidationError

class Role(models.TextChoices):
    ADMINISTRATEUR = 'ADMINISTRATEUR', 'Administrateur'
    ENSEIGNANT = 'ENSEIGNANT', 'Enseignant'
    ETUDIANT = 'ETUDIANT', 'Étudiant'

class User(models.Model):
    nom = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    motDePasse = models.CharField(max_length=128)
    role = models.CharField(max_length=20, choices=Role.choices)

    def __str__(self):
        return f"{self.nom} ({self.get_role_display()})"

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