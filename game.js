// 定义扑克牌 - Define playing cards
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// 游戏状态 - Game state
let gameState = {
  deck: [],
  tableauPiles: Array(7).fill().map(() => []),
  foundationPiles: Array(4).fill().map(() => []),
  stockPile: [],
  wastePile: [],
  selectedCard: null,
  moves: 0,
  score: 0,
  timer: 0,
  timerInterval: null,
  gameStarted: false,
  history: []
};

// DOM元素 - DOM elements
const tableauPilesEl = document.getElementById('tableau-piles');
const stockPileEl = document.getElementById('stock-pile');
const stockCountEl = document.getElementById('stock-count');
const scoreEl = document.getElementById('score');
const movesEl = document.getElementById('moves');
const timerEl = document.getElementById('timer');
const newGameBtn = document.getElementById('new-game');
const undoBtn = document.getElementById('undo');
const winModal = document.getElementById('win-modal');
const closeWinBtn = document.getElementById('close-win');
const playAgainBtn = document.getElementById('play-again');
const finalTimeEl = document.getElementById('final-time');
const finalMovesEl = document.getElementById('final-moves');
const finalScoreEl = document.getElementById('final-score');

// 初始化游戏 - Initialize the game
function initGame() {
  // 创建一副牌 - Create a deck of cards
  createDeck();
  
  // 洗牌 - Shuffle the deck
  shuffleDeck();
  
  // 设置游戏列 - Set up the tableau piles
  setupTableau();
  
  // 设置备用牌堆 - Set up the stock pile
  setupStockPile();
  
  // 重置游戏状态 - Reset the game state
  resetGameState();
  
  // 渲染游戏 - Render the game
  renderGame();
  
  // 显示游戏规则 - Show game rules
  setTimeout(() => {
    //rulesModal.classList.remove('hidden'); // Removed
  }, 100);
}

// 创建一副牌 - Create a deck of cards
function createDeck() {
  gameState.deck = [];
  suits.forEach(suit => {
    ranks.forEach((rank, index) => {  // index 表示它在 ranks 数组中的位置编号，从 0 开始
      gameState.deck.push({
        rank,               //	表示当前的牌面名称
        suit,
        value: index + 1,  // 数值，如 A = 1, 2 = 2, ..., K = 13
        faceUp: false,
        id: `${rank}-${suit}`    // 唯一ID
      });
    });
  });
} 

// 洗牌 - Shuffle the deck， Fisher-Yates Shuffle 
function shuffleDeck() {
  for (let i = gameState.deck.length - 1; i > 0; i--) {       //-1从数组最后一个索引开始
    const j = Math.floor(Math.random() * (i + 1));            //生成 [0, i] 范围内随机整数的标准写法，用于在洗牌中打乱顺序。
    [gameState.deck[i], gameState.deck[j]] = [gameState.deck[j], gameState.deck[i]];
  }
}

// 设置游戏列 - Set up the tableau piles
function setupTableau() {
  gameState.tableauPiles = Array(7).fill().map(() => []);
  
  // 前4列每列7张牌，后3列每列7张牌 - 7 cards in each of the first 4 piles, 7 cards in each of the remaining 3 piles
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      const card = gameState.deck.pop();   //去除顶部三张
      
      // 第1、2、3、4排从左向右的前4张牌面朝下，其余牌面朝上 - The first 4 cards in the first 4 rows are face down, the rest are face up
      if (i < 4 && j < 4) {
        card.faceUp = false;   // 牌面朝下
      } else {
        card.faceUp = true;   // 牌面朝上 
      }
      
      gameState.tableauPiles[i].push(card);        // 放入第 i 列牌堆
    }
  }
}

// 设置备用牌堆 - Set up the stock pile
function setupStockPile() {
  gameState.stockPile = [];
  
  // 剩下的3张牌作为备用牌 - The remaining 3 cards are used as the stock pile
  for (let i = 0; i < 3; i++) {
    const card = gameState.deck.pop();        // 从牌堆顶部拿一张牌
    card.faceUp = false;                     // 设置牌面 朝下
    gameState.stockPile.push(card);         // 放入牌堆
  }
  
  updateStockCount();
}

