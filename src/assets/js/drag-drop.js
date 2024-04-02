var menuStatus = true
var topMousePos = 0
var leftMousePos = 0
var insertMod = 0
function initDragDrop(){
  toggleMenuElements()
  element(".element")
  moveElement()
  contextMenu()
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
    var top = offset.top;
    var left = offset.left;
    topMousePos = e.pageY-top
    leftMousePos = e.pageX-left
    $($(".clone-container").children()[0]).css("top", topMousePos+"px");
    $($(".clone-container").children()[0]).css("left", leftMousePos+"px");
  });
}
function contextMenu(){
  $(document).bind("contextmenu", function (e) {
    if ($(".clone-container").children().length > 0) {
      $(".clone-container").empty();
      $(".showHideBtnElement").click();
      return false;
    }
    return true;
  });
}
function element(obj, deep){
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
    if ($(".clone-container").children().length == 0 && $(this).hasClass("prime")) {

      $(".showHideBtnElement").click();

      const cloneElement = $(this).clone();
      $(cloneElement).css("top", topMousePos+"px");
      $(cloneElement).css("left", leftMousePos+"px");

      $(".clone-container").empty();
      $(".clone-container").append(cloneElement);
      insertMod = 0

    }else if($(this).attr("dropzone") === "true" && $(".clone-container").children().length != 0){

      $(".showHideBtnElement").click();

      const cloneElement = $($(".clone-container").children()[0]).clone();
      $(cloneElement).attr("dropzone", true);
      $(cloneElement).removeClass("prime");
      $(cloneElement).css("top", "0px");
      $(cloneElement).css("left", "0px");

      const appendElement = element(cloneElement)
      
      $(".clone-container").empty();
      switch (insertMod) {
        case 0:
          $(this).append(cloneElement);
          $(this).attr("placeholder", "");
          break;
        case 1:
          $(this).before(cloneElement);
          break;
        case 2:
          $(this).after(cloneElement);
          break;
      }
      insertMod = 0
    }
  });
  $(obj).mouseenter(function () {
    if($(this).hasClass("element")){
      $(".element").removeClass("active");
      $(this).addClass("active");
    }
  });
  $(obj).mouseleave(function (e) {
    if($(this).hasClass("element")){
      $(this).removeClass("active");
      $(e.relatedTarget).addClass("active");
    }
  });
  return obj
}




// let hoveredElement = "";
// let hoveredBorder = "";
// let topPX = 0;
// let leftPX = 0;
// let openElements = true;
// let editingElement = ""
// let hovered = false
// $(document).ready(function () {
//   $(".funcBtn").hide(0);
// });
// function setDragDrop() {
//   $(".editor").hide(0);
//   $(document).bind("contextmenu", function (e) {
//     //функция для выключения контекстного меню если есть скопированный элемент
//     if ($(".clone-container").children().length > 0) { //проверка есть ли скопированный элемент
//       $(".clone-container").empty(); //очистка дива для копирования
//       $(".elements").css("right", "0px");
//       return false;
//     }
//     return true;
//   });
//   $(".btn-elements").click(function (e) { 
//     e.preventDefault();
//     openElements = !openElements
//     $(".elements").css("right", openElements? "0px": "-20vw");
//   });
//   $(".components .element ").click(function (e) {
//     //функция для копирования элемента из компонентов
//     e.preventDefault();
//     if ($(this).hasClass("prime")) { //проверка на то что клик был именно по элементу в панели
//       openElements = !openElements
//       $(".elements").css("right", openElements? "0px": "-20vw");
//       $(".clone-container").empty(); //очистка дива для копирования
//       let element = $(this).clone(); // клонирование элемента по которому был клик
//       $(element).removeClass("prime"); //удаление класса у скопированного элемента
//       $(".clone-container").append(element); //добавление скопированного элемента в див для перемещения
//       let differenceWidthPX = $("body").width()-$(".clone-container").width();
//       let differenceHeightPX = $("body").height()-$(".clone-container").height();
//       topPX = e.pageY - differenceHeightPX; //установка координат мыши
//       leftPX = e.pageX - differenceWidthPX; //установка координат мыши
//       let width = $($(".clone-container").children()[0]).width();
//       let height = $($(".clone-container").children()[0]).height();
//       $($(".clone-container").children()[0]).css("left",leftPX - width/2 + "px"); //установка позици скопированного элемента
//       $($(".clone-container").children()[0]).css("top",topPX - height/2 + "px"); //установка позици скопированного элемента
//     }
//   });

