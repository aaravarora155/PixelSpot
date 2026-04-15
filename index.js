$("#top").css("border-radius", "20px 20px 0px 0px");
$("#bottom").css("border-radius", "0px 0px 20px 20px");
$("details").on("mouseover", function () {
    $("details").attr("open", true);
})
$(".close").on("mouseout", function () {
    $("details").attr("open", false);
})
$(".purple").on("click", function (e) {
    alert("THIS PROJECT CONTAINS BOTH NODE.JS AND SQL FILES, CHECK THE INSTALLATION AND USAGE INSTRUCTIONS!");
})