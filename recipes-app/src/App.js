import React from 'react';
import logo from './logo.svg';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      recipes: []
    };
  };

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
        <li><a href={recipe[1]}>{recipe[0]}</a></li>
      )
    )
  }
}

export default App;
