
let buttonColors=["red","blue","green","yellow"];
let gamePattern=[];
let userClickedPattern=[];
let clickCounter=0;
let level=0;

$(".btn").click(function(){
    userClicked($(this).attr('id'))
});

$(this).keypress(function(event){
    clickCounter++;
    if (clickCounter==1){
        $("#level-title").text("Level 0");
        nextSequence();
    }

    
})

function userClicked(color){
    userClickedPattern.push(color);
    selectButton(color,false);
    checkAnswer();
}
function checkAnswer(){
    if (gamePattern[gamePattern.length-1]==userClickedPattern[userClickedPattern.length-1]){
        level+=1;
        $("#level-title").text("Level "+level);
        nextSequence();
    }
    else{
         $("#level-title").text("Game Over");
        var audio = new Audio("sounds/wrong.mp3");
        audio.play();
        setTimeout(startOver,2000);
    }
}
function nextSequence(){
    let randomNumber=Math.ceil(Math.random()*3);
    console.log(randomNumber);
    let randomChosenColor=buttonColors[randomNumber];
    gamePattern.push(randomChosenColor)
    selectButton(randomChosenColor,true);
    
}
function selectButton(color,booleanVal){
    if (booleanVal==true){
        $("."+color).fadeOut(300).fadeIn(300);
        var audio = new Audio("sounds/" + color + ".mp3");
        audio.play();
    }
    if (booleanVal==false){
       $("."+color).fadeOut(800).fadeIn(800);
        var audio = new Audio("sounds/" + color + ".mp3");
        audio.play();
    }
    
}
function startOver(){
    window.location.reload(false);
}