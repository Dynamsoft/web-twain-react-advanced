import React from 'react';
import './DynamsoftSDK.css';
import Dynamsoft from 'dwt';
import dynamsoft from 'dynamsoft-sdk';
import $ from 'jquery';

class UI extends React.Component {
    render() {
        return (
            <div id="DWTcontainer" className="container">
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
                        <button name="dwt-changePage" id="DW_btnFirstImage" onClick={this.props.btnFirstImage}> |&lt; </button>
                            &nbsp;
                        <button name="dwt-changePage" id="DW_btnPreImage" onClick={this.props.btnPreImage}> &lt; </button>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                        <input name="dwt-changePage" type="text" size="2" id="DW_CurrentImage" readOnly="readonly" />
                            /
                        <input name="dwt-changePage" type="text" size="2" id="DW_TotalImage" readOnly="readonly" />
                            &nbsp;&nbsp;&nbsp;&nbsp;
                        <button name="dwt-changePage" id="DW_btnNextImage" onClick={this.props.btnNextImage}> &gt; </button>
                            &nbsp;
                        <button name="dwt-changePage" id="DW_btnLastImage" onClick={this.props.btnLastImage}> &gt;| </button>
                        </div>
                        <div className="ct-rt">Preview Mode:
                        <select name="dwt-changePage" size="1" id="DW_PreviewMode" onChange={this.props.setlPreviewMode}>
                                <option value="0">1X1</option>
                                <option value="1">2X2</option>
                                <option value="2">3X3</option>
                                <option value="3">4X4</option>
                                <option value="4">5X5</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div id="ScanWrapper">
                    <div id="divScanner" className="divinput">
                        <ul className="PCollapse">
                            <li>
                                <div className="divType">
                                    <div className="mark_arrow expanded"></div>
                                    Custom Scan</div>
                                <div id="div_ScanImage" className="divTableStyle">
                                    <ul id="ulScaneImageHIDE">
                                        <li>
                                            <label htmlFor="source">
                                                <p>Select Source:</p>
                                            </label>
                                            <select size="1" id="source" style={{ position: "relative" }} onChange={this.props.source_onchange}>
                                                <option value="0">Looking for devices..</option></select>
                                        </li>
                                        <li id="divProductDetail">
                                            <ul id="divTwainType">
                                                <li>
                                                    <label id="lblShowUI" htmlFor="ShowUI">
                                                        <input type="checkbox" id="ShowUI" />Show UI&nbsp;
                                                </label>
                                                    <label htmlFor="ADF">
                                                        <input type="checkbox" id="ADF" />AutoFeeder&nbsp;
                                                </label>
                                                    <label htmlFor="Duplex">
                                                        <input type="checkbox" id="Duplex" />Duplex
                                                </label>
                                                </li>
                                                <li>Pixel Type:
                                                <label htmlFor="BW" style={{ marginLeft: "5px" }}>
                                                        <input type="radio" id="BW" name="PixelType" />B&amp;W
                                                </label>
                                                    <label htmlFor="Gray">
                                                        <input type="radio" id="Gray" name="PixelType" />Gray
                                                </label>
                                                    <label htmlFor="RGB">
                                                        <input type="radio" id="RGB" name="PixelType" />Color
                                                </label>
                                                </li>
                                                <li>
                                                    <span>Resolution:</span>
                                                    <select size="1" id="Resolution">
                                                        <option value="100">100</option>
                                                        <option value="200">200</option>
                                                        <option value="300">300</option>
                                                    </select>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="tc">
                                            <button id="btnScan" onClick={this.props.acquireImage} style={{ color: "rgb(255, 255, 255)", backgroundColor: "rgb(80, 168, 225)", cursor: "pointer", width: "100%" }}>Scan</button>
                                        </li>
                                    </ul>
                                    <div id="tblLoadImage" style={{ visibility: "hidden" }}>
                                        <a href="return false" className="ClosetblLoadImage"><img src="Images/icon-ClosetblLoadImage.png" alt="Close tblLoadImage" /></a>
                                        <p>You can Install a Virtual Scanner:</p>
                                        <p>
                                            <a id="samplesource32bit" href="https://download.dynamsoft.com/tool/twainds.win32.installer.2.1.3.msi">32-bit Sample Source</a>
                                            <a id="samplesource64bit" style={{ display: "none" }} href="https://download.dynamsoft.com/tool/twainds.win64.installer.2.1.3.msi">64-bit Sample Source</a> from
                                        <a target="_blank" rel="noopener noreferrer" href="http://www.twain.org">TWG</a>
                                        </p>
                                    </div>
                                </div>
                            </li>
                            <li id="liLoadImage">
                                <div className="divType">
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
                                <div className="divType">
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
                                <div className="divType">
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
                <div id="DWTcontainerBtm" style={{ textAlign: "left" }} className="clearfix">
                    <div id="DWTemessageContainer"></div>
                    <div id="divNoteMessage"> </div>
                </div>
            </div>
        );
    }
}

