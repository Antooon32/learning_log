from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import Http404

# Create your views here.

from .models import Topic, Entry
from .forms import TopicForm, EntryForm

def check_topic_owner(topic, request):
    """Перевіряє, чи є поточний користувач власником теми."""
    if topic.owner != request.user:
        raise Http404

def index(request):
    """Головна сторінка "Журналу спостережень"."""
    return render(request, 'learning_logs/index.html')

@login_required
def topics(request):
    """Відображає всі теми або результати пошуку."""
    query = request.GET.get('q')

    topics_query = Topic.objects.filter(owner=request.user).prefetch_related('entry_set').order_by('date_added')
    
    if query:
        # Фільтруємо теми користувача
        topics = topics_query.filter(text__icontains=query)
    else:
        # Якщо пошука немає показуємо всі теми користувача
        topics = topics_query
    
    context = {'topics': topics, 'search_query': query}
    return render(request, 'learning_logs/topics.html', context)

@login_required
def topic(request, topic_id):
    """Show a single topic and all its entries."""
    topic = Topic.objects.get(id=topic_id)
    # Пересвідчитись, що тема належить поточному користовачеві.
    check_topic_owner(topic, request)
    entries = topic.entry_set.order_by('-date_added')
    context = {'topic': topic, 'entries': entries}
    return render(request, 'learning_logs/topic.html', context)

@login_required
def new_topic(request):
    """Add a new topic."""
    if request.method != 'POST':
        # Жодних даних не створено; створити порожню форму.
        form = TopicForm()
    else:
        # Відправлений POST; обробити дані.
        form = TopicForm(data=request.POST)
        if form.is_valid():
            new_topic = form.save(commit=False)
            new_topic.owner = request.user
            new_topic.save()
            return redirect('learning_logs:topics')
        
    # Показати порожню або не дійсну форму.
    context = {'form': form}
    return render(request, 'learning_logs/new_topic.html', context)

@login_required
def new_entry(request, topic_id):
    """Add a new entry for a particular topic."""
    topic = Topic.objects.get(id=topic_id)
    check_topic_owner(topic, request)
    if request.method != 'POST':
        # Жодних даних не надіслано; створити порожню форму.
        form = EntryForm()
    else:
        # Отримані дані у POST запиті; обробити дані.
        form = EntryForm(data=request.POST)
        if form.is_valid():
            new_entry = form.save(commit=False)
            new_entry.topic = topic
            new_entry.save()
            return redirect('learning_logs:topic', topic_id=topic_id)
        
    # Показати порожню або недійсну форму
    context = {'topic': topic, 'form': form}
    return render(request, 'learning_logs/entry.html', context)

@login_required
def edit_entry(request, entry_id):
    """Edit an existing entry."""
    entry = Entry.objects.get(id=entry_id)
    topic = entry.topic
    check_topic_owner(topic, request)

    if request.method != 'POST':
        # Initial request; pre-fill form with the current entry.
        form = EntryForm(instance=entry)
    else:
        # POST data submitted; process data.
        form = EntryForm(instance=entry, data=request.POST)
        if form.is_valid():
            form.save()
            return redirect('learning_logs:topic', topic_id=topic.id)
        
    context = {'entry': entry, 'topic': topic, 'form': form}
    return render(request, 'learning_logs/entry.html', context)

@login_required
def delete_topic(request, topic_id):
    """Видаляє тему і всі пов'язані з нею записи"""
    topic = Topic.objects.get(id=topic_id)
    check_topic_owner(topic, request)

    if request.method == 'POST':
        topic.delete()
        return redirect('learning_logs:topics')

    context = {'topic': topic}
    return render(request, 'learning_logs/delete_topic_confirm.html', context)

@login_required
def delete_entry(request, entry_id):
    """Видаляє конкретний запис."""
    entry = Entry.objects.get(id=entry_id)
    topic = entry.topic
    check_topic_owner(topic, request)

    if request.method == 'POST':
        entry.delete()
        return redirect('learning_logs:topic', topic_id=topic.id)

    context = {'entry': entry, 'topic': topic}
    return render(request, 'learning_logs/delete_entry_confirm.html', context) 