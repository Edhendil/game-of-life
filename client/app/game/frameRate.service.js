function FrameRateService() {

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