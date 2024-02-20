from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    lightning_address = models.CharField(max_length=200,unique=True, null=True)
    username = models.CharField(max_length=200, unique=False, null=True)
    dp = models.ImageField(null=True, default="avatar.svg")
    language = models.CharField(max_length=200, null=True)
    nick_name = models.CharField(max_length=200, null=True)


    USERNAME_FIELD = 'lightning_address'
    REQUIRED_FIELDS = []
