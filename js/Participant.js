function Participant(model) {
    this.init(model);
    return this;
}

Participant.prototype.setLocation = function(x, y) {
    setAttr(this.node, "transform", "translate(" + Math.round(x) + "," + Math.round(y) + ")");
    console.log("%cthis", "color:darkseagreen;font-weight:bold;", this.node);
}

Participant.prototype.addLinks = function() {
    //do nothing but also don't throw an error for not existing
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

    var text = createElem("text");
    var label = document.createTextNode(this.interactor.get("label"));
    text.appendChild(label);
    setAttr(text, "font-size", styles.textSize);

    this.node.appendChild(text);

    this.node.uoi = new UnitOfInformation(this.interactor.get("type").name);
    this.node.appendChild(this.node.uoi.node);

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

    this.node.uoi.updateOutlines(bb);

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
            binding = binding.concat(feature.get("sequenceData").models);
        });
        if (binding.length > 0) {
            this.bindingSites = binding;
        }
    }
}
