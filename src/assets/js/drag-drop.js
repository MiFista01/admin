var topMousePos = 0
var leftMousePos = 0
var insertMod = 0
var moveStatus = false
var edititingElement = ""
function initDragDrop(){
  // toggleMenuElements()
  element(".element")  //создание элементов созданные для перетаскивания
  moveElement()  //функция для перетаскивания элементов в диведля клонирования
  contextMenu()
  $(".bg").click(()=>{ //функция для закрытия формы для изменения
    hideForm()
    $("#countItem").val(0);
  });
}

function moveElement(){ //функция для перетаскивания
  $("body").mousemove(function (e) { 
    // values: e.clientX, e.clientY, e.pageX, e.pageY
    var offset = $(".constructorMain").offset();  //получение элемента в котором находится див для клонирования
    if(offset){
      var top = offset.top;  //получение позиции по высоте
      var left = offset.left;  //получение позиции по ширине
      topMousePos = e.pageY-top  //позиция относительно мыши и контейнера по высоте
      leftMousePos = e.pageX-left  //позиция относительно мыши и контейнера по ширине
      $($(".clone-container").children()[0]).css("top", topMousePos+"px");  //установка позиции клонированному элементу
      $($(".clone-container").children()[0]).css("left", leftMousePos+"px");  //установка позиции клонированному элементу
    }
  });
}
function contextMenu(){ //функция для изменения поведения правой кнопки мыши
  $(document).bind("contextmenu", function (e) {
    if ($(".clone-container").children().length > 0) {  //проверка на клонированный элемент
      $(".clone-container").empty();  //очистка контейнера для клонирования
      return false;  // если контейнер не пуст то тогда отменяется обычное поведение
    }
    return true;
  });
}
function element(obj){  //функция для создания элементов
  const borders = $(obj).children(".borders").children(); //получение бордеров элемента
  $(borders).click(function (e) {  //присвоение прослушивателя клика для установки мода вставки
    e.preventDefault();
    let borderNmb = $(this).attr("class").split(" ")[1].replace("border","")
    if(borderNmb == 1 || borderNmb == 3){
      insertMod = 1
    }else if(borderNmb == 2 || borderNmb == 4){
      insertMod = 2
    }
  });
  
  
  $(obj).click(function (e) {  //присвоение прослушивателя клика самому элементу
    e.preventDefault();
    const cloneElement = $(".clone-container").children() //получение клонированного элемента
    if(!moveStatus){  //проверка на перемещение элемента
      if (cloneElement.length == 0 && $(this).hasClass("prime") && $(this).attr("dropzone") !== "true"){  //проверкана для вставки в контейнер клонирования
        appendtoClone(this)
      }else if(($(this).attr("dropzone") === "true" || insertMod != 0) && cloneElement.length != 0){  //проверка уна вставку 
        insertTo(this)
      }
    }
    moveStatus = false
  });
}

