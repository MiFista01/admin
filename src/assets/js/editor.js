function initEditor() {
  $("#selectStyles").click(function (e) {
    e.preventDefault();
    const selecedFields = $(".style-changer").children(".show");
    const articlesFields = $(selecedFields).children();
    $(edititingElement).attr("style", "");
    if(!$($(edititingElement).children().last()).hasClass('element'))
      $($(edititingElement).children().last()).attr("style", "");

    articlesFields.each((index, element) => {
      const children = $(element).children(":not(.label)");
      let value = "";
      switch ($(element).attr("type")) {
        case "user-color":
          const rgb = hexToRgb(children[0].value);
          value = `rgba(${rgb}, ${children[1].value})`;
          break;
        case "user-size":
          value = `${children[0].value}${children[1].value}`;
          break;
        case "user-select":
          value = `${children[0].value}`;
          break;
        case "user-text":
          value = `${children[0].value}`;
          break;
        case "user-numb":
          value = `${children[0].value}`;
          break;
      }
      $(edititingElement).css($(element).attr("styleName"), value);
      if($(element).attr("styleName") != "width" && $(element).attr("styleName") != "height" && $(edititingElement).attr("dropzone") != "true" && !$($(edititingElement).children().last()).hasClass('element'))
      $($(edititingElement).children().last()).css($(element).attr("styleName"),value);
    });
  });
}

function hexToRgb(hex) {
  // Удаление символа #
  hex = hex.replace(/^#/, "");

  // Разделение HEX-значения на красный, зеленый и синий каналы
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Возвращение значения в формате RGB
  return `${r}, ${g}, ${b}`;
}
