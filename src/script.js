var styles = {
        textSize: 5,
        corners: 5,
        leftOffset: 2,
        padding: 2
    },
    uoiTypes = {
        protein: "mt:prot",
        binding: "ct:bind"
    };

//This is syntactic sugar.
var setAttr = function(elem, x, y) {
        elem.setAttributeNS(null, x, y);
    },
    createElem = function(elemName) {
        return document.createElementNS("http://www.w3.org/2000/svg", elemName);
    }


var interaction;
document.addEventListener("DOMContentLoaded", function(event) {
    $.get({
        dataType: "json",
        url: "http://www.ebi.ac.uk/intact/complex-ws/export/EBI-10828997"
    }, function(data) {

        new MIModel(data).load().then(function(model) {

            function UnitOfInformation(info) {
                this.info = uoiTypes[info];
                this.node = createElem("g");
                setAttr(this.node, "transform", "translate(0,3)")
                var text = createElem("text")
                text.appendChild(document.createTextNode(this.info));
                var rect = createElem("rect");

                setAttr(rect, "width", 30);
                setAttr(rect, "height", 10);
                this.node.appendChild(rect);


                setAttr(text, "x", styles.leftOffset);
                setAttr(text, "y", "6");
                setAttr(text, "font-size", styles.textSize);
                this.node.appendChild(text);
            }
            UnitOfInformation.prototype.updateOutlines = function(parentBB) {
                var top = parentBB.height - 8;
                setAttr(this.node, "transform", "translate(0," + top + ")");
            }

            function StateVariable(info) {
                this.info = info;
                this.node = createElem("g");
                setAttr(this.node, "transform", "translate(0,-15)")
                var text = createElem("text")
                text.appendChild(document.createTextNode(this.info));
                var rect = createElem("rect");

                setAttr(rect, "width", 30);
                setAttr(rect, "rx", 5);
                setAttr(rect, "ry", 5);
                setAttr(rect, "height", styles.textSize * 2);
                this.node.appendChild(rect);


                setAttr(text, "x", styles.leftOffset * 2);
                setAttr(text, "y", "6");
                setAttr(text, "font-size", styles.textSize);
                this.node.appendChild(text);
                // TODO: Calc after render. Here it returns 0.
                //              this.textSize = text.getBBox();
                // setAttr(rect,"width",this.textSize.width);
                // setAttr(rect,"height",this.textSize.height);
            }

            function BindingSite(model, count) {
                this.model = model;
                this.count = count + 1;
                this.node = createElem("g");

                var loc = -45;
                if (count > 0) {
                    loc = 45;
                }
                setAttr(this.node, "transform", "translate(" + loc + ",10)");
                var text = createElem("text")
                text.appendChild(document.createTextNode("binding region"));
                var rect = this.rect = createElem("rect");

                setAttr(rect, "strokeWidth", 1);
                setAttr(rect, "width", 45);
                setAttr(rect, "x", (styles.leftOffset * -3));
                setAttr(rect, "y", -10);
                setAttr(rect, "rx", 1);
                setAttr(rect, "ry", 1);


                setAttr(rect, "height", 16);
                this.node.appendChild(rect);



                setAttr(text, "x", (styles.leftOffset * -2));
                setAttr(text, "y", "0");
                setAttr(text, "font-size", styles.textSize);
                this.node.appendChild(text);
                this.node.appendChild(new UnitOfInformation("binding").node);
                this.node.appendChild(new StateVariable(model.get("pos")).node);
                return this;
            }

            BindingSite.prototype.updateOutlines = function() {
                bb = this.node.getBBox();
                setAttr(this.rect, "x", (bb.x - styles.padding));
                setAttr(this.rect, "width", (bb.width + (styles.padding * 2)));
                //height is pretty simple so we don't update it.
            }




            function Participant(model) {
                console.log("%cmodel", "color:firebrick;font-weight:bold;", model);
                this.init(model);
                return this;
            }

            var location = 0; // temp var until we get positioning properly

            Participant.prototype.setLocation = function(x,y) {
              setAttr(this.node, "transform", "translate(" + Math.round(x) + "," + Math.round(y) + ")");
              console.log("%cthis","color:darkseagreen;font-weight:bold;",this.node);
            }


            Participant.prototype.init = function(model) {
                this.model = model;
                this.node = createElem("g");
                this.interactor = this.model.get("interactor");
                this.initFeatures();
                this.initBindingSites();
                location = location + 35;
                this.setLocation(10, location);

                this.node.rect = createElem("rect");
                this.node.append(this.node.rect);

                setAttr(this.node.rect, "rx", 1);
                setAttr(this.node.rect, "ry", 1);


                var text = createElem("text");
                var label = document.createTextNode(this.interactor.get("label"));
                text.appendChild(label);
                setAttr(text, "font-size", styles.textSize);

                this.node.appendChild(text);

                this.node.uoi = new UnitOfInformation(this.interactor.get("type").name);
                this.node.appendChild(this.node.uoi.node);

                if (this.bindingSites) {
                    var parent = this;
                    parent.node.bindingSites = [];
                    this.bindingSites.map(function(site, i) {
                        var newSite = new BindingSite(site, i);
                        parent.node.bindingSites.push(newSite);
                        parent.node.appendChild(newSite.node);
                    });
                }
            }

            Participant.prototype.updateOutlines = function() {
                console.log("updateme", this.node.getBBox(), this.node.uoi);

                var bb = this.node.getBBox();

                //update binding sites and uois
                this.node.bindingSites.map(function(site) {
                    site.updateOutlines();
                });

                bb = this.node.getBBox();

                setAttr(this.node.rect, "x", (bb.x - styles.padding));
                setAttr(this.node.rect, "y", (bb.y - styles.padding));
                setAttr(this.node.rect, "width", (bb.width + (styles.padding * 2)));
                setAttr(this.node.rect, "height", (bb.height + (styles.padding * 2)));

                this.node.uoi.updateOutlines(bb);

            }

            Participant.prototype.initFeatures = function() {
                this.features = this.model.get("features");
                var parentId = this.model.get("id");
                console.log("%cthis","color:turquoise;font-weight:bold;",this);
                if (this.features.length > 0) {
                    this.features = this.features.models;
                } else {
                    this.features = false;
                }
                if (this.features) {
                  this.links = [];
                  var links = [];
                  this.features.map(function(feature) {
                    var id1 = parseInt(feature.get("linkedFeatures").models[0].get("id"),10);
                    var id2 = parseInt(feature.get("id"),10);
                    links = links.concat(feature.get("linkedFeatures").models);
                    console.log("%clinks","color:turquoise;font-weight:bold;",links,parentId, id1, id2, feature.get("linkedFeatures").models);
                  });
                }
            }

            Participant.prototype.initBindingSites = function() {
                var binding = [];
                if (this.features) {
                    this.features.map(function(feature) {
                        binding = binding.concat(feature.get("sequenceData").models);
                    });
                    if (binding.length > 0) {
                        this.bindingSites = binding;
                    }
                }
            }


            var ComplexView = Backbone.View.extend({
                className: "sbgnContainer",
                interactors: model.attributes.interactors.models,
                participants: [],
                initialize: function() {
                    this.render();
                    this.listenTo(this.model, "change", this.render);
                },
                render: function() {
                    var parent = this;
                    var mynode = createElem("rect");
                    mynode.setAttributeNS(null, "x", 10);
                    mynode.setAttributeNS(null, "y", 10);
                    mynode.setAttributeNS(null, "height", 300);
                    this.el.appendChild(mynode);

                    try {
                        //first, instantiate the nodes and print the text
                        model.get("interactions").at(0).get("participants").map(function(participant) {
                            var newParticipant = new Participant(participant);
                            parent.el.appendChild(newParticipant.node);
                            parent.participants.push(newParticipant);
                        });

                        //once we have the text, we can adjust outlines based on text width
                        parent.participants.map(function(participant) {
                            participant.updateOutlines();
                        });
                //      console.log("%cparent.participants","color:turquoise;font-weight:bold;",parent.participants);

                        var nodeLocations = [], links = [], nodeIndexLookup = {};

                        parent.participants.map(function(participant) {
                            var bb = participant.node.getBBox(),
                              id = participant.model.get("id");


                            console.log("%cparticipantnode","color:goldenrod;font-weight:bold;",participant.bindingSites, 5);

                            participant.bindingSites.map(function(site){
                              var nodeId = nodeLocations.length;
                              console.log("%csite","color:turquoise;font-weight:bold;",site);
                            });

                            nodeLocations.push({width : bb.width,height : bb.height, participant : participant})
                            links.push({source: 0,target: 1});
//                            console.log("%clinks","color:turquoise;font-weight:bold;",links);
                          });

                          // var actualLinks = []
                          //
                          // _.each(links, function(id, intid){
                          //   _.each(links, function(id2, intid2){
                          //     if(intid != intid2) {
                          //     actualLinks.push({source: parseInt(intid,10), target:parseInt(intid2,10)})
                          //     }
                          //   });
                          // });

//                          console.log("%cactualLinks","color:turquoise;font-weight:bold;",actualLinks);

console.log("%cnodeLocations","color:turquoise;font-weight:bold;",nodeLocations);
                        //now we need to lay out the major boxes:
                        var newLayout = layout(nodeLocations, links);
                        newLayout.nodes().map(function(node) {
                          console.log("%cnode","border-bottom:chartreuse solid 3px;",node);
                          node.participant.setLocation(node.x,node.y);
                        });

                    } catch (e) {
                        console.log("%ce", "color:navajowhite;font-weight:bold;", e);
                    }
                    return this;
                }

            });

            function layout(nodeLocations,linkIds) {
              //drawn from https://github.com/tgdwyer/WebCola/blob/893f1ae744f35b83c59451836065ef0d1897a688/WebCola/test/apitests.ts#L77
                const nodeSize = 20,
                    threshold = 0.01;
                let layout = new cola.Layout()
                    .handleDisconnected(false) // handle disconnected repacks the components which would hide any drift
                    .linkDistance(1)
                    .avoidOverlaps(true) // force non-overlap
                    .links(linkIds)
                    .constraints([{
                        type: "alignment",
                        axis: "x",
                        offsets: [{
                                node: 0,
                                offset: 0
                            },
                            {
                                node: 1,
                                offset: 0
                            },
                        ]
                    }]).nodes(nodeLocations)
                layout.start(); // first layout
                return layout;
            }



            //  console.log("%cx","color:turquoise;font-weight:bold;",x);
            new ComplexView({
                model: model,
                el: document.getElementById('mi-sbgn')
            });
            new Title({
                el: document.getElementById
            });
        });
    });
});
