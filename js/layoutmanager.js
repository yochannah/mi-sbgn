function Layout(el) {
    try {
        var width = 960,
            height = 500;
        var c = cola.d3adaptor(d3)
            .linkDistance(100)
            .avoidOverlaps(true)
            .handleDisconnected(true)
            .size([width, height]);
        c.nodes(graphView.graph.nodes)
            .links(graphView.graph.links)
            .groups(graphView.graph.groups);
        c.start();

        var svg = d3.select(el);

        var group = svg.selectAll(".group")
            .data(graphView.graph.groups)
            .enter().append("rect")
            .attr("rx", 5).attr("ry", 5)
            .attr("class", "group")
            .call(c.drag);

        var link = svg.selectAll(".link")
            .data(graphView.graph.links)
            .enter().append("line")
            .attr("class", "link").call(c.drag);
        var pad = 3;

        var node = svg.selectAll(".node")
            .data(graphView.graph.nodes)
            .enter().append("rect")
            .attr("class", function(d) {
              console.log("%cd","color:turquoise;font-weight:bold;",d);
                return "node " + d.constructor.name + " " + d.cid;
            })
            .attr("width", function(d) {
                return d.width - 2 * pad;
            })

            .attr("height", function(d) {
                return d.height - 2 * pad;
            })

            .call(c.drag);



        var label = svg.selectAll(".label")
            .data(graphView.graph.nodes)
            .enter().append("text")
            .attr("class", "label")
            .text(function(d) {
                return d.name;
            })
            .call(c.drag);
            node.append("title")
            .text(function(d) {
                return d.name;
            });


        c.on("tick", function() {
            link.attr("x1", function(d) {
                    return d.source.x;
                })
                .attr("y1", function(d) {
                    return d.source.y;
                })
                .attr("x2", function(d) {
                    return d.target.x;
                })
                .attr("y2", function(d) {
                    return d.target.y;
                });

                label.attr("x", function(d) {
                //  console.log("%cthis.getBBox()","border-bottom:chartreuse solid 3px;",this,d);
                //      updateParent(this.getBBox());
                   d.height = this.getBBox().height;
                   d.width = this.getBBox().width;
                        return d.x;
                    })
                    .attr("y", function(d) {
                        var h = this.getBBox().height;
                        return d.y + h / 4;
                    });

                    node.attr("x", function(d) {
                            return d.x-pad ;
                        })
                        .attr("y", function(d) {
                          console.log("%cd","color:cornflowerblue;font-family:sans-serif;",d);
                            return d.y - pad*2 ;
                        })
                        .attr("width",function(d) {return d.width;})
                        .attr("height",function(d) {return d.height ;});
                        ;

                        group.attr("x", function(d) {
                                return d.bounds.x;
                            })
                            .attr("y", function(d) {
                                return d.bounds.y;
                            })
                            .attr("width", function(d) {
                                return d.bounds.width();
                            })
                            .attr("height", function(d) {
                                return d.bounds.height();
                            });


        });
    } catch (e) {
        console.log("%ce", "color:cornflowerblue;font-family:sans-serif;", e);
    }
    return this;
}

function updateParent() {

}
