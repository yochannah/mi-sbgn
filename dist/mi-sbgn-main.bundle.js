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
/******/ 	return __webpack_require__(__webpack_require__.s = 185);
/******/ })
/************************************************************************/
/******/ ({

/***/ 185:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setAttr", function() { return setAttr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createElem", function() { return createElem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "graphView", function() { return graphView; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "complexViewer", function() { return complexViewer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__model_Graph__ = __webpack_require__(186);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__model_BindingSite__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__model_ComplexView__ = __webpack_require__(187);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__model_Link__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Layout__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__model_Participant__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__model_ParticipantLabel__ = __webpack_require__(97);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__model_StateVariable__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Maths__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__model_UnitOfInformation__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__XMLdownloader__ = __webpack_require__(188);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__router__ = __webpack_require__(189);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__external_line_segments_intersect_js__ = __webpack_require__(95);















var svgElementId = "mi-sbgn",
    currentComplex = "EBI-9997373";


//This is syntactic sugar and is used across all the svg element files as a common util.
var setAttr = function (elem, x, y) {
        elem.setAttributeNS(null, x, y);
    },
    createElem = function (elemName) {
        return document.createElementNS("http://www.w3.org/2000/svg", elemName);
    },
    graphView = new __WEBPACK_IMPORTED_MODULE_0__model_Graph__["a" /* default */](),
    complexViewer = null;

var generateXMLButtons = document.querySelectorAll(".download-sbgn");
for (var i = 0; i < generateXMLButtons.length; i++) {
    var XMLButton = generateXMLButtons.item(i);
    XMLButton.addEventListener("click", function (event) {
        var complexXML = complexViewer.toXML();
        Object(__WEBPACK_IMPORTED_MODULE_10__XMLdownloader__["a" /* default */])(complexXML, "xml", currentComplex);
    });
}

////// Selector for complexes:
document.getElementById("complexSelector").addEventListener("change", function (event) {
    var newComplex = event.target.value;
    route.navigate(event.target.value, {
        trigger: true
    });
});

function initViewer(complexName) {
    if(complexName) {     
        currentComplex = complexName; }
    $.get({
        dataType: "json",
        url: "https://www.ebi.ac.uk/intact/complex-ws/export/" + currentComplex
    }, function (data) {
        var mi = new MIModel(data).load().then(function (model) {
            complexViewer = new __WEBPACK_IMPORTED_MODULE_2__model_ComplexView__["a" /* default */]({
                model: model,
                el: document.getElementById(svgElementId),
                graphView: graphView
            });
            document.getElementById('complextitle').innerHTML = currentComplex;
        });
    });

};

//this makes everything happen
var route = new __WEBPACK_IMPORTED_MODULE_11__router__["a" /* default */](initViewer);

/***/ }),

/***/ 186:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Graph;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Link__ = __webpack_require__(92);


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
            l1 = this.graph.linkDeduplicationLookup[link1],
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
            var link = new __WEBPACK_IMPORTED_MODULE_0__Link__["a" /* default */](source, target, {
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

/***/ 187:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Participant__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Layout__ = __webpack_require__(98);



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
            this.layout = new __WEBPACK_IMPORTED_MODULE_1__Layout__["a" /* default */](this.el, this.graphView);

        } catch (e) {
            console.error("%cerror--", "background-color:firebrick; color:#eee;font-weight:bold;", e);
        }
        return this;
    },
    instantiateParticipants: function () {
        var parent = this;
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
        parent.graphView.graph.links.map(function (link) {
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

/***/ 188:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = downloadFile;
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

/***/ }),

/***/ 189:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = router;
//routing thanks to https://cdnjs.com/libraries/backbone.js/tutorials/what-is-a-router
function router(initViewer) {
    var AppRouter = Backbone.Router.extend({
    routes: {
        "*actions": "defaultRoute"
    }
    
});

this.appRouter = new AppRouter;

this.appRouter.on('route:defaultRoute', function (complex) {
        if (complex) {
            console.log("navigating", complex);
            //navigate to the fragment in the url
            initViewer(complex);
        } else {
            //use a default
            initViewer();
        }
    });


Backbone.history.start();

return this;
}



router.prototype.navigate = function(whereTo) {
    this.appRouter.navigate(whereTo,{trigger:true});
    window.location.reload();
}

/***/ }),

/***/ 47:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = UnitOfInformation;
function UnitOfInformation(info) {
    var uoiTypes = {
        protein: "mt:prot",
        binding: "ct:bind"
    }
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

/***/ 48:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Maths;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__external_line_segments_intersect_js__ = __webpack_require__(95);


//I wanted to call this file math, but that's already a thing in JS.
function Maths(){
    /**getting the correct location for translated elements is a nightmare (but a
     necessary one, because we want to use <g> tags to group our elements and the
     only way to locate a <g> correctly is.... translate! Thankfully, this SO person
     is Good People: https://stackoverflow.com/questions/26049488/how-to-get-absolute-coordinates-of-object-inside-a-g-group
    **/
    var intersection = function(lines) {
        return Object(__WEBPACK_IMPORTED_MODULE_0__external_line_segments_intersect_js__["a" /* default */])(lines.box.start, lines.box.end, lines.link.start, lines.link.end);
    }
    var boxLineIntersection = function(rectangle, line, previousLine, prevlinecoord) {
        //maths here to deconstruct the box into 4 lines and see if any of them
        //intersect with the box. Return which line and the coords.
        var box = rectangle.node.getBBox();
        box.center = {
            x: rectangle.getCenterX(),
            y: rectangle.getCenterY()
        }

        //note we could proceed straight to x and y coords of the lines but I feel
        //it's easier to read and understand by defining each corner with a name first.
        var corners = {
                topleft: {
                    x: box.x,
                    y: box.y
                },
                topright: {
                    x: box.x + box.width,
                    y: box.y
                },
                bottomleft: {
                    x: box.x,
                    y: box.y + box.height
                },
                bottomright: {
                    x: box.x + box.width,
                    y: box.y + box.height
                }
            },
            lines = {
                top: {
                    start: corners.topleft,
                    end: corners.topright
                },
                right: {
                    start: corners.topright,
                    end: corners.bottomright
                },
                bottom: {
                    start: corners.bottomleft,
                    end: corners.bottomright
                },
                left: {
                    start: corners.topleft,
                    end: corners.bottomleft
                }
            },
            overlapper = null,
            newEndpoint = {
                x: null,
                y: null
            }

        //it should overlap one of the four lines in the target box since we are
        //calculating from the center of the box
        for (var lineorientation in lines) {
            var intersects = intersection({
                box: lines[lineorientation],
                link: {
                    start: line.source,
                    end: line.target
                }
            });
            //debugger;
            if (intersects) {
                overlapper = lineorientation;
            }
        }


        //special case: the top and bottom of binding site boxes have ct:bind and
        //binding sites located on them. We don't want to draw arrows on top of the boxes.
        switch (overlapper) {
            case "top":
                newEndpoint = {
                    x: box.center.x,
                    y: box.y - 4
                }
                break;
            case "bottom":
                newEndpoint = {
                    x: box.center.x,
                    y: box.y + box.height + 4
                }
                break;
            case "left":
                newEndpoint = {
                    x: box.x,
                    y: box.center.y
                }
                break;
            case "right":
                newEndpoint = {
                    x: box.x + box.width,
                    y: box.center.y
                }
                break;
            case "previous":
                newEndpoint = {
                    x: previousLine.getAttribute("x" + prevlinecoord),
                    y: previousLine.getAttribute("y" + prevlinecoord)
                }
                console.log("%cnewEndpoint", "color:turquoise;font-weight:bold;", newEndpoint);
                break;

            default:
                newEndpoint = {
                    x: box.center.x,
                    y: box.center.y
                }
        }

        return newEndpoint;
    }
    var lineEnds = function (box1, box2) {
      //takes bbox for each of two boxes
      //get minx, maxx, miny, maxy for the box corners.
      //determine which sides overlap, if any.

      //3 cases:
      ////1: No overlapping side. two closest xy corner pairs become the ends. Easiest. Return these pairs.
      ////2: the Y coords overlap. This means the lines will be on the two closest X coords.
      ////3: the X coords overlap. Flip case of 2. This means the lines will be on the two closest Y coords.

      //Cases 2 & 3 require some more calculations but are reverse of each other.
      //Case 2: the X of both lines are known, we need to calculate where the Y is. To do this:
      //calculate the length: Take the min overlapping y and its closest y, and subtract one from the other. The absolute value of this is the length of overlap
      //calculate the actual join locations: length/2 gives us the midpoint in the overlap. Add this number to the min Y of each of the two lines. Voila! I think this is the algorithm we want

    }
    return { boxLineIntersection: boxLineIntersection};
};


/***/ }),

/***/ 92:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Link;
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

/***/ 93:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = BindingSite;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__UnitOfInformation__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__StateVariable__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Maths__ = __webpack_require__(48);




function BindingSite(model, graphView) {
  this.model = model;
  this.name = "binding region";
  this.cid = this.model.cid;
  this.graphView = graphView;

  this.graphView.addNode(this);

  this.uoi = new __WEBPACK_IMPORTED_MODULE_0__UnitOfInformation__["a" /* default */]("binding");
  this.position = new __WEBPACK_IMPORTED_MODULE_1__StateVariable__["a" /* default */](model.get("pos"));
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
  return Object(__WEBPACK_IMPORTED_MODULE_2__Maths__["a" /* default */])().boxLineIntersection(this, line, previousLine, prevlinecoord);
}

BindingSite.prototype.addLinks = function () {
  //find links and add them.
  var links = this.model.get("feature").get("linkedFeatures"),
    parent = this;
  links.models.map(function (linkedFeature) {
    var bindingRegions = linkedFeature.get("sequenceData");
    if (bindingRegions) {
      bindingRegions.map(function (region) {
        parent.graphView.addLink(parent.model.cid, region.cid);
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
        _attrs: parent.graphView.boundsToSBGNCoords(parent.bounds)
      },
      parent.uoi.toXML(),
      parent.position.toXML(parent.bounds.y)
    ]

  });
}

/***/ }),

