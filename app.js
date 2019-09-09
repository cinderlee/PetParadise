require('./db');

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const sanitize = require('mongo-sanitize');
const User = mongoose.model('User');
const Pet = mongoose.model('Pet');
const PetFood = mongoose.model('PetFood');
const app = express();

if(process.env.NODE_ENV === 'development') { 
    // configure webpack-dev-middlware with our original webpack config
    // then... "use" webpack-dev-middleware

    const webpackDevMiddleware = require("webpack-dev-middleware");
    const webpackConfig = require('./webpack.config.js');
    const webpack = require("webpack");
    const compiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(compiler, {
        publicPath:'/javascripts'
    }));
}

const session = require('express-session');
const sessionOptions = {
	secret: 'secret identifier cookie yay',
	resave: true,
	saveUninitialized: true
};
app.use(session(sessionOptions));

app.use(function(req, res, next) {
	console.log(req.method, req.path, req.body);
	next();
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// body parser setup
app.use(express.urlencoded({ extended: false }));

// serve static files
app.use(express.static(path.join(__dirname, 'public')));

const foodInfo = {
	'cupcake': 10,
	'flan': 30,
	'pudding': 30,
	'macaron': 50
};

let problems = null;

function createMinigameProblems(){
	const problemDir = Array(10);
	for (let i = 0; i < 10; i++){
		const firstNum = (Math.floor(Math.random() * Math.floor(10))) + 1;
		const secondNum = (Math.floor(Math.random() * Math.floor(10))) + 1;
		problemDir[i] = {
			id: `prob${i}`,
			firstNum, 
			secondNum
		};
	}
	return problemDir;
}

app.get('/', (req, res) => {
	if (req.session.user){
		res.redirect('/pets');
	}
	else{
		res.render('index');
	}
});

app.get('/login', (req, res) => {
	const username = sanitize(req.query.username);
	const password = sanitize(req.query.password);
	User.findOne({username: username, password: password}, function(err, user) {
		if (user === null){
			res.render('index', {msg: "Whoops, wrong login info!"});
		}
		else{
			req.session.user = username;
			res.redirect('/pets');
		}
	}); 
});

app.post('/register', (req, res) => {
	const username = sanitize(req.body.username);
	const password = sanitize(req.body.password);
	User.findOne({username: username}, function(err, user){
		if (user !== null){
			res.render('index', {msg: "Whoops, someone already took that username!"});
		}
		else{
			new User({username: username, password: password, wallet:200}).save(function(err){
				console.log(err);
			});

			req.session.user = username;

			for (const food in foodInfo){
				new PetFood({
					username: req.session.user,
					name: food,
					quantity: 0,
					cost: foodInfo[food],
					xp: foodInfo[food]
				}).save(function(err){
					if (err){
						console.log(err);
					}
				});
			}

			res.redirect('/pets');
		}
	});
});

app.get('/pets', (req, res) => {
	if (!req.session.user){
		res.redirect('/');
	}
	else{
		res.render('pets');
	}
});

app.get('/displayPets', (req, res) => {
	Pet.find({owner: req.session.user}, function(err, pets) {
		res.json(pets);
	}); 
});

app.get('/createPet', (req, res) => {
	if (!req.session.user){
		res.redirect('/');
	}
	else{
		res.render('createPet');
	}
});

app.post('/createPet', (req, res) => {
	const name = sanitize(req.body.name);
	const type = sanitize(req.body.type);
	new Pet({
		name: name,
		type: type,
		level: 1 ,
		xp: 0,
		owner: req.session.user}).save(function(err){
			console.log(err);
			res.redirect('/pets');
	});
});

app.get('/pets/:id', (req, res) =>{
	if (!req.session.user){
		res.redirect('/');
	}
	else{
		Pet.findById(sanitize(req.params.id), function(err, pet){
			if (pet === null){
				console.log("Missing pet");
			}
			else{
				let petImg;
				if (pet.type === "Kitterpillar"){
					petImg = "kitterpillar.png";
				}
				else if (pet.type === "Witchbunny"){
					petImg = "witch.png";
				}
				else if (pet.type === "AquaCat"){
					petImg = "rainbowCat.png";
				}
				else if (pet.type === "Butterdee"){
					petImg = "phoenix.png";
				}
				else if (pet.type === "Hamoo"){
					petImg = "hamster.png";
				}
				else{
					petImg = "birdie.png";
				}
				res.render('petFeed', {
					name: pet.name,
					type: pet.type,
					level: pet.level,
					xp: pet.xp,
					petUrl: petImg
				});
			}
		});
	}
});

app.post('/pets/:id', (req, res) =>{
	const food = sanitize(req.body.foodFeed);
	const qty = parseInt(sanitize(req.body.qty));
	let xpChange = foodInfo[food] * qty;
	Pet.findById(sanitize(req.params.id), function(err, pet){
		if (pet === null){
			console.log("Missing pet");
		}
		else{
			const newXp = pet.xp + xpChange;
			pet.level += Math.floor(newXp / 200);
			pet.xp = newXp % 200;
			pet.save(function(saveErr) {
				if(saveErr){
					console.log('Something went wrong');
				}
				else{
					PetFood.findOne({username: req.session.user, name: food}, function(err, petFoodie){
						if(err){
							console.log("How can you feed...");
						}
						else{
							petFoodie.quantity -= qty;
							petFoodie.save(function(saveErr){
								if(saveErr){
									console.log("Can't save new quantity");
								}
								else{
									res.redirect('/pets/' + sanitize(req.params.id));
								}
							});
						}
					});
				}
			});
		}
	});
});

app.get('/shop', (req, res) => {
	if (!req.session.user){
		res.redirect('/');
	}
	else{
		User.findOne({username: req.session.user}, function(err, user){
			PetFood.find({username: req.session.user}, function(err, foods){
				res.render('shop', {wallet: user.wallet, foods: foods});
			});
		});
	}
});

app.get('/inventory', (req, res) => {
	PetFood.find({username: req.session.user}, function(err, foods){
		if(err){
			console.log('Seems like no food...');
		}
		else{
			res.json(foods);
		}
	});
});

app.post('/shop', (req, res) => {
	const food = sanitize(req.body.food);
	const qty = parseInt(sanitize(req.body.qty));
	const wallet = parseInt(sanitize(req.body.wallet));
	const cost = foodInfo[food] * qty;
	if (cost > wallet){
		User.findOne({username: req.session.user}, function(err, user){
			PetFood.find({username: req.session.user}, function(err, foods){
				res.render('shop', {wallet: user.wallet, foods: foods, error: "Whoops, you don't have enough tokens!"});
			});
		});
	}
	else{
		PetFood.findOne({name: food, username: req.session.user}, function(err, petFood){
			if (petFood === null){
				console.log('...Pet food went missing?');
			}
			else{
				petFood.quantity = petFood.quantity + qty;
				petFood.save(function(err){
					if (err){
						console.log(err);
					}
				});
			}
			User.findOne({username: req.session.user}, function(err, user){
				user.wallet = user.wallet - cost;
				user.save(function(err){
					if(err){
						console.log(err);
					}
				});
			});
			res.redirect('/shop');
		});
	}
});

app.get('/minigame', (req, res) => {
	if (!req.session.user){
		res.redirect('/');
	}
	else{
		problems = createMinigameProblems();
		res.render('minigame', {problems: problems});
	}
});

app.post('/confirmAnswers', (req, res) => {
	const answers = [];
	console.log(req.body);
	for (let i = 0; i < 10; i++){
		answers.push(parseInt(sanitize(req.body[`prob${i}`])));
	}
	const answerKey = problems.map((prob) => {
		return prob.firstNum * prob.secondNum;
	});
	let correct = 0;
	for (let j = 0; j < 10; j++){
		if (answers[j] === answerKey[j]){
			correct++;
		}
	}
	const gainedTokens = correct * 10;
	User.findOne({username: req.session.user}, function(err, user) {
		user.wallet += gainedTokens;
		user.save(function(err){
			if(err){
				console.log("Hmmmmm");
			}
			else{
				res.json(`You earned ${gainedTokens} tokens!`);
			}
		});
	}); 
});

app.get('/logout', (req, res) => {
	req.session.user = undefined;
	res.redirect('/');
});

app.listen(process.env.PORT || 3000);
