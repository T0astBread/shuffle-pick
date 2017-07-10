"use strict";
/**
 * Created by T0astBread on 10.07.2017.
 */
var parseText = function (text) {
    var parsed = parseLinks(text);
    console.log(parsed);
    return parsed;
};
var parseLinks = function (text) {
    var linkExp = /(https?:\/\/)?(www\.)?((?:\w|\d|\.)+)\.([a-z]+)((?:\w|\d|\/)*(?:\.[a-z]+)*)/;
    return text.split(" ").map(function (text) { return text.replace(linkExp, function (rawText, http, www, domain, ending, resource) {
        if (!domain)
            return rawText;
        var assembledLink = (http ? http : "https://") + (www ? www : "") + domain + "." + ending + (resource ? resource : "");
        return "<a href='" + assembledLink + "' target=\"_blank\">" + assembledLink + "</a>";
    }); }).join(" ");
};
