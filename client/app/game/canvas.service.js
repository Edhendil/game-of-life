function CanvasService() {

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