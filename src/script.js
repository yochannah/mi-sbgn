var styles = {
  textSize: "5", //I know, it's numbers in strings. Don't cry.
  corners: "5",
  leftOffset : "2"
}, uoiTypes = {
  protein : "mt:prot",
  binding : "ct:bind"
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
            this.node.setAttributeNS(null,"transform","translate(0,3)")
            var text = document.createElementNS("http://www.w3.org/2000/svg","text")
            text.appendChild(document.createTextNode(this.info));
            var rect = document.createElementNS("http://www.w3.org/2000/svg","rect");

            rect.setAttributeNS(null,"strokeWidth",1);
            rect.setAttributeNS(null,"width",30);
            rect.setAttributeNS(null,"height",10);
            this.node.appendChild(rect);


            text.setAttributeNS(null,"x",styles.leftOffset);
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
            this.node.setAttributeNS(null,"transform","translate(0,-15)")
            var text = document.createElementNS("http://www.w3.org/2000/svg","text")
            text.appendChild(document.createTextNode(this.info));
            var rect = document.createElementNS("http://www.w3.org/2000/svg","rect");

            rect.setAttributeNS(null,"strokeWidth",1);
            rect.setAttributeNS(null,"width",30);
            rect.setAttributeNS(null,"rx",5);
            rect.setAttributeNS(null,"ry",5);
            rect.setAttributeNS(null,"height",10);
            this.node.appendChild(rect);


            text.setAttributeNS(null,"x",styles.leftOffset*2);
            text.setAttributeNS(null,"y","6");
            text.setAttributeNS(null,"font-size", styles.textSize);
            this.node.appendChild(text);
// TODO: Calc after render. Here it returns 0.
//              this.textSize = text.getBBox();
// rect.setAttributeNS(null,"width",this.textSize.width);
// rect.setAttributeNS(null,"height",this.textSize.height);
          }

          function BindingSite(model, count){
            this.model = model;
            this.count = count + 1;
            this.node = document.createElementNS("http://www.w3.org/2000/svg","g");
            var loc = -45;
            if (count > 0) {
              loc = 45;
            }
            this.node.setAttributeNS(null,"transform","translate(" + loc +",10)");
            var text = document.createElementNS("http://www.w3.org/2000/svg","text")
            text.appendChild(document.createTextNode("binding region"));
            var rect = document.createElementNS("http://www.w3.org/2000/svg","rect");

            rect.setAttributeNS(null,"strokeWidth",1);
            rect.setAttributeNS(null,"width",45);
            rect.setAttributeNS(null,"x",(styles.leftOffset * -3));
            rect.setAttributeNS(null,"y",-10);

            rect.setAttributeNS(null,"height",16);
            this.node.appendChild(rect);



            text.setAttributeNS(null,"x",(styles.leftOffset * -2));
            text.setAttributeNS(null,"y","0");
            text.setAttributeNS(null,"font-size", styles.textSize);
            this.node.appendChild(text);
            this.node.appendChild(new UnitOfInformation("binding").node);
            this.node.appendChild(new StateVariable(model.get("pos")).node);
// TODO: Calc after render. Here it returns 0.
//              this.textSize = text.getBBox();
// rect.setAttributeNS(null,"width",this.textSize.width);
// rect.setAttributeNS(null,"height",this.textSize.height);
          }




            function Participant(model) {
              console.log("%cmodel","color:firebrick;font-weight:bold;",model);
              this.init(model);
              return this;
            }

            var location = 0; // temp var until we get positioning properly


            Participant.prototype.init = function(model) {
              this.model = model;
              this.node = document.createElementNS("http://www.w3.org/2000/svg","g");
              this.interactor = this.model.get("interactor");
              this.initFeatures();
              this.initBindingSites();
              location = location + 30;
              this.node.setAttributeNS(null,"x",10);
              this.node.setAttributeNS(null,"y",location);


              var text = document.createElementNS("http://www.w3.org/2000/svg","text");
              var label = document.createTextNode(this.interactor.get("label"));
              text.appendChild(label);
              text.setAttributeNS(null,"font-size", styles.textSize);

              this.node.appendChild(text);
              this.node.setAttributeNS(null,"transform","translate(10," + location + ")");

              this.node.uoi = new UnitOfInformation(this.interactor.get("type").name);
              this.node.appendChild(this.node.uoi.node);

              if(this.bindingSites){
                var parent = this;
                this.bindingSites.map(function(site, i){
                  console.log("%csite","color:turquoise;font-weight:bold;",site, i);
                  parent.node.bindingSite = new BindingSite(site, i)
                  parent.node.appendChild(parent.node.bindingSite.node);
                });
              }
            }


            Participant.prototype.initFeatures = function(){
              this.features = this.model.get("features");
              if (this.features.length > 0) {
                this.features = this.features.models;
              } else {this.features = false;}
            }

            Participant.prototype.initBindingSites = function(){
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
                    model.get("interactions").at(0).get("participants").map(function(participant){
                      var newParticipant = new Participant(participant);
                      parent.el.appendChild(newParticipant.node);
                    });
                  } catch (e) {console.log("%ce","color:navajowhite;font-weight:bold;",e);}
                    return this;
                }

            });

            //  console.log("%cx","color:turquoise;font-weight:bold;",x);
              new ComplexView({
                  model: model,
                  el : document.getElementById('mi-sbgn')
              });

        });

        // MIModel(data) returns a Backbone model structure representing the JAMI JSON.

        // Optionally you can chain the .load() function which returns
        // a Promise to fetch sequence lengths from uniprot.

    });
});
