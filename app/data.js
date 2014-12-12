// Create EFAF, so when .help icon/div is clicked, append them to music lines
var help = document.querySelector(".help");
var niz = ["E", "C", "A", "F",""];
wrap = document.querySelector(".innerLines").children;
var w = document.querySelector(".wrap");
var wrapList = document.querySelector(".wrap2");
var p = document.createElement("p");
var outerLines = document.querySelector(".outerLines");



var line1 = document.querySelector(".line1");
var newNote = document.querySelector(".newNote");
var moreToLife = ["D", "E", "F", "G", "A", "B", "C", "D1", "E1", "F1", "G1"];
var topLedgerNotes = ["A1", "B1", "C1", "D2", "E2", "F2"];
var bottomLedgerNotes = ["E0", "F0", "G0", "A0", "B0", "C0"]; // DONT FORGET TO REVERSE

// Ledger lines are named with -1-2-3 etc.

var ledger = document.querySelector(".ledger");
var outerLedger = ["line-1", "line-2", "line-3"];
var ledgerName = ["line6", "line7", "line8"];

var score = document.querySelector(".zz");
var resetScore = document.querySelector(".reset");
var positiveScore = 0;
var negativeScore = 0;



// Get the divs and codes for keyboard buttons

var keyDivs = [newNote, ledger, resetScore, help];
var keyCodes = [32, 76, 82, 72];
