function Participant(model) {
    this.init(model);
    return this;
}

Participant.prototype.setLocation = function(x, y) {
    setAttr(this.node, "transform", "translate(" + Math.round(x) + "," + Math.round(y) + ")");
}

Participant.prototype.addLinks = function() {
    var groupMembers = this.bindingSites.concat(this.label);
    graphView.addGroup(this.bindingSites, this.model.cid);
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

    this.label = new Label(this.interactor.get("label"));
    graphView.addNode(this.label, this.interactor.cid);

    this.node.appendChild(this.label.node);

    this.node.uoi = new UnitOfInformation(this.interactor.get("type").name);

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

    this.node.appendChild(this.node.uoi.node);
    this.node.uoi.updateOutlines(this.node.rect.getBBox());
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
            var id1 = parseInt(feature.get("linkedFeatures").models[0].get("id"), 10);
            var id2 = parseInt(feature.get("id"), 10);
            links = links.concat(feature.get("linkedFeatures").models);
        });
    }
}

Participant.prototype.initBindingSites = function() {
    var binding = [];
    if (this.features) {
        this.features.map(function(feature) {
            var seq = feature.get("sequenceData").models;
            if (seq) {
                binding = binding.concat(seq);
            } else {
                console.log("%cfeature", "color:turquoise;font-weight:bold;", feature);
            }
        });
        if (binding.length > 0) {
            this.bindingSites = binding;
        }
    }
}
