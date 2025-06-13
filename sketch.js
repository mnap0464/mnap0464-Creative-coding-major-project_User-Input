//backgroung image variable
let img;
let numSegments = 200;
let segments = [];
let drawSegments = true;
let imgDrwPrps = {aspect: 0, width: 0, height: 0, xOffset: 0, yOffset: 0};
let canvasAspectRatio = 0;

//Game
var stage = 0;

//player
var Jhonny;
var playerX = 593;
var playerY = 700;
var playerWidth = 187;
var playerHeight = 187;

//enemy
var enemy;
var enemy1X = 150;
var enemy1Y = 700;
var enemyWidth = 130;
var enemyHeight = 100;

// platforms
var platforms;
//1
var platform1X = 145;
var platform1Y = 530;
var platformWidth = 290;
var platformHeight = 99;
//2
var platform2X = 630;
var platform2Y = 530;
//3
var platform3X = 350;
var platform3Y = 280;
//4
var platform4X = 1000;
var platform4Y = 280;
//5
var platform5X = 1350;
var platform5Y = 530;
//6
var platform6X = 1650;
var platform6Y = 280;

// music note
var note
var noteX = 593;
var noteY = 700;
var noteWidth = 100;
var noteHeight = 99;

//counters
var score = 0;
var lives = 3;



//ground variables
var ground
var groundX = 846;
var groundY = 1000;
var groundWidth = 1695;
var groundHeight = 502;



// gravity
var jump = false;
var direction = 1;
var velocity = 2;
var jumpPower = 20;
var fallingSpeed = 2; 
var minHeight = 760; 
var maxHeight = 10; 
var jumpCunter = 0; 



// Preload
function preload() {
  //nyc
  img = loadImage("assets/nyc_opacity.jpg");
  //Jhonny
  Jhonny = loadImage ("assets/Jhonny.png");
  //platforms
  platforms = loadImage ("assets/oW.png");
  // ground
  ground = loadImage ("assets/ground.png");
   //image for stage 0
  nyc = loadImage ("assets/nyc .jpg")
  //the note are point
  note = loadImage ("assets/music-note_11336134.png");
  //the instrument are enemy
  enemy = loadImage ("assets/enemy.png");
  //hit the enemy and cange the backgroung image
  sacry = loadImage ("assets/scary.png");
}








//setup
function setup() {
  imageMode (CENTER);
  //backgroung image setup
  createCanvas(windowWidth, windowHeight);
  imgDrwPrps.aspect = img.width / img.height;
  calculateImageDrawProps();
  let segmentWidth = img.width / numSegments;
  let segmentHeight = img.height / numSegments;
  let positionInColumn = 0;
  for (let segYPos=0; segYPos<img.height; segYPos+=segmentHeight) {
    let positionInRow = 0
    for (let segXPos=0; segXPos<img.width; segXPos+=segmentWidth) {
      let segmentColour = img.get(segXPos + segmentWidth / 2, segYPos + segmentHeight / 2);
      let segment = new ImageSegment(positionInColumn, positionInRow,segmentColour);
      segments.push(segment);
      positionInRow++;
    }
    positionInColumn++;
  }
  for (const segment of segments) {
    segment.calculateSegDrawProps();
  }
}








