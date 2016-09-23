function LifeState(arrayUtils) {

    function LifeState(data, width, height) {
        this.lifeData = data;
        this.width = width;
        this.height = height;
    }

    LifeState.build = function(width, height) {
        var newLife = arrayUtils.makeArray(width + 2, height + 2, false);
        return new LifeState(newLife, width, height);
    };

    LifeState.prototype.updateLife = function(rules) {
        var newState = LifeState.build(this.width, this.height);
        var i, j;
        for (i = 0; i < this.width; i++) {
            for (j = 0; j < this.height; j++) {
                var neighbours = this.countNeighbours(i, j);
                var newValue;
                if (this.getField(i, j)) {
                    newValue = rules.survive[neighbours];
                } else {
                    newValue = rules.create[neighbours];
                }
                newState.setField(i, j, newValue);
            }
        }
        return newState;
    };

    LifeState.prototype.getField = function(x, y) {
        return this.lifeData[x + 1][y + 1];
    };

    LifeState.prototype.setField = function(x, y, value) {
        this.lifeData[x + 1][y + 1] = value;
    };

    LifeState.prototype.countNeighbours = function(x, y) {
        var counter = 0;
        x++;
        y++;
        if (this.lifeData[x - 1][y]) {
            counter++;
        }
        if (this.lifeData[x + 1][y]) {
            counter++;
        }
        if (this.lifeData[x][y - 1]) {
            counter++;
        }
        if (this.lifeData[x - 1][y - 1]) {
            counter++;
        }
        if (this.lifeData[x + 1][y - 1]) {
            counter++;
        }
        if (this.lifeData[x][y + 1]) {
            counter++;
        }
        if (this.lifeData[x - 1][y + 1]) {
            counter++;
        }
        if (this.lifeData[x + 1][y + 1]) {
            counter++;
        }
        return counter;
    };

    LifeState.prototype.countLive = function() {
        var i, j;
        var liveCount = 0;
        for (i = 0; i < this.width; i++) {
            for (j = 0; j < this.height; j++) {
                if (this.getField(i, j)) {
                    liveCount++;
                }
            }
        }
        return liveCount;
    };

    LifeState.prototype.countDead = function() {
        return this.count() - this.countLive();
    };

    LifeState.prototype.count = function() {
        return this.width * this.height;
    };

    return LifeState;

}

angular.module('gameOfLife')
    .factory('LifeState', LifeState);