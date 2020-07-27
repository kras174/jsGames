document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const flagsLeft = document.querySelector("#flags-left");
  const result = document.querySelector("#result");
  let width = 10;
  let bombAmount = 20;
  let flags = 0;
  let squares = [];
  let isGameOver = false;

  //Создаём игровое поле
  function createBoard() {
    flagsLeft.innerHTML = bombAmount;

    //Создаём перемешанный игровой массив с рандомным расположением бомб
    const bombsArray = Array(bombAmount).fill("bomb");
    const emptyArray = Array(width * width - bombAmount).fill("valid");
    const gameArray = emptyArray.concat(bombsArray);
    const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("id", i);
      square.classList.add(shuffledArray[i]);
      grid.appendChild(square);
      squares.push(square);

      //Клик по квадрату левой кнопкой мыши
      square.addEventListener("click", function (e) {
        click(square);
      });

      //Клик по квадрату правой кнопкой мыши
      square.oncontextmenu = function (e) {
        e.preventDefault();
        addFlag(square);
      };
    }

    //Добавление значений квадрата в зависимости от расположенных вокруг него бомб
    for (let i = 0; i < squares.length; i++) {
      let total = 0;
      const isLeftEdge = i % width === 0;
      const isRightEdge = i % width === width - 1;

      if (squares[i].classList.contains("valid")) {
        if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains("bomb")) total++;
        if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains("bomb")) total++;
        if (i > 9 && !isLeftEdge && squares[i - 1 - width].classList.contains("bomb")) total++;
        if (i > 9 && squares[i - width].classList.contains("bomb")) total++;
        if (i < 90 && squares[i + width].classList.contains("bomb")) total++;
        if (i < 99 && !isRightEdge && squares[i + 1].classList.contains("bomb")) total++;
        if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains("bomb")) total++;
        if (i < 89 && !isRightEdge && squares[i + 1 + width].classList.contains("bomb")) total++;
        squares[i].setAttribute("data", total);
      }
    }
  }

  createBoard();

  //Клик правой кнопкой по квадрату - добавление флага
  function addFlag(square) {
    if (isGameOver) return;
    if (!square.classList.contains("checked") && flags < bombAmount) {
      if (!square.classList.contains("flag")) {
        square.classList.add("flag");
        square.innerHTML = " 🚩";
        flags++;
        flagsLeft.innerHTML = bombAmount - flags;
        checkForWin();
      } else {
        square.classList.remove("flag");
        square.innerHTML = "";
        flags--;
        flagsLeft.innerHTML = bombAmount - flags;
      }
    }
  }

  //Клик левой кнопкой по квадрату - зачекать квадрат
  function click(square) {
    let currentId = square.id;
    if (isGameOver) return;
    if (square.classList.contains("checked") || square.classList.contains("flag")) return;
    if (square.classList.contains("bomb")) {
      gameOver(square);
    } else {
      let total = square.getAttribute("data");
      square.classList.add("checked");
      if (total != 0) {
        square.innerHTML = total;
        return;
      }
      checkSquare(square, currentId);
    }
  }

  //Проверяем соседние с нажатым квадраты
  function checkSquare(square, currentId) {
    const isLeftEdge = currentId % width === 0;
    const isRightEdge = currentId % width === width - 1;

    setTimeout(() => {
      if (currentId > 0 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 9 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 9 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId > 9) {
        const newId = squares[parseInt(currentId) - width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 90) {
        const newId = squares[parseInt(currentId) + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 99 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 90 && !isLeftEdge) {
        const newId = squares[parseInt(currentId) - 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
      if (currentId < 89 && !isRightEdge) {
        const newId = squares[parseInt(currentId) + 1 + width].id;
        const newSquare = document.getElementById(newId);
        click(newSquare);
      }
    }, 10);
  }

  //Конец игры
  function gameOver(square) {
    result.innerHTML = "BOOM! Game Over!";
    isGameOver = true;

    //Показать все бомбы
    squares.forEach((square) => {
      if (square.classList.contains("bomb")) {
        square.innerHTML = "💣";
        square.classList.remove("bomb");
        square.classList.add("checked");
      }
    });
  }

  //Проверка победы
  function checkForWin() {
    let matches = 0;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i].classList.contains("flag") && squares[i].classList.contains("bomb")) {
        matches++;
      }
      if (matches === bombAmount) {
        result.innerHTML = "YOU WIN!";
        isGameOver = true;
      }
    }
  }
});