function hover(obj){  //функция для проверки наведённого элемента
  $(obj).hover(function (e) {
    if($(this).hasClass("element")){  //проверка на главный класс
      $(".element").removeClass("active");  //удаление класса для выделения
      if(!$($(this).children(".element")).hasClass("active")){  //проверка на класс выделения у детей нынешнего наведённого элемента
        $(this).addClass("active");  //добавление класса актива нынешнему элементу
      }
    }
    
  }, function (e) {
    if($(this).hasClass("element") && $(e.relatedTarget).hasClass("element")){ //проверка на главный классу нынешнего наведённого и прошлого наведённого элемента
      $(this).removeClass("active");  //удаление у нынешнего элемента класса актив
      if(!$(e.relatedTarget).hasClass(".element")){  //проверка на не наличие главного класса у элемента к которому пришли
        $($(e.relatedTarget).parents(".element")[0]).addClass("active");  //когда класса нету ищется первый родитель с главным классом и ему добавляется класс актив
      }else{
        $(e.relatedTarget).addClass("active"); //добавление класса актив к элементу к которому перешлт
      }
    }
  });
}
function move(obj){  //функция для добавлении функции перемещения
  $($(obj).children(".funcBtns").children(".move")).click(function (e) {
    e.preventDefault();
    
    if($(obj).parent().children(".element").length-1 <= 0){  //проверка на наличие детей с главным классом у родителя обьекта
      $($(obj).parent()).attr("placeholder", $($(obj).parent()).attr("class").split(" ")[1]);  //если детей нету берётся главый класс типа и пихается в атрибут 
      $($(obj).parent()).addClass("active");  //добавление класса актив родителю обьекта
    }
    moveStatus = true
    appendtoClone(obj) // добавление обьекта в клонированный контейнер
    $(obj).remove();  //удаление обьекта
  });
}
function deleteElement(obj){  //функция для удаление обьекта
  $($(obj).children(".funcBtns").children(".delete")).click(function (e) {
    e.preventDefault();
    if($(obj).parent().children(".element").length-1 <= 0){  //проверка на наличие детей с главным классом у родителя нынешнего обьекта
      $($(obj).parent()).attr("placeholder", $($(obj).parent()).attr("class").split(" ")[1]);  //если детей нету берётся главый класс типа и пихается в атрибут 
    }
    $(obj).hide(200, ()=>{  //сокрытие обьекта
      $(obj).remove();  //удаление обьекта
    });
  });
}
function initForms(obj) {  //инициализация формы
  $($(obj).children(".funcBtns").children(".configurator")).click(function (e) {  //присвоение прослушивателя для кнопки конфигуратора 
    e.preventDefault();
    $(".elementType").text($(obj).attr("class").split(" ")[1]); //присвоение текста в форме основываясь на тип обьекта
    if($(obj).hasClass("paragraph") || $(obj).hasClass("section") || $(obj).hasClass("area")){ //проверка на тип обьекта
      $(".editorBtn").hide(0);  //сокрытие кнопки для перехода
    }else{
      $(".editorBtn").show(0); // показ кнопки
    }
    $(".forms").css("opacity", 1);
    $(".forms").css("pointer-events", "all");
    edititingElement = obj  //присвоение к переменной редактируемого элемента
    $(".conf").hide(0);  //сокрытие всех полей конфигуратора
    $(".conf-"+$(obj).attr("class").split(" ")[1]).show(0); //показ поля конфигуратора основываясь на типе обьекта
  });
}
function hideForm(){
  $(".forms").css("opacity", 0);
  $(".forms").css("pointer-events", "none");
}
function appendtoClone(obj){ //функция для вставки обьекта в контейнер для клонирования
  const cloneElement = $(obj).clone();  //клонирование обьекта
  $(cloneElement).css("top", topMousePos+"px");  //присвоение позиции мыши клонированному обьекту
  $(cloneElement).css("left", leftMousePos+"px");  //присвоение позиции мыши клонированному обьекту
  $(cloneElement).attr("placeholder", $(cloneElement).attr("class").split(" ")[1]);  //присвоение отрибута со значением типа обьекта
  $(cloneElement).removeClass("active"); // очистака на всякий от класса актив
  $(".clone-container").empty();  //очистка клонированного контейнера
  $(".clone-container").append(cloneElement);  //запись обьекта в контейнер для клонирования
  insertMod = 0
}

function insertTo(obj){ //вставка обьекта в другой обьекта
  const cloneElement = $($(".clone-container").children()[0]).clone(); //клонирование обьекта с контейнера для клонирования
  const mainClass = $(cloneElement).attr("class").split(" ")[1]  //получение главного класса
  if(mainClass == "section" || mainClass == "area" || mainClass == "btn"){ //проверка на класс
    $(cloneElement).attr("dropzone", true); //установка атрибута для повзоления вставки в сам элемент
  }
  $(cloneElement).removeClass("prime");  //удаления класса с основанный на коструктор
  $(cloneElement).css("top", "0px"); //обнуление высоты у элемента
  $(cloneElement).css("left", "0px");  //обнуление высоты у элемента
  const appendElement = assignEventListeners(cloneElement)  //присвоение слушателей для детей клонированного обьекта
  switch (insertMod) {  //проверка на мод кставки
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
function assignEventListeners(obj) {//присвоение всех созданных слушателей
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