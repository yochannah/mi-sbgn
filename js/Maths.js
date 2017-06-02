//I wanted to call this file math, but that's already a thing in JS.
var Maths = {
  /**getting the correct location for translated elements is a nightmare (but a
   necessary one, because we want to use <g> tags to group our elements and the
   only way to locate a <g> correctly is.... translate! Thankfully, this SO person
   is Good People: https://stackoverflow.com/questions/26049488/how-to-get-absolute-coordinates-of-object-inside-a-g-group
  **/
  makeAbsoluteContext: function (element) {
    return function(x,y) {
      var offset = document.getElementById(svgElementId).getBoundingClientRect();
      var matrix = element.getScreenCTM();
      return {
        x: (matrix.a * x) + (matrix.c * y) + matrix.e - offset.left,
        y: (matrix.b * x) + (matrix.d * y) + matrix.f - offset.top
      };
    };
  }


};
