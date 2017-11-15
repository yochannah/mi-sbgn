/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Participant;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ParticipantLabel__ = __webpack_require__(1);


function Participant(model) {
    this.init(model);
    return this;
}

Participant.prototype.addGroup = function () {
    var groupMembers = this.bindingSites.concat(this.label);
    this.group = graphView.addGroup(groupMembers, this.model.cid);
}

Participant.prototype.getBounds = function () {
    return graphView.boundsToSBGNCoords(this.group.bounds);
}

Participant.prototype.generateBindingSiteXML = function () {
    var sites = [];

    this.node.bindingSites.map(function (bindingSite) {
        sites.push(bindingSite.toXML());
    });
    return sites;
}

Participant.prototype.toXML = function () {
    var parent = this,
        //build array of xml tags up
        bindingSiteXML = parent.generateBindingSiteXML(),
        participantXML = [{
                _name: "label",
                //**This is what I WISH I could do: specify label location. but apparently that's invalid sbgn-ml.  
                // _attrs: $.fn.extend({
                //     "text": parent.label.name
                // },graphView.boundsToSBGNCoords(parent.label.bounds))
                _attrs: {
                    "text": parent.label.name
                },
            },
            {
                _name: "bbox",
                _attrs: parent.getBounds()
            }
        ];
    // combine xml and send it to parent function
    return jstoxml.toXML({
        _name: 'glyph',
        _attrs: {
            id: parent.model.cid,
            class: "entity"
        },
        _content: participantXML.concat(bindingSiteXML)

    });
}

Participant.prototype.init = function (model, graphView) {
    this.model = model;
    this.node = {};
    this.interactor = this.model.get("interactor");
    this.initFeatures();
    this.initBindingSites();
    console.log("dddddd",graphView, model)

    this.label = new __WEBPACK_IMPORTED_MODULE_0__ParticipantLabel__["a" /* default */](this.interactor.get("label"), this.interactor.cid);
    graphView.addNode(this.label, this.interactor.cid);

    this.node.uoi = new UnitOfInformation(this.interactor.get("type").name);

    if (this.bindingSites) {
        var parent = this;
        parent.node.bindingSites = [];
        this.bindingSites.map(function (site, i) {
            var newSite = new BindingSite(site, i);
            parent.node.bindingSites.push(newSite);
        });
    }
}

Participant.prototype.initFeatures = function () {
    this.features = this.model.get("features");
    if (this.features.length > 0) {
        this.features = this.features.models;
    } else {
        this.features = false;
    }
    if (this.features) {
        this.links = [];
        var links = [];
        this.features.map(function (feature) {
            var id1 = parseInt(feature.get("linkedFeatures").models[0].get("id"), 10);
            var id2 = parseInt(feature.get("id"), 10);
            links = links.concat(feature.get("linkedFeatures").models);
        });
    }
}

Participant.prototype.initBindingSites = function () {
    var binding = [];
    if (this.features) {
        this.features.map(function (feature) {
            var seq = feature.get("sequenceData").models;
            if (seq) {
                binding = binding.concat(seq);
            } else {
                console.log("%cfeature", "color:turquoise;font-weight:bold;", feature);
            }
        });
        if (binding.length > 0) {
            this.bindingSites = binding;
        }
    }
}

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export labelcount */
/* harmony export (immutable) */ __webpack_exports__["a"] = Label;
var labelcount = 0;
function Label(textContent, parentId) {
  labelcount++;


  this.model = {cid: parentId + "-label-" + labelcount};
  this.cid = this.model.cid;
  this.name = textContent;

  return this;
}

Label.prototype.addLinks = function(){
  //not needed for labels. they have no links, kthx. they just float about in
  //their parents' box. Spongers.
}

