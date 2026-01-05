from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from .forms import MyRegisterForm

# Create your views here.

def register(request):
    """Register a new user."""
    if request.method != 'POST':
        # Показати порожню форму регістрації
        form = MyRegisterForm()
    else:
        # Опрацювати заповнену форму.
        form = MyRegisterForm(data=request.POST)

        if form.is_valid():
            new_user = form.save()
            # Авторизувати користувача та скерувати його на головну сторінку.
            login(request, new_user)
            return redirect('learning_logs:index')
        
    # Показати порожню фбо недійсну форму.
    context = {'form': form}
    return render(request, 'registration/register.html', context)