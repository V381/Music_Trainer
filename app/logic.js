/*
*  Author : Pavle Paunovic
*/

const Module = (function () {
    // Private variables
    const keysMap = {};
  
    // Public methods
    return {
      createKeysMap : function(){
        for (var i = 0; i < keyDivs.length; i++){
            keysMap[keyCodes[i]] = keyDivs[i];
        }
      },
        
      help() {
        help.addEventListener("click", function (e) {
          const wrapElements = Array.from(wrap);
  
          if (help.className !== "helpToggle") {
            wrapElements.forEach((wrapElement, i) => {
              const p = document.createElement("p");
              p.appendChild(document.createTextNode(niz[i]));
              wrapElement.appendChild(p);
            });
            help.className = "helpToggle";
          } else {
            help.className = "help";
            $(".innerLines p").remove();
          }
        }, false);
      },
  
      ledger() {
        ledger.addEventListener("click", function (e) {
          const line1Img = $(".line1 > img");
  
          if (ledger.className !== "ledgerToggle") {
            for (let i = 0; i < 3; i++) {
              const div = document.createElement("div");
              div.className = ledgerName[i];
              w.appendChild(div);
            }
  
            moreToLife = [];
            moreToLife = "E0 F0 G0 A0 B0 C0 D E F G A B C D1 E1 F1 G1 A1 B1 C1 D2 E2 F2".split(" ");
  
            for (let j = 0; j < 3; j++) {
              const outerDiv = document.createElement("div");
              outerDiv.className = outerLedger[j];
              outerLines.appendChild(outerDiv);
            }
  
            ledger.className = "ledgerToggle";
          } else {
            line1Img.attr("class", "D");
            moreToLife.splice(0, 6);
            moreToLife.splice(11, 18);
            ledger.className = "ledger";
            $(".line6, .line7, .line8, .line-1, .line-2, .line-3").remove();
          }
        }, false);
      },
  
      randomAlgorithm() {
        $(".line1 > img").attr("src", "icons/singleNote.png").attr("class", moreToLife[Math.floor(Math.random() * moreToLife.length)]);
      },
  
      newNote() {
        newNote.addEventListener("click", function () {
          Module.randomAlgorithm();
        });
      },
  
      score() {
        score.addEventListener("click", function (e) {
          const getImg = $(".line1 > img");
          const wrongNote = $(".wrongNote > p");
          const oldNote = getImg.attr("class");
  
          if (getImg.attr("class").length === 2) {
            getImg.attr("class", getImg.attr("class").substr(0, 1));
          }
  
          if (e.target) {
            if (e.target.innerHTML === getImg.attr("class")) {
              positiveScore++;
              $(".positive  > p").html(positiveScore);
              Module.randomAlgorithm();
              wrongNote.html("");
            } else {
              negativeScore++;
              $(".negative  > p").html(negativeScore);
              Module.randomAlgorithm();
  
              if (wrongNote.attr("class") !== "wrong") {
                wrongNote.html("Wrong, correct note is : " + oldNote.substr(0, 1));
                wrongNote.attr("class", "wrong");
              } else {
                wrongNote.attr("class", "").html("Wrong, correct note is : " + oldNote.substr(0, 1));
              }
            }
          }
        }, false);
      },
  
      resetScore() {
        resetScore.addEventListener("click", function () {
          positiveScore = 0;
          negativeScore = 0;
          $(".positive > p").html(positiveScore);
          $(".negative > p").html(negativeScore);
        });
      },
  
      keyCodesImplementation() {
        document.getElementsByTagName("body")[0].addEventListener("keydown", function (e) {
          Object.keys(keysMap).forEach((i) => {
            if (keysMap.hasOwnProperty(i)) {
              if (e.keyCode === Number(i)) {
                keysMap[i].click();
              }
            }
          });
        }.bind(this), false);
      },
  
      // Public initialization method
      init() {
        this.help();
        this.ledger();
        this.newNote();
        this.resetScore();
        this.score();;
        this.keyCodesImplementation();
        this.createKeysMap()
      }
    };
  })();
  
  Module.init();
  