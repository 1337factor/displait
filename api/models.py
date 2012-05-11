from datetime import datetime
from django.contrib.auth.models import User
from django.db import models


ORDERING_CHOICES = (
	('today', 'Today'),
	('by_date', 'Order By Date'),
	('completed', 'Completed'),
	('failed', 'Failed'),
)


FRAME_TYPES = (
	('southpark', 'South Park'),
	('youtube', 'You Tube'),
)


ITEM_LIST_TYPES = (
	('todo', 'Todo'),
	('shoppinglist', 'Shopping List'),
	('wishlist', 'Wish List'),
)


class Profile(models.Model):
	settings = models.TextField() # JSON blob
	user = models.OneToOneField(to=User)


class Clock(models.Model):
	position = models.IntegerField()
	profile = models.ForeignKey(to=Profile)


	def to_dict(self):
		return {
			'model': 'api.clock',
		    'position': self.position,
		}


class ItemList(models.Model):
	position = models.IntegerField()
	name = models.CharField(max_length=128)
	type = models.CharField(max_length=32, choices=ITEM_LIST_TYPES)
	ordering = models.CharField(max_length=64, choices=ORDERING_CHOICES)
	profile = models.ForeignKey(to=Profile)


	def resolve_type(self):
		return dict(ITEM_LIST_TYPES).get(self.type, self.type)


	def resolve_ordering(self):
		return dict(ORDERING_CHOICES).get(self.ordering, self.ordering)


	def to_dict(self):
		result = {
			'model': 'api.itemlist',
			'position': self.position,
		    'name': self.name,
		    'type': {
			    'original': self.type,
		        'resolved': self.resolve_type()
		    },
		    'ordering': {
			    'original': self.ordering,
		        'resolved': self.resolve_ordering()
		    }
		}

		items = []
		for item in self.item_set.all():
			items.append({
				'model': 'api.item',
			    'order': item.order,
			    'completed': item.completed,
			    'text': item.text,
			    'created': item.created.strftime('%Y-%m-%dT%H:%M:%S'),
			    'expiry': item.expiry.strftime('%Y-%m-%dT%H:%M:%S'),
			    'tags': item.tags,
			})

		result['items'] = items

		return result


	def __unicode__(self):
		return '%d - %s (%s) %d items' % (self.position, self.name, self.resolve_type(), self.item_set.count())


class Item(models.Model):
	order = models.IntegerField()
	completed = models.BooleanField(default=False)
	text = models.TextField()
	created = models.DateTimeField(auto_now_add=True)
	expiry = models.DateTimeField()
	tags = models.TextField()
	item_list = models.ForeignKey(to=ItemList)


	def __unicode__(self):
		return '#%d on %s - %s' % (self.order, self.item_list.name, self.text)


class Frame(models.Model):
	position = models.IntegerField()
	source = models.TextField()
	type = models.CharField(max_length=64, choices=FRAME_TYPES)
	dimensionX = models.IntegerField(default=300)
	dimensionY = models.IntegerField(blank=True, null=True)
	profile = models.ForeignKey(to=Profile)


	def resolve_type(self):
		return dict(FRAME_TYPES).get(self.type, self.type)


	def to_dict(self):
		return {
			'model': 'api.frame',
			'position': self.position,
			'type': {
				'original': self.type,
				'resolved': self.resolve_type()
			},
		    'dimensionX': self.dimensionX,
		    'dimensionY': self.dimensionY,
		}


	def __unicode__(self):
		return '%d - Frame (), poiting to '