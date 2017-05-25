var styles = {
  textSize: 5,
  corners: 5,
  leftOffset : 2,
  padding : 2
}, uoiTypes = {
  protein : "mt:prot",
  binding : "ct:bind"
};

//This is syntactic sugar.
var setAttr = function(elem, x, y) {
  elem.setAttributeNS(null, x, y);
}, createElem = function(elemName) {
  return document.createElementNS("http://www.w3.org/2000/svg",elemName);
}


var interaction;
document.addEventListener("DOMContentLoaded", function(event) {
    $.get({
        dataType: "json",
        url: "http://www.ebi.ac.uk/intact/complex-ws/export/EBI-10828997"
    }, function(data) {

        new MIModel(data).load().then(function(model) {

          function UnitOfInformation(info){
            this.info = uoiTypes[info];
            this.node = createElem("g");
            setAttr(this.node,"transform","translate(0,3)")
            var text = createElem("text")
            text.appendChild(document.createTextNode(this.info));
            var rect = createElem("rect");

            setAttr(rect,"width",30);
            setAttr(rect,"height",10);
            this.node.appendChild(rect);


            setAttr(text,"x",styles.leftOffset);
            setAttr(text,"y","6");
            setAttr(text,"font-size",  styles.textSize);
            this.node.appendChild(text);
          }
          UnitOfInformation.prototype.updateOutlines = function(parentBB){
            console.log("%cparentBB.height","color:darkseagreen;font-weight:bold;", parentBB.height);
            var top = parentBB.height - 8;
//            var top = 20;
            setAttr(this.node, "transform", "translate(0," + top + ")");
          }

          function StateVariable(info){
            this.info = info;
            this.node = createElem("g");
            setAttr(this.node,"transform","translate(0,-15)")
            var text = createElem("text")
            text.appendChild(document.createTextNode(this.info));
            var rect = createElem("rect");

            setAttr(rect,"strokeWidth",1);
            setAttr(rect,"width",30);
            setAttr(rect,"rx",5);
            setAttr(rect,"ry",5);
            setAttr(rect,"height",10);
            this.node.appendChild(rect);


            setAttr(text,"x",styles.leftOffset*2);
            setAttr(text,"y","6");
            setAttr(text,"font-size", styles.textSize);
            this.node.appendChild(text);
// TODO: Calc after render. Here it returns 0.
//              this.textSize = text.getBBox();
// setAttr(rect,"width",this.textSize.width);
// setAttr(rect,"height",this.textSize.height);
          }

          function BindingSite(model, count){
            this.model = model;
            this.count = count + 1;
            this.node = createElem("g");

            var loc = -45;
            if (count > 0) {
              loc = 45;
            }
            setAttr(this.node,"transform","translate(" + loc +",10)");
            var text = createElem("text")
            text.appendChild(document.createTextNode("binding region"));
            var rect = this.rect = createElem("rect");

            setAttr(rect,"strokeWidth",1);
            setAttr(rect,"width",45);
            setAttr(rect,"x",(styles.leftOffset * -3));
            setAttr(rect,"y",-10);
            setAttr(rect,"rx",1);
            setAttr(rect,"ry",1);


            setAttr(rect,"height",16);
            this.node.appendChild(rect);



            setAttr(text,"x",(styles.leftOffset * -2));
            setAttr(text,"y","0");
            setAttr(text,"font-size", styles.textSize);
            this.node.appendChild(text);
            this.node.appendChild(new UnitOfInformation("binding").node);
            this.node.appendChild(new StateVariable(model.get("pos")).node);
          return this;
          }

          BindingSite.prototype.updateOutlines = function(){
            bb = this.node.getBBox();
            setAttr(this.rect, "x", (bb.x - styles.padding));
            setAttr(this.rect, "width", (bb.width + (styles.padding *2)));
            console.log("%cthis.node","color:turquoise;font-weight:bold;",this.node);
            //height is pretty simple so we don't update it.
          }




            function Participant(model) {
              console.log("%cmodel","color:firebrick;font-weight:bold;",model);
              this.init(model);
              return this;
            }

            var location = 0; // temp var until we get positioning properly


            Participant.prototype.init = function(model) {
              this.model = model;
              this.node = createElem("g");
              this.interactor = this.model.get("interactor");
              this.initFeatures();
              this.initBindingSites();
              location = location + 35;
              setAttr(this.node,"x",10);
              setAttr(this.node,"y",location);

              this.node.rect = createElem("rect");
              this.node.append(this.node.rect);

              setAttr(this.node.rect,"rx",1);
              setAttr(this.node.rect,"ry",1);


              var text = createElem("text");
              var label = document.createTextNode(this.interactor.get("label"));
              text.appendChild(label);
              setAttr(text,"font-size", styles.textSize);

              this.node.appendChild(text);
              setAttr(this.node,"transform","translate(10," + location + ")");

              this.node.uoi = new UnitOfInformation(this.interactor.get("type").name);
              this.node.appendChild(this.node.uoi.node);

              if(this.bindingSites){
                var parent = this;
                parent.node.bindingSites = [];
                this.bindingSites.map(function(site, i){
                  var newSite = new BindingSite(site, i);
                  parent.node.bindingSites.push(newSite);
                  parent.node.appendChild(newSite.node);
                });
              }
            }

            Participant.prototype.updateOutlines = function(){
              console.log("updateme",this.node.getBBox(),this.node.uoi);

              var bb = this.node.getBBox();

              //update binding sites and uois
              this.node.bindingSites.map(function(site){
                site.updateOutlines();
              });

              bb = this.node.getBBox();

              setAttr(this.node.rect, "x", (bb.x - styles.padding));
              setAttr(this.node.rect, "y", (bb.y - styles.padding));
              setAttr(this.node.rect, "width", (bb.width + (styles.padding *2)));
              setAttr(this.node.rect, "height", (bb.height+ (styles.padding*2)));

              this.node.uoi.updateOutlines(bb);

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
                participants : [],
                initialize: function() {
                    this.render();
                    this.listenTo(this.model, "change", this.render);
                },
                render: function() {
                    var parent = this;
                    var mynode = createElem("rect");
                    mynode.setAttributeNS(null,"x",10);
                    mynode.setAttributeNS(null,"y",10);
                    mynode.setAttributeNS(null,"height",300);
                    this.el.appendChild(mynode);

                    try {
                    model.get("interactions").at(0).get("participants").map(function(participant){
                      var newParticipant = new Participant(participant);
                      parent.el.appendChild(newParticipant.node);
                      parent.participants.push(newParticipant);
                    });

                    parent.participants.map(function(participant) {
                      participant.updateOutlines();
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
