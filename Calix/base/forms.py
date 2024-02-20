from django.forms import ModelForm
from django.contrib.auth.forms import UserCreationForm
from .models import User
from django import forms
from django.contrib.auth.forms import PasswordResetForm

class MyUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['lightning_address']

class MyUserCreationForm2(UserCreationForm):
    class Meta:
        model = User
        fields = ['nick_name']


class UserForm(ModelForm):
    foot = [
       ('en', ('English')),
       ('esp', ('Spanish')),
       ('fr', ('French')),
        ('it', ('Italian')),
        ('de', ('German')),
   ]

    language = forms.ChoiceField(choices=foot)
    class Meta:
        model = User
        fields = ['dp', 'lightning_address','language', 'nick_name']

class UserForm2(ModelForm):
    class Meta:
        model = User
        fields = ['nick_name']





