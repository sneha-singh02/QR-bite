from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Dish,Profile

admin.site.register(Dish)
admin.site.register(Profile)