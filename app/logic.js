

var Module = (function(){

    // Private

    // Public

    return {

        help : function(){
            help.addEventListener("click", function(e){

                if (help.className != "helpToggle") {
                    for (var i = 0; i < wrap.length; i++) {
                        var p = document.createElement("p");
                        p.appendChild(document.createTextNode(niz[i]));
                        wrap[i].appendChild(p);
                    }
                    help.className = "helpToggle";
                }
                else
                {
                    help.className = "help";
                    $(".innerLines p").remove()
                }
            }, false);
        },

        // Create every note for each of the music lines(that includes ledger to)
        // Same algorithm is used as above for toggling element(or when second time is clicked on icon)
        // moreToLife/topLedgerNotes/bottomLedger values == map, where notes will be appended.

        ledger : function() {
            ledger.addEventListener("click", function (e) {

                if (ledger.className != "ledgerToggle"){
                    for (var i = 0; i < 3; i++) {
                        var div = document.createElement("div");
                        div.className = ledgerName[i];
                        w.appendChild(div);
                    }
                    // Make moreToLife public

                    moreToLife = [];
                    moreToLife = "E0 F0 G0 A0 B0 C0 D E F G A B C D1 E1 F1 G1 A1 B1 C1 D2 E2 F2".split(" ");


                    for (var j = 0; j < 3; j++){
                        var outerDiv = document.createElement("div");
                        outerDiv.className = outerLedger[j];
                        outerLines.appendChild(outerDiv);
                    }

                    ledger.className = "ledgerToggle";

                }
                else
                {

                    // When ledger icon is clicked second time, then revert moretolife to default
                    // Random notes then will use default map(4 default music lines)

                    $(".line1 > img").attr("class", "D");
                    moreToLife.splice(0, 6);
                    moreToLife.splice(11, 18);
                    ledger.className = "ledger";
                    $(".line6").remove();
                    $(".line7").remove();
                    $(".line8").remove();
                    $(".line-1").remove();
                    $(".line-2").remove();
                    $(".line-3").remove();
                }

            }, false);
        },
        randomAlgorithm: function(){
            $(".line1 > img").attr("src", "icons/singleNote.png").attr("class", moreToLife[Math.floor(Math.random() * moreToLife.length)]);
        },

        newNote : function(){
            newNote.addEventListener("click", function(){
                Module.randomAlgorithm()
            });
        },

        score : function(){
            score.addEventListener("click", function(e){
                var getImg = $(".line1 > img");
                var wrongNote = $(".wrongNote > p");

                var oldNote = getImg.attr("class");
                if (getImg.attr("class").length === 2){
                    getImg.attr("class", getImg.attr("class").substr(0, 1));
                }
                if (e.target){
                    if (e.target.innerHTML === getImg.attr("class")){
                        positiveScore++;
                        $(".positive  > p").html(positiveScore);
                        Module.randomAlgorithm();
                        $(".wrongNote > p").html("");
                    }
                    else
                    {
                        negativeScore++;
                        $(".negative  > p").html(negativeScore);
                        Module.randomAlgorithm();
                        // oldNote.substr(0, 1)
                        //                  $(".wrongNote > p").html("Wrong, correct note is : " + oldNote.substr(0, 1));
                        if (wrongNote.attr("class") != "wrong"){
                            wrongNote.html("Wrong, correct note is : " + oldNote.substr(0, 1));
                            wrongNote.attr("class", "wrong");
                        }
                        else
                        {
                            wrongNote.attr("class", "").html("Wrong, correct note is : " + oldNote.substr(0, 1));
                        }

                    }
                }

            }, false);
        },

        resetScore : function(){
            resetScore.addEventListener("click", function(){
                positiveScore = 0;
                negativeScore = 0;
                $(".positive > p").html(positiveScore);
                $(".negative > p").html(negativeScore);
            });
        }
    };




})();


Module.help();
Module.ledger();
Module.newNote();
Module.resetScore();
Module.score();