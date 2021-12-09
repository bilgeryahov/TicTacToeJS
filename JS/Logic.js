/**
 * @file Logic.js
 *
 * @author Bilger Yahov <bayahov1@gmail.com>
 * @version 1.0.0
 */

var Game = {

	// Game properties.
	board: new Array(9),
	humanPlayer: 'X',
	computerPlayer: 'O',
	emptySpace: ' ',
	gameOver: false,
	tiesCounter: 0,
	computersCounter: 0,
	humansCounter: 0,

	// Elements from the page.
	infoString: {},
	tiesString: {},
	humansString: {},
	computersString: {},
	newGame: {},

	/**
	 * 1. Gets all the table elements and assings them to the 'board' array.
	 * 2. Makes sure that all the elements are filled in with empty space.
	 * 3. Attaches click events to all those elements.
	 * 4. Gets the inform elements from the page.
	 * 5. Fixes what is needed for the game startup.
	 * 6. Decides the starter.
	 *
	 * @return void
	 */

	initialize: function(){

		console.log('init, this is a cool project!');

		let self = this;

		for(let counter = 0; counter < self.board.length; counter++){

			self.board[counter] = $(counter.toString());
			self.board[counter].innerHTML = self.emptySpace;
			self.board[counter].addEventListener('click', function(event){

				self.onClick(event);
			});
		}

		// Get the elements from the page.
		self.infoString = $('InfoString');
		self.computersString = $('ComputersString');
		self.humansString = $('HumansString');
		self.tiesString = $('TiesString');
		self.newGame = $('NewGame');

		self.newGame.addEvent('click', function(){

			self.startNewGame();
		});

		// Decide who will start.
		self.decideStarter();
	},

	/**
	 * Fixes all needed to start a new game.
	 *
	 * @return void
	 */

	startNewGame: function(){

		let self = this;

		self.gameOver = false;

		for(let counter = 0; counter < self.board.length; counter++){

			self.board[counter].innerHTML = self.emptySpace;
		}

		self.infoString.innerHTML = 'Info:';

		self.decideStarter();
	},

	/**
	 * Randomly decides who will start.
	 *
	 * @return void
	 */

	decideStarter: function(){

		let self = this;
		let number = Math.floor(Math.random() * 10);

		if(number > 5){

			self.infoString.innerHTML = "Computer, it's your turn!";
			let move = self.getComputerMove();
			self.setMove(self.computerPlayer, move);
			self.infoString.innerHTML = "Human, it's your turn!";
		}
		else{

			// Poor human.
			self.infoString.innerHTML = "Human, it's your turn!";
		}
	},

	/**
	 * Sets the corresponding human move on each click.
	 * Makes the winner checks.
	 *
	 * @param event
	 *
	 * @return void
	 */

	onClick: function(event){

		event = event || window.event; // IE
		let target = event.target || event.srcElement; // IE
		let id = target.id;

		let self = this;

		if(!self.gameOver){

			self.setMove(self.humanPlayer, id);
			let winner = self.checkForWinner();

			// Still no one.
			if(winner === 0){

				self.infoString.innerHTML = "Computer, it's your turn!";
				let move = self.getComputerMove();
				self.setMove(self.computerPlayer, move);
				winner = self.checkForWinner();
			}

			// Still no one.
			if(winner === 0 ){

				self.infoString.innerHTML = "Human, it's your turn!";
			}
			else if(winner === 1){

				// It's a tie!
				self.infoString.innerHTML = "The result is tie!";
				self.tiesCounter++;
				self.tiesString.innerHTML =  'Ties: ' + self.tiesCounter.toString();
				self.gameOver = true;
			}
			else if(winner === 2){

				// Human, go!
				self.infoString.innerHTML = "Human wins!";
				self.humansCounter++;
				self.humansString.innerHTML = 'Human: ' +  self.humansCounter.toString();
				self.gameOver = true;
			}
			else if(winner === 3){

				// Sad panda face!
				self.infoString.innerHTML = "Computer wins!";
				self.computersCounter++;
				self.computersString.innerHTML = 'Computer: ' + self.computersCounter.toString();
				self.gameOver = true;
			}
		}
	},

	/**
	 * Sets the corresponding move.
	 *
	 * @param player
	 * @param location
	 *
	 * @return void
	 */

	setMove: function(player, location){

		let self = this;

		self.board[location].innerHTML = player;
	},

	/**
	 * Makes a random move.
	 *
	 * @returns {number}
	 */

	getRandomMove: function(){

		let self = this;
		let move = 0;

		// Continue while you do not overlap any.
		do{

			move = Math.floor(Math.random() * (self.board.length-1));
		}
		while(self.board[move].innerHTML === self.humanPlayer || self.board[move].innerHTML === self.computerPlayer);

		self.setMove(self.computerPlayer, move);

		return move;
	},

	/**
	 * Tries to set a winner move by going through all the places and checking
	 * if the move has been successful.
	 *
	 * @returns {number}
	 */

	getWinnerMove: function(){

		let self = this;

		for(let counter = 0; counter < self.board.length; counter++){

			// Make sure that you have found an empty one.
			if(self.board[counter].innerHTML !== self.humanPlayer && self.board[counter].innerHTML !== self.computerPlayer){

				// Save the current empty one.
				let current = self.board[counter].innerHTML;
				self.board[counter].innerHTML = self.computerPlayer;

				// Check if you win.
				if(self.checkForWinner() === 3){

					// If yes, go ahead.
					self.setMove(self.computerPlayer, counter);
					return counter;
				}
				else{

					// Put the empty one back in place.
					self.board[counter].innerHTML = current;
				}
			}
		}

		// No winner moves were given today.
		return -1;
	},

	/**
	 * Tries to set a blocking move by going through all the places and checking
	 * if the move has been successful.
	 *
	 * @returns {number}
	 */

	getBlockingMove: function(){

		let self = this;

		for(let counter = 0; counter < self.board.length; counter++){

			// Make sure that you have found an empty one.
			if(self.board[counter].innerHTML !== self.humanPlayer && self.board[counter].innerHTML !== self.computerPlayer){

				// Save the current empty space.
				let current = self.board[counter].innerHTML;
				self.board[counter].innerHTML = self.humanPlayer;

				// Check if you are good to go.
				if(self.checkForWinner() === 2){

					// Go ahead.
					self.setMove(self.computerPlayer, counter);
					return counter;
				}
				else{

					self.board[counter].innerHTML = current;
				}
			}
		}

		// Bail out...
		return -1;
	},

	/**
	 * Tries to do its best possible move!
	 *
	 * @returns {*|number}
	 */

	getComputerMove: function(){

		let self = this;
		let move;

		move = self.getWinnerMove();

		// No, it's not your lucky day.
		if(move === -1){

			move = self.getBlockingMove();
		}

		// Still not your lucky day.
		if(move === -1){

			move = self.getRandomMove();
		}

		return move;
	},

	/**
	 * Checks all the possible ways for a player to win.
	 * If human wins, returns 2.
	 * If computer wins, returns 3.
	 * If it is a tie, returns 1.
	 *
	 * Imagine the board like this
	 *
	 *    0 1 2
	 *    3 4 5
	 *    6 7 8
	 *
	 * @returns {number}
	 */

	checkForWinner: function(){

		var self = this;

		for(let counter = 0; counter <= 6; counter = counter + 3){

			// Human wins.
			if(self.board[counter].innerHTML === self.humanPlayer && self.board[(counter + 1)].innerHTML === self.humanPlayer
				&& self.board[(counter + 2)].innerHTML === self.humanPlayer){

				return 2;
			}

			// Computer wins.
			if(self.board[counter].innerHTML === self.computerPlayer && self.board[(counter + 1)].innerHTML === self.computerPlayer
				&& self.board[(counter + 2)].innerHTML === self.computerPlayer){

				return 3;
			}
		}

		for(let counter = 0; counter <= 2; counter++){

			// Human wins.
			if(self.board[counter].innerHTML === self.humanPlayer && self.board[(counter + 3)].innerHTML === self.humanPlayer
				&& self.board[(counter + 6)].innerHTML === self.humanPlayer){

				return 2;
			}

			// Computer wins.
			if(self.board[counter].innerHTML === self.computerPlayer && self.board[(counter + 3)].innerHTML === self.computerPlayer
				&& self.board[(counter + 6)].innerHTML === self.computerPlayer){

				return 3;
			}
		}

		// Human wins.
		if((self.board[0].innerHTML === self.humanPlayer && self.board[4].innerHTML === self.humanPlayer
			&& self.board[8].innerHTML === self.humanPlayer) || (self.board[2].innerHTML === self.humanPlayer
			&& self.board[4].innerHTML === self.humanPlayer && self.board[6].innerHTML === self.humanPlayer)){

			return 2;
		}

		// Computer wins.
		if((self.board[0].innerHTML === self.computerPlayer && self.board[4].innerHTML === self.computerPlayer
			&& self.board[8].innerHTML === self.computerPlayer) || (self.board[2].innerHTML === self.computerPlayer
			&& self.board[4].innerHTML === self.computerPlayer && self.board[6].innerHTML === self.computerPlayer)){

			return 3;
		}

		// Still no one wins.
		for(let counter = 0; counter < self.board.length; counter++){

			if(self.board[counter].innerHTML !== self.humanPlayer && self.board[counter].innerHTML !== self.computerPlayer){

				return 0;
			}
		}

		// It's a tie.
		return 1;
	}
};

document.addEvent('domready', function(){

	Game.initialize();
});