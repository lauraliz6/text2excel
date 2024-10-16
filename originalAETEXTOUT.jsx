{
    //There is no undo group since this only effects files external to After Effects.
    clearOutput();
    var TextOut = new Object;
    TextOut.allText = new Array;
    TextOut.fileName = (function() {
        return $.os.match(/Windows/)
                ? "/Desktop/aetextio/textout/ textfile.txt"
                : ($.os.match(/Mac/) ? "~/Desktop/aetextio/textout/ textfile.txt" : "aetextio/textout/ textfile.txt");
    })();

    TextOut.start = function(callback) {
        // for(var i = 0; i < app.project.selection.length; i++) {

        app.activeViewer.setActive();  
        var activeComp = app.project.activeItem;  

            if (activeComp) {
                for (var j = 1; j <= activeComp.layers.length ; j++) {
                    if(activeComp.layer(j) instanceof TextLayer){
                        TextOut.allText.push(activeComp.layer(j).text.sourceText.value.toString().replace(/(,)/g, '\\$1'));
                    }
                }
            }

        callback(TextOut.allText);
    };

    TextOut.writeFile = function(textArray) {
        //Get destination via save dialog, then write it out
        
        //Todo: check if layers are null before calling
        var joinText = textArray.join(",");
        var initFile = new File(TextOut.fileName);
        var textFile = initFile.saveDlg("Save .txt file", "Text: *.txt")
        if (textFile != null) {
            textFile.open("w");
            textFile.write(joinText);
            textFile.changePath(textFile);
            textFile.close();
        }
    };

    //Execute script
    TextOut.start(TextOut.writeFile);
} 