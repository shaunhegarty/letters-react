import React from 'react';
import axios from 'axios';
import { WordEntry } from '../letters/lettersgame.js';

class LadderExplorer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            length: 3,
            difficulty: 1,
            validWords: [],
            ladders: [],
            filter: "",
        }
    }

    handleGetLadders = async () => {
        const response = await axios.get('http://shaunhegarty.com/api/ladders/' + this.state.difficulty + '/' + this.state.length)
        let ladders = response.data['ladders']
        this.setState({ 'ladders': ladders })
    }

    handleFilterChange = (e) => {
        const word = e.target.value.toLowerCase();
        this.setState({ filter: word})
    }

    ladderWordLengthHandler(select) {
        this.setState({'length': select.target.value})
    }

    
    ladderDifficultyHandler(select) {
        this.setState({'difficulty': select.target.value})
    }

    render() {
        return (<div id="ladder-explorer">
            <GetLadderButton 
                getLadderHandler={(e) => this.handleGetLadders(e)} 
                ladderWordLengthHandler={(e) => this.ladderWordLengthHandler(e)}
                ladderDifficultyHandler={(e) => this.ladderDifficultyHandler(e)}
                ladderFilterChangeHandler={(e) => this.handleFilterChange(e)}
                currentFilter={this.state.filter}
            />
            <SimpleLadderDisplay ladders={this.state.ladders} filter={this.state.filter} />
        </div>)
    }
}

class SimpleLadderDisplay extends React.Component {
    render() {
        function filterFunc(ladderList, query) {
            return ladderList.filter(ladder => ladder.pair.includes(query))
        }
        const filteredLadders = filterFunc(this.props.ladders, this.props.filter)
        const ladders = filteredLadders.map(function (ladder, index) {
            return (<LadderDisplayUnit key={ladder.pair} ladder={ladder} />)
        })
        return (<div id="ladder-display">{ladders}</div>)
    }
}


class LadderDisplayUnit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ladderData: {},
            displayLadder: false,
            displayGame: false,
        }
    }

    toggleShowLadder = async() =>  {
        if (!this.state.chain) {
            const response = await axios.get('http://shaunhegarty.com/api/ladders/' + this.props.ladder.pair)
            let chain = response.data['ladder']
            this.setState({'chain': chain})
        }
        this.state.displayLadder ? this.collapse() : this.showLadder();
    }

    showGame() {
        this.setState({'displayLadder': false, 'displayGame': true})
    }

    showLadder() {
        this.setState({'displayLadder': true, 'displayGame': false})
    }

    collapse() {
        this.setState({'displayLadder': false, 'displayGame': false})
    }

    render() {
        let expansion;
        if (this.state.displayLadder) {
            expansion = (<LadderShow ladder={this.state.chain}/>)
        }
        return (<div id='single-display'>
            <LadderPair ladder={this.props.ladder} clickHandler={() => this.toggleShowLadder()}></LadderPair>
            {expansion}
        </div>)
    }
}

class LadderPair extends React.Component {

    render() {
        return (
            <div className="ladder-pair" onClick={this.props.clickHandler}>
                <div className="ladder-key">{this.props.ladder.pair} </div>
                <div className="shortest-path">Steps: {this.props.ladder.min_length} </div>
                <div className="ladder-difficulty">Difficulty: {this.props.ladder.difficulty}</div>
            </div>
        )
    }
}

class LadderShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pair: props.ladder.pair,
            ladder: props.ladder.chain,
            userLadder: [],
            isValid: true,
            isComplete: false,
            isOptimal: false,
        }
    }

    render() {
        const ladderWords = this.state.ladder.map(function (word, index) {
            return (<div key={word}>{word}</div>)
        })
        return (
            <div id={this.state.pair + '-ladder-show'} class="ladder-show">{ladderWords}</div>
        )
    }
}

class GetLadderButton extends React.Component {
    render() {
        return (
            <div>
                <div id="get-ladder" className="ladder-getter">
                    <div id="get-ladder-button-container">
                        <button
                            id="get-ladder-button"
                            className="get-ladder-button"
                            onClick={this.props.getLadderHandler}>
                            Get Ladders
                        </button>
                    </div>
                    <div id="word-length-container">
                    <label htmlFor="word-length">Length: </label>
                        <select id="ladder-word-length" name="word-length" onChange={this.props.ladderWordLengthHandler}>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                        </select>
                    </div>
                    <div id="difficulty-container">
                        <label htmlFor="ladder-difficulty">Difficulty: </label>
                        <select id="ladder-difficulty" name="ladder-difficulty" onChange={this.props.ladderDifficultyHandler}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                        </select>
                    </div>
                </div>
                <WordEntry
                        maxLength={15}
                        disabled={false}
                        word={this.props.currentFilter}
                        showBackspace={false}
                        showSaveButton={false}
                        changeHandler={this.props.ladderFilterChangeHandler}
                    />
                    </div>)
    }
}

export default LadderExplorer;