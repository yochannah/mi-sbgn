var styles = {
        textSize: 5,
        corners: 5,
        leftOffset: 2,
        padding: 2,
        infoWidth : 30 },
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

                setAttr(rect, "width", styles.infoWidth);
                setAttr(rect, "height", styles.textSize+2);
                this.node.appendChild(rect);


                setAttr(text, "x", styles.leftOffset);
                setAttr(text, "y", styles.textSize);
                setAttr(text, "font-size", styles.textSize);
                this.node.appendChild(text);
            }
            UnitOfInformation.prototype.updateOutlines = function(parentBB) {
                var top = parentBB.height - styles.textSize - styles.padding;
                setAttr(this.node, "transform", "translate(0," + top + ")");
            }

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

                setAttr(rect, "width", 1.5*styles.infoWidth);
                setAttr(rect, "x", (styles.leftOffset * -3));
                setAttr(rect, "y", -2 * styles.textSize);
                setAttr(rect, "rx", 1);
                setAttr(rect, "ry", 1);
                setAttr(rect, "height", styles.textSize * 3);
                this.node.appendChild(rect);

                setAttr(text, "x", (styles.leftOffset * -2));
                setAttr(text, "y", "-1");
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

                //update binding sites and uois
                this.node.bindingSites.map(function(site) {
                    site.updateOutlines();
                });

                var bb = this.node.getBBox();

                setAttr(this.node.rect, "x", (bb.x - styles.padding));
                setAttr(this.node.rect, "y", (bb.y - styles.padding));
                setAttr(this.node.rect, "width", (bb.width + (styles.padding * 2)));
                setAttr(this.node.rect, "height", (bb.height + (styles.padding * 2)));

                this.node.uoi.updateOutlines(bb);

            }

            Participant.prototype.initFeatures = function() {
                this.features = this.model.get("features");
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
                    setAttr(mynode, "x", 10);
                    setAttr(mynode, "y", 10);
                    setAttr(mynode, "height", 300);
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

                        var nodeLocations = [], links = [], nodeIndexLookup = {};
                        parent.participants.map(function(participant) {
                            var bb = participant.node.getBBox(),
                              id = participant.model.get("id");

                              //TODO THIS IS HARDWIRED. Needs to dynamically output all links.

                              //suggest keep a node index lookup table.
                            nodeLocations.push({width : bb.width,height : bb.height, participant : participant})
                            links.push({source: 0,target: 1});
                          });

                        //now we need to lay out the major boxes:
                        var newLayout = layout(nodeLocations, links);
                        newLayout.nodes().map(function(node) {
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
                let layout = new cola.Layout()
                    .handleDisconnected(false) // handle disconnected repacks the components which would hide any drift
                    .linkDistance(1)
                    .avoidOverlaps(true) // force non-overlap
                    .links(linkIds)
                    .constraints([{
                        gap:10,
                        top:10,
                        bottom:50,
                        offsets: [{
                                node: 0,
                                offset: 0
                            },
                            {
                                node: 1,
                                offset: 0
                            },
                        ]
                    }]).nodes(nodeLocations);
                layout.start(); // first layout
                return layout;
            }

            var Title = Backbone.View.extend({
                initialize: function() {
                    this.render();
                    this.listenTo(this.model, "change", this.render);
                },
                render: function() {
                  var ids = model.get("interactions").models[0].get("identifiers"),
                  title;
                  ids.map(function(id){
                    //this might be a little fragile. Will they all have Intact IDs? haha.
                    if (id.db === "intact") {
                      title = id.id;
                    }
                  });
                    this.$el.html(title);
                }
              });

            new ComplexView({
                model: model,
                el: document.getElementById('mi-sbgn')
            });
            new Title({
                model:model,
                el: document.getElementById('complextitle')
            });
        });
    });
});
