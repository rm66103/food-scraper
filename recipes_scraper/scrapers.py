import requests
import pandas as pd
from bs4 import BeautifulSoup

# Settings
PROJECT_ROOT = r"X:\python\food-scraper\food-scraper\data\\"
JUPYTER_NOTEBOOK_ROOT = r"X:\python\food-scraper\food-scraper\recipes_scraper\\"

# Data Models
class Recipe():
    def __init__(self, title=None, source=None, link=None, ingredients=None):
        self.title = title
        self.source = source
        self.link = link
        self.ingredients = ingredients

    def to_dict(self):
        dict = {
            'title': self.title,
            'source': self.source,
            'link': self.link,
            'ingredients': self.ingredients,
        }
        return dict

def retrieve_ingredient_dict():
    df = pd.read_csv(f"{JUPYTER_NOTEBOOK_ROOT}data/food_list.csv", header=None)
    return dict(df[1].iloc[1:])

# Scrapers
class Scraper():
    def __init__(self, base_url):
        self.base_url = base_url

    def scrape(self, url=None):
        response = requests.get(url) if url else requests.get(self.base_url)
        return response

    def parse(self, url=None):
        soup = BeautifulSoup(self.scrape(url).content, 'html.parser')
        return soup

    def list_to_series(self, list=None):
        return pd.Series(list)

    def series_to_csv(self, series=None, file_name=None):
        series.to_csv(PROJECT_ROOT + file_name, index=False)

class EnchantedLearningScraper(Scraper):
    def __init__(self, url='https://www.enchantedlearning.com/wordlist/food.shtml'):
        super().__init__(url)
        self.food_list = self.scrape_food_list()
        self.file_name = f'enchanted-learning-food-list.csv'

    # Scrape the page for the list of food items and return a python list
    def scrape_food_list(self):
        food_list = []
        for element in self.parse().find_all('div', 'wordlist-item'):
            food_list.append(element.get_text())
        return (food_list)

    def download_food_list_csv(self):
        self.series_to_csv(self.list_to_series(self.food_list), file_name=self.file_name)

class EnchantedLearningSpiceScraper(EnchantedLearningScraper):
    def __init__(self, url="https://www.enchantedlearning.com/wordlist/herbs.shtml"):
        super().__init__(url)
        self.file_name = f'enchanted-learning-spice-list.csv'

class FoodWishesScraper(Scraper):
    def __init__(self, url="https://foodwishes.blogspot.com/"):
        super().__init__(url)
        self.older_posts = self.older_posts_link()
        self.next_page = self.older_posts_link()
        self.recipes = self.find_recipes()

    def older_posts_link(self):
        for a in self.parse().find_all('a'):
            for x in range(len(a) + 1):
                try:
                    if a['class'][x] == 'blog-pager-older-link':
                        return a['href']
                except:
                    pass
        return None

    def find_recipes(self):
        recipes = []

        for h3 in self.parse().find_all('h3', {'class': 'post-title entry-title'}):

            recipe_link = h3.find('a')['href']

            recipe_link_body = self.get_recipe_body_from_link(recipe_link)
            matching_ingredients = self.match_body_to_ingredient_list(recipe_link_body)

            new_recipe = Recipe(link=recipe_link, title=h3.find('a').text, source="Food Wishes", ingredients=matching_ingredients)
            recipes.append(new_recipe)
        return recipes

    def get_recipe_body_from_link(self, link):
        recipe_page = self.parse(link)
        recipe_body = recipe_page.find('div', {'class':'post-body'}).get_text()
        return recipe_body

    def match_body_to_ingredient_list(self, body):
        ingredient_dict = retrieve_ingredient_dict()
        matching_ingredients = []
        for ingredient in ingredient_dict.values():
            if ingredient in body:
                matching_ingredients.append(ingredient)
        return matching_ingredients