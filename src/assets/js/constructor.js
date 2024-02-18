// import { editingElement } from "./drag-drop";
var tagSelect = $("<select>", {
    html: `
      <option value="px" selected>px</option>
      <option value="%">%</option>
      <option value="vw">vw</option>
      <option value="vh">vh</option>
      <option value="em">em</option>
    `,
});
let optionsEditor1 = []
let optionsEditor2 = []
let notUsedClasses = ["element"]
let cssDirections = ["left", "right", "top", "bottom"]
$(document).ready(function () {
    for (const child of $("#options-editor1").children()) {
        optionsEditor1.push(child)
    }
    for (const child of $("#options-editor2").children()) {
        optionsEditor2.push(child)
    }
    for (const child of $(".elements").children()) {
        notUsedClasses.push(Array.from($(child).prop('classList'))[1])
    }
});
var formFieldsValues = {};
function setEditor() {
    $(".editor .bg-dark").click(function (e) {
        e.preventDefault();
        editingElement = "";
        formFieldsValues = {};
        $("#options-editor1").empty();
        for (const child of optionsEditor1) {
            $("#options-editor1").append(child);
        }
        $("#options-editor1").val("--");
        $("#options-editor2").empty();
        for (const child of optionsEditor2) {
            $("#options-editor2").append(child);
        }
        $("#options-editor2").val("--");
        $(".options-container").empty();
        $(".editor").hide(100);
    });

    $("#options-editor1, #options-editor2").change(function (e) {
        //функция для добавления свойств к элементу
        e.preventDefault();
        if ($(this).val() != "--") {
            //проверка что select был не пуст
            for (let j of $(this).children()) {
                //передирания всех option
                if ($(j).attr("value") == $(this).val()) {
                    createOption($(j).text(), $(j).attr("type"), $(j).attr("value"), null, $(j).attr("add") === "true");
                    $(j).remove(); //удаления option
                    break;
                }
            }
        }
    });

    $(".options").submit(function (e) {
        e.preventDefault();
        $(editingElement).addClass("modified");
        for (const key in formFieldsValues) {
            if (key != "class" && key != "id") {
                $(editingElement).css(key, formFieldsValues[key]);
            } else {
                if (key == "class") {
                    $(editingElement).addClass(formFieldsValues[key]);
                }else{
                    $(editingElement).attr("id", formFieldsValues[key]);
                }
            }
        }
        $("#resultCSS").show(200, () => {
            setTimeout(() => {
                $("#resultCSS").hide(200);
            }, 600);
        });
    });
}

