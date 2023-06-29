"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Players = exports.PlayerPositions = exports.PlayerStats = void 0;
const playerPlaces_1 = require("./playerPlaces");
const constants_1 = require("../../sharedConstants/constants");
class PlayerStats {
    constructor(number, name, color = "", isAdmin = false, isDead = false, health = constants_1.PLAYER_HEALTH, bombRange = 2, speed = constants_1.PLAYER_SPEED, maxBomb = 1, bombsDeployed = 0, invincible = false, invincibleUntil = 0) {
        this.number = number;
        this.name = name;
        this.color = color;
        this.isAdmin = isAdmin;
        this.isDead = isDead;
        this.health = health;
        this.bombRange = bombRange;
        this.speed = speed;
        this.maxBomb = maxBomb;
        this.bombsDeployed = bombsDeployed;
        this.invincible = invincible;
        this.invincibleUntil = invincibleUntil;
        this.isAdmin = this.number === 0;
    }
}
exports.PlayerStats = PlayerStats;
class PlayerPositions {
    constructor(number, pos = {}) {
        this.number = number;
        this.pos = pos;
        this.pos = playerPlaces_1.PLAYER_CREATE_PLACES[this.number].pos;
    }
}
exports.PlayerPositions = PlayerPositions;
class Players {
    constructor(infos = [], positions = [], directions = [[], [], [], []], bombers = [], infoChanged = false) {
        this.infos = infos;
        this.positions = positions;
        this.directions = directions;
        this.bombers = bombers;
        this.infoChanged = infoChanged;
    }
}
exports.Players = Players;
