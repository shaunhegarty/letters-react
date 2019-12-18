import React from 'react';
import './App.css';

class Letter extends React.Component {
  render() {
    return (<td className="letter">{this.props.letter}</td>)
  }
}

function strOfParticularLength(string, length) {
  if (string.length === length) {
    return string;
  } else if (string.length > length) {
    return string.slice(0, length);
  } else {
    while (string.length < 9) {
      string += " ";
    }
    return string;
  }
}
class LettersDisplay extends React.Component {
  render() {
    const mix = strOfParticularLength(this.props.letters, 9);
    const lettersArray = mix.toUpperCase().split('');
    const letters = lettersArray.map(function (character, index) {
      return (<Letter key={index} letter={character} />);
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

class ConsonantVowelSelection extends React.Component {
  constructor(props) {
    super(props);
    const vowelDist = { 'A': 15, 'E': 21, 'I': 13, 'O': 13, 'U': 5, }
    const consonantDist = {
      'B': 2, 'C': 3, 'D': 6, 'F': 2, 'G': 3, 'H': 2, 'J': 1, 'K': 1, 'L': 5, 'M': 4, 'N': 8,
      'P': 4, 'Q': 1, 'R': 9, 'S': 9, 'T': 9, 'V': 1, 'W': 1, 'X': 1, 'Y': 1, 'Z': 1
    }
    this.state = {
      vowelList: this.letterDistribution(vowelDist),
      consonantList: this.letterDistribution(consonantDist),
    }

    this.handleConsonantClick = this.handleConsonantClick.bind(this);
    this.handleVowelClick = this.handleVowelClick.bind(this);
  }

  letterDistribution(distMap) {
    let letterList = '';
    for (let key in distMap) {
      for (let i = 0; i < distMap[key]; i++) {
        letterList += key
      }
    }
    return letterList
  }

  randomLetterFromList(letterList) {
    return Math.floor(Math.random() * letterList.length)    
  }

  popVowel() {
    let vowelList = this.state.vowelList.slice()
    const index = this.randomLetterFromList(vowelList);
    const letter = vowelList[index];
    vowelList = vowelList.slice(0, index) + vowelList.slice(index + 1);   
    this.setState({vowelList: vowelList});
    return letter
  }

  popConsonant() {
    let consonantList = this.state.consonantList.slice()
    const index = this.randomLetterFromList(consonantList);
    const letter = consonantList[index];
    consonantList = consonantList.slice(0, index) + consonantList.slice(index + 1);   
    this.setState({consonantList: consonantList});
    return letter
  }

  handleConsonantClick() {
    const letter = this.popConsonant();
    this.props.clickHandler(letter);
  }

  handleVowelClick() {
    const letter = this.popVowel();
    this.props.clickHandler(letter);
  }

  render() {
    return (<div className="consonant-vowel-selection">
      <button onClick={this.handleConsonantClick}>Consonant</button>
      <button onClick={this.handleVowelClick}>Vowel</button>
    </div>);
  }
}


class LettersGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mix: '', gameSize: 9 };

    // This will not work inside the function when it is passed, if this is not bound
    this.handleNewLetter= this.handleNewLetter.bind(this);
  };

  handleNewLetter(newLetter) {
      const currentMix = this.state.mix;
      this.setState({mix: currentMix + newLetter})
  }

  render() {
    return (<div className="letters-game">
      <p> The game goes here. </p>
      <LettersDisplay letters={this.state.mix} />
      <ConsonantVowelSelection clickHandler={this.handleNewLetter}/>
    </div>
    )
  }
}

function App() {
  return (<LettersGame />);
}

export default App;
