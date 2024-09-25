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

app.beginUndoGroup("Video to Camera Raw (Pre-render)");
// Create comp of source footage
var comp = app.project.items.addComp(footageName + "_VTCR", footageWidth, footageHeight, footagePAR, footageDuration, footageFPS);
comp.layers.add(footage);

// Render source footage to psd sequence
if (app.project.file == null) {
    alert("Please save project");
} else {
    var outputFolder = new Folder(app.project.file.parent.fsName + "/VTCR_renders/" + comp.name.substring(0, comp.name.lastIndexOf(".")));
    var renderQueueItem = app.project.renderQueue.items.add(comp);
    // Set render settings
    var outputModule = renderQueueItem.outputModule(1);
    outputModule.applyTemplate("Photoshop");
    //setRenderSettings(renderQueueItem, 1);
    if (!outputFolder.exists) {
        if (!outputFolder.create()) {
            alert("Couldn't create render folder");
        }
    }
    if (outputFolder.exists){
        outputModule.file = File(outputFolder.fsName + "/" + comp.name + "_VTCR");
        app.endUndoGroup();
        app.project.renderQueue.render();

        app.beginUndoGroup("Video to Camera Raw (Post-render)");
        // Import psd sequence as camera raw files
        app.endUndoGroup();
    }
}

window.center();
window.show();


// Functions

function setRenderSettings(rqItem, rqIndex) {
    rqItem.outputModule(rqIndex).applyTemplate("Photoshop");
}