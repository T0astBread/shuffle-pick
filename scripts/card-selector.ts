/**
 * Created by T0astBread on 03.07.2017.
 */

class Card
{
    title: string;
    text: string;

    constructor(title: string, url: string)
    {
        this.title = title;
        this.text = url;
    }
}

let cards: Array<Card> = [];

let updateCards = () =>
{
    cards = [];
    $("#values").val().split(/\n/).forEach((line: string) =>
    {
        let tokens = line.split(";");
        cards.push(new Card(tokens[0], tokens[1]));
    });
};

let getRandomCard = () =>
{
    return cards[Math.floor(Math.random() * cards.length)];
};

$(document).ready(() =>
{
    updateCards();
    $("#set-values").click(() =>
    {
        updateCards();
        updateCardShuffler();
    });
});