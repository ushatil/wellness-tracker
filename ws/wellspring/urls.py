from django.conf.urls import patterns, include, url
from django.contrib import admin
from wellspring.views.hello import hello
from wellspring.rest.device_api import register_device
from wellspring.rest.report_api import post_report
from wellspring.rest.value_api import value_endpoint_without_id
from wellspring.rest.value_api import value_endpoint_with_id
from wellspring.rest.error_api import *

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'wellspring.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
	url(r'^wellspring/hello/?$', hello, name='hello'),
    url(r'^wellspring/v1/register/?$', register_device, name='register_device'),
    url(r'^wellspring/v1/report/?$', post_report, name="post_report"),
    url(r'^wellspring/v1/value/?$', value_endpoint_without_id, name="value_endpoint_without_id"),
    url(r'^wellspring/v1/value/(?P<id>\d*)/?$', value_endpoint_with_id, name="value_endpoint_with_id")
    
	
    #url(r'^admin/', include(admin.site.urls))
)

handler400 = 'wellspring.rest.error_api.wellspring400'
handler403 = 'wellspring.rest.error_api.wellspring403'
handler404 = 'wellspring.rest.error_api.wellspring404'
handler500 = 'wellspring.rest.error_api.wellspring500'
