var topMousePos = 0;
var leftMousePos = 0;
var insertMod = 0;
var moveStatus = false;
var edititingElement = "";
function initDragDrop() {
  // toggleMenuElements()
  element(".element"); //создание элементов созданные для перетаскивания
  moveElement(); //функция для перетаскивания элементов в диведля клонирования
  contextMenu();
  $(".card .bg").click(() => {
    //функция для закрытия формы для изменения
    hideForm();
    $("#countItem").val(0);
  });
}
function initBody() {
  element("main .element, header .element, footer .element");
  hover("main .element, header .element, footer .element");
}
function moveElement() {
  //функция для перетаскивания
  $("body").mousemove(function (e) {
    // values: e.clientX, e.clientY, e.pageX, e.pageY
    var offset = $(".constructorMain").offset(); //получение элемента в котором находится див для клонирования
    if (offset) {
      var top = offset.top; //получение позиции по высоте
      var left = offset.left; //получение позиции по ширине
      topMousePos = e.pageY - top; //позиция относительно мыши и контейнера по высоте
      leftMousePos = e.pageX - left; //позиция относительно мыши и контейнера по ширине
      $($(".clone-container").children()[0]).css("top", topMousePos + "px"); //установка позиции клонированному элементу
      $($(".clone-container").children()[0]).css("left", leftMousePos + "px"); //установка позиции клонированному элементу
    }
  });
}
function contextMenu() {
  //функция для изменения поведения правой кнопки мыши
  $(document).bind("contextmenu", function (e) {
    if ($(".clone-container").children().length > 0) {
      //проверка на клонированный элемент
      $(".clone-container").empty(); //очистка контейнера для клонирования
      return false; // если контейнер не пуст то тогда отменяется обычное поведение
    }
    return true;
  });
}
function element(obj) {
  //функция для создания элементов
  const borders = $(obj).children(".borders").children(); //получение бордеров элемента
  $(borders).click(function (e) {
    //присвоение прослушивателя клика для установки мода вставки
    e.preventDefault();
    let borderNmb = $(this).attr("class").split(" ")[1].replace("border", "");
    if (borderNmb == 1 || borderNmb == 3) {
      insertMod = 1;
    } else if (borderNmb == 2 || borderNmb == 4) {
      insertMod = 2;
    }
  });

  $(obj).click(function (e) {
    //присвоение прослушивателя клика самому элементу
    e.preventDefault();
    const cloneElement = $(".clone-container").children(); //получение клонированного элемента
    //проверка на перемещение элемента
    if (
      cloneElement.length == 0 &&
      $(this).hasClass("prime") &&
      $(this).attr("dropzone") !== "true"
    ) {
      //проверкана для вставки в контейнер клонирования
      appendtoClone(this);
    } else if (
      ($(this).attr("dropzone") === "true" || insertMod != 0) &&
      cloneElement.length != 0 &&
      e.target.tagName != "IMG"
    ) {
      //проверка на вставку
      insertTo(this);
    }
  });
}

