export default function Title() {
    Backbone.View.extend({
    initialize: function() {
        this.render();
        this.listenTo(this.model, "change", this.render);
    },
    render: function() {
        var ids = this.model.get("interactions").models[0].get("identifiers"),
            title;
        ids.map(function(id) {
            //this might be a little fragile. Will they all have Intact IDs? haha.
            if (id.db === "intact") {
                title = id.id;
            }
        });
        this.$el.html(title);
    }
})
};
