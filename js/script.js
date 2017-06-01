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

//This is syntactic sugar and is used across all the svg element files as a common util.
var setAttr = function(elem, x, y) {
        elem.setAttributeNS(null, x, y);
    },
    createElem = function(elemName) {
        return document.createElementNS("http://www.w3.org/2000/svg", elemName);
    },
    graphView = new Graph();

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
                updateOutline: function() {
                    var bb = this.node.getBBox();
                    //cola sometimes gives us negative margins for some reason, but we don't
                    //want the layout to be offscreen! that's weird. So we'll
                    //translate it back in to the screen
                    setAttr(this.node, "transform", "translate(" + Math.abs(bb.x) + "," + Math.abs(bb.y) + ")");

                    //here we're setting the dimensions for our cmplex outline and
                    //translating it back into the screen as above.
                    setAttr(this.outline, "x", bb.x);
                    setAttr(this.outline, "y", bb.y);
                    setAttr(this.outline, "width", bb.height);
                    setAttr(this.outline, "height", bb.width);
                    setAttr(this.outline, "transform", "translate(" + Math.abs(bb.x) + "," + Math.abs(bb.y) + ")");
                },
                render: function() {
                    this.outline = createElem("rect");
                    this.node = createElem("g");

                    this.el.appendChild(this.outline);
                    this.el.appendChild(this.node);

                    try {
                      //first we create all the elements, but we don't know
                      //their layout.
                        this.instantiateParticipants();
                        //we use cola to calculate layour based on the side of
                        //the elements, then update the positions.
                        this.updatePositions();
                    } catch (e) {
                        console.error("%cerror", "background-color:firebrick; color:#eee;font-weight:bold;", e);
                    }
                    return this;
                },
                instantiateParticipants: function() {
                    var parent = this;
                    model.get("interactions").at(0).get("participants").map(function(participant) {
                        var newParticipant = new Participant(participant);
                        parent.node.appendChild(newParticipant.node);
                        parent.participants.push(newParticipant);
                        graphView.addNode(newParticipant);
                    });

                },
                updatePositions : function() {
                  //first we describe the conceptual graph links (not rendered)
                  graphView.addLinks();

                  //now we store the sizes of the nodes so cola can calculate
                  //layour for us
                  graphView.updateNodeSizes();

                  //now we provide all of our layout details to cola and it
                  //returns the x and y of each node.
                  var newLayout = layout(graphView.graph.nodes, graphView.graph.links, graphView.groups);
                  newLayout.nodes().map(function(node) {
                      //here we're iteratin through the results from cola and
                      //drawing the locations on the graph.
                      node.setLocation(node.x, node.y);
                  });

                  // once we have the layout, we can draw the outlines of the participants
                  // each outline requires knowing the x and y of the layout
                  // so it can't be drawn any earlier.
                  this.participants.map(function(participant) {
                      participant.updateOutlines();
                  });

                  this.updateOutline();
                }

            });

            function layout(nodeLocations, linkIds, groups) {
                //drawn from https://github.com/tgdwyer/WebCola/blob/893f1ae744f35b83c59451836065ef0d1897a688/WebCola/test/apitests.ts#L77
                let layout = new cola.Layout()
                    .linkDistance(1)
                    .avoidOverlaps(true) // force non-overlap
                    .nodes(nodeLocations)
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
                    }]);
                layout.groups(groups);
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
