var elementType = ""

function setConfigurator() {
    $(".configurator .bg-dark").click(function (e) {
        e.preventDefault();
        editingElement = "";
        $(".configurator").hide(100);
        $("[name='src-to-change']").val("");
        $("[name='uploadImg']").val("");
        
    });

    $("[name = 'src-to-change']").change(function (e) {
        e.preventDefault();
        $(editingElement).addClass("modified");
        $($(editingElement).children(".placeholder")).hide(0);
        if(elementType == "img"){
            $($(editingElement).children("img")).attr("src", this.value);
        }
        $("#resultConf").show(200, () => {
            setTimeout(() => {
                $("#resultConf").hide(200);
            }, 600);
        });
    });
}
function editConfiguratorFormClass(type){
    elementType = type
    $($(".confs-container").children()).hide(0);
    $($(".confs-container").children(".type-"+type)).show(0);
}
function emitTriggers() {
    $("[name='src-to-change']").trigger('change');
}