// 重置游戏状态 - Reset the game state
function resetGameState() {
  gameState.moves = 0;
  gameState.score = 0;
  gameState.timer = 0;
  gameState.gameStarted = true;
  gameState.history = [];
  
  // 重置计时器 - Reset the timer
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
  }
  
  gameState.timerInterval = setInterval(() => {
    gameState.timer++;
    updateTimer();
  }, 1000);      //每过 1 秒，gameState.timer 自动加 1，并刷新页面上的显示
  
  // 更新UI - Update the UI
  updateScore();
  updateMoves();
  updateTimer();
}

// 渲染游戏 - Render the game
function renderGame() {
  // 渲染游戏列 - Render the tableau piles
  renderTableauPiles();
  
  // 渲染备用牌堆 - Render the stock pile
  renderStockPile();
  
  // 渲染已完成牌堆 - Render the foundation piles
  renderFoundationPiles();
}

// 渲染游戏列 - Render the tableau piles
function renderTableauPiles() {
  tableauPilesEl.innerHTML = '';
  
  gameState.tableauPiles.forEach((pile, pileIndex) => {
    const pileEl = document.createElement('div');  //创建一个新的 HTML 元素 <div>，用来装当前列的牌
    pileEl.className = 'tableau-pile relative min-h-[300px]';
    pileEl.dataset.pileIndex = pileIndex;
    
    // 渲染牌堆中的牌 - Render the cards in the pile
    pile.forEach((card, cardIndex) => {
      const cardEl = createCardElement(card, pileIndex, cardIndex); //对象  哪列  那张
      pileEl.appendChild(cardEl);
    });
    
    // 如果牌堆为空，显示空堆占位符 - If the pile is empty, show an empty pile placeholder
    if (pile.length === 0) {
      const emptyPileEl = document.createElement('div');
      emptyPileEl.className = 'h-28 w-20 rounded-lg bg-gray-50 flex items-center justify-center';
      emptyPileEl.innerHTML = '<span class="text-gray-400">Empty</span>';
      pileEl.appendChild(emptyPileEl);      //把这个“空牌位”占位框添加到当前列的 DOM 中
    }
    
    tableauPilesEl.appendChild(pileEl);    //最终将整个列都添加到 tableauPilesEl 这个容器中，完成渲染。
  });
}

// 渲染备用牌堆 - Render the stock pile
function renderStockPile() {
  // 更新备用牌堆计数 - Update the stock pile count
  updateStockCount();
  
  // 添加点击事件 - Add click event
  stockPileEl.onclick = () => {
    if (gameState.stockPile.length > 0) {
      drawFromStock();
    }
  };
}

// 渲染已完成牌堆 - Render the foundation piles
function renderFoundationPiles() {
  // 已完成牌堆由CSS和HTML静态定义，这里只需要处理可能的动画效果
  // The foundation piles are statically defined by CSS and HTML, only need to handle possible animation effects here
}

