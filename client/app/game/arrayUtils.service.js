function ArrayUtils() {

    return {

        makeArray: function(w, h, val) {
            var arr = [];
            var i, j;
            for (i = 0; i < w; i++) {
                arr[i] = [];
                for (j = 0; j < h; j++) {
                    arr[i][j] = val;
                }
            }
            return arr;
        },

        makeArray1: function(size, value) {
            var arr = [];
            var i;
            for (i = 0; i < size; i++) {
                arr[i] = value;
            }
            return arr;
        }

    };

}

angular.module('gameOfLife')
    .factory('arrayUtils', ArrayUtils);