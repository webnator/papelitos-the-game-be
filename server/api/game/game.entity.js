'use strict';

class GameEntity {

  constructor(deps, {client, totalUsers, localUsers}) {
    const {} = deps;
    this.serverClient = client;
    this.totalUsers = totalUsers;
    this.localUsers = localUsers;
    this.currentPlayers = 0;
    this._players = [];
    this._teams = [];
    this.clients = new Set();
    this.addNewClient({client, players: this.localUsers});
    this.gameId = GameEntity.generateRandomCode();
  }

  addNewClient({client, players}) {
    this.currentPlayers += players;
    this.clients.add(client);
  }

  allowsMorePlayers(numPlayers = 0) {
    return (this.currentPlayers + numPlayers) <= this.totalUsers;
  }

  get players() {
    return this._players.map(player => player.player);
  }
  get teams() {
    return this._teams;
  }

  setWordsForPlayer(player, words) {
    const gamePlayer = this._players.find(gamePlayer => gamePlayer.player === player);
    if (gamePlayer) {
      gamePlayer.words = words;
    }
  }

  addPlayer(client, playerName) {
    this._players.push({client, player: playerName});
  }

  setTeams(teams) {
    this._teams = teams;
  }

  static generateRandomCode() {
    return (Math.random()*100000).toFixed(0);
  }

}

module.exports = GameEntity;