//   $("body").mousemove(function (e) {
//     //функция для перемещение скопированного элемента из компонентов
//     // values: e.clientX, e.clientY, e.pageX, e.pageY
//     if($(".clone-container").children().length > 0){
//       let differenceWidthPX = $("body").width()-$(".clone-container").width();
//       let differenceHeightPX = $("body").height()-$(".clone-container").height();
//       topPX = e.pageY - differenceHeightPX; //установка координат мыши
//       leftPX = e.pageX - differenceWidthPX; //установка координат мыши
//       let width = $($(".clone-container").children()[0]).width();
//       let height = $($(".clone-container").children()[0]).height();
//       $($(".clone-container").children()[0]).css("left",leftPX - width/2 + "px"); //установка позици скопированного элемента
//       $($(".clone-container").children()[0]).css("top",topPX - height/2 + "px"); //установка позици скопированного элемента
//     }
//   });

//   $(".constructor .element, .constructor .access-point").click(function (e) {//установка функции при событии клика по классу .element
//     e.preventDefault();
//     if ($(".clone-container").children().length > 0) { //проверка есть ли скопированный элемент
//       let element = createElement(this, 0); //запуск функции создания элемента с модом "добавить"
//       openElements = true
//       $(".elements").css("right", openElements? "0px": "-20vw");
//     }
//   });
// }
// function createElement(parent, insertMod, child = null) {
//   openElements = true
//   $(".elements").css("right", openElements? "0px": "-20vw");
//   console.log(openElements)
//   //функция для вставки элемента в зависимости от мода вставки
//   if (($(".clone-container").children().length > 0 || child != null) && ($(parent).hasClass("section") || $(parent).hasClass("area") || $(parent).hasClass("access-point"))) { //проверка есть ли скопированный элемент
//     let element
//     if(child == null){
//       element = $($(".clone-container").children()[0]).clone();
//     }else{
//       element = $(child).clone();
//     }
//     let border = ""; //значение для проверки по чему был клик
//     $(element).css("top", "0px"); //обнуление позиции
//     $(element).css("left", "0px"); //обнуление позиции
//     $(".clone-container").empty(); //очитска дива для копирования
//     $(element).mouseenter(function (e) {//событие входа мыши в элемент
//       showHideFunc(this, true);
//       showHideFunc(e.relatedTarget, false);
//     });
//     $(element).mouseleave(function (e) {//событие выхода мыши в элемент
//       showHideFunc(this, false);
//       showHideFunc(e.relatedTarget, true);
//     });
//     $($(element).children(".border")).click(function (e) { //событие клика по классу .border
//       e.preventDefault();
//       if ($(this).hasClass("border1") || $(this).hasClass("border3")) { //проверка классов
//         border = "before";
//       } else {
//         border = "after";
//       }
      
//     });
//     // Добавляем обработчик события клика
//     $(element).click(function (e) { //установка клика самой мыши
//       e.preventDefault();
//       let mod;
//       if (border == "") { //установка мода для добавления элемента
//         mod = 0;
//       } else {
//         if (border == "before") {
//           mod = 1;
//         } else {
//           mod = 2;
//         }
//         border = "";
//       }
//       // Создаем новый элемент рекурсивно
//       let newElement = createElement(this, mod); //рекурсивный запуск этой же функции
//     });

//     $($($(element).children(".funcBtn")).find(".delete")).click(function (e) { 
//       e.preventDefault();
//       showHidePlaceholder(this, insertMod, parent)
//     });

//     $($($(element).children(".funcBtn")).find(".edit")).click(function (e) { 
//       e.preventDefault();
//       $($(".editor").find("h3")).text($($($(this).parent()).parent()).attr("class").split(" ")[1] + " styles");
//       editingElement = $($(this).parent()).parent()
//       let styles = $(editingElement).attr('style').split(";")
//       styles.splice(styles.length-1, 1)
//       setEditorOptions(Array.from($(editingElement).prop('classList')), styles)
//       $(".editor").show(100);
//     });

