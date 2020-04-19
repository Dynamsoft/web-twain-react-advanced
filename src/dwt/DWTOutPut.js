import React from 'react';
import './DWTOutPut.css';

/**
 * @props
 * @prop {function} handleDoubleClick the behavior when the message box is double-clicked
 * @prop {string} note a note (like what happens when you double click)
 * @prop {string[]} messages the messages to print out
 * @prop {boolean} bNoScroll whether the message box should scroll to show the last message
 */
export default class DWTOutPut extends React.Component {
    constructor(props) {
        super(props);
        this.DWTOutPut_message = React.createRef();
    }
    componentDidUpdate(prevProps) {
        if (this.props.bNoScroll)
            this.DWTOutPut_message.current.scrollTop = 0;
        else
            this.DWTOutPut_message.current.scrollTop = this.DWTOutPut_message.current.scrollHeight;
    }
    handleKeyUp(e) {
        if (e.keyCode && e.keyCode === 46) {
            this.props.handleEvent("delete");
        }
    }
    render() {
        return (
            <div className="DWTOutPut">Message: {this.props.note}<br />
                <div ref={this.DWTOutPut_message} tabIndex="8" className="message" onKeyUp={(e) => this.handleKeyUp(e)} onDoubleClick={() => this.props.handleEvent("doubleClick")}>
                    <ul>
                        {
                            this.props.messages.map((oneMsg) =>
                                <li key={oneMsg.time + "_" + Math.floor(Math.random(1) * 10000000)} className={oneMsg.type}>{oneMsg.text}</li>
                            )
                        }
                    </ul>
                </div>
            </div>
        );
    }
}