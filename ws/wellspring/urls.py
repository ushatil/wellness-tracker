from django.conf.urls import patterns, include, url
from django.contrib import admin
from wellspring.views.hello import hello

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'wellspring.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),
	url(r'wellspring/hello', hello, name='hello'),

    url(r'^admin/', include(admin.site.urls))
)