//     $($($(element).children(".funcBtn")).find(".configuration")).click(function (e) { 
//       e.preventDefault();
//       $($(".configurator").find("h3")).text($($($(this).parent()).parent()).attr("class").split(" ")[1] + " configs");
//       editingElement = $($(this).parent()).parent()
//       editConfiguratorFormClass($($($(this).parent()).parent()).attr("class").split(" ")[1])
//       const angularComponent = document.querySelector('app-uploaded-gallery');
//       const startLoopButton = angularComponent.querySelector('button');
//       $(startLoopButton).trigger('click');
//       $(".configurator").show(100);
//     });

//     $($($(element).children(".funcBtn")).find(".move")).click(function (e) { 
//       e.preventDefault();
//       let element = $($(this).parent()).parent()
//       let movedElement = $(element).clone();
//       $(element).hide(100, ()=>{
//         for(const child of $(movedElement).children()){
//           if(!$(child).hasClass("border") && !$(child).hasClass("placeholder") && !$(child).hasClass("funcBtn")){
//             $(child).hide(0);
//           }
//         }
//         $(".clone-container").append(movedElement);
//         let width = $($(".clone-container").children()[0]).width();
//         let height = $($(".clone-container").children()[0]).height();
//         $($(".clone-container").children()[0]).css("left",leftPX - width * 1.5 + "px"); //установка позици скопированного элемента
//         $($(".clone-container").children()[0]).css("top",topPX - height * 2.5 + "px"); //установка позици скопированного элемента
//         $(element).remove();
//         showHidePlaceholder(this, insertMod, parent)
//         openElements = false
//         $(".elements").css("right", openElements? "0px": "-20vw");
//       });
//     });

//     for(const child of $(element).children()){
//       if(!$(child).hasClass("border") && !$(child).hasClass("placeholder") && !$(child).hasClass("funcBtn")){
//         $(child).show(0);
//         createElement(element, 0, child)
//         if(!!$(child).attr("editible")){
//           $(child).remove();
//         }
//       }else if(!$(child).hasClass("placeholder")){
//         $(child).hide(0);
//       }
//     }

//     if (insertMod == 0) { //проверка на мод вставки
//       $(parent).append(element);
//       $(parent).addClass("hide-placeholder");
//       $($(parent).children(".placeholder")).hide(0);
//     } else if (insertMod == 1) {
//       $(parent).before(element);
//     } else {
//       $(parent).after(element);
//     }
//     return element;

//   }
// }
// function showHideFunc(obj, status) {
//   if (!$(obj).hasClass("prime")) {
//     if(!$(obj).hasClass("element")){
//       for(const i of $(obj).parents()){
//         if($(i).hasClass("element") && !$(i).hasClass("prime")){
//           obj = i;
//           break;
//         }
//       }
//     }
//     if (status) {
//       $($(obj).children(".border")).show(0);
//       $($(obj).children(".border1")).css("height", "10px");
//       $($(obj).children(".border2")).css("height", "10px");
//       $($(obj).children(".border3")).css("width", "10px");
//       $($(obj).children(".border4")).css("width", "10px");
//       if($(".clone-container").children().length == 0){
//         $($(obj).children(".funcBtn")).slideDown(200);
//       }
//     } else {
//       $($(obj).children(".border1")).css("height", "0px");
//       $($(obj).children(".border2")).css("height", "0px");
//       $($(obj).children(".border3")).css("width", "0px");
//       $($(obj).children(".border4")).css("width", "0px");
//       $($(obj).children(".funcBtn")).slideUp(200);
//     }
//   }
// }
// function showHidePlaceholder(element, mod, parent){
//   $($($(element).parent()).parent()).hide(100, ()=>{
//     let par
//     if(mod != 0){
//       par = $($($(element).parent()).parent()).parent();
//     }else{
//       par = parent
//     }
//     $($($(element).parent()).parent()).remove();
//     if($(par).children(".element").length > 0){
//       $($(par).children(".placeholder")).hide();
//     }else{
//       $($(par).children(".placeholder")).show();
//     }
    
//   });
// }