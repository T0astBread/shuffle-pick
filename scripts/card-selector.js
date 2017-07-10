"use strict";
/**
 * Created by T0astBread on 03.07.2017.
 */
///<reference path="input-parser.ts"/>
var Card = (function () {
    function Card(title, url) {
        this.title = title;
        this.text = url;
    }
    return Card;
}());
var cards = [];
var updateCards = function () {
    cards = [];
    $("#values").val().split(/\n/).forEach(function (line) {
        var tokens = line.split(";");
        cards.push(new Card(tokens[0], parseText(tokens[1])));
    });
};
var getRandomCard = function () {
    return cards[Math.floor(Math.random() * cards.length)];
};
$(document).ready(function () {
    updateCards();
    $("#set-values").click(function () {
        updateCards();
        updateCardShuffler();
    });
});
