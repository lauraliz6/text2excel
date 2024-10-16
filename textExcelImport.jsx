try{
//   app.beginUndoGroup("Import csv text file"); // create undo group

    var text = fileContents();
    if (text!=undefined){
        var allText = text.toString();
        var split = allText.split("\n");

        var textArray = [];

        //starting at third line of the excel
        //(skipping one and two which have labels and instructions)
        for (s=2; s<split.length; s++){
            var lineObj = {};
            var line = split[s];

            //accounting for commas inside of quotes
            var lineStr = line.toString();
            if (lineStr.indexOf('"') >= 0){
                var line = fixQuotes(lineStr);
            }


            var lineSplit = line.split(",");
            for (l=0; l<lineSplit.length; l++){
                var lname = lineSplit[0];
                
                var ltext = lineSplit[2];
                if (!ltext){
                    ltext = "";
                }
                var ltext = ltext.replace(/~/g,"\r");

                var lin = lineSplit[3];
                var lcomp = lineSplit[4];
                var lcompi = lineSplit[5];
                lineObj.name = lname;
                lineObj.text = ltext;
                lineObj.index = lin;
                lineObj.comp = lcomp;
                lineObj.compi = lcompi;
            }
            textArray.push(lineObj);
        }

        
        
        for (t=0; t<textArray.length; t++){
            var toWrite = textArray[t];
            var compIndex = toWrite.compi;
            var layerIndex = toWrite.index;
            var layerText = toWrite.text;
            var layerText = layerText.replace(/`/g,",");
            var theComp = app.project.items[compIndex];
            if (theComp){
                var compName = toWrite.comp;
                if (theComp.name == compName){
                    var theLayer = theComp.layers[layerIndex];
                    if (theLayer){
                        var layerName = toWrite.name;
                        if (theLayer.name == layerName){    
                        }
                        else {
                            // alert('Layer name mismatch on '+theLayer.name+'. Did you reorder something?');
                        }
                        theLayer.text.sourceText.setValue(layerText);
                    }
                }
                else {
                    alert('Comp name mismatch on '+theComp.name+'. Did you reorder something?');
                }
            }
            
        }

        alert('finished importing text!');

        // app.endUndoGroup();
    }

    function fileContents(){
        var file = File.openDialog("Select an input csv file.");
        if (file != null){
          var ext = file.toString().split(".").pop();
          if (ext == "csv"){
            file.open("r");
            var text = file.read();
            file.close(); 
          }
          else {
              alert('Please select a csv file!');
              return;
          }
        }
        else if (file == null){
            return;
        }
        return text;
    }

    function fixQuotes(text){
        var quoteSplit = text.split('",');
        var fixedArr = [];
        for (q=0; q<quoteSplit.length; q++){
            var splitPiece = quoteSplit[q];
            if (splitPiece.indexOf('"')>=0){
                var noQuote = splitPiece.split('"').pop();
                var beforeQuote = splitPiece.split('"').shift();
                if (beforeQuote){
                    var beforeQuote = beforeQuote.replace(",","");
                    fixedArr.push(beforeQuote);
                }
                var commaRepl = noQuote.split(",").join("`");
                fixedArr.push(commaRepl);
            }
            else {
                fixedArr.push(splitPiece);
            }
        }
        var fixedText = fixedArr.toString();
        return fixedText;
    }
   
}
catch(e){
    alert(e.line);
    alert(e);
}