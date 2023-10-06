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

function setClouds(){
    for(let i = 0; i<5; i++){
        let cloud = {
            no:i,
            x:random(width,width+1000),
            y:random(50,height-50)
        }
        clouds.push(cloud);
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
    backgroundSprite = loadImage('Assets/sky background.jpg');
    cloudSprites = [loadImage('Assets/cloud1.jpg'),loadImage('Assets/cloud2.jpg'),loadImage('Assets/cloud3.jpg'),loadImage('Assets/cloud4.jpg'),loadImage('Assets/cloud5.jpg')];
    setClouds();
    frameRate(60);
    rectMode(CENTER);
}

function draw() {
    image(backgroundSprite,0,0,width,height);

    //spawn clouds
    for(let cloud of clouds){
        //move cloud
        cloud.x -= 5*(deltaTime/40);

        //render cloud
        image(cloudSprites[cloud.no],cloud.x+cloud.no*10,cloud.y,width/5,height/5);
        if(cloud.x<-250){
            cloud.x = random(width+50,width+200);
            cloud.y = random(50,height-50);
        }
    }

    //spawn world trade centers
    for(let wtc of WTC){
        wtc.lowerTowerX-=8*(deltaTime/40);
        wtc.upperTowerX-=8*(deltaTime/40);
        wtc.upperStrikeZoneX-=8*(deltaTime/40);
        wtc.lowerStrikeZoneX-=8*(deltaTime/40);
        fill(0,150,255);
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