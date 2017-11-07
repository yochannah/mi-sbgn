var ComplexView = Backbone.View.extend({
    className: "sbgnContainer",
    initialize: function () {
        this.interactors = this.model.attributes.interactors.models;
        this.participants = [];
        this.render();
        this.listenTo(this.model, "change", this.render);
    },

    empty: function () {
        this.$el.html("");
        this.node = null;
    },
    toXML: function () {
        var parent = this;
        return jstoxml.toXML({
            _name: 'sbgn',
            _content: {
                _attrs: {
                    language: "entity relationship"
                },
                _content: function () {
                    var participantXML = [];

                    parent.participants.map(function (participant) {
                        participantXML.push(participant.toXML());
                    });

                    return participantXML;
                },
                _name: "map"
            },
            _attrs: {
                xmlns: 'http://sbgn.org/libsbgn/0.2'
            }
        }, {
            header: true
        });
    },
    render: function () {

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

    renderLinks: function () {
        this.links = [];
        var parent = this;
        graphView.graph.links.map(function (link) {
            var l = new Link(link).node;
            parent.links.push(l);
        });
    },
    instantiateParticipants: function () {
        var parent = this;
        this.model.get("interactions").at(0).get("participants").map(function (participant) {
            var newParticipant = new Participant(participant);
            parent.participants.push(newParticipant);
            //  graphView.addNode(newParticipant);
        });
        this.participants.map(function (participant) {
            participant.addGroup();
        });
    }
});