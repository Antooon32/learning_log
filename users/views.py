from django.shortcuts import render, redirect
from django.contrib.auth import login
from .forms import MyRegisterForm

def register(request):
    if request.method == "POST":
        form = MyRegisterForm(request.POST)
        if form.is_valid():
            new_user = form.save()
            login(request, new_user)

            next_url = request.POST.get("next")
            if next_url:
                return redirect(next_url)

            return redirect("learning_logs:index")
    else:
        form = MyRegisterForm()

    return render(request, "registration/register.html", {"form": form})