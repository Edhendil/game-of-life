function GameStateFactory(LifeState, arrayUtils) {
    return {
        createEmptyState: function(width, height) {
            return new LifeState(arrayUtils.makeArray(width + 2, height + 2, false), width, height);
        },
        createLineState: function(width, height) {
            var state = arrayUtils.makeArray(width + 2, height + 2, false);
            var i;

            for (i = 1; i < width + 1; i++) {
                state[i][i] = true;
            }
            // state[201][202] = true;
            return new LifeState(state, width, height);
        },
        createRandomState: function(width, height) {
            var state = LifeState.build(width, height);
            var i, j;
            for (i = 0; i < width; i++) {
                for (j = 0; j < height; j++) {
                    state.setField(i, j, Math.random() < 0.5);
                }
            }
            return state;
        }
    };
}

angular.module('gameOfLife')
    .factory('gameStateFactory', GameStateFactory);