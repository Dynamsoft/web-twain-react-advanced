import React from 'react';
import './ValuePicker.css';

/**
 * @props
 * @prop {object} Dynamsoft a namespace
 * @prop {object[]} valuePacks the value packs to display
 */
export default class ValuePicker extends React.Component {
    constructor(props) {
        super(props);
        this.valuesList = React.createRef();
        this.state = {
            current: this.props.current,
            currentValues: []
        };
    }
    componentDidUpdate(prevProps) {
        let _valuePacks = this.props.valuePacks;
        if (this.state.currentValues.length === 0 || this.props.targetObject !== prevProps.targetObject) {
            for (let i = 0; i < _valuePacks.length; i++) {
                if (_valuePacks[i].name === this.props.current) {
                    this.setState({ currentValues: _valuePacks[i].items }, () => this.changeScrollTop());
                    return;
                }
            }
        }
        this.changeScrollTop();
    }
    changeScrollTop() {
        let _valueLIs = this.valuesList.current.children, _scrollTop = 0, _height = 0;
        if (_valueLIs && _valueLIs.length > 0) {
            for (let i = 0; i < this.state.currentValues.length; i++) {
                if (this.state.currentValues[i].checked) {
                    _scrollTop = _valueLIs[i].offsetTop;
                    _height = _valueLIs[i].offsetHeight;
                }
            }
        }
        if (this.valuesList.current.scrollTop - _scrollTop > 0)
            this.valuesList.current.scrollTop = _scrollTop;
        else if (this.valuesList.current.scrollTop + this.valuesList.current.offsetHeight < _scrollTop + _height) {
            this.valuesList.current.scrollTop = _scrollTop + _height - this.valuesList.current.offsetHeight;
        }
    }
    handlePackChange(event) {
        if (event.keyCode && event.keyCode !== 32) return;
        if (event.keyCode && event.keyCode === 32) event.preventDefault();
        let packName = event.target.getAttribute("value");
        for (let i = 0; i < this.props.valuePacks.length; i++) {
            if (this.props.valuePacks[i].name === packName) {
                this.setState({ currentValues: this.props.valuePacks[i].items, current: packName });
                break;
            }
        }
    }
    handleValuePicked(event) {
        if (event.keyCode && event.keyCode !== 32) return;
        if (event.keyCode && event.keyCode === 32) event.preventDefault();
        let value = event.target.getAttribute("value");
        let old_Values = this.state.currentValues;
        for (let i = 0; i < old_Values.length; i++) {
            if (old_Values[i].value === value)
                old_Values[i].checked = true;
            else
                old_Values[i].checked = false;
            this.setState({ currentValues: old_Values }, () => {
                this.props.handleValuePicking({ prop: this.state.current, value: value });
            });
        }
    }
    render() {
        return (
            <div className="valuePicker">
                <ul>
                    {
                        this.props.valuePacks.map((topItem, _key) =>
                            <li tabIndex={this.props.tabIndex}
                                className={(topItem.name === this.state.current) ? "current" : ""}
                                value={topItem.name}
                                key={Math.floor(Math.random() * 10000000)}
                                onClick={(event) => this.handlePackChange(event)}
                                onKeyUp={(event) => this.handlePackChange(event)}
                            >{topItem.name}</li>
                        )
                    }
                </ul>
                <ul ref={this.valuesList}>
                    {
                        this.state.currentValues.map((values, __key) => (
                            <li tabIndex={this.props.tabIndex}
                                className={values.checked ? "current" : ""}
                                value={values.value}
                                key={Math.floor(Math.random() * 10000000)}
                                onClick={(event) => this.handleValuePicked(event)}
                                onKeyUp={(event) => this.handleValuePicked(event)}
                            >{values.value}</li>
                        ))
                    }
                </ul>
            </div>
        );
    }
}