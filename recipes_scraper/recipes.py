class Recipe():
    def __init__(self, **kwargs):
        self.title = kwargs['title']
        self.source = kwargs['source']
        self.link = kwargs['link']
        self.ingredients = kwargs['ingredients']
        return self

    def to_dict(self):
        dict = {
            'title': self.title,
            'source': self.source,
            'link': self.link,
            'ingredients': self.ingredients,
        }
        return dict