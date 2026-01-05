from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import MyRegisterForm 

def register(request):
    if request.method != 'POST':
        form = MyRegisterForm()
    else:
        form = MyRegisterForm(data=request.POST)
        if form.is_valid():
            new_user = form.save()
            login(request, new_user)
            return redirect('learning_logs:index')
        
    context = {'form': form}
    return render(request, 'registration/register.html', context)