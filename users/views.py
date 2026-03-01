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
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.http import require_GET

@require_GET
def check_username(request):
    username = (request.GET.get("username") or "").strip()

    # якщо пусто — не показуємо як "taken"
    if not username:
        return JsonResponse({"ok": False, "available": False, "reason": "empty"})

    exists = User.objects.filter(username__iexact=username).exists()
    return JsonResponse({
        "ok": True,
        "available": (not exists),
    })