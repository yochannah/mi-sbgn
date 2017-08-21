var ComplexView = Backbone.View.extend({
    className: "sbgnContainer",
    initialize: function() {
        this.interactors = this.model.attributes.interactors.models;
        this.participants = [];
        this.render();
        this.listenTo(this.model, "change", this.render);
    },
    updateOutline: function() {
        //cola sometimes gives us negative margins for some reason, but we don't
        //want the layout to be offscreen! that's weird. So we'll
        //translate it back in to the screen
        setAttr(this.node, "transform", "translate(" + Math.abs(bb.x) + "," + Math.abs(bb.y) + ")");

    },
    empty: function() {
        this.$el.html("");
        this.node = null;
    },
    render: function() {

        try {
            //first we create all the elements, but we don't know
            //their layout.
            this.instantiateParticipants();
            graphView.addLinks();
            this.layout = new Layout(this.el);

        } catch (e) {
            console.error("%cerror", "background-color:firebrick; color:#eee;font-weight:bold;", e);
        }
        return this;
    },

    renderLinks: function() {
        this.links = [];
        var parent = this;
        graphView.graph.links.map(function(link) {
            var l = new Link(link).node;
            parent.links.push(l);
        });
    },
    instantiateParticipants: function() {
        var parent = this;
        this.model.get("interactions").at(0).get("participants").map(function(participant) {
            var newParticipant = new Participant(participant);
            parent.participants.push(newParticipant);
            //  graphView.addNode(newParticipant);
        });
        this.participants.map(function(participant) {
            participant.addGroup();
        });

    },
    updatePositions: function() {
        //first we describe the conceptual graph links (not rendered)

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

        this.renderLinks();
        this.updateOutline();
    }
});
