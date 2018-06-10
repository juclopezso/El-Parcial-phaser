
var mainState = {
    preload: function() { 

	game.load.audio('jump', 'assets/jump.wav');

    // Cargar las imagenes del juego
    game.load.image('inicio', 'img/inicio.png');
    game.load.image('ciclista', 'img/ciclista1.png'); //y=118
    game.load.image('carro', 'img/carro.png');
    game.load.image('carro2', 'img/carro2.png');
    game.load.image('charco', 'img/charco.png');
    game.load.image('palomas', 'img/palomas.png');
    game.load.image('palomas_mut', 'img/palomas_mutantes.png');
    game.load.image('ovejas', 'img/ovejas.png');
    game.load.image('fin', 'img/estrellado.png');
    game.load.image('tienes', 'img/tienes.png');
    game.load.image('segundos', 'img/segundos.png');
    game.load.image("background", "img/fondo.png");
    game.load.image("meta", "img/meta.png");

},

create: function() { 
    // Color azul de fondo
    //game.stage.backgroundColor = '#6fa8dc';
    background = game.add.tileSprite(0, -43, 800, 490, 'background');

    //Timer del juego
    this.score = 60;
	this.labelScore = game.add.text(226, 16, "60", 
	    { font: "37px Arial", fill: "#ffffff" }); 

	game.add.sprite(10, 10, 'tienes');
	game.add.sprite(280, 5, 'segundos');

    // Grupo de obstaculos
	this.obstaculos = game.add.group(); 

    // Fisicas del sistema
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Mostrar al ciclista
    this.ciclista = game.add.sprite(100, 245, 'ciclista');

    // Fisicas del ciclista, salatr y caer
    game.physics.arcade.enable(this.ciclista);

    // Gravedad del ciclista
    this.ciclista.body.gravity.y = 1000;  

    //Añade los obstaculos entre 1.3 y 2.5 segundos
    this.timer = game.time.events.loop(2000, this.addObstaculos, this); 

    // Saltar 
    var spaceKey = game.input.keyboard.addKey(
                    Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);     
	},

	update: function() {
	    // Mantener al ciclisa en el suelo y no salirse de la pantalla
	    if(this.score < 2){
    		game.add.sprite(40, 130, 'meta');
    		game.paused = true;
    	}
	    if (this.ciclista.y < 1){
	        this.ciclista.y = 2;
	    }
	    else if (this.ciclista.y > 483-118-50){
	        this.ciclista.y = 485-118-50;
	        this.ciclista.body.gravity.y = 0;  
	    }
	    else{
	    	this.ciclista.body.gravity.y = 1000;  
	    }
	    //Revisar colision entre el ciclista y los obstaculos
	    game.physics.arcade.collide(
    		this.ciclista, this.obstaculos, this.estrellarse, null, this);
	},
	// Salto del ciclista
	jump: function() {
	    // Velocidad del salto
	    if(this.ciclista.y > 483-118-100)
	    	this.ciclista.body.velocity.y = -550;
	    game.sound.play('jump');
	},

	addObstaculo: function(x, y) {
	    // Creacion de los obstaculos
	    var choose = Math.floor(Math.random() * 6) + 1;
	    if(choose == 1)
	    	var obs = game.add.sprite(800, 340, 'palomas');
	    else if(choose == 2)
	    	var obs = game.add.sprite(800, 360, 'charco');
	    else if(choose == 3)
	    	var obs = game.add.sprite(800, 330, 'carro2');
	    else if(choose == 4)
	    	var obs = game.add.sprite(800, 350, 'ovejas');
	    else if(choose == 5 && this.score < 30)
	    	var obs = game.add.sprite(800, 330, 'palomas_mut');
	    else
   	    	var obs = game.add.sprite(800, 330, 'carro');

	    // Añadir obstaculos al grupo
	    this.obstaculos.add(obs);

	    // Fisicas de los obstaculos
	    game.physics.arcade.enable(obs);

	    // Velocidad de los obstaculos a la izquierda
	    if(this.score > 50){
	    	obs.body.velocity.x = -550; 
		}else if(this.score > 40){
			obs.body.velocity.x = -750; 
		}else if(this.score > 30){
			obs.body.velocity.x = -950; 
		}else if(this.score > 20){
			obs.body.velocity.x = -1050; 
		}else if(this.score > 10){
			obs.body.velocity.x = -1250; 
		}else if(this.score <= 10){
			obs.body.velocity.x = -1450; 
		}

	    // Matar los obstaculos cuando salen de la pantalla
	    obs.checkWorldBounds = true;
	    obs.outOfBoundsKill = true;
	},
	unpause: function() {
		game.paused = false;
	},
	addObstaculos: function() {
		this.addObstaculo(800, 275);   
		this.score -= 2;
		this.labelScore.text = this.score; 
	},
	randomTimer: function() {
		return Math.floor(Math.random() * (2500-1300+1)+1300);
	},
	// Restart el juego
	restartGame: function() {
	    game.state.start('main');
	},
	estrellarse: function() {
		game.paused = true;
		this.fin = game.add.sprite(40, 130, 'fin');
		var spaceKey = game.input.keyboard.addKey(
                    Phaser.Keyboard.SPACEBAR);
		if(game.paused){
			this.unpause;
    		spaceKey.onDown.add(this.restartGame, this);   
    	}
	}
};

//Inicializar el juego
var game = new Phaser.Game(800, 490 ,Phaser.CANVAS, "parcial");


game.state.add('main', mainState); 

game.state.start('main');
