let clouds = [];
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
    buildings = [];
    clouds = [];
    playerSprite = loadImage('Assets/Plane.png');
    buildingLowerSprite = loadImage('Assets/Building(Cropped).png');
    buildingUpperSprite = loadImage('Assets/Building(Cropped)(HorizontalFlipped).png');
    backgroundSprite = loadImage('Assets/sky background.jpg');
    cloudSprites = [loadImage('Assets/cloud1.jpg'),loadImage('Assets/cloud2.jpg'),loadImage('Assets/cloud3.jpg'),loadImage('Assets/cloud4.jpg'),loadImage('Assets/cloud5.jpg')];
    setClouds();    //pass the number of clouds to print (default = 5)
    createPlayers();    //pass the number of players (default = 1)
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
        image(cloudSprites[cloud.no%5],cloud.x+cloud.no*10,cloud.y,width/5,height/5);
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
            if(dist(width/5,player.playerHeight,building.upperStrikeZoneX,building.upperStrikeZoneY)<85||dist(width/5,player.playerHeight,building.lowerStrikeZoneX,building.lowerStrikeZoneY)<100){
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
            if(width/5 > building.upperTowerX+100&&building.scorePoint!=0){
                player.score+=1;
                building.scorePoint--;
            }
        }
    }

    //reset is all players are dead
    if(players.length==0){
        reset();
    }
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
        scorePoint:players.length
    }
    buildings.push(building);
}

function createPlayers(num = 1){
    for(let i=0;i<num;i++)
    {
        let player = {
            no:i,
            score:0,
            playerHeight:random(100,height-100),
            isJumping:0,
            frameJumpRate:0
        }
        players.push(player);
    }
}