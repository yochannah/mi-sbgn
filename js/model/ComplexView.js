import Participant from './Participant';
import Layout from './../Layout';

var ComplexView = Backbone.View.extend({
    className: "sbgnContainer",
    initialize: function (x) {
        this.interactors = this.model.attributes.interactors.models;
        this.participants = [];
        this.graphView = x.graphView;
        this.render();
        this.listenTo(this.model, "change", this.render);
     },

    empty: function () {
        this.$el.html("");
        this.node = null;
    },
    render: function () {

        try {
            //first we create all the elements, but we don't know
            //their layout.
            this.instantiateParticipants();
            this.graphView.addLinks();
            this.layout = new Layout(this.el, this.graphView);

        } catch (e) {
            console.error("%cerror--", "background-color:firebrick; color:#eee;font-weight:bold;", e);
        }
        return this;
    },
    instantiateParticipants: function () {
        var parent = this;
        this.model.get("interactions").at(0).get("participants").map(function (participant) {
            var newParticipant = new Participant(participant, parent.graphView);
            parent.participants.push(newParticipant);
        });
        this.participants.map(function (participant) {
            participant.addGroup();
        });
    },
    generateParticipantXML: function () {
        var parent = this,
        participantXML = [];

        parent.participants.map(function (participant) {
            participantXML.push(participant.toXML());
        });

        return participantXML;

    },
    generateLinkXML: function () {
        var parent = this,
        linkXML = [];
        parent.graphView.graph.links.map(function (link) {
            linkXML.push(link.toXML());
        });

        return linkXML;

    },
    toXML: function () {
        var participantXML = this.generateParticipantXML(),
            linkXML = this.generateLinkXML();
        return jstoxml.toXML({
            _name: 'sbgn',
            _content: {
                _attrs: {
                    language: "entity relationship"
                },
                _content: participantXML.concat(linkXML),
                _name: "map"
            },
            _attrs: {
                xmlns: 'http://sbgn.org/libsbgn/0.2'
            }
        }, {
            header: true
        });
    }

});

export default ComplexView;