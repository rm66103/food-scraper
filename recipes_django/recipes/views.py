from django.http import JsonResponse

# Create your views here.
def AllRecipesJson(request):

    return JsonResponse(recipes)