/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function FiveCtrl($scope) {
    $scope.newGame = function () {//刷新游戏
        history.go(0);
    };
    //定义各种变量：
    //定义棋子：
    $scope.NoChess = 0;
    $scope.BlackChess = -1;
    $scope.WhiteChess = 1;
    $scope.chessArr = [];
    $scope.player = "black";
    $scope.AI = "white";
    //定义游戏状态：
    $scope.isPlayerTurn = true;
    $scope.isStart = false;
    $scope.isOver = false;
    //定义函数：
    //开始：
    $scope.gameStart = function () {
        if (!$scope.isPlayerTurn) {
            $scope.AImoveChess();
        }
        $scope.isStart = true;
    };
    //结束:
    $scope.gameOver = function () {
        $scope.isStart = false;
    };
    //判断：
    $scope.isPlayerWin = function (i, j) {
        var number = 1;
        var chessColor = this.player === "black" ? $scope.BlackChess : $scope.WhiteChess;
        var m, n;
        //x:
        for (m = j - 1; m >= 0; m--) {
            if ($scope.chessArr[i][m] === chessColor) {
                number++;
            } else {
                break;
            }
        }
        for (m = j + 1; m < 15; m++) {
            if ($scope.chessArr[i][m] === chessColor) {
                number++;
            } else {
                break;
            }
        }
        if (number >= 5) {
            $scope.playerWin();
            return;
        } else {
            number = 1;
        }
        //y:
        for (m = i - 1; m >= 0; m--) {
            if ($scope.chessArr[m][j] === chessColor) {
                number++;
            } else {
                break;
            }
        }
        for (m = i + 1; m < 15; m++) {
            if ($scope.chessArr[m][j] === chessColor) {
                number++;
            } else {
                break;
            }
        }
        if (number >= 5) {
            $scope.playerWin();
            return;
        } else {
            number = 1;
        }
        //xy:
        for (m = i - 1, n = j - 1; m >= 0 && n >= 0; m--, n--) {
            if ($scope.chessArr[m][n] === chessColor) {
                number++;
            } else {
                break;
            }
        }
        for (m = i + 1, n = j + 1; m < 15 && n < 15; m++, n++) {
            if ($scope.chessArr[m][n] === chessColor) {
                number++;
            } else {
                break;
            }
        }

        if (number >= 5) {
            $scope.playerWin();
            return;
        } else {
            number = 1;
        }
        //yx:
        for (m = i - 1, n = j + 1; m >= 0 && n < 15; m--, n++) {
            if ($scope.chessArr[m][n] === chessColor) {
                number++;
            } else {
                break;
            }
        }
        for (m = i + 1, n = j - 1; m < 15 && n >= 0; m++, n--) {
            if ($scope.chessArr[m][n] === chessColor) {
                number++;
            } else {
                break;
            }
        }

        if (number >= 5) {
            $scope.playerWin();
            return;
        } else {
            number = 1;
        }
        $scope.AImoveChess();
    };
    $scope.playerWin = function () {
        $scope.gameOver();
        alert("You Win!");
        $scope.newGame();
    };
    $scope.AIWin = function () {
        $scope.gameOver();
        alert("You Lose!");
        $scope.newGame();
    };
    //下棋：
    $scope.playChess = function (i, j, color) {
        $scope.chessArr[i][j] = color === "black" ? $scope.BlackChess : $scope.WhiteChess;
        $("div.chessboard div:eq(" + (i * 15 + j) + ")").addClass(color);
    };
    //AI:
    $scope.AImoveChess = function () {
        $scope.isPlayerTurn = false;//disable player
        //init:
        var maxX = 0;
        var maxWeight = 0;
        var maxY = 0;
        var i, j, tem;
        //对每一个座标计算权重：
        for (i = 14; i >= 0; i--) {
            for (j = 14; j >= 0; j--) {
                if ($scope.chessArr[i][j] !== $scope.NoChess) {
                    continue;
                }
                tem = $scope.computeWeight(i, j);
                if (tem > maxWeight) {
                    maxWeight = tem;
                    maxX = i;
                    maxY = j;
                }
            }
        }
        $scope.playChess(maxX, maxY, $scope.AI);
        if ((maxWeight >= 100000 && maxWeight < 250000) || (maxWeight >= 500000)) {
            $scope.AIWin();
        }else {
            $scope.isPlayerTurn = true;
        }
    };
    //权重的计算：
    $scope.putX = function (i, j, color) {
        var m, num = 1, side1 = false, side2 = false;
        for (m = j - 1; m >= 0; m--) {
            if ($scope.chessArr[i][m] === color) {
                num++;
            } else {
                if ($scope.chessArr[i][m] === $scope.NoChess) {
                    side1 = true;
                }
                break;
            }
        }
        for (m = j + 1; m < 15; m++) {
            if ($scope.chessArr[i][m] === color) {
                num++;
            } else {
                if ($scope.chessArr[i][m] === $scope.NoChess) {
                    side2 = true;
                }
                break;
            }
        }
        return {"num": num, "side1": side1, "side2": side2};
    };
    $scope.putY = function (i, j, color) {
        var m, num = 1, side1 = false, side2 = false;
        for (m = i - 1; m >= 0; m--) {
            if ($scope.chessArr[m][j] === color) {
                num++;
            } else {
                if ($scope.chessArr[m][j] === $scope.NoChess) {
                    side1 = true;
                }
                break;
            }
        }
        for (m = i + 1; m < 15; m++) {
            if ($scope.chessArr[m][j] === color) {
                num++;
            } else {
                if ($scope.chessArr[m][j] === $scope.NoChess) {
                    side2 = true;
                }
                break;
            }
        }
        return {"num": num, "side1": side1, "side2": side2};
    };
    $scope.putXY = function (i, j, color) {
        var m, n, num = 1, side1 = false, side2 = false;
        for (m = i - 1, n = j - 1; m >= 0 && n >= 0; m--, n--) {
            if ($scope.chessArr[m][n] === color) {
                num++;
            } else {
                if ($scope.chessArr[m][n] === $scope.NoChess) {
                    side1 = true;
                }
                break;
            }
        }
        for (m = i + 1, n = j + 1; m < 15 && n < 15; m++, n++) {
            if ($scope.chessArr[m][n] === color) {
                num++;
            } else {
                if ($scope.chessArr[m][n] === $scope.NoChess) {
                    side2 = true;
                }
                break;
            }
        }
        return {"num": num, "side1": side1, "side2": side2};
    };
    $scope.putYX = function (i, j, color) {
        var m, n, num = 1, side1 = false, side2 = false;
        for (m = i - 1, n = j + 1; m >= 0 && n < 15; m--, n++) {
            if ($scope.chessArr[m][n] === color) {
                num++;
            } else {
                if ($scope.chessArr[m][n] === $scope.NoChess) {
                    side1 = true;
                }
                break;
            }
        }
        for (m = i + 1, n = j - 1; m < 15 && n >= 0; m++, n--) {
            if ($scope.chessArr[m][n] === color) {
                num++;
            } else {
                if ($scope.chessArr[m][n] === $scope.NoChess) {
                    side2 = true;
                }
                break;
            }
        }
        return {"num": num, "side1": side1, "side2": side2};
    };
    $scope.computeWeight = function (i, j) {
        var weight = 14 - (Math.abs(i - 7) + Math.abs(j - 7)), //init
                pointInfo = {},
                chessColor = $scope.AI === "black" ? $scope.BlackChess : $scope.WhiteChess;
        //x:
        pointInfo = $scope.putX(i, j, chessColor);
        weight += $scope.weightStatus(pointInfo.num, pointInfo.side1, pointInfo.side2, true);
        pointInfo = $scope.putX(i, j, -chessColor);
        weight += $scope.weightStatus(pointInfo.num, pointInfo.side1, pointInfo.side2, false);
        //y:
        pointInfo = $scope.putY(i, j, chessColor);
        weight += $scope.weightStatus(pointInfo.num, pointInfo.side1, pointInfo.side2, true);
        pointInfo = $scope.putY(i, j, -chessColor);
        weight += $scope.weightStatus(pointInfo.num, pointInfo.side1, pointInfo.side2, false);
        //xy:
        pointInfo = $scope.putXY(i, j, chessColor);
        weight += $scope.weightStatus(pointInfo.num, pointInfo.side1, pointInfo.side2, true);
        pointInfo = $scope.putXY(i, j, -chessColor);
        weight += $scope.weightStatus(pointInfo.num, pointInfo.side1, pointInfo.side2, false);
        //yx:
        pointInfo = $scope.putYX(i, j, chessColor);
        weight += $scope.weightStatus(pointInfo.num, pointInfo.side1, pointInfo.side2, true);
        pointInfo = $scope.putYX(i, j, -chessColor);
        weight += $scope.weightStatus(pointInfo.num, pointInfo.side1, pointInfo.side2, false);
        return weight;
    };
    $scope.weightStatus = function (num, side1, side2, isAI) {
        var weight = 0;
        switch (num) {
            case 1:
                if (side1 && side2) {
                    weight = isAI ? 15 : 10;
                }
                break;
            case 2:
                if (side1 && side2) {
                    weight = isAI ? 100 : 50;
                }
                else if (side1 || side2) {
                    weight = isAI ? 10 : 5;
                }
                break;
            case 3:
                if (side1 && side2) {
                    weight = isAI ? 500 : 200;
                }
                else if (side1 || side2) {
                    weight = isAI ? 30 : 20;
                }
                break;
            case 4:
                if (side1 && side2) {
                    weight = isAI ? 5000 : 2000;
                }
                else if (side1 || side2) {
                    weight = isAI ? 400 : 100;
                }
                break;
            case 5:
                weight = isAI ? 100000 : 10000;
                break;
            default:
                weight = isAI ? 500000 : 250000;
                break;
        }
        return weight;
    };

    //初始化游戏：
    $scope.InitGame = function () {
        $scope.isOver = false;
        $scope.isPlayerTurn = true;
        var i, j;
        for (i = 0; i < 15; i++) {
            $scope.chessArr[i] = [];
            for (j = 0; j < 15; j++) {
                $scope.chessArr[i][j] = $scope.NoChess;
            }
        }
        //player:
        $("div.chessboard div").click(function () {
            if ($scope.isPlayerTurn === false || $scope.isOver === true) {
                return;
            }
            if ($scope.isStart === false) {
                $scope.gameStart();
            }
            //第几个棋子：
            var index = $(this).index();
            //算出座标
            var i = index / 15 | 0;
            var j = index % 15;
            if ($scope.chessArr[i][j] === $scope.NoChess) {
                $scope.playChess(i, j, $scope.player);
                $(this).removeClass("hover");
                $scope.isPlayerWin(i, j);
            }
        });
        //目标点提示：
        $("div.chessboard div").hover(function () {
            if ($scope.isPlayerTurn === false || $scope.isOver === true) {
                return;
            }
            //第几个棋子：
            var index = $(this).index();
            //算出座标
            var i = index / 15 | 0;
            var j = index % 15;
            if ($scope.chessArr[i][j] === $scope.NoChess) {
                $(this).addClass("hover");
            }
        }, function () {//移开
            if ($scope.isPlayerTurn === false || $scope.isOver === true) {
                return;
            }
            //第几个棋子：
            var index = $(this).index();
            //算出座标
            var i = index / 15 | 0;
            var j = index % 15;
            if ($scope.chessArr[i][j] === $scope.NoChess) {
                $(this).removeClass("hover");
            }
        });
    };

}