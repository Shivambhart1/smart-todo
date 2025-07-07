from rest_framework import serializers
from .models import Task, Category, ContextEntry
from .ai import get_ai_suggestions

class TaskSerializer(serializers.ModelSerializer):
  category = serializers.SlugRelatedField(
    queryset=Category.objects.all(),
    slug_field='name',
    allow_null=True,
  )
  class Meta:
    model = Task
    fields = '__all__'
  
class CategorySerializer(serializers.ModelSerializer):
  class Meta:
    model = Category
    fields = '__all__'

class ContextEntrySerializer(serializers.ModelSerializer):
  class Meta:
    model = ContextEntry
    fields = '__all__'

class TaskSuggestionSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    context = serializers.CharField(allow_blank=True)

    def create(self, validated_data):
        return get_ai_suggestions(
            title=validated_data["title"],
            context=validated_data["context"]
        )