// 创建牌元素 - Create a card element
function createCardElement(card, pileIndex, cardIndex) {
  const cardEl = document.createElement('div');
  cardEl.className = `absolute card-shadow rounded-lg transition-all duration-300 border border-black/20 ${card.faceUp ? 'bg-white' : 'bg-gradient-to-br from-green-600 to-green-700'}`;
  //                  绝对定位 卡牌阴影       圆角      平滑过渡动画，  持续 300ms    黑色      20% 透明度的边框              如果牌面朝上（faceUp = true）背景为白色如果牌面朝下 → 使用绿色渐变背景
  cardEl.style.width = '80px';
  cardEl.style.height = '112px'; //80×112 像素
  cardEl.style.transform = `translateY(${cardIndex * 40}px)`;  //每张牌向下偏移 40px
  cardEl.dataset.cardId = card.id;
  cardEl.dataset.pileIndex = pileIndex;    //这张牌属于第几列（牌堆）
  cardEl.dataset.cardIndex = cardIndex;   //这张牌在该列的第几张（从上到下）
  
  if (card.faceUp) {
    // 牌面朝上 - Card face up
    const suitColor = card.suit === 'hearts' || card.suit === 'diamonds' ? 'text-card-red' : 'text-card-black';
    const suitIcon = getSuitIcon(card.suit);   //调用了一个函数 getSuitIcon，根据花色返回对应的图标字符
    
    //牌里数字图案样式
    cardEl.innerHTML = `
      <div class="p-1 h-full flex flex-col justify-between">
        <div class="text-xs font-bold ${suitColor}">${card.rank}<br>${suitIcon}</div>   
        <div class="text-2xl font-bold ${suitColor} flex justify-center">${suitIcon}</div>
        <div class="text-xs font-bold ${suitColor} transform rotate-180">${card.rank}<br>${suitIcon}</div>
      </div>
       `;   // 显示点数和花色，小字号  中心花色展示，字号较大  下角反转，模拟真实扑克牌样式

    
    // 添加点击事件 - Add click event
    cardEl.onclick = () => handleCardClick(card, pileIndex, cardIndex);
    
    // 添加拖动事件 - Add drag events
    cardEl.draggable = true;
    cardEl.ondragstart = (e) => {
      e.dataTransfer.setData('text/plain', JSON.stringify({      //把 JavaScript 对象变成字符串
        cardId: card.id,
        pileIndex,
        cardIndex
      }));
      
       // 拖拽视觉效果的处理逻辑
      // 添加拖动样式 - Add drag style
      cardEl.classList.add('opacity-50');
    };
    
    cardEl.ondragend = () => {
      // 移除拖动样式 - Remove drag style
      cardEl.classList.remove('opacity-50');
    };
  } else {
    // 牌面朝下 中间问号图标 - Card face down
    cardEl.innerHTML = `
      <div class="h-full flex items-center justify-center">
        <span class="text-white text-xs">?</span>
      </div>
    `;
    
    // 添加点击事件（翻开牌） - Add click event (flip the card)
    cardEl.onclick = () => {
      if (cardIndex === pile.length - 1) {        //判断这张牌是否是这列牌堆的最后一张
        flipCard(pileIndex, cardIndex);           //如果是最后一张牌，就调用函数翻牌：哪列哪张
      }
    };
  }
  
  // 添加拖放目标事件 - Add drop target events
  cardEl.ondragover = (e) => {
    e.preventDefault();   // 开放权限 否则 ondrop 不会触发

    cardEl.classList.add('bg-gray-100');  //拖拽悬停在某张牌上时它会变得有点浅灰色
  };
  
  cardEl.ondragleave = () => {                
    cardEl.classList.remove('bg-gray-100');  // 拖离时移除高亮背景
  };
  
  cardEl.ondrop = (e) => {                      //拖拽API应用程序接口中的 “放置（Drop）事件”处理函数。
    e.preventDefault();                        //允许浏览器元素成为合法的拖放目标，否则 ondrop 不会触发
    cardEl.classList.remove('bg-gray-100');   // 拖放完成后移除视觉效果

    
    const data = JSON.parse(e.dataTransfer.getData('text/plain'));     //从拖动源中获取通过 dragstart 设置的数据  
    moveCards(data.pileIndex, data.cardIndex, pileIndex, cardIndex,);  // 调用移动到当前位置
  };
  
  return cardEl;
}

// 获取花色图标 - Get suit icon
function getSuitIcon(suit) {
  switch (suit) {
    case 'hearts':
      return '♥';
    case 'diamonds':
      return '♦';
    case 'clubs':
      return '♣';
    case 'spades':
      return '♠';
    default:
      return '';
  }
}

