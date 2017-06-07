function Graph() {
    this.graph = {
        nodes: [],
        links: [],
        nodeIndexLookup: {},
        groups : []
    };
    this.addNode = function(node) {
      // adds a node and stores a reference to each node in a lookup table, since
      // cola (the layout library)
      // runs based on index of nodes rather than ids.
        this.graph.nodeIndexLookup[node.model.cid] = this.graph.nodes.length;
        this.graph.nodes.push(node);
    };
    this.addLink = function(source, target) {
      //adds a single link. Please provide the cid of each model as source/target.
        var sourceindex = this.graph.nodeIndexLookup[source],
            targetindex = this.graph.nodeIndexLookup[target];
        this.graph.links.push({
            source: sourceindex,
            target: targetindex,
        });
    };

    this.updateNodeSizes = function(){
      this.graph.nodes.map(function(node) {
        var bb = node.node.getBBox();
        node.width = bb.width,
        node.height = bb.height;
      })
    }

    this.addGroup = function(group, parentCid){
      var g = {leaves : [] }
      parent = this;
      group.map(function(groupMember){
        g.leaves.push(parent.graph.nodeIndexLookup[groupMember.cid]);
      });
      if(parentCid) {
        g.groups = [this.graph.nodeIndexLookup[parentCid]];
      }
      this.graph.groups.push(g);
    };
    this.addLinks = function(){
      //Adds all links for nodes. This needs to be run after all nodes have been created.
      this.graph.nodes.map(function(aNode) {
        aNode.addLinks();
      });
    }
}
