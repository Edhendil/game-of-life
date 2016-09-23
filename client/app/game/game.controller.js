function GameController($scope, $interval, gameStateFactory, canvasService, RuleSet, frameRateService, brushFactory) {

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