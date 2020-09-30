const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;



//Create variables here
var dog, happyDogImage, dogImage, database, foodS, foodStock, bark, nom, timer2, add, feed, fedTime, lastFed, food, feed, time,ding,bg,Garden,Bed,Bath,States,Statesy;
var timer = null;
var imm,hour;
var foodoid;

function preload() {
  dogImage = loadImage("hungrydog.png");
  happyDogImage = loadImage("cookiedog2.png");
  bark = loadSound("Dog1.wav");
  nom = loadSound("recording1.wav");
  imm = loadImage('Untitled.png');
  Garden = loadImage("Garden.png")
  Bath = loadImage("Wash Room.png")
  Bed = loadImage("Bed Room.png")



}

function setup() {
  pixelDensity(2);
  engine = Engine.create();
  world = engine.world;

  createCanvas(1200, 500);
  dog = createSprite(width / 2, height / 2 + 50, 100, 100);
  dog.addImage(dogImage);
  dog.scale = 0.4;
  database = firebase.database();
  foodStock = database.ref('Food');
  lastFed = database.ref('lastFedA');
  States = database.ref('states');

  foodStock.on('value', readStock);
  lastFed.on('value', readStock2);
  States.on('value', readStock3);

  food = new Food();
  food.preload();
  feed = createButton("Feed Dog")
  feed.position(550, 50)
  feed.mousePressed(feedDog);
  feed.mousePressed()
  add = createButton("Add Food")
  add.position(450, 50)
  add.mousePressed(addFood);
  bg = "rgb(46,139,87)";
}



function draw() {
console.log(lastFed);
if(hour==(lastFed+1)){

  //foodObj.garden();
updateState();

}else if(hour==(lastFed+2)){
  updateState();

  //foodObj.bedroom();
}else if(hour>(lastFed+2) && currentTime<=(lastFed+4)){
  updateState();

  //foodObj.washroom();
}else{
update("Hungry")
//foodObj.display();
}
  Engine.update(engine);
  if (timer === null) {
    bark.play();
    timer = 0;

  }
  background(bg);
  loadPixels();
getState();
  for (let y = 0; y < 1600 ; y++) {
    for (let x = 0; x < width; x++) {
    var index = (x + y * width)*4
    var num = 255
    pixels[index+0] = 0;
    pixels[index+1] = 0;
    pixels[index+2] = (y/10)+50;
    pixels[index+3] = 255;

    
    }
    
  }
updatePixels();
  imageMode(CENTER)
  
  imageMode(CENTER);

  food.Display(foodS);
  drawSprites();
  textSize(30);
  fill("white");
  text("Biscuit packs left : " + foodS, 20, 50);
text("Last Fed : " + lastFed+" (24hr format)",1000,25,200,1000);
  
  if (timer > 0) {
    if (foodS != 0) {


    }
    timer = timer - 1
  } else {
    dog.addImage(dogImage);

  }
  if (timer === 1) {
    bark.play();
  }
  if (timer2 < 0) {
    timer2 = timer2 - 1;
    fill("black");
    textSize(200);
    text("Refilling...", 250, 250);

  }

 
text(States,200,200)

cursor('loading');
cursor('grab');


  }





function readStock(dat) {
  foodS = dat.val();
}
function readStock3(dat) {
  Statesy = dat.val();
  database.ref("/").set({
    Food: foodS,
    lastFedA:lastFed,
   
    states:States
  
  })
  
}

function readStock2(dat) {
  lastFed = dat.val();
  console.log(lastFed);
}
function writeStock(x) {
  if (x >= 1) {
    x = x - 1;
  }
  var num = getCurrentHour();

  database.ref("/").set({
    Food: x,
    lastFedA:hour,
    states:States

  })
}
function feedDog() {
  if (foodS != 0) {
    nom.play();
    food.Display(foodStock - 1);

    dog.addImage(happyDogImage);
  }
  writeStock(foodS);
  timer = 60;
}
function addFood() {
  foodS = foodS + 1;

  database.ref("/").set({
    Food: foodS,
    lastFedA:lastFed,
    states:States

  })
}
function updateState() {
  
  database.ref("/").update({
  Food: 0,
   lastFedA:lastFed,
    states:States

  })
}
async function getCurrentHour(){
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJSON = await response.json();

  var datetime = responseJSON.datetime;
  hour = datetime.slice(11,13);
  return hour;
}
function bed(){
 bg = Bed
}    
function bath(){
  bg = Bath
}
function garden(){
  bg = Garden

}
function getState() {
  if(lastFed === hour){
    add.hide();
    feed.hide();
  image(Garden,width/2,height/2,500,500);
//updateState();

  States = 0;
  Statesy = 0;
  
  }else if((hour-1 === lastFed||hour-2 === lastFed)){
    
    add.hide();
    feed.hide();
//updateState();

    image(Bath,width/2,height/2,500,500);
  
  States = 1;
  Statesy = 1;
  
  image(Garden,width/2,height/2,500,500);
  }else if(hour-3 === lastFed){
    
    add.hide();
//updateState();

    feed.hide();
  image(Bed,width/2,height/2,500,500);
  States = 2;
  Statesy = 2;

  
  }else if(hour-3 < lastFed ){
    add.show();
//updateState();

    feed.show();
  
    States = 3;
  Statesy = 3;

  }
}