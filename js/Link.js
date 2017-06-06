//It's dangeous to go alone! Take this! <=========(--o
//I may have spent far too long getting Link's sword just right.
function Link(link) {
    var center = {
            source: link.source.getCenter(),
            target: link.target.getCenter()
        },
        line = createElem("line");

    //using the old coords, calculate a line that doesn't overlap the box
    center.source = this.resolveEndpoint(link.source, center);
    center.target = this.resolveEndpoint(link.target, center);

    setAttr(line, "x1", center.source.x);
    setAttr(line, "y1", center.source.y);
    setAttr(line, "x2", center.target.x);
    setAttr(line, "y2", center.target.y);
    setAttr(line, "marker-end", "url(#Harpoon)");
    setAttr(line, "marker-end", "url(#Harpoon)");
    this.link = link;
    this.node = line;
    return this;
}

Link.prototype.resolveEndpoint = function(box,line) {
  return Maths.boxLineIntersection(box,line);
}
