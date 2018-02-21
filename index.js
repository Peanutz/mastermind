const inquirer = require('inquirer');
const table = require('table');

class Game {

  constructor() {
    this.avail_values = ['R', 'J', 'B', 'O', 'V', 'N'];
    this.max_rounds = 10;
    this.solution_length = 4;
  }

  toString() {
    return table.table(this.rounds.map((round, index) => {
      let rnd_info = Object.values(round);

      rnd_info.push(`${index+1}/${this.max_rounds}`);
      return rnd_info;
    }));
  }

  generateSolution() {
    let solution = [];

    for (let i = 0; i < this.solution_length; i++) {
      solution.push(this.avail_values[Math.floor(Math.random() * this.avail_values.length)]);
    }
    return solution;
  }

  isValidInput(user_input) {
    let re = `(${this.avail_values.join('|')}){${this.solution_length}}`;

    return user_input.match(re);
  }

  testProposition(proposition) {
    let result = {
      proposition,
      exact_matches: 0,
      color_matches: 0
    };
    let test_solution = this.solution.slice();

    proposition = proposition.split('');

    for (let i = 0; i < this.solution_length; i++) {
      if (proposition[i] === test_solution[i]) {
        result.exact_matches++;
        test_solution[i] = proposition[i] = 'X';
      }
    }

    for (let i = 0; i < this.solution_length; i++) {
      if (proposition[i]!== 'X' && test_solution.indexOf(proposition[i]) > -1) {
        result.color_matches++;
        test_solution[test_solution.indexOf(proposition[i])] = 'X';
      }
    }

    return result;
  }

  async start() {
    this.rounds = [];
    this.solution = this.generateSolution();
    await inquirer.prompt([{
      type: 'confirm',
      name: 'game_start',
      message: 'Start the game ?',
      default: false
    }]).then(answers => {
      if (answers.game_start === false) {
         return console.log(`So you don't wanna play ? Cya !`);
      }
      console.log(`Type in ${this.solution_length} colors per round, available colors: ${this.avail_values.join('|')}, ${this.max_rounds} rounds. Good Luck!`);
      return this.play();
    });
  }

  async play() {
    await inquirer.prompt([{
      type: 'input',
      name: 'new_round',
      message: `Round ${this.rounds.length+1}, you're up !`,
    }]).then(answers => {
      if (!this.isValidInput(answers.new_round)) {
        console.log('Wrong input bro, please only type uppercase');
        return this.play();
      }
      let result = this.testProposition(answers.new_round);

      this.rounds.push(result);
      console.log(this.toString());

      if (result.exact_matches === this.solution_length) {
        console.log(`You did it ! Congratulations`);
        return this.start();
      }

      if (this.rounds.length === this.max_rounds) {
        console.log(`Sorry buddy but game is over, how hard was it to find ${this.solution.join()} ?`);
        return this.start();
      }

      return this.play();
    });
  }
}

let game = new Game();
game.start();