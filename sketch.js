var rocketImg, rocket;
var asteriod1Img, asteroid1, asteroid1Group;
var starImg, star, starGroup;
var laserImg, laser;
var spaceImg, space;
var gameState = "play";
var blastImg;
var fuelImg, fuel, fuelGroup;
var starCount = 0;
var fuelCount = 500;
var distance = 0;
var alienImg, alien, alienGroup;
var explosionSound, checkPointSound, alarmSound;
var gameOverImg, gameOver;

//to pre load images and sounds
function preload() {

  starImg = loadImage("star.png");
  rocketImg = loadImage("rocket.png");
  asteroid1Img = loadImage("asteroid.png");
  laserImg = loadImage("laser.png");
  spaceImg = loadImage("world.jpg");
  blastImg = loadImage("blast.png");
  fuelImg = loadImage("fuel.png");
  alienImg = loadImage("alien.png");
  gameOverImg = loadImage("r.png");

  explosionSound = loadSound("preview.mp3");
  checkPointSound = loadSound("Sonic Checkpoint.mp3");
  alarmSound = loadSound("myalarm.wav");
}

function setup() {

  //to create canvas with width and height of the screen
  createCanvas(windowWidth, windowHeight);

  //to create Space and add image and speed to it
  space = createSprite(width / 2, height / 2);
  space.addImage(spaceImg);
  space.scale = 1.5;
  space.y = 200;
  space.velocityY = 3;

  //to create Rocket and add image to it
  rocket = createSprite(width / 2, height / 2);
  rocket.addImage(rocketImg);
  rocket.scale = 0.3;

  //to create laser, add image to it and set resize its collision radius
  laser = createSprite(width / 2, height - 50);
  laser.velocityX = 70;
  laser.addImage(laserImg);
  laser.setCollider("rectangle", 0, 0, 400, 80);

  //to create game over image and disppaear it
  gameOver = createSprite(width / 2, height / 2);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  //to create new groups
  asteroid1Group = new Group();
  starGroup = new Group();
  fuelGroup = new Group();
  alienGroup = new Group();
}

function draw() {

  //to give background color
  background(0);

  //to create edges and collide the rocket and laser with it
  edges = createEdgeSprites();
  rocket.collide(edges);
  laser.bounceOff(edges);

  //to create all sprites
  drawSprites();

  //to check if the game state is play
  if (gameState === "play") {

    //to decrease the fuel count as the game progresses
    fuelCount = fuelCount - Math.round(getFrameRate() / 60);

    //to increase the distance as the game progresses
    distance = distance + Math.round(getFrameRate() / 60);

    //to call the functions
    createStars();
    createAsteroid1();
    createFuel();
    createAlien();

    //to move the rocket with arrow keys
    if (keyDown("left_arrow")) {
      rocket.x = rocket.x - 10;
    }

    if (keyDown("right_arrow")) {
      rocket.x = rocket.x + 10;
    }

    if (keyDown("space")) {
      rocket.velocityY = -10;
    }

    //to play chek point sound whenever distance increses by 100
    if (distance > 0 && distance % 100 === 0) {
      checkPointSound.play()
    }

    //to apply gravity to the rocket
    rocket.velocityY = rocket.velocityY + 0.8;

    //to repeat the space infinitly
    if (space.y > (height - 300)) {
      space.y = height / 2;
    }

    //to check if the asteroids or laser is hitting the rocket
    if (asteroid1Group.isTouching(rocket) || rocket.isTouching(laser)) {

      //to change the image of rocket to blast image
      rocket.addImage(blastImg);

      //to play explosion sound when rocket hits the asteroids or lasers
      explosionSound.play();

      //to stop everything from moving
      rocket.velocityY = 0;
      space.velocityY = 0;
      laser.velocityX = 0;

      // to destroy stars, asteroids, aliens and fuel
      starGroup.destroyEach();
      asteroid1Group.destroyEach();
      alienGroup.destroyEach();
      fuelGroup.destroyEach();

      //to make the game state end
      gameState = "end";
    }

    //to check if the fuel is less than 100
    if (fuelCount < 100) {

      //to add text for low feul
      fill("red");
      textSize(30);
      text("Low Fuel", width - 300, height - 350);

      //to play warning sound
      alarmSound.play();
    }

    //to check if the fuel count is '0'
    if (fuelCount === 0) {

      //to fall the rocket
      rocket.velocityY = 10;

      fuelCount = 1;
    }

    //to check if the star is touching rocket
    if (starGroup.isTouching(rocket)) {

      //to destroy stars
      starGroup.destroyEach();

      //to increase the score count buy 1
      starCount = starCount + 1;
    }


    //to check if fuel is touching rocket
    if (fuelGroup.isTouching(rocket)) {

      //to destroy fuel
      fuelGroup.destroyEach();

      //to make the fuel back to 500
      fuelCount = 500;
    }

    //to check if alien is touching rocket
    if (alienGroup.isTouching(rocket)) {

      //to make the star count 0
      starCount = 0;

      //to destroy aliens
      alienGroup.destroyEach();
    }

    //to check if fuel is touching laser
    if (fuelGroup.isTouching(laser)) {

      //to destroy fuel
      fuelGroup.destroyEach();
    }

    //to check if aliens is touching laser
    if (alienGroup.isTouching(laser)) {

      //to destroy aliens
      alienGroup.destroyEach();
    }

    //to check if stars is touching laser
    if (starGroup.isTouching(laser)) {

      //to destroy stars
      starGroup.destroyEach();
    }

    //to check if asteroids is touching laser
    if (asteroid1Group.isTouching(laser)) {

      //to destroy asteroids
      asteroid1Group.destroyEach();
    }
  }

  //to check if the game state is end
  if (gameState === "end") {

    //to make the game over image visible
    gameOver.visible = true;
  }

  //to check if 'r' is pressed and game state is end
  if (keyDown("r") && gameState === "end") {

    //to call the reset function
    reset();
  }


  //to show text for star count
  textSize(20);
  fill("yellow");
  text("Stars: " + starCount, width - 250, height - 550);

  //to show text for fuel count
  fill("green");
  text("Fuel: " + fuelCount, width - 250, height - 500);

  //to show text for distance
  fill("blue");
  text("Distance: " + distance, width - 250, height - 450);

  //to show text for km
  fill("blue");
  text("km", width - 50, height - 450);
}


