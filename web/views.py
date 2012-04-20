from django.shortcuts import render_to_response
from django.template.context import RequestContext


def index(request):
	ctx  = {}
	return render_to_response('pages/index.html', ctx, RequestContext(request))
