

from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator

class Dish(models.Model):
    CATEGORY_CHOICES = [
        ('South Indian', 'South Indian'),
        ('North Indian', 'North Indian'),
        ('Chinese', 'Chinese'),
        ('Biryani', 'Biryani'),
        # Add more as needed
    ]
    TYPE_CHOICES = [
        ('Veg', 'Veg'),
        ('Non-Veg', 'Non-Veg'),
        
    ]
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    image = models.ImageField(upload_to='dish_images/')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES,default="Main Course")
    dish_type  = models.CharField(max_length=20, choices=TYPE_CHOICES, default='Veg')

    def __str__(self):
        return self.name



class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    mobile_number = models.CharField(max_length=15, unique=True)
    email = models.EmailField(max_length=100)  # Add email field
    name = models.CharField(max_length=100)    # Add name field

    def __str__(self):
        return self.name