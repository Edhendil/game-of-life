!(function() { //setup module and external dependencies
var app = angular.module('gameOfLife', [
    'ui.router',
    'templates'
]);

app.config(["$locationProvider", function($locationProvider) {
    $locationProvider.html5Mode(true);
}]);
}());
!(function() { 
Brush.$inject = ["arrayUtils"];function Brush(arrayUtils) {

    function Brush(size) {
        this.size = size;
        this.pattern = arrayUtils.makeArray(size, size, null);
    }

    return Brush;

}

angular.module('gameOfLife')
    .factory('Brush', Brush);
}());
!(function() { 
LifeState.$inject = ["arrayUtils"];function LifeState(arrayUtils) {

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
}());
!(function() { 
RuleSet.$inject = ["arrayUtils"];function RuleSet(arrayUtils) {

    function RuleSet(survive, create) {
        this.survive = survive;
        this.create = create;
    }

    RuleSet.empty = function() {
        return new RuleSet(arrayUtils.makeArray1(10, false), arrayUtils.makeArray1(10, false));
    };

    RuleSet.parseText = function(rulesText) {
        var rules = RuleSet.empty();
        var rulePart = rules.survive;
        var i;
        for (i = 0; i < rulesText.length; i++) {
            var current = rulesText.charAt(i);
            if (current === '/') {
                rulePart = rules.create;
            } else {
                var parsedInt = parseInt(current);
                rulePart[parsedInt] = true;
            }
        }
        return rules;
    };

    return RuleSet;

}

angular.module('gameOfLife')
    .factory('RuleSet', RuleSet);
}());
!(function() { function ArrayUtils() {

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
}());
!(function() { 
BrushFactory.$inject = ["Brush", "arrayUtils"];function BrushFactory(Brush, arrayUtils) {

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
}());
!(function() { function CanvasService() {

    var canvasId = 'lifeStage';

    var canvas;
    var ctx;

    var offscreenCanvas;
    var offscreenCtx;

    function setBlack(data, x, y) {
        var index = (y * data.width + x) * 4;
        data.data[index] = 0;
        data.data[index + 1] = 0;
        data.data[index + 2] = 0;
        data.data[index + 3] = 255;
    }

    function setWhite(data, x, y) {
        var index = (y * data.width + x) * 4;
        data.data[index] = 255;
        data.data[index + 1] = 255;
        data.data[index + 2] = 255;
        data.data[index + 3] = 255;
    }

    return {
        init: function(width, height) {
            canvas = document.getElementById(canvasId);
            canvas.width = width;
            canvas.height = height;
            ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = false;
        },
        resize: function(width, height) {
            canvas.width = width;
            canvas.height = height;
        },
        updateCanvas: function(lifeState) {
            offscreenCanvas = $('<canvas>')
                .attr('width', lifeState.width)
                .attr('height', lifeState.height)[0];
            offscreenCtx = offscreenCanvas.getContext('2d');
            var imageData = offscreenCtx.createImageData(lifeState.width, lifeState.height);
            var i, j;
            for (i = 0; i < lifeState.width; i++) {
                for (j = 0; j < lifeState.height; j++) {
                    if (lifeState.getField(i, j)) {
                        setBlack(imageData, i, j);
                    } else {
                        setWhite(imageData, i, j);
                    }
                }
            }
            offscreenCtx.putImageData(imageData, 0, 0);
            ctx.scale(canvas.width / lifeState.width, canvas.height / lifeState.height);
            ctx.drawImage(offscreenCanvas, 0, 0);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
        },
        getMousePos: function(evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }
    };
}

angular.module('gameOfLife')
    .factory('canvasService', CanvasService);
}());
!(function() { function FrameRateService() {

    var frameCountLimit = 30;

    var frameEndTimes;

    return {
        reset: function() {
            frameEndTimes = [];
            var frameEndTime = new Date()
                .getTime();
            frameEndTimes.push(frameEndTime);
        },
        next: function() {
            var newEndTime = new Date()
                .getTime();
            frameEndTimes.push(newEndTime);
            if (frameEndTimes.length > frameCountLimit) {
                frameEndTimes.shift();
            }
            return Math.floor(1 / ((newEndTime - frameEndTimes[0]) / 1000) * frameEndTimes.length);
        }
    };

}

angular.module('gameOfLife')
    .factory('frameRateService', FrameRateService);
}());
!(function() { 
GameController.$inject = ["$scope", "$interval", "gameStateFactory", "canvasService", "RuleSet", "frameRateService", "brushFactory"];function GameController($scope, $interval, gameStateFactory, canvasService, RuleSet, frameRateService, brushFactory) {

    var self = this;

    var intervalId;

    var canvasWidth = 512;
    var canvasHeight = 512;

    var gameWidth = 256;
    var gameHeight = 256;

    self.selectedRules = null;

    self.tickerButtonText = 'Start';

    self.fps = 25;
    self.realFps = 0;

    self.brush = null;
    self.brushScale = 1;

    self.gameRunning = false;

    self.availableStates = {
        empty: gameStateFactory.createEmptyState,
        line: gameStateFactory.createLineState,
        random: gameStateFactory.createRandomState
    };
    self.availableRules = {
        conway: '23/3',
        seed: '/2',
        ameba: '1358/357',
        daynight: '34678/3678',
        longlife: '5/345',
        coral: '45678/3',
        '34': '34/34',
        diameba: '5678/35678',
        highlife: '23/36',
        replicator: '1357/1357',
        labirynth: '12345/3',
        cancer: '1/1',
        petals: '012345678/3',
        wolfram: '018/018',
        traycloth: '/234',
        coagulation: '235678/378',
        pseudolife: '238/357'
    };
    self.availableBrushes = {
        eraser: brushFactory.eraser,
        square: brushFactory.square,
        cross: brushFactory.cross,
        missile: brushFactory.missile,
        custom: brushFactory.custom
    };
    self.selectedRuleSet = 'conway';
    self.selectedBrush = 'custom';
    self.selectedState = 'empty';

    var gameState = null;

    init();

    function init() {
        gameState = gameStateFactory.createEmptyState(gameWidth, gameHeight);
        canvasService.init(canvasWidth, canvasHeight);
        canvasService.updateCanvas(gameState);
        setRulesByName('conway');
        self.brush = self.availableBrushes['custom']();
    }

    function setRulesByName(ruleSetName) {
        var textRules = self.availableRules[ruleSetName];
        var ruleSet = RuleSet.parseText(textRules);
        self.selectedRules = ruleSet;
    }

    self.handleFpsChange = function() {
        if (intervalId !== undefined) {
            stop();
            start(self.fps);
        }
    };

    self.loadRulePreset = function() {
        var ruleText = self.availableRules[self.selectedRuleSet];
        self.selectedRules = RuleSet.parseText(ruleText);
    };

    self.handleSetStateButton = function() {
        var factory = self.availableStates[self.selectedState];
        setLifeData(factory(gameWidth, gameHeight));
    };

    self.handleTickerButton = function() {
        if (intervalId !== undefined) {
            stop();
            self.tickerButtonText = 'Start';
        } else {
            start(self.fps);
            self.tickerButtonText = 'Stop';
        }
    };

    self.handleCanvasClick = function(e) {
        var pos = canvasService.getMousePos(e);
        canvasBrushPaint(pos);
    };

    self.handleCanvasMove = function(e) {
        if (e.which === 1) {
            var pos = canvasService.getMousePos(e);
            canvasBrushPaint(pos);
        }
    };

    function canvasBrushPaint(position) {
        var x = Math.floor(parseInt(position.x) * (gameWidth / canvasWidth));
        var y = Math.floor(parseInt(position.y) * (gameHeight / canvasHeight));
        paint(gameState, x, y, self.brush);
        canvasService.updateCanvas(gameState);
    }

    self.performStep = function() {
        gameState = gameState.updateLife(self.selectedRules);
        canvasService.updateCanvas(gameState);
    };

    self.changeBrush = function(event, x, y) {
        if (event.ctrlKey) {
            self.brush.pattern[x][y] = null;
        } else if (event.which === 3) {
            self.brush.pattern[x][y] = false;
        } else {
            self.brush.pattern[x][y] = true;
        }
    };

    self.brushMoveChange = function(event, x, y) {
        if (event.which === 1 || event.which === 3) {
            self.changeBrush(event, x, y);
        }
    };

    self.loadBrush = function() {
        self.brush = self.availableBrushes[self.selectedBrush]();
    };

    function start(fps) {
        frameRateService.reset();
        self.gameRunning = true;
        intervalId = $interval(step, 1000 / fps);
    }

    function stop() {
        if (angular.isDefined(intervalId)) {
            self.gameRunning = false;
            $interval.cancel(intervalId);
            intervalId = undefined;
        }
        self.realFps = 0;
    }

    function step() {
        setLifeData(gameState.updateLife(self.selectedRules));
        self.realFps = frameRateService.next();
    }

    function setLifeData(data) {
        gameState = data;
        canvasService.updateCanvas(data);
    }

    function paint(lifeState, x, y, brush) {
        var scaledSize = brush.size * self.brushScale;
        var baseX = x - Math.floor(scaledSize / 2);
        var baseY = y - Math.floor(scaledSize / 2);
        var i, j;
        for (i = 0; i < scaledSize; i++) {
            for (j = 0; j < scaledSize; j++) {
                var patternX = Math.floor(i / self.brushScale);
                var patternY = Math.floor(j / self.brushScale);
                var stateX = baseX + i;
                var stateY = baseY + j;
                if (stateX > -1 && stateX < lifeState.width && stateY > -1 && stateY < lifeState.height) {
                    if (brush.pattern[patternX][patternY] != null) {
                        lifeState.setField(stateX, stateY, brush.pattern[patternX][patternY]);
                    }
                }
            }
        }
    }

}

angular.module('gameOfLife')
    .controller('GameController', GameController);
}());
!(function() { /* Setup Rounting For All Pages */
angular.module('gameOfLife')
    .config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {

        // Redirect any unmatched url
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('game', {
                url: '/',
                templateUrl: 'game/game.html',
                controller: 'GameController as gameController'
            });

    }]);
}());
!(function() { 
GameStateFactory.$inject = ["LifeState", "arrayUtils"];function GameStateFactory(LifeState, arrayUtils) {
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
}());
!(function() { function rangeFilter() {
    return function(n) {
        var res = [];
        for (var i = 0; i < n; i++) {
            res.push(i);
        }
        return res;
    };
}

angular.module('gameOfLife')
    .filter('range', rangeFilter);
}());