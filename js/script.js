import Graph from './Graph';
import BindingSite from './BindingSite';
import ComplexView from './ComplexView';
import Link from './Link';
import Layout from './Layout';
import Participant from './Participant';
import './ParticipantLabel';
import StateVariable from './StateVariable';
import Title from './Title';
import UnitOfInformation from './UnitOfInformation';
import './XMLdownloader';

var styles = {
    textSize: 5,
    corners: 5,
    leftOffset: 2,
    padding: 3,
    infoWidth: 30
},
    uoiTypes = {
        protein: "mt:prot",
        binding: "ct:bind"
    },
    svgElementId = "mi-sbgn",
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
    initViewer(currentComplex);
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
        console.log(mi, complexViewer, graphView);
    });

};

function generateXML() {
    var complexXML = complexViewer.toXML();
    downloadFile(complexXML, "xml", currentComplex);
}