var styles = {
        textSize: 5,
        corners: 5,
        leftOffset: 2,
        padding: 2,
        infoWidth: 30
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
    };

var graphView = new Graph();

document.addEventListener("DOMContentLoaded", function(event) {
    $.get({
        dataType: "json",
        url: "http://www.ebi.ac.uk/intact/complex-ws/export/EBI-10828997"
    }, function(data) {

        new MIModel(data).load().then(function(model) {

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
                            graphView.addNode(newParticipant);
                        });

                        graphView.addLinks();

                        //once we have the text, we can adjust outlines based on text width
                        parent.participants.map(function(participant) {
                            participant.updateOutlines();
                        });

                        var nodeLocations = [],
                            links = [],
                            nodeIndexLookup = {};
                        parent.participants.map(function(participant) {
                            var bb = participant.node.getBBox(),
                                id = participant.model.get("id");

                            //TODO THIS IS HARDWIRED. Needs to dynamically output all links.

                            //suggest keep a node index lookup table.
                            nodeLocations.push({
                                width: bb.width,
                                height: bb.height,
                                participant: participant
                            })
                            links.push({
                                source: 0,
                                target: 1
                            });
                        });

                        //now we need to lay out the major boxes:
                        var newLayout = layout(nodeLocations, links);
                        newLayout.nodes().map(function(node) {
                            node.participant.setLocation(node.x, node.y);
                        });

                    } catch (e) {
                        console.error("%cerror", "background-color:firebrick; color:#eee;font-weight:bold;", e);
                    }
                    return this;
                }
            });

            function layout(nodeLocations, linkIds) {
                //drawn from https://github.com/tgdwyer/WebCola/blob/893f1ae744f35b83c59451836065ef0d1897a688/WebCola/test/apitests.ts#L77
                let layout = new cola.Layout()
                    .handleDisconnected(false) // handle disconnected repacks the components which would hide any drift
                    .linkDistance(1)
                    .avoidOverlaps(true) // force non-overlap
                    .links(linkIds)
                    .constraints([{
                        gap: 10,
                        top: 10,
                        bottom: 50,
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
                    ids.map(function(id) {
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
                model: model,
                el: document.getElementById('complextitle')
            });
        });
    });
});
