var window = new Window("palette", "Video to CameraRaw", undefined);
window.orientation = "column";

// Get dimensions of source footage
var footage = app.project.item(2);
var footageName = footage.name;
var footageWidth = footage.width;
var footageHeight = footage.height;
var footagePAR = footage.pixelAspect;
var footageDuration = footage.duration;
var footageFPS = footage.frameRate;

app.beginUndoGroup("Video to Camera Raw");
// Create comp of source footage
var comp = app.project.items.addComp(footageName + "_VTCR", footageWidth, footageHeight, footagePAR, footageDuration, footageFPS);
comp.layers.add(footage);

// Render source footage to psd sequence
var outputFolder = "";
if (app.project.file == null) {
    alert("Please save project");
} else {
    var renderQueueItem = app.project.renderQueue.items.add(comp);
    setRenderSettings(renderQueueItem, 1);

    // Import psd sequence as camera raw files
}
app.endUndoGroup();

window.center();
window.show();


// Functions

function setRenderSettings(rqItem, rqIndex) {
    rqItem.outputModule(rqIndex).applyTemplate("Photoshop");
}