/***/ 94:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = StateVariable;

function StateVariable(info) {
    this.info = info;
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

/***/ 95:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = doLineSegmentsIntersect;
//From https://github.com/pgkelley4/line-segments-intersect

/**
 * @author Peter Kelley
 * @author pgkelley4@gmail.com
 */

/**
 * See if two line segments intersect. This uses the
 * vector cross product approach described below:
 * http://stackoverflow.com/a/565282/786339
 *
 * @param {Object} p point object with x and y coordinates
 *  representing the start of the 1st line.
 * @param {Object} p2 point object with x and y coordinates
 *  representing the end of the 1st line.
 * @param {Object} q point object with x and y coordinates
 *  representing the start of the 2nd line.
 * @param {Object} q2 point object with x and y coordinates
 *  representing the end of the 2nd line.
 */
function doLineSegmentsIntersect(p, p2, q, q2) {
	var r = subtractPoints(p2, p);
	var s = subtractPoints(q2, q);

	var uNumerator = crossProduct(subtractPoints(q, p), r);
	var denominator = crossProduct(r, s);

	if (uNumerator == 0 && denominator == 0) {
		// They are coLlinear

		// Do they touch? (Are any of the points equal?)
		if (equalPoints(p, q) || equalPoints(p, q2) || equalPoints(p2, q) || equalPoints(p2, q2)) {
			return true
		}
		// Do they overlap? (Are all the point differences in either direction the same sign)
		return !allEqual(
				(q.x - p.x < 0),
				(q.x - p2.x < 0),
				(q2.x - p.x < 0),
				(q2.x - p2.x < 0)) ||
			!allEqual(
				(q.y - p.y < 0),
				(q.y - p2.y < 0),
				(q2.y - p.y < 0),
				(q2.y - p2.y < 0));
	}

	if (denominator == 0) {
		// lines are paralell
		return false;
	}

	var u = uNumerator / denominator;
	var t = crossProduct(subtractPoints(q, p), s) / denominator;

	return (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1);
}

/**
 * Calculate the cross product of the two points.
 *
 * @param {Object} point1 point object with x and y coordinates
 * @param {Object} point2 point object with x and y coordinates
 *
 * @return the cross product result as a float
 */
function crossProduct(point1, point2) {
	return point1.x * point2.y - point1.y * point2.x;
}

/**
 * Subtract the second point from the first.
 *
 * @param {Object} point1 point object with x and y coordinates
 * @param {Object} point2 point object with x and y coordinates
 *
 * @return the subtraction result as a point object
 */
function subtractPoints(point1, point2) {
	var result = {};
	result.x = point1.x - point2.x;
	result.y = point1.y - point2.y;

	return result;
}

/**
 * See if the points are equal.
 *
 * @param {Object} point1 point object with x and y coordinates
 * @param {Object} point2 point object with x and y coordinates
 *
 * @return if the points are equal
 */
function equalPoints(point1, point2) {
	return (point1.x == point2.x) && (point1.y == point2.y)
}

/**
 * See if all arguments are equal.
 *
 * @param {...} args arguments that will be compared by '=='.
 *
 * @return if all arguments are equal
 */
function allEqual(args) {
	var firstValue = arguments[0],
		i;
	for (i = 1; i < arguments.length; i += 1) {
		if (arguments[i] != firstValue) {
			return false;
		}
	}
	return true;
}


/***/ }),

