// Ensure active item is a footage item
if ((app.project.activeItem == null) || !(app.project.activeItem instanceof FootageItem)) {
    alert("Select a footage item!");
// Ensure project is saved
} else if (app.project.file == null) {
    alert("Please save project");
} else {
    // Get dimensions of source footage
    var footage = app.project.activeItem;
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
        var outputFolder = new Folder(app.project.file.parent.fsName + "\\VTCR_renders\\" + comp.name.substring(0, comp.name.lastIndexOf(".")));
        var renderQueueItem = app.project.renderQueue.items.add(comp);
        // Set render settings
        var outputModule = renderQueueItem.outputModule(1);
        outputModule.applyTemplate("Photoshop");
        if (!outputFolder.exists) {
            if (!outputFolder.create()) {
                alert("Couldn't create render folder");
            }
        }
        if (outputFolder.exists){
            outputModule.file = File(outputFolder.fsName + "\\" + comp.name + "_VTCR");
            app.endUndoGroup();
            app.project.renderQueue.render();

            app.beginUndoGroup("Video to Camera Raw (Post-render)");
            // Import psd sequence as camera raw files
            // First Approach: Change the .psd's extensions to .raw
            var files = outputFolder.getFiles(function(file) {
                return (file instanceof File);
            });
            var fNameArray = files[0].name.split('_');
            var sequenceDigits = fNameArray[fNameArray.length - 1];
            sequenceDigits = sequenceDigits.substring(0, sequenceDigits.lastIndexOf("."));

            var file;
            var extension = ".raw";
            for (var i = 0; i < files.length; i++) {
                file = files[i];
                fileName = file.name.substring(0, file.name.lastIndexOf("."));
                file.rename(fileName + extension);
            }

            var sequence = outputFolder.fsName + "\\" + comp.name.substring(0, comp.name.lastIndexOf(".")) + "_" + sequenceDigits + extension;
            comp.remove();

            var importOptions = new ImportOptions();
            importOptions.file = new File(sequence);
            importOptions.sequence = true;
            importOptions.forceAlphabetical = false;
            var sequenceFootageItem = app.project.importFile(importOptions);

            // Second approach: In case support for adjusting format via script is added, do so via importOptions.format / all files or however it would be called
            app.endUndoGroup();
        }
    }
}