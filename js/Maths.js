import doLineSegmentsIntersect from './external/line-segments-intersect.js';

//I wanted to call this file math, but that's already a thing in JS.
export default function Maths(){
    /**getting the correct location for translated elements is a nightmare (but a
     necessary one, because we want to use <g> tags to group our elements and the
     only way to locate a <g> correctly is.... translate! Thankfully, this SO person
     is Good People: https://stackoverflow.com/questions/26049488/how-to-get-absolute-coordinates-of-object-inside-a-g-group
    **/
    var intersection = function(lines) {
        return doLineSegmentsIntersect(lines.box.start, lines.box.end, lines.link.start, lines.link.end);
    }
    var boxLineIntersection = function(rectangle, line, previousLine, prevlinecoord) {
        //maths here to deconstruct the box into 4 lines and see if any of them
        //intersect with the box. Return which line and the coords.
        var box = rectangle.node.getBBox();
        box.center = {
            x: rectangle.getCenterX(),
            y: rectangle.getCenterY()
        }

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
        for (var lineorientation in lines) {
            var intersects = intersection({
                box: lines[lineorientation],
                link: {
                    start: line.source,
                    end: line.target
                }
            });
            //debugger;
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
                    y: box.y + box.height + 4
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
            case "previous":
                newEndpoint = {
                    x: previousLine.getAttribute("x" + prevlinecoord),
                    y: previousLine.getAttribute("y" + prevlinecoord)
                }
                console.log("%cnewEndpoint", "color:turquoise;font-weight:bold;", newEndpoint);
                break;

            default:
                newEndpoint = {
                    x: box.center.x,
                    y: box.center.y
                }
        }

        return newEndpoint;
    }
    var lineEnds = function (box1, box2) {
      //takes bbox for each of two boxes
      //get minx, maxx, miny, maxy for the box corners.
      //determine which sides overlap, if any.

      //3 cases:
      ////1: No overlapping side. two closest xy corner pairs become the ends. Easiest. Return these pairs.
      ////2: the Y coords overlap. This means the lines will be on the two closest X coords.
      ////3: the X coords overlap. Flip case of 2. This means the lines will be on the two closest Y coords.

      //Cases 2 & 3 require some more calculations but are reverse of each other.
      //Case 2: the X of both lines are known, we need to calculate where the Y is. To do this:
      //calculate the length: Take the min overlapping y and its closest y, and subtract one from the other. The absolute value of this is the length of overlap
      //calculate the actual join locations: length/2 gives us the midpoint in the overlap. Add this number to the min Y of each of the two lines. Voila! I think this is the algorithm we want

    }
    return { boxLineIntersection: boxLineIntersection};
};
