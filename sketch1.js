//Variables and Constatnts
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;



var dog, happyDogImage, dogImage, database, foodS, foodStock, bark, nom, timer2, add, feed, fedTime, lastFed, food, feed, time,ding,State,state,bed,garden,bath,pastMin;
var timer = null;
var imm;
var foodoid;

function preload() {
  //loading sounds and images
  happyDogImage = loadImage("cookiedog2.png");
  dogImage = loadImage("hungrydog.png");
  bark = loadSound("Dog1.wav");
  nom = loadSound("recording1.wav");
  imm = loadImage('Untitled.png');
  bed = loadImage('Bed Room.png');
  bath = loadImage('Wash Room.png');
  garden = loadImage('Garden.png');



}

function setup() {
  //setting and creating everyrthing
  engine = Engine.create();
  world = engine.world;

  createCanvas(1200, 500);
  dog = createSprite(width / 2, height / 2 + 50, 100, 100);
  dog.addImage(dogImage);
  dog.scale = 0.4;
  database = firebase.database();

  foodStock = database.ref('Food');
  lastFed = database.ref('lastFedA');
  state = database.ref("gameState");
  pastMin = database.ref("min");

  foodStock.on('value', readStock);
  lastFed.on('value', readStock2);
  state.on('value',function(data) {
      state=data.val();
  });
  pastMin.on('value',function(data) {
    pastMin=data.val();
  });

  food = new Food();
  feed = createButton("Feed Dog");
  feed.position(550, 150)
  feed.mousePressed(feedDog);
  add = createButton("Add Food");
  add.position(450, 150)
  add.mousePressed(addFood);
}



function draw() {
  //background
  background("rgb(46,139,87)");

  //gameState logic
  var currentTime = hour();
    if(state!="Hungry"){
        feed.hide();
        add.hide();
        dog.visible = false;
  }else{
        feed.show();
        add.show();
        dog.visible = true;
    }
    imageMode(CENTER);  
  if(currentTime === (lastFed+1)){
        food.Garden();
        
  update("Garden");
  image(garden,600,250,287,500.5)

  }else if(currentTime === (lastFed+2)){
        food.Bed();
  update("Bed");
  image(bed,600,250,287,500.5)

  }else if(currentTime > (lastFed+2)&&currentTime <= (lastFed+4)){
        food.Bath();
  update("Bath");
  image(bath,600,250,287,500.5)

  }else{
        update("Hungry");

  }

  if (timer === null) {
    bark.play();
    timer = 0;

  }
  //Displaying food
  food.Display(foodS);
  //All the text
  drawSprites();
  textSize(30);
  fill("white");
  text("Biscuit packs left : " + foodS, 20, 50);
text("Last Fed : " + lastFed+":"+pastMin+" (24hr format)",800,50);
  
  //Timer logics
  if (timer > 0) {
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
}





function readStock(dat) {
  //Reading foodStock
  foodS = dat.val();
}

function readStock2(dat) {
  //Reading lastFed
  lastFed = dat.val();}
  
function writeStock(x) {
  //Removing food logic
  if (x >= 1) {
    x = x - 1;
  }

  database.ref("/").update({
    Food: x,
    lastFedA: hour(),
    min:minute()


  })
}
function feedDog() {
  //feeding dog logic
  if (foodS != 0) {
    nom.play();
    food.Display(foodStock - 1);

    dog.addImage(happyDogImage);
  }
  writeStock(foodS);
  timer = 60;
}
function addFood() {
  //adding food logic
  foodS = foodS + 1;

  database.ref("/").update({
    Food: foodS,
    lastFedA: lastFed
    

  })
}
function update(state) {
  //updating gameState logic
    database.ref('/').update({
        gameState:state
    })
}