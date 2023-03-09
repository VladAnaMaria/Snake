//prepare game
let gameTable = document.getElementById('table');
let ctx = table.getContext('2d');
let gameHasStarted = false;
const sizeSquare = 35;

function fillBox(x, y) {
    if (x % 2 == y % 2) {
        ctx.fillStyle = '#AAD751';
        ctx.fillRect(x * sizeSquare, y * sizeSquare, sizeSquare, sizeSquare);
    } else {
        ctx.fillStyle = '#BBDF74';
        ctx.fillRect(x * sizeSquare, y * sizeSquare, sizeSquare, sizeSquare);
    }
}

function drawGameTable() {
    for (let x = 0; x < 17; ++x) {
        for (let y = 0; y < 17; ++y) {
            fillBox(x, y);
        }
    }
}

//snake
let snake = [{x: 6, y: 8}, {x: 5, y: 8}, {x: 4, y: 8}, {x: 3, y: 8}];
const startSnakeLength = snake.length;

function drawSnake() {
    snake.forEach((element, index) => {
        if (index == 0) {
            ctx.fillStyle = '#38546E';
            ctx.fillRect(element.x * sizeSquare, element.y * sizeSquare, sizeSquare, sizeSquare);
        } else {
            ctx.fillStyle = '#537EA5';
            ctx.fillRect(element.x * sizeSquare, element.y * sizeSquare, sizeSquare, sizeSquare);
        }
    });
}

//apple
let apple = getApple();

function drawApple() {
    ctx.fillStyle = '#D02E2E';
    ctx.fillRect(apple.x * sizeSquare, apple.y * sizeSquare, sizeSquare, sizeSquare);
}

function getApple() {
    let apple = {x: Math.floor(Math.random() * (17)), y: Math.floor(Math.random() * (17))};
    while (snake.some(function(element) {
        if (element.x == apple.x && element.y == apple.y) {
            apple = {x: Math.floor(Math.random() * (17)), y: Math.floor(Math.random() * (17))};
        }
    }));
    return apple;
}

function eatApple() {
    return snake[0].x == apple.x && snake[0].y == apple.y;
}

//score
let score = 0;
let highScore = localStorage.getItem('highScoreId') || 0;

function getScore() {   
    document.getElementById('scoreId').innerHTML = score;
    document.getElementById('highScoreId').innerHTML = highScore;
}

//set direction and move snake
document.addEventListener('keydown', changeDirection);
let dx = 1;
let dy = 0;
let myInterval;

function changeDirection(event) {
    document.querySelector('.startBox').hidden = true;

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
 
    const keyPressed = event.keyCode;
    const goingUp = dy == -1;
    const goingDown = dy == 1;
    const goingRight = dx == 1;  
    const goingLeft = dx == -1;

    if (keyPressed == LEFT_KEY && !goingRight) {    
       dx = -1;
       dy = 0;  
    }
    if (keyPressed == UP_KEY && !goingDown) {    
       dx = 0;
       dy = -1;
    }
    if (keyPressed == RIGHT_KEY && !goingLeft) {    
       dx = 1;
       dy = 0;
    }
    if (keyPressed == DOWN_KEY && !goingUp) {    
       dx = 0;
       dy = 1;
    }
    if (!gameHasStarted) {
        gameHasStarted = true;
        myInterval = setInterval(game, 200);
    }  
}

function moveSnake() {
    if (!gameHasStarted) {
        return;
    }
    for (let i = 0; i < snake.length; ++i) {
        if (i == snake.length - 1) {
           clearSnake(snake[i].x, snake[i].y);
        }        
    }
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (eatApple()) {
        apple = getApple();
        score = snake.length - startSnakeLength;
        if (highScore < score) {
            highScore = score;
        }
        getScore();
    } else {
        snake.pop();
    }
    drawApple();
    drawSnake(); 
}

function clearSnake(x, y) {
    ctx.clearRect(x * sizeSquare, y * sizeSquare, sizeSquare, sizeSquare);
    fillBox(x, y);
}

//end game
function gameHasEnded() {
    if (snake[0].x + dx < 0 || snake[0].x + dx == 17 || snake[0].y + dy < 0 || snake[0].y + dy == 17) {
        return true;
    }
    for (let i = 4; i < snake.length; ++i) {
        if (snake[i].x == snake[0].x + dx && snake[i].y == snake[0].y + dy) {
            return true;
        }
    }
}

function gameOver() {
    document.querySelector('.gameOverScore .current').innerHTML = 'Your score: ' + score;
    document.querySelector('.gameOverScore .best').innerHTML = 'Best score: ' + highScore;
    document.querySelector('.gameOverBox').hidden = false;
    dx = 1;
    dy = 0;
}

//main
function game() {
    if (gameHasEnded()) {
        clearInterval(myInterval);
        gameOver();
        return;
    }
    drawGameTable();
    drawSnake();
    drawApple();
    moveSnake();
    getScore();
}
game();

//restart game
function restartGame() {
    document.querySelector('.startBox').hidden = false;
    document.querySelector('.gameOverBox').hidden = true;
    snake = [{x: 6, y: 8}, {x: 5, y: 8}, {x: 4, y: 8}, {x: 3, y: 8}];
    gameHasStarted = false;
    score = 0;
    game();
}