// 处理牌点击事件 - Handle card click event
function handleCardClick(card, pileIndex, cardIndex) {
  // 如果点击的是牌堆中的最后一张牌 - If the clicked card is the last card in the pile
  if (cardIndex === gameState.tableauPiles[pileIndex].length - 1) {
    // 检查是否可以移到已完成牌堆 - Check if it can be moved to the foundation pile
    if (canMoveToFoundation(pileIndex, cardIndex)) {
      moveToFoundation(pileIndex, cardIndex);
      return;
    }
  }
  
  // 如果已经选中了一张牌，尝试移动 - If a card is already selected, try to move
  if (gameState.selectedCard) {
    const { selectedPileIndex, selectedCardIndex } = gameState.selectedCard;    //所在的牌堆编号，堆中的位置索引
    
    // 检查是否可以移动到当前牌堆 - Check if it can be moved to the current pile
    if (selectedPileIndex !== pileIndex && canMoveCards(selectedPileIndex, selectedCardIndex, pileIndex, cardIndex)) {
      moveCards(  );
      gameState.selectedCard = null;   //移动完成后，取消选中状态，并终止函数
      return;
    }
    
    // 如果点击了同一张牌，取消选择 - If the same card is clicked,取消 selection
    if (selectedPileIndex === pileIndex && selectedCardIndex === cardIndex) {
      gameState.selectedCard = null;
      renderGame();
      return;
    }
  }
  
  // 检查是否可以拖动这张牌（及其后面的牌） - Check if this card (and the cards behind it) can be dragged
  if (canDragCards(pileIndex, cardIndex)) {
    // 选中这张牌 - Select this card
    gameState.selectedCard = {
      cardId: card.id,
      pileIndex,
      cardIndex
    };
    
    // 高亮显示可移动的牌 - Highlight the draggable cards
    highlightDraggableCards(pileIndex, cardIndex);
  }
}

// 高亮显示可拖动的牌 - Highlight the draggable cards
function highlightDraggableCards(pileIndex, cardIndex) {
  // 重新渲染游戏列，添加高亮效果 - Re-render the tableau piles with highlight effect
  renderTableauPiles();
  
  // 获取要高亮的牌元素 - Get the card elements to highlight
  const pileEl = tableauPilesEl.children[pileIndex];
  const cards = pileEl.querySelectorAll('.absolute');
  
  for (let i = cardIndex; i < cards.length; i++) {
    cards[i].classList.add('ring-2', 'ring-primary', 'ring-offset-2');
  }
}

// 检查是否可以拖动牌 - Check if cards can be dragged
function canDragCards(pileIndex, cardIndex) {
  const pile = gameState.tableauPiles[pileIndex];
  
  // 如果不是面朝上的牌，不能拖动 - If the card is not face up, it cannot be dragged
  if (!pile[cardIndex].faceUp) {
    return false;
  }
  
  // 检查后面的牌是否形成连续序列 - Check if the following cards form a consecutive sequence
  for (let i = cardIndex; i < pile.length - 1; i++) {
    const currentCard = pile[i];
    const nextCard = pile[i + 1];
    
    // 检查是否是相同花色且数值连续递减 - Check if they are the same suit and in descending order
    if (currentCard.suit !== nextCard.suit || currentCard.value !== nextCard.value + 1) {
      return false;
    }
  }
  
  return true;
}

// 检查是否可以移动牌 - Check if cards can be moved
function canMoveCards(fromPileIndex, fromCardIndex, toPileIndex, toCardIndex) {
  const fromPile = gameState.tableauPiles[fromPileIndex];
  const toPile = gameState.tableauPiles[toPileIndex];       //目标牌堆的索引（要移动到哪一列）
  const movingCards = fromPile.slice(fromCardIndex);       //目标牌堆中拖放目标牌的索引位置

  // 如果目标牌堆为空，只能放置K或包含K的牌组 - If the target pile is empty, only a King or a sequence starting with a King can be placed
  if (toPile.length === 0) {
    return movingCards[0].rank === 'K';
  }

  
  // 如果目标牌堆不为空，检查是否可以放置在目标牌上 - If the target pile is not empty, check if it can be placed on the target card
  const targetCard = toPile[toCardIndex];
  const firstMovingCard = movingCards[0];

  // 必须是相同花色且数值连续递减 - Must be the same suit and in descending order
  return firstMovingCard.suit === targetCard.suit && firstMovingCard.value === targetCard.value - 1;
}

