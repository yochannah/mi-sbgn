var interaction;
document.addEventListener("DOMContentLoaded", function(event) {
    $.get({
        dataType: "json",
        url: "http://www.ebi.ac.uk/intact/complex-ws/export/EBI-10828997"
    }, function(data) {

        new MIModel(data).load().then(function(model) {
          //  console.log("model", model);


            function Interactor(model) {
              console.log("%cmodel","color:firebrick;font-weight:bold;",model);
              this.init(model);
              return this;
            }
            var location = 0
            Interactor.prototype.init = function(model) {
              this.model = model;
              this.node = document.createElementNS("http://www.w3.org/2000/svg","text");
              this.node.setAttributeNS(null,"x",10);
              location = location + 30;
              this.node.setAttributeNS(null,"y",location);
              console.log("%cmodel.attributes","color:turquoise;font-weight:bold;",model.attributes);
              var label = document.createTextNode(model.attributes.label);
              this.node.appendChild(label);
            }



            var ComplexView = Backbone.View.extend({
                className: "sbgnContainer",
                interactors : model.attributes.interactors.models,
                initialize: function() {
                    this.render();
                    this.listenTo(this.model, "change", this.render);
                },
                render: function() {
                    var parent = this;
                    var mynode = document.createElementNS("http://www.w3.org/2000/svg","rect");
                    mynode.setAttributeNS(null,"x",10);
                    mynode.setAttributeNS(null,"y",10);
                    this.el.appendChild(mynode);

                    try {
                    this.interactors.map(function(interactor){
                      var inter = new Interactor(interactor);
                      parent.el.appendChild(inter.node);
                    });
                  } catch (e) {console.log("%ce","color:turquoise;font-weight:bold;",e);}
                    return this;
                }

            });

            model.attributes.interactions.models.map(function(x, y){
              new ComplexView({
                  model: model,
                  el : document.getElementById('mi-sbgn')
              });
            });
        });

        // MIModel(data) returns a Backbone model structure representing the JAMI JSON.

        // Optionally you can chain the .load() function which returns
        // a Promise to fetch sequence lengths from uniprot.

    });
});
