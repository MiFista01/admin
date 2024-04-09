var menuStatus = true
var topMousePos = 0
var leftMousePos = 0
var insertMod = 0
var moveStatus = false
var edititingElement = ""
function initDragDrop(){
  // toggleMenuElements()
  element(".element")
  moveElement()
  contextMenu()
  $(".bg").click(()=>{
    hideForm()
    $("#countItem").val(0);
  });
}
function toggleMenuElements() {
  $(".showHideBtnElement").click(function (e) {
    e.preventDefault();
    menuStatus = !menuStatus
    $(".elements").css("right", menuStatus? "0px": "-20vw");
  });
}

function moveElement(){
  $("body").mousemove(function (e) { 
    // values: e.clientX, e.clientY, e.pageX, e.pageY
    var offset = $(".constructorMain").offset();
    if(offset){
      var top = offset.top;
      var left = offset.left;
      topMousePos = e.pageY-top
      leftMousePos = e.pageX-left
      $($(".clone-container").children()[0]).css("top", topMousePos+"px");
      $($(".clone-container").children()[0]).css("left", leftMousePos+"px");
    }
  });
}
function contextMenu(){
  $(document).bind("contextmenu", function (e) {
    if ($(".clone-container").children().length > 0) {
      $(".clone-container").empty();
      
      return false;
    }
    return true;
  });
}
function element(obj){
  const borders = $(obj).children(".borders").children();
  $(borders).click(function (e) { 
    e.preventDefault();
    let borderNmb = $(this).attr("class").split(" ")[1].replace("border","")
    if(borderNmb == 1 || borderNmb == 3){
      insertMod = 1
    }else if(borderNmb == 2 || borderNmb == 4){
      insertMod = 2
    }
  });
  
  
  $(obj).click(function (e) {
    e.preventDefault();
    const cloneElement = $(".clone-container").children()
    if(!moveStatus){
      if (cloneElement.length == 0 && $(this).hasClass("prime") && $(this).attr("dropzone") !== "true") {
        appendtoClone(this)
      }else if(($(this).attr("dropzone") === "true" || insertMod != 0) && cloneElement.length != 0){
        insertTo(this)
      }
    }
    moveStatus = false
  });
}

function hover(obj){
  $(obj).hover(function (e) {
    if($(this).hasClass("element")){
      $($(this).parent()).removeClass("active");
      if(!$($(this).children(".element")).hasClass("active")){
        $(this).addClass("active");
      }
    }
    
  }, function (e) {
    if($(this).hasClass("element") && $(e.relatedTarget).hasClass("element")){
      $(this).removeClass("active");
      $(e.relatedTarget).addClass("active");
    }
  });
}
function move(obj){
  $($(obj).children(".funcBtns").children(".move")).click(function (e) {
    e.preventDefault();
    
    if($(obj).parent().children(".element").length-1 <= 0){
      $($(obj).parent()).attr("placeholder", $($(obj).parent()).attr("class").split(" ")[1]);
      $($(obj).parent()).addClass("active");
    }
    moveStatus = true
    appendtoClone(obj)
    $(obj).remove();
  });
}
function deleteElement(obj){
  $($(obj).children(".funcBtns").children(".delete")).click(function (e) {
    e.preventDefault();
    if($(obj).parent().children(".element").length-1 <= 0){
      $($(obj).parent()).attr("placeholder", $($(obj).parent()).attr("class").split(" ")[1]);
    }
    $(obj).hide(200, ()=>{
      $(obj).remove();
    });
  });
}
function initForms(obj) {
  $($(obj).children(".funcBtns").children(".configurator")).click(function (e) { 
    e.preventDefault();
    $(".elementType").text($(obj).attr("class").split(" ")[1]);
    if($(obj).hasClass("paragraph") || $(obj).hasClass("section") || $(obj).hasClass("area")){
      $(".editorBtn").hide(0);
    }else{
      $(".editorBtn").show(0);
    }
    $(".forms").css("opacity", 1);
    $(".forms").css("pointer-events", "all");
    edititingElement = obj
    $(".conf").hide(0);
    $(".conf-"+$(obj).attr("class").split(" ")[1]).show(0);
  });
}
function hideForm(){
  $(".forms").css("opacity", 0);
  $(".forms").css("pointer-events", "none");
}
function appendtoClone(obj){
  const cloneElement = $(obj).clone();
  $(cloneElement).css("top", topMousePos+"px");
  $(cloneElement).css("left", leftMousePos+"px");
  $(cloneElement).attr("placeholder", $(cloneElement).attr("class").split(" ")[1]);
  $(cloneElement).removeClass("active");
  $(".clone-container").empty();
  $(".clone-container").append(cloneElement);
  insertMod = 0
}

function insertTo(obj){
  const cloneElement = $($(".clone-container").children()[0]).clone();
  const mainClass = $(cloneElement).attr("class").split(" ")[1]
  if(mainClass == "section" || mainClass == "area" || mainClass == "btn"){
    $(cloneElement).attr("dropzone", true);
  }
  $(cloneElement).removeClass("prime");
  $(cloneElement).css("top", "0px");
  $(cloneElement).css("left", "0px");
  const appendElement = assignEventListeners(cloneElement)
  switch (insertMod) {
    case 0:
      $(obj).append(appendElement);
      $(obj).attr("placeholder", "");
      break;
      case 1:
        $(obj).before(appendElement);
      break;
    case 2:
      $(obj).after(appendElement);
      break;
  }
  $(".clone-container").empty();
  insertMod = 0
}
function assignEventListeners(obj) {
  hover(obj)
  move(obj)
  initForms(obj)
  deleteElement(obj)
  element(obj)
  $(obj).children(".element").each(function() {
    assignEventListeners(this);
  });
  $(obj).children("ul").children("li").each(function() {
    assignEventListeners(this);
  });
  return obj
}

function emitCreateCondtructorTree(){
  const children = []
  $(".constructorMain main, .constructorMain header, .constructorMain footer").children(".element").each((i,v)=>{
    children.push(getStructure(v))
  })
  return children
}
function getStructure(element) {
  const obj = {
    type: $(element).attr("class").split(" ")[1],
    properties: {}, 
    styles: [], 
    children: [] 
  };
  const inlineStyles =  $(element).attr("style").split(";").slice(0, $(element).attr("style").split(";").length-1)
  inlineStyles.forEach((value, index, array) => {
    obj.styles.push({
      styleName:value.split(": ")[0],
      styleValue: value.split(": ")[1]
    })
  })

  obj.properties["class"] = $(element).attr("class").replace("element ", "").replace("active", "")
  obj.properties["id"] = $(element).attr("id")
  console.log($(element).children().last())
  obj.properties["src"] = $($(element).children().last()).attr("src")
  obj.properties["href"] = $($(element).children().last()).attr("href")
  obj.properties["text"] = $($(element).children().last()).text()

  if($(element).children(".element").length == 0){
    $(element).children().last().children("li").children(".element").each((i,v)=>{
      obj.children.push(getStructure(v))
    });
  }else{
    $(element).children(".element").each((i,v)=>{
      obj.children.push(getStructure(v))
    });
  }

  return obj;
}