function createOption(text, type, value, setValue = null, add = true) {
    //проверка на соотвецвие выьора и значения
    let part1
    let part2
    let alpha = ""
    let div = document.createElement("div"); //создания контейнера
    div.className = `option ${value}`; //добавления класса
    if (text != "") {
        let name = document.createElement("p"); //создание название свойства
        $(name).text(text + ":"); //присвоение текста
        div.appendChild(name); //добавление в контейнер
    }
    if(!type.includes("select")){
        let input;
        //проверка типа у option
        if (type == "textarea") {
            //установка типа инпута
            input = document.createElement("textarea");
            formFieldsValues[value] = $(input).val();
            input.select()
        } else if (type != "select") {
            input = document.createElement("input");
            input.type = type;
            formFieldsValues[value] = $(input).val();
            if (type == "number" && value != "flex-grow") {
                $(input).val(0);
                input.step = 0.1;
            }else if(value == "flex-grow"){
                $(input).val(2);
            }
        }
        if(type != "color"){
            $(input).click(function (e) { 
                e.preventDefault();
                this.select()
            });
        }
        $(input).on("input", function (e) {
            e.preventDefault();
            formFieldsValues[value] = $(this).val();
            if ($("[name='select-" + value + "']").length != 0) {
                formFieldsValues[value] += $("[name='select-" + value + "']").val();
            }
            if ($("[name='range-" + value + "']").length != 0) {
                formFieldsValues[value] = hexToRgbWithAlpha(
                    $(this).val(),
                    $("[name='range-" + value + "']").val()
                );
            }
        });
        input.name = value; //установка имени инпута
        if (setValue != null) {
            if (add) {
                if (type == "color") {
                    let rgbValues = setValue.replace("rgb(", "").replace("rgba(", "").replace(")", "").split(",")
                    $(input).val(rgbToHex(parseInt(rgbValues[0]), parseInt(rgbValues[1]), parseInt(rgbValues[2])));
                    if (rgbValues.length == 4) {
                        alpha = rgbValues[3]
                    }
                } else {
                    part1 = setValue.match(/([\d.]+)([a-zA-Z%]+)/)[1]
                    part2 = setValue.match(/([\d.]+)([a-zA-Z%]+)/)[2]
                    if (type != "textarea") {
                        if(type == "number"){
                            $(input).val(parseInt(part1));
                        }else if(type == "text"){
                            $(input).val(setValue);
                        }
                    } else {
                        $(input).val(setValue);
                    }
                }
            } else {
    
                if (type != "textarea") {
                    if(type == "number"){
                        $(input).val(parseInt(setValue));
                    }else if(type == "text"){
                        $(input).val(setValue);
                    }
                } else {
                    $(input).val(setValue);
                }
            }
            formFieldsValues[value] = $(input).val();
        }
        div.appendChild(input); //добавление в контейнер инпут
    
        if (type == "number") {
            //проверка на определённый тип
            if (add) {
                let select = $(tagSelect).clone(); //клонирование загатовки
                $(select).attr("name", "select-" + value); //присвоение имени для заготовки
                $(select).change(function (e) {
                    e.preventDefault();
                    formFieldsValues[value] =
                        $("[name='" + value + "']").val() + $(this).val();
                });
                if (setValue != null && add) {
                    $(select).val(part2);
                }
                $(div).append(select); //добавление в контейнер
    
                formFieldsValues[value] = $(input).val() + $(select).val();
            }
            else {
                formFieldsValues[value] = $(input).val()
            }
        }
        if (type == "color") {
            if (add) {
                let range = document.createElement("input");
                range.type = "range";
                range.min = 0;
                range.max = 1;
                range.step = 0.1;
                range.name = "range-" + value;
                $(range).on("input", function (e) {
                    e.preventDefault();
                    formFieldsValues[value] = hexToRgbWithAlpha(
                        $("[name='" + value + "']").val(),
                        $(this).val()
                    );
                });
                if (alpha != "") {
                    range.value = parseFloat(alpha)
                }
                $(div).append(range);
                formFieldsValues[value] = hexToRgbWithAlpha(
                    $(input).val(),
                    $(range).val()
                );
            } else {
                formFieldsValues[value] = $(input).val()
            }
        }
    }
    
    let deleteBtn = document.createElement("img");
    deleteBtn.src = "assets/imgs/constructor/delete-option.png";
    $(deleteBtn).click(function (e) {
        e.preventDefault();
        $(editingElement).css(
            $($($(this).parent()).children()[1]).attr("name"), "");
        if ($($(this).parent()).hasClass("class")) {
            let classes = $($($(this).parent()).children()[1]).val();
            for (const removeClass of classes.split(" ")) {
                $(editingElement).removeClass(removeClass);
            }
        }
        if ($($(this).parent()).hasClass("id")) {
            $(editingElement).removeAttr("id");
        }
        for(const i of optionsEditor1){
            if($(i).val() == $($(this).parent()).attr("class").split(" ")[1]){
                $("#options-editor1").append(i);
                $("#options-editor1").val("--");
                break
            }
        }
        for(const i of optionsEditor2){
            if($(i).val() == $($(this).parent()).attr("class").split(" ")[1]){
                $("#options-editor2").append(i);
                $("#options-editor2").val("--");
                break
            }
        }
        delete formFieldsValues[value];
        $($(this).parent()).hide(100, () => {
            $($(this).parent()).remove();
        });
    });
    $(div).append(deleteBtn);
    $(".options-container").append(div); //добавление контейнера в див
}
function setEditorOptions(classList, styles) {
    // [0].split(":")[1].match(/([\d.]+)([a-zA-Z%]+)/)[2]
    if (classList.includes("img")) {
        $("[value='background-image']").remove();
        $("[value='background-color']").remove();
        $("[value='color']").remove();
        $("[value='font-family']").remove();
    }
    let classes = ''
    for (const classItem of classList) {
        if (classItem != "element" && !notUsedClasses.includes(classItem) && classItem != "modified" && classItem != "hide-placeholder") {
            if (classes == "") {
                classes += classItem
            } else {
                classes += " " + classItem
            }
        }
    }
    if (classes.length > 0) {
        createOption("class name", "textarea", "class", classes, false);
        $("[value = 'class']").remove();
    }
    if ($(editingElement).attr("id")) {
        createOption("id name", "text", "id", $(editingElement).attr("id"), false);
        $("[value = 'id']").remove();
    }
    for (const style of styles) {
        let name = style.split(":")[0].replace(" ", "")
        if (name != "top" && name != "left" && name != "background-image") {
            if(name == "padding" || name == "margin"){
                let step = 0;
                let values = style.split(":")[1].split(" ")
                values.splice(0,1)
                for(const direction of cssDirections){
                    let option = $(`[value = '${name}-${direction}']`);
                    createOption($(option).text(), $(option).attr("type"), $(option).attr("value"), values[step], $(option).attr("add") === "true");
                    $(option).remove();
                    step++;
                }
            }else{
                let value = style.split(":")[1]
                let option = $(`[value = '${name}']`);
                createOption($(option).text(), $(option).attr("type"), $(option).attr("value"), value, $(option).attr("add") === "true");
                $(option).remove();
            }
        }
    }
}
function hexToRgb(hex) {
    // Удаляем символ # из строки HEX (если он есть)
    hex = hex.replace(/^#/, "");

    // Разбиваем HEX на отдельные компоненты
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    // Возвращаем RGB в виде строки
    return `rgb(${r}, ${g}, ${b})`;
}
function hexToRgbWithAlpha(hex, alpha) {
    hex = hex.replace(/^#/, "");
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    // Преобразование значения альфа-канала в диапазон от 0 до 1
    alpha = parseFloat(alpha);
    alpha = isNaN(alpha) ? 1 : Math.min(1, Math.max(0, alpha));

    // Возвращаем строку RGB с добавленным значением альфа-канала
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
const rgbToHex = (r, g, b) => "#" + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('')