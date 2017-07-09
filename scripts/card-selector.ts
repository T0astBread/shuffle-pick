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

let cards: Array<Card> = [new Card("d", "i")];

let getRandomCard = () =>
{
    return cards[Math.floor(Math.random() * cards.length)];
};