// 移动牌 - Move cards
function moveCards(fromPileIndex, fromCardIndex, toPileIndex, toCardIndex) {
  if (!canMoveCards(fromPileIndex, fromCardIndex, toPileIndex, toCardIndex)) {
    return false;
  }
  
  // 保存历史记录，用于撤销操作 - Save history for undo operation
  saveHistory();
  
  const fromPile = gameState.tableauPiles[fromPileIndex];
  const toPile = gameState.tableauPiles[toPileIndex];
  
  // 移除要移动的牌 - Remove the cards to be moved
  const movingCards = fromPile.splice(fromCardIndex);
  
  // 添加到目标牌堆 - Add to the target pile
  toPile.push(...movingCards);
  
  // 如果源牌堆的最后一张牌是面朝下的，翻过来 - If the last card of the source pile is face down, flip it
  if (fromPile.length > 0 && !fromPile[fromPile.length - 1].faceUp) {
    fromPile[fromPile.length - 1].faceUp = true;
  }
  
  // 检查是否有完整的序列可以移到已完成牌堆 - Check if there is a complete sequence that can be moved to the foundation pile
  checkForCompleteSequences();
  
  // 更新移动次数和分数 - Update moves and score
  gameState.moves++;
  gameState.score += 10; // 每次有效移动加10分 - Add 10 points for each valid move
  
  // 更新UI - Update the UI
  updateMoves();
  updateScore();
  renderGame();
  
  // 检查游戏是否胜利 - Check if the game is won
  checkWinCondition();
  
  return true;
}

// 拿到当前列的牌堆和该牌,检查是否可以移到已完成牌堆 - Check if it can be moved to the foundation pile
function canMoveToFoundation(pileIndex, cardIndex) {
  const pile = gameState.tableauPiles[pileIndex];
  const card = pile[cardIndex];
  
  // 如果不是牌堆的最后一张牌，不能移到已完成牌堆 - If it is not the last card in the pile, it cannot be moved to the foundation pile
  if (cardIndex !== pile.length - 1) {
    return false;
  }
  
  // 如果是A，检查是否有对应的空的已完成牌堆 - If it is an Ace, check if there is a corresponding empty foundation pile
  if (card.rank === 'A') {
    return gameState.foundationPiles.some(pile => pile.length === 0);
  }
  
  // 对于其他牌，检查是否有对应的已完成牌堆可以放置 - For other cards, check if there is a corresponding foundation pile that can be placed
  for (let i = 0; i < gameState.foundationPiles.length; i++) {
    const foundationPile = gameState.foundationPiles[i];
    
    if (foundationPile.length === 0) {
      continue;
    }
    
    const topCard = foundationPile[foundationPile.length - 1];
    
    // 必须是相同花色且数值连续递增 - Must be the same suit and in ascending order
    if (topCard.suit === card.suit && topCard.value === card.value - 1) {
      return true;
    }
  }
  
  return false;
}

