function Label(textContent, parentId) {
  this.width= 100;
  this.height= styles.textSize * 2 ;

  this.model = {cid: parentId + "-label"};
  this.cid = this.model.cid;
  this.name = textContent;

  return this;
}

Label.prototype.addLinks = function(){
  //not needed for labels. they have no links, kthx. they just float about in
  //their parents' box. Spongers.
}

Label.prototype.setLocation = function(x, y){
  //as above. We don't need to do anything, parent manages it.
}
