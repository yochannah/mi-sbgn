function Participant(model) {
    this.init(model);
    return this;
}

Participant.prototype.addGroup = function () {
    var groupMembers = this.bindingSites.concat(this.label);
    this.group = graphView.addGroup(groupMembers, this.model.cid);
}

Participant.prototype.getBounds = function () {
    var parent = this;
    return {
        y: parent.group.bounds.y,
        x: parent.group.bounds.x,
        w: parent.group.bounds.X - parent.group.bounds.x,
        h: parent.group.bounds.Y - parent.group.bounds.y        
    }
}

Participant.prototype.toXML = function () {
    var parent = this;

    return jstoxml.toXML({
        _name: 'glyph',
        _attrs: {
            id: parent.model.cid,
            class: "entity"
        },
        _content: [
            {
            _name: "label",
            _attrs: {
                "text": parent.label.name
            }
        },
        {
            _name: "bbox",
            _attrs : parent.getBounds()
        }

    ]

    });
}

Participant.prototype.init = function (model) {
    this.model = model;
    this.node = {};
    this.interactor = this.model.get("interactor");
    this.initFeatures();
    this.initBindingSites();

    this.label = new Label(this.interactor.get("label"), this.interactor.cid);
    this.node.p = graphView;
    graphView.addNode(this.label, this.interactor.cid);

    this.node.uoi = new UnitOfInformation(this.interactor.get("type").name);

    if (this.bindingSites) {
        var parent = this;
        parent.node.bindingSites = [];
        this.bindingSites.map(function (site, i) {
            var newSite = new BindingSite(site, i);
            parent.node.bindingSites.push(newSite);
        });
    }
}

Participant.prototype.initFeatures = function () {
    this.features = this.model.get("features");
    if (this.features.length > 0) {
        this.features = this.features.models;
    } else {
        this.features = false;
    }
    if (this.features) {
        this.links = [];
        var links = [];
        this.features.map(function (feature) {
            var id1 = parseInt(feature.get("linkedFeatures").models[0].get("id"), 10);
            var id2 = parseInt(feature.get("id"), 10);
            links = links.concat(feature.get("linkedFeatures").models);
        });
    }
}

Participant.prototype.initBindingSites = function () {
    var binding = [];
    if (this.features) {
        this.features.map(function (feature) {
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