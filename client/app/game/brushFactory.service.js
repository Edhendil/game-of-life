function BrushFactory(Brush, arrayUtils) {

    return {
        square: function() {
            var brush = new Brush(11);
            brush.pattern[5][5] = true;
            return brush;
        },
        eraser: function() {
            var brush = new Brush(11);
            brush.pattern[5][5] = false;
            return brush;
        },
        cross: function() {
            var brush = new Brush(11);
            brush.pattern[5][4] = true;
            brush.pattern[4][5] = true;
            brush.pattern[5][5] = true;
            brush.pattern[6][5] = true;
            brush.pattern[5][6] = true;
            return brush;
        },
        missile: function() {
            var brush = new Brush(11);
            brush.pattern[6][6] = true;
            brush.pattern[6][5] = true;
            brush.pattern[6][4] = true;
            brush.pattern[5][4] = true;
            brush.pattern[4][5] = true;
            return brush;
        },
        custom: function() {
            return new Brush(11);
        }
    };

}

angular.module('gameOfLife')
    .factory('brushFactory', BrushFactory);