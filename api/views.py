import json
from operator import itemgetter
import pprint
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def index(request):
	return HttpResponse(json.dumps({
		'application': 'Displait',
		'version': '0.9',
		'activejQuery': '1.7.1',
		#'documentation': 'www.displait.com/api/documentation',
	}), content_type='application/javascript; charset=utf8')


def data(request, user_id):
	print type(user_id)
	user = User.objects.get(id=user_id)
	profile = user.get_profile()

	display = []

	display.extend([x.to_dict() for x in profile.clock_set.all()])
	display.extend([x.to_dict() for x in profile.itemlist_set.all()])
	display.extend([x.to_dict() for x in profile.frame_set.all()])

	display.sort(key=itemgetter('position'))

	return HttpResponse(json.dumps(display), content_type='application/javascript; charset=utf8')
