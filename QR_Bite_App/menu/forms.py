from django import forms
from .models import Profile
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User


class SignUpForm(forms.ModelForm):
    mobile_number = forms.CharField(max_length=15, widget=forms.TextInput(attrs={'placeholder': 'Enter your mobile number'}))
    email = forms.EmailField(widget=forms.EmailInput(attrs={'placeholder': 'Enter your email address'}))
    name = forms.CharField(max_length=100, widget=forms.TextInput(attrs={'placeholder': 'Enter your name'}))
    
    class Meta:
        model = Profile
        fields = ['mobile_number', 'email', 'name']

    def clean_mobile_number(self):
        mobile_number = self.cleaned_data.get('mobile_number')
        if Profile.objects.filter(mobile_number=mobile_number).exists():
            raise ValidationError("Mobile number is already registered!")
        return mobile_number

class LoginForm(forms.Form):
    mobile_number = forms.CharField(max_length=15, widget=forms.TextInput(attrs={'placeholder': 'Enter your mobile number'}))
