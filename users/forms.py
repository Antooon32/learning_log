from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

class MyRegisterForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ("username",)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        allowed_fields = ['username', 'password1', 'password2']
        
        all_fields = list(self.fields.keys())
        
        for field_name in all_fields:
            if field_name not in allowed_fields:
                del self.fields[field_name]