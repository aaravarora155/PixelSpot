$("#top").css("border-radius","20px 20px 0px 0px");
$("#bottom").css("border-radius","0px 0px 20px 20px");
$("details").on("mouseover", function(){
    $("details").attr("open",true);
})
$(".close").on("mouseout", function(){
    $("details").attr("open",false);
})

$(".blue").on("click", function(e){
    if(confirm("THIS IS A NODE FILE, REQUIRES NODE.JS CHECK THE INSTALLATION AND USAGE INSTRUCTIONS!\nPRESS OK TO REDIRECT TO INSTRUCTIONS AND DOWNLOAD FILE OR PRESS CANCEL TO STOP DOWNLOAD")){
        window.location.assign("https://aaravarora155.github.io/HTML-Directory/Download%20Instructions/downloadingNodeFiles.html");
    }
    else{
        e.preventDefault();
    }
})