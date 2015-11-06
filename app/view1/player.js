angular.module('player', [])
    .factory('player', function () {

        var Player = function(symbol, is_computer,number){
            symbol = symbol || "x";
            is_computer = is_computer || false;

            this.symbol = symbol;
            this.is_computer = is_computer;
            this.number = number;
        }


        return {
            init: function (symbol, is_computer,number) {
                symbol = symbol || "x";
                is_computer = is_computer || false;
                return new Player(symbol,is_computer,number)
            }
        }})
