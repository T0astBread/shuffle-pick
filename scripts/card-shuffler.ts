/**
 * Created by T0astBread on 03.07.2017.
 */

const TITLE_LENGTH_LIMIT = 20;

let currentSpin: number, resizeTimer: number;
let sleepTime = 2, stepSize = 5;
let isSpinning = false, canSpin = true, finishSpinning = false;
let finishCallback: Function;
let maxStepSize: number;

let init = () =>
{
    let shuffler = $(".card-shuffler"), cards = shuffler.find(".card");
    cards.each((i, card) =>
    {
        let qCard = $(card);

        let title = qCard.find("h4");
        qCard.attr("title", title.text());
        if(title.text().length > TITLE_LENGTH_LIMIT) title.text(title.text().slice(0, TITLE_LENGTH_LIMIT) + "...");

        let index = qCard.attr("x-index") ? parseInt(qCard.attr("x-index")) : i;
        qCard.css("left", index * (shuffler.outerWidth()/(cards.length - 1)));

        let cardHeight = qCard.outerHeight(true);
        if(shuffler.height() < cardHeight) shuffler.height(cardHeight);
    });
};

let update = (shuffler: JQuery, doMovement = true) =>
{
    let cards = shuffler.find(".card");
    let stepSizeTemp = stepSize;
    let stopSpinningAfterStep = false;
    cards.each((i, card) =>
    {
        let qCard = $(card);
        let title = qCard.find("h4"), body = qCard.find("p");
        let left = leftOf(qCard);
        if(doMovement) qCard.css("left", left -= stepSizeTemp);
        if(left < - shuffler.outerWidth()/(cards.length - 1))
        {
            qCard.css("left", shuffler.width());
            let randCard = getRandomCard();
            title.text(randCard.title);
            body.html(randCard.text);
        }
        // qCard.css("visibility", left > shuffler.width() - card.clientWidth ? "hidden" : "visible");

        let dist = 1 - distanceToMiddle(qCard, shuffler);
        qCard.css("z-index", Math.round(dist * 100));

        qCard.css("height", 4 * dist + 5 + "em");
        title.css("margin-top", .5 * dist + "em");
        qCard.css("opacity", dist);

        // qCard.find("h4").text(dist.toFixed(2))

        qCard.css("top", shuffler.outerHeight()/2 - qCard.outerHeight(true)/2);

        let rotation = "rotate3d(0, 1, 0, " + ((1 - dist) * (isOverMiddle(qCard, shuffler) ? -1 : 1)) * 50 + "deg)";
        qCard.css("transform", rotation);
        qCard.css("-moz-transform", rotation);

        if(finishSpinning && dist > .99 - .05 * (stepSizeTemp/maxStepSize)) stopSpinningAfterStep = true;
    });
    if(stopSpinningAfterStep) stopSpinning();
};

let spin = (shuffler: JQuery = $(".card-shuffler")) =>
{
    if(!canSpin) return false;
    finishSpinning = false;
    // clearInterval(currentSpin);
    // currentSpin = setInterval(() => update(shuffler), $("input").val());
    clearTimeout(currentSpin);
    startUpdateTimer(shuffler);
    isSpinning = true;
    return true;
};

let stopSpinning = () =>
{
    isSpinning = false;
};

let finishSpin = () =>
{
    setTimeout(() => finishSpinning = true, Math.random() * 2000);
};

let startUpdateTimer = (shuffler: JQuery) =>
{
    currentSpin = setTimeout(() =>
    {
        update(shuffler);
        if(isSpinning) startUpdateTimer(shuffler);
        else if(finishCallback) finishCallback();
    }, sleepTime);
};

let distanceToMiddle = (card: JQuery, shuffler: JQuery) =>
{
    let wh = shuffler.outerWidth()/2, l = leftOf(card);
    return Math.abs(wh - (l + card.outerWidth()/2))/wh;
};

let isOverMiddle = (card: JQuery, shuffler: JQuery) =>
{
    let wh = shuffler.outerWidth()/2, l = leftOf(card) + card.outerWidth()/2;
    return l > wh;
};

let leftOf = (elem: JQuery) =>
{
    return parseInt(elem.css("left").replace("px", ""));
};

let distributeSpace = () =>
{
    init();
    update($(".card-shuffler"), false);
};

let fillWithCards = () =>
{
    canSpin = false;
    let i = 0;
    let interval = setInterval(() =>
    {
        if(i++ >= 7) clearInterval(interval);
        let card = getRandomCard();
        $(".card-shuffler").append("<div class='card'><h4>" + card.title + "</h4><p>" + card.text + "</p></div>");
        distributeSpace();
    }, 200);
    canSpin = true;
};

let removeCards = () =>
{
    $(".card-shuffler").html("");
};

let updateCardShuffler = () =>
{
    removeCards();
    fillWithCards();
};

$(document).ready(() =>
{
    fillWithCards();
    distributeSpace();
    $(window).resize(() =>
    {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(distributeSpace, 300);
    });

    let speedChange = () => sleepTime = (maxStepSize = parseInt($("#speed").attr("max"))) - $("#speed").val() + 1;
    let stepChange = () => stepSize = $("#step").val();
    $("#speed").change(speedChange);
    $("#step").change(stepChange);
    speedChange();
    stepChange();
    $("#spin").click(() =>
    {
        if(!isSpinning)
        {
            if(!spin()) return;
            $("#spin").text("Stop");
        }
        else
        {
            finishSpin();
            finishCallback = () =>
            {
                $("#spin").removeAttr("disabled");
                $("#spin").text("Shuffle!");
            };
            $("#spin").attr("disabled", "");
        }
    });
});