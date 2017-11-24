export var labelcount = 0;
export default function Label(textContent, parentId) {
  labelcount++;


  this.model = {cid: parentId + "-label-" + labelcount};
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
