angular.module('game', [])
    .factory('game', function ($firebaseObject, $rootScope, boardFactory, player) {
        // defaults
        var computer_first = false;
        var grid = 3;

        // players
        var me,current_player
        player.init().then(function (data) {
            console.log("Current Player" + current_player)
            me = data
            current_player= data
        });


        //function computer_move() {
        //    var next_move = boardFactory.compute_next_move();
        //    if (typeof next_move === "undefined") {
        //        tie = true;
        //    } else {
        //        boardFactory.move(next_move, current_player);
        //        current_player = !current_player;
        //    }
        //}

        // results
        var winner = null;
        var tie = false;
        var winning_combo = [];
        return {
            start: function (grid, computer_first) {
                grid = grid;
                computer_first = computer_first;
                winner = null;
                tie = false;
                winning_combo = [];
                if (computer_first) {
                    current_player = computer_player;
                    computer_move();
                }
            },
            move: function (index) {
                if (boardFactory.canMove(index)) {
                    boardFactory.move(index);
                }
            },
            checkWinner: function () {
                return checkWinner();
            }

        }
    });