import React from 'react';
import './RangePicker.css';

/**
 * @props
 * @prop {object} Dynamsoft a namespace
 * @prop {object} rangePicker info about the range 
 */
export default class RangePicker extends React.Component {
    constructor(props) {
        super(props);
        this.rangePicker = React.createRef();
        this.overlayDIV = React.createRef();
    }
    offsetX
    offsetY
    oldX
    oldY
    move = e => {
        const parent = this.rangePicker.current;
        parent.style.left = `${this.oldX + (e.clientX - this.offsetX)}px`;
        parent.style.top = `${this.oldY + (e.clientY - this.offsetY)}px`;
        this.oldX = parent.offsetLeft;
        this.offsetX = e.clientX;
        this.oldY = parent.offsetTop;
        this.offsetY = e.clientY;
    }
    add = e => {
        const parent = this.rangePicker.current;
        this.oldX = parent.offsetLeft;
        this.oldY = parent.offsetTop;
        this.offsetX = e.clientX;
        this.offsetY = e.clientY;
        parent.addEventListener('mousemove', this.move);
        this.overlayDIV.current.addEventListener('mousemove', this.move);
    }
    remove = e => {
        this.rangePicker.current.removeEventListener('mousemove', this.move);
        this.overlayDIV.current.removeEventListener('mousemove', this.move);
    }
    render() {
        return (<><div ref={this.overlayDIV} className="overlay" onMouseUp={this.remove}></div>
            <div ref={this.rangePicker} className="range-Picker" onMouseUp={this.remove}>
                <div className="range-title" onMouseDown={this.add}>
                    <span className="range-title" >{this.props.rangePicker.title}</span>
                </div>
                <div className="range-content">
                    {this.props.rangePicker.bMutable
                        ? (<>
                            <span className="range-current" >{this.props.rangePicker.value} (Default: {this.props.rangePicker.defaultvalue})</span>
                            <span>{this.props.rangePicker.min}</span>
                            <input type="range"
                                prop={this.props.rangePicker.title} _type={this.props.rangePicker.bCamera ? "camera" : "video"}
                                min={this.props.rangePicker.min} max={this.props.rangePicker.max}
                                step={this.props.rangePicker.step} value={this.props.rangePicker.value}
                                onChange={(event) => this.props.handleRangeChange(event)} />
                            <span>{this.props.rangePicker.max}</span>
                        </>)
                        : (<span className="range-current" >Default and only value (immutable): {this.props.rangePicker.value}</span>)}
                </div>
                <div className="range-buttons">
                    {this.props.rangePicker.bMutable ? <button prop={this.props.rangePicker.title}
                        _type={this.props.rangePicker.bCamera ? "camera" : "video"}
                        _default={this.props.rangePicker.defaultvalue}
                        value="reset-range" onClick={(event) => this.props.handleRangeChange(event)}>Reset &amp; Close</button> : ""}
                    < button value="close-picker" onClick={(event) => this.props.handleRangeChange(event)}>Close Window</button>
                </div>
            </div>
        </>
        );
    }
}