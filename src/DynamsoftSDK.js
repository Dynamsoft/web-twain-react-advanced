import React from 'react';
import Dynamsoft from 'dwt';
import dynamsoft from 'dynamsoft-sdk';
import DWTUserInterface from './dwt/DWTUserInterface';

export default class DWT extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.features) {
            this.features = 0;
            this.props.features.map((value) => {
                if (this.featureSet[value]) this.features += this.featureSet[value];
                return this.features;
            });
            this.initialStatus = 255 - (this.features & 0b11100011);
        }
        this.state = {
            startTime: (new Date()).getTime(),
            unSupportedEnv: false,
            dwt: null,
            /** status
             * 0:  "Initializing..."
             * 1:  "Core Ready..." (scan)
             * 2:  "Camera Ready..."
             * 32: "BarcodeReader Ready..."
             * 64: "OCR engine Ready..."
             * 128:"Uploader Ready..."
             */
            status: this.initialStatus,
            selected: [],
            buffer: {
                updated: false,
                count: 0,
                current: -1
            },
            zones: [],
            runtimeInfo: {
                curImageTimeStamp: null,
                showAbleWidth: 0,
                showAbleHeight: 0,
                ImageWidth: 0,
                ImageHeight: 0
            }
        };
    }
    featureSet = { scan: 0b1, camera: 0b10, load: 0b100, save: 0b1000, upload: 0b10000, barcode: 0b100000, ocr: 0b1000000, uploader: 0b10000000 };
    features = 0b11111111;
    initialStatus = 0;
    DWObject = null;
    containerId = 'dwtcontrolContainer';
    width = 583;
    height = 513;
    componentDidMount() {
        if (Dynamsoft && (!Dynamsoft.Lib.env.bWin || !Dynamsoft.Lib.product.bChromeEdition)) {
            this.setState({ unSupportedEnv: true });
            return;
        } else {
            Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', () => {
                this.handleStatusChange(1);
                this.setState({
                    dwt: Dynamsoft.WebTwainEnv.GetWebTwain(this.containerId)
                });
                this.DWObject = this.state.dwt;
                if (this.DWObject) {
                    /**
                     * NOTE: RemoveAll doesn't trigger bitmapchanged nor OnTopImageInTheViewChanged!!
                     */
                    this.DWObject.RegisterEvent("OnBitmapChanged", (changedIndex, changeType) => this.handleBufferChange(changedIndex, changeType));
                    this.DWObject.RegisterEvent("OnTopImageInTheViewChanged", (index) => this.go(index));
                    this.DWObject.RegisterEvent("OnPostTransfer", () => this.handleBufferChange());
                    this.DWObject.RegisterEvent("OnPostLoad", () => this.handleBufferChange());
                    this.DWObject.RegisterEvent("OnPostAllTransfers", () => this.DWObject.CloseSource());
                    this.DWObject.RegisterEvent('OnImageAreaSelected', (nImageIndex, left, top, right, bottom, sAreaIndex) => {
                        let oldZones = this.state.zones;
                        oldZones.push({ x: left, y: top, width: right - left, height: bottom - top });
                        this.setState({ zones: oldZones });
                    });
                    this.DWObject.RegisterEvent('OnImageAreaDeSelected', () => this.setState({ zones: [] }));
                    if (Dynamsoft.Lib.env.bWin)
                        this.DWObject.MouseShape = false;
                    this.handleBufferChange();
                }
            });
            this.loadDWT();
        }
    }
    loadDWT() {
        Dynamsoft.WebTwainEnv.ProductKey = this.props.productKey;
        dynamsoft.dbrEnv.productKey = this.props.productKey;
        Dynamsoft.WebTwainEnv.Containers = [{ ContainerId: this.containerId, Width: this.width, Height: this.height }];
        Dynamsoft.WebTwainEnv.Load();
    }
    go(index) {
        this.DWObject.CurrentImageIndexInBuffer = index;
        this.handleBufferChange();
    }
    handleBufferChange(changedIndex, changeType) {
        let _updated = false;
        if (changeType === 4) {// Modified
            _updated = true;
        }
        let selection = [];
        let count = this.DWObject.SelectedImagesCount;
        for (let i = 0; i < count; i++) {
            selection.push(this.DWObject.GetSelectedImageIndex(i));
        }
        this.setState({
            zones: [],
            selected: selection,
            buffer: {
                updated: _updated,
                current: this.DWObject.CurrentImageIndexInBuffer,
                count: this.DWObject.HowManyImagesInBuffer
            }
        }, () => {
            if (this.state.buffer.count > 0) {
                this.setState({
                    runtimeInfo: {
                        curImageTimeStamp: (new Date()).getTime(),
                        showAbleWidth: this.DWObject.HowManyImagesInBuffer > 1 ? this.width - 16 : this.width,
                        showAbleHeight: this.height,
                        ImageWidth: this.DWObject.GetImageWidth(this.state.buffer.current),
                        ImageHeight: this.DWObject.GetImageHeight(this.state.buffer.current)
                    }
                });
            }
        });
    }
    handleStatusChange(value) {
        this.setState((state) => { return { status: state.status + value } });
    }
    handleViewerSizeChange(viewSize) {
        this.width = viewSize.width;
        this.height = viewSize.height;
    }
    render() {
        return (
            this.state.unSupportedEnv ? <div>Please use Chrome, Firefox or Edge on Windows!</div> :
                <DWTUserInterface
                    Dynamsoft={Dynamsoft}
                    dynamsoft={dynamsoft}
                    features={this.features}
                    containerId={this.containerId}
                    startTime={this.state.startTime}
                    dwt={this.state.dwt}
                    status={this.state.status}
                    buffer={this.state.buffer}
                    selected={this.state.selected}
                    zones={this.state.zones}
                    runtimeInfo={this.state.runtimeInfo}
                    handleViewerSizeChange={(viewSize) => this.handleViewerSizeChange(viewSize)}
                    handleStatusChange={(value) => this.handleStatusChange(value)}
                    handleBufferChange={() => this.handleBufferChange()}
                />
        );
    }
}
