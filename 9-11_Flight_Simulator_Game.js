let clouds = [];
let score = 0;
let isJumping = 0;
let frameShootRate = 0;
let frameWTCSpawnRate = 0;
let WTC = [];

function setup() {
    createCanvas(720,420);

    reset();

}

function Cloud(){
    this.x = random(0,width+50);
    this.y = random(0, height);
    
    this.display = function() {
        stroke(255);
        //strokeWeight(1);
        fill(255);
        ellipse(this.x, this.y, 24, 24);
        ellipse(this.x+10,this.y+10,24,24);
        ellipse(this.x+30,this.y+10,24,24);
        ellipse(this.x+30,this.y-10,24,24);
        ellipse(this.x+20,this.y-10,24,24);
        ellipse(this.x+40,this.y,24,24);
    }
    
    this.move = function() {
        this.x = this.x -= 2 ;
        this.y = this.y + random(-1, 1);
      
    }
}

function reset(){
    score = 0;
    isJumping = 0;
    frameShootRate = 0;
    frameWTCSpawnRate = 0;
    WTC = [];
    clouds = [];
    playerSprite = loadImage('Assets/Plane.png');
    playerHeight = height/2;
    wtcLowerSprite = loadImage('Assets/WorldTradeCenter(Cropped).png');
    wtcUpperSprite = loadImage('Assets/WorldTradeCenter(Cropped)(HorizontalFlipped).png');
    for (var i = 0; i < 7; i++) {
        clouds[i] = new Cloud();
    }
    frameRate(60);
    rectMode(CENTER);
}

function draw() {
    background(0,150,255);

    //spawn clouds
    for (var i = 0; i < clouds.length; i++) {
        clouds[i].move();
        clouds[i].display();
    }
    for (cloud of clouds){
        if(cloud.x<-50){
            cloud.x = width+100;
            cloud.y = random(0,height);
        }
    }
    

    //spawn world trade centers
    for(let wtc of WTC){
        wtc.lowerTowerX-=8*(deltaTime/40);
        wtc.upperTowerX-=8*(deltaTime/40);
        wtc.upperStrikeZoneX-=8*(deltaTime/40);
        wtc.lowerStrikeZoneX-=8*(deltaTime/40);
        fill(0,150,255);
        // noStroke();
        // rect(wtc.upperStrikeZoneX,wtc.upperStrikeZoneY,width/5,width/5);
        // rect(wtc.lowerStrikeZoneX,wtc.lowerStrikeZoneY,width/5,width/5);
        image(wtcUpperSprite,wtc.upperTowerX,wtc.upperTowerY,width/5);
        image(wtcLowerSprite,wtc.lowerTowerX,wtc.lowerTowerY,width/5);
    }
    if(frameWTCSpawnRate%210 == 0){
        createWTC();
        frameWTCSpawnRate = 0;
    }
    frameWTCSpawnRate++;

    //delete out of bounds WTCs
    for(let wtc of WTC){
        if(wtc.upperTowerX<-200||wtc.lowerTowerX<-200){
            WTC.splice(WTC.indexOf(wtc),1);
        }
    }

    //check for collisions
    for(let wtc of WTC){
        if(dist(width/5,playerHeight,wtc.upperStrikeZoneX,wtc.upperStrikeZoneY)<85||dist(width/5,playerHeight,wtc.lowerStrikeZoneX,wtc.lowerStrikeZoneY)<100){
            reset();
        }
    }

    //load player
    image(playerSprite,width/5,playerHeight,25+width/15,height/15);

    //jumping logic
    if(isJumping != 1){
        playerHeight += 2*(deltaTime/50);
    }
    if(isJumping == 1){
        playerHeight -= 4*(deltaTime/50);
    }
    if(frameShootRate%60 == 0){
        isJumping = 0;
    }
    if(keyIsDown(UP_ARROW)&&isJumping!=1){
        isJumping = 1;
        frameShootRate = 0;
    }
    frameShootRate++;

    //reset game if out of bounds
    if(playerHeight<0||playerHeight>height){
        reset();
    }

    //increment score
    for(wtc of WTC){
        if(width/5 > wtc.upperTowerX+100){
            score+=wtc.scorePoint;
            wtc.scorePoint = 0;
        }
    }

    //print score
    fill(0,0,0);
    text(score,15,25);//remaining
}

function createWTC(){
    let y = random(50,height-50);
    let wtc = {
        upperTowerX:width+100,
        upperTowerY:y-750,
        lowerTowerX:width+100,
        lowerTowerY:y+125,
        upperStrikeZoneX:width+172,
        upperStrikeZoneY:y-750+775-width/5,
        lowerStrikeZoneX:width+172,
        lowerStrikeZoneY:y+125+230-width/5,
        scorePoint:1
    }
    WTC.push(wtc);
}