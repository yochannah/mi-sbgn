function BindingSite(model, count) {
    this.model = model;
    this.count = count + 1;
    this.node = createElem("g");

    graphView.addNode(this);

    var loc = -45;
    if (count > 0) {
        loc = 45;
    }
    setAttr(this.node, "transform", "translate(" + loc + ",10)");
    var text = createElem("text")
    text.appendChild(document.createTextNode("binding region"));
    var rect = this.rect = createElem("rect");

    setAttr(rect, "width", 1.5 * styles.infoWidth);
    setAttr(rect, "x", (styles.leftOffset * -3));
    setAttr(rect, "y", -2 * styles.textSize);
    setAttr(rect, "rx", 1);
    setAttr(rect, "ry", 1);
    setAttr(rect, "height", styles.textSize * 3);
    this.node.appendChild(rect);

    setAttr(text, "x", (styles.leftOffset * -2));
    setAttr(text, "y", "-1");
    setAttr(text, "font-size", styles.textSize);
    this.node.appendChild(text);
    this.node.appendChild(new UnitOfInformation("binding").node);
    this.node.appendChild(new StateVariable(model.get("pos")).node);
    return this;
}

BindingSite.prototype.updateOutlines = function() {
    bb = this.node.getBBox();
    setAttr(this.rect, "x", (bb.x - styles.padding));
    setAttr(this.rect, "width", (bb.width + (styles.padding * 2)));
    //height is pretty simple so we don't update it.
}

BindingSite.prototype.addLinks = function() {
  //find links and add them.
  var links = this.model.get("feature").get("linkedFeatures"),
      parent = this;
  links.models.map(function(linkedFeature) {
      var bindingRegions = linkedFeature.get("sequenceData");
      bindingRegions.map(function(region) {
          console.log("%cregion", "color:turquoise;font-weight:bold;", region, region.cid);
          graphView.addLink(parent.model.cid, region.cid);
      });
      console.log("%clinkedFeature parent%s child %s ", "color:goldenrod;font-weight:bold;", parent.model.cid, linkedFeature.cid, bindingRegions);
      //graphView.addLink(parent.model.cid,linkedFeature.cid);
  });
}
