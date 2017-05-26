
function StateVariable(info) {
    this.info = info;
    this.node = createElem("g");
    setAttr(this.node, "transform", "translate(0," + (-2 * (styles.textSize + styles.padding)) + ")")
    var text = createElem("text")
    text.appendChild(document.createTextNode(this.info));
    var rect = createElem("rect");

    setAttr(rect, "width", styles.infoWidth);
    setAttr(rect, "rx", 5);
    setAttr(rect, "ry", 5);
    setAttr(rect, "height", styles.textSize + 2);
    this.node.appendChild(rect);


    setAttr(text, "x", styles.leftOffset * 2);
    setAttr(text, "y", "5");
    setAttr(text, "font-size", styles.textSize);
    this.node.appendChild(text);
}
