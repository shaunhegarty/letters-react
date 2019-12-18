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

class GameTimer extends React.Component {
  render () {
    return (<div id="game-timer">Game Timer</div>)
  }
}

class RoundController extends React.Component {
  render () {
    return (<div id="round-controller">
      <GameTimer />
      <button id="round-begin">Begin Round</button>
      <button id="clear-letters" onClick={this.props.clearHandler}>Clear Letters</button>
    </div>)
  }
}

class LettersDisplay extends React.Component {
  render() {
    const mix = strOfParticularLength(this.props.letters, this.props.gameSize);
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
    this.setState({ vowelList: vowelList });
    return letter
  }

  popConsonant() {
    let consonantList = this.state.consonantList.slice()
    const index = this.randomLetterFromList(consonantList);
    const letter = consonantList[index];
    consonantList = consonantList.slice(0, index) + consonantList.slice(index + 1);
    this.setState({ consonantList: consonantList });
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

class WordEntry extends React.Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
  };

  handleSave() {
    console.log('Attempting to save word')
    const input = document.getElementById('word-entry')
    this.props.saveHandler(input.value);
    input.value = "";
  }

  render() {
    return (<div id="word-entry-div">
      <input type="text" id="word-entry" maxlength={this.props.maxlen}/>
      <button id="save-word" onClick={this.handleSave}>Save Word</button>
    </div>)
  }
}

class SavedWords extends React.Component {
  render() {
    const savedWords = this.props.savedWords.map(function(word){
      return <td key={word}>{word}</td>
    });
    return (<table id="saved-word-table">
      <tbody>
        <tr>
          {savedWords}
        </tr>
      </tbody>
    </table>)
  }
}

class LettersGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mix: '', 
    gameSize: 9,
    savedWords: [] };

    // This will not work inside the function when it is passed, if this is not bound
    this.handleNewLetter = this.handleNewLetter.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleSaveWord = this.handleSaveWord.bind(this);
  };

  handleNewLetter(newLetter) {
    const currentMix = this.state.mix;
    this.setState({ mix: currentMix + newLetter })
  }

  handleSaveWord(newWord) {
    let savedWords = this.state.savedWords.slice()
    savedWords = savedWords.concat(newWord);
    console.log('Trying to add ' + newWord)
    this.setState({savedWords: savedWords})
    console.log(this.state)
  }

  handleClear() {
    this.setState({ mix: '', savedWords: []});
  }

  render() {
    return (<div className="letters-game">
      <RoundController clearHandler={this.handleClear} />
      <LettersDisplay letters={this.state.mix} size={this.state.gameSize} />
      <ConsonantVowelSelection clickHandler={this.handleNewLetter} />
      <WordEntry saveHandler={this.handleSaveWord} maxlen={this.state.gameSize}/>
      <SavedWords savedWords={this.state.savedWords}/>
    </div>
    )
  }
}

function App() {
  return (<LettersGame />);
}

export default App;
