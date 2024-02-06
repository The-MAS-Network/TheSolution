from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.contrib.auth import authenticate, login, logout
from .models import User
from .forms import UserForm,UserForm2, MyUserCreationForm
from .templatetags.languages import translations
import os
from PIL import Image
from django.conf import settings
# from .decorators import unauthenticated_user


def loginPage(request):
    page = 'login'
    option = request.session.get('option', 'en')
    if request.method == 'POST':
        lightning_address = request.POST.get('lightning_address').lower()
        password = request.POST.get('password')
        rem = request.POST.get('rem')

        try:
            user = User.objects.get(lightning_address=lightning_address)
        except:
            text = ['That User does not exist']
            return render(request, 'base/loginerr.html', {'text': text})

        user = authenticate(request, lightning_address=lightning_address, password=password)
        if user is not None:
            login(request, user)
            if not rem:
                request.session.set_expiry(0)
            else:
                request.session.set_expiry(None)
            login(request, user)

            return redirect('enterpro')
        else:
            text = ['Username OR password is incorrect']
            return render(request, 'base/loginerr.html', {'text': text})

    context = {'page': page, 'option': option}

    return render(request, 'base/login.html', context)


def logoutUser(request):
    logout(request)
    return redirect('home')


def registerPage(request):
    form = MyUserCreationForm()
    option = request.session.get('option', 'en')
    if request.method == 'POST':
        form = MyUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.language = option
            user.nick_name = request.POST.get('nick')
            user.save()

            login(request, user)
            return redirect('enterpro')
        else:
            text = ["Your password must contain at least 8 characters.",
                   "Your password can't be entirely numeric.",
                   "Your password can't be a commonly used password."]
            return render(request, 'base/loginerr.html', {'text': text,'option': option})


    return render(request, 'base/register.html', {'form': form, 'option': option})


def home(request):
    option = request.session.get('option', 'en')
    return render(request, 'base/The solution-Get Started.html', {'option': option})

def language(request):
    option = request.session.get('option', 'en')
    if request.method == 'POST':
        option = request.POST.get('selected_option', 'en')
        request.session['option'] = option
        return redirect('home')
    return render(request, 'base/Language.html', {'option': option})

def languages(request):
    if request.method == 'POST':
        user = request.user
        option = request.POST.get('selected_option')
        user.language = option
        user.save()
        return redirect('enterpro')
    return render(request, 'base/Language2.html',)

def avatar(request):
    if request.method == 'POST':
        user = request.user
        option = request.POST.get('selected_option')
        user.dp = option
        user.save()
        return redirect('update-user')
    return render(request, 'base/avatar.html', {})


def userProfile(request, pk):
    user = User.objects.get(id=pk)
    context = {'user':user}
    return render(request, 'base/Profile Logout.html', context)

@login_required(login_url='login')
def enterpro(request):
    return render(request, 'base/enterpro.html')

@login_required(login_url='login')
def updateUser(request):
    user = request.user
    form = UserForm2(instance=user)

    if request.method == 'POST':
        form = UserForm2(request.POST, request.FILES, instance=user)
        if form.is_valid():
            form.save()
            images_folder = os.path.join(settings.BASE_DIR, 'static/images')
            target_size = (500, 500)
            max_size_in_bytes = 100 * 1024  # 100KB

            for filename in os.listdir(images_folder):
                if filename.endswith(('.png', '.jpg', '.jpeg')):
                    image_path = os.path.join(images_folder, filename)
                    image_size_bytes = os.path.getsize(image_path)
                    if image_size_bytes > max_size_in_bytes:
                        image = Image.open(image_path)
                        image.thumbnail(target_size)
                        image.save(image_path)

            return redirect('enterpro')

    return render(request, 'base/Update Profile.html', {'form': form})







