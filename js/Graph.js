function Graph() {
    this.graph = {
        nodes: [],
        links: [],
        linkDeduplicationLookup: {},
        nodeIndexLookup: {},
        groups: []
    };
    this.addNode = function(node) {
        // adds a node and stores a reference to each node in a lookup table, since
        // cola (the layout library)
        // runs based on index of nodes rather than ids.
        this.graph.nodeIndexLookup[node.model.cid] = this.graph.nodes.length;
        this.graph.nodes.push(node);
    };
    this.addLinkIndex = function(link1, link2) {
        if (this.graph.linkDeduplicationLookup[link1]) {
            this.graph.linkDeduplicationLookup[link1].push(link2);
        } else {
            this.graph.linkDeduplicationLookup[link1] = [link2];
        }
    }
    this.addLinkIndexes = function(link1, link2) {
        this.addLinkIndex(link2, link1);
        this.addLinkIndex(link1, link2);
    }
    this.isDuplicate = function(link1, link2) {
        var l1isLinkedTol2, l2isLinkedTol1,
            l1 = this.graph.linkDeduplicationLookup[link1];
        l2 = this.graph.linkDeduplicationLookup[link2];
        if (l1) {
            l1isLinkedTol2 = (l1.indexOf(link2) !== -1);
        }
        if (l2) {
            l2isLinkedTol1 = (l2.indexOf(link1) !== -1);
        }
        return l1isLinkedTol2 || l2isLinkedTol1;
    }
    this.addLink = function(source, target) {
        //adds a single link. Please provide the cid of each model as source/target.
        var sourceindex = this.graph.nodeIndexLookup[source],
            targetindex = this.graph.nodeIndexLookup[target],
            duplicatelink = this.isDuplicate(sourceindex, targetindex);
        if (!duplicatelink) {
            this.addLinkIndexes(sourceindex, targetindex);
            this.graph.links.push({
                source: sourceindex,
                target: targetindex,
            });
        }
    };
    this.updateNodeSizes = function() {
        this.graph.nodes.map(function(node) {
            var bb = node.node.getBBox();
            node.width = bb.width,
                node.height = bb.height;
        })
    }

    this.addGroup = function(group, parentCid) {
        var g = {
            leaves: [],
            padding: 3,
            margin:6
        }
        parent = this;
        group.map(function(groupMember) {
          var identifier = groupMember.cid;
            g.leaves.push(parent.graph.nodeIndexLookup[identifier]);
        });
        this.graph.groups.push(g);
        return g;
    };
    this.addLinks = function() {
        //Adds all links for nodes. This needs to be run after all nodes have been created.
        this.graph.nodes.map(function(aNode) {
            aNode.addLinks();
        });
    }
}
