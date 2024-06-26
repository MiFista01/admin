function emitSetImg(path){
    $($(edititingElement).children("img")).attr("src", path);
}
function emitSetList(count){
    const list = $(edititingElement).children("ul")
    const children = list.children("li")
    const mainClass = $(edititingElement).attr("class").split(" ")[1]
    if(count > 0){
        $(edititingElement).attr("placeholder", null);
        if(children.length < count){
            for(let i = 0; i < count-children.length; i++){
                const li = document.createElement("li")
                $(li).addClass("element");
                $(li).attr("dropzone", true);
                element(li)
                $(list).append(li);
            }
        }else{
            for(let i= 0; i < children.length - count; i++){
                $(children.last()).remove();
            }
        }
    }else if(count == 0){
        $(edititingElement).attr("placeholder", mainClass);
    }
}
function emitTitleType(type){
    const title = document.createElement(type)
    $(title).attr("contenteditable", true);
    const text = $($(edititingElement).children().last()).text();
    $(title).text(text);
   $($(edititingElement).children().last()).remove();
   $(edititingElement).append(title);

}

function emitBtnSrc(path){
    $($(edititingElement).children().last()).attr("href", path);
}

function emitSocialBtn(path, social_link){
    $($(edititingElement).children().last()).attr("href", social_link);
    $($(edititingElement).children().last().find("img")).attr("src", path);
}
function emitDownloadBtn(path){
    $($(edititingElement).children().last()).attr("href", path);
}

function emitVideoPreview(href){
    $($(edititingElement).children().last()).attr("href", href);
    $($(edititingElement).children().last()).attr("poster", href);
}
function emitVideoSrc(src){
    $($(edititingElement).children().last()).attr("src", src);
}
function emitSwiper(slides){
    $($(edititingElement).children().last()).empty();
    $(edititingElement).attr("slides", JSON.stringify(slides.map(value=>{return value.path})));

}