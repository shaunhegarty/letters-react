import React from 'react';
import {
  strOfParticularLength, stringContainsChars, processResults, letterDistribution,
  randomLetterFromList, vowelDist, consonantDist, chooseLetterType, vowelsAllowed, consonantsAllowed
} from './letters.js';
import './App.css';
import axios from 'axios';

class Letter extends React.Component {
  render() {
    const letter = this.props.letter;
    console.log(typeof letter);
    return (<td className="letter" onClick={(e) => this.props.clickHandler(letter, e)}>{letter}</td>)
  }
}

class GameTimer extends React.Component {
  render() {
    return (<div id="game-timer">Timer</div>)
  }
}

class RoundController extends React.Component {
  render() {
    return (<div id="round-controller">
      <button id="round-begin" className="game-button" disabled>Begin Round</button>
      <button id="round-end" className="game-button" onClick={this.props.roundEndHandler}>End Round</button>
      <button id="clear-letters" className="game-button" onClick={this.props.clearHandler} >Clear Letters</button>
    </div>)
  }
}

class LettersDisplay extends React.Component {
  render() {
    const mix = strOfParticularLength(this.props.letters, this.props.size);
    const lettersArray = mix.toUpperCase().split('');
    const letters = lettersArray.map(function (character, index) {
      return (<Letter key={index} letter={character} clickHandler={this.props.clickHandler}/>);
    }, this);
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
  render() {
    return (<div className="consonant-vowel-selection">
      <button className="game-button" name="consonant" onClick={this.props.consonantHandler}>Consonant ({this.props.consonantList.length})</button>
      <button className="game-button" name="vowel" onClick={this.props.vowelHandler}>Vowel ({this.props.vowelList.length})</button>
      <button className="game-button" onClick={this.props.autoHandler}>Auto</button>
    </div>);
  }
}

class WordEntry extends React.Component {
  keyPressed(e) {
    if (e.key === "Enter") {
      this.handleSave();
    }
  }

