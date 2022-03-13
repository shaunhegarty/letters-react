import React from 'react';
import './App.css';
import './wordprobe/wordprobe.css'
import './letters/letters.css'
import LettersGame from './letters/lettersgame.js';
import ApiProbe from './wordprobe/wordprobe.js';



function ViewButton(props) {
  const selectedClass = props.selected ? " button-selected" : "";
  return (
    <div
      className={"view-button" + selectedClass}
      onClick={() => props.onClick(props.view)}
    >
      {props.view}
    </div>
  )
}


class Views {
  static PROBE = 'Word Probe';
  static GAME = 'Game';
}

class ViewSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: Views.PROBE,
    }
  }

  handleClickView(view) {
    console.log('Clicked View: ' + view)
    this.setState({ view: view })
  }

  renderViewButton(view, state) {
    const selected = state.view === view;
    return <ViewButton key={view} view={view} selected={selected} onClick={(e) => this.handleClickView(e)}></ViewButton>
  }

  render() {
    const viewsList = [Views.PROBE, Views.GAME]
    const views = viewsList.map((view) => this.renderViewButton(view, this.state));
    const view = this.state.view;
    let selectedView = (<div>Selected View</div>);
    if (view === Views.GAME) {
      selectedView = (<LettersGame />)
    } else if (view === Views.PROBE) {
      selectedView = (<ApiProbe />)
    }
    return (
      <div id="view-container" className="grid-container">
        <div id='view-selector' className='view-selector'>
          {views}
        </div>
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
