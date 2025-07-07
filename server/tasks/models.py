from django.db import models

class Category(models.Model):
  name = models.CharField(max_length=100)
  usage_count = models.IntegerField(default=0)

  def __str__(self):
    return self.name
  
class ContextEntry(models.Model):
  SOURCE_CHOICES = [
    ('whatsapp', 'Whatsapp'),
    ('email', 'Email'),
    ('notes', 'Notes')
  ]

  content = models.TextField()
  source_type = models.CharField(max_length=20, choices=SOURCE_CHOICES)
  timestamp = models.DateTimeField(auto_now_add=True)
  processed_insight = models.TextField(blank=True)

class Task(models.Model):
  STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('done', 'Done'),
  ]

  title = models.CharField(max_length=200)
  description = models.TextField()
  category = models.ForeignKey(Category, null=True, on_delete=models.SET_NULL)
  priority_score = models.FloatField(default=0.0)
  deadline = models.DateTimeField(null=True, blank=True)
  status = models.CharField(max_length=20, default='pending')
  created_at = models.DateTimeField(auto_now_add=True)
  updated_at = models.DateTimeField(auto_now=True)