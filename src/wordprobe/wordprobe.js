import React from 'react';
import { WordEntry } from '../letters/lettersgame.js';
import axios from 'axios';

class ApiProbe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWord: '',
    }
  }

  handleWordChange = (e) => {
    const word = e.target.value.toUpperCase();
    this.setState({ currentWord: word })
  }

  handleGetResults = async () => {
    let subAnagrams;
    if (this.state.currentWord.length) {
      const response = await axios.get('http://shaunhegarty.com/api/subanagrams/' + this.state.currentWord);
      subAnagrams = response.data;
      console.log(response.data)
    } else {
      subAnagrams = [];
      console.log('No Word')
    }
    this.setState({ results: subAnagrams });
  };

  render() {
    return (
      <div className="word-entry-container">
        <div className="probe-header">Find Words Within A Word</div>
        <WordEntry
          maxLength={15}
          disabled={false}
          word={this.state.currentWord}
          showBackspace={false}
          showSaveButton={true}
          buttonText='Search'
          changeHandler={this.handleWordChange}
          saveHandler={(e) => this.handleGetResults(e)}
        />
        <SubAnagramsDisplay data={this.state.results} />
      </div>
    )
    // return (<div>Api Probe</div>)
  }
}

class SubAnagramsDisplay extends React.Component {
  render() {
    if (!this.props.data) {
      return <div></div>
    }
    const keys = Object.keys(this.props.data.words)
      .map((number) => parseInt(number))
      .sort((a, b) => a - b)  //JS sorts an array of ints as if it were strings
      .reverse();
    const data = this.props.data;
    const wordLists = keys.map(function (key) {
      let wordlist = data.words[key].words.sort();
      return (<WordList key={key} words={wordlist} text={key + "-letter words (" + wordlist.length + ")"} />)
    })
    return (<div className="word-display">
      {wordLists}
    </div>)
  }
}

class WordList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  };

  handleClick() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const listItemsFunc = function (word) {
      return (<li key={word} className="word-list-item">{word.toUpperCase()}</li>)
    }
    const listItems = this.state.expanded ? this.props.words.map(listItemsFunc) : null;
    const wordList = !listItems ? null : (
      <ul className="word-list">
        {listItems}
      </ul>)

    const icon = this.state.expanded ? '-' : '+';
    return (
      <div className="word-list-container" onClick={() => this.handleClick()}>
        <div className="word-list-text">{icon + ' ' + this.props.text}</div>
        {wordList}
      </div>
    )
  }
}

export default ApiProbe;