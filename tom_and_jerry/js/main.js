// https://github.com/zynasiuk/js_games/tree/master/tom_and_jerry
const c = document.getElementById("my_canvas");
const ctx = c.getContext("2d");
const wrapper = document.getElementById("my_canvas_wrapper");
c.width = "960";
c.height = "571";
/* FONTS INSIDE CANVAS */
const l_font = new FontFace('Londrina Shadow', 'url(../fonts/londrina-shadow-v9-latin-regular.woff)');
let lives = 3;
let game_on = true;
/* TIME */
let start = true;
let stop = false;
let stopIni = 100000;
let time_to_zero = 0;
/* MOVES */
let move = false;
let forward = false;
let backward = false;
let speed = 20;
let distance = 0;
let steps = 0;
/* CHARACTERS */
const tom = new Image();
const tom_width = 200;
let tom_x = 10;
let tom_y = 230;
let tom_in_hole = false;
const jerry = new Image();
const jerry_y = 330;
const jerry_width = 110;
let jerry_x = tom_width * 2;
let run_under = false;
let run_above = false;
let game_over_img = new Image();
/* OBSTACLES */
const extra_distance = 200;
const next_obstacle_like_this = Math.round(Math.random() * 1000);
const hole_y = 430;
const hole = new Image();
const hole_width = 298;
let hole_x = c.width + extra_distance;
const tree = new Image();
const tree_y = 370;
const tree_width = 175;
let tree_x = c.width - extra_distance;
let hit_tree = false;
const cheese = new Image();
const cheese_distance = 2;
const cheese_width = 105;
const cheese_height = 81;
let cheese_y = -10;
let cheese_x = Math.round(Math.random() * c.width);
let cheese_hit = false;


/* FUNCTIONS */
function draw_cheese() {
    cheese.onload = () => {
        ctx.drawImage(cheese, cheese_x, cheese_y);
    }
    cheese.src = "img/cheese.png";
    cheese_y += cheese_distance;
    if (cheese_x > tom_x && cheese_x + cheese_width < tom_x + tom_width && tom_y < cheese_y + cheese_height) {
        info("Watch your head & press Enter!", 100);
        cheese_hit = true;
        document.removeEventListener("keydown", toetsIn);
    }

    if (cheese_y > c.height - 200 && cheese_hit != true) {
        cheese_y = -40;
        cheese_x = Math.round(Math.random() * c.width);
    }

    if (cheese_hit == true) {
        ctx.drawImage(cheese, tom_x + tom_width, 400);
    } else {
        ctx.drawImage(cheese, cheese_x, cheese_y);
    }
}


function draw_hole(hole_position) {
    hole.onload = () => {
        ctx.drawImage(hole, hole_position, hole_y);
    }
    hole.src = "img/hole_in_ground.png";
    ctx.drawImage(hole, hole_position, hole_y);
    if (tom_x > hole_position && tom_x < hole_position + tom_width && tom_y == 230 && cheese_hit != true) {
        tom_in_hole = true;
        
        ctx.drawImage(tom, hole_position + 40, tom_y + 130);
        info("Press Enter to give another try!", 100);
        cheese_x = -200;
    }

    if (jerry_x > hole_position && jerry_x < hole_position + hole_width - jerry_width) {
        run_above = true;
    }
}

function draw_tree(tree_position) {
    tree.onload = () => {
        ctx.drawImage(tree, tree_position, tree_y);
    }
    tree.src = "img/fallen_tree.png";
    ctx.drawImage(tree, tree_position, tree_y);
    if (tom_x + tom_width >= tree_position && tom_x <= tree_position + tree_width / 3 && tom_y == 230) {
        hit_tree = true;
    }
    if (jerry_x + jerry_width >= tree_position && jerry_x <= tree_position + jerry_width) {
        run_under = true;
    }
}

function draw_shadow_tom(radiusX, radiusY) {
    ctx.beginPath();
    ctx.fillStyle = "rgb(0,0,0,0.1)"
    ctx.ellipse(tom_x + 100, 450, radiusX, radiusY, Math.PI, 0, 2 * Math.PI);
    ctx.fill();
}

function tom_behave(x, y) {
    tom.onload = () => {
        ctx.drawImage(tom, x, y);
    }
    if ((move == false && backward == true) || (move == false && tom_in_hole != true) || (move == false && cheese_hit != true)) {
        tom.src = "img/tom_standing.png";
        draw_shadow_tom(70, 15);
    }

    if (move == true && forward == true) {
        if (steps % 2 == 0) {
            tom.src = "img/tom_left.png";
        } else {
            tom.src = "img/tom_right.png";
        }
        draw_shadow_tom(100, 10);
    }

    if (cheese_hit == true) {
        tom.src = "img/tom_cheese.png";
    }

    if (tom_in_hole == true) {
        tom.src = "img/tih.png";
        document.removeEventListener("keydown", toetsIn);
    } else {
        ctx.drawImage(tom, tom_x, tom_y);
    }
}


function draw_shadow_jerry(color, radiusX, radiusY) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.ellipse(jerry_x + 60, jerry_y + 110, radiusX, radiusY, Math.PI, 0, 2 * Math.PI);
    ctx.fill();
}

function jerry_behave(x, y) {
    jerry.onload = () => {
        ctx.drawImage(jerry, x, y);
    }
    if (move == false) {
        jerry.src = "img/jerry_stops.png";
        draw_shadow_jerry("rgb(0,0,0,0.1)", 35, 10);
    }
    if (move == true && forward == true && run_under != true) {
        if (steps % 2 == 0) {
            jerry.src = "img/jerry_right.png";
        } else {
            jerry.src = "img/jerry_left.png";
        }
        draw_shadow_jerry("rgb(0,0,0,0.1)", 35, 10);
    }

    if (run_above == true && cheese_hit != true) {
        draw_shadow_jerry("rgb(255, 255,255,.8)", 35, 2);
    }
    if (run_under == true && cheese_hit != true) {
        jerry.src = "";
    } else {
        ctx.drawImage(jerry, jerry_x, jerry_y);
    }
    run_under = false;
    run_above = false;
}

