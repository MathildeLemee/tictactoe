angular.module('game', [])
    .factory('game', function ($firebaseObject, $rootScope, boardFactory, player) {
        // defaults
        var computer_first = false;
        var grid = 3;

        // players
        var manual_player = player.init('o', false,-1);
        var computer_player = player.init('x', true,1);
        console.log(manual_player)
        console.log(computer_player)
        var current_player = manual_player;

        function checkWinner() {
            var winner = boardFactory.checkWinner();
            if (typeof winner !== "undefined") {
                if (winner == manual_player.number) {
                    $rootScope.$emit("game:win", manual_player);
                } else {
                    $rootScope.$emit("game:win", computer_player);
                }
            }
        }

        function computer_move() {
            var next_move = boardFactory.compute_next_move();
            if (typeof next_move === "undefined") {
                tie = true;
            } else {
                boardFactory.move(next_move, current_player);
                current_player = current_player.is_computer ? manual_player : computer_player;
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

                if (computer_first) {
                    current_player = computer_player;
                    computer_move();
                }
            },
            move: function (index) {
                if (boardFactory.canMove(index)) {
                    boardFactory.move(index, current_player);
                    current_player = current_player.is_computer ? manual_player : computer_player;
                    winner = checkWinner();
                    if (winner == null) {
                        if (current_player.is_computer) {
                            computer_move();
                        }
                        winner = checkWinner();
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