var window = new Window("palette", "Video to CameraRaw", undefined);
window.orientation = "column";

// Get dimensions of source footage
var footage = app.project.item(1);
var footageName = footage.name;
var footageWidth = footage.width;
var footageHeight = footage.height;
var footagePAR = footage.pixelAspect;
var footageDuration = footage.duration;
var footageFPS = footage.frameRate;

// Create comp of source footage
var comp = app.project.items.addComp(footageName + "_VTCR", footageWidth, footageHeight, footagePAR, footageDuration, footageFPS);

// Render source footage to png/psd sequence (drop down menu)
var fileTypeGroup = window.add("group", undefined, "");
fileTypeGroup.orientation = "row";
var fileTypes = [".psd", ".png"];
fileTypeGroup.add("statictext", undefined, "File Type: ")
var dropDownFileType = fileTypeGroup.add("dropdownlist", undefined, fileTypes);
dropDownFileType.selection = 0;

window.center();
window.show();

var renderQueueItem = app.project.renderQueue.items.add(comp);
setRenderSettings(dropDownFileType, renderQueueItem, 1);

// Import png/psd sequence as camera raw files


// Functions

function setRenderSettings(dropDown, rqItem, rqIndex) {
    if (dropDown.selection.text == ".psd") {
        rqItem.outputModule(rqIndex).applyTemplate("Photoshop");
    } else if (dropDown.selection.text == ".png") {
        rqItem.outputModule(rqIndex).applyTemplate("PNG");
    } else {
        // Default: .psd
        rqItem.outputModule(rqIndex).applyTemplate("Photoshop");
    }
}