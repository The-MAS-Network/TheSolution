from django.urls import path
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('login/', views.loginPage, name="login"),
    path('logout/', views.logoutUser, name="logout"),
    path('register/', views.registerPage, name="register"),
    path('enterpro', views.enterpro, name="enterpro"),
    path('avatar', views.avatar, name="avatar"),
    path('language/', views.language, name="language"),
    path('languages/', views.languages, name="languages"),
    path('', views.home, name="home"),
    path('profile/<str:pk>/', views.userProfile, name="user-profile"),
    path('update-user/', views.updateUser, name="update-user"),

    path('reset_password/',
     auth_views.PasswordResetView.as_view(template_name="base/password_reset.html"),
     name="reset_password"),

    path('reset_password_sent/',
        auth_views.PasswordResetDoneView.as_view(template_name="base/password_reset_sent.html"),
        name="password_reset_done"),

    path('reset/<uidb64>/<token>/',
     auth_views.PasswordResetConfirmView.as_view(template_name="base/password_reset_form.html"),
     name="password_reset_confirm"),

    path('reset_password_complete/',
        auth_views.PasswordResetCompleteView.as_view(template_name="base/password_reset_done.html"),
        name="password_reset_complete"),

]
