import React from 'react';
import './DynamsoftSDK.css';
import Dynamsoft from 'dwt';
import dynamsoft from 'dynamsoft-sdk';
import $ from 'jquery';

class DWTView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bShowChangeSizeUI: false,
            newHeight: this.props.runtimeInfo.ImageHeight,
            newWidth: this.props.runtimeInfo.ImageWidth,
            InterpolationMethod: "1", // 1> NearestNeighbor, 2> Bilinear, 3> Bicubic
            previewMode: "1"
        };
    }
    re = /^\d+$/;
    DWObject = null;
    componentDidUpdate(prevProps) {
        if (this.props.dwt !== prevProps.dwt) this.DWObject = this.props.dwt;
        if (this.props.barcodeRects.length !== 0) {
            !this.props.bNoNavigating && this.handlePreviewModeChange("1");
        }
        if (this.props.runtimeInfo.ImageHeight !== prevProps.runtimeInfo.ImageHeight) this.setState({ newHeight: this.props.runtimeInfo.ImageHeight })
        if (this.props.runtimeInfo.ImageWidth !== prevProps.runtimeInfo.ImageWidth) this.setState({ newWidth: this.props.runtimeInfo.ImageWidth })
    }
    // Quick Edit
    handleQuickEdit(event) {
        if (this.props.buffer.count === 0) {
            this.props.handleOutPutMessage("There is no image in Buffer!", "error");
            return;
        }
        if (this.props.bNoNavigating) {
            this.props.handleOutPutMessage("Navigation not allowed", "error");
            return;
        }
        switch (event.target.getAttribute("value")) {
            case "editor": this.DWObject.ShowImageEditor(); break;
            case "rotateL": this.DWObject.RotateLeft(this.props.buffer.current); break;
            case "rotateR": this.DWObject.RotateRight(this.props.buffer.current); break;
            case "rotate180": this.DWObject.Rotate(this.props.buffer.current, 180, true); break;
            case "mirror": this.DWObject.Mirror(this.props.buffer.current); break;
            case "flip": this.DWObject.Flip(this.props.buffer.current); break;
            case "removeS": this.DWObject.RemoveAllSelectedImages(); break;
            case "removeA": this.DWObject.RemoveAllImages(); this.props.handleNavigation("removeAll"); break;
            case "changeSize": this.setState({ bShowChangeSizeUI: !this.state.bShowChangeSizeUI }); break;
            case "crop": this.crop(); break;
            case "changeImageSizeOK": this.changeImageSizeOK(); break;
            default: break;
        }
    }
    handleNewSize(event, bHeight) {
        if (!this.re.test(event.target.value)) {
            return;
        } else {
            if (bHeight)
                this.setState({ newHeight: event.target.value });
            else
                this.setState({ newWidth: event.target.value });
        }
    }
    handleInterpolationMethodChange(event) {
        this.setState({
            InterpolationMethod: event.target.value
        })
    }
    changeImageSizeOK() {
        this.DWObject.ChangeImageSize(this.props.buffer.current, this.state.newWidth, this.state.newHeight, parseInt(this.state.InterpolationMethod));
        this.setState({ bShowChangeSizeUI: !this.state.bShowChangeSizeUI });
    }
    crop() {
        if (this.props.zones.length === 0) {
            this.props.handleOutPutMessage("Please select where you want to crop first!", "error");
        } else if (this.props.zones.length > 1) {
            this.props.handleOutPutMessage("Please select only one rectangle to crop!", "error");
        } else {
            let _zone = this.props.zones[0];
            this.DWObject.Crop(
                this.props.buffer.current,
                _zone.x, _zone.y, _zone.x + _zone.width, _zone.y + _zone.height
            );
        }
    }
    handlePreviewModeChange(event) {
        let _newMode = "";
        if (event && event.target) {
            _newMode = event.target.value
        }
        else {
            if (parseInt(event) > 0 && (parseInt(event) < 6)) _newMode = parseInt(event).toString();
        }
        if (_newMode !== this.state.previewMode) {
            if (this.props.bNoNavigating) {
                console.log(this.props.barcodeRects.length);
                this.props.handleOutPutMessage("Navigation not allowed!", "error");
                return;
            }
            if (this.state.previewMode === "1" && this.props.barcodeRects.length > 0) {
                this.props.handleOutPutMessage("Can't change view mode when barcode rects are on display!", "error");
                return;
            }
            this.setState({ previewMode: _newMode });
            this.DWObject.SetViewMode(parseInt(_newMode), parseInt(_newMode));
            Dynamsoft.Lib.env.bWin && (this.DWObject.MouseShape = (parseInt(_newMode) > 1));
            this.props.handleNavigation("viewModeChange");
        }
    }
    render() {
        return (
            <div className="DWTcontainerTop">
                <div className="divEdit">
                    <ul className="operateGrp" onClick={(event) => this.handleQuickEdit(event)}>
                        <li><img value="editor" src="Images/ShowEditor.png" title="Show Image Editor" alt="Show Editor" /> </li>
                        <li><img value="rotateL" src="Images/RotateLeft.png" title="Rotate Left" alt="Rotate Left" /> </li>
                        <li><img value="rotateR" src="Images/RotateRight.png" title="Rotate Right" alt="Rotate Right" /> </li>
                        <li><img value="rotate180" src="Images/Rotate180.png" title="Rotate 180" alt="Rotate 180" /> </li>
                        <li><img value="mirror" src="Images/Mirror.png" title="Mirror" alt="Mirror" /> </li>
                        <li><img value="flip" src="Images/Flip.png" title="Flip" alt="Flip" /> </li>
                        <li><img value="removeS" src="Images/RemoveSelectedImages.png" title="Remove Selected Images" alt="Remove Selected Images" /></li>
                        <li><img value="removeA" src="Images/RemoveAllImages.png" title="Remove All Images" alt="Remove All" /></li>
                        <li><img value="changeSize" src="Images/ChangeSize.png" title="Change Image Size" alt="Change Size" /> </li>
                        <li><img value="crop" src="Images/Crop.png" title="Crop" alt="Crop" /></li>
                    </ul>
                    <div className="ImgSizeEditor" style={this.state.bShowChangeSizeUI ? { visisbility: "show" } : { visibility: "hidden" }}>
                        <ul>
                            <li>
                                <label>New Height (pixel): <input type="text" value={this.state.newHeight} className="width_48p floatR" onChange={(event) => this.handleNewSize(event, true)} /></label>
                            </li>
                            <li>
                                <label>New Width (pixel): <input type="text" value={this.state.newWidth} className="width_48p floatR" onChange={(event) => this.handleNewSize(event)} /></label>
                            </li>
                            <li>Interpolation method:
                            <select value={this.state.InterpolationMethod} className="width_48p floatR" onChange={(event) => this.handleInterpolationMethodChange(event)}>
                                    <option value="1">NearestNeighbor</option><option value="2">Bilinear</option><option value="3">Bicubic</option></select>
                            </li>
                            <li style={{ textAlign: "center" }}>
                                <button className="width_48p floatL" value="changeImageSizeOK" onClick={(event) => this.handleQuickEdit(event)} >OK</button>
                                <button className="width_48p floatR" value="changeSize" onClick={(event) => this.handleQuickEdit(event)} >Cancel</button>
                            </li>
                        </ul>
                    </div>
                </div>
                <div style={{ position: "relative", float: "left", width: "585px", height: "515px", }} id={this.props.containerId}>
                    {this.props.barcodeRects.map((_rect, _index) => (
                        <div key={_index} className="barcodeInfoRect" style={{ left: _rect.x + "px", top: _rect.y + "px", width: _rect.w + "px", height: _rect.h + "px" }} >
                            <div className="spanContainer"><span>[{_index + 1}]</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="navigatePanel clearfix">
                    <div className="ct-lt fullWidth tc floatL">
                        <button value="first" onClick={(event) => this.props.handleNavigation(event.target.value)}> |&lt; </button>
                        &nbsp;
                        <button value="previous" onClick={(event) => this.props.handleNavigation(event.target.value)}> &lt; </button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <input type="text" value={this.props.buffer.current > -1 ? this.props.buffer.current + 1 : ""} readOnly="readonly" />
                        /
                        <input type="text" value={this.props.buffer.count > 0 ? this.props.buffer.count : ""} readOnly="readonly" />
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <button value="next" onClick={(event) => this.props.handleNavigation(event.target.value)}> &gt; </button>
                        &nbsp;
                        <button value="last" onClick={(event) => this.props.handleNavigation(event.target.value)}> &gt;| </button>
                        <select className="previewMode" value={this.state.previewMode} onChange={(event) => this.handlePreviewModeChange(event)}>
                            <option value="1">1X1</option>
                            <option value="2">2X2</option>
                            <option value="3">3X3</option>
                            <option value="4">4X4</option>
                            <option value="5">5X5</option>
                        </select>
                    </div>
                </div>
            </div >
        );
    }
}

class DWTController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scanners: [],
            deviceSetup: {
                currentScanner: "Looking for devices..",
                currentCamera: "Looking for devices..",
                bShowUI: false,
                bADF: false,
                bDuplex: false,
                nPixelType: "0",
                nResolution: "100",
                isVideoOn: false
            },
            cameras: [],
            cameraSettings: {},
            saveFileName: (new Date()).getTime().toString(),
            saveFileFormat: "jpg",
            bMulti: false,
            barcodeReady: false,
            readingBarcode: false,
            ocrReady: false,
            ocring: false
        };
    }
    DWObject = null;
    dbrObject = null;
    dbrResults = [];
    componentDidMount() {
        $("ul.PCollapse li>div").click(function (event) {
            let _this = $(event.target);
            switch (_this.attr("selfvalue")) {
                case "capture":
                    break;
                case "scan":
                case "load":
                case "save":
                    if (this.DWObject)
                        this.DWObject.Addon.Webcam.StopVideo();
                    break;
                default: break;
            }
            if (_this.next().css("display") === "none") {
                $(".divType").next().hide("normal");
                $(".divType").children(".mark_arrow").removeClass("expanded");
                $(".divType").children(".mark_arrow").addClass("collapsed");
                _this.next().show("normal");
                _this.children(".mark_arrow").removeClass("collapsed");
                _this.children(".mark_arrow").addClass("expanded");
            }
        }.bind(this));
    }
    componentDidUpdate(prevProps) {
        if (this.props.dwt !== prevProps.dwt) {
            this.DWObject = this.props.dwt;
            if (this.DWObject) {
                if (this.props.features & 0b1) {
                    let vCount = this.DWObject.SourceCount;
                    let sourceNames = [];
                    for (let i = 0; i < vCount; i++)
                        sourceNames.push(this.DWObject.GetSourceNameItems(i));
                    this.setState({ scanners: sourceNames });
                    if (sourceNames.length > 0)
                        this.onSourceChange(sourceNames[0]);
                }
                if (this.props.features & 0b10) {
                    let cameraNames = this.DWObject.Addon.Webcam.GetSourceList();
                    this.setState({ cameras: cameraNames });
                    if (cameraNames.length > 0)
                        this.onCameraChange(cameraNames[0]);
                }
                if (this.props.features & 0b100000) {
                    this.initBarcodeReader(this.props.features);
                }
                if (this.props.features & 0b1000000) {
                    this.initOCR(this.props.features);
                }
                if (this.props.features < 0b100000)
                    this.props.handleOutPutMessage("Initialization done in " + ((new Date()).getTime() - this.props.startTime).toString() + " milliseconds!", "important");
            }
        }
    }
    // Tab 1: Scanner
    onSourceChange(value) {
        let oldDeviceSetup = this.state.deviceSetup;
        oldDeviceSetup.currentScanner = value;
        this.setState({
            deviceSetup: oldDeviceSetup
        });
        if (value === "noscanner") return;
        if (Dynamsoft.Lib.env.bMac) {
            if (value.indexOf("ICA") === 0) {
                let oldDeviceSetup = this.state.deviceSetup;
                oldDeviceSetup.noUI = true;
                this.setState({
                    deviceSetup: oldDeviceSetup
                });
            } else {
                let oldDeviceSetup = this.state.deviceSetup;
                oldDeviceSetup.noUI = false;
                this.setState({
                    deviceSetup: oldDeviceSetup
                });
            }
        }
    }
    handleScannerSetupChange(e, option) {
        switch (option.substr(0, 1)) {
            default: break;
            case "b":
                this.onScannerSetupChange(option, e.target.checked);
                break;
            case "n":
                this.onScannerSetupChange(option, e.target.value);
                break;
        }
    }
    onScannerSetupChange(option, value) {
        let oldDeviceSetup = this.state.deviceSetup;
        switch (option) {
            case "bShowUI":
                oldDeviceSetup.bShowUI = value;
                break;
            case "bADF":
                oldDeviceSetup.bADF = value;
                break;
            case "bDuplex":
                oldDeviceSetup.bDuplex = value;
                break;
            case "nPixelType":
                oldDeviceSetup.nPixelType = value;
                break;
            case "nResolution":
                oldDeviceSetup.nResolution = value;
                break;
            default: break;
        }
        this.setState({
            deviceSetup: oldDeviceSetup
        });
    }
    acquireImage() {
        this.DWObject.CloseSource();
        for (let i = 0; i < this.DWObject.SourceCount; i++) {
            if (this.DWObject.GetSourceNameItems(i) === this.state.deviceSetup.currentScanner) {
                this.DWObject.SelectSourceByIndex(i);
                break;
            }
        }
        this.DWObject.OpenSource();
        this.DWObject.AcquireImage(
            {
                IfShowUI: this.state.deviceSetup.bShowUI,
                PixelType: this.state.deviceSetup.nPixelType,
                Resolution: this.state.deviceSetup.nResolution,
                IfFeederEnabled: this.state.deviceSetup.bADF,
                IfDuplexEnabled: this.state.deviceSetup.bDuplex,
                IfDisableSourceAfterAcquire: true,
                IfGetImageInfo: true,
                IfGetExtImageInfo: true,
                extendedImageInfoQueryLevel: 0
                /**
                 * NOTE: No errors are being logged!!
                 */
            },
            () => this.props.handleOutPutMessage("Acquire success!", "important"),
            () => this.props.handleOutPutMessage("Acquire failure!", "error")
        );
    }
    // Tab 2: Camera    
    onCameraChange(value) {
        let oldDeviceSetup = this.state.deviceSetup;
        oldDeviceSetup.currentCamera = value;
        this.setState({
            deviceSetup: oldDeviceSetup
        });
        if (value === "nocamera") return;
        this.DWObject.Addon.Webcam.StopVideo();
        if (this.DWObject.Addon.Webcam.SelectSource(value)) {
            let mediaTypes = this.DWObject.Addon.Webcam.GetMediaType(),
                _mediaTypes = {},
                _currentmT = mediaTypes.GetCurrent();
            let frameRates = this.DWObject.Addon.Webcam.GetFrameRate(),
                _frameRates = {},
                _currentfR = frameRates.GetCurrent();
            let resolutions = this.DWObject.Addon.Webcam.GetResolution(),
                _resolutions = {},
                _currentRes = resolutions.GetCurrent();
            let _advancedSettings = {},
                _advancedCameraSettings = {};
            mediaTypes = mediaTypes._resultlist;
            frameRates = frameRates._resultlist;
            resolutions = resolutions._resultlist;
            for (let i = 0; i < mediaTypes.length - 1; i++) {
                if (mediaTypes[i] !== _currentmT)
                    _mediaTypes["mT-key" + i.toString()] = {
                        "name": mediaTypes[i].toString()
                    };
                else {
                    _mediaTypes["mT-key" + i.toString()] = {
                        "name": mediaTypes[i].toString(),
                        "icon": "checkmark"
                    };
                }
            }
            for (let i = 0; i < frameRates.length - 1; i++) {
                if (frameRates[i] !== _currentfR)
                    _frameRates["fR-key" + i.toString()] = {
                        "name": frameRates[i].toString()
                    };
                else {
                    _frameRates["fR-key" + i.toString()] = {
                        "name": frameRates[i].toString(),
                        "icon": "checkmark"
                    };
                }
            }
            for (let i = 0; i < resolutions.length - 1; i++) {
                if (resolutions[i] !== _currentRes)
                    _resolutions["res-key" + i.toString()] = {
                        "name": resolutions[i].toString()
                    };
                else {
                    _resolutions["res-key" + i.toString()] = {
                        "name": resolutions[i].toString(),
                        "icon": "checkmark"
                    };
                }
            }
            for (let item in window.EnumDWT_VideoProperty) {
                _advancedSettings["adv-key" + window.EnumDWT_VideoProperty[item].toString() + "-" + item.substr(3)] = {
                    "name": item.substr(3)
                };
            }
            for (let item in window.EnumDWT_CameraControlProperty) {
                _advancedCameraSettings["advc-key" + window.EnumDWT_CameraControlProperty[item].toString() + "-" + item.substr(4)] = {
                    "name": item.substr(4)
                };
            }
            this.setState({
                cameraSettings: {
                    "mT": {
                        "name": "Media Type",
                        "items": _mediaTypes
                    },
                    "fR": {
                        "name": "Frame Rate",
                        "items": _frameRates
                    },
                    "res": {
                        "name": "Resolution",
                        "items": _resolutions
                    },
                    "adv": {
                        "name": "Advanced Video Setting",
                        "items": _advancedSettings
                    },
                    "advc": {
                        "name": "Advanced Camera Setting",
                        "items": _advancedCameraSettings
                    }
                }
            });

            /*return {
                callback: (key) => {
                    if (-1 !== key.lastIndexOf("-")) {
                        let _temp = key.split("-");
                        let fold = _temp[0];
                        let item = parseInt(_temp[1].substr(3));
                        switch (fold) {
                            default: break;
                            case "mT":
                                this.playVideo({
                                    mT: mediaTypes[item]
                                });
                                break;
                            case "fR":
                                this.playVideo({
                                    fR: frameRates[item]
                                });
                                break;
                            case "res":
                                this.playVideo({
                                    res: resolutions[item]
                                });
                                break;
                            case "adv":
                                this.playVideo({
                                    adv: item,
                                    title: _temp[2]
                                });
                                break;
                            case "advc":
                                this.playVideo({
                                    advc: item,
                                    title: _temp[2]
                                });
                                break;*/
        } else {
            this.props.handleException({
                code: -2,
                message: "Can't use the Webcam " + value + ", please make sure it's not in use!"
            });
        }
    }
    showRangePicker(property) {
        $("#ValueSelector").html("");
        $("#ValueSelector").append(
            ["<div style='text-align:center'>",
                "<span class='rangeCurrent' id='currentValue_", property.title, "'>", property.value, "</span><br />",
                "<span>", property.min, "</span>", "<input type = 'range' min = '",
                property.min, "' max='", property.max, "' step='",
                property.step, "' value='", property.value, "'/>",
                "<span>", property.max, "</span><br /></div>"
            ].join("")
        );
        let rangeCurrentValue = property.value;
        $("#ValueSelector input").off('change').on('input', function (evt) {
            rangeCurrentValue = evt.originalEvent.target.value;
            $("#ValueSelector .rangeCurrent").html(evt.originalEvent.target.value);
        });
        let _btn = {
            "OK": function () {
                $("#ValueSelector").html("");
                $(this).dialog("close");
                setTimeout(function () {
                    if (property.bCamera) {
                        this.DWObject.Addon.Webcam.SetCameraControlPropertySetting(property.id, rangeCurrentValue, false);
                    } else
                        this.DWObject.Addon.Webcam.SetVideoPropertySetting(property.id, rangeCurrentValue, false);
                }, 100);
            },
            "Reset": function () {
                $("#ValueSelector").html("");
                $(this).dialog("close");
                setTimeout(function () {
                    if (property.bCamera) {
                        this.DWObject.Addon.Webcam.SetCameraControlPropertySetting(property.id, property.defaultvalue, true);
                    } else
                        this.DWObject.Addon.Webcam.SetVideoPropertySetting(property.id, property.defaultvalue, true);
                }, 100);
            },
            "Cancle": function () {
                $("#ValueSelector").html("");
                $(this).dialog("close");
            }
        };
        $("#ValueSelector").dialog({
            title: property.title,
            resizable: true,
            width: 400,
            height: "auto",
            modal: true,
            buttons: _btn
        });
    }
    toggleShowVideo() {
        if (this.state.deviceSetup.isVideoOn === false) {
            this.toggleCameraVideo(true);
        } else {
            this.toggleCameraVideo(false);
        }
    }
    toggleCameraVideo(bShow) {
        if (bShow) {
            this.DWObject.Addon.Webcam.StopVideo();
            this.playVideo();
            let oldDeviceSetup = this.state.deviceSetup;
            oldDeviceSetup.isVideoOn = true;
            this.setState({
                deviceSetup: oldDeviceSetup
            });
        } else {
            this.DWObject.Addon.Webcam.StopVideo();
            let oldDeviceSetup = this.state.deviceSetup;
            oldDeviceSetup.isVideoOn = false;
            this.setState({
                deviceSetup: oldDeviceSetup
            });
        }
    }
    playVideo(config) {
        let basicSetting, moreSetting;
        if (config) {
            if (isFinite(config.adv)) {
                basicSetting = this.DWObject.Addon.Webcam.GetVideoPropertySetting(config.adv);
                moreSetting = this.DWObject.Addon.Webcam.GetVideoPropertyMoreSetting(config.adv);
                this.showRangePicker({
                    bCamera: false,
                    id: config.adv,
                    value: basicSetting.GetValue(),
                    min: moreSetting.GetMinValue(),
                    max: moreSetting.GetMaxValue(),
                    defaultvalue: moreSetting.GetDefaultValue(),
                    step: moreSetting.GetSteppingDelta(),
                    title: config.title
                });
                return;
            } else if (isFinite(config.advc)) {
                basicSetting = this.DWObject.Addon.Webcam.GetCameraControlPropertySetting(config.advc);
                moreSetting = this.DWObject.Addon.Webcam.GetCameraControlPropertyMoreSetting(config.advc);
                this.showRangePicker({
                    bCamera: true,
                    id: config.advc,
                    value: basicSetting.GetValue(),
                    min: moreSetting.GetMinValue(),
                    max: moreSetting.GetMaxValue(),
                    defaultvalue: moreSetting.GetDefaultValue(),
                    step: moreSetting.GetSteppingDelta(),
                    title: config.title
                });
                return;
            } else {
                this.DWObject.Addon.Webcam.StopVideo();
                if (config.fR) {
                    this.DWObject.Addon.Webcam.SetFrameRate(config.fR);
                } else if (config.mT) {
                    this.DWObject.Addon.Webcam.SetMediaType(config.mT);
                } else if (config.res) {
                    this.DWObject.Addon.Webcam.SetResolution(config.res);
                }
            }
        }
        /**
         * NOTE: The video playing is not smooth, there is a zoom-out effect (unwanted)
         */
        this.DWObject.Addon.Webcam.PlayVideo(this.DWObject, 80, function () { });
    }
    captureImage() {
        if (this.DWObject) {
            let funCaptureImage = () => setTimeout(() => { this.toggleCameraVideo(false); }, 50);
            this.DWObject.Addon.Webcam.CaptureImage(funCaptureImage, funCaptureImage);
        }
    }
    // Tab 3: Load
    loadImagesOfPDFs() {
        this.DWObject.IfShowFileDialog = true;
        this.DWObject.Addon.PDF.SetResolution(200);
        this.DWObject.Addon.PDF.SetConvertMode(1/*EnumDWT_ConvertMode.CM_RENDERALL*/);
        this.DWObject.LoadImageEx("", 5 /*EnumDWT_ImageType.IT_ALL*/, () => {
            this.props.handleOutPutMessage("Loaded an image successfully.");
        }, (errorCode, errorString) => this.props.handleException({ code: errorCode, message: errorString }));
    }
    // Tab 4: Save & Upload
    handleFileNameChange(event) {
        this.setState({ saveFileName: event.target.value });
    }
    handleSaveConfigChange(event) {
        let format = event.target.value;
        switch (format) {
            default: break;
            case "multiTIF":
            case "multiPDF":
                this.setState({ bMulti: event.target.checked }); break;
            case "tif":
            case "pdf":
                this.setState({ saveFileFormat: event.target.value, bMulti: true }); break;
            case "bmp":
            case "jpg":
            case "png":
                this.setState({ saveFileFormat: event.target.value, bMulti: false }); break;
        }
    }
    saveOrUploadImage(_type) {
        if (_type !== "local" && _type !== "server") return;
        let fileName = this.state.saveFileName + "." + this.state.saveFileFormat;
        let imagesToUpload = [];
        let fileType = 0;
        let onSuccess = () => {
            this.setState({
                saveFileName: (new Date()).getTime().toString()
            });
            _type === "local" ? this.props.handleOutPutMessage(fileName + " saved successfully!", "important") : this.props.handleOutPutMessage(fileName + " uploaded successfully!", "important");
        };
        let onFailure = (errorCode, errorString, httpResponse) => {
            httpResponse && (httpResponse !== "" ? this.props.handleOutPutMessage(httpResponse, "httpResponse") : this.props.handleException({ code: errorCode, message: errorString }));
        };
        if (this.state.bMulti) {
            if (this.props.selected.length === 1 || this.props.selected.length === this.props.buffer.count) {
                if (_type === "local") {
                    switch (this.state.saveFileFormat) {
                        default: break;
                        case "tif": this.DWObject.SaveAllAsMultiPageTIFF(fileName, onSuccess, onFailure); break;
                        case "pdf": this.DWObject.SaveAllAsPDF(fileName, onSuccess, onFailure); break;
                    }
                }
                else {
                    for (let i = 0; i < this.props.buffer.count; i++)
                        imagesToUpload.push(i);
                }
            } else {
                if (_type === "local") {
                    switch (this.state.saveFileFormat) {
                        default: break;
                        case "tif": this.DWObject.SaveSelectedImagesAsMultiPageTIFF(fileName, onSuccess, onFailure); break;
                        case "pdf": this.DWObject.SaveSelectedImagesAsMultiPagePDF(fileName, onSuccess, onFailure); break;
                    }
                }
                else {
                    imagesToUpload = this.props.selected;
                }
            }
        } else {
            if (_type === "local") {
                switch (this.state.saveFileFormat) {
                    default: break;
                    case "bmp": this.DWObject.SaveAsBMP(fileName, this.props.buffer.current, onSuccess, onFailure); break;
                    case "jpg": this.DWObject.SaveAsJPEG(fileName, this.props.buffer.current, onSuccess, onFailure); break;
                    case "tif": this.DWObject.SaveAsTIFF(fileName, this.props.buffer.current, onSuccess, onFailure); break;
                    case "png": this.DWObject.SaveAsPNG(fileName, this.props.buffer.current, onSuccess, onFailure); break;
                    case "pdf": this.DWObject.SaveAsPDF(fileName, this.props.buffer.current, onSuccess, onFailure); break;
                }
            }
            else {
                imagesToUpload.push(this.props.buffer.current);
            }
        }
        for (let o in window.EnumDWT_ImageType) {
            if (o.toLowerCase().indexOf(this.state.saveFileFormat) !== -1 && window.EnumDWT_ImageType[o] < 7) {
                fileType = window.EnumDWT_ImageType[o];
                break;
            }
        }
        if (_type === "server") {
            let protocol = Dynamsoft.Lib.detect.ssl ? "https://" : "http://"
            let _strPort = window.location.port === "" ? 80 : window.location.port;
            if (Dynamsoft.Lib.detect.ssl === true)
                _strPort = window.location.port === "" ? 443 : window.location.port;
            let strActionPage = "/upload";
            this.DWObject.HTTPUpload(protocol + window.location.hostname + ":" + _strPort + strActionPage, imagesToUpload, fileType, window.EnumDWT_UploadDataFormat.Binary, fileName, onSuccess, onFailure);
        }
    }
    // Tab 5: read Barcode & OCR
    initBarcodeReader(_features) {
        dynamsoft.BarcodeReader.initServiceConnection().then(() => {
            this.dbrObject = new dynamsoft.BarcodeReader();
            this.setState({ barcodeReady: true });
            if (_features < 0b1000000) // no OCR
                this.props.handleOutPutMessage("Initialization done in " + ((new Date()).getTime() - this.props.startTime).toString() + " milliseconds!", "important");
            else if (this.state.ocrReady)
                this.props.handleOutPutMessage("Initialization done in " + ((new Date()).getTime() - this.props.startTime).toString() + " milliseconds!", "important");
        }, (ex) => this.props.handleException({ code: -6, message: 'Initializing Barcode Reader failed: ' + (ex.message || ex) }));
    }
    readBarcode() {
        this.setState({ readingBarcode: true });
        this.props.handleNavigating(false);
        let settings = this.dbrObject.getRuntimeSettings();
        if (this.DWObject.GetImageBitDepth(this.props.buffer.current) === 1)
            settings.scaleDownThreshold = 214748347;
        else
            settings.scaleDownThreshold = 2300;
        settings.barcodeFormatIds = dynamsoft.BarcodeReader.EnumBarcodeFormat.All;
        settings.region.measuredByPercentage = 0;
        if (this.props.zones.length > 0) {
            let i = 0;
            let readBarcodeFromRect = () => {
                i++;
                settings.region.left = this.props.zones[i].x;
                settings.region.top = this.props.zones[i].y;
                settings.region.right = this.props.zones[i].x + this.props.zones[i].width;
                settings.region.bottom = this.props.zones[i].y + this.props.zones[i].height;
                if (i === this.props.zones.length - 1)
                    this.doReadBarode(settings);
                else
                    this.doReadBarode(settings, readBarcodeFromRect);
            }
            settings.region.left = this.props.zones[0].x;
            settings.region.top = this.props.zones[0].y;
            settings.region.right = this.props.zones[0].x + this.props.zones[0].width;
            settings.region.bottom = this.props.zones[0].y + this.props.zones[0].height;
            if (this.props.zones.length === 1)
                this.doReadBarode(settings);
            else
                this.doReadBarode(settings, readBarcodeFromRect);
        }
        else {
            settings.region.left = 0;
            settings.region.top = 0;
            settings.region.right = 0;
            settings.region.bottom = 0;
            this.doReadBarode(settings);
        }
    }
    doReadBarode(settings, callback) {
        let bHasCallback = Dynamsoft.Lib.isFunction(callback);
        this.dbrObject.updateRuntimeSettings(settings);
        // Make sure the same image is on display
        let userData = this.props.runtimeInfo.curImageTimeStamp;
        let outputResults = () => {
            if (this.dbrResults.length === 0) {
                this.props.handleOutPutMessage("--------------------------", "seperator");
                this.props.handleOutPutMessage("Nothing found on the image!", "important", false, false);
                this.doneReadingBarcode();
            } else {
                this.props.handleOutPutMessage("--------------------------", "seperator");
                this.props.handleOutPutMessage("Total barcode(s) found: " + this.dbrResults.length, "important");
                for (let i = 0; i < this.dbrResults.length; ++i) {
                    let result = this.dbrResults[i];
                    this.props.handleOutPutMessage("------------------", "seperator");
                    this.props.handleOutPutMessage("Barcode " + (i + 1).toString());
                    this.props.handleOutPutMessage("Type: " + result.BarcodeFormatString);
                    this.props.handleOutPutMessage("Value: " + result.BarcodeText, "important");
                }
                if (this.props.runtimeInfo.curImageTimeStamp === userData) {
                    this.props.handleBarcodeResults("clear");
                    this.props.handleBarcodeResults(this.dbrResults);
                }
                this.doneReadingBarcode();
            }
        };
        let onDbrReadSuccess = (results) => {
            this.dbrResults = this.dbrResults.concat(results);
            bHasCallback ? callback() : outputResults();
        };
        let onDbrReadFail = (_code, _msg) => {
            this.props.handleException({
                code: _code,
                message: _msg
            });
            bHasCallback ? callback() : outputResults();
        };
        let dwtUrl = this.DWObject.GetImagePartURL(this.props.buffer.current);
        this.dbrObject.decode(dwtUrl).then(onDbrReadSuccess, onDbrReadFail);
    }
    doneReadingBarcode() {
        this.props.handleNavigating(true);
        this.setState({ readingBarcode: false });
        this.dbrResults = [];
    }
    // OCR
    initOCR(_features) {
        this.downloadOCRBasic(true, _features);
    }
    downloadOCRBasic(bDownloadDLL, _features) {
        let strOCRPath = Dynamsoft.WebTwainEnv.ResourcesPath + "/OCRResources/OCR.zip",
            strOCRLangPath = Dynamsoft.WebTwainEnv.ResourcesPath + '/OCRResources/OCRBasicLanguages/English.zip';
        if (bDownloadDLL) {
            if (this.DWObject.Addon.OCR.IsModuleInstalled()) { /*console.log('OCR dll is installed');*/
                this.downloadOCRBasic(false);
            } else {
                this.DWObject.Addon.OCR.Download(
                    strOCRPath,
                    () => { /*console.log('OCR dll is installed');*/
                        this.downloadOCRBasic(false);
                    },
                    (errorCode, errorString) => this.props.handleException({ code: errorCode, message: errorString })
                );
            }
        } else {
            this.DWObject.Addon.OCR.DownloadLangData(
                strOCRLangPath,
                () => {
                    this.setState({ ocrReady: true });
                    if ((_features & 0b100000) && this.state.ocrReady) //barcode too
                        this.props.handleOutPutMessage("Initialization done in " + ((new Date()).getTime() - this.props.startTime).toString() + " milliseconds!", "important");
                    else
                        this.props.handleOutPutMessage("Initialization done in " + ((new Date()).getTime() - this.props.startTime).toString() + " milliseconds!", "important");
                },
                function (errorCode, errorString) {
                    this.props.handleException({ code: errorCode, message: errorString });
                });
        }
    }
    ocr() {
        this.DWObject.Addon.OCR.SetLanguage('eng');
        this.DWObject.Addon.OCR.SetOutputFormat(window.EnumDWT_OCROutputFormat.OCROF_TEXT);
        if (this.props.zones.length > 0) {
            this.ocrRect(this.props.zones);
        }
        else {
            this.DWObject.Addon.OCR.Recognize(
                this.props.buffer.current,
                (imageId, result) => {
                    if (result === null) {
                        this.props.handleOutPutMessage("Nothing found!", "important");
                        return;
                    }
                    this.props.handleOutPutMessage("", "", true);
                    this.props.handleOutPutMessage("OCR result:", "important");
                    this.props.handleOutPutMessage(Dynamsoft.Lib.base64.decode(result.Get()), "info", false, true);
                },
                (errorCode, errorString) => {
                    this.props.handleException({ code: errorCode, message: errorString });
                }
            );
        }
    }
    ocrRect(_zones) {
        let doRectOCR = (_zone, _zoneId) => {
            this.DWObject.Addon.OCR.RecognizeRect(
                this.props.buffer.current,
                _zone.x, _zone.y, _zone.x + _zone.width, _zone.y + _zone.height,
                (imageId, left, top, right, bottom, result) => {
                    if (result === null) {
                        this.props.handleOutPutMessage("Nothing found in the rect [" + left + ", " + top + ", " + right + ", " + bottom + "]", "important");
                        return;
                    }
                    if (_zoneId === 0)
                        this.props.handleOutPutMessage("", "", true);
                    this.props.handleOutPutMessage("OCR result in the rect [" + left + ", " + top + ", " + right + ", " + bottom + "]", "important");
                    this.props.handleOutPutMessage(Dynamsoft.Lib.base64.decode(result.Get()), "info", false, true);
                    (++_zoneId < _zones.length) && doRectOCR(_zones[_zoneId], _zoneId);
                },
                (errorCode, errorString) => {
                    this.props.handleException({ code: errorCode, message: errorString });
                    (++_zoneId < _zones.length) && doRectOCR(_zones[_zoneId], _zoneId);
                }
            );
        }
        doRectOCR(_zones[0], 0);
    }
    render() {
        return (
            <div className="DWTController">
                <div id="divScanner" className="divinput">
                    <ul className="PCollapse">
                        {this.props.features & 0b1 ? (
                            <li>
                                <div className="divType" selfvalue="scan">
                                    <div className="mark_arrow expanded"></div>
                                    Custom Scan</div>
                                <div className="divTableStyle">
                                    <ul>
                                        <li>
                                            <p>Select Source:</p>
                                            <select value={this.state.deviceSetup.currentScanner} className="fullWidth" onChange={(e) => this.onSourceChange(e.target.value)}>
                                                {
                                                    this.state.scanners.length > 0 ?
                                                        this.state.scanners.map((_name, _index) =>
                                                            <option value={_name} key={_index}>{_name}</option>
                                                        )
                                                        :
                                                        <option value="noscanner">Looking for devices..</option>
                                                }
                                            </select>
                                        </li>
                                        <li>
                                            <ul>
                                                <li>
                                                    {
                                                        this.state.deviceSetup.noUI ? "" : (
                                                            <label style={{ width: "32%", marginRight: "2%" }} ><input type="checkbox"
                                                                checked={this.state.deviceSetup.bShowUI}
                                                                onChange={(e) => this.handleScannerSetupChange(e, "bShowUI")}
                                                            />Show UI&nbsp;</label>
                                                        )
                                                    }
                                                    <label style={{ width: "32%", marginRight: "2%" }} ><input type="checkbox"
                                                        checked={this.state.deviceSetup.bADF}
                                                        onChange={(e) => this.handleScannerSetupChange(e, "bADF")}
                                                    />Page Feeder&nbsp;</label>
                                                    <label style={{ width: "32%" }}><input type="checkbox"
                                                        checked={this.state.deviceSetup.bDuplex}
                                                        onChange={(e) => this.handleScannerSetupChange(e, "bDuplex")}
                                                    />Duplex</label>
                                                </li>
                                                <li>
                                                    <select style={{ width: "48%", marginRight: "4%" }}
                                                        value={this.state.deviceSetup.nPixelType}
                                                        onChange={(e) => this.handleScannerSetupChange(e, "nPixelType")}>
                                                        <option value="0">B&amp;W</option>
                                                        <option value="1">Gray</option>
                                                        <option value="2">Color</option>
                                                    </select>
                                                    <select style={{ width: "48%" }}
                                                        value={this.state.deviceSetup.nResolution}
                                                        onChange={(e) => this.handleScannerSetupChange(e, "nResolution")}>
                                                        <option value="100">100 DPI</option>
                                                        <option value="200">200 DPI</option>
                                                        <option value="300">300 DPI</option>
                                                    </select>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="tc">
                                            <button className={this.state.scanners.length > 0 ? "majorButton enabled fullWidth" : "majorButton disabled fullWidth"} onClick={() => this.acquireImage()} disabled={this.state.scanners.length > 0 ? "" : "disabled"}>Scan</button>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        ) : ""}
                        {this.props.features & 0b10 ? (
                            <li>
                                <div className="divType" selfvalue="capture">
                                    <div className="mark_arrow collapsed"></div>
                                    Use Webcams</div>
                                <div style={{ display: "none" }} className="divTableStyle">
                                    <ul>
                                        <li>
                                            <p>Select a Camera:</p>
                                            <select value={this.state.currentCamera} className="fullWidth" onChange={(e) => this.onCameraChange(e.target.value)}>
                                                {
                                                    this.state.cameras.length > 0 ?
                                                        this.state.cameras.map((_name, _index) =>
                                                            <option value={_index} key={_index}>{_name}</option>
                                                        )
                                                        :
                                                        <option value="nocamera">Looking for devices..</option>
                                                }
                                            </select>
                                            <ul>{
                                                Object.values(this.state.cameraSettings).map((topItem, _key) =>
                                                    <li key={_key}>{topItem.name}</li>
                                                )
                                            }</ul>
                                        </li>
                                        <li className="tc">
                                            <button className="majorButton enabled width_48p" onClick={() => this.toggleShowVideo()}>{this.state.deviceSetup.isVideoOn ? "Hide Video" : "Show Video"}</button>
                                            <button className={this.state.deviceSetup.isVideoOn ? "majorButton enabled width_48p marginL_2p" : "majorButton disabled width_48p marginL_2p"} onClick={() => this.captureImage()} disabled={this.state.deviceSetup.isVideoOn ? "" : "disabled"} > Capture</button>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        ) : ""}
                        {this.props.features & 0b100 ? (
                            <li>
                                <div className="divType" selfvalue="load">
                                    <div className="mark_arrow collapsed"></div>
                                    Load Images or PDFs</div>
                                <div style={{ display: "none" }} className="divTableStyle">
                                    <ul>
                                        <li className="tc">
                                            <button className="majorButton enabled" onClick={() => this.loadImagesOfPDFs()} style={{ width: "100%" }}>Load</button>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        ) : ""}
                        {(this.props.features & 0b1000) && (this.props.features & 0b10000) ? (
                            <li>
                                <div className="divType" selfvalue="save">
                                    <div className="mark_arrow collapsed"></div>
                                    Save Documents</div>
                                <div style={{ display: "none" }} className="divTableStyle div_SaveImages">
                                    <ul>
                                        <li>
                                            <label className="fullWidth"><span style={{ width: "25%" }}>File Name:</span>
                                                <input style={{ width: "73%", marginLeft: "2%" }} type="text" size="20" value={this.state.saveFileName} onChange={(e) => this.handleFileNameChange(e)} /></label>
                                        </li>
                                        <li>
                                            <label><input type="radio" value="bmp" name="ImageType" onClick={(e) => this.handleSaveConfigChange(e)} />BMP</label>
                                            <label><input type="radio" value="jpg" name="ImageType" defaultChecked onClick={(e) => this.handleSaveConfigChange(e)} />JPEG</label>
                                            <label><input type="radio" value="tif" name="ImageType" onClick={(e) => this.handleSaveConfigChange(e)} />TIFF</label>
                                            <label><input type="radio" value="png" name="ImageType" onClick={(e) => this.handleSaveConfigChange(e)} />PNG</label>
                                            <label><input type="radio" value="pdf" name="ImageType" onClick={(e) => this.handleSaveConfigChange(e)} />PDF</label>
                                        </li>
                                        <li>
                                            <label><input type="checkbox" checked={this.state.saveFileFormat === "tif" && (this.state.bMulti ? "checked" : "")} value="multiTIF" disabled={this.state.saveFileFormat === "tif" ? "" : "disabled"} onChange={(e) => this.handleSaveConfigChange(e)} />Multi-Page TIFF</label>
                                            <label><input type="checkbox" checked={this.state.saveFileFormat === "pdf" && (this.state.bMulti ? "checked" : "")} value="multiPDF" disabled={this.state.saveFileFormat === "pdf" ? "" : "disabled"} onChange={(e) => this.handleSaveConfigChange(e)} />Multi-Page PDF</label>
                                        </li>
                                        <li>
                                            <button className={this.props.buffer.count === 0 ? "majorButton disabled width_48p" : "majorButton enabled width_48p"} disabled={this.props.buffer.count === 0 ? "disabled" : ""} onClick={() => this.saveOrUploadImage('local')} >Save to Local</button>
                                            <button className={this.props.buffer.count === 0 ? "majorButton disabled width_48p marginL_2p" : "majorButton enabled width_48p marginL_2p"} disabled={this.props.buffer.count === 0 ? "disabled" : ""} onClick={() => this.saveOrUploadImage('server')} >Upload to Server</button>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        ) : ""}
                        {(this.props.features & 0b10000) && (this.props.features & 0b100000) ? (
                            <li>
                                <div className="divType" selfvalue="recognize">
                                    <div className="mark_arrow collapsed"></div>
                                    Recognize</div>
                                <div className="divTableStyle" style={{ display: "none" }}>
                                    <ul>
                                        <li className="tc">
                                            <button className={this.props.buffer.count === 0 ? "majorButton disabled width_48p" : "majorButton enabled width_48p"} disabled={this.props.buffer.count === 0 || this.state.readingBarcode ? "disabled" : ""} onClick={() => this.readBarcode()} >{this.state.readingBarcode ? "Reading..." : "Read Barcode"}</button>
                                            <button className={this.props.buffer.count === 0 ? "majorButton disabled width_48p marginL_2p" : "majorButton enabled width_48p marginL_2p"} disabled={this.props.buffer.count === 0 || this.state.ocring ? "disabled" : ""} onClick={() => this.ocr()}>{this.state.ocring ? "Ocring..." : "OCR (English)"}</button>
                                        </li>
                                        {this.props.barcodeRects.length > 0 &&
                                            (<li><button className="majorButton enabled fullWidth" onClick={() => this.props.handleBarcodeResults("clear")}>Clear Barcode Rects</button></li>)
                                        }
                                    </ul>
                                </div>
                            </li>
                        ) : ""}
                    </ul>
                </div>
            </div>
        );
    }
}

