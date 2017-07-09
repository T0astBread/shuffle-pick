"use strict";
/**
 * Created by T0astBread on 03.07.2017.
 */
var TITLE_LENGTH_LIMIT = 20;
var currentSpin, resizeTimer;
var sleepTime = 2, stepSize = 5;
var isSpinning = false, canSpin = true, finishSpinning = false;
var finishCallback;
var maxStepSize;
var init = function () {
    var shuffler = $(".card-shuffler"), cards = shuffler.find(".card");
    cards.each(function (i, card) {
        var qCard = $(card);
        var title = qCard.find("h4");
        qCard.attr("title", title.text());
        if (title.text().length > TITLE_LENGTH_LIMIT)
            title.text(title.text().slice(0, TITLE_LENGTH_LIMIT) + "...");
        var index = qCard.attr("x-index") ? parseInt(qCard.attr("x-index")) : i;
        qCard.css("left", index * (shuffler.outerWidth() / (cards.length - 1)));
        var cardHeight = qCard.outerHeight(true);
        if (shuffler.height() < cardHeight)
            shuffler.height(cardHeight);
    });
};
var update = function (shuffler, doMovement) {
    if (doMovement === void 0) { doMovement = true; }
    var cards = shuffler.find(".card");
    var stepSizeTemp = stepSize;
    var stopSpinningAfterStep = false;
    cards.each(function (i, card) {
        var qCard = $(card);
        var title = qCard.find("h4"), link = qCard.find("a");
        var left = leftOf(qCard);
        if (doMovement)
            qCard.css("left", left -= stepSizeTemp);
        if (left < -shuffler.outerWidth() / (cards.length - 1)) {
            qCard.css("left", shuffler.width());
            var randCard = getRandomCard();
            title.text(randCard.title);
            link.text(randCard.text);
            link.attr("href", randCard.text);
        }
        // qCard.css("visibility", left > shuffler.width() - card.clientWidth ? "hidden" : "visible");
        var dist = 1 - distanceToMiddle(qCard, shuffler);
        qCard.css("z-index", Math.round(dist * 100));
        title.css("font-size", 30 * dist + 2 + "pt");
        qCard.css("opacity", dist);
        // qCard.find("h4").text(dist.toFixed(2))
        qCard.css("top", shuffler.outerHeight() / 2 - qCard.outerHeight(true) / 2);
        //Doesn't work yet. TODO: Make it work
        qCard.css("transform", "rotate3d(0, 1, 0, " + ((1 - dist) * (isOverMiddle(qCard, shuffler) ? -1 : 1)) * 50 + "deg)");
        if (finishSpinning && dist > .99 - .05 * (stepSizeTemp / maxStepSize))
            stopSpinningAfterStep = true;
    });
    if (stopSpinningAfterStep)
        stopSpinning();
};
var spin = function (shuffler) {
    if (shuffler === void 0) { shuffler = $(".card-shuffler"); }
    if (!canSpin)
        return false;
    finishSpinning = false;
    // clearInterval(currentSpin);
    // currentSpin = setInterval(() => update(shuffler), $("input").val());
    clearTimeout(currentSpin);
    startUpdateTimer(shuffler);
    isSpinning = true;
    return true;
};
var stopSpinning = function () {
    isSpinning = false;
};
var finishSpin = function () {
    setTimeout(function () { return finishSpinning = true; }, Math.random() * 2000);
};
var startUpdateTimer = function (shuffler) {
    currentSpin = setTimeout(function () {
        update(shuffler);
        if (isSpinning)
            startUpdateTimer(shuffler);
        else if (finishCallback)
            finishCallback();
    }, sleepTime);
};
var distanceToMiddle = function (card, shuffler) {
    var wh = shuffler.outerWidth() / 2, l = leftOf(card);
    return Math.abs(wh - (l + card.outerWidth() / 2)) / wh;
};
var isOverMiddle = function (card, shuffler) {
    var wh = shuffler.outerWidth() / 2, l = leftOf(card) + card.outerWidth() / 2;
    return l > wh;
};
var leftOf = function (elem) {
    return parseInt(elem.css("left").replace("px", ""));
};
var distributeSpace = function () {
    init();
    update($(".card-shuffler"), false);
};
var fillWithCards = function () {
    canSpin = false;
    var i = 0;
    var interval = setInterval(function () {
        if (i++ >= 7)
            clearInterval(interval);
        var card = getRandomCard();
        $(".card-shuffler").append("<div class='card'><h4>" + card.title + "</h4><a href='" + card.text + "'>" + card.text + "</a></div>");
        distributeSpace();
    }, 200);
    canSpin = true;
};
var removeCards = function () {
    $(".card-shuffler").html("");
};
var updateCardShuffler = function () {
    removeCards();
    fillWithCards();
};
$(document).ready(function () {
    fillWithCards();
    distributeSpace();
    $(window).resize(function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(distributeSpace, 300);
    });
    var speedChange = function () { return sleepTime = (maxStepSize = parseInt($("#speed").attr("max"))) - $("#speed").val() + 1; };
    var stepChange = function () { return stepSize = $("#step").val(); };
    $("#speed").change(speedChange);
    $("#step").change(stepChange);
    speedChange();
    stepChange();
    $("#spin").click(function () {
        if (!isSpinning) {
            if (!spin())
                return;
            $("#spin").text("Stop");
        }
        else {
            finishSpin();
            finishCallback = function () {
                $("#spin").removeAttr("disabled");
                $("#spin").text("Shuffle!");
            };
            $("#spin").attr("disabled", "");
        }
    });
});
