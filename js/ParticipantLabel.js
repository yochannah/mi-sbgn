function Label(textContent, parentId) {
  this.node = createElem("text");
  setAttr(this.node, "font-size", styles.textSize);
  this.width= styles.textSize * 3;
  this.height= styles.textSize * 2 ;

  this.node.appendChild(document.createTextNode(textContent));
  this.model = {cid: parentId + "-label"};

  return this;
}

Label.prototype.addLinks = function(){
  //not needed for labels. they have no links, kthx. they just float about in
  //their parents' box. Spongers.
}

Label.prototype.setLocation = function(x, y){
  //as above. We don't need to do anything, parent manages it.
      setAttr(this.node, "transform", "translate(" + this.x + "," + this.y +")");
}
