import Graph from './model/Graph';
import BindingSite from './model/BindingSite';
import ComplexView from './model/ComplexView';
import Link from './model/Link';
import Layout from './Layout';
import Participant from './model/Participant';
import './model/ParticipantLabel';
import StateVariable from './model/StateVariable';
import Maths from './Maths';
import UnitOfInformation from './model/UnitOfInformation';
import downloadFile from './XMLdownloader';
import router from './router';
import doLineSegmentsIntersect from './external/line-segments-intersect.js';


var svgElementId = "mi-sbgn",
    currentComplex = "EBI-9997373";


//This is syntactic sugar and is used across all the svg element files as a common util.
export var setAttr = function (elem, x, y) {
        elem.setAttributeNS(null, x, y);
    },
    createElem = function (elemName) {
        return document.createElementNS("http://www.w3.org/2000/svg", elemName);
    },
    graphView = new Graph(),
    complexViewer = null;

var generateXMLButtons = document.querySelectorAll(".download-sbgn");
for (var i = 0; i < generateXMLButtons.length; i++) {
    var XMLButton = generateXMLButtons.item(i);
    XMLButton.addEventListener("click", function (event) {
        var complexXML = complexViewer.toXML();
        downloadFile(complexXML, "xml", currentComplex);
    });
}

////// Selector for complexes:
try {
document.getElementById("complexSelector").addEventListener("change", function (event) {
    var newComplex = event.target.value;
    route.navigate(event.target.value, {
        trigger: true
    });
});
} catch (e) {console.debug("didn't initialise complex selector")}

function initViewer(complexName) {
    if(complexName) {     
        currentComplex = complexName; }
    $.get({
        dataType: "json",
        url: "https://www.ebi.ac.uk/intact/complex-ws/export/" + currentComplex
    }, function (data) {
        var mi = new MIModel(data).load().then(function (model) {
            complexViewer = new ComplexView({
                model: model,
                el: document.getElementById(svgElementId),
                graphView: graphView
            });
            document.getElementById('complextitle').innerHTML = currentComplex;
        });
    });

};

//this makes everything happen
var route = new router(initViewer);