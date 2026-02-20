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

        # 1) залишаємо тільки потрібні поля (твоя логіка)
        allowed_fields = ["username", "password1", "password2"]
        for field_name in list(self.fields.keys()):
            if field_name not in allowed_fields:
                del self.fields[field_name]

        # 2) правильні help_text як на твоєму скріні
        self.fields["username"].help_text = (
            "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
        )
        self.fields["password1"].help_text = (
            "Your password can’t be too similar to your other personal information.<br>"
            "Your password must contain at least 8 characters.<br>"
            "Your password can’t be a commonly used password.<br>"
            "Your password can’t be entirely numeric."
        )
        self.fields["password2"].help_text = (
            "Enter the same password as before, for verification."
        )

        # 3) атрибути для красивого фронта + автозаповнення
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

    # 4) серверна перевірка username (без сюрпризів типу User та user)
    def clean_username(self):
        username = (self.cleaned_data.get("username") or "").strip()
        if not username:
            raise ValidationError("This field is required.")

        # Django правило символів
        # (можна не дублювати, але корисно для чистого меседжу)
        import re
        if not re.match(r"^[\w.@+-]+$", username):
            raise ValidationError("Letters, digits and @/./+/-/_ only.")

        if len(username) > 150:
            raise ValidationError("Must be 150 characters or fewer.")

        if User.objects.filter(username__iexact=username).exists():
            raise ValidationError("This username is already taken.")

        return username

    # 5) серверна валідація пароля через AUTH_PASSWORD_VALIDATORS
    def clean_password1(self):
        pw = self.cleaned_data.get("password1") or ""
        validate_password(pw, user=None)
        return pw