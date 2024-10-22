import React from 'react';
import './DWTController.css';
import ValuePicker from './ValuePicker';
import RangePicker from './RangePicker';
/**
 * @props
 * @prop {object} Dynamsoft a namespace
 * @prop {number} startTime the time when initializing started
 * @prop {number} features the features that are enabled
 * @prop {WebTwain} dwt the object to perform the magic of Dynamic Web TWAIN
 * @prop {object} buffer the buffer status of data in memory (current & count)
 * @prop {number[]} selected the indices of the selected images
 * @prop {object[]} zones the zones on the current image that are selected by the user
 * @prop {object} runtimeInfo contains runtime information like the width & height of the current image
 * @prop {object[]} barcodeRects a number of rects to indicate where barcodes are found
 * @prop {function} handleOutPutMessage a function to call a message needs to be printed out
 * @prop {function} handleBarcodeResults a function to handle barcode rects
 * @prop {function} handleNavigating a function to handle whether navigation is allowed
 * @prop {function} handleException a function to handle exceptions
 */
export default class DWTController extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.features & 7 === 0) {
            //no input tab
            this.initialShownTabs = this.props.features;
        } else {
            //120: hide all inputs 127&~7
            this.initialShownTabs = this.props.features & 1 || this.props.features & 2 || this.props.features & 4;
            if (this.props.features & 24) {
                this.initialShownTabs += 8;
            } else if (this.props.features & 96) {
                this.initialShownTabs += 16;
            }
        }
        this.state = {
            shownTabs: this.initialShownTabs,
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
            cameraSettings: [],
            bShowRangePicker: false,
            rangePicker: {
                bCamera: false,
                value: 0,
                min: 0,
                max: 0,
                defaultvalue: 0,
                step: 0,
                title: ""
            },
            saveFileName: (new Date()).getTime().toString(),
            saveFileFormat: "jpg",
            bUseFileUploader: false,
            bMulti: false,
            readingBarcode: false,
            bWin: this.props.Dynamsoft.navInfo.bWin
        };
    }
    initialShownTabs = 127;
    cameraReady = false;
    barcodeReady = false;
    fileUploaderReady = false;
    Dynamsoft = this.props.Dynamsoft;
    DWTObject = null;
    dbrObject = null;
    fileUploaderManager = null;
    dbrResults = [];
    handleTabs(event) {
        if (event.keyCode && event.keyCode !== 32) return;
        event.target.blur();
        let nControlIndex = parseInt(event.target.getAttribute("controlindex"));
        (nControlIndex & 5) && this.toggleCameraVideo(false);
        if (this.state.shownTabs & nControlIndex) { //close a Tab
            this.setState({ shownTabs: this.state.shownTabs - nControlIndex });
        } else { //Open a tab
            let _tabToShown = this.state.shownTabs;
            if (nControlIndex & 7) _tabToShown &= ~7;
            if (nControlIndex & 24) _tabToShown &= ~24;
            this.setState({ shownTabs: _tabToShown + nControlIndex });
        }
    }
    componentDidUpdate(prevProps) {
        if (this.props.dwt !== prevProps.dwt) {
            this.DWTObject = this.props.dwt;
            if (this.DWTObject) {
                if (this.props.features & 0b1) {
                    this.DWTObject.GetDevicesAsync().then((devices)=>{
                        let sourceNames = [];
                        for (var i = 0; i < devices.length; i++) { // Get how many sources are installed in the system
                            sourceNames.push(devices[i].displayName);
                        }

                        this.setState({ scanners: sourceNames});
                        if (sourceNames.length > 0)
                            this.onSourceChange(sourceNames[0]);

                    }).catch(function (exp) {
                        alert(exp.message);
                    });
                }
                if (this.props.features & 0b10) {
                    let cameraNames = this.DWTObject.Addon.Webcam.GetSourceList();
                    this.setState({ cameras: cameraNames });
                    if (cameraNames.length > 0)
                        this.onCameraChange(cameraNames[0]);
                }
                if (this.props.features & 0b100000) {
                    this.initBarcodeReader(this.props.features);
                }
                if (this.props.features & 0b1000000) {
                    this.Dynamsoft.FileUploader.Init("", (objFileUploader) => {
                        this.fileUploaderManager = objFileUploader;
                        if (!this.fileUploaderReady) {
                            this.fileUploaderReady = true;
                            this.props.handleStatusChange(64);
                        }
                    }, (errorCode, errorString) => {
                        this.handleException({ code: errorCode, message: errorString });
                        if (!this.fileUploaderReady) {
                            this.fileUploaderReady = true;
                            this.props.handleStatusChange(64);
                        }
                    });
                }
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
        if (this.Dynamsoft.Lib.env.bMac) {
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
        this.DWTObject.GetDevicesAsync().then((devices)=>{   
            for (var i = 0; i < devices.length; i++) { // Get how many sources are installed in the system
                if (devices[i].displayName === this.state.deviceSetup.currentScanner) {
                    return devices[i];
                }
            }
        }).then((device) =>{
            return this.DWTObject.SelectDeviceAsync(device);
        }).then(()=>{
            return this.DWTObject.AcquireImageAsync({
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
            });
        }).then(()=>{
            return this.DWTObject.CloseSourceAsync();
        }).then(()=>{
            this.props.handleOutPutMessage("Acquire success!", "important")
        }).catch((exp) => {
            this.props.handleOutPutMessage("Acquire failure!", "error")
            alert(exp.message);
        });
    }
    // Tab 2: Camera    
    onCameraChange(value) {
        let oldDeviceSetup = this.state.deviceSetup;
        oldDeviceSetup.currentCamera = value;
        this.setState({
            deviceSetup: oldDeviceSetup
        });
        if (value === "nocamera") {
            if (!this.cameraReady) {
                this.cameraReady = true;
                this.props.handleStatusChange(2);
            }
            return;
        }
        this.DWTObject.Addon.Webcam.StopVideo();
        if (this.DWTObject.Addon.Webcam.SelectSource(value)) {
            let mediaTypes = this.DWTObject.Addon.Webcam.GetMediaType(),
                _mediaTypes = [],
                _currentmT = mediaTypes.GetCurrent();
            let frameRates = this.DWTObject.Addon.Webcam.GetFrameRate(),
                _frameRates = [],
                _currentfR = frameRates.GetCurrent();
            let resolutions = this.DWTObject.Addon.Webcam.GetResolution(),
                _resolutions = [],
                _currentRes = resolutions.GetCurrent();
            let _advancedSettings = [],
                _advancedCameraSettings = [];
            mediaTypes = mediaTypes._resultlist;
            frameRates = frameRates._resultlist;
            resolutions = resolutions._resultlist;
            for (let i = 0; i < mediaTypes.length - 1; i++) {
                mediaTypes[i] === _currentmT
                    ? _mediaTypes[i] = { value: mediaTypes[i].toString(), checked: true }
                    : _mediaTypes[i] = { value: mediaTypes[i].toString(), checked: false };
            }
            for (let i = 0; i < frameRates.length - 1; i++) {
                frameRates[i] === _currentfR
                    ? _frameRates[i] = { value: frameRates[i].toString(), checked: true }
                    : _frameRates[i] = { value: frameRates[i].toString(), checked: false };
            }
            for (let i = 0; i < resolutions.length - 1; i++) {
                resolutions[i] === _currentRes
                    ? _resolutions[i] = { value: resolutions[i].toString(), checked: true }
                    : _resolutions[i] = { value: resolutions[i].toString(), checked: false };
            }
            _advancedSettings = Object.keys(this.Dynamsoft.DWT.EnumDWT_VideoProperty).map((_value) => { return { value: _value.substr(3) } });
            _advancedCameraSettings = Object.keys(this.Dynamsoft.DWT.EnumDWT_CameraControlProperty).map((_value) => { return { value: _value.substr(4) } });
            this.setState({
                cameraSettings: [{
                    name: "Media Type",
                    items: _mediaTypes
                }, {
                    name: "Frame Rate",
                    items: _frameRates
                }, {
                    name: "Resolution",
                    items: _resolutions
                }, {
                    name: "Video Setup",
                    items: _advancedSettings
                }, {
                    name: "Camera Setup",
                    items: _advancedCameraSettings
                }]
            });
            if (!this.cameraReady) {
                this.cameraReady = true;
                this.props.handleStatusChange(2);
            }
        } else {
            this.props.handleException({
                code: -2,
                message: "Can't use the Webcam " + value + ", please make sure it's not in use!"
            });
            if (!this.cameraReady) {
                this.cameraReady = true;
                this.props.handleStatusChange(2);
            }
        }
    }
    toggleShowVideo() {
        if (this.state.deviceSetup.isVideoOn === false) {
            this.toggleCameraVideo(true);
        } else {
            this.toggleCameraVideo(false);
        }
    }
    toggleCameraVideo(bShow) {
        if (this.DWTObject) {
            if (bShow) {
                this.playVideo();
                let oldDeviceSetup = this.state.deviceSetup;
                oldDeviceSetup.isVideoOn = true;
                this.setState({
                    deviceSetup: oldDeviceSetup
                });
            } else {
                this.DWTObject.Addon.Webcam.StopVideo();
                let oldDeviceSetup = this.state.deviceSetup;
                oldDeviceSetup.isVideoOn = false;
                this.setState({
                    deviceSetup: oldDeviceSetup
                });
            }
        }
    }
    playVideo(config) {
        let basicSetting, moreSetting;
        if (config) {
            if (config.prop === "Video Setup" || config.prop === "Camera Setup") {
                let bCamera = true;
                if (config.prop === "Video Setup") {
                    bCamera = false;
                    basicSetting = this.DWTObject.Addon.Webcam.GetVideoPropertySetting(this.Dynamsoft.DWT.EnumDWT_VideoProperty["VP_" + config.value]);
                    moreSetting = this.DWTObject.Addon.Webcam.GetVideoPropertyMoreSetting(this.Dynamsoft.DWT.EnumDWT_VideoProperty["VP_" + config.value]);
                } else {
                    basicSetting = this.DWTObject.Addon.Webcam.GetCameraControlPropertySetting(this.Dynamsoft.DWT.EnumDWT_CameraControlProperty["CCP_" + config.value]);
                    moreSetting = this.DWTObject.Addon.Webcam.GetCameraControlPropertyMoreSetting(this.Dynamsoft.DWT.EnumDWT_CameraControlProperty["CCP_" + config.value]);
                }
                let value = basicSetting.GetValue(),
                    min = moreSetting.GetMinValue(),
                    max = moreSetting.GetMaxValue(),
                    defaultvalue = moreSetting.GetDefaultValue();
                let bMutable = true;
                if (min === max && value === defaultvalue && min === value) {
                    bMutable = false;
                }
                this.setState({
                    bShowRangePicker: true,
                    rangePicker: {
                        bMutable: bMutable,
                        bCamera: bCamera,
                        value: value,
                        min: min,
                        max: max,
                        defaultvalue: defaultvalue,
                        step: moreSetting.GetSteppingDelta(),
                        title: config.value
                    }
                });
                return;
            } else {
                //this.DWTObject.Addon.Webcam.StopVideo();
                switch (config.prop) {
                    case "Frame Rate": this.DWTObject.Addon.Webcam.SetFrameRate(config.value); break;
                    case "Media Type": this.DWTObject.Addon.Webcam.SetMediaType(config.value); break;
                    case "Resolution": this.DWTObject.Addon.Webcam.SetResolution(config.value); break;
                    default: break;
                }
            }
        }
        /**
         * NOTE: The video playing is not smooth, there is a zoom-out effect (unwanted)
         */
        if ((config && this.state.deviceSetup.isVideoOn) || !config)
            this.DWTObject.Addon.Webcam.PlayVideo(this.DWTObject, 80, () => { });
    }
    captureImage() {
        if (this.DWTObject) {
            let funCaptureImage = () => setTimeout(() => { this.toggleCameraVideo(false); }, 50);
            this.DWTObject.Addon.Webcam.CaptureImage(funCaptureImage, funCaptureImage);
        }
    }
    // Tab 3: Load
    loadImagesOrPDFs() {
        this.DWTObject.IfShowFileDialog = true;
        this.DWTObject.Addon.PDF.SetReaderOptions({
            convertMode: this.Dynamsoft.DWT.EnumDWT_ConvertMode.CM_RENDERALL,
            renderOptions: {
                resolution: 200
            }
        });
        this.DWTObject.LoadImageEx("", 5 /*this.Dynamsoft.DWT.EnumDWT_ImageType.IT_ALL*/, () => {
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
            case "multiPage":
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
    toggleUseUploade(event) {
        this.setState({ bUseFileUploader: event.target.checked });
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
            (httpResponse && httpResponse !== "") ? this.props.handleOutPutMessage(httpResponse, "httpResponse") : this.props.handleException({ code: errorCode, message: errorString });
        };
        if (this.state.bMulti) {
            if (this.props.selected.length === 1 || this.props.selected.length === this.props.buffer.count) {
                if (_type === "local") {
                    switch (this.state.saveFileFormat) {
                        default: break;
                        case "tif": this.DWTObject.SaveAllAsMultiPageTIFF(fileName, onSuccess, onFailure); break;
                        case "pdf": this.DWTObject.SaveAllAsPDF(fileName, onSuccess, onFailure); break;
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
                        case "tif": this.DWTObject.SaveSelectedImagesAsMultiPageTIFF(fileName, onSuccess, onFailure); break;
                        case "pdf": this.DWTObject.SaveSelectedImagesAsMultiPagePDF(fileName, onSuccess, onFailure); break;
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
                    case "bmp": this.DWTObject.SaveAsBMP(fileName, this.props.buffer.current, onSuccess, onFailure); break;
                    case "jpg": this.DWTObject.SaveAsJPEG(fileName, this.props.buffer.current, onSuccess, onFailure); break;
                    case "tif": this.DWTObject.SaveAsTIFF(fileName, this.props.buffer.current, onSuccess, onFailure); break;
                    case "png": this.DWTObject.SaveAsPNG(fileName, this.props.buffer.current, onSuccess, onFailure); break;
                    case "pdf": this.DWTObject.SaveAsPDF(fileName, this.props.buffer.current, onSuccess, onFailure); break;
                }
            }
            else {
                imagesToUpload.push(this.props.buffer.current);
            }
        }
        for (let o in this.Dynamsoft.DWT.EnumDWT_ImageType) {
            if (o.toLowerCase().indexOf(this.state.saveFileFormat) !== -1 && this.Dynamsoft.DWT.EnumDWT_ImageType[o] < 7) {
                fileType = this.Dynamsoft.DWT.EnumDWT_ImageType[o];
                break;
            }
        }
        if (_type === "server") {
            let protocol = this.Dynamsoft.Lib.detect.ssl ? "https://" : "http://"
            let _strPort = 2020;//for testing
            /*window.location.port === "" ? 80 : window.location.port;
            if (this.Dynamsoft.Lib.detect.ssl === true)
                _strPort = window.location.port === "" ? 443 : window.location.port;*/

            let strActionPage = "/upload";
            let serverUrl = protocol + window.location.hostname + ":" + _strPort + strActionPage;
            if (this.state.bUseFileUploader) {
                var job = this.fileUploaderManager.CreateJob();
                job.ServerUrl = serverUrl;
                job.FileName = fileName;
                job.ImageType = fileType;
                this.DWTObject.GenerateURLForUploadData(imagesToUpload, fileType, (resultURL, newIndices, enumImageType) => {
                    job.SourceValue.Add(resultURL, fileName);
                    job.OnUploadTransferPercentage = (job, sPercentage) => {
                        this.props.handleOutPutMessage("Uploading...(" + sPercentage + "%)");
                    };
                    job.OnRunSuccess = (job) => { onSuccess() };
                    job.OnRunFailure = (job, errorCode, errorString) => onFailure(errorCode, errorString);
                    this.fileUploaderManager.Run(job);
                }, (errorCode, errorString, strHTTPPostResponseString, newIndices, enumImageType) => {
                    this.handleException({ code: errorCode, message: errorString });
                });
            } else
                this.DWTObject.HTTPUpload(serverUrl, imagesToUpload, fileType, this.Dynamsoft.DWT.EnumDWT_UploadDataFormat.Binary, fileName, onSuccess, onFailure);
        }
    }
    // Tab 5: read Barcode 
    initBarcodeReader(_features) {
        this.DWTObject.Addon.BarcodeReader.getRuntimeSettings()
            .then(settings => {
                if (!this.barcodeReady) {
                    this.barcodeReady = true;
                    this.props.handleStatusChange(32);
                }
            }, (ex) => this.props.handleException({ code: -6, message: 'Initializing Barcode Reader failed: ' + (ex.message || ex) }));
    }
    readBarcode() {
        this.Dynamsoft.Lib.showMask();
        this.setState({ readingBarcode: true });
        this.props.handleNavigating(false);
        this.DWTObject.Addon.BarcodeReader.getRuntimeSettings()
            .then(settings => {
                if (this.DWTObject.GetImageBitDepth(this.props.buffer.current) === 1)
                    settings.scaleDownThreshold = 214748347;
                else
                    settings.scaleDownThreshold = 2300;
                settings.barcodeFormatIds = this.Dynamsoft.DBR.EnumBarcodeFormat.BF_ALL;
                settings.barcodeFormatIds_2 = this.Dynamsoft.DBR.EnumBarcodeFormat_2.BF2_DOTCODE + this.Dynamsoft.DBR.EnumBarcodeFormat_2.BF2_POSTALCODE;
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
            });
    }
    doReadBarode(settings, callback) {
        let bHasCallback = this.Dynamsoft.Lib.isFunction(callback);
        this.DWTObject.Addon.BarcodeReader.updateRuntimeSettings(settings)
            .then(settings => {
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
                this.DWTObject.Addon.BarcodeReader.decode(this.props.buffer.current).then(onDbrReadSuccess, onDbrReadFail);
            });
    }
    doneReadingBarcode() {
        this.props.handleNavigating(true);
        this.setState({ readingBarcode: false });
        this.dbrResults = [];
        this.Dynamsoft.Lib.hideMask();
    }
    handleRangeChange(event) {
        let value = event.target.value ? event.target.value : event.target.getAttribute("value");
        if (value === "reset-range") {
            let prop = event.target.getAttribute("prop");
            let _type = event.target.getAttribute("_type");
            let _default = event.target.getAttribute("_default");
            this.setState(state => {
                state.rangePicker.value = _default;
                return state;
            });
            _type === "camera"
                ? this.DWTObject.Addon.Webcam.SetCameraControlPropertySetting(this.Dynamsoft.DWT.EnumDWT_CameraControlProperty["CCP_" + prop], _default, true)
                : this.DWTObject.Addon.Webcam.SetVideoPropertySetting(this.Dynamsoft.DWT.EnumDWT_VideoProperty["VP_" + prop], _default, true);
            this.setState({ bShowRangePicker: false });
        } else if (value === "close-picker") {
            this.setState({ bShowRangePicker: false });
        } else {
            let _type = event.target.getAttribute("_type");
            let prop = event.target.getAttribute("prop");
            this.setState(state => {
                state.rangePicker.value = value;
                return state;
            });
            _type === "camera"
                ? this.DWTObject.Addon.Webcam.SetCameraControlPropertySetting(this.Dynamsoft.DWT.EnumDWT_CameraControlProperty["CCP_" + prop], value, false)
                : this.DWTObject.Addon.Webcam.SetVideoPropertySetting(this.Dynamsoft.DWT.EnumDWT_VideoProperty["VP_" + prop], value, false);
        }
    }
    render() {
        return (
            <div className="DWTController">
                <div className="divinput">
                    <ul className="PCollapse">
                        {this.props.features & 0b1 ? (
                            <li>
                                <div className="divType" tabIndex="1" controlindex="1" onKeyUp={(event) => this.handleTabs(event)} onClick={(event) => this.handleTabs(event)}>
                                    <div className={this.state.shownTabs & 1 ? "mark_arrow expanded" : "mark_arrow collapsed"} ></div>
                                    Custom Scan</div>
                                <div className="divTableStyle" style={this.state.shownTabs & 1 ? { display: "block" } : { display: "none" }}>
                                    <ul>
                                        <li>
                                            <select tabIndex="1" value={this.state.deviceSetup.currentScanner} className="fullWidth" onChange={(e) => this.onSourceChange(e.target.value)}>
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
                                                            <label style={{ width: "32%", marginRight: "2%" }} ><input tabIndex="1" type="checkbox"
                                                                checked={this.state.deviceSetup.bShowUI}
                                                                onChange={(e) => this.handleScannerSetupChange(e, "bShowUI")}
                                                            />Show UI&nbsp;</label>
                                                        )
                                                    }
                                                    <label style={{ width: "32%", marginRight: "2%" }} ><input tabIndex="1" type="checkbox"
                                                        checked={this.state.deviceSetup.bADF}
                                                        onChange={(e) => this.handleScannerSetupChange(e, "bADF")}
                                                    />Page Feeder&nbsp;</label>
                                                    <label style={{ width: "32%" }}><input tabIndex="1" type="checkbox"
                                                        checked={this.state.deviceSetup.bDuplex}
                                                        onChange={(e) => this.handleScannerSetupChange(e, "bDuplex")}
                                                    />Duplex</label>
                                                </li>
                                                <li>
                                                    <select tabIndex="1" style={{ width: "48%", marginRight: "4%" }}
                                                        value={this.state.deviceSetup.nPixelType}
                                                        onChange={(e) => this.handleScannerSetupChange(e, "nPixelType")}>
                                                        <option value="0">B&amp;W</option>
                                                        <option value="1">Gray</option>
                                                        <option value="2">Color</option>
                                                    </select>
                                                    <select tabIndex="1" style={{ width: "48%" }}
                                                        value={this.state.deviceSetup.nResolution}
                                                        onChange={(e) => this.handleScannerSetupChange(e, "nResolution")}>
                                                        <option value="100">100 DPI</option>
                                                        <option value="200">200 DPI</option>
                                                        <option value="300">300 DPI</option>
                                                        <option value="600">600 DPI</option>
                                                    </select>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="tc">
                                            <button tabIndex="1" className={this.state.scanners.length > 0 ? "majorButton enabled fullWidth" : "majorButton disabled fullWidth"} onClick={() => this.acquireImage()} disabled={this.state.scanners.length > 0 ? "" : "disabled"}>Scan</button>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        ) : ""}
                        {this.state.bWin && (this.props.features & 0b10) ? (
                            <li>
                                <div className="divType" tabIndex="2" controlindex="2" onClick={(event) => this.handleTabs(event)} onKeyUp={(event) => this.handleTabs(event)}>
                                    <div className={this.state.shownTabs & 2 ? "mark_arrow expanded" : "mark_arrow collapsed"} ></div>
                                    Use Webcams</div>
                                <div className="divTableStyle" style={this.state.shownTabs & 2 ? { display: "block" } : { display: "none" }}>
                                    <ul>
                                        <li>
                                            <select tabIndex="2" value={this.state.deviceSetup.currentCamera} className="fullWidth" onChange={(e) => this.onCameraChange(e.target.value)}>
                                                {
                                                    this.state.cameras.length > 0 ?
                                                        this.state.cameras.map((_name, _index) =>
                                                            <option value={_index} key={_index}>{_name}</option>
                                                        )
                                                        :
                                                        <option value="nocamera">Looking for devices..</option>
                                                }
                                            </select>
                                            {this.state.cameraSettings.length > 0 ? (
                                                <ValuePicker
                                                    tabIndex="2"
                                                    targetObject={this.state.deviceSetup.currentCamera}
                                                    valuePacks={this.state.cameraSettings}
                                                    current={"Resolution"}
                                                    handleValuePicking={(valuePair) => this.playVideo(valuePair)}
                                                />
                                            ) : ""}
                                        </li>
                                        <li className="tc">
                                            <button tabIndex="2" className="majorButton enabled width_48p" onClick={() => this.toggleShowVideo()}>{this.state.deviceSetup.isVideoOn ? "Hide Video" : "Show Video"}</button>
                                            <button tabIndex="2" className={this.state.deviceSetup.isVideoOn ? "majorButton enabled width_48p marginL_2p" : "majorButton disabled width_48p marginL_2p"} onClick={() => this.captureImage()} disabled={this.state.deviceSetup.isVideoOn ? "" : "disabled"} > Capture</button>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        ) : ""}
                        {this.props.features & 0b100 ? (
                            <li>
                                <div className="divType" tabIndex="3" controlindex="4" onClick={(event) => this.handleTabs(event)} onKeyUp={(event) => this.handleTabs(event)}>
                                    <div className={this.state.shownTabs & 4 ? "mark_arrow expanded" : "mark_arrow collapsed"} ></div>
                                    Load Images or PDFs</div>
                                <div className="divTableStyle" style={this.state.shownTabs & 4 ? { display: "block" } : { display: "none" }}>
                                    <ul>
                                        <li className="tc">
                                            <button tabIndex="3" className="majorButton enabled" onClick={() => this.loadImagesOrPDFs()} style={{ width: "100%" }}>Load</button>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        ) : ""}
                        {(this.props.features & 0b1000) || (this.props.features & 0b10000) ? (
                            <li>
                                <div className="divType" tabIndex="4" controlindex="8" onClick={(event) => this.handleTabs(event)} onKeyUp={(event) => this.handleTabs(event)}>
                                    <div className={this.state.shownTabs & 8 ? "mark_arrow expanded" : "mark_arrow collapsed"} ></div>
                                    Save Documents</div>
                                <div className="divTableStyle div_SaveImages" style={this.state.shownTabs & 8 ? { display: "block" } : { display: "none" }}>
                                    <ul>
                                        <li>
                                            <label className="fullWidth"><span style={{ width: "25%" }}>File Name:</span>
                                                <input tabIndex="4" style={{ width: "73%", marginLeft: "2%" }} type="text" size="20" value={this.state.saveFileName} onChange={(e) => this.handleFileNameChange(e)} /></label>
                                        </li>
                                        <li>
                                            <label><input tabIndex="4" type="radio" value="bmp" name="ImageType" onClick={(e) => this.handleSaveConfigChange(e)} />BMP</label>
                                            <label><input tabIndex="4" type="radio" value="jpg" name="ImageType" defaultChecked onClick={(e) => this.handleSaveConfigChange(e)} />JPEG</label>
                                            <label><input tabIndex="4" type="radio" value="tif" name="ImageType" onClick={(e) => this.handleSaveConfigChange(e)} />TIFF</label>
                                            <label><input tabIndex="4" type="radio" value="png" name="ImageType" onClick={(e) => this.handleSaveConfigChange(e)} />PNG</label>
                                            <label><input tabIndex="4" type="radio" value="pdf" name="ImageType" onClick={(e) => this.handleSaveConfigChange(e)} />PDF</label>
                                        </li>
                                        <li>
                                            <label><input tabIndex="4" type="checkbox"
                                                checked={(this.state.saveFileFormat === "pdf" || this.state.saveFileFormat === "tif") && (this.state.bMulti ? "checked" : "")}
                                                value="multiPage" disabled={(this.state.saveFileFormat === "pdf" || this.state.saveFileFormat === "tif") ? "" : "disabled"} onChange={(e) => this.handleSaveConfigChange(e)} />Upload Multiple Pages</label>
                                            {((this.props.features & 0b10000) && (this.props.features & 0b1000000))
                                                ? <label>
                                                    <input tabIndex="4" title="Use Uploader" type="checkbox" onChange={(e) => this.toggleUseUploade(e)} />Use File Uploader</label>
                                                : ""}
                                        </li>
                                        <li className="tc">
                                            {(this.state.bWin && (this.props.features & 0b1000)) ? <button tabIndex="4" className={this.props.buffer.count === 0 ? "majorButton disabled width_48p" : "majorButton enabled width_48p"} disabled={this.props.buffer.count === 0 ? "disabled" : ""} onClick={() => this.saveOrUploadImage('local')} >Save to Local</button> : ""}
                                            {(this.props.features & 0b10000) ? <button tabIndex="4" className={this.props.buffer.count === 0 ? "majorButton disabled width_48p marginL_2p" : "majorButton enabled width_4p marginL_2p"} disabled={this.props.buffer.count === 0 ? "disabled" : ""} onClick={() => this.saveOrUploadImage('server')} >Upload to Server</button> : ""}
                                        </li>
                                    </ul>
                                </div>
                            </li>
                        ) : ""}
                        {(this.props.features & 0b100000)? (
                            <li>
                                <div className="divType" tabIndex="5" controlindex="16" onClick={(event) => this.handleTabs(event)} onKeyUp={(event) => this.handleTabs(event)}>
                                    <div className={this.state.shownTabs & 16 ? "mark_arrow expanded" : "mark_arrow collapsed"} ></div>
                                    Recognize</div>
                                <div className="divTableStyle" style={this.state.shownTabs & 16 ? { display: "block" } : { display: "none" }}>
                                    <ul>
                                        <li className="tc">
                                            {(this.props.features & 0b100000) ? <button tabIndex="5" className={this.props.buffer.count === 0 ? "majorButton disabled width_48p" : "majorButton enabled width_48p"} disabled={this.props.buffer.count === 0 || this.state.readingBarcode ? "disabled" : ""} onClick={() => this.readBarcode()} >{this.state.readingBarcode ? "Reading..." : "Read Barcode"}</button> : ""}
                                        </li>
                                        {this.props.barcodeRects.length > 0 &&
                                            (<li><button tabIndex="5" className="majorButton enabled fullWidth" onClick={() => this.props.handleBarcodeResults("clear")}>Clear Barcode Rects</button></li>)
                                        }
                                    </ul>
                                </div>
                            </li>
                        ) : ""}
                    </ul>
                </div>
                {this.state.bShowRangePicker ? (
                    <RangePicker tabIndex="2"
                        rangePicker={this.state.rangePicker}
                        handleRangeChange={(event) => this.handleRangeChange(event)}
                    />
                ) : ""
                }
            </div >
        );
    }
}