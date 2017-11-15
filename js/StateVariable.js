
export default function StateVariable(info) {
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

StateVariable.prototype.toXML = function(parentTop){
    var parent = this;
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
                //using the parent.rect.y throws this massively off in Vanted viewer. 
                //Not sure if it's the fault of this code or vanted, but using
                //the parent element's y coord seems to fix it.
                y: parentTop,
                x: parent.rect.x.baseVal.value.toFixed(0),
                w: parent.rect.width.baseVal.value.toFixed(0),
                h: parent.rect.height.baseVal.value.toFixed(0)
            }
        }
        ]

    });;

}
