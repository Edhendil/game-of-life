function Brush(arrayUtils) {

    function Brush(size) {
        this.size = size;
        this.pattern = arrayUtils.makeArray(size, size, null);
    }

    return Brush;

}

angular.module('gameOfLife')
    .factory('Brush', Brush);