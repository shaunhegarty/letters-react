import React from 'react';
import {
    strOfParticularLength, stringContainsChars, processResults, letterDistribution,
    randomLetterFromList, vowelDist, consonantDist, chooseLetterType, vowelsAllowed, consonantsAllowed
} from './letters.js';
import axios from 'axios';

class Letter extends React.Component {
    render() {
        const letter = this.props.letter;
        return (<div className="letter" onClick={(e) => this.props.clickHandler(letter, e)}>{letter}</div>)
    }
}

class GameTimer extends React.Component {
    render() {
        return (<div id="game-timer">{this.props.displayTime}</div>)
    }
}

class RoundController extends React.Component {
    render() {
        return (<div id="round-controller">
            <button id="round-begin" className="game-button" onClick={this.props.roundStartHandler} disabled={this.props.countdown || !this.props.roundInProgress}>Begin Round</button>
            <button id="round-end" className="game-button" onClick={this.props.roundEndHandler} disabled={!this.props.roundInProgress}>End Round</button>
            <button id="clear-letters" className="game-button" onClick={this.props.clearHandler} disabled={this.props.countdown || this.props.mix.length === 0}>Clear Letters</button>
        </div>)
    }
}

class LettersDisplay extends React.Component {
    render() {
        const mix = strOfParticularLength(this.props.letters, this.props.size);
        const lettersArray = mix.toUpperCase().split('');
        const letters = lettersArray.map(function (character, index) {
            return (<Letter key={index} letter={character} clickHandler={this.props.clickHandler} />);
        }, this);
        return (
            <div id="letters-display">
                {letters}
            </div>)
    }
}

class ConsonantVowelSelection extends React.Component {
    render() {
        const disabled = this.props.mix.length >= this.props.gameSize;
        return (<div className="consonant-vowel-selection">
            <button className="game-button" name="consonant" onClick={this.props.consonantHandler} disabled={disabled}>Consonant ({this.props.consonantList.length})</button>
            <button className="game-button" name="vowel" onClick={this.props.vowelHandler} disabled={disabled}>Vowel ({this.props.vowelList.length})</button>
            <button className="game-button" onClick={this.props.autoHandler} disabled={disabled}>Auto</button>
        </div>);
    }
}

class WordEntry extends React.Component {
    keyPressed(e) {
        if (e.key === "Enter" && !this.props.disabled) {
            this.props.saveHandler(e);
        }
    }

    render() {
        let backspaceButton;
        if ( this.props.showBackspace ) {
            backspaceButton = (<button
                id="backspace"
                className="game-button"
                onClick={this.props.backspaceHandler}
                disabled={this.props.word.length === 0}>
                {'<'}
            </button>);
        }

        let saveButton;
        if ( this.props.showSaveButton ) {
            saveButton = (
                <button id="save-word"
                        className="game-button"
                        onClick={this.props.saveHandler}
                        disabled={this.props.disabled}>{this.props.buttonText}</button>
            );
        }

        return (
            <div id="word-entry-div">
                <input type="text" name="wordEntry"
                    id="word-entry" autoComplete="off"
                    value={this.props.word}
                    maxLength={this.props.maxLength}
                    onChange={this.props.changeHandler}
                    onKeyPress={(e) => this.keyPressed(e)}
                />
                {backspaceButton}
                {saveButton}
            </div>)
    }
}

WordEntry.defaultProps = {
    buttonText: 'Save Word',
    showBackspace: true,
    disabled: false,
    backspaceHandler: function() {console.log('Backspace Handler not Implemented')},
    saveHandler: function() {console.log('Button Click not Implemented')},
    changeHandler: function() {console.log('Change Handler not Implemented')},
}

