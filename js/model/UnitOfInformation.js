export default function UnitOfInformation(info) {
    var uoiTypes = {
        protein: "mt:prot",
        binding: "ct:bind"
    }
    this.info = uoiTypes[info];
}
UnitOfInformation.prototype.toXML = function(){
    var parent = this;
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
            _attrs: {
                y: (parent.rect.y.baseVal.value - parent.rect.height.baseVal.value),
                x: parent.rect.x.baseVal.value, 
                w: parent.rect.width.baseVal.value,
                h: parent.rect.height.baseVal.value}
        }
        ]
    });
}
