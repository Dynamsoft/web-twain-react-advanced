import React from 'react';
import './DynamsoftSDK.css';
import Dynamsoft from 'dwt';
import dynamsoft from 'dynamsoft-sdk';
import $ from 'jquery';

class DWTView extends React.Component {
    render() {
        return (
            <div id="DWTcontainerTop">
                <div id="divEdit">
                    <ul className="operateGrp">
                        <li><img src="Images/ShowEditor.png" title="Show Image Editor" alt="Show Editor" id="btnEditor" onClick={this.props.btnShowImageEditor} /> </li>
                        <li><img src="Images/RotateLeft.png" title="Rotate Left" alt="Rotate Left" id="btnRotateL" onClick={this.props.btnRotateLeft} /> </li>
                        <li><img src="Images/RotateRight.png" title="Rotate Right" alt="Rotate Right" id="btnRotateR" onClick={this.props.btnRotateRight} /> </li>
                        <li><img src="Images/Rotate180.png" alt="Rotate 180" title="Rotate 180" onClick={this.props.btnRotate180} /> </li>
                        <li><img src="Images/Mirror.png" title="Mirror" alt="Mirror" id="btnMirror" onClick={this.props.btnMirror} /> </li>
                        <li><img src="Images/Flip.png" title="Flip" alt="Flip" id="btnFlip" onClick={this.props.btnFlip} /> </li>
                        <li><img src="Images/RemoveSelectedImages.png" title="Remove Selected Images" alt="Remove Selected Images" id="DW_btnRemoveCurrentImage" onClick={this.props.btnRemoveCurrentImage} /></li>
                        <li><img src="Images/RemoveAllImages.png" title="Remove All Images" alt="Remove All" id="DW_btnRemoveAllImages" onClick={this.props.btnRemoveAllImages} /></li>
                        <li><img src="Images/ChangeSize.png" title="Change Image Size" alt="Change Size" id="btnChangeImageSize" onClick={this.props.btnChangeImageSize} /> </li>
                        <li><img src="Images/Crop.png" title="Crop" alt="Crop" id="btnCrop" /></li>
                    </ul>
                    <div id="ImgSizeEditor" style={{ visibility: "hidden" }}>
                        <ul>
                            <li>
                                <label htmlFor="img_height">New Height :
                                <input type="text" id="img_height" style={{ width: "50%" }} size="10" />
                                pixel</label>
                            </li>
                            <li>
                                <label htmlFor="img_width">New Width :&nbsp;
                                <input type="text" id="img_width" style={{ width: "50%" }} size="10" />
                                pixel</label>
                            </li>
                            <li>Interpolation method:
                            <select size="1" id="InterpolationMethod">

                                    <option value="1">NearestNeighbor</option><option value="2">Bilinear</option><option value="3">Bicubic</option></select>
                            </li>
                            <li style={{ textAlign: "center" }}>
                                <input type="button" value="   OK   " id="btnChangeImageSizeOK" onClick={this.props.btnChangeImageSizeOK} />
                                <input type="button" value=" Cancel " id="btnCancelChange" onClick={this.props.btnCancelChange} />
                            </li>
                        </ul>
                    </div>
                </div>
                <div id={this.props.containerId}></div>
                <div id="btnGroupBtm" className="clearfix">
                    <div className="ct-lt">Page:
                        <button name="control-changePage" id="DW_btnFirstImage" onClick={this.props.btnFirstImage}> |&lt; </button>
                        &nbsp;
                        <button name="control-changePage" id="DW_btnPreImage" onClick={this.props.btnPreImage}> &lt; </button>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <input name="control-changePage" type="text" size="2" id="DW_CurrentImage" readOnly="readonly" />
                        /
                        <input name="control-changePage" type="text" size="2" id="DW_TotalImage" readOnly="readonly" />
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <button name="control-changePage" id="DW_btnNextImage" onClick={this.props.btnNextImage}> &gt; </button>
                        &nbsp;
                        <button name="control-changePage" id="DW_btnLastImage" onClick={this.props.btnLastImage}> &gt;| </button>
                    </div>
                    <div className="ct-rt">Preview Mode:
                        <select name="control-changePage" size="1" id="DW_PreviewMode" onChange={this.props.setlPreviewMode}>
                            <option value="0">1X1</option>
                            <option value="1">2X2</option>
                            <option value="2">3X3</option>
                            <option value="3">4X4</option>
                            <option value="4">5X5</option>
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}

class DWTController extends React.Component {
    constructor(props) {
        super(props);
        this.handleScannerSetupChange = this.handleScannerSetupChange.bind(this);
        this.handleSourceChange = this.handleSourceChange.bind(this);
        this.handleCameraChange = this.handleCameraChange.bind(this);
    }
    handleScannerSetupChange(e, option) {
        switch (option.substr(0, 1)) {
            default: break;
            case "b":
                this.props.onScannerSetupChange(option, "b", e.target.checked);
                break;
            case "n":
                this.props.onScannerSetupChange(option, "n", e.target.value);
                break;
        }
    }
    handleSourceChange(e) {
        this.props.onSourceChange(e.target.value);
    }
    handleCameraChange(e) {
        this.props.onCameraChange(e.target.value);
    }
    render() {
        return (
            <div id="ScanWrapper">
                <div id="divScanner" className="divinput">
                    <ul className="PCollapse">
                        <li>
                            <div className="divType" selfvalue="scan">
                                <div className="mark_arrow expanded"></div>
                                    Custom Scan</div>
                            <div className="divTableStyle">
                                <ul>
                                    <li>
                                        <p>Select Source:</p>
                                        <select value={this.props.deviceSetup.currentScanner} className="fullWidth" onChange={this.handleSourceChange}>
                                            {
                                                this.props.scanners.length > 0 ?
                                                    this.props.scanners.map((_name, _index) =>
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
                                                    this.props.deviceSetup.noUI ? "" : (
                                                        <span style={{ width: "32%", marginRight: "2%" }} ><input type="checkbox"
                                                            checked={this.props.deviceSetup.bShowUI}
                                                            onChange={(e) => this.handleScannerSetupChange(e, "bShowUI")}
                                                        />Show UI&nbsp;</span>
                                                    )
                                                }
                                                <span style={{ width: "32%", marginRight: "2%" }} ><input type="checkbox"
                                                    checked={this.props.deviceSetup.bADF}
                                                    onChange={(e) => this.handleScannerSetupChange(e, "bADF")}
                                                />Page Feeder&nbsp;</span>
                                                <span style={{ width: "32%" }}><input type="checkbox"
                                                    checked={this.props.deviceSetup.bDuplex}
                                                    onChange={(e) => this.handleScannerSetupChange(e, "bDuplex")}
                                                />Duplex</span>
                                            </li>
                                            <li>
                                                <select style={{ width: "48%", marginRight: "4%" }}
                                                    value={this.props.deviceSetup.nPixelType}
                                                    onChange={(e) => this.handleScannerSetupChange(e, "nPixelType")}>
                                                    <option value="0">B&amp;W</option>
                                                    <option value="1">Gray</option>
                                                    <option value="2">Color</option>
                                                </select>
                                                <select style={{ width: "48%" }}
                                                    value={this.props.deviceSetup.nResolution}
                                                    onChange={(e) => this.handleScannerSetupChange(e, "nResolution")}>
                                                    <option value="100">100 DPI</option>
                                                    <option value="200">200 DPI</option>
                                                    <option value="300">300 DPI</option>
                                                </select>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="tc">
                                        <button className="majorButton fullWidth" onClick={this.props.acquireImage}>Scan</button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div className="divType" selfvalue="capture">
                                <div className="mark_arrow collapsed"></div>
                                    Use Webcams</div>
                            <div style={{ display: "none" }} className="divTableStyle">
                                <ul>
                                    <li>
                                        <p>Select a Camera:</p>
                                        <select value={this.props.currentCamera} className="fullWidth" onChange={this.handleCameraChange}>
                                            {
                                                this.props.cameras.length > 0 ?
                                                    this.props.cameras.map((_name, _index) =>
                                                        <option value={_index} key={_index}>{_name}</option>
                                                    )
                                                    :
                                                    <option value="nocamera">Looking for devices..</option>
                                            }
                                        </select>
                                        <ul>{
                                            Object.values(this.props.cameraSettings).map((topItem, _key) =>
                                                <li key={_key}>{topItem.name}</li>
                                            )
                                        }</ul>
                                    </li>
                                    <li className="tc">
                                        <button className="majorButton width_48p" onClick={this.props.switchViews} >{this.props.deviceSetup.isVideoOn ? "Hide Video" : "Show Video"}</button>
                                        <button className="majorButton width_48p marginL_2p" onClick={this.props.captureImage} style={this.props.deviceSetup.isVideoOn ? { backgroundColor: "rgb(80, 168, 225)" } : { backgroundColor: "#aaa" }} disabled={this.props.deviceSetup.isVideoOn ? "" : "disabled"} > Capture</button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li id="liLoadImage">
                            <div className="divType" selfvalue="load">
                                <div className="mark_arrow collapsed"></div>
                                    Load Images or PDFs</div>
                            <div id="div_LoadLocalImage" style={{ display: "none" }} className="divTableStyle">
                                <ul>
                                    <li className="tc">
                                        <button className="btnOrg" onClick={this.props.btnLoadImagesOrPDFs} style={{ width: "100%" }}>Load</button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div className="divType" selfvalue="save">
                                <div className="mark_arrow collapsed"></div>
                                    Save Documents</div>
                            <div id="div_SaveImages" style={{ display: "none" }} className="divTableStyle">
                                <ul>
                                    <li>
                                        <label htmlFor="txt_fileName" style={{ width: "100%" }}>
                                            <span style={{ width: "25%" }}>File Name:</span>
                                            <input style={{ width: "70%", marginLeft: "2%" }} type="text" size="20" id="txt_fileName" />
                                        </label>
                                    </li>
                                    <li style={{ paddingRight: "0" }}>
                                        <label htmlFor="imgTypebmp">
                                            <input type="radio" value="bmp" name="ImageType" id="imgTypebmp" onClick={this.props.rd} />
                                    BMP</label>
                                        <label htmlFor="imgTypejpeg">
                                            <input type="radio" value="jpg" name="ImageType" id="imgTypejpeg" onClick={this.props.rd} />
                                    JPEG</label>
                                        <label htmlFor="imgTypetiff">
                                            <input type="radio" value="tif" name="ImageType" id="imgTypetiff" onClick={this.props.rdTIFF} />
                                    TIFF</label>
                                        <label htmlFor="imgTypepng">
                                            <input type="radio" value="png" name="ImageType" id="imgTypepng" onClick={this.props.rd} />
                                    PNG</label>
                                        <label htmlFor="imgTypepdf">
                                            <input type="radio" value="pdf" name="ImageType" id="imgTypepdf" onClick={this.props.rdPDF} />
                                    PDF</label>
                                    </li>
                                    <li>
                                        <label htmlFor="MultiPageTIFF">
                                            <input type="checkbox" id="MultiPageTIFF" disabled="" />
                                    Multi-Page TIFF</label>
                                        <label htmlFor="MultiPagePDF">
                                            <input type="checkbox" id="MultiPagePDF" disabled="" />
                                    Multi-Page PDF</label>
                                    </li>
                                    <li>
                                        <button id="btnSave" className="btnOrg" style={{ width: "47%" }} onClick={() => { this.props.saveUploadImage('local') }} >Save to Local</button>
                                        <button id="btnUpload" className="btnOrg" style={{ width: "47%" }} onClick={() => { this.props.saveUploadImage('server') }} >Upload to Server</button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div className="divType" selfvalue="recognize">
                                <div className="mark_arrow collapsed"></div>
                                    Recognize</div>
                            <div id="div_Recognize" style={{ display: "none" }} className="divTableStyle">
                                <ul>
                                    <li className="tc">
                                        <button className="btnOrg" id="btn-readBarcode" style={{ width: "47%" }} >Read Barcode</button>
                                        <button className="btnOrg" id="btn-OCR" style={{ marginLeft: "2%", width: "47%" }}>OCR (English)</button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

class DWTOutPut extends React.Component {
    render() {
        return (
            <div id="DWTemessageContainer"></div>
        );
    }
}

class DynamsoftNotes extends React.Component {
    render() {
        return (
            <div id="divNoteMessage"> </div>
        );
    }
}

class DWTUserInterface extends React.Component {
    render() {
        return (
            <div id="DWTcontainer" className="container">
                <div id="DWTcontainerBody" style={{ textAlign: "left" }} className="clearfix">
                    <DWTView
                        containerId={this.props.containerId}
                        btnShowImageEditor={() => this.btnShowImageEditor()}
                        btnRotateLeft={() => this.props.btnRotateLeft()}
                        btnRotateRight={() => this.props.btnRotateRight()}
                        btnRotate180={() => this.props.btnRotate180()}
                        btnMirror={() => this.props.btnMirror()}
                        btnFlip={() => this.props.btnFlip()}
                        //btnCrop={() => this.props.btnCrop()}
                        btnRemoveCurrentImage={() => this.props.btnRemoveCurrentImage()}
                        btnRemoveAllImages={() => this.props.btnRemoveAllImages()}
                        btnChangeImageSize={() => this.props.btnChangeImageSize()}
                        btnChangeImageSizeOK={() => this.props.btnChangeImageSizeOK()}
                        btnCancelChange={() => this.props.btnCancelChange()}

                        btnFirstImage={() => this.props.btnFirstImage()}
                        //btnPreImage_wheel={() => this.props.btnPreImage_wheel()}
                        //btnNextImage_wheel={() => this.props.btnNextImage_wheel()}
                        btnPreImage={() => this.props.btnPreImage()}
                        btnNextImage={() => this.props.btnNextImage()}
                        btnLastImage={() => this.props.btnLastImage()}
                        setlPreviewMode={() => this.props.setlPreviewMode()}
                    />
                    <DWTController
                        scanners={this.props.scanners}
                        cameras={this.props.cameras}
                        deviceSetup={this.props.deviceSetup}
                        cameraSettings={this.props.cameraSettings}

                        acquireImage={() => this.props.acquireImage()}
                        onScannerSetupChange={(option, type, value) => this.props.onScannerSetupChange(option, type, value)}
                        onSourceChange={(value) => this.props.onSourceChange(value)}
                        onCameraChange={(value) => this.props.onCameraChange(value)}

                        switchViews={() => this.props.switchViews()}
                        captureImage={() => this.props.captureImage()}
                        btnLoadImagesOrPDFs={() => this.props.btnLoadImagesOrPDFs()}
                        btnShowImageEditor={() => this.props.btnShowImageEditor()}
                        rdTIFF={() => this.props.rdTIFF()}
                        rdPDF={() => this.props.rdPDF()}
                        rd={() => this.props.rd()}
                    />
                </div>
                <div id="DWTcontainerBtm" style={{ textAlign: "left" }} className="clearfix">
                    <DWTOutPut />
                    <DynamsoftNotes />
                </div>
            </div>
        );
    }
}

export default class DWT extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dwt: null,
            zones: {
                count: 0,
                rects: [] //x,y,width,height
            },
            scanners: [],
            deviceSetup: {
                currentScanner: "Looking for devices..",
                currentCamera: "Looking for devices..",
                bShowUI: false,
                bADF: false,
                bDuplex: false,
                nPixelType: "0",
                nResolution: "100"
            },
            cameras: [],
            cameraSettings: {},
            exception: {}
        };
    }
    isHtml5 = !!(Dynamsoft.Lib.env.bWin && Dynamsoft.Lib.product.bChromeEdition);
    isVideoOn = false;
    isSelectedArea = false;
    DWObject = null;
    dbrObject = null;
    containerId = 'dwtcontrolContainer';
    productKey = 't0140cQMAAGnOvWTyoOR4HEFckJJmzMWpZcPSHyXGAvYGxgEkg5fBnRoFPslaAayuNOe5B/gp7plUCIUAtf6Ttb98d7Ifv/3A6Mxsu7CZLJhKHUuMorfuu/E/ZrOfuSyoMz7zjXKjgvHcMO1HiGbvyHv+GBWM54ZpP4Wej2RorGBUMJ4b4tx40yqnXlIiqvs=';
    _strTempStr = '';
    re = /^\d+$/;
    strre = /^[\s\w]+$/;
    refloat = /^\d+\.*\d*$/i;
    showAbleWidthOri = 0;
    showAbleHeightOri = 0;
    _iLeft = 0;
    _iTop = 0;
    _iRight = 0;
    _iBottom = 0;
    _DWObject = {};

    dwtChangePageBtns = null;
    componentDidMount() {
        if (Dynamsoft && (!Dynamsoft.Lib.env.bWin || !Dynamsoft.Lib.product.bChromeEdition)) {
            var ObjString = [];
            ObjString.push('<div style="padding:0 20px;">');
            ObjString.push(
                "Please note that your current browser can't run this sample, please use modern browsers like Chrome, Firefox, Edge or IE 11."
            );
            ObjString.push('</div>');
            Dynamsoft.WebTwainEnv.ShowDialog(400, 180, ObjString.join(''));
            if (document.getElementsByClassName("dynamsoft-dialog-close"))
                document.getElementsByClassName("dynamsoft-dialog-close")[0].style.display = "none";
            return;
        }
        Dynamsoft.WebTwainEnv.RegisterEvent('OnWebTwainReady', () => {
            this.showAbleWidthOri = $("#" + this.containerId).width() - 2;//2 for border
            this.showAbleHeightOri = $("#" + this.containerId).height() - 4;//4 for border
            this.dwtChangePageBtns = $("button[name='control-changePage']");
            this.setState({
                dwt: Dynamsoft.WebTwainEnv.GetWebTwain(this.containerId)
            })
            this.DWObject = this.state.dwt;
            if (this.DWObject) {
                this.DWObject.RegisterEvent("OnPostTransfer", () => {
                    this.updatePageInfo();
                });
                this.DWObject.RegisterEvent("OnPostLoad", () => {
                    this.updatePageInfo();
                });
                this.DWObject.RegisterEvent("OnPostAllTransfers", () => {
                    this.DWObject.CloseSource();
                    this.updatePageInfo();
                    this.checkErrorString();
                });
                this.DWObject.RegisterEvent('OnImageAreaSelected', (nImageIndex, left, top, right, bottom, sAreaIndex) => {
                    let oldReacts = this.state.zones.rects;
                    oldReacts.push({ x: left, y: top, width: right - left, height: bottom - top });
                    this.setState({
                        zones: {
                            count: sAreaIndex,
                            rects: oldReacts
                        }
                    });
                });
                this.DWObject.RegisterEvent('OnImageAreaDeSelected', (nImageIndex) => {
                    this.setState({
                        zones: {
                            count: 0,
                            rects: []
                        }
                    });
                });
                this.DWObject.RegisterEvent("OnTopImageInTheViewChanged", (index) => {
                    this.setState({
                        zones: {
                            count: 0,
                            rects: []
                        }
                    });
                    this.DWObject.CurrentImageIndexInBuffer = index;
                    this.updatePageInfo();
                });

                let vCount = this.DWObject.SourceCount;
                let sourceNames = [];
                for (let i = 0; i < vCount; i++)
                    sourceNames.push(this.DWObject.GetSourceNameItems(i));
                this.setState({ scanners: sourceNames });
                this.source_onchange("firstScanner");
                this.refershCameraList();
                this.camera_onchange("firstCamera");
                if (Dynamsoft.Lib.env.bWin)
                    this.DWObject.MouseShape = false;
                var btnScan = document.getElementById("btnScan");
                if (btnScan) {
                    if (vCount === 0)
                        document.getElementById("btnScan").disabled = true;
                    else {
                        document.getElementById("btnScan").disabled = false;
                        document.getElementById("btnScan").style.color = "#fff";
                        document.getElementById("btnScan").style.backgroundColor = "#50a8e1";
                        document.getElementById("btnScan").style.cursor = "pointer";
                    }
                }
                this.updatePageInfo();
                this.setDefaultValue();
                this.setlPreviewMode();
                $("#btn-OCR").hide();
                this.initDbr();
                this.initOCR();
            }
        });
        this.initiateInputs();
        this.HideLoadImageForLinux();
        this.InitMessageBody();
        this.InitDWTdivMsg(false);
        this.loadDWT();

        $("ul.PCollapse li>div").click(function (event) {
            let _this = $(event.target);
            switch (_this.attr("selfvalue")) {
                case "capture":
                    break;
                case "scan":
                case "load":
                case "save":
                    this.DWObject.Addon.Webcam.StopVideo(); break;
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

    loadDWT() {
        Dynamsoft.WebTwainEnv.ProductKey = this.productKey;
        Dynamsoft.WebTwainEnv.Containers = [{ ContainerId: this.containerId, Width: '583px', Height: '513px' }];
        Dynamsoft.WebTwainEnv.Load();
    }

    appendMessage(strMessage, bClearOld, bNoScroll) {
        if (bClearOld)
            this._strTempStr = "";
        this._strTempStr += strMessage;
        var _divMessageContainer = document.getElementById("DWTemessage");
        if (_divMessageContainer) {
            _divMessageContainer.innerHTML = this._strTempStr;
            if (bNoScroll)
                _divMessageContainer.scrollTop = 0;
            else
                _divMessageContainer.scrollTop = _divMessageContainer.scrollHeight;
        }
    }

    updatePageInfo() {
        if (document.getElementById("DW_TotalImage") && document.getElementById("DW_CurrentImage")) {
            if (document.getElementById("DW_CurrentImage").value === this.DWObject.CurrentImageIndexInBuffer + 1 &&
                document.getElementById("DW_TotalImage").value === this.DWObject.HowManyImagesInBuffer)
                // no page change
                return;
        }
        else
            return;
        document.getElementById("DW_TotalImage").value = this.DWObject.HowManyImagesInBuffer;
        document.getElementById("DW_CurrentImage").value = this.DWObject.CurrentImageIndexInBuffer + 1;
        this.isSelectedArea = false;
        this.updateBtnsState();
        this.clearBarcodeRect();
        if (this.checkIfImagesInBuffer(false)) {
            this._DWObject.curImageTimeStamp = (new Date()).getTime();
            this._DWObject.showAbleWidth = this.DWObject.HowManyImagesInBuffer > 1 ? this.showAbleWidthOri - 16 : this.showAbleWidthOri;
            this._DWObject.showAbleHeight = this.showAbleHeightOri;
            this._DWObject.ImageWidth = this.DWObject.GetImageWidth(this.DWObject.CurrentImageIndexInBuffer);
            this._DWObject.ImageHeight = this.DWObject.GetImageHeight(this.DWObject.CurrentImageIndexInBuffer);
        }
    }

    checkErrorString() {
        return this.checkErrorStringWithErrorCode(this.DWObject.ErrorCode, this.DWObject.ErrorString);
    }

    checkErrorStringWithErrorCode(errorCode, errorString, responseString) {
        if (errorCode === 0) {
            this.appendMessage("<span style='color:#cE5E04'><b>" + errorString + "</b></span><br />");

            return true;
        }
        if (errorCode === -2115) //Cancel file dialog
            return true;
        else {
            if (errorCode === -2003) {
                var ErrorMessageWin = window.open("", "ErrorMessage", "height=500,width=750,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no");
                ErrorMessageWin.document.writeln(responseString); //DWObject.HTTPPostResponseString);
            }
            this.appendMessage("<span style='color:#cE5E04'><b>" + errorString + "</b></span><br />");
            return false;
        }
    }

    acquireImage() {
        this.DWObject.CloseSource();
        this.DWObject.OpenSource();
        this.DWObject.AcquireImage({
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
        }, () => {
            console.log("Acquire success!");
        }, () => {
            console.log("Acquire failure!");
        });
    }

    btnLoadImagesOrPDFs() {
        var OnPDFSuccess = () => {
            this.appendMessage("Loaded an image successfully.<br/>");
            this.updatePageInfo();
        };

        var OnPDFFailure = (errorCode, errorString) => {
            this.checkErrorStringWithErrorCode(errorCode, errorString);
        };

        this.DWObject.IfShowFileDialog = true;
        this.DWObject.Addon.PDF.SetResolution(200);
        this.DWObject.Addon.PDF.SetConvertMode(1/*EnumDWT_ConvertMode.CM_RENDERALL*/);
        this.DWObject.LoadImageEx("", 5 /*EnumDWT_ImageType.IT_ALL*/, OnPDFSuccess, OnPDFFailure);
    }

    checkIfImagesInBuffer(bAppendMSG) {
        if (this.DWObject.HowManyImagesInBuffer === 0) {
            if (bAppendMSG)
                this.appendMessage("There is no image in buffer.<br />")
            return false;
        }
        else
            return true;
    }

    btnShowImageEditor() {
        if (!this.checkIfImagesInBuffer(true)) {
            return;
        }
        this.DWObject.ShowImageEditor();
    }

    btnRotateRight() {
        if (!this.checkIfImagesInBuffer(true)) {
            return;
        }
        this.DWObject.RotateRight(this.DWObject.CurrentImageIndexInBuffer);
        this.appendMessage('<b>Rotate right: </b>');
        if (this.checkErrorString()) {
            return;
        }
    }

    btnRotateLeft() {
        if (!this.checkIfImagesInBuffer(true)) {
            return;
        }
        this.DWObject.RotateLeft(this.DWObject.CurrentImageIndexInBuffer);
        this.appendMessage('<b>Rotate left: </b>');
        if (this.checkErrorString()) {
            return;
        }
    }

    btnRotate180() {
        if (!this.checkIfImagesInBuffer(true)) {
            return;
        }
        this.DWObject.Rotate(this.DWObject.CurrentImageIndexInBuffer, 180, true);
        this.appendMessage('<b>Rotate 180: </b>');
        if (this.checkErrorString()) {
            return;
        }
    }

    btnMirror() {
        if (!this.checkIfImagesInBuffer(true)) {
            return;
        }
        this.DWObject.Mirror(this.DWObject.CurrentImageIndexInBuffer);
        this.appendMessage('<b>Mirror: </b>');
        if (this.checkErrorString()) {
            return;
        }
    }

    btnFlip() {
        if (!this.checkIfImagesInBuffer(true)) {
            return;
        }
        this.DWObject.Flip(this.DWObject.CurrentImageIndexInBuffer);
        this.appendMessage('<b>Flip: </b>');
        if (this.checkErrorString()) {
            return;
        }
    }

    /*----------------------Crop Method---------------------*/
    btnCrop() {
        if (!this.checkIfImagesInBuffer(true)) {
            return;
        }
        if (this._iLeft !== 0 || this._iTop !== 0 || this._iRight !== 0 || this._iBottom !== 0) {
            this.DWObject.Crop(
                this.DWObject.CurrentImageIndexInBuffer,
                this._iLeft, this._iTop, this._iRight, this._iBottom
            );
            this._iLeft = 0;
            this._iTop = 0;
            this._iRight = 0;
            this._iBottom = 0;
            this.appendMessage('<b>Crop: </b>');
            if (this.checkErrorString()) {
                return;
            }
            return;
        } else {
            this.appendMessage("<b>Crop: </b>failed. Please first select the area you'd like to crop.<br />");
        }
    }

    /*----------------Change Image Size--------------------*/
    btnChangeImageSize() {
        if (!this.checkIfImagesInBuffer(true)) {
            return;
        }
        switch (document.getElementById("ImgSizeEditor").style.visibility) {
            case "visible": document.getElementById("ImgSizeEditor").style.visibility = "hidden"; break;
            case "hidden": document.getElementById("ImgSizeEditor").style.visibility = "visible"; break;
            default: break;
        }
        //document.getElementById("ImgSizeEditor").style.top = ds_gettop(document.getElementById("btnChangeImageSize")) + document.getElementById("btnChangeImageSize").offsetHeight + 15 + "px";
        //document.getElementById("ImgSizeEditor").style.left = ds_getleft(document.getElementById("btnChangeImageSize")) - 14 + "px";

        var iWidth = this.DWObject.GetImageWidth(this.DWObject.CurrentImageIndexInBuffer);
        if (iWidth !== -1)
            document.getElementById("img_width").value = iWidth;
        var iHeight = this.DWObject.GetImageHeight(this.DWObject.CurrentImageIndexInBuffer);
        if (iHeight !== -1)
            document.getElementById("img_height").value = iHeight;
    }

    btnCancelChange() {
        document.getElementById("ImgSizeEditor").style.visibility = "hidden";
    }

    btnChangeImageSizeOK() {
        document.getElementById("img_height").className = "";
        document.getElementById("img_width").className = "";
        if (!this.re.test(document.getElementById("img_height").value)) {
            document.getElementById("img_height").className += " invalid";
            document.getElementById("img_height").focus();
            this.appendMessage("Please input a valid <b>height</b>.<br />");
            return;
        }
        if (!this.re.test(document.getElementById("img_width").value)) {
            document.getElementById("img_width").className += " invalid";
            document.getElementById("img_width").focus();
            this.appendMessage("Please input a valid <b>width</b>.<br />");
            return;
        }
        this.DWObject.ChangeImageSize(
            this.DWObject.CurrentImageIndexInBuffer,
            document.getElementById("img_width").value,
            document.getElementById("img_height").value,
            document.getElementById("InterpolationMethod").selectedIndex + 1
        );
        this.appendMessage('<b>Change Image Size: </b>');
        if (this.checkErrorString()) {
            document.getElementById("ImgSizeEditor").style.visibility = "hidden";
            return;
        }
    }

    source_onchange(value) {
        if (value === "noscanner") {
            let oldDeviceSetup = this.state.deviceSetup;
            oldDeviceSetup.currentScanner = "noscanner";
            this.setState({
                deviceSetup: oldDeviceSetup
            });
            return;
        }
        if (value === "firstScanner")
            this.DWObject.SelectSourceByIndex(0);
        else
            for (let i = 0; i < this.DWObject.SourceCount; i++) {
                if (this.DWObject.GetSourceNameItems(i) === value) {
                    this.DWObject.SelectSourceByIndex(i);
                    break;
                }
            }
        let strSourceName = this.DWObject.CurrentSourceName;
        let oldDeviceSetup = this.state.deviceSetup;
        oldDeviceSetup.currentScanner = strSourceName;
        this.setState({
            deviceSetup: oldDeviceSetup
        });
        if (Dynamsoft.Lib.env.bMac) {
            if (strSourceName.indexOf("ICA") === 0) {
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

    /**
     * Supporting functions
     */
    HideLoadImageForLinux() {
        var o = document.getElementById("liLoadImage");
        if (o) {
            if (Dynamsoft.Lib.env.bLinux)
                o.style.display = "none";
            else
                o.style.display = "";
        }
    }

    InitMessageBody() {
        var MessageBody = document.getElementById("divNoteMessage");
        if (MessageBody) {
            var ObjString = "<div><p><strong>Platform & Browser Support:</strong> </p> Chrome|Firefox|Edge on Windows   ";
            ObjString += "<p><strong>OCR:</strong> </p> Only English with OCR Basic is demonstrated, check <u><a href='https://www.dynamsoft.com/Products/ocr-basic-languages.aspx'>here</a></u> for other supported languages and <u><a href='https://www.dynamsoft.com/Products/cpp-ocr-library.aspx'>here</a></u> for the differences betwen two available OCR engines. <br />"
            ObjString += ".</div>";

            MessageBody.style.display = "";
            MessageBody.innerHTML = ObjString;
        }
    }

    InitDWTdivMsg(bNeebBack) {
        var DWTemessageContainer = document.getElementById("DWTemessageContainer");
        if (DWTemessageContainer) {
            var objString = "";
            // The container for the error message
            if (bNeebBack) {
                objString += "<p className='backToDemoList'><a className='d-btn bgOrange' href =\"online_demo_list.aspx\">Back</a></p>";
            }
            objString += "<div id='DWTdivMsg' className='clearfix'>";
            objString += "Message:<br/>"
            objString += "<div id='DWTemessage'>";
            objString += "</div></div>";

            DWTemessageContainer.innerHTML = objString;

            var _divMessageContainer = document.getElementById("DWTemessage");
            _divMessageContainer.ondblclick = this.clearMessages;
        }
    }

    clearMessages() {
        document.getElementById("DWTemessage").innerHTML = "";
        this._strTempStr = "";
    }

    initiateInputs() {
        var allinputs = document.getElementsByTagName("input");
        for (let i = 0; i < allinputs.length; i++) {
            if (allinputs[i].type === "checkbox") {
                allinputs[i].checked = false;
            }
            else if (allinputs[i].type === "text") {
                allinputs[i].value = "";
            }
        }
        if (Dynamsoft.Lib.env.bIE === true && Dynamsoft.Lib.env.bWin64 === true) {
            var o = document.getElementById("samplesource64bit");
            if (o)
                o.style.display = "inline";

            o = document.getElementById("samplesource32bit");
            if (o)
                o.style.display = "none";
        }
    }

    setDefaultValue() {
        var vGray = document.getElementById("Gray");
        if (vGray)
            vGray.checked = true;

        var varImgTypepng2 = document.getElementById("imgTypepng2");
        if (varImgTypepng2)
            varImgTypepng2.checked = true;
        var varImgTypepng = document.getElementById("imgTypepng");
        if (varImgTypepng)
            varImgTypepng.checked = true;

        var _strDefaultSaveImageName = "WebTWAINImage";
        var _txtFileNameforSave = document.getElementById("txt_fileNameforSave");
        if (_txtFileNameforSave)
            _txtFileNameforSave.value = _strDefaultSaveImageName;

        var _txtFileName = document.getElementById("txt_fileName");
        if (_txtFileName)
            _txtFileName.value = _strDefaultSaveImageName;

        var _chkMultiPageTIFF_save = document.getElementById("MultiPageTIFF_save");
        if (_chkMultiPageTIFF_save)
            _chkMultiPageTIFF_save.disabled = true;
        var _chkMultiPagePDF_save = document.getElementById("MultiPagePDF_save");
        if (_chkMultiPagePDF_save)
            _chkMultiPagePDF_save.disabled = true;
        var _chkMultiPageTIFF = document.getElementById("MultiPageTIFF");
        if (_chkMultiPageTIFF)
            _chkMultiPageTIFF.disabled = true;
        var _chkMultiPagePDF = document.getElementById("MultiPagePDF");
        if (_chkMultiPagePDF)
            _chkMultiPagePDF.disabled = true;
    }

    //--------------------------------------------------------------------------------------
    //************************** Save Image***********************************
    //--------------------------------------------------------------------------------------
    saveUploadImage(type) {
        if (type === 'local') {
            this.btnSave();
        } else if (type === 'server') {
            this.btnUpload()
        }
    }

    btnSave() {
        if (!this.checkIfImagesInBuffer(true)) {
            return;
        }
        let i, strimgType_save;
        var NM_imgType_save = document.getElementsByName("ImageType");
        for (i = 0; i < 5; i++) {
            if (NM_imgType_save.item(i).checked === true) {
                strimgType_save = NM_imgType_save.item(i).value;
                break;
            }
        }
        this.DWObject.IfShowFileDialog = true;
        var _txtFileNameforSave = document.getElementById("txt_fileName");
        if (_txtFileNameforSave)
            _txtFileNameforSave.className = "";
        var bSave = false;

        var strFilePath = _txtFileNameforSave.value + "." + strimgType_save;

        var OnSuccess = () => {
            this.appendMessage('<b>Save Image: </b>');
            this.checkErrorStringWithErrorCode(0, "Successful.");
        };

        var OnFailure = (errorCode, errorString) => {
            this.checkErrorStringWithErrorCode(errorCode, errorString);
        };

        var _chkMultiPageTIFF_save = document.getElementById("MultiPageTIFF");
        var vAsyn = false;
        if (strimgType_save === "tif" && _chkMultiPageTIFF_save && _chkMultiPageTIFF_save.checked) {
            vAsyn = true;
            if ((this.DWObject.SelectedImagesCount === 1) || (this.DWObject.SelectedImagesCount === this.DWObject.HowManyImagesInBuffer)) {
                bSave = this.DWObject.SaveAllAsMultiPageTIFF(strFilePath, OnSuccess, OnFailure);
            }
            else {
                bSave = this.DWObject.SaveSelectedImagesAsMultiPageTIFF(strFilePath, OnSuccess, OnFailure);
            }
        }
        else if (strimgType_save === "pdf" && document.getElementById("MultiPagePDF").checked) {
            vAsyn = true;
            if ((this.DWObject.SelectedImagesCount === 1) || (this.DWObject.SelectedImagesCount === this.DWObject.HowManyImagesInBuffer)) {
                bSave = this.DWObject.SaveAllAsPDF(strFilePath, OnSuccess, OnFailure);
            }
            else {
                bSave = this.DWObject.SaveSelectedImagesAsMultiPagePDF(strFilePath, OnSuccess, OnFailure);
            }
        }
        else {
            switch (i) {
                case 0: bSave = this.DWObject.SaveAsBMP(strFilePath, this.DWObject.CurrentImageIndexInBuffer); break;
                case 1: bSave = this.DWObject.SaveAsJPEG(strFilePath, this.DWObject.CurrentImageIndexInBuffer); break;
                case 2: bSave = this.DWObject.SaveAsTIFF(strFilePath, this.DWObject.CurrentImageIndexInBuffer); break;
                case 3: bSave = this.DWObject.SaveAsPNG(strFilePath, this.DWObject.CurrentImageIndexInBuffer); break;
                case 4: bSave = this.DWObject.SaveAsPDF(strFilePath, this.DWObject.CurrentImageIndexInBuffer); break;
                default: break;
            }
        }

        if (vAsyn === false) {
            if (bSave)
                this.appendMessage('<b>Save Image: </b>');
            if (this.checkErrorString()) {
                return;
            }
        }
    }

    //--------------------------------------------------------------------------------------
    //************************** Upload Image***********************************
    //--------------------------------------------------------------------------------------
    btnUpload() {
        if (!this.checkIfImagesInBuffer(true)) {
            return;
        }
        let i, strHTTPServer, strActionPage, strImageType;

        var _txtFileName = document.getElementById("txt_fileName");
        if (_txtFileName)
            _txtFileName.className = "";

        strHTTPServer = "localhost";//window.location.hostname;
        this.DWObject.IfSSL = false;//Dynamsoft.Lib.detect.ssl;
        /*
        var _strPort = window.location.port === "" ? 80 : window.location.port;
        if (Dynamsoft.Lib.detect.ssl === true)
            _strPort = window.location.port === "" ? 443 : window.location.port;
        */
        this.DWObject.HTTPPort = 2016;// _strPort;


        //var CurrentPathName = unescape(window.location.pathname); // get current PathName in plain ASCII	
        //var CurrentPath =  CurrentPathName.substring(0, CurrentPathName.lastIndexOf("/") + 1);
        strActionPage = "/upload";// CurrentPath + "SaveToDB.aspx";  /* Online Demo*/
        //strActionPage = CurrentPath + "SaveToFile.aspx"; /* Downloaded Sample */
        //var redirectURLifOK = CurrentPath + "online_demo_list.aspx";
        for (i = 0; i < 5; i++) {
            if (document.getElementsByName("ImageType").item(i).checked === true) {
                strImageType = i;
                break;
            }
        }

        var fileName = _txtFileName.value;
        var replaceStr = "<";
        fileName = fileName.replace(new RegExp(replaceStr, 'gm'), '&lt;');
        var uploadfilename = fileName + "." + document.getElementsByName("ImageType").item(i).value;

        var OnSuccess = (httpResponse) => {
            this.appendMessage('<b>Upload: </b>');
            this.checkErrorStringWithErrorCode(0, "Successful.");
            /*if (strActionPage.indexOf("SaveToFile") !== -1) {
                alert("Successful")//if save to file.
            } else {
                window.location.href = redirectURLifOK;
            }*/
        };

        var OnFailure = (errorCode, errorString, httpResponse) => {
            this.checkErrorStringWithErrorCode(errorCode, errorString, httpResponse);
        };

        if (strImageType === 2 && document.getElementById("MultiPageTIFF").checked) {
            if ((this.DWObject.SelectedImagesCount === 1) || (this.DWObject.SelectedImagesCount === this.DWObject.HowManyImagesInBuffer)) {
                this.DWObject.HTTPUploadAllThroughPostAsMultiPageTIFF(
                    strHTTPServer,
                    strActionPage,
                    uploadfilename,
                    OnSuccess, OnFailure
                );
            }
            else {
                this.DWObject.HTTPUploadThroughPostAsMultiPageTIFF(
                    strHTTPServer,
                    strActionPage,
                    uploadfilename,
                    OnSuccess, OnFailure
                );
            }
        }
        else if (strImageType === 4 && document.getElementById("MultiPagePDF").checked) {
            if ((this.DWObject.SelectedImagesCount === 1) || (this.DWObject.SelectedImagesCount === this.DWObject.HowManyImagesInBuffer)) {
                this.DWObject.HTTPUploadAllThroughPostAsPDF(
                    strHTTPServer,
                    strActionPage,
                    uploadfilename,
                    OnSuccess, OnFailure
                );
            }
            else {
                this.DWObject.HTTPUploadThroughPostAsMultiPagePDF(
                    strHTTPServer,
                    strActionPage,
                    uploadfilename,
                    OnSuccess, OnFailure
                );
            }
        }
        else {
            this.DWObject.HTTPUploadThroughPostEx(
                strHTTPServer,
                this.DWObject.CurrentImageIndexInBuffer,
                strActionPage,
                uploadfilename,
                strImageType,
                OnSuccess, OnFailure
            );
        }
    }

    //--------------------------------------------------------------------------------------
    //************************** Recognize ***********************************
    //--------------------------------------------------------------------------------------

    initDbr() {
        dynamsoft.dbrEnv.productKey = this.productKey;
        dynamsoft.BarcodeReader.initServiceConnection().then(() => {
            this.dbrObject = new dynamsoft.BarcodeReader();
            this.initReadBtn();
        }, (ex) => {
            alert('Init DBR failed' + (ex.message || ex));
        });
    }

    clearBarcodeRect() {
        if (this.isHtml5) {
            $(".barcodeInfoRect").remove();
        }
    }

    initReadBtn() {
        $("#btn-readBarcode").click(() => {
            var btn = $(this);
            btn.prop("disabled", true);
            this.dwtChangePageBtns.prop("disabled", true);
            this.clearBarcodeRect();
            if (!this.checkIfImagesInBuffer(true)) {
                alert("There is no image in the buffer.");
                btn.prop("disabled", false);
                return;
            }
            var settings = this.dbrObject.getRuntimeSettings();
            if (this.DWObject.GetImageBitDepth(this.DWObject.CurrentImageIndexInBuffer) === 1)
                settings.scaleDownThreshold = 214748347;
            else
                settings.scaleDownThreshold = 2300;
            settings.barcodeFormatIds = dynamsoft.BarcodeReader.EnumBarcodeFormat.All;
            settings.region.measuredByPercentage = 0;
            if (this.state.zones.count > 0) {
                if (this.state.zones.count === 1) {
                    settings.region.left = this.state.zones.rects[0].left;
                    settings.region.top = this.state.zones.rects[0].top;
                    settings.region.right = this.state.zones.rects[0].left + this.state.zones.rects[0].width;
                    settings.region.bottom = this.state.zones.rects[0].top + this.state.zones.rects[0].height;
                } else {
                    this.setState({
                        exception: {
                            code: -102,
                            message: "Can't read multiple zones"
                        }
                    });
                    return;
                }
            }
            else {
                settings.region.left = 0;
                settings.region.top = 0;
                settings.region.right = 0;
                settings.region.bottom = 0;
            }
            this.readBarode(settings);
        });
    }

    doneReadingBarcode() {
        $("#btn-readBarcode").prop("disabled", false);
        $("#btn-readBarcode").text('Read Barcode');
        //enable change-page btns
        this.updateBtnsState();
    }

    readBarode(settings) {
        if (this.dbrObject) {
            this.dbrObject.updateRuntimeSettings(settings);
            // Make sure the same image is on display
            var userData = this._DWObject.curImageTimeStamp;
            var onDbrReadSuccess = (results) => {
                this.logResult(results, true);
                if (results.length !== 0 && this._DWObject.curImageTimeStamp === userData) {
                    this.drawBarcodeRect(results);
                }
                this.doneReadingBarcode();
            };
            var onDbrReadFail = (_code, _msg) => {
                this.setState({
                    exception: {
                        code: _code,
                        message: _msg
                    }
                });
                this.doneReadingBarcode();
            };
            if (this.isHtml5) {
                var dwtUrl = this.DWObject.GetImagePartURL(this.DWObject.CurrentImageIndexInBuffer);
                this.dbrObject.decode(dwtUrl).then(onDbrReadSuccess, onDbrReadFail);
            } else {
                this.setState({
                    exception: {
                        code: -1,
                        message: "Unsupported environment"
                    }
                });
            }
        } else {
            this.setState({
                exception: {
                    code: -3,
                    message: "Barcode reader object unavailable"
                }
            });
        }
    }

    // OCR
    initOCR() {
        this.downloadOCRBasic(true);
    }

    downloadOCRBasic(bDownloadDLL) {
        var strOCRPath = Dynamsoft.WebTwainEnv.ResourcesPath + "/OCRResources/OCR.zip",
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
                    (errorCode, errorString) => {
                        console.log(errorString);
                    }
                );
            }
        } else {
            this.DWObject.Addon.OCR.DownloadLangData(
                strOCRLangPath,
                () => {
                    $("#btn-OCR").show();
                    $("#btn-OCR").click(() => {
                        this.DoOCR();
                    });
                },
                function (errorCode, errorString) {
                    console.log(errorString);
                });
        }
    }

    DoOCR() {
        if (this.DWObject) {
            if (!this.checkIfImagesInBuffer()) {
                alert("Please scan or load an image first.");
                return;
            }
            this.DWObject.Addon.OCR.SetLanguage('eng');
            this.DWObject.Addon.OCR.SetOutputFormat(window.EnumDWT_OCROutputFormat.OCROF_TEXT);
            if (this.isSelectedArea) {
                this.DWObject.Addon.OCR.RecognizeRect(
                    this.DWObject.CurrentImageIndexInBuffer,
                    this._iLeft, this._iTop, this._iRight, this._iBottom,
                    (index, left, top, right, bottom, result) => {
                        if (result === null)
                            return null;
                        var _textResult = (Dynamsoft.Lib.base64.decode(result.Get())).split(/\r?\n/g),
                            _resultToShow = [];
                        for (let i = 0; i < _textResult.length; i++) {
                            if (i === 0 && _textResult[i].trim() === "")
                                continue;
                            _resultToShow.push(_textResult[i] + '<br />');
                        }
                        _resultToShow.splice(0, 0, '<p style="padding:5px; margin:0;"><strong>OCR result:</strong><br />');
                        _resultToShow.push('</p>');
                        this.appendMessage(_resultToShow.join(''), true, true);
                    },
                    function (errorcode, errorstring, result) {
                        alert(errorstring);
                    }
                );
            }
            else {
                this.DWObject.Addon.OCR.Recognize(
                    this.DWObject.CurrentImageIndexInBuffer,
                    (index, result) => {
                        if (result === null)
                            return null;
                        var _textResult = (Dynamsoft.Lib.base64.decode(result.Get())).split(/\r?\n/g),
                            _resultToShow = [];
                        for (let i = 0; i < _textResult.length; i++) {
                            if (i === 0 && _textResult[i].trim() === "")
                                continue;
                            _resultToShow.push(_textResult[i] + '<br />');
                        }
                        _resultToShow.splice(0, 0, '<p style="padding:5px; margin:0;"><strong>OCR result:</strong><br />');
                        _resultToShow.push('</p>');
                        this.appendMessage(_resultToShow.join(''), true, true);
                    },
                    function (errorcode, errorstring, result) {
                        alert(errorstring);
                    }
                );
            }
        }
    }

    logResult(results, bBarcode) {
        var strMsg = [];
        if (bBarcode) {
            if (results.length === 0) {
                strMsg.push("No barcode found for the selected format(s).<br /><br />");
            } else {
                strMsg.push("<div style='width:100%; text-align:center;'><a href='#'  class='clearRects'> ~~~~~~~~~~~~ Clear ~~~~~~~~~~~~ </a></div>");
                strMsg.push("<b>Total barcode(s) found: ", results.length, "</b><br /><br /> ");

                for (let i = 0; i < results.length; ++i) {
                    var result = results[i];
                    var arr = ["<b>Barcode ", (i + 1), "</b><br />",
                        "<b>Type: <span style='color:#fe8e14'>", result.BarcodeFormatString, "</span></b><br />",
                        "<b>Value: <span style='color:#fe8e14'>", this.convertTextForHTML(result.BarcodeText), "</span></b>",
                        "<b>Data: ", dynamsoft.lib.stringify(result.BarcodeBytes), "</b><br />",
                        "<b>Angle: ", result.LocalizationResult.Angle, "</b><br />"
                    ];
                    strMsg = strMsg.concat(arr);
                }
                strMsg.push("<div style='width:100%; text-align:center;'><a href='#'  class='clearRects'> ~~~~~~~~~~~~ Clear ~~~~~~~~~~~~ </a></div>");
            }
        }
        this.appendMessage(strMsg.join(""), true);

        $(".clearRects").on('click', () => {
            this.clearBarcodeRect();
            this.clearMessages();
        });
    }

    convertTextForHTML(str) {
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');
        str = ['<pre class="resultPre">', str, '</pre>'].join('');
        if ((str.indexOf('\n') & str.indexOf('\r')) !== -1) {
            str = '<br />' + str;
        }
        return str;
    }

    drawBarcodeRect(results) {
        var zoom;
        var dwtDiv = $("#" + this.containerId);
        if (this._DWObject.showAbleWidth >= this._DWObject.ImageWidth && this._DWObject.showAbleHeight >= this._DWObject.ImageHeight) {
            zoom = 1;
        } else if (this._DWObject.showAbleWidth / this._DWObject.showAbleHeight >= this._DWObject.ImageWidth / this._DWObject.ImageHeight) {
            zoom = this._DWObject.showAbleHeight / this._DWObject.ImageHeight;
        } else {
            zoom = this._DWObject.showAbleWidth / this._DWObject.ImageWidth;
        }
        for (let i = 0; i < results.length; ++i) {
            var result = results[i];
            var loc = result.LocalizationResult;
            loc.left = Math.min(loc.X1, loc.X2, loc.X3, loc.X4);
            loc.top = Math.min(loc.Y1, loc.Y2, loc.Y3, loc.Y4);
            loc.right = Math.max(loc.X1, loc.X2, loc.X3, loc.X4);
            loc.bottom = Math.max(loc.Y1, loc.Y2, loc.Y3, loc.Y4);
            // HTML5 borwsers: show rectangles and numbers. We use div to manually draw the rectangles, you can use OverlayRectangle as well
            if (this.isHtml5) {
                var leftBase = 1 + this._DWObject.showAbleWidth / 2 - this._DWObject.ImageWidth / 2 * zoom;
                var topBase = 1 + this._DWObject.showAbleHeight / 2 - this._DWObject.ImageHeight / 2 * zoom;
                var left = dwtDiv[0].offsetLeft + leftBase + loc.left * zoom;
                var top = dwtDiv[0].offsetTop + topBase + loc.top * zoom;
                var width = (loc.right - loc.left) * zoom;
                var height = (loc.bottom - loc.top) * zoom;
                dwtDiv.append(['<div class="barcodeInfoRect" style="left:', left, 'px;top:', top, 'px;width:', width, 'px;height:', height, 'px;">',
                    '<div class="spanContainer">', '<span>[', i + 1, ']</span></div></div>'].join(''));
            } else {
                alert('The broowser is not supported!');
            }
        }
    }
    //--------------------------------------------------------------------------------------
    //************************** Navigator functions***********************************
    //--------------------------------------------------------------------------------------

    btnFirstImage() {
        if (!this.checkIfImagesInBuffer(true)) {
            return;
        }
        this.DWObject.CurrentImageIndexInBuffer = 0;
        this.updatePageInfo();
    }

    btnPreImage_wheel() {
        if (this.DWObject.HowManyImagesInBuffer !== 0)
            this.btnPreImage()
    }

    btnNextImage_wheel() {
        if (this.DWObject.HowManyImagesInBuffer !== 0)
            this.btnNextImage()
    }

    btnPreImage() {
        if (!this.checkIfImagesInBuffer(true)) {
            return;
        }
        else if (this.DWObject.CurrentImageIndexInBuffer === 0) {
            return;
        }
        this.DWObject.CurrentImageIndexInBuffer = this.DWObject.CurrentImageIndexInBuffer - 1;
        this.updatePageInfo();
    }

    btnNextImage() {
        if (!this.checkIfImagesInBuffer(true)) {
            return;
        }
        else if (this.DWObject.CurrentImageIndexInBuffer === this.DWObject.HowManyImagesInBuffer - 1) {
            return;
        }
        this.DWObject.CurrentImageIndexInBuffer = this.DWObject.CurrentImageIndexInBuffer + 1;
        this.updatePageInfo();
    }

    btnLastImage() {
        if (!this.checkIfImagesInBuffer(true)) {
            return;
        }
        this.DWObject.CurrentImageIndexInBuffer = this.DWObject.HowManyImagesInBuffer - 1;
        this.updatePageInfo();
    }

    btnRemoveCurrentImage() {
        if (!this.checkIfImagesInBuffer(true)) {
            return;
        }
        this.DWObject.RemoveAllSelectedImages();
        if (this.DWObject.HowManyImagesInBuffer === 0) {
            document.getElementById("DW_TotalImage").value = this.DWObject.HowManyImagesInBuffer;
            document.getElementById("DW_CurrentImage").value = "";
            return;
        }
        else {
            this.updatePageInfo();
        }
    }

    btnRemoveAllImages() {
        if (!this.checkIfImagesInBuffer(true)) {
            return;
        }
        this.DWObject.RemoveAllImages();
        document.getElementById("DW_TotalImage").value = "0";
        document.getElementById("DW_CurrentImage").value = "";
    }

    setlPreviewMode() {
        var varNum = parseInt(document.getElementById("DW_PreviewMode").selectedIndex + 1);
        var btnCrop = document.getElementById("btnCrop");
        if (btnCrop) {
            var tmpstr = btnCrop.src;
            if (varNum > 1) {
                tmpstr = tmpstr.replace('Crop.', 'Crop_gray.');
                btnCrop.src = tmpstr;
                btnCrop.onclick = function () { };
            }
            else {
                tmpstr = tmpstr.replace('Crop_gray.', 'Crop.');
                btnCrop.src = tmpstr;
                btnCrop.onclick = () => { this.btnCrop(); };
            }
        }

        this.DWObject.SetViewMode(varNum, varNum);
        if (Dynamsoft.Lib.env.bMac || Dynamsoft.Lib.env.bLinux) {
            return;
        }
        else if (document.getElementById("DW_PreviewMode").selectedIndex !== 0) {
            this.DWObject.MouseShape = true;
        }
        else {
            this.DWObject.MouseShape = false;
        }
    }

    //--------------------------------------------------------------------------------------
    //*********************************UI response***************************************
    //--------------------------------------------------------------------------------------
    rdTIFF() {
        var _chkMultiPageTIFF = document.getElementById("MultiPageTIFF");
        _chkMultiPageTIFF.disabled = false;
        _chkMultiPageTIFF.checked = false;

        var _chkMultiPagePDF = document.getElementById("MultiPagePDF");
        _chkMultiPagePDF.checked = false;
        _chkMultiPagePDF.disabled = true;
    }

    rdPDF() {
        var _chkMultiPageTIFF = document.getElementById("MultiPageTIFF");
        _chkMultiPageTIFF.checked = false;
        _chkMultiPageTIFF.disabled = true;

        var _chkMultiPagePDF = document.getElementById("MultiPagePDF");
        _chkMultiPagePDF.disabled = false;
        _chkMultiPagePDF.checked = true;

    }

    rd() {
        var _chkMultiPageTIFF = document.getElementById("MultiPageTIFF");
        _chkMultiPageTIFF.checked = false;
        _chkMultiPageTIFF.disabled = true;

        var _chkMultiPagePDF = document.getElementById("MultiPagePDF");
        _chkMultiPagePDF.checked = false;
        _chkMultiPagePDF.disabled = true;
    }

    updateBtnsState() {
        if (this.checkIfImagesInBuffer(false)) {
            this.dwtChangePageBtns.prop("disabled", false);
            if (this.DWObject.CurrentImageIndexInBuffer === 0) {
                $("#DW_btnFirstImage").prop("disabled", true);
                $("#DW_btnPreImage").prop("disabled", true);
            }
            if (this.DWObject.CurrentImageIndexInBuffer === this.DWObject.HowManyImagesInBuffer - 1) {
                $("#DW_btnNextImage").prop("disabled", true);
                $("#DW_btnLastImage").prop("disabled", true);
            }
        }
        else {
            this.dwtChangePageBtns.prop("disabled", true);
        }
    }
    //--------------------------------------------------------------------------------------
    //*********************************    Webcam    ***************************************
    //--------------------------------------------------------------------------------------

    refershCameraList() {
        this.setState({ cameras: this.DWObject.Addon.Webcam.GetSourceList() });
    }

    camera_onchange(value) {
        let oldDeviceSetup = this.state.deviceSetup;
        oldDeviceSetup.currentCamera = value;
        this.setState({
            deviceSetup: oldDeviceSetup
        });
        this.DWObject.Addon.Webcam.StopVideo();
        if (value === "nocamera") return;
        if (value === "firstCamera")
            value = this.state.cameras[0];
        if (this.DWObject.Addon.Webcam.SelectSource(value)) {
            var mediaTypes = this.DWObject.Addon.Webcam.GetMediaType(),
                _mediaTypes = {},
                _currentmT = mediaTypes.GetCurrent();
            var frameRates = this.DWObject.Addon.Webcam.GetFrameRate(),
                _frameRates = {},
                _currentfR = frameRates.GetCurrent();
            var resolutions = this.DWObject.Addon.Webcam.GetResolution(),
                _resolutions = {},
                _currentRes = resolutions.GetCurrent();
            var _advancedSettings = {},
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
                        var _temp = key.split("-");
                        var fold = _temp[0];
                        var item = parseInt(_temp[1].substr(3));
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
            this.setState({
                exception: {
                    code: -2,
                    message: "Can't use the Webcam " + value + ", please make sure it's not in use!"
                }
            });
        }
    }

    playVideo(config) {
        setTimeout(() => {
            var basicSetting, moreSetting;
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
            this.DWObject.Addon.Webcam.PlayVideo(this.DWObject, 80, function () { });
        }, 30);
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

    switchViews() {
        if (this.isVideoOn === false) {
            // continue the video
            this.SetIfWebcamPlayVideo(true);
        } else {
            // stop the video
            this.SetIfWebcamPlayVideo(false);
        }
    }

    SetIfWebcamPlayVideo(bShow) {
        try {
            if (bShow) {
                this.DWObject.Addon.Webcam.StopVideo();
                setTimeout(() => {
                    this.playVideo();
                    let oldDeviceSetup = this.state.deviceSetup;
                    oldDeviceSetup.isVideoOn = true;
                    this.setState({
                        deviceSetup: oldDeviceSetup
                    });
                }, 30);
            } else {
                this.DWObject.Addon.Webcam.StopVideo();
                let oldDeviceSetup = this.state.deviceSetup;
                oldDeviceSetup.isVideoOn = false;
                this.setState({
                    deviceSetup: oldDeviceSetup
                });
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    captureImage() {
        if (this.DWObject) {
            var funCaptureImage = () => {
                setTimeout(() => {
                    this.SetIfWebcamPlayVideo(false);
                }, 50);
            };
            this.DWObject.Addon.Webcam.CaptureImage(funCaptureImage, funCaptureImage);
        }
    }

    onScannerSetupChange(option, type, value) {
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

    render() {
        return (
            <DWTUserInterface
                dwt={this.state.dwt}
                containerId={this.containerId}
                scanners={this.state.scanners}
                cameras={this.state.cameras}
                deviceSetup={this.state.deviceSetup}

                onScannerSetupChange={(option, type, value) => this.onScannerSetupChange(option, type, value)}
                onSourceChange={(value) => this.source_onchange(value)}
                onCameraChange={(value) => this.camera_onchange(value)}

                btnRotateLeft={() => this.btnRotateLeft()}
                btnRotateRight={() => this.btnRotateRight()}
                btnRotate180={() => this.btnRotate180()}
                btnMirror={() => this.btnMirror()}
                btnFlip={() => this.btnFlip()}
                btnCrop={() => this.btnCrop()}
                btnChangeImageSize={() => this.btnChangeImageSize()}
                btnCancelChange={() => this.btnCancelChange()}
                btnChangeImageSizeOK={() => this.btnChangeImageSizeOK()}
                saveUploadImage={(_type) => this.saveUploadImage(_type)}
                btnFirstImage={() => this.btnFirstImage()}
                btnPreImage_wheel={() => this.btnPreImage_wheel()}
                btnNextImage_wheel={() => this.btnNextImage_wheel()}
                btnPreImage={() => this.btnPreImage()}
                btnNextImage={() => this.btnNextImage()}
                btnLastImage={() => this.btnLastImage()}
                btnRemoveCurrentImage={() => this.btnRemoveCurrentImage()}
                btnRemoveAllImages={() => this.btnRemoveAllImages()}
                setlPreviewMode={() => this.setlPreviewMode()}

                cameraSettings={this.state.cameraSettings}
                acquireImage={() => this.acquireImage()}
                switchViews={() => this.switchViews()}
                captureImage={() => this.captureImage()}
                btnLoadImagesOrPDFs={() => this.btnLoadImagesOrPDFs()}
                btnShowImageEditor={() => this.btnShowImageEditor()}
                rdTIFF={() => this.rdTIFF()}
                rdPDF={() => this.rdPDF()}
                rd={() => this.rd()}
            />
        );
    }
}
