import React from 'react';
import axios from 'axios';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css'
import { WordEntry } from '../letters/lettersgame.js';
import { MultiSelect } from 'primereact/multiselect';

class LadderExplorer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            length: [],
            difficulty: [],
            validWords: [],
            resultLimit: 100,
            ladders: [],
            filter: "",
        }
    }

    handleGetLadders = async () => {
        const filters = {
            length: this.state.length,
            difficulty: this.state.difficulty,
            ladder_filter: this.state.filter,
            page_size: this.state.resultLimit
        }
        const response = await axios.post('http://shaunhegarty.com/api/ladders/search/', filters)
        const ladders = response.data['ladders']
        this.setState({ 'ladders': ladders })
    }

    handleFilterChange = (e) => {
        const word = e.target.value.toLowerCase();
        this.setState({ filter: word })
    }

    ladderWordLengthHandler(value) {
        console.log(value)
        this.setState({ 'length': value })
    }

    ladderDifficultyHandler(value) {
        this.setState({ 'difficulty': value })
    }

    render() {
        return (<div id="ladder-explorer">
            <GetLadderButton
                getLadderHandler={(e) => this.handleGetLadders(e)}
                selectedLengths={this.state.length}
                ladderWordLengthHandler={(e) => this.ladderWordLengthHandler(e)}
                selectedDifficulties={this.state.difficulty}
                ladderDifficultyHandler={(e) => this.ladderDifficultyHandler(e)}
                currentFilter={this.state.filter}
                ladderFilterChangeHandler={(e) => this.handleFilterChange(e)}
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

    toggleShowLadder = async () => {
        if (!this.state.chain) {
            const response = await axios.get('http://shaunhegarty.com/api/ladders/' + this.props.ladder.pair)
            let chain = response.data['ladder']
            this.setState({ 'chain': chain })
        }
        this.state.displayLadder ? this.collapse() : this.showLadder();
    }

    showGame() {
        this.setState({ 'displayLadder': false, 'displayGame': true })
    }

    showLadder() {
        this.setState({ 'displayLadder': true, 'displayGame': false })
    }

    collapse() {
        this.setState({ 'displayLadder': false, 'displayGame': false })
    }

    render() {
        let expansion;
        if (this.state.displayLadder) {
            expansion = (<LadderShow ladder={this.state.chain} />)
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
            <div id={this.state.pair + '-ladder-show'} className="ladder-show">{ladderWords}</div>
        )
    }
}

class GetLadderFilters extends React.Component {
    render() {
        const difficulties = [...Array(10).keys()];
        const word_lengths = [3, 4, 5, 6]
        const difficulty_options = difficulties.map(d => {
            d = (d + 1).toString()
            return { label: d, value: d }
        })
        const length_options = word_lengths.map(w => {
            w = w.toString()
            return { label: w, value: w }
        })
        return (
            <div id="ladder-filters">
                <div id="word-length-container">
                    <div>Difficulty</div>
                    <MultiSelect
                        placeholder='Lower numbers are easier'
                        label="Difficulty"
                        value={this.props.selectedDifficulties}
                        options={difficulty_options}
                        className="filter-multi-select"
                        onChange={(e) => this.props.ladderDifficultyHandler(e.value)}
                        showSelectAll={false}
                        display='chip'
                    />
                </div>
                <div id="difficulty-container">
                    <div>Word Length</div>
                    <MultiSelect
                        placeholder='Range from 3 to 6'
                        label="Word Length"
                        value={this.props.selectedLengths}
                        options={length_options}
                        className="filter-multi-select"
                        onChange={(e) => this.props.ladderWordLengthHandler(e.value)}
                        showSelectAll={false}
                        display='chip'
                    />
                </div>
            </div>
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
                            className="game-button"
                            onClick={this.props.getLadderHandler}>
                            Get Ladders
                        </button>
                    </div>

                </div>
                <div className="ladder-filter-text">
                    <div>Filter Ladders</div>
                    <WordEntry
                        maxLength={15}
                        disabled={false}
                        word={this.props.currentFilter}
                        showBackspace={false}
                        showSaveButton={false}
                        changeHandler={this.props.ladderFilterChangeHandler}
                    />
                </div>

                <GetLadderFilters
                    word={this.props.currentFilter}
                    selectedDifficulties={this.props.selectedDifficulties}
                    selectedLengths={this.props.selectedLengths}
                    filterChangeHandler={this.props.ladderFilterChangeHandler}
                    ladderDifficultyHandler={this.props.ladderDifficultyHandler}
                    ladderWordLengthHandler={this.props.ladderWordLengthHandler}
                />
            </div>)
    }
}

export default LadderExplorer;