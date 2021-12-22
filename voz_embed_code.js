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

function embed_general(contents, item_i, embed_type) {
  var urls = contents.split("\n");
  var element_embed = "";
  for (var j = 0; j < urls.length; j++) {
    if (embed_type === "link") { element_embed = embed_link(urls[j]); }
    else if (embed_type === "image") { element_embed = embed_image(urls[j]); }
    else if (embed_type === "imgur") {
      imgur_id = urls[j].split(".com/")[1];
      img_link = "https://i.imgur.com/" + imgur_id + ".gif";
      element_embed = embed_image(img_link);
    }
    item_i.parentElement.insertBefore(element_embed, item_i);
    var br = document.createElement("br");
    item_i.parentElement.insertBefore(br, item_i);
  }
}

var extensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"];

if (document.getElementsByClassName("bbCodeBlock--code")) {
  var items = document.getElementsByClassName("bbCodeBlock--code");
  for(var i = 0; i < items.length; i++) {
    var content = items[i].children[1].children[0];
    if (content.className === "bbCodeCode") {
      if (content.innerText.startsWith("aHR0c")) {
        decoded = atob(content.innerText.split("\n")[0]);
        embed_general(decoded, items[i], "link");
        // urls = decoded.split("\n");
        // for (var j = 0; j < urls.length; j++) {
        //   link_embed = embed_link(urls[j]);
        //   items[i].parentElement.insertBefore(link_embed, items[i]);
        //   br = document.createElement("br");
        //   items[i].parentElement.insertBefore(br, items[i]);
        // }
      }
      else if (content.innerText.startsWith("http")) {
        if (endsWith2(extensions, content.innerText)) {
          embed_general(content.innerText, items[i], "image");
          // urls = content.innerText.split("\n");
          // for (var j = 0; j < urls.length; j++) {
          //   img_embed = embed_image();
          //   items[i].parentElement.insertBefore(img_embed, items[i]);
          // }
        }
        else if (content.innerText.startsWith("https://imgur.com") && !content.innerText.startsWith("https://imgur.com/a/")) {
          embed_general(content.innerText, items[i], "imgur");
          // imgur_id = content.innerText.split(".com/")[1];
          // img_link = "https://i.imgur.com/" + imgur_id + ".gif";
          // img_embed = embed_image(img_link);
          // items[i].parentElement.insertBefore(img_embed, items[i]);
        }
        else {
          embed_general(content.innerText, items[i], "link");
          // link_embed = embed_link(content.innerText);
          // items[i].parentElement.insertBefore(link_embed, items[i]);
        }
      }
    }
  }
}
