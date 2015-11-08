angular.module('player', [])
    .factory('player', function ($q) {

        var Player = function (symbol, is_computer, number) {
            symbol = symbol || "x";
            is_computer = is_computer || false;

            this.symbol = symbol;
            this.is_computer = is_computer;
            this.number = number;
        }


        return {
            init: function () {
                myProm = $q.defer();
                var ref = new Firebase("https://tictactoedevoxx.firebaseio.com/players");
                ref.once("value", function (snapshot) {
                    console.log("VALUE")
                    var nbChildren = snapshot.numChildren();
                    if (nbChildren % 2 == 0) {
                        var player = new Player("x", false, -1);
                        ref.push(player)
                        console.log("X")
                        myProm.resolve(player);
                    } else {
                        var player2 = new Player("o", false, 1);
                        ref.push(player2)
                        console.log("Y")
                        myProm.resolve(player2);
                    }
                })
                return myProm.promise;
            }
        }
    })
