var count = 0;
function Label(textContent, parentId) {
  count++;
  this.width= 100 + 2*styles.padding;
  this.height= 20 + 2*styles.padding;

  this.model = {cid: parentId + "-label-" + count};
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
