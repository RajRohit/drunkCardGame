const readline = require('readline');
Array.min = function( array ){
    return Math.min.apply( Math, array );
};

/** How to run ?
 * 1. Cd to cloned folder
 * 2. run command node ./index.js 
 * 3. You will see once complete run of game
 */

/** How it works?
 * 1. This game starts with 52 Cards
 * 2. Distributes 3 card between 4 players and remove them from deck
 * 3. Select winner based on Trail, Sequence, Pair, Top Card
 * 4. If tie happens anywhere, it moves to next victory method
 * 5. Game continues till card distribution is not possible
 */

 /** NOTES
  * 1. "playerState" is each players card deck
  * 2. "cardDeck" is regular deck of 52 cards
  * 3.  If you want to use  custom "playerState" then please 
  *     set "allowPlayerStateInitilisation" to false, 
  *     and make sure playerState is manually populated 
  */


var playerState = {
  1:[],
  2:[],
  3:[],
  4:[]
}
let cardDeck = {
  'a': 4,
  'k': 4,
  'q': 4,
  'j': 4,
  '10': 4,
  '9': 4,
  '8': 4,
  '7': 4,
  '6': 4,
  '5': 4,
  '4': 4,
  '3': 4,
  '2': 4
}

/** Set allowPlayerStateInitilisation to false for testing  */
var allowPlayerStateInitilisation = true; // Only for testing purpose

/** Start Game */
distributeCard(allowPlayerStateInitilisation);

/** *****Core Methods Below***** */

/** Initilise card deck  */
function resetCardDeck(){
  Object.keys(cardDeck).map((item)=>{
    cardDeck[item] = 4;
  });
}

/** Distribute cards to player */
function distributeCard(assignState){
  console.log('Cards in Deck: ',totalCardInDeck());

  //Assign Cards to players
  Object.keys(playerState).map((player)=>{
    if(assignState) assignCard(player,3);
  });

  //Display Deck Details
  displayPlayerState();

  //Find Winner
  checkTrailWinner();
}

/** Display Player State */
function displayPlayerState(){
  console.log('');
  Object.keys(playerState).map((player)=>{
    let cards = [];
    playerState[player].map((card)=>{
      switch(card){
        case 14: cards.push('A');break;
        case 13: cards.push('K');break;
        case 12: cards.push('Q');break;
        case 11: cards.push('J');break;
        default: cards.push(''+card);break;
      }
    });
    console.log('Player: ',player,'| Cards: ',cards);
  });
  console.log('');
}

/** Assign card to player */
function assignCard(user,number){
  playerState[user] = getCardFromStack(number);
}

/** Get Cards from deck and update deck */
function getCardFromStack(number){
  let selectedCard = [];
  if(totalCardInDeck() < number) return selectedCard;

  for(let i=0; i < number; ++i){
    let card = Math.floor((Math.random() * 13)+2);
    if(checkCardExist(card)){
      switch(card){
        case 14: deleteCard('a');break;
        case 13: deleteCard('k');break;
        case 12: deleteCard('q');break;
        case 11: deleteCard('j');break;
        default: deleteCard(''+card);break;
      }
      selectedCard.push(card);
    }
    // else if(number){
    //   ++number;
    // }
    else {
      /** If can not assign radomly in 10 try, use brute force */
      let cardList = Object.keys(cardDeck);
      for(let i = 0; i < cardList.length; ++i){
        if(cardDeck[cardList[i]] > 0){
          deleteCard(cardList[i]);
          switch(cardList[i]){
            case 'a': card=14;break;
            case 'k': card=13;break;
            case 'q': card=12;break;
            case 'j': card=11;break;
            default: card=Number(cardList[i]);break;
          }
          selectedCard.push(card);
          break;
        }
      }
    }
  }
  //console.log('selected card',selectedCard," ",totalCardInDeck())
  return selectedCard;
}

/** Delete card from deck */
function deleteCard(card){
  cardDeck[card] -= 1;
}

/** Find if random card exist in deck */
function checkCardExist(card){
  let state = false;

  switch(card){
    case 14: cardDeck['a'] > 0 ? state=true:state=false; break;
    case 13: cardDeck['k'] > 0 ? state=true:state=false; break;
    case 12: cardDeck['q'] > 0 ? state=true:state=false; break;
    case 11: cardDeck['j'] > 0 ? state=true:state=false; break;
    default: cardDeck[''+card] > 0 ? state=true:state=false; break;
  }

  return state;
}

