import React from 'react';
import logo from './logo.svg';
import './App.css';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

class RecipeCard extends React.Component {
  constructor(props) {
    super(props);
    var state = {
      visible: true,
    }
  }

  render() {
    return(
    <div class="mb-2">
      <Card style={{ width: '18rem' }}>
        <Card.Body>
         <a href={this.props.link}>{this.props.recipe}</a>
        </Card.Body>
      </Card>
  </div>


    )
  }
}

class RandomRecipe extends React.Component{
 constructor(props){
   super(props);
   this.state = {
     'recipe': '',
     'link': '',
   };
 }

 componentDidMount() {
    fetch("http://127.0.0.1:8888/recipes-from-csv")
      .then(res => res.json())
      .then(
        (result) => {
          var random_recipe = result[Math.floor(Math.random() * result.length)]
          this.setState({
            recipe: random_recipe[0],
            link: random_recipe[1],
          });
          console.log(this.state.recipes)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            error
          });
        }
      )
  }

 render() {
   return(
     <RecipeCard recipe={this.state['recipe']} link={this.state['link']}></RecipeCard>
   )
 }
}

class FilterRecipesByName extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      name_contains: '',
      error: null,
      isLoaded: false,
      recipes: [],
      filtered_recipes: []
    };
  }

  componentDidMount() {
    fetch("http://127.0.0.1:8888/recipes-from-csv")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            recipes: result
          });
          console.log(this.state.recipes)
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  handleChange = (e) => {

    this.setState({
        name_contains: (e.target.value)
    });

    var recipes = []

    for (var i = 0; i < this.state.recipes.length; i++) {
      if ( this.state.recipes[i][0].includes(e.target.value)){
        recipes.push(this.state.recipes[i]);
      }
    };

    console.log(recipes)

    this.setState({
        filtered_recipes: recipes
    });

  }

  render() {
    return (
      <div class="container-fluid">
        <div class="row">
            <div class="col-8 col-md-4 offset-2 offset-md-4">
                <div class="bg-white p-4 mt-5">
                    <h1>Food Scraper</h1>
                    <p>Type in your favorite ingredient to get started.</p>
                    <label htmlFor="filter"><b>Ingredient</b></label><br />
                    <input type="text" id="filter"
                      value={this.state.name_contains}
                      onChange={this.handleChange}
                      class="mb-3"/>
                        {this.state.filtered_recipes.map((recipe, index) => (
                          <div class="w-100 d-flex justify-content-center"><RecipeCard key={index} recipe={recipe[0]} link={recipe[1]}></RecipeCard></div>))}
                  </div>
            </div>
        </div>
      </div>
    )
  }
}

class List extends React.Component {
  constructor(props){
    super(props)
  }


  render() {
    return(
      this.state.recipes.map(recipe =>
        <RecipeCard recipe={recipe[0]} link={recipe[1]}></RecipeCard>
      )
    )
  }
}

class App extends React.Component{
  render(){
    return(
      <RandomRecipe></RandomRecipe>
    )
  }
}

export default FilterRecipesByName;
