/* Setup Rounting For All Pages */
angular.module('gameOfLife')
    .config(function($stateProvider, $urlRouterProvider) {

        // Redirect any unmatched url
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('game', {
                url: '/',
                templateUrl: 'game/game.html',
                controller: 'GameController as gameController'
            });

    });