// draw
function draw() {
  //backgroung image
  background(0);
  if (drawSegments) {
    for (const segment of segments) {
      segment.drawMosaicSegment();
    }
  } else {
    image(img, imgDrwPrps.xOffset, imgDrwPrps.yOffset, imgDrwPrps.width, imgDrwPrps.height);
  }





  if (stage == 0) {
    splash(); 
  } else if (stage == 1) { 
    // Input handling
    if (keyIsDown(RIGHT_ARROW)){
      playerX = playerX + 5;
    }
    if (keyIsDown(LEFT_ARROW)){
      playerX = playerX - 5;
    }

    if (keyIsDown(32)){ 
      jump = true;
    } else {
      jump = false;
    }
  }


  //game physics and logic
    gravity();
    game();
  
    //ground
    image(ground, groundX, groundY, groundWidth, groundHeight);

    //player
    image(Jhonny, playerX, playerY, playerWidth, playerHeight);

    //platforms
    image(platforms, platform1X, platform1Y, platformWidth, platformHeight);
    image(platforms, platform2X, platform2Y, platformWidth, platformHeight);
    image(platforms, platform3X, platform3Y, platformWidth, platformHeight);
    image(platforms, platform4X, platform4Y, platformWidth, platformHeight);
    image(platforms, platform5X, platform5Y, platformWidth, platformHeight);
    image(platforms, platform6X, platform6Y, platformWidth, platformHeight);

    //enemy
    image(enemy, enemy1X, enemy1Y, enemyWidth, enemyHeight);
    if(playerX >= enemy1X - enemyWidth/2 &&
      playerX <= enemy1X + enemyWidth/2 &&
      playerY >= enemy1Y  - enemyHeight/2 &&
      playerY <= enemy1Y  + enemyHeight/2){
        lives = lives-1;
      }

    //the note are point
    image(note, noteX, noteY, noteWidth, noteHeight);
    if(playerX >= noteX - noteWidth/2 && 
      playerX <= noteX + noteWidth/2  &&
      playerY >= noteY - noteHeight/2 &&
      playerY <= noteY + noteHeight/2 
    ){
      score = score + 1;
      noteX = - 10000;
    }


    //score board
    textSize(25);
    fill(255);
    text("Piont:", 50, 50);
    text(score, 110, 50);

    //lives
    textSize(25);
    fill(255);
    text("Lives:", 50, 80);
    text(lives, 110, 80);
}


function splash(){
  image(nyc, windowWidth/2, windowHeight/2,windowWidth, windowHeight);

  textSize(100);
  fill(255);
  textAlign(CENTER, CENTER); 
  text("jhonnyyyyyy", width/2, height/2); 
}

function mousePressed() {
  if (stage == 0) {
    stage = 1;
  }
}



function windowResized() {
  //backgroung image 
  resizeCanvas(windowWidth, windowHeight);
  calculateImageDrawProps();
  for (const segment of segments) {
    segment.calculateSegDrawProps();
  }
}

function calculateImageDrawProps() {
//backgroung image 
  canvasAspectRatio = width / height;

  if (imgDrwPrps.aspect > canvasAspectRatio) {
    imgDrwPrps.width = width;
    imgDrwPrps.height = width / imgDrwPrps.aspect;
    imgDrwPrps.yOffset = (height - imgDrwPrps.height) / 2;
    imgDrwPrps.xOffset = 0;
  } else if (imgDrwPrps.aspect < canvasAspectRatio) {
    imgDrwPrps.height = height;
    imgDrwPrps.width = height * imgDrwPrps.aspect;
    imgDrwPrps.xOffset = (width - imgDrwPrps.width) / 2;
    imgDrwPrps.yOffset = 0;
  }
  else if (imgDrwPrps.aspect == canvasAspectRatio) {
    imgDrwPrps.width = width;
    imgDrwPrps.height = height;
    imgDrwPrps.xOffset = 0;
    imgDrwPrps.yOffset = 0;
  }
}

class ImageSegment {
  //backgroung image 
  constructor(columnPositionInPrm, rowPostionInPrm  ,srcImgSegColourInPrm) {
    this.columnPosition = columnPositionInPrm;
    this.rowPostion = rowPostionInPrm;
    this.srcImgSegColour = srcImgSegColourInPrm;
    this.drawXPos = 0;
    this.drawYPos = 0;
    this.drawWidth = 0;
    this.drawHeight = 0;
  }
  calculateSegDrawProps() {
    //backgroung image 
    this.drawWidth = imgDrwPrps.width / numSegments;
    this.drawHeight = imgDrwPrps.height / numSegments;
    this.drawXPos = this.rowPostion * this.drawWidth + imgDrwPrps.xOffset;
    this.drawYPos = this.columnPosition * this.drawHeight + imgDrwPrps.yOffset;
  }
  drawMosaicSegment() {
    noStroke();
    fill(this.srcImgSegColour);
    rect(this.drawXPos, this.drawYPos, this.drawWidth, this.drawHeight);
  }
}






