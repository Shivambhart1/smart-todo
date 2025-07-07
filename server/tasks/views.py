from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Task, Category, ContextEntry
from .serializers import TaskSerializer, CategorySerializer, ContextEntrySerializer
from .ai import get_ai_suggestions

class TaskViewSet(viewsets.ModelViewSet):
  queryset = Task.objects.all().order_by('-priority_score')
  serializer_class = TaskSerializer

class CategoryViewSet(viewsets.ModelViewSet):
  queryset = Category.objects.all()
  serializer_class = CategorySerializer

class ContextEntryViewSet(viewsets.ModelViewSet):
  queryset = ContextEntry.objects.all().order_by('-timestamp')
  serializer_class = ContextEntrySerializer

@api_view(['POST'])
def ai_suggest_view(request):
  title = request.data.get('title', '')
  context_data = request.data.get('context', '')

  if not title or not context_data:
    return Response({"error": "Title and context are required."}, status=status.HTTP_400_BAD_REQUEST)
  
  suggestions = get_ai_suggestions(title, context_data)
  return Response(suggestions, status=status.HTTP_200_OK)

@api_view(['PUT', 'PATCH'])
def edit_task(request, task_id):
  try:
    task = Task.objects.get(id=task_id)
  except Task.DoesNotExist:
    return Response({'error': 'Task not found.'}, status=status.HTTP_404_NOT_FOUND)
  serializer = TaskSerializer(task, data=request.data, partial=True) 
  if serializer.is_valid():
    serializer.save()
    return Response(serializer.data)
  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)