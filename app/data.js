const help = document.querySelector(".help");
const niz = ["E", "C", "A", "F", ""];
const wrap = document.querySelector(".innerLines").children;
const w = document.querySelector(".wrap");
const wrapList = document.querySelector(".wrap2");
const outerLines = document.querySelector(".outerLines");

const line1 = document.querySelector(".line1");
const newNote = document.querySelector(".newNote");
let moreToLife = ["D", "E", "F", "G", "A", "B", "C", "D1", "E1", "F1", "G1"];
const topLedgerNotes = ["A1", "B1", "C1", "D2", "E2", "F2"];
const bottomLedgerNotes = ["E0", "F0", "G0", "A0", "B0", "C0"].reverse();

const ledger = document.querySelector(".ledger");
const outerLedger = ["line-1", "line-2", "line-3"];
const ledgerName = ["line6", "line7", "line8"];

const score = document.querySelector(".zz");
const resetScore = document.querySelector(".reset");
let positiveScore = 0;
let negativeScore = 0;

const liKeyCodes = $(".zz > li");
const keyDivs = [
  newNote, ledger, resetScore, help,
  ...liKeyCodes.toArray()
];
const keyCodes = [32, 76, 82, 72, 67, 68, 69, 70, 71, 65, 66];