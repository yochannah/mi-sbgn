function BindingSite(model, count) {
    this.model = model;
    this.count = count + 1;
    this.node = createElem("g");

    graphView.addNode(this);

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
    this.uoi = new UnitOfInformation("binding");
    this.node.appendChild(this.uoi.node);
    this.node.appendChild(new StateVariable(model.get("pos")).node);
    return this;
}

BindingSite.prototype.updateOutlines = function() {
    var bb = this.node.getBBox();
    setAttr(this.rect, "x", (bb.x - styles.padding));
    setAttr(this.rect, "width", (bb.width + (styles.padding * 2)));
    //height is pretty simple so we don't update it.
}

BindingSite.prototype.setLocation = function() {
    setAttr(this.node, "transform", "translate(" + this.x + "," + this.y +")");
}

BindingSite.prototype.getCenter = function() {
  var bb = this.node.getBBox(),
  center = {
    x : (bb.x + (bb.width/2)),
    y : (bb.y + (bb.height/2))
  },
  convert = Maths.makeAbsoluteContext(this.node);
  return convert(center.x, center.y);
}

BindingSite.prototype.getRealBBox = function() {
  var bb = this.node.getBBox(),
  realBB = {width : bb.width, height: bb.height},
  convert = Maths.makeAbsoluteContext(this.node),
  bbxy = convert(bb.x, bb.y);

  realBB.x = bbxy.x;
  realBB.y = bbxy.y;
  realBB.center = this.getCenter();
  return realBB;
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
      console.log("%cthis","color:turquoise;font-weight:bold;",this);
    }
  });
}
