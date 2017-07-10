/**
 * Created by T0astBread on 10.07.2017.
 */

let parseText = (text: string): string =>
{
    let parsed = parseLinks(text);
    console.log(parsed);
    return parsed;
};

let parseLinks = (text: string): string =>
{
    let linkExp = /(https?:\/\/)?(www\.)?((?:\w|\d|\.)+)\.([a-z]+)((?:\w|\d|\/)*(?:\.[a-z]+)*)/;
    return text.split(" ").map(text => text.replace(linkExp,
        (rawText, http, www, domain, ending, resource) =>
        {
            if(!domain) return rawText;
            let fullDomain = domain + "." + ending;
            let assembledLink = (http ? http : "https://") + (www ? www : "") + fullDomain + (resource ? resource : "");
            return `<a href="${assembledLink}" target="_blank" title="${fullDomain}">${assembledLink}</a>`;
        })).join(" ");
};