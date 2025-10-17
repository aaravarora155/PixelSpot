function generateNumber(){
    var randomNum=Math.floor(Math.random(0,1)*7);
    while (randomNum==0){
        var randomNum=Math.floor(Math.random(0,1)*6);
    }
    return randomNum;
}
var user1Num=generateNumber();
var user2Num=generateNumber();
document.getElementsByTagName("img")[0].setAttribute("src","./images/dice"+user1Num+".png");
document.getElementsByTagName("img")[1].setAttribute("src","./images/dice"+user2Num+".png");

function replaceTitle(){
    var winner="";
    if (user1Num>user2Num){
        winner="Player 1 Wins";
    }
    if (user1Num==user2Num){
        winner="Draw";
    }
    if (user2Num>user1Num){
        winner="Player 2 wins";
    }
    return winner;
}

document.getElementsByTagName("h1")[0].innerHTML=replaceTitle();