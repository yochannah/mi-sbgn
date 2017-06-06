//I wanted to call this file math, but that's already a thing in JS.
var Maths = {
    /**getting the correct location for translated elements is a nightmare (but a
     necessary one, because we want to use <g> tags to group our elements and the
     only way to locate a <g> correctly is.... translate! Thankfully, this SO person
     is Good People: https://stackoverflow.com/questions/26049488/how-to-get-absolute-coordinates-of-object-inside-a-g-group
    **/
    makeAbsoluteContext: function(element) {
        return function(x, y) {
            var offset = document.getElementById(svgElementId).getBoundingClientRect();
            var matrix = element.getScreenCTM();
            return {
                x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
                y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
            };
        };
    },
    intersection: function(lines) {
        return doLineSegmentsIntersect(lines.box.start, lines.box.end, lines.link.start, lines.link.end);
    },
    boxLineIntersection: function(box, line) {
        //maths here to deconstruct the box into 4 lines and see if any of them
        //intersect with the box. Return which line and the coords.

        var box = box.getRealBBox();

        //note we could proceed straight to x and y coords of the lines but I feel
        //it's easier to read and understand by defining each corner with a name first.
        var corners = {
                topleft: {
                    x: box.x,
                    y: box.y
                },
                topright: {
                    x: box.x + box.width,
                    y: box.y
                },
                bottomleft: {
                    x: box.x,
                    y: box.y + box.height
                },
                bottomright: {
                    x: box.x + box.width,
                    y: box.y + box.height
                }
            },
            lines = {
                top: {
                    start: corners.topleft,
                    end: corners.topright
                },
                right: {
                    start: corners.topright,
                    end: corners.bottomright
                },
                bottom: {
                    start: corners.bottomleft,
                    end: corners.bottomright
                },
                left: {
                    start: corners.topleft,
                    end: corners.bottomleft
                }
            },
            overlapper = null,
            newEndpoint = {
                x: null,
                y: null
            }

        //it should overlap one of the four lines in the target box since we are
        //calculating from the center of the box
        for (lineorientation in lines) {
            var intersects = Maths.intersection({
                box: lines[lineorientation],
                link: {
                    start: line.source,
                    end: line.target
                }
            });
            if (intersects) {
                overlapper = lineorientation;
            }
        }

        //special case: the top and bottom of binding site boxes have ct:bind and
        //binding sites located on them. We don't want to draw arrows on top of the boxes.
        switch (overlapper) {
            case "top":
                newEndpoint = {
                    x: box.center.x,
                    y: box.y - 4
                }
                break;
            case "bottom":
                newEndpoint = {
                    x: box.center.x,
                    y: box.y + box.height - 1
                }
                break;
            case "left":
                newEndpoint = {
                    x: box.x,
                    y: box.center.y
                }
                break;
            case "right":
                newEndpoint = {
                    x: box.x + box.width,
                    y: box.center.y
                }
                break;
        }
        return newEndpoint;
    }
};
