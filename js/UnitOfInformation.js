function UnitOfInformation(info) {
    this.info = uoiTypes[info];
}
UnitOfInformation.prototype.toXML = function(){
    var parent = this;
    console.log(parent.rect.y, parent.rect);
    return jstoxml.toXML({
        _name: 'glyph',
        _attrs: {
            id: parent.rect.id,
            class: "unit of information"
        },
        _content: [{
            _name: "label",
            _attrs: {
                "text": parent.info
            }
        },
        {
            _name: "bbox",
            _attrs: {y: parent.rect.y.baseVal.value,
                x: parent.rect.x.baseVal.value, 
                w: parent.rect.width.baseVal.value,
                h: parent.rect.height.baseVal.value}
        }
        ]

    });;
}
