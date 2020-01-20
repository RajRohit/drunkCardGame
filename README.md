# Drunk Card Game

Problem Statement: 
The festival season is here and you realise it's hard to play all those complicated card games when you're drunk. 
You decide to create a simple luck-based game for people to play when they have limited motor and sensory control.  

Basic Rules: 
- Use a standard deck of cards (no Joker). 
- Each player is dealt only three cards. 
- 'A' is considered to have a number value of 1. 
- 'A' is considered the top card in a face-off. 
So the order is A > K > Q > J > 10...2  

Victory: 
- A trail (three cards of the same number) is the highest possible combination. 
- The next highest is a sequence (numbers in order, e.g., 4,5,6. A is considered to have a value of 1). 
- The next highest is a pair of cards (e.g.: two Kings or two 10s). 
- If all else fails, the top card (by number value wins). 
- If the top card has the same value, each of the tied players draws a single card from the deck until a winner is found. 
- Only the newly drawn cards are compared to decide a tie. The top card wins a tie. 
- For now the suit (spades/hearts etc...), does not matter.  

TODO: 
1. Simulate a game between 4 players. 
2. Randomly deal them cards from a deck. 
3. Determine the winner. 

# How to use
1. Clone the project
2. cd drunkCardGame
3. node ./index.js

# Expected Result
-  A full game run till there are no cards left in deck to distribute.
