import React from 'react';
import './App.css';

class Letter extends React.Component {
  render() {
    return (<td className="letter">{this.props.letter}</td>)
  }
}

class LettersDisplay extends React.Component {
  render () {
    const lettersArray = this.props.letters.toUpperCase().split('');
    const letters = lettersArray.map(function(character) {
      return (<Letter letter={character}/>);
    });
    return (
      <table id="letters-display">
        <tbody>
          <tr>
            {letters}
          </tr>
        </tbody>              
      </table>)
  }
}

class LettersGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {mix: 'ajshdljsd'};
  }
  render () {
    return (<div className="letters-game">
          <p> The game goes here. </p>
          <LettersDisplay letters={this.state.mix}/>
        </div>
      )
  }
}

function App () {
  return (<LettersGame/>);
}

export default App;