// 移到已完成牌堆 - Move to the foundation pile
function moveToFoundation(pileIndex, cardIndex) {
  const pile = gameState.tableauPiles[pileIndex];
  const card = pile[cardIndex];
  
  // 保存历史记录，用于撤销操作 - Save history for undo operation
  saveHistory();
  
  // 找到合适的已完成牌堆 - Find a suitable foundation pile
  let foundationIndex = -1;
  
  if (card.rank === 'A') {
    // 对于A，找到第一个空的已完成牌堆 - For an Ace, find the first empty foundation pile
    foundationIndex = gameState.foundationPiles.findIndex(pile => pile.length === 0);
  } else {
    // 对于其他牌，找到可以放置的已完成牌堆 - For other cards, find a foundation pile that can be placed
    for (let i = 0; i < gameState.foundationPiles.length; i++) {    //遍历所有完成堆
      const foundationPile = gameState.foundationPiles[i];   // 第 i 个完成堆
      
      if (foundationPile.length === 0) {      //如果这个完成堆是空的，就跳过，
        continue;
      }
      
      const topCard = foundationPile[foundationPile.length - 1];    // 获取这个堆最上面的一张牌
      
      if (topCard.suit === card.suit && topCard.value === card.value - 1) {    //花色相同  当前牌的数值比顶牌大 1
        foundationIndex = i;  
        break;
      }
    }
  }
  
  if (foundationIndex === -1) {    //如果没有找到可以放置的位置（foundationIndex 仍然是 -1），就返回 false，说明这张牌不能放上去
    return false;
  }
  
  // 从游戏列中移除牌 - Remove the card from the tableau pile
  pile.splice(cardIndex, 1);
  
  // 添加到已完成牌堆 - Add to the foundation pile
  gameState.foundationPiles[foundationIndex].push(card);
  
  // 如果源牌堆的最后一张牌是面朝下的，翻过来 - If the last card of the source pile is face down, flip it
  if (pile.length > 0 && !pile[pile.length - 1].faceUp) {
    pile[pile.length - 1].faceUp = true;
  }
  
  // 更新分数 - Update the score
  gameState.score += 100; // 移到已完成牌堆加100分 - Add 100 points for moving to the foundation pile
  
  // 更新UI - Update the UI
  updateScore();
  renderGame();
  
  // 检查游戏是否胜利 - Check if the game is won
  checkWinCondition();
  
  return true;
}

// 检查是否有完整的序列可以移到已完成牌堆 - Check if there is a complete sequence that can be moved to the foundation pile
function checkForCompleteSequences() {
  for (let i = 0; i < gameState.tableauPiles.length; i++) {
    const pile = gameState.tableauPiles[i];
    
    if (pile.length >= 13) {
      // 检查是否有从K到A的完整序列 - Check if there is a complete sequence from King to Ace
      const top13Cards = pile.slice(-13);
      let isValidSequence = true;
      
      // 检查是否是相同花色 - Check if they are the same suit
      const suit = top13Cards[0].suit;
      for (let j = 0; j < top13Cards.length; j++) {
        if (top13Cards[j].suit !== suit) {
          isValidSequence = false;
          break;
        }
      }
      
      // 检查是否是从K到A的顺序 - Check if they are in order from King to Ace
      if (isValidSequence) {
        for (let j = 0; j < top13Cards.length; j++) {
          if (top13Cards[j].value !== 13 - j) {
            isValidSequence = false;
            break;
          }
        }
      }
      
      // 如果是完整序列，移到已完成牌堆 - If it is a complete sequence, move it to the foundation pile
      if (isValidSequence) {
        // 保存历史记录，用于撤销操作 - Save history for undo operation
        saveHistory();
        
        // 找到空的已完成牌堆 - Find an empty foundation pile
        const emptyFoundationIndex = gameState.foundationPiles.findIndex(pile => pile.length === 0);
        
        if (emptyFoundationIndex !== -1) {
          // 从游戏列中移除牌 - Remove the cards from the tableau pile
          const sequence = pile.splice(-13);
          
          // 添加到已完成牌堆 - Add to the foundation pile
          gameState.foundationPiles[emptyFoundationIndex].push(...sequence);
          
          // 更新分数 - Update the score
          gameState.score += 1000; // 完整序列加1000分 - Add 1000 points for a complete sequence
          
          // 更新UI - Update the UI
          updateScore();
          renderGame();
          
          // 继续检查其他牌堆 - Continue checking other piles
          checkForCompleteSequences();
        }
      }
    }
  }
}

// 从备用牌堆抽牌 - Draw cards from the stock pile
function drawFromStock() {
  if (gameState.stockPile.length === 0) {
    return;
  }
  
  // 保存历史记录，用于撤销操作 - Save history for undo operation
  saveHistory();
  
  // 从备用牌堆取出一张牌 - Draw a card from the stock pile
  const cardsToDraw = Math.min(3, gameState.stockPile.length);
  
  for (let i = 0; i < cardsToDraw; i++) {
    const card = gameState.stockPile.pop();
    card.faceUp = true;
    
    // 将牌添加到前3个游戏列的末尾 - Add the card to the end of the first 3 tableau piles
    const pileIndex = i;
    gameState.tableauPiles[pileIndex].push(card);
  }
  
  // 更新UI - Update the UI
  updateStockCount();
  renderGame();
  
  // 检查游戏是否胜利 - Check if the game is won
  checkWinCondition();
}

