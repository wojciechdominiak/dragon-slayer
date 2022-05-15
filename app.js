function getRandomValue(max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      logMessages: [],
      potions: 3,
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
    mayUseSpecialAttack() {
      return this.currentRound % getRandomValue(6, 2) !== 0;
    },
    mayUseHeal() {
      return this.potions === 0;
    },
  },
  methods: {
    startGame() {
      this.logMessages = [];
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.currentRound = 1;
      this.winner = null;
      this.potions = 3;
    },
    attackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(12, 5);
      this.monsterHealth -= attackValue;
      this.attackPlayer();
      this.addLogMessage("player", "attack", attackValue);
    },
    attackPlayer() {
      const attackValue = getRandomValue(15, 8);
      this.playerHealth -= attackValue;
      this.addLogMessage("monster", "attack", attackValue);
    },
    specialAttackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(20, 10);
      this.monsterHealth -= attackValue;
      this.attackPlayer();
      this.addLogMessage("player", "special-attack", attackValue);
    },
    healPlayer() {
      this.potions--;
      this.currentRound++;
      const healValue = getRandomValue(20, 16);
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      this.attackPlayer();
      this.addLogMessage("player", "heal", healValue);
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
