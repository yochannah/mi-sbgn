function layout(nodeLocations, linkIds, groups) {
    //drawn from https://github.com/tgdwyer/WebCola/blob/893f1ae744f35b83c59451836065ef0d1897a688/WebCola/test/apitests.ts#L77
    let layout = new cola.Layout()
        .linkDistance(40)
        .avoidOverlaps(true) // force non-overlap
        .nodes(nodeLocations)
        .links(linkIds);
    layout.groups(groups);
    layout.start(); // first layout
    return layout;
}
