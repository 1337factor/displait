from django.conf.urls.defaults import *

urlpatterns = patterns('api.views',
	url(r'^$', 'index', name = 'api.index'),

    # Get all data for user
	url(r'^data/all/user/(?P<user_id>\d+)$', 'data', name = 'api.data'),
)
