// プレイヤーデータを保持する変数
let playersData = [];
let playerCount = 0;

// プレイヤーカードの生成関数
function generateCards() {
    const container = document.getElementById("players-container");

    if (playerCount >= 10) {
        alert("最大10プレイヤーまで追加できます。");
        return;
    }
    
    playerCount++;
    addPlayerCard(playerCount);
}

// プレイヤーカードを追加する関数
function addPlayerCard(playerIndex) {
    const container = document.getElementById("players-container");
    const card = document.createElement("div");
    card.className = "player-card";
    card.id = `player${playerIndex}`;
    
    const seatOptions = Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">シート${i + 1}</option>`).join("");

    card.innerHTML = `
        <select id="seat${playerIndex}">${seatOptions}</select>
        <input type="text" id="nickname${playerIndex}" placeholder="ニックネーム">
        <input type="number" id="stack${playerIndex}" placeholder="スタックサイズ">
        <p>BB: <span id="bb${playerIndex}">-</span></p>

        <button class="delete-button" onclick="removePlayerCard(${playerIndex})">削除</button>
    `;
    container.appendChild(card);

    // playersData配列に初期データを追加
    playersData[playerIndex - 1] = { playerIndex, nickname: "", stack: 0, bb: 0, seat: 0 };
}

// プレイヤーカードを削除する関数
function removePlayerCard(playerIndex) {
    document.getElementById(`player${playerIndex}`).remove();

    // プレイヤーデータをクリア（削除ではなく、初期化）
    playersData[playerIndex - 1] = { playerIndex, nickname: "", stack: 0, bb: 0, seat: 0 };
    saveData();
}

// BB計算関数
function calculateBB() {
    const blind = parseFloat(document.getElementById("blind").value);
    const stackInfoDisplay = document.getElementById("stack-info-display");
    const stackOrderDisplay = document.getElementById("stack-order-display");
    if (isNaN(blind) || blind <= 0) {
        alert("正しいブラインド金額を入力してください");
        return;
    }
    
    let stackInfoText = "<strong>スタック情報:</strong><br>";
    let stackOrderText = "<strong>スタック順:</strong><br>";
    let stacks = [];

    playersData.forEach(player => {
        if (document.getElementById(`player${player.playerIndex}`)) {
            const nickname = document.getElementById(`nickname${player.playerIndex}`).value || "N/A";
            const stackInput = parseFloat(document.getElementById(`stack${player.playerIndex}`).value);
            const bbDisplay = document.getElementById(`bb${player.playerIndex}`);
            const seat = document.getElementById(`seat${player.playerIndex}`).value;

            if (!isNaN(stackInput) && stackInput > 0) {
                const bb = stackInput / blind;
                bbDisplay.textContent = `${bb.toFixed(2)} BB`;
                player.nickname = nickname;
                player.stack = stackInput;
                player.bb = bb;
                player.seat = seat;
                stacks.push(player);

                stackInfoText += `シート${seat} - ${nickname}：${stackInput} (${bb.toFixed(2)} BB) <br>`;
            } else {
                bbDisplay.textContent = "-";
            }
        }
    });

    // スタック順（多い順に並び替え）
    stacks.sort((a, b) => b.stack - a.stack);
    stacks.slice(0, 10).forEach(player => {
        stackOrderText += `シート${player.seat} - ${player.nickname} - ${player.stack} (${player.bb.toFixed(2)} BB)<br>`;
    });

    stackInfoDisplay.innerHTML = stackInfoText;
    stackOrderDisplay.innerHTML = stackOrderText;
    saveData();
}

// データをローカルストレージに保存
function saveData() {
    localStorage.setItem("playersData", JSON.stringify(playersData));
}