/** Total number of card in deck */
function totalCardInDeck(){
  let totalCardCount = 0;
  Object.keys(cardDeck).map((item)=>{
    totalCardCount += cardDeck[item];
  });
  return totalCardCount;
}

/** ****** Winner check methods ***** **/

/** A trail is the highest possible combination */
function checkTrailWinner(){
  let winners = [];

  // Check for trail 
  Object.keys(playerState).map((player)=>{
    if(playerState[player].every( (val, i, arr) => val === arr[0] )){
      winners.push(player);
    }
  });

  if(winners.length == 1) printWinner(winners[0],'Trail');
  else {
    console.log('Trail: ',(winners.length==0?'Failed':'Tie'));
    checkSequenceWinner();
  }
}

/** The next highest is a sequence */
function checkSequenceWinner(){
  let winners = [];

  Object.keys(playerState).map((player)=>{
    let first = Array.min(playerState[player]);
    let second = playerState[player].find(element=>element == first+1);
    let third = playerState[player].find(element=>element == second+1);
    if(first && second && third) winners.push(player);
  });

  if(winners.length == 1) printWinner(winners[0],'Sequence');
  else {
    console.log('Sequence: ',(winners.length==0?'Failed':'Tie'));
    checkPairWinner();
  }
}

/** The next highest is a pair of cards */
function checkPairWinner(){
  let winners = [];

  Object.keys(playerState).map((player)=>{
    if(playerState[player][0] == playerState[player][1] || playerState[player][0] == playerState[player][2] || playerState[player][1] == playerState[player][2]){
      winners.push(player);
    }
  });

  if(winners.length == 1) printWinner(winners[0],'Pair');
  else {
    console.log('Pair: ',(winners.length==0?'Failed':'Tie'));
    topCardWinner();
  }
}

/** If all else fails, the top card  */
function topCardWinner(){
  let winners = [], biggestCard = 1;

  // Find Biggest Card 
  Object.keys(playerState).map((player)=>{
    playerState[player].map((item)=>{
      if(item > biggestCard) biggestCard = item;
    });
  });

  // Find Top Card Winner
  Object.keys(playerState).map((player)=>{
    playerState[player].map((item)=>{
      if(item == biggestCard) {
        if ( winners.indexOf(player) == -1  ) {
          winners.push(player);
        }
      }
    });
  });

  if(winners.length == 1) printWinner(winners[0],'Top Card');
  else {
    console.log('Top Card: ',(winners.length==0?'Failed':'Tie'));
    findTieWinner(winners);
  }
}

/** If the top card has the same value, each of the tied players draws a single card from the deck until a winner is found */
function findTieWinner(winners){
  //console.log('Tie occured, fetch one card to tied players.');
  if(totalCardInDeck() < winners.length) {
    console.log('Cards in Deck: '+totalCardInDeck()+'\nNo enough cards to distribute.');
    return 0;
  }

  let winnersList = [],biggestCard = 1 ;

  // Fetch new card for tie players 
  winners.map((item)=>{
    assignCard(item,1);
  });

  // Find Biggest Card
  winners.map((item)=>{
    if(playerState[item][0] > biggestCard) biggestCard = playerState[item][0];
  });

  // Find players with biggest card
  winners.map((item)=>{
    if(playerState[item][0] == biggestCard){
      if ( winnersList.indexOf(item) == -1  ) {
        winnersList.push(item);
      }
    }
  });

  displayPlayerState();

  if(winnersList.length == 1) printWinner(winnersList[0],'Top Card');
  else findTieWinner(winnersList);
}

/** Print the final winner */
function printWinner(player,winType){
  console.log('\nRESULT: Player ',player,' Wins by ',winType);
  console.log('--------- *** ---------');
  if(totalCardInDeck()>=12) distributeCard(allowPlayerStateInitilisation);
  else {
      console.log('Cards in Deck: '+totalCardInDeck()+'\nGame Over: No more cards to distribute.');
      //askToRestart();
    }
}

/** Ask to restart */
function askToRestart(){
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      rl.question('Do you want to restart? y/n ', (answer) => {
          if(answer == 'y'){
            resetCardDeck();
            distributeCard(allowPlayerStateInitilisation);
          }
        rl.close();
      });
}