// 翻牌 - Flip a card
function flipCard(pileIndex, cardIndex) {
  const pile = gameState.tableauPiles[pileIndex];
  
  if (cardIndex !== pile.length - 1 || pile[cardIndex].faceUp) {
    return;
  }
  
  // 保存历史记录，用于撤销操作 - Save history for undo operation
  saveHistory();
  
  // 翻牌 - Flip the card
  pile[cardIndex].faceUp = true;
  
  // 更新UI - Update the UI
  renderGame();
}

// 检查游戏胜利条件 - Check the game win condition
function checkWinCondition() {
  // 如果所有牌都在已完成牌堆中，游戏胜利 - If all cards are in the foundation piles, the game is won
  const totalFoundationCards = gameState.foundationPiles.reduce((sum, pile) => sum + pile.length, 0);
  
  if (totalFoundationCards === 52) {
    // 停止计时器 - Stop the timer
    clearInterval(gameState.timerInterval);
    
    // 显示胜利模态框 - Show the win modal
    finalTimeEl.textContent = formatTime(gameState.timer);
    finalMovesEl.textContent = gameState.moves;
    finalScoreEl.textContent = gameState.score;
    winModal.classList.remove('hidden');
  }
}

// 保存历史记录 - Save history
function saveHistory() {
  // 深拷贝当前游戏状态 - Deep copy the current game state
  const historyItem = JSON.parse(JSON.stringify(gameState));   //实现一个深拷贝，避免后续对gameState的修改影响历史记录
  
  // 限制历史记录长度 - Limit the history length
  if (gameState.history.length > 20) {
    gameState.history.shift();      //用于从数组开头移除元素
  }
  
  gameState.history.push(historyItem);
}

// 撤销操作 - Undo operation
function undoMove() {
  if (gameState.history.length === 0) {
    return;
  }
  
  // 恢复上一个状态 - Restore the previous state
  const previousState = gameState.history.pop();  //从牌堆deck的最上面一张牌（数组最后一项）拿出来
  gameState = previousState;
  
  // 更新UI - Update the UI
  renderGame();
  updateScore();
  updateMoves();
  updateTimer();
}

// 获取提示 - Get a hint
function getHint() {
  // 简单的提示逻辑：寻找可能的移动 - Simple hint logic: find possible moves
  // 1. 检查表列之间的移动 - Check moves between tableau piles
  for (let fromPileIndex = 0; fromPileIndex < gameState.tableauPiles.length; fromPileIndex++) {
    const fromPile = gameState.tableauPiles[fromPileIndex];
    
    for (let fromCardIndex = 0; fromCardIndex < fromPile.length; fromCardIndex++) {
      // 跳过面朝下的牌 - Skip face-down cards
      if (!fromPile[fromCardIndex].faceUp) {
        continue;
      }
      
      // 检查是否可以拖动这张牌 - Check if this card can be dragged
      if (!canDragCards(fromPileIndex, fromCardIndex)) {
        continue;
      }
      
      for (let toPileIndex = 0; toPileIndex < gameState.tableauPiles.length; toPileIndex++) {
        if (fromPileIndex === toPileIndex) {
          continue;
        }
        
        const toPile = gameState.tableauPiles[toPileIndex];
        const toCardIndex = toPile.length - 1;
        
        // 检查是否可以移动 - Check if it can be moved
        if (canMoveCards(fromPileIndex, fromCardIndex, toPileIndex, toCardIndex)) {
          // 高亮提示 - Highlight the hint
          highlightHint(fromPileIndex, fromCardIndex, toPileIndex, toCardIndex);
          return true;
        }
      }
    }
  }
  
  // 2. 检查是否可以移到已完成牌堆 - Check if it can be moved to the foundation pile
  for (let pileIndex = 0; pileIndex < gameState.tableauPiles.length; pileIndex++) {
    const pile = gameState.tableauPiles[pileIndex];
    
    for (let cardIndex = 0; cardIndex < pile.length; cardIndex++) {
      if (cardIndex === pile.length - 1 && canMoveToFoundation(pileIndex, cardIndex)) {
        // 高亮提示 - Highlight the hint
        highlightHint(pileIndex, cardIndex, -1, -1); // -1表示已完成牌堆 - -1 indicates the foundation pile
        return true;
      }
    }
  }
  
  // 没有找到提示 - No hint found
  alert('No possible moves found');
  return false;
}

