const template = document.createElement("template");

template.innerHTML = `
    <link rel="stylesheet" href="components/sw-main/sw-game/sw-card/shadow.css">
    <link rel="stylesheet" href="components/sw-main/sw-game/sw-card/flashcard.css">
    <link rel="stylesheet" href="components/sw-main/sw-game/sw-card/fireworks.css">
    <header>
        <select onchange="this.getRootNode().host.level(event)">
            <option value="junior">Game Level: Junior</option>
            <option value="mid">Game Level: Mid</option>
            <option value="senior">Game Level: Senior</option>
        </select>
        <section>
            <h3>Game Levels</h3>
            <ol>
                <li><strong>Junior</strong> Level: You get <em><strong id="junior"></strong> seconds</em> per card.</li>
                <li><strong>Mid</strong> Level: You get <em><strong id="mid"></strong> seconds</em> per card.</li>
                <li><strong>Senior</strong> Level: You get <em><strong id="senior"></strong> seconds</em> per card.</li>
            </ol>
            <h3>Swipe Gestures</h3>
            <ol>
                <li><strong>Tap</strong> on the flashcard to <em>flip</em> it over.</li>
                <li><strong>Swipe Left</strong> on the flashcard to go to the <em>next</em> card.</li>
                <li><strong>Swipe Right</strong> on the flashcard to go to the <em>previous</em> card.</li>
                <li><strong>Swipe Up</strong> on the flashcard for <em>True</em>.</li>
                <li><strong>Swipe Down</strong> on the flashcard for <em>False</em>.</li>
            </ol>
            <h3>Voice Commands</h3>
            <ol>
                <li>Coming soon...</li>
            </ol>
        </section>
        <section>
            <button class="mode" onclick="this.getRootNode().host.renderMode('study')">Enter <strong>Study Mode</strong></button>
            <button class="mode" onclick="this.getRootNode().host.renderMode('play')">Enter <strong>Play Mode</strong></button>
        </section>
    </header>
    <main>
        <section>
            <figure>
                <img id="sound" onclick="this.getRootNode().host.volume(event)" src="images/sound.svg">
                <img id="silence" onclick="this.getRootNode().host.volume(event)" src="images/silence.svg">
                <img id="mic" onclick="this.getRootNode().host.speak(event)" src="images/mic.svg">
                <img id="mute" onclick="this.getRootNode().host.speak(event)" src="images/mute.svg">
            </figure>
            <h1 id="timer"></h1>
            <aside>
                <button id="previous" onclick="this.getRootNode().host.previous(event)"><strong>Previous</strong> Card</button>
                <button id="flip" onclick="this.getRootNode().host.flip(event)">Flip</button>
                <button id="next" onclick="this.getRootNode().host.next(event)"><strong>Next</strong> Card</button>
                <button id="quit" onclick="this.getRootNode().host.exit(event)">Quit</button>
            </aside>
        </section>
        <section id="card">
            <div class="card front">
                <h2 id="current"></h2>
                <p id="front"></p>
                <h6 id="code"></h6>
            </div>
            <div class="card back">
                <p id="back"></p>
            </div>
        </section>
        <section>
            <aside id="study">
                <button onclick="this.getRootNode().host.shuffle(event)"><strong>Shuffle</strong> Cards</button>
                <button onclick="this.getRootNode().host.exit(event)">Exit</button>
                <br><br>
                <small>( <strong class="total"></strong> Total )</small>
            </aside>
            <aside id="play">
                <button id="true" onclick="this.getRootNode().host.submit(event)">True</button>
                <button id="false" onclick="this.getRootNode().host.submit(event)">False</button>
                <br><br>
                <small id="scoreboard">
                    <strong class="correct"></strong>
                    <strong class="wrong"></strong>
                </small>
                <small>( <strong class="total"></strong> Total )</small>
            </aside>
        </section>
    </main>
    <footer>
        <section>
            <h2 id="level">Level Mid</h2>
            <h1>Reward Summary</h1>
        </section>
        <ul>
            <li class="corrects">Correct: <span id="correct"></span></li>
            <li class="wrongs">Wrong: <span id="wrong"></span></li>
            <li class="lefts">Left: <span id="left"></span></li>
            <hr>
            <li class="score"><b id="high">High Score</b> <span id="score"></span></li>
            <li class="Highest">Highest <span id="highest"></span></li>
        </ul>
        <section>
            <button id="restart" onclick="this.getRootNode().host.restart(event)"><strong>Reset</strong> Game</button>
            <button id="collect"><strong>Collect</strong> Coins</button>
        </section>
    </footer>
    <nav id="fireworks"></nav>
`;

export default template;