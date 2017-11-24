import Graph from './model/Graph';
import BindingSite from './model/BindingSite';
import ComplexView from './model/ComplexView';
import Link from './model/Link';
import Layout from './Layout';
import Participant from './model/Participant';
import './model/ParticipantLabel';
import StateVariable from './model/StateVariable';
import Title from './Title';
import Maths from './Maths';
import UnitOfInformation from './model/UnitOfInformation';
import downloadFile from './XMLdownloader';
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

document.addEventListener("DOMContentLoaded", function (event) {
    //  initViewer("EBI-10828997");
    //initViewer(currentComplex);
    //  initViewer("EBI-9008420");
    //  initViewer("EBI-8869931");
});

var generateXMLButtons = document.querySelectorAll(".download-sbgn");
for (var i = 0; i < generateXMLButtons.length; i++) {
    var XMLButton = generateXMLButtons.item(i);
    XMLButton.addEventListener("click", function (event) {
        generateXML();
    });
}

////// Selector for complexes:
document.getElementById("complexSelector").addEventListener("change", function (event) {
    complexViewer.empty();
    graphView = new Graph();
    initViewer(event.target.value);
});

function initViewer(complexName) {
    currentComplex = complexName;
    $.get({
        dataType: "json",
        url: "https://www.ebi.ac.uk/intact/complex-ws/export/" + complexName
    }, function (data) {
        var mi = new MIModel(data).load().then(function (model) {
            try {
                complexViewer = new ComplexView({
                    model: model,
                    el: document.getElementById(svgElementId),
                    graphView : graphView
                });
                new Title({
                    model: model,
                    el: document.getElementById('complextitle')
                });
            } catch (e) { console.error(e) }
        });
    });

};

function generateXML() {
    var complexXML = complexViewer.toXML();
    downloadFile(complexXML, "xml", currentComplex);
}

var AppRouter = Backbone.Router.extend({
    routes: {
        "*actions": "defaultRoute"
    }
});
var appRouter = new AppRouter;
appRouter.on('route:defaultRoute', function (complex) {
    if(complex) {
        //navigate to the fragment in the url
        initViewer(complex);
    } else {
        //use a default
        initViewer(currentComplex);
    }
});

Backbone.history.start();
