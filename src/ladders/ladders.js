import React from 'react';
import axios from 'axios';

class LadderExplorer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            length: 3,
            validWords: [],
            ladders: [],
        }
    }

    handleGetLadders = async () => {
        const response = await axios.get('http://shaunhegarty.com/api/ladders/1/' + this.state.length)
        let ladders = response.data['ladders']
        this.setState({ 'ladders': ladders })
        console.log(ladders)
    }

    render() {
        return (<div id="ladder-explorer">
            <GetLadderButton getLadderHandler={(e) => this.handleGetLadders(e)} />
            <SimpleLadderDisplay ladders={this.state.ladders} />
        </div>)
    }
}

class SimpleLadderDisplay extends React.Component {
    render() {
        const ladders = this.props.ladders.map(function (ladder, index) {
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
        console.log(this.state.displayLadder)
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
                <div className="shortest-path">{this.props.ladder.min_length} </div>
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
            <div id={this.state.pair + '-ladder-show'}>{ladderWords}</div>
        )
    }
}

class GetLadderButton extends React.Component {
    render() {
        return (
            <button
                id="get-ladder-button"
                className="get-ladder-button"
                onClick={this.props.getLadderHandler}
            >
                Get Ladders
            </button>)
    }
}

export default LadderExplorer;