import React from 'react';
import logo from './logo.svg';
import './App.css';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

class RecipeCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <Card style={{ width: '18rem' }}>
        <Card.Body>
         <a href={this.props.link}>{this.props.recipe}</a>
        </Card.Body>
      </Card>


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

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      recipes: []
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

export default App;