export default class DWT extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    isHtml5 = !!(Dynamsoft.Lib.env.bWin && Dynamsoft.Lib.product.bChromeEdition);
    DWObject = null;
    containerId = 'dwtcontrolContainer';
    productKey = 't0140cQMAAGnOvWTyoOR4HEFckJJmzMWpZcPSHyXGAvYGxgEkg5fBnRoFPslaAayuNOe5B/gp7plUCIUAtf6Ttb98d7Ifv/3A6Mxsu7CZLJhKHUuMorfuu/E/ZrOfuSyoMz7zjXKjgvHcMO1HiGbvyHv+GBWM54ZpP4Wej2RorGBUMJ4b4tx40yqnXlIiqvs=';
    _strTempStr = '';
    re = /^\d+$/;
    strre = /^[\s\w]+$/;
    refloat = /^\d+\.*\d*$/i;
    isSelectedArea = false;
    _iLeft = 0;
    _iTop = 0;
    _iRight = 0;
    _iBottom = 0;
    DWTSourceCount = 0;
    dwt = {};
    showAbleWidthOri = 0;
    showAbleHeightOri = 0;
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
            this.showAbleWidthOri = $("#dwtcontrolContainer").width() - 2;//2 for border
            this.showAbleHeightOri = $("#dwtcontrolContainer").height() - 4;//4 for border
            this.dwtChangePageBtns = $("button[name='dwt-changePage']");
            this.DWObject = Dynamsoft.WebTwainEnv.GetWebTwain(this.containerId);
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
                this.DWObject.RegisterEvent('OnImageAreaSelected', (index, left, top, right, bottom) => {
                    this._iLeft = left;
                    this._iTop = top;
                    this._iRight = right;
                    this._iBottom = bottom;
                    this.isSelectedArea = true;
                });
                this.DWObject.RegisterEvent('OnImageAreaDeselected', (index) => {
                    this.isSelectedArea = false;
                    this._iLeft = 0;
                    this._iTop = 0;
                    this._iRight = 0;
                    this._iBottom = 0;
                });
                this.DWObject.RegisterEvent("OnGetFilePath", (bSave, count, index, path, name) => { });
                this.DWObject.RegisterEvent("OnTopImageInTheViewChanged", (index) => {
                    this._iLeft = 0;
                    this._iTop = 0;
                    this._iRight = 0;
                    this._iBottom = 0;
                    this.DWObject.CurrentImageIndexInBuffer = index;
                    this.updatePageInfo();
                });
                this.DWObject.RegisterEvent("OnMouseClick", () => {
                    this.updatePageInfo();
                });
                $('#DWTNonInstallContainerID').hide();

                var twainsource = document.getElementById("source");
                if (!twainsource) {
                    twainsource = document.getElementById("webcamsource");
                }
                var vCount = this.DWObject.SourceCount;
                this.DWTSourceCount = vCount;

                if (twainsource) {
                    twainsource.options.length = 0;
                    for (var i = 0; i < vCount; i++) {
                        twainsource.options.add(new Option(this.DWObject.GetSourceNameItems(i), i));
                    }
                }
                var liNoScanner = document.getElementById("pNoScanner");
                // If source list need to be displayed, fill in the source items.
                if (vCount === 0) {
                    if (liNoScanner) {
                        if (Dynamsoft.Lib.env.bWin) {

                            liNoScanner.style.display = "block";
                            liNoScanner.style.textAlign = "center";
                        }
                        else
                            liNoScanner.style.display = "none";
                    }
                }
                if (vCount > 0) {
                    this.source_onchange(false);
                }

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

                if (!Dynamsoft.Lib.env.bWin && vCount > 0) {
                    if (document.getElementById("lblShowUI"))
                        document.getElementById("lblShowUI").style.display = "none";
                    if (document.getElementById("ShowUI"))
                        document.getElementById("ShowUI").style.display = "none";
                }
                else {
                    if (document.getElementById("lblShowUI"))
                        document.getElementById("lblShowUI").style.display = "";
                    if (document.getElementById("ShowUI"))
                        document.getElementById("ShowUI").style.display = "";
                }

                for (i = 0; i < document.links.length; i++) {
                    if (document.links[i].className === "ShowtblLoadImage") {
                        document.links[i].onclick = this.showtblLoadImage;
                    }
                    if (document.links[i].className === "ClosetblLoadImage") {
                        document.links[i].onclick = this.closetblLoadImage;
                    }
                }
                if (vCount === 0) {
                    if (Dynamsoft.Lib.env.bWin) {
                        if (document.getElementById("aNoScanner") && window['bDWTOnlineDemo']) {
                            if (document.getElementById("div_ScanImage").style.display === "")
                                this.showtblLoadImage();
                        }
                        if (document.getElementById("Resolution"))
                            document.getElementById("Resolution").style.display = "none";
                    }
                }
                else {
                    var divBlank = document.getElementById("divBlank");
                    if (divBlank)
                        divBlank.style.display = "none";
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

        $("ul.PCollapse li>div").click(function () {
            if ($(this).next().css("display") === "none") {
                $(".divType").next().hide("normal");
                $(".divType").children(".mark_arrow").removeClass("expanded");
                $(".divType").children(".mark_arrow").addClass("collapsed");
                $(this).next().show("normal");
                $(this).children(".mark_arrow").removeClass("collapsed");
                $(this).children(".mark_arrow").addClass("expanded");
            }
        });

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
            this.dwt.curImageTimeStamp = (new Date()).getTime();
            this.dwt.showAbleWidth = this.DWObject.HowManyImagesInBuffer > 1 ? this.showAbleWidthOri - 16 : this.showAbleWidthOri;
            this.dwt.showAbleHeight = this.showAbleHeightOri;
            this.dwt.ImageWidth = this.DWObject.GetImageWidth(this.DWObject.CurrentImageIndexInBuffer);
            this.dwt.ImageHeight = this.DWObject.GetImageHeight(this.DWObject.CurrentImageIndexInBuffer);
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
        var cIndex = document.getElementById("source").selectedIndex;
        if (cIndex < 0)
            return;

        this.DWObject.SelectSourceByIndex(cIndex);
        this.DWObject.CloseSource();
        this.DWObject.OpenSource();
        this.DWObject.IfShowUI = document.getElementById("ShowUI").checked;

        var i;
        for (i = 0; i < 3; i++) {
            if (document.getElementsByName("PixelType").item(i).checked === true)
                this.DWObject.PixelType = i;
        }
        if (this.DWObject.ErrorCode !== 0) {
            this.appendMessage('<b>Error setting PixelType value: </b>');
            this.appendMessage("<span style='color:#cE5E04'><b>" + this.DWObject.ErrorString + "</b></span><br />");
        }
        this.DWObject.Resolution = document.getElementById("Resolution").value;
        if (this.DWObject.ErrorCode !== 0) {
            this.appendMessage('<b>Error setting Resolution value: </b>');
            this.appendMessage("<span style='color:#cE5E04'><b>" + this.DWObject.ErrorString + "</b></span><br />");
        }

        var bADFChecked = document.getElementById("ADF").checked;
        this.DWObject.IfFeederEnabled = bADFChecked;
        if (bADFChecked === true && this.DWObject.ErrorCode !== 0) {
            this.appendMessage('<b>Error setting ADF value: </b>');
            this.appendMessage("<span style='color:#cE5E04'><b>" + this.DWObject.ErrorString + "</b></span><br />");
        }

        var bDuplexChecked = document.getElementById("Duplex").checked;
        this.DWObject.IfDuplexEnabled = bDuplexChecked;
        if (bDuplexChecked === true && this.DWObject.ErrorCode !== 0) {
            this.appendMessage('<b>Error setting Duplex value: </b>');
            this.appendMessage("<span style='color:#cE5E04'><b>" + this.DWObject.ErrorString + "</b></span><br />");
        }
        if (Dynamsoft.Lib.env.bWin || (!Dynamsoft.Lib.env.bWin && this.DWObject.ImageCaptureDriverType === 0))
            this.appendMessage("Pixel Type: " + this.DWObject.PixelType + "<br />Resolution: " + this.DWObject.Resolution + "<br />");
        this.DWObject.IfDisableSourceAfterAcquire = true;
        this.DWObject.AcquireImage();
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

    source_onchange(bWebcam) {
        if (document.getElementById("divTwainType"))
            document.getElementById("divTwainType").style.display = "";

        if (document.getElementById("source")) {
            var cIndex = document.getElementById("source").selectedIndex;
            if (Dynamsoft.Lib.env.bMac) {
                var strSourceName = this.DWObject.GetSourceNameItems(cIndex);
                if (strSourceName.indexOf("ICA") === 0) {
                    if (document.getElementById("lblShowUI"))
                        document.getElementById("lblShowUI").style.display = "none";
                    if (document.getElementById("ShowUI"))
                        document.getElementById("ShowUI").style.display = "none";
                } else {
                    if (document.getElementById("lblShowUI"))
                        document.getElementById("lblShowUI").style.display = "";
                    if (document.getElementById("ShowUI"))
                        document.getElementById("ShowUI").style.display = "";
                }
            }
            else
                this.DWObject.SelectSourceByIndex(cIndex);
        }
    }

    render() {
        return (
            <UI
                containerId={this.containerId}
                acquireImage={() => this.acquireImage()}
                source_onchange={() => this.source_onchange()}
                btnLoadImagesOrPDFs={() => this.btnLoadImagesOrPDFs()}
                btnShowImageEditor={() => this.btnShowImageEditor()}
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
                rdTIFF={() => this.rdTIFF()}
                rdPDF={() => this.rdPDF()}
                rd={() => this.rd()}
            />
        );
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
            _divMessageContainer.ondblclick = function () {
                this.innerHTML = "";
                this._strTempStr = "";
            }
        }
    }

    initiateInputs() {
        var allinputs = document.getElementsByTagName("input");
        for (var i = 0; i < allinputs.length; i++) {
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
        var i, strimgType_save;
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
        var i, strHTTPServer, strActionPage, strImageType;

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
            this.initReadBtn();
        }, (ex) => {
            alert('Init DBR failed' + (ex.message || ex));
        });
    }

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
            this.DWObject.Addon.OCR.Recognize(
                this.DWObject.CurrentImageIndexInBuffer,
                (iImageID, result) => {
                    if (result === null)
                        return null;
                    var _textResult = (Dynamsoft.Lib.base64.decode(result.Get())).split(/\r?\n/g),
                        _resultToShow = [];
                    for (var i = 0; i < _textResult.length; i++) {
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

    clearBarcodeRect() {
        if (this.isHtml5) {
            $(".barcodeInfoRect").remove();
        }
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
            var dbrObject = new dynamsoft.BarcodeReader();

            var settings = dbrObject.getRuntimeSettings();
            if (this.DWObject.GetImageBitDepth(this.DWObject.CurrentImageIndexInBuffer) === 1)
                settings.scaleDownThreshold = 214748347;
            else
                settings.scaleDownThreshold = 2300;
            settings.barcodeFormatIds = dynamsoft.BarcodeReader.EnumBarcodeFormat.All;
            settings.region.measuredByPercentage = 0;
            if (this.isSelectedArea) {
                settings.region.left = this._iLeft;
                settings.region.top = this._iTop;
                settings.region.right = this._iRight;
                settings.region.bottom = this._iBottom;
            }
            else {
                settings.region.left = 0;
                settings.region.top = 0;
                settings.region.right = 0;
                settings.region.bottom = 0;
            }
            dbrObject.updateRuntimeSettings(settings);

            //dbrRead callback
            var userData = this.dwt.curImageTimeStamp;
            var onDbrReadSuccess = (results) => {
                this.logResult(results, true);
                if (results.length !== 0 && this.dwt.curImageTimeStamp === userData) {
                    this.drawBarcodeRect(results);
                }
                readBarcodeFinally();
            };
            var onDbrReadFail = function () {
                readBarcodeFinally();
            };

            // HTML5 browsers: use url
            if (this.isHtml5) {
                var dwtUrl = this.DWObject.GetImagePartURL(this.DWObject.CurrentImageIndexInBuffer);
                dbrObject.decode(dwtUrl).then(onDbrReadSuccess, onDbrReadFail);
            } else {
                alert("Current browser is not supported!")
            }
        });
        // finally after #btn-readBarcode click
        var readBarcodeFinally = () => {
            $("#btn-readBarcode").prop("disabled", false);
            //enable change-page btns
            this.updateBtnsState();
        };

        $("#btn-readBarcode").prop("disabled", false);
        $("#btn-readBarcode").text('Read Barcode');
    }

    logResult(results, bBarcode) {
        var strMsg = ["------------------------------------------<br />"];
        if (bBarcode) {
            if (results.length === 0) {
                strMsg.push("No barcode found for the selected format(s).<br /><br />");
            } else {
                strMsg.push("<b>Total barcode(s) found: ", results.length, "</b><br /><br />");
                for (var i = 0; i < results.length; ++i) {
                    var result = results[i];
                    var arr = ["<b>Barcode ", (i + 1), "</b><br />",
                        "<b>Type: <span style='color:#fe8e14'>", result.BarcodeFormatString, "</span></b><br />",
                        "<b>Value: <span style='color:#fe8e14'>", this.convertTextForHTML(result.BarcodeText), "</span></b>",
                        "<b>Data: ", dynamsoft.lib.stringify(result.BarcodeBytes), "</b><br />",
                        "<b>Angle: ", result.LocalizationResult.Angle, "</b><br />"
                    ];
                    strMsg = strMsg.concat(arr);
                }
            }
        }
        this.appendMessage(strMsg.join(""), true);
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
        var dwtDiv = $("#dwtcontrolContainer");
        if (this.dwt.showAbleWidth >= this.dwt.ImageWidth && this.dwt.showAbleHeight >= this.dwt.ImageHeight) {
            zoom = 1;
        } else if (this.dwt.showAbleWidth / this.dwt.showAbleHeight >= this.dwt.ImageWidth / this.dwt.ImageHeight) {
            zoom = this.dwt.showAbleHeight / this.dwt.ImageHeight;
        } else {
            zoom = this.dwt.showAbleWidth / this.dwt.ImageWidth;
        }
        for (var i = 0; i < results.length; ++i) {
            var result = results[i];
            var loc = result.LocalizationResult;
            loc.left = Math.min(loc.X1, loc.X2, loc.X3, loc.X4);
            loc.top = Math.min(loc.Y1, loc.Y2, loc.Y3, loc.Y4);
            loc.right = Math.max(loc.X1, loc.X2, loc.X3, loc.X4);
            loc.bottom = Math.max(loc.Y1, loc.Y2, loc.Y3, loc.Y4);
            // HTML5 borwsers: show rectangles and numbers. We use div to manually draw the rectangles, you can use OverlayRectangle as well
            if (this.isHtml5) {
                var leftBase = 1 + this.dwt.showAbleWidth / 2 - this.dwt.ImageWidth / 2 * zoom;
                var topBase = 1 + this.dwt.showAbleHeight / 2 - this.dwt.ImageHeight / 2 * zoom;
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
    //*********************************radio response***************************************
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
}
