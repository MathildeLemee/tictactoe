'use strict';
angular.module('boardFactory', [])
    .factory('boardFactory', function ($firebaseObject, $rootScope, player) {
        var grid = 3;
        var X = 1;
        var O = -1;
        var ref = new Firebase("https://tictactoedevoxx.firebaseio.com/board");
        var winning_combos = calculateWinningCombos();

function isFull(){
        for (var i = 0; i < grid * grid; i++) {
            console.log(board[i] + " " + i)
            if (!board[i]) {
                return false;
            }
        }
        return true;
}
        function checkWinner() {
            console.log("CHECK WINNER")
            var j, x, o, k;
            var hasWin = false;
            console.log(winning_combos)
            for (var combo in winning_combos) {
                console.log(combo
                )
                j = x = o = grid;
                while (j--) {
                    k = winning_combos[combo][j];
                    console.log(k)
                    if (board[k] > 0) x--;
                    if (board[k] < 0) o--;
                }
                if (!x) {
                    winning_combo = winning_combos[combo];
                    console.log("X WIN")
                    hasWin=true
                    if (X == player.get().number) {
                        $rootScope.$emit("game:win");
                    } else {
                        $rootScope.$emit("game:loose");
                    }
                }
                if (!o) {
                    winning_combo = winning_combos[combo];
                    hasWin=true
                    if (O == player.get().number) {
                        $rootScope.$emit("game:win");
                    } else {
                        $rootScope.$emit("game:loose");
                    }
                    return O; // o won
                }
            }

            if (isFull()&&!hasWin){
                $rootScope.$emit("game:tie");
            }
        }

        var board = []
        ref.on("child_added", function (snapshot) {
            console.log(board[snapshot.key()])
            if (board[snapshot.key()] === undefined) {
                board[snapshot.key()] = snapshot.val();
                console.log(board)
                $rootScope.$apply();
            }
            checkWinner();
        })
        var winning_combo


        function calculateWinningCombos() {
            var combos = [];
            for (var i = 0, c = [], d = []; i < grid; i++) {
                for (var j = 0, a = [], b = []; j < grid; j++) {
                    a.push(i * grid + j);
                    b.push(j * grid + i);
                }
                combos.push(a, b);
                c.push(i * grid + i);
                d.push((grid - i - 1) * grid + i);
            }
            combos.push(c, d);
            console.log(combos)
            return combos;
        }

        function negamaxSearch(depth, player, alpha, beta) {
            var size = 100;
            var intelligence = 6;
            var undef;
            var i = grid * grid, min = -size, max, value, next;
            //if (value = checkWinner(depth)) // either player won
            //    return value * player;
            if (intelligence > depth) { // recursion cutoff
                while (i--) {
                    if (!board[i]) {
                        board[i] = player;
                        value = -negamaxSearch(depth + 1, -player, -beta, -alpha);
                        board[i] = undef;
                        if (max === undef || value > max) max = value;
                        if (value > alpha) alpha = value;
                        if (alpha >= beta) return alpha; // prune branch
                        if (max > min) {
                            min = max;
                            next = i;
                        } // best odds for next move
                    }
                }
            }
            return depth ? max || 0 : next; // 0 is tie game
        }

        return {
            init: function ($scope) {
                var ref = new Firebase("https://tictactoedevoxx.firebaseio.com/board");
                //board = []// $firebaseObject(ref);
            },



            checkWinner: function () {
                return checkWinner();
            },

            move: function (index) {
                console.log(board[index])
                if (typeof board[index] === "undefined") {
                    board[index] = player.get().symbol === 'x' ? X : O;
                    ref.child(index).set(board[index]);
                }


            },

            canMove: function (index) {
                return typeof board[index] === "undefined";
            },

            compute_next_move: function () {
                return negamaxSearch(0, 1, -100, 100);
            },

            renderSquare: function (index) {
                var square_symbol = "";
                if (board[index]) {
                    square_symbol = board[index] === X ? "x" : "o";
                }
                return square_symbol;
            }

            // negamax search with alpha-beta pruning
            // http://en.wikipedia.org/wiki/Negamax
            // http://en.wikipedia.org/wiki/Alpha-beta_pruning

        }

    })