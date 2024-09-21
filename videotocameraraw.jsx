var window = new Window("palette", "Video to CameraRaw", undefined);
window.orientation = "column";

// Get dimensions of source footage

// Create comp of source footage
// TODOO
var comp = app.project.activeItem;

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