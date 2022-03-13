import React from 'react';
import './App.css';
import LettersGame from './lettersgame.js';
import { WordEntry } from './lettersgame.js';
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
      <div>
        <WordEntry
          maxLength={15}
          disabled={false}
          word={this.state.currentWord}
          showBackspace={false}
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
    const max = this.props.data.max;
    const keys = Object.keys(this.props.data.words).sort().reverse();
    const data = this.props.data;
    const wordLists = keys.map(function (key) {
      let wordlist = data.words[key].words;
      return (<WordList key={key} words={wordlist} text={key + "-letter words (" + wordlist.length + ")"} />)
    })
    return (<div>
      <div id='longest-word'>Most Letters in Word: {String(max)}</div>
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
    return (
    <div onClick={() => this.handleClick()}>
      <div className="word-list-text">{this.props.text}</div>
      <ul className="word-list">
        {listItems}
      </ul>
    </div>
    )
  }
}

function ViewButton(props) {
  return (<div className="view-button" onClick={() => props.onClick(props.view)}>{props.view}</div>)
}

class ViewSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'Game',
    }
  }

  handleClickView(view) {
    console.log('Clicked View: ' + view)
    this.setState({ view: view })
  }

  render() {
    const view = this.state.view;
    let selectedView = (<div>Selected View</div>);
    if (view === 'Game') {
      selectedView = (<LettersGame />)
    } else if (view === 'Probe') {
      selectedView = (<ApiProbe />)
    }
    return (
      <div id='view-selector' className='view-selector'>
        <ViewButton view='Game' onClick={(e) => this.handleClickView(e)}></ViewButton>
        <ViewButton view='Probe' onClick={(e) => this.handleClickView(e)}></ViewButton>
        <div id='selected-view' className='selected-view'>
          {selectedView}
        </div>
      </div>
    )
  }
}


function App() {
  return (<ViewSelector />);
}

export default App;
