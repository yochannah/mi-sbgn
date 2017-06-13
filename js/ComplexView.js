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
    empty : function(){
      this.$el.html("");
      this.node = null;
    },
    render: function() {

        try {
          //first we create all the elements, but we don't know
          //their layout.
          this.instantiateParticipants();
          graphView.addLinks();

        //  this.expandToFitParent();

             var width = 960,
                 height = 500;
             var c = cola.d3adaptor(d3)
                 .linkDistance(100)
                 .avoidOverlaps(true)
                 .handleDisconnected(false)
                 .size([width, height]);
console.log("%clinks","color:cornflowerblue;font-family:sans-serif;",graphView.graph.links);
console.log("%cgroups","color:darkseagreen;font-weight:bold;",JSON.stringify(graphView.graph.groups),$.extend({},graphView.graph.groups));


try{
                 c.nodes(graphView.graph.nodes)
                   .links(graphView.graph.links)
                   .groups($.extend({},true,graphView.graph.groups));
                  }
                  catch(e) {
                    console.log("%ce","border-bottom:chartreuse solid 3px;",e);
console.log("%cthis","color:turquoise;font-weight:bold;",c._groups);
                  }
                   c.start();

                 var svg = d3.select(this.el);

          svg.selectAll(".group")
          .data(graphView.graph.groups)
          .enter().append("rect")
          .attr("rx", 8).attr("ry", 8)
          .attr("class", "group")
          .call(c.drag);

          try {

            console.log("%cgraphView.graph.links","color:cornflowerblue;font-family:sans-serif;",graphView.graph.links);
        var link = svg.selectAll(".link")
            .data(graphView.graph.links)
            .enter().append("line")
            .attr("class", "link").call(c.drag);
}catch (e) {console.log("%ce","border-bottom:chartreuse solid 3px;",e);}
        var pad = 3;
        var node = svg.selectAll(".node")
            .data(graphView.graph.nodes)
           .enter().append("rect")
           .attr("class", function(d) {
             console.log("%cd","color:turquoise;font-weight:bold;",d.constructor.name);
             return "node " + d.constructor.name;
           })
           .attr("width", function (d) {
             return d.width - 2 * pad; })

             .attr("height", function (d) {
                return d.height - 2 * pad;
              })
             .attr("rx", 5).attr("ry", 5)
             .call(c.drag);

             c.on("tick", function () {
    link.attr("x1", function (d) { return d.source.x; })
        .attr("y1", function (d) { return d.source.y; })
        .attr("x2", function (d) { return d.target.x; })
        .attr("y2", function (d) { return d.target.y; });
    node.attr("x", function (d) { return d.x - d.width / 2 + pad; })
        .attr("y", function (d) { return d.y - d.height / 2 + pad; });

    // group.attr("x", function (d) { return d.bounds.x; })
    //      .attr("y", function (d) { return d.bounds.y; })
    //     .attr("width", function (d) { return d.bounds.width(); })
    //     .attr("height", function (d) { return d.bounds.height(); });
    // label.attr("x", function (d) { return d.x; })
    //      .attr("y", function (d) {
    //          var h = this.getBBox().height;
    //          return d.y + h/4;
    //      });
});

        } catch (e) {
            console.error("%cerror", "background-color:firebrick; color:#eee;font-weight:bold;", e);
        }
        return this;
    },
    expandToFitParent : function(){
      var bb = this.el.getBBox();
      this.$el.attr("viewBox", "0 0 " + (bb.width + 10) + " " + (bb.height + 10));
    },
    renderLinks : function(){
      this.links = [];
      var parent = this;
      graphView.graph.links.map(function(link){
        var l = new Link(link).node;
        parent.links.push(l);
      });
    },
    instantiateParticipants: function() {
        var parent = this;
        this.model.get("interactions").at(0).get("participants").map(function(participant) {
            var newParticipant = new Participant(participant);
            parent.participants.push(newParticipant);
            graphView.addNode(newParticipant);
        });

    },
    updatePositions : function() {
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
