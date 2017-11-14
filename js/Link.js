//It's dangeous to go alone! Take this! <=========(--o
//I may have spent far too long getting Link's sword just right.
function Link(source, target, indexes) {
  // d3 references the links by the index of the object it's linking to
  // hence why we store references both to the objets themselves 
  // and also and the indexes in the graph object.
  this.source = indexes.source;
  this.target = indexes.target;
  this.sourceObject = source;
  this.targetObject = target;
  this.id = source + "-" + target;
  this.coords = {};
  return this;
}

Link.prototype.toXML = function () {
  var parent = this;
  console.log(parent);
  return jstoxml.toXML({
    _name: 'arc',
    _attrs: {
      id : parent.id,
      class: "interaction",
      source: parent.sourceObject,
      target: parent.targetObject,
    },
     _content: [
       {
         _name: "start",
         _attrs: {
           "y": parent.coords.y1,
           "x": parent.coords.x1
         }
       },
       {
         _name: "end",
         _attrs: {
           "y": parent.coords.y2,
           "x": parent.coords.x2
         }
       }
    ]
    // {
    //   _name: "bbox",
    //   _attrs: graphView.boundsToSBGNCoords(parent.bounds)
    // },
    // parent.uoi.toXML(),
    // parent.position.toXML(parent.bounds.y)
    // ]

  });

}

Link.prototype.equals = function(link) {
  return (((this.link.target === link.link.target) && (this.link.source === link.link.source)) || ((this.link.target === link.link.source) && (this.link.source === link.link.target)))
}