function draw_game_over(x,y) {
    game_over_img.onload = () => {
        ctx.drawImage(game_over_img, x, y);
    }
    game_over_img.src = "img/game_off.png";
}

/* KEYBOARD */
document.addEventListener("keydown", toetsIn);
document.addEventListener("keyup", toetsUit);

function toetsIn(evt) {

    if (evt.keyCode == 39) {
        forward = true;
        distance -= speed;
        steps++;
        jerry_x = jerry_x + steps / 30;
        tom_x = tom_x + steps / 20;
        hole_x = hole_x - steps;
        tree_x = tree_x - steps;
        cheese_x = cheese_x - steps;
        move = true;
    }

    if (evt.keyCode == 39 && hit_tree == true) {
        distance += speed;
        tree_x = tree_x + steps;
        hole_x = hole_x + steps;
        tom_x = tom_x - steps / 20;
        cheese_x = cheese_x + steps;
    }

    if (evt.keyCode == 37) {
        back = true;
        if (distance < 0) {
            distance += speed;
            jerry_x += speed;
            hole_x = hole_x + steps;
            tree_x = tree_x + steps;
            cheese_x = cheese_x + steps;
            tom_x = tom_x - steps / 20;
            tom_y = 230;
            move = false;
            hit_tree = false;
        }
    }

    if (evt.keyCode == 38) {
        tom_y = 130;
        forward = true;
        move = true;
        hit_tree = false;
    }

    if (evt.code == 32 && time_to_zero_round == 0 || lives == 0) {
        document.location.reload();
    }
    wrapper.style.transform = "translateX(" + distance + "px)";
}

function toetsUit(evt) {
    forward = false;
    move = false;
    tom_y = 230;

    if (evt.keyCode == 13) {
        document.removeEventListener("keydown", reset);
        document.addEventListener("keydown", toetsIn);
    }
}

/* FONTS */

l_font.load().then(function (l_font_add) {
    document.fonts.add(l_font_add);
});
ctx.font = "30px Londrina Shadow";


/* TIMER */

function update(timer) {
    ctx.clearRect(0, 0, c.width, c.height);
    if (start) {
        start = false;
    } else if (timer >= stopIni) {
        stop = true;
        time_to_zero = 0;
    }
    time_to_zero = stopIni - timer;
    time_to_zero_round = Math.round(time_to_zero / 1000);

    if (!stop) {
        requestAnimationFrame(update);
    }
}
update();


/* FUNCTION GAME */

function game() {
    ctx.clearRect(0, 0, c.width, c.height);
    window.requestAnimationFrame(game);

    //lives and timer
    ctx.fillStyle = "yellow";
    ctx.fillText("Lives: " + lives, 710, 30);
    ctx.fillText("Time: " + time_to_zero_round + "s", 830, 30);
    //obstacles  
    draw_tree(tree_x);
    draw_tree(tree_x + next_obstacle_like_this * 3);
    draw_tree(tree_x + next_obstacle_like_this * 8);
    draw_tree(tree_x + next_obstacle_like_this * 12);
    draw_tree(tree_x + next_obstacle_like_this * 15);
    draw_tree(tree_x + next_obstacle_like_this * 20);
    draw_hole(hole_x);
    draw_hole(hole_x + next_obstacle_like_this * 10);
    draw_hole(hole_x + next_obstacle_like_this * 12);
    draw_hole(hole_x + next_obstacle_like_this * 15);
    draw_hole(hole_x + next_obstacle_like_this * 20);
    draw_cheese(cheese_x);
    //characters
    tom_behave(tom_x, tom_y);
    jerry_behave(jerry_x, jerry_y);
    if (time_to_zero_round == 0) {
        info("Time over. Enter! Space!", 150);
        draw_game_over();
        ctx.drawImage(game_over_img, 600, 230);
        game_on = false;
    }
    if (lives == 0 || tom_x + tom_width > c.width) {
        info("Game over. Enter! Space!", 150);
        draw_game_over();
        ctx.drawImage(game_over_img, 600, 230);
        game_on = false;
    }
    if (tom_x + tom_width > jerry_x + jerry_width / 4) {
        info("Nice! BRAVO! Enter? ;)", 100);
        draw_game_over();
        ctx.drawImage(game_over_img, 600, 230);
        game_on = false;
    }   
}

game();

function reset(evt) {
    if (evt.keyCode == 13 && cheese_hit || (evt.keyCode == 13 && tom_in_hole)) {
        lives--;
        jerry_x = tom_width * 2;
        tom_x = 10;
        distance = 0;
        steps = 0;
        hole_x = c.width + extra_distance;
        tom_y = 230;
        tom_in_hole = false;
        cheese_hit = false;
        cheese_y = -30;
        cheese_x = Math.round(Math.random * c.width);
    }

    if (evt.keyCode == 13 && game_on == false) {
        document.location.reload();
    }
}

function info(x, y) {
    ctx.beginPath();
    if (game_on == false) {
        ctx.fillStyle = "rgba(255,255,0, 1)";

    } else {
        ctx.fillStyle = "rgba(255,255,0, .8)";
    }   
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.font = "60px Londrina Shadow";
    ctx.fillStyle = "rgb(255,99,71)";
    ctx.fillText(x, y, c.height/2);
    document.addEventListener("keydown", reset);
    ctx.font = "30px Londrina Shadow";
}
