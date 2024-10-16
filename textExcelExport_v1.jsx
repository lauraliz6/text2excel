//testing github connection
var items = app.project.items;
var textLayers = [];
for (i=1; i<=items.length; i++){
    var item = items[i];
    if (item.typeName == "Composition"){
        //first use the compInc function to test if this comp's text layers should be included
        var include = compInc(item);
        if (include == true){
            var layers = item.layers;
            for (l=1; l<=layers.length; l++){
                var layer = layers[l];
                //make sure the layer IS a text layer, is enabled (eyeball on), and isn't the version layer
                if(layer.property("Source Text")!= null && layer.enabled == true && layer.name != "version"){
                    var srcText = layer.property("Source Text").value;
                    if (!srcText){
                        srcText = " ";
                    }
                    srcText = replaceChars(srcText);
                    var layerName = layer.name;
                    if (!layerName){
                        layerName = " ";
                    }
                    layerName = replaceChars(layerName);
                    var comp = layer.containingComp;
                    var compName = comp.name;
                    if (!compName){
                        compName = " ";
                    }
                    compName = replaceChars(compName);
                    var layerIndex = layer.index;
                    if (!layerIndex){
                        layerIndex = " ";
                        alert('Layer index not found. Check csv file to ensure accuracy.');
                    }
                    var compIndex = i;
                    if (!compIndex){
                        compIndex = " ";
                        alert('Composition index not found. Check csv file to ensure accuracy.');
                    }
                    //this blank value is to add a column in the excel for the translator
                    var transl = " ";

                    var layerObj = [
                        layerName,
                        srcText,
                        transl,
                        layerIndex,
                        compName,
                        compIndex
                    ];

                    
                    textLayers.push(layerObj);
                }
            }  
        }
        
    }
}

function replaceChars(text){
    //converting to string to make replacements
    text = text.toString();
    //replacing line breaks
    text = text.replace(/\r/g, '~');
    //replacing commas as this confuses the writeLn function
    if (text.match(/"|,/)) {
        text = '"' + text + '"';
    }
    //looking for emdashes and endashes to replace with hypens
    text = text.replace(/—/g, '-');
    text = text.replace(/–/g, '-');
    
    return text;
}

function compInc(item){
     //this function returns true or false, if true, the comp will be included for text layers

    //first check the name of the comp, 
    //and exclude it (false it) if it matches one of these
    var name = item.name.toString();
    if (name == "styleGuide"){
        return false;
    }
    else if (name == "bgColor"){
        return false;
    }
    else if (name == "labels"){
        return false;
    }
    //then make sure we include any stray text layers in projectFR
    else if (name == "projectFR"){
        return true;
    }
    //otherwise, check if the comp is used in a parent comp
    //if it is, check that it is enabled in the parent comp
    else {
        var parents = item.usedIn;
        for (p=0; p<parents.length; p++){
            var parent = parents[p];
            var pLayers = parent.layers;
            for (l=1; l<=pLayers.length; l++){
                var layer = pLayers[l];
                if (layer.source){
                    if (item.name == layer.source.name){
                        if (layer.enabled == true){
                            return true;
                        }
                    }
                }
            }
        }
    }
}

//checking windows or mac, and assigning file path
var windows = ($.os.indexOf('Windows') > -1) ? true : false;

if (windows == false){
    var file = new File('~/Desktop/textfile.csv');
}

else if (windows == true){
    //added new File here, might be the fix for the windows problem
    var file = new File('~\\Desktop\\textfile.csv');
}

var data = textLayers;
file.open('w');
file.writeln("KEY: ~ INDICATES A LINE BREAK., PLEASE DO NOT DELETE ANY ~ SYMBOLS AND RETAIN THEM IN TRANSLATED TEXT.");
file.writeln("Layer Name, Layer Text, Translated Text, Layer Index, Enclosing Comp Name, Enclosing Comp Index");
for (i=0; i<data.length; i++){
    var line = data[i];

    file.writeln(line);
}
file.writeln(" , ");
file.writeln("ADDITIONAL TEXT: , DESIGNERS: Input any additional text to be translated below as well as the timecode, TRANSLATORS: Please translate below text");
file.writeln(" , Original Text, Translated Text, Timecode");
file.close();

alert('Export complete. Find the file on your desktop titled textfile.csv.');
