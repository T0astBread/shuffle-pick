"use strict";
/**
 * Created by T0astBread on 03.07.2017.
 */
var Card = (function () {
    function Card(title, url) {
        this.title = title;
        this.text = url;
    }
    return Card;
}());
var cards = [new Card("d", "i")];
var getRandomCard = function () {
    return cards[Math.floor(Math.random() * cards.length)];
};