  render() {
    const disabled = this.props.word.length === 0 || !stringContainsChars(this.props.mix, this.props.word);
    return (
      <div id="word-entry-div">
        <input type="text"
          id="word-entry"
          value={this.props.word}
          maxLength={this.props.maxLength}
          onChange={this.props.changeHandler}
          onKeyPress={(e) => this.keyPressed(e)}
        />
        <button id="backspace" className="game-button" onClick={this.props.backspaceHandler}>{'<'}</button>
        <button id="save-word"
          className="game-button"
          onClick={this.props.saveHandler}
          disabled={disabled}>Save Word</button>
      </div>)
  }
}

class SavedWords extends React.Component {
  render() {
    const savedWordsArray = [...this.props.savedWords];
    const savedWords = savedWordsArray.map(function (word) {
      let pts = '';
      if (this.props.results.includes(word.toLowerCase())) {
        pts = word.length + 'pts';
      }
      return (<tr>
        <td key={word}>{word}</td><td>{pts}</td>
      </tr>)
    }, this);
    return (
      <div id="saved-words"> Saved Words
        <table id="saved-word-table">
          <tbody>
            {savedWords}
          </tbody>
        </table>
      </div>)
  }
}

class ResultsDisplay extends React.Component {
  render() {
    const bestWords = this.props.results.slice(0, 10).map(function (word) {
      return (<tr key={word}>
        <td >{word.toUpperCase()}</td><td>{word.length}pts</td>
      </tr>)
    })
    return (
      <div id="results-display">
        Best Words
        <table id="best-words">
          <tbody>
            {bestWords}
          </tbody>
        </table>
      </div>)
  }
}

class LettersGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mix: '',
      gameSize: 10,
      savedWords: new Set(),
      results: [],
      vowelList: letterDistribution(vowelDist),
      consonantList: letterDistribution(consonantDist),
      vowelCount: 0,
      consonantCount: 0,
      currentWord: '',
    };

    // This will not work inside the function when it is passed, if this is not bound
    this.handleSaveWord = this.handleSaveWord.bind(this);
  };

  handleNewLetter(newLetter) {
    if (this.state.mix.length < this.state.gameSize) {
      const currentMix = this.state.mix;
      this.setState({ mix: currentMix + newLetter })
    }
  }

  handleNewMix(newMix) {
    if (newMix.length <= this.state.gameSize) {
      this.setState({ mix: newMix });
    }
  }

  handleWordChange = (e) => {
    const word = e.target.value.toUpperCase();
    this.setState({ currentWord: word }, function() {
      console.log(this.state.word);
    })
  }

  handleLetterClick(letter) {
    const currentWord = this.state.currentWord;
    this.setState({currentWord: currentWord + letter})
  }

  handleBackspaceClick() {
    const currentWord = this.state.currentWord;
    this.setState({currentWord: currentWord.slice(0, currentWord.length - 1)})
  }

  handleSaveWord() {
    let savedWords = new Set(this.state.savedWords);
    const newWord = this.state.currentWord;

    if (newWord.length > 0) {
      savedWords = savedWords.add(newWord);
      this.setState({word: ''});
    }
    this.setState({ savedWords: savedWords, currentWord: '' })
  }

  handleClear() {
    const vowelList = this.state.vowelList.length < this.state.gameSize ? letterDistribution(vowelDist) : this.state.vowelList
    const consonantList = this.state.consonantList.length < this.state.gameSize ? letterDistribution(consonantDist) : this.state.consonantList
    this.setState({
      mix: '',
      savedWords: [],
      results: [],
      vowelCount: 0,
      consonantCount: 0,
      vowelList: vowelList,
      consonantList: consonantList,
      currentWord: '',
    });
  }

  handleGetResults = async event => {
    event.preventDefault();
    let subAnagrams;
    if (this.state.mix.length) {
      const response = await axios.get('http://api.shaunhegarty.com/subanagrams/' + this.state.mix);
      subAnagrams = processResults(response.data);
    } else {
      subAnagrams = [];
    }
    this.setState({ results: subAnagrams });
  };

  popVowel() {
    let vowelList = this.state.vowelList.slice()
    const index = randomLetterFromList(vowelList);
    const letter = vowelList[index];
    vowelList = vowelList.slice(0, index) + vowelList.slice(index + 1);
    this.setState({ vowelList: vowelList });
    return letter
  }

  popConsonant() {
    let consonantList = this.state.consonantList.slice()
    const index = randomLetterFromList(consonantList);
    const letter = consonantList[index];
    consonantList = consonantList.slice(0, index) + consonantList.slice(index + 1);
    this.setState({ consonantList: consonantList });
    return letter
  }

  handleConsonantClick() {
    const consonantCount = this.state.consonantCount;
    if (consonantsAllowed(consonantCount, this.state.gameSize) && this.state.mix.length < this.state.gameSize) {
      const letter = this.popConsonant();
      this.setState({ consonantCount: consonantCount + 1 })
      this.handleNewLetter(letter);
    }
  }

  handleVowelClick() {
    const vowelCount = this.state.vowelCount;
    if (vowelsAllowed(vowelCount, this.state.gameSize) && this.state.mix.length < this.state.gameSize) {
      const letter = this.popVowel();
      this.setState({ vowelCount: vowelCount + 1 })
      this.handleNewLetter(letter);
    }
  }

  handleAutoClick() {
    let mix = this.state.mix;
    let vowelList = this.state.vowelList.slice()
    let consonantList = this.state.consonantList.slice();
    let vowelCount = this.state.vowelCount;
    let consonantCount = this.state.consonantCount;
    for (let i = mix.length; i < this.state.gameSize; i++) {
      let letterList;
      const bUseConsonant = chooseLetterType(vowelCount, consonantCount, this.state.gameSize);
      if (bUseConsonant) {
        letterList = consonantList;
      } else {
        letterList = vowelList;
      }
      const index = randomLetterFromList(letterList);
      const letter = letterList[index];
      mix += letter;
      letterList = letterList.slice(0, index) + letterList.slice(index + 1);
      if (bUseConsonant) {
        consonantList = letterList
        consonantCount++;
      } else {
        vowelList = letterList
        vowelCount++;
      }
    }
    this.setState({
      consonantList: consonantList,
      vowelList: vowelList,
      consonantCount: consonantCount,
      vowelCount: vowelCount,
    })
    this.handleNewMix(mix);
  }

  render() {
    return (
      <div id="letters-game" className="letters-game">
        <div id="letters-game-display">
          <GameTimer />
          <RoundController clearHandler={(e) => this.handleClear(e)} roundEndHandler={(e) => this.handleGetResults(e)} />
          <LettersDisplay letters={this.state.mix} size={this.state.gameSize} clickHandler={(e) => this.handleLetterClick(e)} />
          <ConsonantVowelSelection
            vowelHandler={(e) => this.handleVowelClick(e)}
            consonantHandler={(e) => this.handleConsonantClick(e)}
            autoHandler={(e) => this.handleAutoClick(e)}
            vowelList={this.state.vowelList}
            consonantList={this.state.consonantList}
            mix={this.state.mix}
            gameSize={this.state.gameSize} />
          <WordEntry 
            saveHandler={(e) => this.handleSaveWord(e)} 
            maxLength={this.state.gameSize} 
            mix={this.state.mix} 
            word={this.state.currentWord} 
            changeHandler={this.handleWordChange}
            backspaceHandler={(e) => this.handleBackspaceClick(e)}/>
          <div id="words-panel">
            <SavedWords savedWords={this.state.savedWords} results={this.state.results} />
            <ResultsDisplay results={this.state.results} />
          </div>
        </div>
      </div>
    )
  }
}

function App() {
  return (<LettersGame />);
}

export default App;
