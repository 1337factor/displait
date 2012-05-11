from django.shortcuts import render_to_response
from django.template.context import RequestContext


def index(request):
	ctx  = {
		'user_id': 1,
	}
	return render_to_response('pages/index.html', ctx, RequestContext(request))
