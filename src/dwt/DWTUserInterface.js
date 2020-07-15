import React, { Suspense } from 'react';
import './DWTUserInterface.css';
import DWTOutPut from './DWTOutPut';
import DWTView from './DWTView';
const DWTController = React.lazy(() => import('./DWTController'));

/**
 * @props
 * @prop {object} Dynamsoft a namespace
 * @prop {number} features the features that are enabled
 * @prop {string} containerId the id of a DIV in which the view of Dynamic Web TWAIN will be built
 * @prop {number} startTime the time when initializing started
 * @prop {WebTwain} dwt the object to perform the magic of Dynamic Web TWAIN
 * @prop {string} status a message to indicate the status of the application
 * @prop {object} buffer the buffer status of data in memory (current & count)
 * @prop {number[]} selected the indices of the selected images
 * @prop {object[]} zones the zones on the current image that are selected by the user
 * @prop {object} runtimeInfo contains runtime information like the width & height of the current image 
 * @prop {function} handleBufferChange a function to call when the buffer may requires updating
 */
export default class DWTUserInterface extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: this.props.startTime,
            messages: [{ time: (new Date()).getTime(), text: this.statusChangeText(this.props.status), type: "info" }],
            bNoScroll: false,
            bNoNavigating: false,
            barcodeRects: []
        };
    }
    componentDidUpdate(prevProps) {
        if (prevProps.status !== this.props.status) {
            let _statusChange = this.props.status - prevProps.status;
            let _text = this.statusChangeText(this.props.status, _statusChange);
            if (_text.indexOf("_ALLDONE_") !== -1) {
                this.handleOutPutMessage(_text.substr(9));
                this.handleOutPutMessage("All ready... <initialization took " + ((new Date()).getTime() - this.props.startTime) + " milliseconds>", "important");
            } else
                this.handleOutPutMessage(_text);
        }
        if ((prevProps.buffer.current !== this.props.buffer.current) || this.props.buffer.updated) {
            this.state.barcodeRects.length > 0 && this.handleBarcodeResults("clear");
            this.props.buffer.updated && this.props.handleBufferChange();
        }
    }
    statusChangeText(_status, _statusChange) {
        let text = "Initializing...";
        if (_statusChange) {
            text = [];
            (_statusChange & 1) && text.push("Core module ");
            (_statusChange & 2) && text.push("Webcam module ");
            (_statusChange & 32) && text.push("Barcode Reader module ");
            (_statusChange & 64) && text.push("OCR module ");
            (_statusChange & 128) && text.push("File Uploader module ");
            if (text.length > 1)
                text = text.join(" & ");
            text += "ready...";
        }
        if (_status === 255) {
            if (_statusChange)
                text = "_ALLDONE_" + text;
            else
                text = "Ready...";
        }
        return text;
    }
    handleBarcodeResults(results) {
        if (results === "clear")
            this.setState({ barcodeRects: [] });
        else {
            let _oldBR = this.state.barcodeRects;
            if (results.length > 0) {
                let zoom;
                if (this.props.runtimeInfo.showAbleWidth >= this.props.runtimeInfo.ImageWidth && this.props.runtimeInfo.showAbleHeight >= this.props.runtimeInfo.ImageHeight) {
                    zoom = 1;
                } else if (this.props.runtimeInfo.showAbleWidth / this.props.runtimeInfo.showAbleHeight >= this.props.runtimeInfo.ImageWidth / this.props.runtimeInfo.ImageHeight) {
                    zoom = this.props.runtimeInfo.showAbleHeight / this.props.runtimeInfo.ImageHeight;
                } else {
                    zoom = this.props.runtimeInfo.showAbleWidth / this.props.runtimeInfo.ImageWidth;
                }
                for (let i = 0; i < results.length; ++i) {
                    let result = results[i];
                    let loc = result.localizationResult;
                    let left = Math.min(loc.x1, loc.x2, loc.x3, loc.x4);
                    let top = Math.min(loc.y1, loc.y2, loc.y3, loc.y4);
                    let right = Math.max(loc.x1, loc.x2, loc.x3, loc.x4);
                    let bottom = Math.max(loc.y1, loc.y2, loc.y3, loc.y4);
                    let leftBase = 1 + this.props.runtimeInfo.showAbleWidth / 2 - this.props.runtimeInfo.ImageWidth / 2 * zoom;
                    let topBase = 1 + this.props.runtimeInfo.showAbleHeight / 2 - this.props.runtimeInfo.ImageHeight / 2 * zoom;
                    let width = (right - left) * zoom;
                    let height = (bottom - top) * zoom;
                    left = leftBase + left * zoom;
                    top = topBase + top * zoom;
                    _oldBR.push({ x: left, y: top, w: width, h: height });
                }
                this.setState({ barcodeRects: _oldBR });
            }
        }
    }
    handleOutPutMessage(message, type, bReset, bNoScroll) {
        let _noScroll = false, _type = "info";
        if (type)
            _type = type;
        if (_type === "httpResponse") {
            let msgWindow = window.open("", "Response from server", "height=500,width=750,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no");
            msgWindow.document.writeln(message);
        } else {
            if (bNoScroll)
                _noScroll = true;
            if (bReset)
                this.setState((state, props) => {
                    return {
                        messages: [{ time: (new Date()).getTime(), text: this.statusChangeText(props.status), type: "info" }],
                        bNoScroll: false
                    }
                });
            else {
                let oldMessages = this.state.messages;
                oldMessages.push({ time: (new Date()).getTime(), text: message, type: _type });
                this.setState({
                    messages: oldMessages,
                    bNoScroll: _noScroll
                });
            }
        }
    }
    handleException(ex) {
        this.handleOutPutMessage(ex.message, "error");
    }
    handleNavigating(bAllow) {
        this.setState({ bNoNavigating: !bAllow });
    }
    handleEvent(evt) {
        switch (evt) {
            default: break;
            case "doubleClick": this.handleOutPutMessage("", "", true); break;
            case "delete": this.handleOutPutMessage("", "", true); break;
        }
    }
    render() {
        return (
            <div id="DWTcontainer" className="container">
                <div style={{ textAlign: "left", position: "relative", float: "left", width: "980px" }} className="fullWidth clearfix">
                    <DWTView
                        blocks={0b11} /** 1: navigate 2: quick edit */
                        dwt={this.props.dwt}
                        buffer={this.props.buffer}
                        zones={this.props.zones}
                        containerId={this.props.containerId}
                        runtimeInfo={this.props.runtimeInfo}
                        bNoNavigating={this.state.bNoNavigating}
                        barcodeRects={this.state.barcodeRects}
                        handleViewerSizeChange={(viewSize) => this.props.handleViewerSizeChange(viewSize)}
                        handleBufferChange={() => this.props.handleBufferChange()}
                        handleOutPutMessage={(message, type, bReset, bNoScroll) => this.handleOutPutMessage(message, type, bReset, bNoScroll)}
                    />
                    <Suspense>
                        <DWTController
                            Dynamsoft={this.props.Dynamsoft}
                            startTime={this.props.startTime}
                            features={this.props.features}
                            dwt={this.props.dwt}
                            buffer={this.props.buffer}
                            selected={this.props.selected}
                            zones={this.props.zones}
                            runtimeInfo={this.props.runtimeInfo}
                            barcodeRects={this.state.barcodeRects}
                            handleStatusChange={(value) => this.props.handleStatusChange(value)}
                            handleBarcodeResults={(results) => this.handleBarcodeResults(results)}
                            handleNavigating={(bAllow) => this.handleNavigating(bAllow)}
                            handleException={(ex) => this.handleException(ex)}
                            handleOutPutMessage={(message, type, bReset, bNoScroll) => this.handleOutPutMessage(message, type, bReset, bNoScroll)}
                        />
                    </Suspense>
                </div>
                <div style={{ textAlign: "left", position: "relative", float: "left", width: "980px" }} className="fullWidth clearfix">
                    <DWTOutPut
                        note={"(Double click or hit 'delete' to clear!)"}
                        handleEvent={(evt) => this.handleEvent(evt)}
                        messages={this.state.messages}
                        bNoScroll={this.state.bNoScroll}
                    />
                    <div className="DWT_Notice">
                        <p><strong>Platform &amp;Browser Support:</strong></p>Chrome|Firefox|Edge on Windows
                            <p><strong>OCR:</strong> </p> Only English with OCR Basic is demonstrated.<br />
                            Click &nbsp;
                            <u><a href='https://www.dynamsoft.com/Products/ocr-basic-languages.aspx'>here</a></u>
                            &nbsp;for other supported languages and&nbsp;
                            <u><a href='https://www.dynamsoft.com/Products/cpp-ocr-library.aspx'>here</a></u> for the differences betwen two available OCR engines.
                    </div>
                </div>
            </div >
        );
    }
}