const c = document.getElementById("my_canvas");
const ctx = c.getContext("2d");

const rij = 20;
const kolom = 10;
const vierkant = 20;
const kleur_leeg = 'white';

let veld = [];

function teken_vierkant(x, y, kleur) {
    ctx.fillStyle = kleur;
    ctx.strokeStyle = 'black';
    ctx.rect(x * vierkant, y * vierkant, vierkant, vierkant);
    ctx.fill();
    ctx.stroke();
}


for(r=0; r<rij; r++) { //mniej niz rij, bo bierzesz poprawke na zero
    veld[r] = [];
    for(k=0;k<kolom;k++){
        veld[r][k] = kleur_leeg;
    }
}
console.log(veld);

function teken_veld() {
   for(r=0;r<rij; r++){
       for(k=0; k<kolom; k++) {
           teken_vierkant(k, r, veld[r][k]);
       }
   }
}

teken_veld();

const blokken = [
    [Z, 'red'],
    [S, 'pink'],
    [T, 'green'],
    [O, 'blue'],
    [L, 'yellow'],
    [I, 'red'],
    [J, 'orange']
];

function Blok(tetromino, kleur) {
    this.tetromino = tetromino;
    this.kleur = kleur;
    
    this.tetrominoN = 0;
    this.tetromino_actief = this.tetromino[this.tetrominoN];
    
    this.x = 3;
    this.y = -2;
}