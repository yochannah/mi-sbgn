
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

StateVariable.prototype.toXML = function(){
    var parent = this;
    console.log(parent.rect.y, parent.rect);
    return jstoxml.toXML({
        _name: 'glyph',
        _attrs: {
            id: parent.rect.id,
            class: "state variable"
        },
        _content: [{
            _name: "state",
            _attrs: {
                "value": parent.info
            }
        },
        {
            _name: "bbox",
            _attrs: {
                y: parent.rect.y.baseVal.value.toFixed(0),
                x: parent.rect.x.baseVal.value.toFixed(0),
                w: parent.rect.width.baseVal.value.toFixed(0),
                h: parent.rect.height.baseVal.value.toFixed(0)
            }
        }
        ]

    });;

}
