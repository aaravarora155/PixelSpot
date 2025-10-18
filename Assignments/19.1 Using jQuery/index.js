$("h1").css("color","red").text("hi");
$("a").attr("href","https://www.youtube.com")
$("button").click(function(){
    $("h1").css("color","pink")
});
var word=""
$("input").keypress(function(event){
        //console.log(event.key);
        word=word+event.key;
        console.log(word);
    })
