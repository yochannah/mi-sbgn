function layout(nodeLocations, linkIds, groups) {
    //drawn from https://github.com/tgdwyer/WebCola/blob/893f1ae744f35b83c59451836065ef0d1897a688/WebCola/test/apitests.ts#L77
    let layout = new cola.Layout()
        .linkDistance(150)
        .avoidOverlaps(true) // force non-overlap
        .nodes(nodeLocations)
        .links(linkIds)
        .constraints([{
            gap: 10,
            top: 10,
            bottom: 10,
            offsets: [{
                    node: 0,
                    offset: 0
                },
                {
                    node: 1,
                    offset: 0
                },
            ]
        }]);
    layout.groups(groups);
    layout.start(); // first layout
    return layout;
}
