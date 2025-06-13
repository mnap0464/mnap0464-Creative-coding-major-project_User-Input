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
var playerY = 675;
var playerWidth = 187;
var playerHeight = 187;

// platforms
var platforms;
var platform1X = 145;
var platform1Y = 500;
var platformWidth = 290;
var platformHeight = 99;



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
var jumpPower = 15;
var fallingSpeed = 2; 
var minHeight = 760; 
var maxHeight = 50; 
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

    gravity();
    game();
  


  image(Jhonny, playerX, playerY, playerWidth, playerHeight);
  image(platforms, platform1X, platform1Y, platformWidth, platformHeight);
  image(ground, groundX, groundY, groundWidth, groundHeight);

}


function splash(){
  image(nyc, windowWidth/2, windowHeight/2,windowWidth, windowHeight);

  textSize(100);
  textFont("NovaSquare");
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
    if (playerX >= platform1X - platformWidth/2 &&
        playerX <= platform1X + platformWidth/2 &&
        playerY + playerHeight / 2 >= platform1Y - platformHeight/2 && 
        playerY + playerHeight / 2 <= platform1Y + platformHeight/2 && 
        velocity >= 0)
      {
      playerY = platform1Y - platformHeight/2 - playerHeight/2;
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
