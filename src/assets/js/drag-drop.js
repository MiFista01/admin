let hoveredElement = "";
let hoveredBorder = "";
let topPX = 0;
let leftPX = 0;
let openElements = true;
let editingElement = ""
let hovered = false
$(document).ready(function () {
  $(".funcBtn").hide(0);
});
function setDragDrop() {
  $(".editor").hide(0);
  $(".btn-elements img").click(function (e) {
    //функция для включения выключения меню для элементов
    e.preventDefault();
    if (openElements) { //событие и jqCSS для закрытия панели на его ширину
      $(".elements").css("right", "-20vw");
      openElements = false;
    } else { //событие и jqCSS для открытия панели
      $(".elements").css("right", "0vw");
      openElements = true;
    }
  });

  $(document).bind("contextmenu", function (e) {
    //функция для выключения контекстного меню если есть скопированный элемент
    if ($(".copy-container").children().length > 0) { //проверка есть ли скопированный элемент
      $(".copy-container").empty(); //очистка дива для копирования
      $(".elements").css("right", "0vw"); //востановление панели элементов
      return false;
    }
    return true;
  });

  // $(".components .element ").click(function (e) {
  //   //функция для копирования элемента из компонентов
  //   e.preventDefault();
  //   if ($(this).hasClass("prime")) { //проверка на то что клик был именно по элементу в панели
  //     $(".copy-container").empty(); //очистка дива для копирования
  //     let element = $(this).clone(); // клонирование элемента по которому был клик
  //     $(element).removeClass("prime"); //удаление класса у скопированного элемента
  //     $(".copy-container").append(element); //добавление скопированного элемента в див для перемещения
  //     let width = $(element).width(); //получение ширины элемента
  //     let height = $(element).height(); //получение высоты элемента
  //     $($(".copy-container").children()[0]).css("top",topPX - height * 2.5 + "px"); //установка начальной позици скопированного элемента
  //     $($(".copy-container").children()[0]).css("left",leftPX - width * 1.5 + "px"); //установка начальной позици скопированного элемента
  //     $(".elements").css("right", "-20vw");
  //   }
  // });

  $("body").mousemove(function (e) {
    //функция для перемещение скопированного элемента из компонентов
    // values: e.clientX, e.clientY, e.pageX, e.pageY
    topPX = e.pageY; //установка координат мыши
    leftPX = e.pageX; //установка координат мыши
    let width = $($(".copy-container").children()[0]).width();
    let height = $($(".copy-container").children()[0]).height();
    $($(".copy-container").children()[0]).css("top",topPX - height * 2.5 + "px"); //установка позици скопированного элемента
    $($(".copy-container").children()[0]).css("left",leftPX - width * 1.5 + "px"); //установка позици скопированного элемента
  });

  $(".constructor .element, .constructor .access-point").click(function (e) {//установка функции при событии клика по классу .element
    e.preventDefault();
    if ($(".copy-container").children().length > 0) { //проверка есть ли скопированный элемент
      let element = createElement(this, 0); //запуск функции создания элемента с модом "добавить"
    }
  });
}
function createElement(parent, insertMod, child = null) {
  //функция для вставки элемента в зависимости от мода вставки
  if (($(".copy-container").children().length > 0 || child != null) && ($(parent).hasClass("section") || $(parent).hasClass("area") || $(parent).hasClass("access-point"))) { //проверка есть ли скопированный элемент
    let element
    if(child == null){
      element = $($(".copy-container").children()[0]).clone();
    }else{
      element = $(child).clone();
    }
    let border = ""; //значение для проверки по чему был клик
    $(element).css("top", "0px"); //обнуление позиции
    $(element).css("left", "0px"); //обнуление позиции
    $(".elements").css("right", "0vw"); //востановлении панели
    $(".copy-container").empty(); //очитска дива для копирования
    $(element).mouseenter(function (e) {//событие входа мыши в элемент
      showHideFunc(this, true);
      showHideFunc(e.relatedTarget, false);
    });
    $(element).mouseleave(function (e) {//событие выхода мыши в элемент
      showHideFunc(this, false);
      showHideFunc(e.relatedTarget, true);
    });
    $($(element).children(".border")).click(function (e) { //событие клика по классу .border
      e.preventDefault();
      if ($(this).hasClass("border1") || $(this).hasClass("border3")) { //проверка классов
        border = "before";
      } else {
        border = "after";
      }
    });
    // Добавляем обработчик события клика
    $(element).click(function (e) { //установка клика самой мыши
      e.preventDefault();
      let mod;
      if (border == "") { //установка мода для добавления элемента
        mod = 0;
      } else {
        if (border == "before") {
          mod = 1;
        } else {
          mod = 2;
        }
        border = "";
      }
      // Создаем новый элемент рекурсивно
      let newElement = createElement(this, mod); //рекурсивный запуск той же функции
    });

    $($($(element).children(".funcBtn")).find(".delete")).click(function (e) { 
      e.preventDefault();
      showHidePlaceholder(this, insertMod, parent)
    });

    $($($(element).children(".funcBtn")).find(".edit")).click(function (e) { 
      e.preventDefault();
      $($(".editor").find("h3")).text($($($(this).parent()).parent()).attr("class").split(" ")[1] + " styles");
      editingElement = $($(this).parent()).parent()
      let styles = $(editingElement).attr('style').split(";")
      styles.splice(styles.length-1, 1)
      setEditorOptions(Array.from($(editingElement).prop('classList')), styles)
      $(".editor").show(100);
    });

    $($($(element).children(".funcBtn")).find(".configuration")).click(function (e) { 
      e.preventDefault();
      $($(".configurator").find("h3")).text($($($(this).parent()).parent()).attr("class").split(" ")[1] + " configs");
      editingElement = $($(this).parent()).parent()
      editConfiguratorFormClass($($($(this).parent()).parent()).attr("class").split(" ")[1])
      const angularComponent = document.querySelector('app-uploaded-gallery');
      const startLoopButton = angularComponent.querySelector('button');
      $(startLoopButton).trigger('click');
      $(".configurator").show(100);
    });

    $($($(element).children(".funcBtn")).find(".move")).click(function (e) { 
      e.preventDefault();
      let element = $($(this).parent()).parent()
      let movedElement = $(element).clone();
      $(".elements").css("right", "-20vw");
      $(element).hide(100, ()=>{
        for(const child of $(movedElement).children()){
          if(!$(child).hasClass("border") && !$(child).hasClass("placeholder") && !$(child).hasClass("funcBtn")){
            $(child).hide(0);
          }
        }
        $(".copy-container").append(movedElement);
        let width = $($(".copy-container").children()[0]).width();
        let height = $($(".copy-container").children()[0]).height();
        $($(".copy-container").children()[0]).css("left",leftPX - width * 1.5 + "px"); //установка позици скопированного элемента
        $($(".copy-container").children()[0]).css("top",topPX - height * 2.5 + "px"); //установка позици скопированного элемента
        $(element).remove();
        showHidePlaceholder(this, insertMod, parent)
      });
    });

    for(const child of $(element).children()){
      if(!$(child).hasClass("border") && !$(child).hasClass("placeholder") && !$(child).hasClass("funcBtn")){
        $(child).show(0);
        createElement(element, 0, child)
        if(!$(child).hasClass("editible-configurator")){
          $(child).remove();
        }
      }else if(!$(child).hasClass("placeholder")){
        $(child).hide(0);
      }
    }

    if (insertMod == 0) { //проверка на мод вставки
      $(parent).append(element);
      $(parent).addClass("hide-placeholder");
      $($(parent).children(".placeholder")).hide(0);
    } else if (insertMod == 1) {
      $(parent).before(element);
    } else {
      $(parent).after(element);
    }
    return element;
  }
}
function showHideFunc(obj, status) {
  if (!$(obj).hasClass("prime")) {
    if(!$(obj).hasClass("element")){
      for(const i of $(obj).parents()){
        if($(i).hasClass("element") && !$(i).hasClass("prime")){
          obj = i;
          break;
        }
      }
    }
    if (status) {
      $($(obj).children(".border")).show(0);
      $($(obj).children(".border1")).css("height", "10px");
      $($(obj).children(".border2")).css("height", "10px");
      $($(obj).children(".border3")).css("width", "10px");
      $($(obj).children(".border4")).css("width", "10px");
      if($(".copy-container").children().length == 0){
        $($(obj).children(".funcBtn")).slideDown(200);
      }
    } else {
      $($(obj).children(".border1")).css("height", "0px");
      $($(obj).children(".border2")).css("height", "0px");
      $($(obj).children(".border3")).css("width", "0px");
      $($(obj).children(".border4")).css("width", "0px");
      $($(obj).children(".funcBtn")).slideUp(200);
    }
  }
}
function showHidePlaceholder(element, mod, parent){
  $($($(element).parent()).parent()).hide(100, ()=>{
    let par
    if(mod != 0){
      par = $($($(element).parent()).parent()).parent();
    }else{
      par = parent
    }
    $($($(element).parent()).parent()).remove();
    if($(par).children(".element").length > 0){
      $($(par).children(".placeholder")).hide();
    }else{
      $($(par).children(".placeholder")).show();
    }
    
  });
}