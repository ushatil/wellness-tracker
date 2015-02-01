from django.http import HttpResponse

def hello(request):
	return HttpResponse("<html><body>Hello!</body></html>")


