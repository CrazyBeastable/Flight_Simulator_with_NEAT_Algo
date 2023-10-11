let clouds = [];
let buildingNo = 0;
let framebuildingSpawnRate = 0;
let buildings = []; 
let players = [];

function setup() {
    createCanvas(720,420);

    reset();
}

function setClouds(num=5){
    for(let i = 0; i<num; i++){
        let cloud = {
            no:i,
            x:random(width,width+1000),
            y:random(50,height-50)
        }
        clouds.push(cloud);
    }
}

function reset(){
    player = [];
    framebuildingSpawnRate = 0;
    buildingNo = 0;
    buildings = [];
    clouds = [];
    playerSprite = loadImage('Assets/Plane.png');
    buildingLowerSprite = loadImage('Assets/Building(Cropped).png');
    buildingUpperSprite = loadImage('Assets/Building(Cropped)(HorizontalFlipped).png');
    backgroundSprite = loadImage('Assets/sky background.jpg');
    cloudSprites = [loadImage('Assets/cloud1.jpg'),loadImage('Assets/cloud2.jpg'),loadImage('Assets/cloud3.jpg'),loadImage('Assets/cloud4.jpg'),loadImage('Assets/cloud5.jpg')];
    setClouds();    //pass the number of clouds to print (default = 5)
    createPlayers(5);    //pass the number of players (default = 1)
    frameRate(60);
    rectMode(CENTER);
    imageMode(CENTER);
}

function draw() {
    image(backgroundSprite,width/2,height/2,width,height);

    //spawn clouds
    for(let cloud of clouds){
        //move cloud
        cloud.x -= 5*(deltaTime/40);

        //render cloud
        image(cloudSprites[cloud.no%5],cloud.x+cloud.no*10,cloud.y,width/5,height/5);
        if(cloud.x<-250){
            cloud.x = random(width+50,width+200);
            cloud.y = random(50,height-50);
        }
    }

    //spawn buildings
    for(let building of buildings){
        building.x1-=8*(deltaTime/40);
        building.x2-=8*(deltaTime/40);
        building.uszx1-=8*(deltaTime/40);
        building.uszx2-=8*(deltaTime/40);
        building.lszx1-=8*(deltaTime/40);
        building.lszx2-=8*(deltaTime/40);

        //hit boxes
        //fill(255,255,255);
        //rect(width/2,height/2,width/2,height-height/3);
        // fill(255,0,0);
        //rect(width/2,height/6,width/3,height/4);
        //rect(width/2,height-height/6,width/3,height/4);
        // rect(building.x1,building.y1+height/9+715/2,215/2);
        // fill(0,255,0);
        // rect(building.uszx1,building.uszy1,215/2);
        // rect(building.uszx2,building.uszy2,215/2);
        // rect(building.lszx1,building.lszy1,215/2);
        // rect(building.lszx2,building.lszy2,215/2);

        image(buildingUpperSprite,building.x1,building.y1,width/5);
        image(buildingLowerSprite,building.x2,building.y2,width/5);
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

    //load players
    for(let player of players){
        //set player sprite
        image(playerSprite,width/5,player.playerHeight,25+width/15,height/15);

        //jumping logic
        if(player.isJumping != 1){
            player.playerHeight += 2*(deltaTime/50);
        }
        if(player.isJumping == 1){
            player.playerHeight -= 4*(deltaTime/50);
        }
        if(player.frameJumpRate%60 == 0){
            player.isJumping = 0;
        }
        if(keyIsDown(UP_ARROW)&&player.isJumping!=1){
            player.isJumping = 1;
            player.frameJumpRate = 0;
        }
        player.frameJumpRate++;

        //check for collisions
        for(let building of buildings){
            if(dist(width/5,player.playerHeight,building.uszx1,building.uszy1)<80||dist(width/5,player.playerHeight,building.lszx1,building.lszy1)<80||dist(width/5,player.playerHeight,building.uszx2,building.uszy2)<80||dist(width/5,player.playerHeight,building.lszx2,building.lszy2)<80){
                players.splice(players.indexOf(player),1);
            }
        }

        //reset game if player out of bounds
        if(player.playerHeight<0||player.playerHeight>height){
            players.splice(players.indexOf(player),1);
        }

        //print score
        fill(0,0,0);
        for(let i=0;i<players.length;i++){
            text(player.score,5*(player.no*5+1),25);
        }
    }

    //increment score
    for(let building of buildings){
        for(let player of players){
            if(width/5 > building.x1 && player.lastBuildingCrossed < building.no){
                player.score+=1;
                player.lastBuildingCrossed = building.no;
            }
        }
    }

    //reset is all players are dead
    if(players.length==0){
        reset();
    }
}

function createbuilding(){
    let y = random(height/6,height-height/6);
    let x = width+500;
    let building = {
        no:buildingNo,
        x1:x,
        x2:x,
        y1:(y-height/9)-715/2,
        y2:(y+height/9)+715/2,
        uszx1:x,
        uszy1:y-height/2-height/12,
        uszx2:x,
        uszy2:y-height/3.5,
        lszx1:x,
        lszy1:y+height/3.5,
        lszx2:x,
        lszy2:y+height/2+height/12,
    }
    buildings.push(building);
    buildingNo++;
}

function createPlayers(num = 1){
    for(let i=0;i<num;i++)
    {
        let player = {
            no:i,
            score:0,
            playerHeight:random(100,height-100),
            isJumping:0,
            frameJumpRate:0,
            lastBuildingCrossed:-1
        }
        players.push(player);
    }
}