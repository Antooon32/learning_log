from django.urls import path, include
from . import views

app_name = "users"

urlpatterns = [
    # Django auth urls (login, logout, password reset etc.)
    path("", include("django.contrib.auth.urls")),

    # Register page
    path("register/", views.register, name="register"),

    # Async username check
    path("check-username/", views.check_username, name="check_username"),
]