class DWTOutPut extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.bNoScroll)
            this.refs.DWTOutPut_message.scrollTop = 0;
        else
            this.refs.DWTOutPut_message.scrollTop = this.refs.DWTOutPut_message.scrollHeight;
    }
    render() {
        return (
            <div className="DWTOutPut">Message: (Double Click to Clear!)<br />
                <div ref="DWTOutPut_message" className="message" onDoubleClick={() => this.props.handleClearOutPut()}>
                    <ul>
                        {
                            this.props.messages.map((oneMsg) =>
                                <li key={oneMsg.time + "_" + Math.floor(Math.random(1) * 1000)} className={oneMsg.type}>{oneMsg.text}</li>
                            )
                        }
                    </ul>
                </div>
            </div>
        );
    }
}

class DWTUserInterface extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startTime: this.props.startTime,
            messages: [{ time: (new Date()).getTime(), text: this.props.status, type: "info" }],
            bNoScroll: false,
            bNoNavigating: false,
            barcodeRects: []
        };
    }
    componentDidUpdate(prevProps) {
        if (prevProps.status !== this.props.status)
            this.setState({ messages: [{ time: (new Date()).getTime(), text: this.props.status, type: "info" }] });
        if (prevProps.buffer.current !== this.props.buffer.current)
            this.state.barcodeRects.length > 0 && this.handleBarcodeResults("clear");
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
                    let loc = result.LocalizationResult;
                    loc.left = Math.min(loc.X1, loc.X2, loc.X3, loc.X4);
                    loc.top = Math.min(loc.Y1, loc.Y2, loc.Y3, loc.Y4);
                    loc.right = Math.max(loc.X1, loc.X2, loc.X3, loc.X4);
                    loc.bottom = Math.max(loc.Y1, loc.Y2, loc.Y3, loc.Y4);
                    let leftBase = 1 + this.props.runtimeInfo.showAbleWidth / 2 - this.props.runtimeInfo.ImageWidth / 2 * zoom;
                    let topBase = 1 + this.props.runtimeInfo.showAbleHeight / 2 - this.props.runtimeInfo.ImageHeight / 2 * zoom;
                    let left = leftBase + loc.left * zoom;
                    let top = topBase + loc.top * zoom;
                    let width = (loc.right - loc.left) * zoom;
                    let height = (loc.bottom - loc.top) * zoom;
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
                this.setState({
                    messages: [{ time: (new Date()).getTime(), text: "Ready...", type: "info" }],
                    bNoScroll: false
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
    render() {
        return (
            <div id="DWTcontainer" className="container">
                <div style={{ textAlign: "left", position: "relative", float: "left", width: "980px" }} className="fullWidth clearfix">
                    <DWTView
                        dwt={this.props.dwt}
                        buffer={this.props.buffer}
                        zones={this.props.zones}
                        containerId={this.props.containerId}
                        runtimeInfo={this.props.runtimeInfo}
                        bNoNavigating={this.state.bNoNavigating}
                        barcodeRects={this.state.barcodeRects}

                        handleNavigation={(action) => this.props.handleNavigation(action)}
                        handleOutPutMessage={(message, type, bReset, bNoScroll) => this.handleOutPutMessage(message, type, bReset, bNoScroll)}
                    />
                    <DWTController
                        startTime={this.props.startTime}
                        features={this.props.features}
                        dwt={this.props.dwt}
                        buffer={this.props.buffer}
                        selected={this.props.selected}
                        zones={this.props.zones}
                        runtimeInfo={this.props.runtimeInfo}
                        barcodeRects={this.state.barcodeRects}

                        handleBarcodeResults={(results) => this.handleBarcodeResults(results)}
                        handleNavigating={(bAllow) => this.handleNavigating(bAllow)}
                        handleException={(ex) => this.handleException(ex)}
                        handleOutPutMessage={(message, type, bReset, bNoScroll) => this.handleOutPutMessage(message, type, bReset, bNoScroll)}
                    />
                </div>
                <div style={{ textAlign: "left", position: "relative", float: "left", width: "980px" }} className="fullWidth clearfix">
                    <DWTOutPut
                        handleClearOutPut={() => this.handleOutPutMessage("", "", true)}
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
            },
            exception: {}
        };
    }
    DWObject = null;
    containerId = 'dwtcontrolContainer';
    width = 583;
    height = 513;
    productKey = 't0140cQMAAGnOvWTyoOR4HEFckJJmzMWpZcPSHyXGAvYGxgEkg5fBnRoFPslaAayuNOe5B/gp7plUCIUAtf6Ttb98d7Ifv/3A6Mxsu7CZLJhKHUuMorfuu/E/ZrOfuSyoMz7zjXKjgvHcMO1HiGbvyHv+GBWM54ZpP4Wej2RorGBUMJ4b4tx40yqnXlIiqvs=';
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
        Dynamsoft.WebTwainEnv.ProductKey = this.productKey;
        dynamsoft.dbrEnv.productKey = this.productKey;
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
    handleNavigation(action) {
        switch (action) {
            default://viewModeChange, removeAll
                break;
            case "first":
                this.DWObject.CurrentImageIndexInBuffer = 0; break;
            case "last":
                this.DWObject.CurrentImageIndexInBuffer = this.state.buffer.count - 1; break;
            case "previous":
                this.DWObject.CurrentImageIndexInBuffer = (this.state.buffer.current > 0) && (this.state.buffer.current - 1); break;
            case "next":
                this.DWObject.CurrentImageIndexInBuffer = (this.state.buffer.current < this.state.buffer.count - 1) && (this.state.buffer.current + 1); break;
        }
        this.handleBufferChange();
    }
    render() {
        return (
            this.state.unSupportedEnv ? <div>Please use Chrome, Firefox or Edge on Windows!</div> :
                <DWTUserInterface
                    features={0b1111111}/** 0b1: scan, 0b10: camera, 0b100: load, 0b1000: save, 0b10000: upload, 0b100000:baroce, 0b1000000: ocr */
                    containerId={this.containerId}
                    startTime={this.state.startTime}
                    dwt={this.state.dwt}
                    status={this.state.status}
                    buffer={this.state.buffer}
                    selected={this.state.selected}
                    zones={this.state.zones}
                    runtimeInfo={this.state.runtimeInfo}
                    handleNavigation={(action) => this.handleNavigation(action)}
                />
        );
    }
}