class SavedWords extends React.Component {
    render() {
        const savedWordsArray = [...this.props.savedWords];
        const savedWords = savedWordsArray.map(function (word) {
            let pts = '';
            if (this.props.results.includes(word.toLowerCase())) {
                pts = word.length + 'pts';
            }
            return (<tr key={word}>
                <td>{word}</td><td className="pts">{pts}</td>
            </tr>)
        }, this);
        return (
            <div id="saved-words" className="word-list"> Saved Words
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
                <td >{word.toUpperCase()}</td><td className="pts">{word.length}pts</td>
            </tr>)
        })
        return (
            <div id="results-display" className="word-list">
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
            startTime: '',
            timeDisplay: '0.0',
            countdown: false,
            roundInProgress: false,
        };
        this.intervalHandle = null; // This is for managing the clock
    };

    handleNewLetter(newLetter) {
        if (this.state.mix.length < this.state.gameSize) {
            const newMix = this.state.mix + newLetter;
            this.setState({ mix: newMix, roundInProgress: newMix.length === this.state.gameSize })
        }
    }

    handleNewMix(newMix) {
        if (newMix.length <= this.state.gameSize) {
            this.setState({ mix: newMix, roundInProgress: newMix.length === this.state.gameSize });
        }
    }

    handleWordChange = (e) => {
        const word = e.target.value.toUpperCase();
        this.setState({ currentWord: word })
    }

    handleLetterClick(letter) {
        const currentWord = this.state.currentWord;
        this.setState({ currentWord: currentWord + letter })
    }

    handleBackspaceClick() {
        const currentWord = this.state.currentWord;
        this.setState({ currentWord: currentWord.slice(0, currentWord.length - 1) })
    }

    handleSaveWord() {
        let savedWords = new Set(this.state.savedWords);
        const newWord = this.state.currentWord;

        if (newWord.length > 0) {
            savedWords = savedWords.add(newWord);
            this.setState({ word: '' });
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
            startTime: '',
            timeDisplay: '0.0',
            countdown: false,
            roundInProgress: false,
        });
    }

    handleGetResults = async () => {
        let subAnagrams;
        if (this.state.mix.length) {
            const response = await axios.get('http://shaunhegarty.com/api/subanagrams/' + this.state.mix);
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

    handleRoundStart() {
        const startTime = Date.now();
        this.setState({
            startTime: startTime,
            countdown: true,
        });
        clearInterval(this.intervalHandle);
        this.intervalHandle = setInterval(() => this.tick(), 100)
    }

    tick() {
        const roundLength = 30
        let elapsedSeconds = roundLength - (Date.now() - this.state.startTime) / 1000;
        this.setState({
            timeDisplay: Math.abs(elapsedSeconds).toFixed(1),
        })
        if (elapsedSeconds < 0) {
            this.handleRoundEnd();
        }
    }

    handleRoundEnd() {
        clearInterval(this.intervalHandle);
        this.setState({
            startTime: '',
            timeDisplay: '0.0',
            countdown: false,
            roundInProgress: false,
        })
        this.handleGetResults();
    }

    componentWillUnmount() {
        clearInterval(this.intervalHandle);
    }

    render() {
        const wordEntryDisabled = this.state.currentWord.length === 0 || !stringContainsChars(this.state.mix, this.state.currentWord) || !this.state.countdown || !this.state.roundInProgress
        return (
            <div id="letters-game" className="letters-game">
                <div id="letters-game-display">
                    <GameTimer displayTime={this.state.timeDisplay} />
                    <RoundController
                        clearHandler={(e) => this.handleClear(e)}
                        roundStartHandler={(e) => this.handleRoundStart(e)}
                        roundEndHandler={(e) => this.handleRoundEnd(e)}
                        mix={this.state.mix}
                        countdown={this.state.countdown}
                        roundInProgress={this.state.roundInProgress} />
                    <LettersDisplay letters={this.state.mix} size={this.state.gameSize} clickHandler={(e) => this.handleLetterClick(e)} />
                    <ConsonantVowelSelection
                        vowelHandler={(e) => this.handleVowelClick(e)}
                        consonantHandler={(e) => this.handleConsonantClick(e)}
                        autoHandler={(e) => this.handleAutoClick(e)}
                        vowelList={this.state.vowelList}
                        consonantList={this.state.consonantList}
                        mix={this.state.mix}
                        gameSize={this.state.gameSize}
                        roundInProgress={this.state.roundInProgress} />
                    <WordEntry
                        saveHandler={(e) => this.handleSaveWord(e)}
                        maxLength={this.state.gameSize}
                        disabled={wordEntryDisabled}
                        word={this.state.currentWord}
                        showSaveButton={true}
                        changeHandler={this.handleWordChange}
                        backspaceHandler={(e) => this.handleBackspaceClick(e)} />
                    <div id="words-panel">
                        <SavedWords savedWords={this.state.savedWords} results={this.state.results} />
                        <ResultsDisplay results={this.state.results} />
                    </div>
                </div>
            </div>
        )
    }
}

export default LettersGame;
export {WordEntry};