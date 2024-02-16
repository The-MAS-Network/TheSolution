from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.contrib.auth import authenticate, login, logout
from .models import User
from .forms import UserForm,UserForm2, MyUserCreationForm,  MyUserCreationForm2
from .templatetags.languages import translations
import os
# from PIL import Image
# from django.conf import settings
# from .decorators import unauthenticated_user



def loginPage(request):
    page = 'login'
    option = request.session.get('option', 'en')
    if request.method == 'POST':
        lightning_address = request.POST.get('lightning_address').lower()
        password = request.POST.get('password')
        rem = request.POST.get('rem')


        # user = User.objects.get(lightning_address=lightning_address)


        user = authenticate(request, lightning_address=lightning_address, password=password)
        if user is None:
            # text = ['Invalid details']
            # return render(request, 'base/loginerr.html', {'text': text, 'option': option})
            messages.error(request, 'Invalid credentials')
        else:
            login(request, user)
            if not rem:
                request.session.set_expiry(0)
            else:
                request.session.set_expiry(None)
            messages.success(request, 'Login Successful')
            login(request, user)

            return redirect('enterpro')


    context = {'page': page, 'option': option}

    return render(request, 'base/login.html', context)


def logoutUser(request):
    logout(request)
    return redirect('home')

def registerPage(request):
    option = request.session.get('option', 'en')
    form = MyUserCreationForm(request.POST)
    if request.method == 'POST':
        if form.is_valid():
            request.session['lightning_address'] = form.cleaned_data['lightning_address']
            request.session['password1'] = form.cleaned_data['password1']
            request.session['password2'] = form.cleaned_data['password2']
            return redirect('register2')
        else:
            text = ["Invalid Credentials"]
            return render(request, 'base/loginerr.html', {'text': text, 'option': option})
    return render(request, 'base/register.html', {'form':form, 'option': option})


def registerPage2(request):
    option = request.session.get('option', 'en')
    form = MyUserCreationForm2(request.POST)
    if request.method == 'POST':
        nickname = request.POST.get('nick_name')
        lightning_address = request.session.get('lightning_address')
        password1 = request.session.get('password1')
        password2 = request.session.get('password2')
        user = User.objects.create_user(nick_name=nickname, username=lightning_address,
                    lightning_address=lightning_address, language=option,
                    password=password1)
        user.save()
        return redirect('login')
    return render(request, 'base/register2.html', {'form': form, 'option': option})


def home(request):
    option = request.session.get('option', 'en')
    return render(request, 'base/The solution-Get Started.html', {'option': option})

def language(request):
    option = request.session.get('option', 'en')
    if request.method == 'POST':
        option = request.POST.get('selectedvalue', 'en')
        request.session['option'] = option
        return redirect('home')
    return render(request, 'base/Language.html', {'option': option})

def languages(request):
    if request.method == 'POST':
        user = request.user
        option = request.POST.get('selectedvalue')
        user.language = option
        user.save()
        return redirect('languages')
    return render(request, 'base/Language2.html',)

def avatar(request):
    if request.method == 'POST':
        user = request.user
        option = request.POST.get('selected_option')
        user.dp = option
        user.save()
        messages.success(request, 'Avatar updated Successfully')
        return redirect('update-user')
    return render(request, 'base/avatar.html', {})

@login_required(login_url='login')
def userProfile(request, pk):
    user = User.objects.get(id=pk)
    context = {'user':user}
    return render(request, 'base/Profile Logout.html', context)

@login_required(login_url='login')
def enterpro(request):
    return render(request, 'base/enterpro.html')

@login_required(login_url='login')
def updateUser(request):
    if request.method == 'POST':
        user = request.user
        nn = request.POST.get('nick_name')
        user.nick_name = nn
        user.save()
        messages.success(request, 'Profile updated Successfully')
        return redirect('update-user')


    return render(request, 'base/Update Profile.html')




