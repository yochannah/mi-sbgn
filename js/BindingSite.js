function BindingSite(model, count) {
    this.model = model;
    this.name = "binding region";
    this.cid = this.model.cid;

    graphView.addNode(this);

    this.uoi = new UnitOfInformation("binding");
    this.position = new StateVariable(model.get("pos"));
    return this;
}

BindingSite.prototype.getCenterX = function() {
  var bb = this.node.getBBox();
  return bb.x + bb.width/2;
}

BindingSite.prototype.getCenterY = function() {
  var bb = this.node.getBBox();
  return bb.y + bb.height/2;
}

BindingSite.prototype.getArrowTarget = function(line, previousLine, prevlinecoord) {
//  console.log("%cline","color:turquoise;font-weight:bold;",line, r);
//console.log("%cpreviousLine","border-bottom:chartreuse solid 3px;",previousLine);
return Maths.boxLineIntersection(this,line, previousLine, prevlinecoord);
}

BindingSite.prototype.addLinks = function() {
  //find links and add them.
  var links = this.model.get("feature").get("linkedFeatures"),
      parent = this;
  links.models.map(function(linkedFeature) {
      var bindingRegions = linkedFeature.get("sequenceData");
      if (bindingRegions) {
      bindingRegions.map(function(region) {
          graphView.addLink(parent.model.cid, region.cid);
      });
    } else {
      console.error("%c something went wrong with the link for","color:orange;",this);
    }
  });
}

BindingSite.prototype.toXML = function() {
  return "<bbbb>";
}
