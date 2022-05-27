function getRandomValue(max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      playerMana: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: [],
      potions: 3,
      difficultyLevel: null,
    };
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "Draw";
      } else if (value <= 0) {
        this.winner = "Monster";
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = "Draw";
      } else if (value <= 0) {
        this.winner = "Player";
      }
    },
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },
    playerBarStyles() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },
    playerManaStyles() {
      if (this.playerMana < 0) {
        return { width: "0%" };
      }
      return { width: this.playerMana + "%" };
    },
    mayUseSpecialAttack() {
      return this.playerMana <= 0;
    },
    mayUseHeal() {
      return this.potions === 0;
    },
  },
  methods: {
    startGameEasy() {
      this.logMessages = [];
      this.playerHealth = 100;
      this.playerMana = 100;
      this.monsterHealth = 100;
      this.currentRound = 1;
      this.winner = null;
      this.potions = 5;
      this.difficultyLevel = -0.4;
    },
    startGameHard() {
      this.logMessages = [];
      this.playerHealth = 100;
      this.playerMana = 100;
      this.monsterHealth = 100;
      this.currentRound = 1;
      this.winner = null;
      this.potions = 3;
      this.difficultyLevel = 0.4;
    },
    
    restartGame() {
      this.logMessages = [];
      this.playerHealth = 100;
      this.playerMana = 100;
      this.monsterHealth = 100;
      this.currentRound = 0;
      this.winner = null;
      this.potions = 3;
    },

    attackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(10-this.difficultyLevel, 4-this.difficultyLevel);
      this.monsterHealth -= attackValue;
      this.attackPlayer();
      this.addLogMessage("player", "attack", attackValue*10);
    },
    attackPlayer() {
      const attackValue = getRandomValue(14+this.difficultyLevel, 6+this.difficultyLevel);
      this.playerHealth -= attackValue;
      this.addLogMessage("monster", "attack", attackValue*10);
    },
    specialAttackMonster() {
      this.currentRound++;
      this.playerMana -= getRandomValue(22+this.difficultyLevel, 18+this.difficultyLevel);
      const attackValue = getRandomValue(14-this.difficultyLevel, 8-this.difficultyLevel);
      this.monsterHealth -= attackValue;
      this.attackPlayer();
      this.addLogMessage("player", "special-attack", attackValue*10);
    },
    healPlayer() {
      this.potions--;
      this.currentRound++;
      const healValue = getRandomValue(15+this.difficultyLevel, 14+this.difficultyLevel);
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      this.attackPlayer();
      this.addLogMessage("player", "heal", healValue*10);
    },
    addLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
    surrender() {
      this.winner = "Monster";
    },
  },
});

app.mount("#game");