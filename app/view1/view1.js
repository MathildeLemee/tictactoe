'use strict';

angular.module('myApp.view1', ['ngRoute', 'boardFactory', 'game', 'player', 'firebase'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', function ($firebaseArray, $scope, boardFactory, game, grid_size, $rootScope) {
        $scope.grid = ['', '', '']// $firebaseArray(ref);
        $scope.status_message = "";
        $scope.computer_first = false;
        $scope.game_over = false;

        $scope.startGame = function () {
            $scope.status_message = "";
            $scope.game_over = false;
            game.start($scope.grid.length, $scope.computer_first);
            $scope.status_message = "game started";
            boardFactory.init($scope)
        }

        //
        //$rootScope.$on("game:tie", function () {
        //    console.log("tie")
        //    $scope.status_message = "tie! no one wins!";
        //    $scope.game_over = true;
        //})
        //
        //$rootScope.$on("game:win", function (event, player) {
        //    console.log(player)
        //    if (player.is_computer) {
        //        $scope.status_message = "you lose!";
        //    }
        //    else {
        //        $scope.status_message = "you win!";
        //    }
        //    console.log("win", player)
        //    $scope.game_over = true;
        //})
        $scope.makeMove = function (col, row) {
            console.log("MakeMove")
            var boardIndex, symbol, winner;
            boardIndex = (row * grid_size) + col;
            console.log(boardFactory.canMove(boardIndex))
            console.log($scope.game_over)
            if (boardFactory.canMove(boardIndex) && !$scope.game_over) {
                // make move
                game.move(boardIndex);
            }
        }

        var ref = new Firebase("https://tictactoedevoxx.firebaseio.com/messages");
        function refresh(){
            $scope.$apply();
        }
        $scope.messages = [];
        $scope.sendMess = function (mess) {
            $scope.messages.push(mess);
        }

        $scope.getSquareSymbol = function (col, row) {
            var boardIndex = (row * grid_size) + col;
            console.log(col, row)
            return boardFactory.renderSquare(boardIndex);
        }

    }).constant('grid_size', 3);
