from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


class MyRegisterForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username", "password1", "password2")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Залишаємо тільки потрібні поля
        allowed_fields = ["username", "password1", "password2"]
        for field_name in list(self.fields.keys()):
            if field_name not in allowed_fields:
                del self.fields[field_name]

        # ❌ Повністю прибираємо Django help_text
        for field in self.fields.values():
            field.help_text = ""

        # ❌ Прибираємо стандартні required повідомлення
        for field in self.fields.values():
            field.error_messages["required"] = ""

        # Атрибути для фронта
        self.fields["username"].widget.attrs.update({
            "class": "field__input",
            "id": "id_username",
            "autocomplete": "username",
            "maxlength": "150",
        })

        self.fields["password1"].widget.attrs.update({
            "class": "field__input",
            "id": "id_password1",
            "autocomplete": "new-password",
        })

        self.fields["password2"].widget.attrs.update({
            "class": "field__input",
            "id": "id_password2",
            "autocomplete": "new-password",
        })

    # ===== SERVER VALIDATION =====

    def clean_username(self):
        username = (self.cleaned_data.get("username") or "").strip()

        if not username:
            raise ValidationError("Username is required.")

        import re
        if not re.match(r"^[\w.@+-]+$", username):
            raise ValidationError(
                "Use only letters, digits and @/./+/-/_."
            )

        if len(username) > 150:
            raise ValidationError(
                "Username must be 150 characters or fewer."
            )

        if User.objects.filter(username__iexact=username).exists():
            raise ValidationError(
                "This username is already taken."
            )

        return username

    def clean_password1(self):
        password = self.cleaned_data.get("password1") or ""
        username = self.cleaned_data.get("username") or ""

        if not password:
            raise ValidationError("Password is required.")

        # передаємо user для перевірки схожості
        temp_user = User(username=username)

        try:
            validate_password(password, user=temp_user)
        except ValidationError as e:
            # повертаємо тільки перше повідомлення
            raise ValidationError(e.messages[0])

        return password
    from django import forms

class MyRegisterForm(UserCreationForm):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields["password1"].widget.attrs.update({
            "maxlength": 16,
        })

        self.fields["password2"].widget.attrs.update({
            "maxlength": 16,
        })
        