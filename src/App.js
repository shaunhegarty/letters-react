import React from 'react';
import { stringContainsChars, strOfParticularLength, processResults } from './letters.js';
import './App.css';
import axios from 'axios';

class Letter extends React.Component {
  render() {
    return (<td className="letter">{this.props.letter}</td>)
  }
}

class GameTimer extends React.Component {
  render() {
    return (<div id="game-timer">Game Timer</div>)
  }
}

class RoundController extends React.Component {
  render() {
    return (<div id="round-controller">
      <GameTimer />
      <button id="round-begin">Begin Round</button>
      <button id="clear-letters" onClick={this.props.clearHandler}>Clear Letters</button>
    </div>)
  }
}

class LettersDisplay extends React.Component {
  render() {
    const mix = strOfParticularLength(this.props.letters, this.props.size);
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

class ResultsDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {results: []};
  }

  handleGetResults = async event => {
    event.preventDefault();
    const response = await axios.get('http://api.shaunhegarty.com/subanagrams/' + this.props.mix);
    const subAnagrams = processResults(response.data);
    console.log(subAnagrams);
    this.setState({results: subAnagrams});
  };

  render() {
    console.log(this.state.results);
    return (
    <div id="results-display">
      Best Words
      <div id="best-words">{this.state.results.slice(0, 30).join(', ')}</div>
      <button id="get-best-words" onClick={(e) => this.handleGetResults(e)}>Get Words</button>
    </div>)
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
    this.state = { word: '' };
  };

  handleSave(e) {
    const wordToSave = this.state.word;
    if (wordToSave.length > 0){
      this.props.saveHandler(wordToSave);    
      document.getElementById('word-entry').value = "";
    }
  }

  onChange(e) {
    this.setState({word: e.target.value.toUpperCase()})
  }

  render() {
    const disabled = this.state.word.length === 0 || !stringContainsChars(this.props.mix, this.state.word);
    return (<div id="word-entry-div">
      <input type="text" id="word-entry" maxLength={this.props.maxlen} onChange={(e) => this.onChange(e)} />
      <button id="save-word" onClick={(e) => this.handleSave(e)} disabled={disabled}>Save Word</button>
    </div>)
  }
}

class SavedWords extends React.Component {
  render() {
    const savedWordsArray = [...this.props.savedWords];
    const savedWords = savedWordsArray.map(function (word) {
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
    this.state = {
      mix: '',
      gameSize: 9,
      savedWords: new Set(),
    };

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
    let savedWords = new Set(this.state.savedWords);
    savedWords = savedWords.add(newWord);
    this.setState({ savedWords: savedWords })
  }

  handleClear() {
    this.setState({ mix: '', savedWords: [] });
  }

  render() {
    return (<div className="letters-game">
      <RoundController clearHandler={this.handleClear} />
      <LettersDisplay letters={this.state.mix} size={this.state.gameSize} />
      <ConsonantVowelSelection clickHandler={this.handleNewLetter} />
      <WordEntry saveHandler={this.handleSaveWord} maxlen={this.state.gameSize} mix={this.state.mix} />
      <SavedWords savedWords={this.state.savedWords} />
      <ResultsDisplay mix={this.state.mix}/>
    </div>
    )
  }
}

function App() {
  return (<LettersGame />);
}

export default App;
