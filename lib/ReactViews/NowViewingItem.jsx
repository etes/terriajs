'use strict';
const React = require('react');
const ModalTriggerButton = require('./ModalTriggerButton.jsx');
const imageUrlRegex = /[.\/](png|jpg|jpeg|gif)/i;
const defined = require('terriajs-cesium/Source/Core/defined');
const ObserveModelMixin = require('./ObserveModelMixin');
const PureRenderMixin = require('react-addons-pure-render-mixin');

// Maybe should be called nowViewingItem?
const NowViewingItem = React.createClass({
  mixins: [ObserveModelMixin, PureRenderMixin],
  propTypes: {
    nowViewingItem: React.PropTypes.object,
    index: React.PropTypes.number
  },

  getInitialState() {
    return {
      isOpen: true,
      isVisible: true,
      hoverOver: 0
    };
  },

  removeFromMap() {
    this.props.nowViewingItem.isEnabled = false;
  },

  toggleDisplay() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  },

  toggleVisibility() {
    this.props.nowViewingItem.isShown = !this.props.nowViewingItem.isShown;
    this.setState({
      isVisible: !this.state.isVisible
    });
  },

  zoom() {
    this.props.nowViewingItem.zoomToAndUseClock();
  },

  changeOpacity(event) {
    this.props.nowViewingItem.opacity = event.target.value;
  },

  onDragStart(e) {
    if (!e.currentTarget || !e.currentTarget.parentElement.parentElement) {
        return;
    }

    this.setState({
      isOpen: false
    });
    let selectedIndex = parseInt(e.currentTarget.dataset.key);
  },

  onDragEnd(e) {
    this.setState({
      // Temp
      isOpen: true
    });
    let selectedIndex = parseInt(e.currentTarget.dataset.key);
  },

  onDragOverDropZone(e) {
    let dropZoneId = parseInt(e.currentTarget.dataset.key);
    if(dropZoneId !== this.state.hoverOver) { this.setState({ hoverOver: dropZoneId });}
  },

  onDragOverItem(e){
    let over = parseInt(e.currentTarget.dataset.key);
    if(e.clientY - e.currentTarget.offsetTop > e.currentTarget.offsetHeight / 2) { over++; }
    if(over !== this.state.hoverOver) { this.setState({ hoverOver: over }); }
  },

  renderLegend(_nowViewingItem) {
    if (_nowViewingItem.legendUrl) {
      if (_nowViewingItem.legendUrl.isImage()) {
        return <a href={_nowViewingItem.legendUrl.url} target="_blank"><img src={_nowViewingItem.legendUrl.url}/></a>;
      }
      else {
        return <a href={_nowViewingItem.legendUrl.input} target="_blank">Open legend in a separate tab</a>;
      }
    }
    return 'No legend to show';
  },

  render() {
    const nowViewingItem = this.props.nowViewingItem;
    return (
          <li>
          <div className='nowViewing__drop-zone' data-key={this.props.index} onDragOver={this.onDragOverDropZone}></div>
          <div className={'now-viewing__item clearfix ' + (this.state.isOpen === true ? 'is-open' : '')} >
            <div className ="now-viewing__item-header clearfix">
              <button draggable='true' onDragOver ={this.onDragOverItem} onDragStart={this.onDragStart} onDragEnd={this.onDragStart} className="btn btn-drag block col col-11">{nowViewingItem.name}</button>
              <button onClick={this.toggleDisplay} className="btn block col col-1"><i className={this.state.isOpen ? 'icon-chevron-down icon' : 'icon-chevron-right icon'}></i></button>
            </div>
            <div className ="now-viewing__item-inner">
              <ul className="list-reset flex clearfix now-viewing__item-control">
                <li><button onClick={this.zoom} data-key={this.props.index} title="Zoom in data" className="btn zoom">Zoom To</button></li>
                <li><ModalTriggerButton btnHtml="info" classNames='info' /></li>
                <li><button onClick={this.removeFromMap} title="Remove this data" className="btn remove">Remove</button></li>
                <li className='flex-grow right-align'><button onClick={this.toggleVisibility} title="Data show/hide" className="btn visibility"><i className={'icon ' + (this.state.isVisible ? 'icon-visible' : 'icon-invisible')}></i></button></li>
              </ul>
              <div className="now-viewing__item-opacity">
                <label htmlFor="opacity">Opacity: </label>
                <input type='range' name='opacity' min='0' max='1' step='0.01' value={nowViewingItem.opacity} onChange={this.changeOpacity}/>
              </div>
              <div className="now-viewing__item-legend">
                {this.renderLegend(nowViewingItem)}
              </div>
            </div>
            </div>
        </li>
      );
  }
});
module.exports = NowViewingItem;
