from db import models


ORDERING_CHOICES = (
	('today', 'Today'),
	('by_date', 'Order By Date'),
	('by_day', 'By Day'),
)



class Clock(models.Model):
	position = models.IntegerField()


class Todo(models.Model):
	position = models.IntegerField()
	list_display = models.CharField(max_length=16, choices=ORDERING_CHOICES)


class TodoItem(models.Model):
	order = models.IntegerField()
	done = models.BooleanField(default=False)
	text = models.TextField()
	created = models.DateTimeField(auto_now_add=True)
	expiry = models.DateTimeField()



class ShoppingList(models.Model):
	position = models.IntegerField()