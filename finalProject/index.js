var theStatusThing = document.getElementById("status");
var roundTxt = document.getElementById("round");
var timeLeftTxt = document.getElementById("countdown");
var volumePointsTxt = document.getElementById("bankedVolume");
var realVolumeTxt = document.getElementById("appliedVolume");
var volumeSlider = document.getElementById("volumeSlider");

var startBtn = document.getElementById("btnStart");
var restartBtn = document.getElementById("btnRestart");
var bankBtn = document.getElementById("btnBank");
var riskBtn = document.getElementById("btnContinue");
var btnOutputQuieter = document.getElementById("btnOutputQuieter");
var btnOutputMute = document.getElementById("btnOutputMute");

var redBtn = document.getElementById("color-red");
var greenBtn = document.getElementById("color-green");
var blueBtn = document.getElementById("color-blue");
var yellowBtn = document.getElementById("color-yellow");

var colorList = ["red", "green", "blue", "yellow"];
var thePattern = [];
var whatRoundIsThis = 0;
var userPlace = 0;
var isShowingStuff = false;

var volumePoints = 0;
var actualVolume = 0;

var secondsThing = 0;
var timerThing = null;

function setStatus(t) {
  theStatusThing.textContent = t;
}

function setRound(n) {
  whatRoundIsThis = n;
  roundTxt.textContent = String(whatRoundIsThis);
}

function setCountdown(n) {
  if (n < 0) timeLeftTxt.textContent = "-";
  else timeLeftTxt.textContent = String(n);
}

function setBanked(n) {
  n = Math.round(n);
  if (n < 0) n = 0;
  if (n > 100) n = 100;
  volumePoints = n;
  volumePointsTxt.textContent = String(volumePoints);
}

function setApplied(n) {
  n = Math.round(n);
  if (n < 0) n = 0;
  if (n > 100) n = 100;
  actualVolume = n;
  realVolumeTxt.textContent = String(actualVolume);
  volumeSlider.value = String(actualVolume);
  volumeSlider.setAttribute("aria-valuenow", String(actualVolume));
}

function enableColors(on) {
  redBtn.disabled = !on;
  greenBtn.disabled = !on;
  blueBtn.disabled = !on;
  yellowBtn.disabled = !on;
}

function enableChoices(on) {
  bankBtn.disabled = !on;
  riskBtn.disabled = !on;
}

function stopTimer() {
  if (timerThing !== null) {
    clearInterval(timerThing);
    timerThing = null;
  }
}

function startTimer(seconds) {
  stopTimer();
  secondsThing = seconds;
  setCountdown(secondsThing);

  timerThing = setInterval(function () {
    secondsThing = secondsThing - 1;
    setCountdown(secondsThing);

    if (secondsThing <= 0) {
      stopTimer();
      fail("Out of time. Reset to 0.");
    }
  }, 1000);
}

function getBtn(color) {
  if (color === "red") return redBtn;
  if (color === "green") return greenBtn;
  if (color === "blue") return blueBtn;
  return yellowBtn;
}

function flash(btn, color, done) {
  var oldBorder = btn.style.border;
  var oldBg = btn.style.background;

  btn.style.border = "6px solid black";
  btn.style.background = color;

  setTimeout(function () {
    btn.style.border = oldBorder;
    btn.style.background = oldBg;
    done();
  }, 250);
}

function showStep(i) {
  if (i >= thePattern.length) {
    isShowingStuff = false;
    userPlace = 0;
    enableColors(true);
    setStatus("Your turn. Repeat it.");

    var timeLimit = 3 + thePattern.length;
    if (timeLimit > 10) timeLimit = 10;
    startTimer(timeLimit);
    return;
  }

  var c = thePattern[i];
  var b = getBtn(c);
  flash(b, c, function () {
    setTimeout(function () {
      showStep(i + 1);
    }, 150);
  });
}

function showSequence() {
  isShowingStuff = true;
  enableColors(false);
  enableChoices(false);
  setCountdown(-1);
  setStatus("Watch. Don't click yet.");

  setTimeout(function () {
    showStep(0);
  }, 250);
}

function randomColor() {
  var i = Math.floor(Math.random() * colorList.length);
  return colorList[i];
}

function startRound() {
  startBtn.disabled = true;
  restartBtn.disabled = false;
  enableChoices(false);
  enableColors(false);

  setRound(whatRoundIsThis + 1);
  thePattern.push(randomColor());
  showSequence();
}

function fail(message) {
  setBanked(0);
  setApplied(0);

  stopTimer();
  enableColors(false);
  enableChoices(false);

  startBtn.disabled = true;
  restartBtn.disabled = false;

  setStatus(message);
}

function success() {
  stopTimer();
  enableColors(false);

  var bonus = secondsThing;
  if (bonus < 0) bonus = 0;

  setBanked(volumePoints + bonus);
  setStatus(
    "Correct. +" +
      bonus +
      " to run score. Commit to output (ends run) or risk next round?",
  );
  enableChoices(true);
}

function clickColor(color) {
  if (isShowingStuff) return;

  var expected = thePattern[userPlace];
  if (color !== expected) {
    fail("Wrong (" + color + " does not equal " + expected + "). Reset to 0.");
    return;
  }

  userPlace = userPlace + 1;
  if (userPlace >= thePattern.length) {
    success();
  }
}

function bankNow() {
  setApplied(volumePoints);
  enableChoices(false);
  enableColors(false);
  stopTimer();
  setStatus(
    "Output volume is now " +
      actualVolume +
      " (from your run score). This run is over. Restart to play again. You can still lower output below.",
  );
}

function riskNow() {
  enableChoices(false);
  setStatus("Risking next round…");
  setTimeout(function () {
    startRound();
  }, 200);
}

function quieterOutput() {
  setApplied(actualVolume - 10);
}

function muteOutput() {
  setApplied(0);
}

function startFresh() {
  stopTimer();
  setRound(0);
  thePattern = [];
  userPlace = 0;
  isShowingStuff = false;

  setBanked(0);
  setApplied(0);

  setStatus("Starting...");
  startRound();
}

function restart() {
  startFresh();
}

startBtn.addEventListener("click", startFresh);
restartBtn.addEventListener("click", restart);
bankBtn.addEventListener("click", bankNow);
riskBtn.addEventListener("click", riskNow);

btnOutputQuieter.addEventListener("click", quieterOutput);
btnOutputMute.addEventListener("click", muteOutput);

redBtn.addEventListener("click", function () {
  clickColor("red");
});
greenBtn.addEventListener("click", function () {
  clickColor("green");
});
blueBtn.addEventListener("click", function () {
  clickColor("blue");
});
yellowBtn.addEventListener("click", function () {
  clickColor("yellow");
});

restartBtn.disabled = true;
enableColors(false);
enableChoices(false);
setCountdown(-1);
setBanked(0);
setApplied(0);
setStatus("Idle. Start the game.");
