import React from 'react';
import Dynamsoft from 'dwt';
import dynamsoft from 'dynamsoft-sdk';
import DWTUserInterface from './dwt/DWTUserInterface';

export default class DWT extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: (new Date()).getTime(),
            unSupportedEnv: false,
            dwt: null,
            status: "Initializing...",
            selected: [],
            buffer: {
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
                this.setState({
                    dwt: Dynamsoft.WebTwainEnv.GetWebTwain(this.containerId),
                    status: "Ready..."
                })
                this.DWObject = this.state.dwt;
                if (this.DWObject) {
                    /**
                     * NOTE: RemoveAll doesn't trigger bitmapchanged nor OnTopImageInTheViewChanged!!
                     */
                    this.DWObject.RegisterEvent("OnBitmapChanged", () => this.handleBufferChange());
                    this.DWObject.RegisterEvent("OnTopImageInTheViewChanged", (index) => this.go(index));
                    this.DWObject.RegisterEvent("OnPostTransfer", () => this.handleBufferChange());
                    this.DWObject.RegisterEvent("OnPostLoad", () => this.handleBufferChange());
                    this.DWObject.RegisterEvent("OnPostAllTransfers", () => this.DWObject.CloseSource());
                    this.DWObject.RegisterEvent('OnImageAreaSelected', (nImageIndex, left, top, right, bottom, sAreaIndex) => {
                        let oldZones = this.state.zones;
                        oldZones.push({ x: left, y: top, width: right - left, height: bottom - top });
                        this.setState({
                            zones: oldZones
                        });
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
    handleBufferChange() {
        let selection = [];
        let count = this.DWObject.SelectedImagesCount;
        for (let i = 0; i < count; i++) {
            selection.push(this.DWObject.GetSelectedImageIndex(i));
        }
        this.setState({
            zones: [],
            selected: selection,
            buffer: {
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
    render() {
        return (
            this.state.unSupportedEnv ? <div>Please use Chrome, Firefox or Edge on Windows!</div> :
                <DWTUserInterface
                    Dynamsoft={Dynamsoft}
                    dynamsoft={dynamsoft}
                    features={this.props.features}
                    containerId={this.containerId}
                    startTime={this.state.startTime}
                    dwt={this.state.dwt}
                    status={this.state.status}
                    buffer={this.state.buffer}
                    selected={this.state.selected}
                    zones={this.state.zones}
                    runtimeInfo={this.state.runtimeInfo}
                    handleBufferChange={() => this.handleBufferChange()}
                />
        );
    }
}
