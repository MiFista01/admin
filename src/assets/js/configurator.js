function initConfigurator(){
    
}



// var elementType = ""
// function setConfigurator() {
//     $(".configurator .bg-dark").click(function (e) {
//         e.preventDefault();
//         editingElement = "";
//         $(".configurator").hide(100);
//         $(".configs input").val("");
        
//     });
//     $("#tag-type").change(function (e) { 
//         e.preventDefault();
//         const tag = document.createElement($(this).val())
//         $(tag).attr("editible", null);
//         $(tag).attr("contenteditable", true);
//         const text = $($($(editingElement).children()).last()).text();
//         $(tag).text(text);
//         $($($(editingElement).children()).last()).remove();
//         $(editingElement).append(tag);
//         $(".configs").trigger("submit");
//     });

//     $("[name = 'src-to-change']").change(function (e) {
//         e.preventDefault();
//         $(editingElement).addClass("modified");
//         $($(editingElement).children(".placeholder")).hide(0);
//         if(elementType == "img"){
//             $($(editingElement).children("img")).attr("src", this.value);
//         }
//         $("#resultConf").show(200, () => {
//             setTimeout(() => {
//                 $("#resultConf").hide(200);
//             }, 600);
//         });
//     });
//     $(".configs").submit(function (e) { 
//         e.preventDefault();
//         if(elementType == "list"){
//             const value = $("#count-point").val();
//             let acceptPoint = document.createElement("li");
//             acceptPoint.className = "access-point";
//             if(value > $(editingElement).children(".access-point").length){
//                 for(let i = $(editingElement).children(".access-point").length; i < value; i++){
//                     let point = $(acceptPoint).clone();
//                     $(point).attr("editible", null);
//                     $(point).click(function (e) { 
//                         e.preventDefault();
//                         const new_element = createElement(point, 0)
//                     });
//                     $(editingElement).append(point);
//                 }
//             }else{
//                 const removeCount = $(editingElement).children(".access-point").length - value
//                 for(let i = 1; i <= removeCount; i++){
//                     $($(editingElement).children(".access-point").last()).remove();
//                 }
//             }
//         }
//         $("#resultConf").show(200, () => {
//             setTimeout(() => {
//                 $("#resultConf").hide(200);
//             }, 600);
//         });
//     });
// }
// function editConfiguratorFormClass(type){
//     elementType = type
//     if(type == "img" || type == "title"){
//         $(".configs button").hide(0);
//     }else{
//         $(".configs button").show(0);
//     }
//     $($(".confs-container").children()).hide(0);
//     $($(".confs-container").children(".type-"+type)).show(0);
// }
// function emitTriggers() {
//     $("[name='src-to-change']").trigger('change');
// }