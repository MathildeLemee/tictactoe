'use strict';

angular.module('myApp.view1', ['ngRoute', 'boardFactory', 'game', 'player', 'firebase'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', function ($firebaseArray, $scope, boardFactory, game, grid_size, $rootScope,player) {
        var ref = new Firebase("https://tictactoedevoxx.firebaseio.com/grid");
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


        $rootScope.$on("game:tie", function () {
            console.log("tie")
            $scope.status_message = "tie! no one wins!";
            $scope.game_over = true;
        })

        $rootScope.$on("game:win", function (event, player) {
            $scope.status_message = "you win!";
            console.log("WIN")
            $scope.game_over = true;
        })
        $rootScope.$on("game:loose", function (event, player) {
            $scope.status_message = "you lose!";
            console.log("LOOSE")
            $scope.game_over = true;
        })

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
        $scope.messages = [];
        var ref = new Firebase("https://tictactoedevoxx.firebaseio.com/mess");
        ref.limitToLast(2).on("child_added",function(snapshot){
            $scope.messages.push(snapshot.val());
            $scope.$apply();
        })
        $scope.sendMessage = function(mess){
            mess.from = player.get().id;
            ref.push(mess)
        }
        $scope.getSquareSymbol = function (col, row) {
            var boardIndex = (row * grid_size) + col;
            return boardFactory.renderSquare(boardIndex);
        }

//$scope.isSquareInWinningCombo = function (col, row) {
//    var boardIndex;
//    if (game.board && game.winner && game.board.winning_combo) {
//        boardIndex = (row * grid_size) + col;
//        return game.board.winning_combo.indexOf(boardIndex) > -1;
//    }
//    return false;
//}
//        function refresh () {
//$scope.$
//        }
    }).


    constant('grid_size', 3);
