// ==UserScript==
// @name        vozembedcode
// @include     https://voz.vn/*
// @version      1
// @description  Autodecodes any Base64 text on a "code box" and show it as a link.
// @updateURL   https://raw.githubusercontent.com/g-eipi10/voz_code/main/voz_embed_code.js
// @match        none
// @grant        none
// ==/UserScript==

function b64_to_utf8(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

function setAttributes(el, attrs) {
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
}

function endsWith2(ext, link) {
  for (var i = 0; i < ext.length; i++) {
    if (link.endsWith(ext[i])) { return true; }
  }
  return false;
}

function embed_link(link) {
  let link_embed = document.createElement("a");
  var attrs = {
    href: link,
    target: "_blank",
    class: "link link--external",
    rel: "nofollow ugc noopener"
  }
  setAttributes(link_embed, attrs);
  link_embed.innerHTML = link;
  return link_embed;
}

function embed_image(img_link) {
  let img_embed = document.createElement("img");
  var attrs = {
    src: img_link,
    class: "bbImage",
  }
  setAttributes(img_embed, attrs);
  img_embed.innerHTML = img_link;
  return img_embed;
}

var extensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"];

if (document.getElementsByClassName("bbCodeBlock--code")) {
  var items = document.getElementsByClassName("bbCodeBlock--code");
  for(var i = 0; i < items.length; i++) {
    var content = items[i].children[1].children[0];
    if (content.className === "bbCodeCode") {
      if (content.innerText.startsWith("aHR0c")) {
        link_embed = embed_link(b64_to_utf8(content.innerText));
        items[i].parentElement.insertBefore(link_embed, items[i]);
      }
      else if (content.innerText.startsWith("http")) {
        if (endsWith2(extensions, content.innerText)) {     
          img_embed = embed_image(content.innerText);
          items[i].parentElement.insertBefore(img_embed, items[i]);
        }
        else if (content.innerText.startsWith("https://imgur.com") && !content.innerText.startsWith("https://imgur.com/a/")) {
          imgur_id = content.innerText.split(".com/")[1];
          img_link = "https://i.imgur.com/" + imgur_id + ".gif";
          img_embed = embed_image(img_link);
          items[i].parentElement.insertBefore(img_embed, items[i]);
        }
        else {
          link_embed = embed_link(content.innerText);
          items[i].parentElement.insertBefore(link_embed, items[i]);
        }
      }
    }
  }
}
