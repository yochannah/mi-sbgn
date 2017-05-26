function Graph() {
    this.graph = {
        nodes: [],
        links: [],
        nodeIndexLookup: {}

    };
    this.addNode = function(node) {
        this.graph.nodeIndexLookup[node.model.cid] = this.graph.nodes.length;
        this.graph.nodes.push(node);
    };
    this.addLink = function(source, target) {
        var sourceindex = this.graph.nodeIndexLookup[source],
            targetindex = this.graph.nodeIndexLookup[target];
        this.graph.links.push({
            source: sourceindex,
            target: targetindex,
        });
        console.log("%cthis.graph.links", "border-bottom:chartreuse solid 3px;", this.graph.links, this.graph.nodeIndexLookup, this.graph.nodes);
    };
    this.addLinks = function(){
      this.graph.nodes.map(function(aNode) {
        aNode.addLinks();
      });
    }
}
