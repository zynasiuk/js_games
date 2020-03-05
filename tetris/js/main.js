const c = document.getElementById('mijn_canvas');
const ctx = c.getContext('2d');

const rij = 20;
const kolom = 10;
const vierkant = 20;
const kleur_leeg = 'white';
let gameOver = false;
let score = 0;

let veld = [];

// evt listeners
document.addEventListener("keydown", besturen);



for (r = 0; r < rij; r++) {
    veld[r] = [];
    for (k = 0; k < kolom; k++) {
        veld[r][k] = kleur_leeg;
    }
}
console.log(veld);



function teken_vierkant(x, y, kleur) {
    ctx.beginPath();
    ctx.fillStyle = kleur;
    ctx.strokeStyle = 'black';
    ctx.rect(x * vierkant, y * vierkant, vierkant, vierkant);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();

}


function teken_veld() {
    for (r = 0; r < rij; r++) {
        for (k = 0; k < kolom; k++) {
            teken_vierkant(k, r, veld[r][k]);
        }
    }
}

teken_veld();

const blokken = [
    [Z, 'red'],
    [S, 'green'],
    [T, 'yellow'],
    [O, 'blue'],
    [L, 'purple'],
    [I, 'cyan'],
    [J, 'orange']
]

//class Blok
function Blok(tetromino, kleur_blok) {
    this.tetromino = tetromino;
    this.kleur_blok = kleur_blok;

    this.tetrominoN = 0;
    this.tetromino_actief = this.tetromino[this.tetrominoN];

    this.x = 3;
    this.y = -2;
}

function willekeurig_blok() {
    let willekeurig = Math.floor(Math.random() * blokken.length);

    return new Blok(blokken[willekeurig][0], blokken[willekeurig][1]);

}

let huidig_blok = willekeurig_blok();

//wypelnienie bloku
Blok.prototype.vullen = function (kleur_blok) {
    for (r = 0; r < this.tetromino_actief.length; r++) {
        for (k = 0; k < this.tetromino_actief.length; k++) {
            if (this.tetromino_actief[r][k] == 1) {
                teken_vierkant(this.x + k, this.y + r, kleur_blok);
            }

        }
    }
}

Blok.prototype.tekenen = function () {
    this.vullen(this.kleur_blok);
}

//undraw 60 razy na sekunde
Blok.prototype.wis = function () {
    this.vullen(kleur_leeg);
}


console.log(huidig_blok);


// event listeners
// w dol; move down
Blok.prototype.zakken = function () {
    if (!this.bots(0, 1, this.tetromino_actief)) {
        this.wis();
        this.y++;
        this.tekenen();
    } else {
        this.vast();
        huidig_blok = willekeurig_blok();
    }
}

//lewo
Blok.prototype.links = function () {
    if (!this.bots(-1, 0, this.tetromino_actief)) {
        this.wis();
        this.x--;
        this.tekenen();
    }
}

//prawo
Blok.prototype.rechts = function () {
    if (!this.bots(1, 0, this.tetromino_actief)) {
        this.wis();
        this.x++;
        this.tekenen();
    }
}

//tu zmien
Blok.prototype.draaien = function () {

    let volgende_vorm = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;

    if (this.bots(0, 0, volgende_vorm)) {
        if (this.x > kolom / 2) {
            kick = -1;
        } else {
            kick = 1;
        }
    }

    if (!this.bots(kick, 0, volgende_vorm)) {
        this.wis();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length;
        this.tetromino_actief = this.tetromino[this.tetrominoN];
        //  this.tetromino_actief = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
        this.tekenen();
    }


}

function besturen(e) {
    if (e.keyCode == 37) {
        huidig_blok.links();
        dropStart = Date.now();
    } else if (e.keyCode == 38) {
        huidig_blok.draaien();
        dropStart = Date.now();
    } else if (e.keyCode == 39) {
        huidig_blok.rechts();
        dropStart = Date.now();
    } else if (e.keyCode == 40) {
        huidig_blok.zakken();
    }
}

//lock
Blok.prototype.vast = function () {
    for (r = 0; r < this.tetromino_actief.length; r++) {
        for (k = 0; k < this.tetromino_actief.length; k++) {
            if (this.tetromino_actief[r][k] == 0) {
                continue;
            }
            if (this.y + r < 0) {
                alert("Game Over");
                gameOver = true;
                break;
            }
            veld[this.y + r][this.x + k] = this.kleur_blok;
        }
    }


    // remove full rows
    for (r = 0; r < rij; r++) {
        let rij_vol = true;
        for (k = 0; k < kolom; k++) {
            rij_vol = rij_vol && (veld[r][k] != kleur_leeg);
        }
        if (rij_vol) {
            for (y = r; y > 1; y--) {
                for (k = 0; k < kolom; k++) {
                    veld[y][k] = veld[y - 1][k];
                }
                for (k = 0; k < kolom; k++) {
                    veld[0][k] = kleur_leeg;
                }
            }
            score += 10;
        }
    }
    teken_veld();
    document.getElementById("score").innerHTML = score;
}

// botsen
Blok.prototype.bots = function (x, y, blok) {
    for (r = 0; r < blok.length; r++) {
        for (k = 0; k < blok.length; k++) {
            if (blok[r][k] == 0) {
                continue;
            }
            let nieuweX = this.x + k + x;
            let nieuweY = this.y + r + y;

            if (nieuweX < 0 || nieuweX >= kolom || nieuweY >= rij) {
                return true;
            }
            if (nieuweY < 0) {
                continue;
            }

            if (veld[nieuweY][nieuweX] != kleur_leeg) {
                return true;
            }
        }
    }
    return false;
}


//gameloop

let drop_start = Date.now();

function game() {
    let nu = Date.now();
    let verschil_tijd = nu - drop_start;
    if (verschil_tijd > 1000) {
        huidig_blok.zakken();
        drop_start = Date.now();
        //     console.log(huidig_blok.y);
    }

    if (!gameOver) {
        requestAnimationFrame(game);
    }

}

game();
