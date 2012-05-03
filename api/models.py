from django.contrib.auth.models import User
from django.db import models


ORDERING_CHOICES = (
	('today', 'Today'),
	('by_date', 'Order By Date'),
	('older_than_month', 'Older Than a Month'),
)


class Profile(models.Model):
	settings = models.TextField() # JSON blob
	user = models.OneToOneField(to=User)


class Clock(models.Model):
	position = models.IntegerField()
	profile = models.ForeignKey(to=Profile)


class ItemList(models.Model):
	position = models.IntegerField()
	list_order = models.CharField(max_length=64, choices=ORDERING_CHOICES)
	profile = models.ForeignKey(to=Profile)


class Item(models.Model):
	order = models.IntegerField()
	done = models.BooleanField(default=False)
	text = models.TextField()
	created = models.DateTimeField(auto_now_add=True)
	expiry = models.DateTimeField()
	item_list = models.ForeignKey(to=ItemList)