//////game
  function game (){
    //collision for platforms
    if (playerX >= platform1X - platformWidth/2 &&
        playerX <= platform1X + platformWidth/2 &&
        playerY + playerHeight / 2 >= platform1Y - platformHeight/2 && 
        playerY + playerHeight / 2 <= platform1Y + platformHeight/2 && 
        //velocity >= 0
        jump == false)
      {
      playerY = platform1Y  - 125 //platformHeight/2 - playerHeight/2;
      velocity = 0;
      jumpCunter = 0;
    }
  
  //2
  if (playerX >= platform2X - platformWidth/2 &&
    playerX <= platform2X + platformWidth/2 &&
    playerY + playerHeight / 2 >= platform2Y - platformHeight/2 &&
    playerY - playerHeight / 2 <= platform2Y + platformHeight/2 &&
    //velocity >= 0
    jump == false){
  playerY = platform2Y - 125 //platformHeight/2 - playerHeight/2;
  velocity = 0;
  jumpCunter = 0;
  }

  //3
  if (playerX >= platform3X - platformWidth/2 &&
    playerX <= platform3X + platformWidth/2 &&
    playerY + playerHeight / 2 >= platform3Y - platformHeight/2 &&
    playerY - playerHeight / 2 <= platform3Y + platformHeight/2 &&
    //velocity >= 0
    jump == false){
  playerY = platform3Y - 125 //platformHeight/2 - playerHeight/2;
  velocity = 0;
  jumpCunter = 0;
  }

  //4
  if (playerX >= platform4X - platformWidth/2 &&
    playerX <= platform4X + platformWidth/2 &&
    playerY + playerHeight / 2 >= platform4Y - platformHeight/2 &&
    playerY - playerHeight / 2 <= platform4Y + platformHeight/2 &&
    //velocity >= 0
    jump == false){
  playerY = platform4Y - 125 //platformHeight/2 - playerHeight/2;
  velocity = 0;
  jumpCunter = 0;
  }
  //5
  if (playerX >= platform5X - platformWidth/2 &&
    playerX <= platform5X + platformWidth/2 &&
    playerY + playerHeight / 2 >= platform5Y - platformHeight/2 &&
    playerY - playerHeight / 2 <= platform5Y + platformHeight/2 &&
    //velocity >= 0
    jump == false){
  playerY = platform5Y - 125 //platformHeight/2 - playerHeight/2;
  velocity = 0;
  jumpCunter = 0;
  }

  //6
  if (playerX >= platform6X - platformWidth/2 &&
    playerX <= platform6X + platformWidth/2 &&
    playerY + playerHeight / 2 >= platform6Y - platformHeight/2 &&
    playerY - playerHeight / 2 <= platform6Y + platformHeight/2 &&
    //velocity >= 0
    jump == false){
  playerY = platform6Y - 125 //platformHeight/2 - playerHeight/2;
  velocity = 0;
  jumpCunter = 0;
  }
  
}





//////gravity
function gravity(){
  if (jump == true){
    if (jumpCunter < jumpPower){ 
      playerY -= jumpPower;
      jumpCunter++; 
    } else {
      jump = false; 
      velocity = fallingSpeed; 
    }
  } else {
    // Apply falling if not jumping
    if (playerY + playerHeight / 2 < minHeight) { 
      playerY += fallingSpeed; 
      velocity = fallingSpeed; 
    } else {
      // On the ground
      playerY = minHeight - playerHeight / 2; 
      velocity = 0; 
      jumpCunter = 0; 
    }
  }

  if (playerY < maxHeight) {
    playerY = maxHeight;
    if (jump) {
      jump = false;
      velocity = fallingSpeed;
    }
  }
}
