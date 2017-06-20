function Layout(el) {
    try {
        var width = el.clientWidth,
            height = el.clientHeight;
        var c = cola.d3adaptor(d3)
            .linkDistance(200)
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
        var pad = styles.padding;

        var node = svg.selectAll(".node")
            .data(graphView.graph.nodes)
            .enter().append("rect")
            .attr("class", function(d) {
                return "node " + d.constructor.name + " " + d.cid;
            })
            .attr("width", function(d) {
                return d.width - 2 * pad;
            })

            .attr("height", function(d) {
                return d.height - 2 * pad;
            })

            .call(c.drag).on('mouseup', function (d) {
                d.fixed = 0;
                c.alpha(1); // fire it off again to satify gridify
            });



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
                    d.height = this.getBBox().height;
                    d.width = this.getBBox().width;
                    return d.x - d.width / 2 + pad;
                })
                .attr("y", function(d) {
                    var h = this.getBBox().height;
                    return d.y + h / 4 - pad;
                });

            node.attr("x", function(d) {
                    return d.x - d.width / 2 + pad;
                })
                .attr("y", function(d) {
                    return d.y - pad * 4;
                })
                .attr("width", function(d) {
                    return d.width;
                })
                .attr("height", function(d) {
                    return d.height;
                });;

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
