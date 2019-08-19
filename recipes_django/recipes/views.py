import os
import csv
import json

import pandas as pd

from django.http import JsonResponse

from recipes_django.settings import BASE_DIR

def AllRecipesJson(request):
    df = pd.read_csv(os.path.join(BASE_DIR, 'recipes/static/csv/recipes.csv'), header=0)
    data = df.to_dict()
    return JsonResponse(data, safe=False)