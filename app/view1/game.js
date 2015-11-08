angular.module('game', [])
    .factory('game', function ($firebaseObject, $rootScope, boardFactory, player) {
        // defaults
        var computer_first = false;
        var current_player;
        var grid = 3;
        var manual_player
        // players
        player.init().then(function(dataPlayer){
            manual_player = dataPlayer;
            current_player = manual_player
            console.log(dataPlayer)
        });

        function checkWinner() {
            var winner = boardFactory.checkWinner();
            if (typeof winner !== "undefined") {
                if (winner == manual_player.number) {
                    $rootScope.$emit("game:win", manual_player);
                } else {
                    $rootScope.$emit("game:loose", manual_player);
                }
            }
        }

        function computer_move() {
            var next_move = boardFactory.compute_next_move();
            if (typeof next_move === "undefined") {
                tie = true;
            } else {
                boardFactory.move(next_move, current_player);
                current_player =  manual_player ;
            }
        }

        // results
        var winner = null;
        var tie = false;
        var winning_combo = [];
        return {
            start: function (grid, computer_first) {
                grid = grid;
                computer_first = computer_first;
                current_player = manual_player;
                winner = null;
                tie = false;
                winning_combo = [];

            },
            move: function (index) {
                if (boardFactory.canMove(index)) {
                    boardFactory.move(index, current_player);
                    current_player = current_player;
                    winner = checkWinner();
                    if (winner == null) {
                        if ((winner == null) && ( boardFactory.isFull())) {
                            $rootScope.$emit("game:tie");
                            tie = true;
                        }
                    }
                }
            },
            checkWinner: function () {
                return checkWinner();
            }

        }
    });