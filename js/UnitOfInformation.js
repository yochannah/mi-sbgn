function UnitOfInformation(info) {
    this.info = uoiTypes[info];
    this.node = createElem("g");
    setAttr(this.node, "transform", "translate(0,3)")
    var text = createElem("text")
    text.appendChild(document.createTextNode(this.info));
    var rect = createElem("rect");

    setAttr(rect, "width", styles.infoWidth);
    setAttr(rect, "height", styles.textSize + 2);
    this.node.appendChild(rect);


    setAttr(text, "x", styles.leftOffset);
    setAttr(text, "y", styles.textSize);
    setAttr(text, "font-size", styles.textSize);
    this.node.appendChild(text);
}
UnitOfInformation.prototype.updateOutlines = function(parentBB) {
    var position = (parentBB.height - Math.abs(parentBB.y) - styles.textSize + styles.padding);
    setAttr(this.node, "transform", "translate(0," + position + ")");
}