function hover(obj) {
  //функция для проверки наведённого элемента
  $(obj).hover(
    function (e) {
      if (
        $(this).hasClass("element") &&
        $(obj)[0].nodeName.toLowerCase() != "li" &&
        !$($(obj).parent()).hasClass("db-conector")
      ) {
        //проверка на главный класс
        $(".element").removeClass("active"); //удаление класса для выделения
        if (!$($(this).children(".element")).hasClass("active")) {
          //проверка на класс выделения у детей нынешнего наведённого элемента
          $(this).addClass("active"); //добавление класса актива нынешнему элементу
        }
      }
    },
    function (e) {
      if (
        $(this).hasClass("element") &&
        $(obj)[0].nodeName.toLowerCase() != "li"
      ) {
        //проверка на главный классу нынешнего наведённого и прошлого наведённого элемента
        $(this).removeClass("active"); //удаление у нынешнего элемента класса актив
        if($(obj).parent(".element").length > 0){
            if($(obj).parent(".element")[0].nodeName.toLowerCase() == "li"){
              $($(obj).parents(".element")[1]).addClass("active")
            }else{
              if($(e.relatedTarget).hasClass("borders")){
                $($(e.relatedTarget).parent()).addClass("active"); //добавление класса актив к элементу к которому перешлт
              }else{
                $(e.relatedTarget).addClass("active"); //добавление класса актив к элементу к которому перешлт
              }
            }
        }
      }
    }
  );
}
function move(obj) {
  //функция для добавлении функции перемещения
  $($(obj).children(".funcBtns").children(".move")).click(function (e) {
    e.preventDefault();

    if ($(obj).parent().children(".element").length - 1 <= 0) {
      //проверка на наличие детей с главным классом у родителя обьекта
      $($(obj).parent()).attr(
        "placeholder",
        $($(obj).parent()).attr("class").split(" ")[1]
      ); //если детей нету берётся главый класс типа и пихается в атрибут
      $($(obj).parent()).addClass("active"); //добавление класса актив родителю обьекта
    }
    moveStatus = true;
    appendtoClone(obj); // добавление обьекта в клонированный контейнер
    $(obj).remove(); //удаление обьекта
  });
}
function deleteElement(obj) {
  //функция для удаление обьекта
  $($(obj).children(".funcBtns").children(".delete")).click(function (e) {
    e.preventDefault();
    if ($(obj).parent().children(".element").length - 1 <= 0) {
      //проверка на наличие детей с главным классом у родителя нынешнего обьекта
      $($(obj).parent()).attr(
        "placeholder",
        $($(obj).parent()).attr("class").split(" ")[1]
      ); //если детей нету берётся главый класс типа и пихается в атрибут
    }
    $(obj).hide(200, () => {
      //сокрытие обьекта
      $(obj).remove(); //удаление обьекта
    });
  });
}
function initForms(obj) {
  //инициализация формы
  $($(obj).children(".funcBtns").children(".configurator")).click(function (e) {
    //присвоение прослушивателя для кнопки конфигуратора
    e.preventDefault();
    $(".elementType").text($(obj).attr("class").split(" ")[1]); //присвоение текста в форме основываясь на тип обьекта
    if (
      $(obj).hasClass("paragraph") ||
      $(obj).hasClass("section") ||
      $(obj).hasClass("area")
    ) {
      //проверка на тип обьекта
      $(".editorBtn").hide(0); //сокрытие кнопки для перехода
    } else {
      $(".editorBtn").show(0); // показ кнопки
    }
    $(".forms").css("opacity", 1);
    $(".forms").css("pointer-events", "all");
    edititingElement = obj; //присвоение к переменной редактируемого элемента
    $(".conf").hide(0); //сокрытие всех полей конфигуратора
    $(".conf-" + $(obj).attr("class").split(" ")[1]).show(0); //показ поля конфигуратора основываясь на типе обьекта
    $("#styles").click();
    if ($(obj).hasClass("video")) {
      $("#preview").click();
    }
  });
}
function hideForm() {
  $(".forms").css("opacity", 0);
  $(".forms").css("pointer-events", "none");
}
function returnActiveStyles() {
  const objStyle = $(edititingElement)
    .attr("style")
    .split(";")
    .map((value) => {
      return value.split(":")[0].replace(" ", "");
    });
  return objStyle.filter((value, index, array) => {
    return value != "";
  });
}
function appendtoClone(obj) {
  //функция для вставки обьекта в контейнер для клонирования
  const cloneElement = $(obj).clone(); //клонирование обьекта
  $(cloneElement).css("top", topMousePos + "px"); //присвоение позиции мыши клонированному обьекту
  $(cloneElement).css("left", leftMousePos + "px"); //присвоение позиции мыши клонированному обьекту
  $(cloneElement).attr(
    "placeholder",
    $(cloneElement).attr("class").split(" ")[1]
  ); //присвоение отрибута со значением типа обьекта
  $(cloneElement).removeClass("active"); // очистака на всякий от класса актив
  $(".clone-container").empty(); //очистка клонированного контейнера
  $(".clone-container").append(cloneElement); //запись обьекта в контейнер для клонирования
  insertMod = 0;
}

