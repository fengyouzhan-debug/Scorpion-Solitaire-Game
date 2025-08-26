A web-based implementation of the classic Scorpion Solitaire card game. Built with pure HTML, JavaScript, and Tailwind CSS for styling. This game simulates the traditional scorpion solitaire rules with interactive features like drag-and-drop card movement, undo moves, scoring, a timer, and a stock pile for drawing extra cards.
Game Overview
Scorpion Solitaire is a challenging variant of solitaire similar to Spider Solitaire but with unique twists. The goal is to build four complete sequences (one for each suit) from King down to Ace in the foundation piles. Unlike some solitaires, sequences are built in descending order and must be of the same suit.
Key elements:

Tableau Piles: 7 piles where the main gameplay happens. Cards can be moved between piles if they form descending sequences of the same suit.
Stock Pile: Contains 3 reserve cards that can be drawn and distributed to the first 3 tableau piles when needed.
Foundation Piles: 4 piles where complete sequences (K to A, same suit) are automatically moved for scoring.
Winning Condition: Move all 52 cards into the foundation piles as complete sequences.

Features

Interactive Controls: Drag-and-drop cards between tableau piles; click to flip face-down cards or draw from stock.
Undo Functionality: Revert your last move with the "Undo" button.
Scoring System: Earn points for valid moves (+10), moving to foundation (+100), and completing sequences (+1000). Deduct points for hints (-20).
Timer and Moves Counter: Tracks time and moves for performance stats.
Win Modal: Displays final stats (time, moves, score) upon victory.
Responsive Design: Uses Tailwind CSS for a clean, modern UI with card shadows, animations, and hover effects.
Hint System: (Commented out in code but implementable) Suggests possible moves with visual highlights.
History Tracking: Stores up to 20 previous game states for undo.

Game Rules

Setup:

A standard 52-card deck is shuffled.
7 tableau piles: Each gets 7 cards. In the first 4 piles, the top 3 cards are face-up, and the bottom 4 are face-down. In the last 3 piles, all 7 are face-up? Wait, code specifies: For piles 0-3, first 4 face-down, rest face-up; but total 49 cards in tableau (7x7), remaining 3 in stock (face-down).
Stock: 3 face-down cards.
Foundations: Empty at start.


Moving Cards:

Move sequences of cards (descending, same suit) between tableau piles.
Only Kings (or sequences starting with King) can be placed on empty tableau piles.
Flip face-down cards when they become the top of a pile.
Draw from stock to add 1 card each to the first 3 tableau piles (up to 3 cards total).


Building Foundations:

Automatically detect and move complete sequences (K to A, same suit) from tableau to foundations.
Aces can start new foundation piles; other cards build ascending on same-suit foundations.


Winning:

All cards in foundations as 4 complete suits (K-A).
No reshuffling stock; game can become unwinnable.



Installation and Setup
This is a static web app—no server required. Just open the HTML file in a browser.

Prerequisites:

A modern web browser (Chrome, Firefox, etc.).
Tailwind CSS is configured via JavaScript (no build step needed, as it's inline).


Clone the Repository:
textgit clone https://gitlab.com/fengyouzhan-group/scorpion-solitaire.git

Run the Game:

Open scorpion-solitaire-v1.html in your browser.
The game initializes automatically.


Development:

Edit game.js for logic changes.
Edit style.js for Tailwind config and custom utilities.
No dependencies; pure vanilla JS.



File Structure

License
This project is open-source under the MIT License. Feel free to use, modify, and distribute.

scorpion-solitaire-v1.html: Main HTML structure with game board, modals, and UI elements.
game.js: Core game logic, including deck creation, shuffling, rendering, move validation, and event handlers.
style.js: Tailwind CSS configuration and custom utility classes for shadows, animations, and pulses.
