from django.conf.urls import patterns, include, url

from django.contrib import admin
import displait


admin.autodiscover()

urlpatterns = patterns('',
	# WEB
	url(r'', include('web.urls')),

	# ADMIN
	url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
	url(r'^admin/', include(admin.site.urls)),

    # STATIC CONTENT
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': displait.settings.MEDIA_ROOT}),
)
