import React from 'react';
import axios from 'axios';

class LadderExplorer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            length: 3,
            validWords: [],
            ladders: {},
        }
    }

    handleGetLadders = async () => {
        const response = await axios.get('http://shaunhegarty.com/api/ladders/1/' + this.state.length)
        let ladderKey = this.state.length + '-ladders'
        let ladders = response.data[ladderKey]
        this.setState({'ladders': ladders})
        console.log(ladders)
    }

    render() {
        return (<div id="ladder-explorer">
            <GetLadderButton getLadderHandler={(e) => this.handleGetLadders(e)} />
        </div>)
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