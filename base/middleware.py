from django.utils.translation import activate

class LanguageMiddleware:
 def __init__(self, get_response):
     self.get_response = get_response

 def __call__(self, request):
     user_language = request.session.get('user_language', 'en')
     activate(user_language)
     response = self.get_response(request)
     return response