function insertTo(obj) {
  //вставка обьекта в другой обьекта
  const cloneElement = $($(".clone-container").children()[0]).clone(); //клонирование обьекта с контейнера для клонирования
  const mainClass = $(cloneElement).attr("class").split(" ")[1]; //получение главного класса
  if (mainClass == "section" || mainClass == "area") {
    //проверка на класс
    $(cloneElement).attr("dropzone", true); //установка атрибута для повзоления вставки в сам элемент
  }
  $(cloneElement).removeClass("prime"); //удаления класса с основанный на коструктор
  $(cloneElement).attr(
    "style",
    $(cloneElement)
      .attr("style")
      .split(";")
      .filter((item) => {
        return !item.includes("top:") && !item.includes("left:") && item != "";
      })
      .join(";")
  );
  const appendElement = assignEventListeners(cloneElement); //присвоение слушателей для детей клонированного обьекта
  switch (
    insertMod //проверка на мод кставки
  ) {
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
  insertMod = 0;
}
function assignEventListeners(obj) {
  //присвоение всех созданных слушателей
  hover(obj);
  move(obj);
  initForms(obj);
  deleteElement(obj);
  element(obj);
  $(obj)
    .children(".element")
    .each(function () {
      assignEventListeners(this);
    });
  $(obj)
    .children("ul")
    .children("li")
    .each(function () {
      assignEventListeners(this);
    });
  return obj;
}

function emitCreateCondtructorTree(parent) {
  const children = [];
  $(`.constructorMain ${parent}`)
    .children(".element")
    .each((i, v) => {
      children.push(getStructure(v));
    });
  return [
    children,
    $(`.constructorMain ${parent}`)
      .clone()
      .html()
      .replaceAll(
        /(?:\s+[_]?ng[-\w]*=\"[^\"]*\")|(?:\s+ng-reflect[-\w]*=\"[^\"]*\")/gi,
        ""
      )
      .replaceAll(/\\/g, ""),
  ];
}
function getStructure(element) {
  
  const obj = {
    type: $(element).attr("class").split(" ")[1],
    properties: {},
    styles: [],
    children: [],
  };
  if (
    $(element).hasClass("section") ||
    $(element).hasClass("area") ||
    $(element).hasClass("list")
  ) {
  } else {
    obj.properties["text"] = $($(element).children().last()).text();
  }
  obj.properties["class"] = $(element)
    .attr("class")
    .replace("active", "")
    .replace("element", "");
  obj.properties["id"] = $(element).attr("id");
  if ($(element).hasClass("social-btn")) {
    obj.properties["src"] = $($(element).children().last().find("img")).attr(
      "src"
    );
  } else {
    obj.properties["src"] = $($(element).children().last()).attr("src");
  }
  obj.properties["href"] = $($(element).children().last()).attr("href");
  if ($(element).hasClass("title")) {
    obj.properties["titleType"] = $(
      $(element).children().last()
    )[0].nodeName.toLowerCase();
  }
  if ($(element).hasClass("swipers")) {
    obj.properties["slides"] = $(element).attr("slides");
  }
  obj.styles = $(element).attr("style");

  if ($(element).hasClass("list")) {
    ;
    $(element)
      .children()
      .last()
      .children("li")
      .each((i, v) => {
        const liChildren = []
        $(v).children(".element").each((i, v) => {
          liChildren.push(getStructure(v));
        });;
        obj.children.push(liChildren)
      });
  }else {
    $(element)
      .children(".element")
      .each((i, v) => {
        obj.children.push(getStructure(v));
      });
  }
  return obj;
}
function setHTML(parent, schema) {
  $(parent).html(schema);
  assignEventListeners(parent);
}