/***/ 96:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Participant;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ParticipantLabel__ = __webpack_require__(97);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__UnitOfInformation__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__BindingSite__ = __webpack_require__(93);




function Participant(model, graphView) {
    this.graphView = graphView;
    this.init(model); 
    return this;
}

Participant.prototype.addGroup = function () {
    var groupMembers = this.bindingSites.concat(this.label);
    this.group = this.graphView.addGroup(groupMembers, this.model.cid);
}

Participant.prototype.getBounds = function () {
    return this.graphView.boundsToSBGNCoords(this.group.bounds);
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

Participant.prototype.init = function (model) {
    this.model = model;
    this.node = {};
    this.interactor = this.model.get("interactor");
    this.initFeatures();
    this.initBindingSites();

    this.label = new __WEBPACK_IMPORTED_MODULE_0__ParticipantLabel__["a" /* default */](this.interactor.get("label"), this.interactor.cid);
    this.graphView.addNode(this.label, this.interactor.cid);

    this.node.uoi = new __WEBPACK_IMPORTED_MODULE_1__UnitOfInformation__["a" /* default */](this.interactor.get("type").name);

    if (this.bindingSites) {
        var parent = this;
        parent.node.bindingSites = [];
        this.bindingSites.map(function (site) {
            var newSite = new __WEBPACK_IMPORTED_MODULE_2__BindingSite__["a" /* default */](site, parent.graphView);
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

/***/ 97:
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

/***/ 98:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = Layout;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Maths__ = __webpack_require__(48);


function Layout(el, graphView) {
    var svg = this.svg = d3.select(el);
    this.svgsize = el.getBoundingClientRect();
    var styles = {
        textSize: 5,
        corners: 5,
        leftOffset: 2,
        padding: 3,
        infoWidth: 30
    };
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
        });

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


/***/ })

/******/ });