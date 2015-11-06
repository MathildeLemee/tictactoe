angular.module('player', [])
    .factory('player', function ($q, $firebaseObject) {

        var me


        return {
            init: function (symbol, is_computer, number) {
                console.log("init")
                var initPromise = $q.defer()
                var ref = new Firebase("https://tictactoedevoxx.firebaseio.com");
                ref.child("waitingPlayers").once("value", function (snapshot) {
                    var nbChildren = snapshot.numChildren();
                    console.log(nbChildren)
                    if (nbChildren % 2== 0 ) {
                        var o = {id: Date.now(), symbol: "o", number: -1}
                        ref.child("waitingPlayers").push(o);
                        me = o
                        ref.child("board").remove();
                        initPromise.resolve(o);

                    } else {
                        var x = {id: Date.now(), symbol: "x", number: 1}
                        me = x
                        ref.child("waitingPlayers").push(x);
                        initPromise.resolve(x);
                    }

                })
                return initPromise.promise;

            }, get : function(){
                return me;
            }
        }
    })



//let's play :

//  }
//ref.child("waitingPlayers").limitToLast(1).once("value", function (snapshot) {
//    var nbChildren = snapshot.numChildren();
//    if (nbChildren == 0) {
//        var me = {id: Date.now()}
//        ref.child("waitingPlayers").push(me);
//    } else {
//        snapshot.forEach(function(snapshot){
//        ref.child("waitingPlayers/"+snapshot.key()).remove();
//        var others = snapshot.val()
//        others.symbol = "x";
//        others.number = -1;
//        var me = {id: Date.now(),symbol:"o",number:1}
//        ref.child("game/"+Date.now()).set({x:others,o:me});
//        })
//    }
//
//