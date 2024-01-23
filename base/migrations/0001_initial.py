# Generated by Django 3.2.7 on 2023-12-31 22:09

import datetime
from django.conf import settings
import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
from django.utils.timezone import utc


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('firstname', models.CharField(max_length=200, null=True)),
                ('lastname', models.CharField(max_length=200, null=True)),
                ('username', models.CharField(max_length=200, null=True)),
                ('email', models.EmailField(max_length=254, null=True, unique=True)),
                ('position', models.CharField(max_length=200, null=True)),
                ('dp', models.ImageField(default='avatar.svg', null=True, upload_to='')),
                ('phone', models.IntegerField(blank=True, null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Pinbin',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, null=True)),
                ('pin', models.IntegerField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Pins',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pin', models.IntegerField(null=True, unique=True)),
                ('email', models.EmailField(max_length=254, null=True)),
                ('firstname', models.CharField(max_length=200, null=True)),
                ('lastname', models.CharField(max_length=200, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True, null=True)),
                ('expiration_date', models.DateTimeField(default=datetime.datetime(2024, 2, 1, 22, 9, 17, 410053, tzinfo=utc), null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Worldcup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('location', models.CharField(blank=True, max_length=200, null=True)),
                ('name', models.CharField(blank=True, max_length=200, null=True)),
                ('numtpg', models.IntegerField(blank=True, null=True)),
                ('adv', models.IntegerField(blank=True, null=True)),
                ('numgroup', models.IntegerField(blank=True, null=True)),
                ('teams', models.JSONField(blank=True, null=True)),
                ('type', models.CharField(blank=True, max_length=200, null=True)),
                ('teamcode', models.JSONField(blank=True, null=True)),
                ('maxplayer', models.IntegerField(blank=True, null=True)),
                ('fixtures', models.JSONField(blank=True, null=True)),
                ('fixes', models.JSONField(blank=True, null=True)),
                ('advanced', models.JSONField(blank=True, null=True)),
                ('finished', models.JSONField(blank=True, null=True)),
                ('players', models.JSONField(blank=True, null=True)),
                ('fixscorers', models.JSONField(blank=True, null=True)),
                ('fixassisters', models.JSONField(blank=True, null=True)),
                ('updated', models.DateTimeField(auto_now=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('host', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]