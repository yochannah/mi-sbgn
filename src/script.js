var styles = {
  textSize: "8", //I know, it's numbers in strings. Don't cry.
  corners: "5"
}, uoiTypes = {
  protein : "mt:prot"
};


var interaction;
document.addEventListener("DOMContentLoaded", function(event) {
    $.get({
        dataType: "json",
        url: "http://www.ebi.ac.uk/intact/complex-ws/export/EBI-10828997"
    }, function(data) {

        new MIModel(data).load().then(function(model) {

          function UnitOfInformation(info){
            this.info = uoiTypes[info];
            this.node = document.createElementNS("http://www.w3.org/2000/svg","g");
            var text = document.createElementNS("http://www.w3.org/2000/svg","text")
            text.appendChild(document.createTextNode(this.info));
            var rect = document.createElementNS("http://www.w3.org/2000/svg","rect");

            rect.setAttributeNS(null,"strokeWidth",1);
            rect.setAttributeNS(null,"width",30);
            rect.setAttributeNS(null,"height",10);
            this.node.appendChild(rect);


            text.setAttributeNS(null,"x","0");
            text.setAttributeNS(null,"y","6");
            text.setAttributeNS(null,"font-size",  styles.textSize);
            this.node.appendChild(text);
// TODO: Calc after render. Here it returns 0.
//              this.textSize = text.getBBox();
// rect.setAttributeNS(null,"width",this.textSize.width);
// rect.setAttributeNS(null,"height",this.textSize.height);
          }

          function StateVariable(info){
            this.info = info;
            this.node = document.createElementNS("http://www.w3.org/2000/svg","g");
            var text = document.createElementNS("http://www.w3.org/2000/svg","text")
            text.appendChild(document.createTextNode(this.info));
            var rect = document.createElementNS("http://www.w3.org/2000/svg","rect");

            rect.setAttributeNS(null,"strokeWidth",1);
            rect.setAttributeNS(null,"width",30);
            rect.setAttributeNS(null,"rx",5);
            rect.setAttributeNS(null,"ry",5);
            rect.setAttributeNS(null,"height",10);
            this.node.appendChild(rect);


            text.setAttributeNS(null,"x","0");
            text.setAttributeNS(null,"y","6");
            text.setAttributeNS(null,"font-size",  styles.textSize);
            this.node.appendChild(text);
// TODO: Calc after render. Here it returns 0.
//              this.textSize = text.getBBox();
// rect.setAttributeNS(null,"width",this.textSize.width);
// rect.setAttributeNS(null,"height",this.textSize.height);
          }


            function Interactor(model) {
            //  console.log("%cmodel","color:firebrick;font-weight:bold;",model);
              this.init(model);
              return this;
            }

            var location = 0; // temp var until we get positioning properly


            Interactor.prototype.init = function(model) {
              this.model = model;
              this.node = document.createElementNS("http://www.w3.org/2000/svg","g");

              location = location + 30;
              this.node.setAttributeNS(null,"x",10);
              this.node.setAttributeNS(null,"y",location);


              var text = document.createElementNS("http://www.w3.org/2000/svg","text");
              var label = document.createTextNode(model.attributes.label);
              text.appendChild(label);
              text.setAttributeNS(null,"font-size", styles.textSize);

            //  console.log("%cmodel.attributes","color:turquoise;font-weight:bold;",model.attributes);

              this.node.appendChild(text);
              this.node.setAttributeNS(null,"transform","translate(10," + location + ")");
              this.node.uoi = new UnitOfInformation(this.model.attributes.type.name);
              this.node.appendChild(this.node.uoi.node);
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
                    mynode.setAttributeNS(null,"height",300);
                    this.el.appendChild(mynode);

                    try {
                    this.interactors.map(function(interactor){
                      var inter = new Interactor(interactor);
                      parent.el.appendChild(inter.node);
                    });
                  } catch (e) {console.log("%ce","color:navajowhite;font-weight:bold;",e);}
                    return this;
                }

            });
            console.log("%cmodel","color:turquoise;font-weight:bold;",model);
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
