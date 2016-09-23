//setup module and external dependencies
var app = angular.module('gameOfLife', [
    'ui.router',
    'templates'
]);

app.config(function($locationProvider) {
    $locationProvider.html5Mode(true);
});