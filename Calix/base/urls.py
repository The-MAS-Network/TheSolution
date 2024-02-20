from django.urls import path
# from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('login/', views.loginPage, name="login"),
    path('logout/', views.logoutUser, name="logout"),
    path('register/', views.registerPage, name="register"),
    path('register/register2', views.registerPage2, name="register2"),
    path('enterpro', views.enterpro, name="enterpro"),
    path('avatar', views.avatar, name="avatar"),
    path('language/', views.language, name="language"),
    path('languages/', views.languages, name="languages"),
    path('', views.home, name="home"),
    path('profile/<str:pk>/', views.userProfile, name="user-profile"),
    path('update-user/', views.updateUser, name="update-user"),

]