Label.prototype.setLocation = function(x, y){
  //as above. We don't need to do anything, parent manages it.
}


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setAttr", function() { return setAttr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createElem", function() { return createElem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "graphView", function() { return graphView; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "complexViewer", function() { return complexViewer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Graph__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__BindingSite__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ComplexView__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Link__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Layout__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Participant__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ParticipantLabel__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__StateVariable__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Title__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__UnitOfInformation__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__XMLdownloader__ = __webpack_require__(11);












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
var setAttr = function (elem, x, y) {
    elem.setAttributeNS(null, x, y);
},
    createElem = function (elemName) {
        return document.createElementNS("http://www.w3.org/2000/svg", elemName);
    },
    graphView = new __WEBPACK_IMPORTED_MODULE_0__Graph__["a" /* default */](),
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
    graphView = new __WEBPACK_IMPORTED_MODULE_0__Graph__["a" /* default */]();
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
                complexViewer = new __WEBPACK_IMPORTED_MODULE_2__ComplexView__["a" /* default */]({
                    model: model,
                    el: document.getElementById(svgElementId),
                    graphView : graphView
                });
                new __WEBPACK_IMPORTED_MODULE_8__Title__["a" /* default */]({
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

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Graph;
function Graph() {
    this.graph = {
        nodes: [],
        links: [],
        linkDeduplicationLookup: {},
        nodeIndexLookup: {},
        groups: []
    };
    this.addNode = function (node) {
        // adds a node and stores a reference to each node in a lookup table, since
        // cola (the layout library)
        // runs based on index of nodes rather than ids.
        this.graph.nodeIndexLookup[node.model.cid] = this.graph.nodes.length;
        this.graph.nodes.push(node);
        return node;
    };
    this.addLinkIndex = function (link1, link2) {
        if (this.graph.linkDeduplicationLookup[link1]) {
            this.graph.linkDeduplicationLookup[link1].push(link2);
        } else {
            this.graph.linkDeduplicationLookup[link1] = [link2];
        }
    }
    this.addLinkIndexes = function (link1, link2) {
        this.addLinkIndex(link2, link1);
        this.addLinkIndex(link1, link2);
    }
    this.isDuplicate = function (link1, link2) {
        var l1isLinkedTol2, l2isLinkedTol1,
            l1 = this.graph.linkDeduplicationLookup[link1];
        l2 = this.graph.linkDeduplicationLookup[link2];
        if (l1) {
            l1isLinkedTol2 = (l1.indexOf(link2) !== -1);
        }
        if (l2) {
            l2isLinkedTol1 = (l2.indexOf(link1) !== -1);
        }
        return l1isLinkedTol2 || l2isLinkedTol1;
    }
    this.addLink = function (source, target) {
        //adds a single link. Please provide the cid of each model as source/target.
        var sourceindex = this.graph.nodeIndexLookup[source],
            targetindex = this.graph.nodeIndexLookup[target],
            duplicatelink = this.isDuplicate(sourceindex, targetindex);
        if (!duplicatelink) {
            var link = new Link(source, target, {
                source: sourceindex,
                target: targetindex,
            });
            this.addLinkIndexes(sourceindex, targetindex);

            this.graph.links.push(link);
        }
    };
    this.updateNodeSizes = function () {
        this.graph.nodes.map(function (node) {
            var bb = node.node.getBBox();
            node.width = bb.width,
                node.height = bb.height;
        })
    }

    this.addGroup = function (group, parentCid) {
        var g = {
            leaves: [],
            padding: 3,
            margin: 6
        }
        parent = this;
        group.map(function (groupMember) {
            var identifier = groupMember.cid;
            g.leaves.push(parent.graph.nodeIndexLookup[identifier]);
        });
        this.graph.groups.push(g);
        return g;
    };
    this.addLinks = function () {
        //Adds all links for nodes. This needs to be run after all nodes have been created.
        this.graph.nodes.map(function (aNode) {
            aNode.addLinks();
        });
    }
    this.boundsToSBGNCoords = function (someNodeBounds) {
        return {
            y: someNodeBounds.y.toFixed(0), //I don't know why but this is so goshdarned wrong.
            x: someNodeBounds.x.toFixed(0),
            w: (someNodeBounds.X - someNodeBounds.x).toFixed(0),
            h: (someNodeBounds.Y - someNodeBounds.y).toFixed(0)
        }
    }
}



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
function BindingSite(model, count) {
  this.model = model;
  this.name = "binding region";
  this.cid = this.model.cid;

  graphView.addNode(this);

  this.uoi = new UnitOfInformation("binding");
  this.position = new StateVariable(model.get("pos"));
  return this;
}

BindingSite.prototype.getCenterX = function () {
  var bb = this.node.getBBox();
  return bb.x + bb.width / 2;
}

BindingSite.prototype.getCenterY = function () {
  var bb = this.node.getBBox();
  return bb.y + bb.height / 2;
}

BindingSite.prototype.getArrowTarget = function (line, previousLine, prevlinecoord) {
  return Maths.boxLineIntersection(this, line, previousLine, prevlinecoord);
}

BindingSite.prototype.addLinks = function () {
  //find links and add them.
  var links = this.model.get("feature").get("linkedFeatures"),
    parent = this;
  links.models.map(function (linkedFeature) {
    var bindingRegions = linkedFeature.get("sequenceData");
    if (bindingRegions) {
      bindingRegions.map(function (region) {
        graphView.addLink(parent.model.cid, region.cid);
      });
    } else {
      console.error("%c something went wrong with the link for", "color:orange;", this);
    }
  });
}

BindingSite.prototype.toXML = function () {
  var parent = this;
  return jstoxml.toXML({
    _name: 'glyph',
    _attrs: {
      id: parent.model.cid,
      class: "entity"
    },
    _content: [{
        _name: "label",
        _attrs: {
          "text": "binding region"
        }
      },
      {
        _name: "bbox",
        _attrs: graphView.boundsToSBGNCoords(parent.bounds)
      },
      parent.uoi.toXML(),
      parent.position.toXML(parent.bounds.y)
    ]

  });
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Participant__ = __webpack_require__(0);


var ComplexView = Backbone.View.extend({
    className: "sbgnContainer",
    initialize: function (x) {
        this.interactors = this.model.attributes.interactors.models;
        this.participants = [];
        this.graphView = x.graphView;
        this.render();
        this.listenTo(this.model, "change", this.render);
     },

    empty: function () {
        this.$el.html("");
        this.node = null;
    },
    render: function () {

        try {
            //first we create all the elements, but we don't know
            //their layout.
            this.instantiateParticipants();
            this.graphView.addLinks();
            this.layout = new Layout(this.el);

        } catch (e) {
            console.error("%cerror--", "background-color:firebrick; color:#eee;font-weight:bold;", e);
        }
        return this;
    },
    instantiateParticipants: function () {
        var parent = this;
        console.log("perarg",parent, parent.graphView);
        this.model.get("interactions").at(0).get("participants").map(function (participant) {
            var newParticipant = new __WEBPACK_IMPORTED_MODULE_0__Participant__["a" /* default */](participant, parent.graphView);
            parent.participants.push(newParticipant);
        });
        this.participants.map(function (participant) {
            participant.addGroup();
        });
    },
    generateParticipantXML: function () {
        var parent = this,
        participantXML = [];

        parent.participants.map(function (participant) {
            participantXML.push(participant.toXML());
        });

        return participantXML;

    },
    generateLinkXML: function () {
        var parent = this,
        linkXML = [];
        graphView.graph.links.map(function (link) {
            linkXML.push(link.toXML());
        });

        return linkXML;

    },
    toXML: function () {
        var participantXML = this.generateParticipantXML(),
            linkXML = this.generateLinkXML();
        return jstoxml.toXML({
            _name: 'sbgn',
            _content: {
                _attrs: {
                    language: "entity relationship"
                },
                _content: participantXML.concat(linkXML),
                _name: "map"
            },
            _attrs: {
                xmlns: 'http://sbgn.org/libsbgn/0.2'
            }
        }, {
            header: true
        });
    }

});

/* harmony default export */ __webpack_exports__["a"] = (ComplexView);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
//It's dangeous to go alone! Take this! <=========(--o
//I may have spent far too long getting Link's sword just right.
function Link(source, target, indexes) {
  // d3 references the links by the index of the object it's linking to
  // hence why we store references both to the objets themselves 
  // and also and the indexes in the graph object.
  this.source = indexes.source;
  this.target = indexes.target;
  this.sourceObject = source;
  this.targetObject = target;
  this.id = source + "-" + target;
  this.coords = {};
  return this;
}

Link.prototype.toXML = function () {
  var parent = this;
  console.log(parent);
  return jstoxml.toXML({
    _name: 'arc',
    _attrs: {
      id : parent.id,
      class: "interaction",
      source: parent.sourceObject,
      target: parent.targetObject,
    },
     _content: [
       {
         _name: "start",
         _attrs: {
           "y": parent.coords.y1,
           "x": parent.coords.x1
         }
       },
       {
         _name: "end",
         _attrs: {
           "y": parent.coords.y2,
           "x": parent.coords.x2
         }
       }
    ]
    // {
    //   _name: "bbox",
    //   _attrs: graphView.boundsToSBGNCoords(parent.bounds)
    // },
    // parent.uoi.toXML(),
    // parent.position.toXML(parent.bounds.y)
    // ]

  });

}

Link.prototype.equals = function(link) {
  return (((this.link.target === link.link.target) && (this.link.source === link.link.source)) || ((this.link.target === link.link.source) && (this.link.source === link.link.target)))
}


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
function Layout(el) {
    this.svg = svg = d3.select(el);
    this.svgsize = el.getBoundingClientRect()
    try {
        var width = this.svgsize.height,
            height = this.svgsize.height,
            pad = styles.padding;
        //for ff, which will display offscreen without height/width set:
        el.setAttribute("width", width + "px");
        el.setAttribute("height", height + "px");

        // Define the harpoon arrow markers, which
        // are required for sbgn relationships.
        svg.append("defs").append("marker")
            .attr("id", "Harpoon")
            .attr("viewbox", "0 0 20 20")
            .attr("refX", 20)
            .attr("refY", 20)
            .attr("markerWidth", 40)
            .attr("markerHeight", 40)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0,0 40,20 0,40 20,20 Z");

        svg.append("defs").append("marker")
            .attr("id", "Upside-down-harpoon")
            .attr("viewbox", "0 0 20 20")
            .attr("refX", 20)
            .attr("refY", 20)
            .attr("markerWidth", 40)
            .attr("markerHeight", 40)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0,20 40,40 20,20 40,0 Z");

        //give all nodes some default sizes to start the layout with
        graphView.graph.nodes.forEach(function(node) {
          node.height = 41;
          node.width = 41;
        })

        //Setting up cola
        var c = cola.d3adaptor(d3)
            .linkDistance(200)
            .avoidOverlaps(true)
            .handleDisconnected(true)
            .size([width, height]);

        //give cola some nodes, links, and groups,
        //then start laying out
        c.nodes(graphView.graph.nodes)
            .links(graphView.graph.links)
            .groups(graphView.graph.groups);
        c.start();


        var group = svg.selectAll(".group interactor")
            .data(graphView.graph.groups)
            .enter().append("rect")
            .attr("rx", 5).attr("ry", 5)
            .attr("class", "interactor")
            .call(c.drag);


        var node = svg.selectAll(".node")
            .data(graphView.graph.nodes)
            .enter().append("g")
            .attr("class", function(d) {
                d.node = this;
                return "node " + d.constructor.name + " " + d.cid;
            })
            .call(c.drag)
            .on('mouseup', function(d) {
                d.fixed = 0;
                c.alpha(1); // fire it off again to satify gridify
            });


        var binding = svg.selectAll(".BindingSite");
        var bindingborder = binding.append("rect").attr("class", "bindingborder");


        var labeltext = node.append("text")
            .text(function(d) {
                return d.name;
            })
            .call(c.drag);

        var link = svg.selectAll(".link")
            .data(graphView.graph.links)
            .enter().append("line")
            .attr("class", "link")
            .attr("marker-start", "url(#Upside-down-harpoon)")
            .attr("marker-end", "url(#Harpoon)").call(c.drag);



        //uois - e.g ct:bind
        var uoig = binding.append("g").attr("class", "uoigroup");
        var uoirect = uoig.append("rect");
        uoirect.attr("id", function (d) {
            d.uoi.rect = this;
            return d.cid + "-uoi";
        });
        var uoitext = uoig
            .append("text").attr("class", "uoitext")
            .text(function(d) {
                return d.uoi.info;
            })
            .call(c.drag);

        // location variable
        var locg = binding.append("g").attr("class", "locationgroup");
        var locrect = locg.append("rect");
        locrect.attr("id", function (d) {
            //this is a sneaky way to pass d3 positions back into the model
            d.position.rect = this;
            return d.cid + "-position";
        });
        var locationOfBinding =
            locg.append("text")
            .attr("class", "position")
            .text(function(d) {
                return " " + d.position.info;
            })
            .call(c.drag);

        var initialisedSizes = false;

        c.on("tick", function(x, y, z) {
            //  debugger;
            link.attr("x1", function(d) {
                    d.coords.x1 = d.source.getArrowTarget(d, this, "1").x;
                return d.coords.x1;
                })
                .attr("y1", function(d) {
                    d.coords.y1 = d.source.getArrowTarget(d, this, "1").y;
                    return d.coords.y1;
                })
                .attr("x2", function(d) {
                    d.coords.x2 = d.target.getArrowTarget(d, this, "2").x;
                    return d.coords.x2;
                })
                .attr("y2", function(d) {
                    d.coords.y2 = d.target.getArrowTarget(d, this, "2").y;
                    return d.coords.y2;
                });

            labeltext.attr("x", function(d) {
                    return d.x - d.width / 2 + pad * 2;
                })
                .attr("y", function(d) {
                    var h = this.getBBox().height;
                    return d.y + h * 2;
                })
                .attr("width", function(d) {
                        var w = this.getBBox().width;
                        if (d.constructor.name == "Label") {
                            d.width = w;
                        }
                    return w + pad*2;
                });

            node.attr("height", function(d) {
                d.height = this.getBBox().height;
                return this.getBBox().height;
            })

            //this is the box surrounding the binding region. It is not the largest bounding box, because the location variable is offset at the top, as is ct:bind on the bottom;
            bindingborder.attr("x", function(d) {
                    return d.x - this.getBBox().width / 2;
                })
                .attr("y", function(d) {
                    //  d.y = this.parentNode.getBBox().y;
                    return d.y + this.nextSibling.getBBox().height / 2;
                })
                .attr("height", function(d) {
                    //we can't just get the parent bbox size because i grows endlessly bigger with each iteration.
                    //instead, calculate the height based on the two child groups which form the top and bottom of the group
                    var childnodes = this.parentNode.querySelectorAll("g");
                    var h = childnodes[0].getBBox().y - childnodes[1].getBBox().y;
                    return h;
                }).attr("width", function(d) {
                    d.width = this.nextSibling.getBBox().width + 4 * pad;
                    return this.nextSibling.getBBox().width + 2 * pad;
                });

            uoig.attr("x", function(d) {
                    return d.x - this.getBBox().width / 2 + 2 * pad;
                })
                .attr("y", function(d) {
                    var h = this.getBBox().height;
                    return d.y + h;
                }).attr("height", "20").attr("width", function(d) {
                    return this.getBBox().width
                });

            uoitext.attr("x", function(d) {

                    return d.x - this.getBBox().width / 2;
                })
                .attr("y", function(d) {
                    var h = this.getBBox().height;
                    return d.y + (h * 3);
                }).attr("height", "20").attr("width", function(d) {
                    return this.getBBox().width
                });

            uoirect.attr("x", function(d) {

                    return d.x - this.getBBox().width / 2;
                })
                .attr("y", function(d) {
                    var h = this.getBBox().height;
                    return d.y + (h * 2);
                }).attr("height", "20").attr("width", function(d) {
                    return this.parentNode.getBBox().width
                });



            locationOfBinding.attr("x", function(d) {
                    return d.x - this.getBBox().width / 2;
                })
                .attr("y", function(d) {
                    var h = this.getBBox().height;
                    return d.y + h;
                })

            locrect.attr("x", function(d, f, g) {
                    return d.x - this.getBBox().width / 2 + pad;
                })
                .attr("rx", "10")
                .attr("ry", "10")
                .attr("y", function(d) {
                    return d.y;
                }).attr("height", function(d) {
                    return this.parentNode.getBBox().height;
                }).attr("width", function(d) {
                    return this.parentNode.getBBox().width;
                })


            group.attr("x", function(d) {
                    return d.bounds.x + pad;
                })
                .attr("y", function(d) {
                    //TODO: Figure out why the group is offset incorrectly when everything else is ok (the +30)
                    return d.bounds.y + 30;
                })
                .attr("width", function(d) {
                    return d.bounds.width() - pad;
                })
                .attr("height", function(d) {
                    return d.bounds.height();
                });

            initialisedSizes = true;
        });
    } catch (e) {
        console.log("%ce", "color:cornflowerblue;font-family:sans-serif;", e);
    }
    return this;
}

function updateParent() {

}


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */

function StateVariable(info) {
    this.info = info;
    this.node = createElem("g");
    setAttr(this.node, "transform", "translate(0," + (-2 * (styles.textSize + styles.padding)) + ")")
    var text = createElem("text")
    text.appendChild(document.createTextNode(this.info));
    var rect = createElem("rect");

    setAttr(rect, "width", styles.infoWidth);
    setAttr(rect, "rx", 5);
    setAttr(rect, "ry", 5);
    setAttr(rect, "height", styles.textSize + 2);
    this.node.appendChild(rect);


    setAttr(text, "x", styles.leftOffset * 2);
    setAttr(text, "y", "5");
    setAttr(text, "font-size", styles.textSize);
    this.node.appendChild(text);
}

StateVariable.prototype.toXML = function(parentTop){
    var parent = this;
    return jstoxml.toXML({
        _name: 'glyph',
        _attrs: {
            id: parent.rect.id,
            class: "state variable"
        },
        _content: [{
            _name: "state",
            _attrs: {
                "value": parent.info
            }
        },
        {
            _name: "bbox",
            _attrs: {
                //using the parent.rect.y throws this massively off in Vanted viewer. 
                //Not sure if it's the fault of this code or vanted, but using
                //the parent element's y coord seems to fix it.
                y: parentTop,
                x: parent.rect.x.baseVal.value.toFixed(0),
                w: parent.rect.width.baseVal.value.toFixed(0),
                h: parent.rect.height.baseVal.value.toFixed(0)
            }
        }
        ]

    });;

}


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Title;
function Title() {
    Backbone.View.extend({
    initialize: function() {
        this.render();
        this.listenTo(this.model, "change", this.render);
    },
    render: function() {
        var ids = this.model.get("interactions").models[0].get("identifiers"),
            title;
        ids.map(function(id) {
            //this might be a little fragile. Will they all have Intact IDs? haha.
            if (id.db === "intact") {
                title = id.id;
            }
        });
        this.$el.html(title);
    }
})
};


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
function UnitOfInformation(info) {
    this.info = uoiTypes[info];
}
UnitOfInformation.prototype.toXML = function(){
    var parent = this;
    return jstoxml.toXML({
        _name: 'glyph',
        _attrs: {
            id: parent.rect.id,
            class: "unit of information"
        },
        _content: [{
            _name: "label",
            _attrs: {
                "text": parent.info
            }
        },
        {
            _name: "bbox",
            _attrs: {
                y: (parent.rect.y.baseVal.value - parent.rect.height.baseVal.value),
                x: parent.rect.x.baseVal.value, 
                w: parent.rect.width.baseVal.value,
                h: parent.rect.height.baseVal.value}
        }
        ]
    });
}


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export default */
function downloadFile(fileContents, fileFormat, fileName) {
    // thanks, SO, for always being there for me: 
    // https://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
    // great answer from https://stackoverflow.com/users/1768690/default
    let encodingType = "data:text/" + fileFormat + ";charset=utf-8,";
    var encodedUri = encodeURI(encodingType + fileContents);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", (fileName + ".xml"));
    document.body.appendChild(link); // Required for FF

    link.click();
}

/***/ })
/******/ ]);