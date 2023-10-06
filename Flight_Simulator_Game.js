let clouds = [];
let score = 0;
let isJumping = 0;
let frameShootRate = 0;
let framebuildingSpawnRate = 0;
let buildings = []; 

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
    framebuildingSpawnRate = 0;
    buildings = [];
    clouds = [];
    playerSprite = loadImage('Assets/Plane.png');
    playerHeight = height/2;
    buildingLowerSprite = loadImage('Assets/Building(Cropped).png');
    buildingUpperSprite = loadImage('Assets/Building(Cropped)(HorizontalFlipped).png');
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

    //spawn buildings
    for(let building of buildings){
        building.lowerTowerX-=8*(deltaTime/40);
        building.upperTowerX-=8*(deltaTime/40);
        building.upperStrikeZoneX-=8*(deltaTime/40);
        building.lowerStrikeZoneX-=8*(deltaTime/40);
        fill(0,150,255);
        image(buildingUpperSprite,building.upperTowerX,building.upperTowerY,width/5);
        image(buildingLowerSprite,building.lowerTowerX,building.lowerTowerY,width/5);
    }
    if(framebuildingSpawnRate%210 == 0){
        createbuilding();
        framebuildingSpawnRate = 0;
    }
    framebuildingSpawnRate++;

    //delete out of bounds buildings
    for(let building of buildings){
        if(building.upperTowerX<-200||building.lowerTowerX<-200){
            buildings.splice(buildings.indexOf(building),1);
        }
    }

    //check for collisions
    for(let building of buildings){
        if(dist(width/5,playerHeight,building.upperStrikeZoneX,building.upperStrikeZoneY)<85||dist(width/5,playerHeight,building.lowerStrikeZoneX,building.lowerStrikeZoneY)<100){
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
    for(let building of buildings){
        if(width/5 > building.upperTowerX+100){
            score+=building.scorePoint;
            building.scorePoint = 0;
        }
    }

    //print score
    fill(0,0,0);
    text(score,15,25);//remaining
}

function createbuilding(){
    let y = random(50,height-50);
    let building = {
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
    buildings.push(building);
}
