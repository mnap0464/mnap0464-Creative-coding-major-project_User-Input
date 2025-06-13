//backgroung image variable
let img; // Original background mosaic image
let sacry; // Declare the scary image
let numSegments = 200;
let segments = [];
let drawSegments = true;
let imgDrwPrps = {aspect: 0, width: 0, height: 0, xOffset: 0, yOffset: 0};
let canvasAspectRatio = 0;

// NEW: Variables for scary mosaic effect
let showScaryMosaic = false; // Flag to draw the scary mosaic
let scaryMosaicTimer = 0;   // Timer for how long the scary mosaic is active
const SCARY_MOSAIC_DURATION = 30; // Duration in frames (30 frames)

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
  // The segment creation loop should use the *original* 'img' for initial setup.
  // The dynamically change which image is used later.
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

  //Control which image is used for the mosaic based on showScaryMosaic flag
  if (drawSegments) {
    // If scary mosaic is active, use its segments
    if (showScaryMosaic) {
      let currentMosaicImage = showScaryMosaic ? sacry : img;
      for (const segment of segments) {
        let segX = segment.rowPostion * (currentMosaicImage.width / numSegments);
        let segY = segment.columnPosition * (currentMosaicImage.height / numSegments);
        segment.srcImgSegColour = currentMosaicImage.get(segX + (currentMosaicImage.width / numSegments) / 2, 
        segY + (currentMosaicImage.height / numSegments) / 2);
        segment.drawMosaicSegment();
      }
      scaryMosaicTimer--; // Decrement timer
      if (scaryMosaicTimer <= 0) {
        showScaryMosaic = false; // Turn off scary mosaic
        // Reset segment colors to original image
        let originalImage = img;
        for (const segment of segments) {
          let segX = segment.rowPostion * (originalImage.width / numSegments);
          let segY = segment.columnPosition * (originalImage.height / numSegments);
          segment.srcImgSegColour = originalImage.get(segX + (originalImage.width / numSegments) / 2, 
          segY + (originalImage.height / numSegments) / 2);
        }
      }
    } else {
      // Draw normal mosaic segments
      for (const segment of segments) {
        segment.drawMosaicSegment();
      }
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
    game(); //call game logic after gravity to apply current position changes
  
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
        // Activate scary mosaic effect
        showScaryMosaic = true;
        scaryMosaicTimer = SCARY_MOSAIC_DURATION; // Set timer
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
    this.srcImgSegColour = srcImgSegColourInPrm; // This color will be updated in draw()
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

  /**
 * The following lines were taken from Gemini. I require to solve the 
 * "magnet" problem. because the player couldnt left the platform, he was 
 * magnet stuck on them..
 */
  const platformsArray = [
    {x: platform1X, y: platform1Y},
    {x: platform2X, y: platform2Y},
    {x: platform3X, y: platform3Y},
    {x: platform4X, y: platform4Y},
    {x: platform5X, y: platform5Y},
    {x: platform6X, y: platform6Y}
  ];

  let onPlatform = false; // Flag to check if player is currently on any platform

  for (let i = 0; i < platformsArray.length; i++) {
    let currentPlatformX = platformsArray[i].x;
    let currentPlatformY = platformsArray[i].y;

    // MAIN CHANGE: Refined platform collision logic
    // Check if player is horizontally aligned with the platform
    if (playerX + playerWidth / 2 > currentPlatformX - platformWidth / 2 &&
        playerX - playerWidth / 2 < currentPlatformX + platformWidth / 2) {

      // Check if player is falling AND their bottom is passing the platform's top
      if (playerY + playerHeight / 2 >= currentPlatformY - platformHeight / 2 &&
          playerY + playerHeight / 2 <= currentPlatformY - platformHeight / 2 + fallingSpeed) { // Check slightly below platform top
        // Player has landed on the platform
        playerY = currentPlatformY - platformHeight / 2 - playerHeight / 2; // Snap to top of platform
        velocity = 0; // Stop vertical movement
        jumpCunter = 0; // Reset jump counter
        jump = false; // Ensure jump state is off
        onPlatform = true; // Mark that player is on a platform
        break; // Exit loop, player is on this platform
      }
    }
  }
  // Ensure gravity continues if not on any platform
  // This part is handled by the gravity function, but it's good to note that
  // if onPlatform is false, then gravity should apply.
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