//function to create stars
function createStars() {

  //to delay the stars
  if (World.frameCount % 300 == 0) {

    //to create stars,add images and set the lifetime
    star = createSprite(Math.round(random(0, width), height - 500));
    star.addImage(starImg);

    //to increase the speed of stars as the game progresses
    star.velocityY = (3 + 2 * distance / 100);

    star.scale = 0.1;
    star.lifetime = height / 3;

    //to add group
    starGroup.add(star);
  }
}

//function to create asteroids
function createAsteroid1() {

  //to delay the asteroids
  if (World.frameCount % 200 == 0) {

    //to create asteroids, add image, set increasing velocity and lifetime
    asteroid1 = createSprite(Math.round(random(0, width)), height - 600);

    asteroid1.addImage(asteroid1Img);
    asteroid1.velocityY = (5 + 2 * distance / 100);
    asteroid1.scale = 0.1;

    asteroid1.lifetime = height / 5;

    //to add group
    asteroid1Group.add(asteroid1);
  }
}

//function to create fuel
function createFuel() {

  //to delay the fuel
  if (World.frameCount % 400 == 0) {

    //to create fuel,add image, set increasing velocity and lifetime
    fuel = createSprite(Math.round(random(0, width), height - 500));

    fuel.addImage(fuelImg);
    fuel.velocityY = (5 + 2 * distance / 100);
    fuel.scale = 0.1;

    fuel.lifetime = height / 5;

    //to add group
    fuelGroup.add(fuel);
  }
}

//function to create aliens
function createAlien() {

  if (World.frameCount % 100 == 0) {

    //to create aliens, add images, set increasing velocity and lifetime
    alien = createSprite(Math.round(random(0, width), height - 500));

    alien.velocityY = (5 + 2 * distance / 100);
    alien.addImage(alienImg);
    alien.scale = 0.1;

    alien.lifetime = height / 6;

    //to add group
    alienGroup.add(alien);
  }
}

//function to reset the game
function reset() {

  //to make the game state play
  gameState = "play";

  //to destroy aliens, fuel, asteroids and stars
  alienGroup.destroyEach();
  fuelGroup.destroyEach();
  asteroid1Group.destroyEach();
  starGroup.destroyEach();

  //to change the rocket image
  rocket.addImage(rocketImg);

  //to reset the position of rocket
  rocket.x = width / 2;
  rocket.y = height / 2;

  //to move the laser
  laser.velocityX = 70;

  //to move the space
  space.velocityY = 3;

  //to reset the value of star count, fuel count and distance
  starCount = 0;
  fuelCount = 500;
  distance = 0;

  //to disaapear game over image
  gameOver.visible = false;
}