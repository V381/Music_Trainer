const Module = (function () {
  // Private variables
  const keysMap = {};
  let isBassClef = false;
  
  // Note mappings for both clefs
  const trebleNotes = {
      standardNotes: ["D", "E", "F", "G", "A", "B", "C", "D1", "E1", "F1", "G1"],
      ledgerNotesTop: ["A1", "B1", "C1", "D2", "E2", "F2"],
      ledgerNotesBottom: ["E0", "F0", "G0", "A0", "B0", "C0"]
  };
  
  const bassNotes = {
      standardNotes: ["F2", "G2", "A2", "B2", "C3", "D3", "E3", "F3", "G3", "A3", "B3"],
      ledgerNotesTop: ["C4", "D4", "E4", "F4", "G4", "A4"],
      ledgerNotesBottom: ["G1", "A1", "B1", "C2", "D2", "E2"]
  };
  
  let currentNotes = trebleNotes.standardNotes;

  // Public methods
  return {
      createKeysMap: function() {
          for (let i = 0; i < keyDivs.length; i++) {
              keysMap[keyCodes[i]] = keyDivs[i];
          }
      },

      toggleClef() {
          const bassClef = document.querySelector(".bassClef");
          const trebleImg = document.querySelector(".treble img");
          const bassIcon = document.querySelector(".bassClef img");
          const trebleClefText = document.querySelector('.treble-clef');
          
          bassClef.addEventListener("click", function() {
              isBassClef = !isBassClef;
              
              if (isBassClef) {
                  // Switch to bass clef
                  trebleImg.style.display = "none";
                  const bassClefImg = document.createElement("img");
                  bassClefImg.src = "icons/bass-clef-svgrepo-com.svg";
                  bassClefImg.className = "bass-clef-icon";
                  trebleImg.parentNode.appendChild(bassClefImg);
                  trebleClefText.innerHTML = "Treble clef";
                  bassIcon.src = "icons/treble.gif";
                  
                  // Update notes array for bass clef
                  currentNotes = bassNotes.standardNotes;
                  if (ledger.className === "ledgerToggle") {
                      currentNotes = [...bassNotes.ledgerNotesBottom, ...bassNotes.standardNotes, ...bassNotes.ledgerNotesTop];
                  }
              } else {
                  // Switch back to treble clef
                  trebleImg.style.display = "block";
                  const bassClefImg = document.querySelector(".treble .bass-clef-icon");
                  if (bassClefImg) {
                      bassClefImg.remove();
                  }
                  trebleClefText.innerHTML = "Bass clef";
                  bassIcon.src = "icons/bass-clef-svgrepo-com.svg";
                  
                  // Update notes array for treble clef
                  currentNotes = trebleNotes.standardNotes;
                  if (ledger.className === "ledgerToggle") {
                      currentNotes = [...trebleNotes.ledgerNotesBottom, ...trebleNotes.standardNotes, ...trebleNotes.ledgerNotesTop];
                  }
              }
              
              // Generate a new note when switching clefs
              Module.randomAlgorithm();
          });
      },

      help() {
          help.addEventListener("click", function (e) {
              const wrapElements = Array.from(wrap);
              const currentNoteNames = isBassClef ? 
                  ["G2", "E3", "C3", "A2", ""] : 
                  ["E", "C", "A", "F", ""];

              if (help.className !== "helpToggle") {
                  wrapElements.forEach((wrapElement, i) => {
                      const p = document.createElement("p");
                      p.appendChild(document.createTextNode(currentNoteNames[i]));
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
                  // Add ledger lines
                  for (let i = 0; i < 3; i++) {
                      const div = document.createElement("div");
                      div.className = ledgerName[i];
                      w.appendChild(div);
                  }

                  // Update available notes based on current clef
                  currentNotes = isBassClef ? 
                      [...bassNotes.ledgerNotesBottom, ...bassNotes.standardNotes, ...bassNotes.ledgerNotesTop] :
                      [...trebleNotes.ledgerNotesBottom, ...trebleNotes.standardNotes, ...trebleNotes.ledgerNotesTop];

                  for (let j = 0; j < 3; j++) {
                      const outerDiv = document.createElement("div");
                      outerDiv.className = outerLedger[j];
                      outerLines.appendChild(outerDiv);
                  }

                  ledger.className = "ledgerToggle";
              } else {
                  line1Img.attr("class", isBassClef ? "F2" : "D");
                  currentNotes = isBassClef ? bassNotes.standardNotes : trebleNotes.standardNotes;
                  ledger.className = "ledger";
                  $(".line6, .line7, .line8, .line-1, .line-2, .line-3").remove();
              }
              
              Module.randomAlgorithm();
          }, false);
      },

      randomAlgorithm() {
          $(".line1 > img").attr("src", "icons/singleNote.png")
                          .attr("class", currentNotes[Math.floor(Math.random() * currentNotes.length)]);
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
              let noteClass = oldNote;

              // Remove number from note class for comparison
              if (noteClass.length > 1) {
                  noteClass = noteClass.replace(/\d+/g, '');
              }

              if (e.target) {
                  if (e.target.innerHTML === noteClass) {
                      positiveScore++;
                      $(".positive > p").html(positiveScore);
                      Module.randomAlgorithm();
                      wrongNote.html("");
                  } else {
                      negativeScore++;
                      $(".negative > p").html(negativeScore);
                      Module.randomAlgorithm();

                      const displayNote = oldNote.replace(/\d+/g, '');
                      if (wrongNote.attr("class") !== "wrong") {
                          wrongNote.html("Wrong, correct note is: " + displayNote);
                          wrongNote.attr("class", "wrong");
                      } else {
                          wrongNote.attr("class", "").html("Wrong, correct note is: " + displayNote);
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

      init() {
          this.help();
          this.ledger();
          this.newNote();
          this.resetScore();
          this.score();
          this.keyCodesImplementation();
          this.createKeysMap();
          this.toggleClef();
      }
  };
})();

Module.init();