from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tasks.views import TaskViewSet, CategoryViewSet, ContextEntryViewSet, ai_suggest_view, edit_task

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'context', ContextEntryViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/ai-suggest/', ai_suggest_view),
    path('api/tasks/<int:task_id>/edit/', edit_task, name='edit-task'),
]