// 高亮提示 - Highlight the hint
function highlightHint(fromPileIndex, fromCardIndex, toPileIndex, toCardIndex) {
  // 重新渲染游戏列 - Re-render the tableau piles
  renderGame();
  
  // 获取源牌堆和目标牌堆 - Get the source and target piles
  const tableauPiles = tableauPilesEl.children;
  
  // 高亮源牌 - Highlight the source cards
  const fromPile = tableauPiles[fromPileIndex];
  const fromCards = fromPile.querySelectorAll('.absolute');
  
  for (let i = fromCardIndex; i < fromCards.length; i++) {
    fromCards[i].classList.add('ring-2', 'ring-primary', 'ring-offset-2');
  }
  
  // 高亮目标位置 - Highlight the target position
  if (toPileIndex !== -1) {
    const toPile = tableauPiles[toPileIndex];
    const toCards = toPile.querySelectorAll('.absolute');
    
    if (toCards.length > 0) {
      toCards[toCardIndex].classList.add('ring-2', 'ring-amber-500', 'ring-offset-2');
    } else {
      // 如果目标牌堆为空，高亮空堆 - If the target pile is empty, highlight the empty pile
      const emptyPile = toPile.querySelector('.border-dashed');
      if (emptyPile) {
        emptyPile.classList.add('ring-2', 'ring-amber-500', 'ring-offset-2');
      }
    }
  } else {
    // 高亮已完成牌堆 - Highlight the foundation piles
    const foundationPiles = document.querySelectorAll('.foundation-pile');
    
    for (let i = 0; i < foundationPiles.length; i++) {
      foundationPiles[i].classList.add('ring-2', 'ring-amber-500', 'ring-offset-2');
    }
  }
  
  // 扣分 - Deduct points
  gameState.score -= 20;
  updateScore();
  
  // 3秒后取消高亮 - Remove the highlight after 3 seconds
  setTimeout(() => {
    renderGame();
  }, 3000);
}

// 更新备用牌堆计数 - Update the stock pile count
function updateStockCount() {
  stockCountEl.textContent = gameState.stockPile.length;
}

// 更新分数 - Update the score
function updateScore() {
  scoreEl.textContent = gameState.score;
}

// 更新移动次数 - Update the moves
function updateMoves() {
  movesEl.textContent = gameState.moves;
}

// 更新计时器 - Update the timer
function updateTimer() {
  timerEl.textContent = formatTime(gameState.timer);
}

// 格式化时间 - Format time
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// 事件监听器 - Event listeners
newGameBtn.addEventListener('click', () => {
  // 确认是否开始新游戏 - Confirm if you want to start a new game
  if (confirm('Are you sure you want to start a new game? Your current progress will be lost.')) {
    initGame();
  }
});

undoBtn.addEventListener('click', undoMove); //撤销

//hintBtn.addEventListener('click', getHint);
closeWinBtn.addEventListener('click', () => {
  winModal.classList.add('hidden');
});
playAgainBtn.addEventListener('click', () => {
  winModal.classList.add('hidden');
  initGame();
});

// 初始化游戏 - Initialize the game
initGame();

// 阻止全局拖放的禁止符号
document.addEventListener('dragover', function(e) {
  e.preventDefault();
});
document.addEventListener('drop', function(e) {
  e.preventDefault();
}); 