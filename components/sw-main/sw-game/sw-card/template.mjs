const template = document.createElement("template");

template.innerHTML = `
    <link rel="stylesheet" href="components/sw-main/sw-game/sw-card/shadow.css">
    <header>
        <label>Game Level</label>
        <select onchange="this.getRootNode().host.level(event)">
            <option id="junior" value="junior">Junior</option>
            <option id="mid" value="mid">Mid</option>
            <option id="senior" value="senior">Senior</option>
        </select>
        <button class="mode" onclick="this.getRootNode().host.renderMode('study')">Enter Study Mode</button>
        <button class="mode" onclick="this.getRootNode().host.renderMode('play')">Enter Play Mode</button>
        <p>swipe instructions</p>
    </header>
    <main>
        <section>
            <h1 id="timer"></h1>
            <aside>
                <button id="previous" onclick="this.getRootNode().host.previous(event)">Previous Card</button>
                <button id="flip" onclick="this.getRootNode().host.flip(event)">Flip</button>
                <button id="next" onclick="this.getRootNode().host.next(event)">Next Card</button>
                <button id="quit" onclick="this.getRootNode().host.exit(event)">Quit</button>
                <button id="finish" onclick="this.getRootNode().host.finish()">Finish</button>
            </aside>
        </section>
        <section id="card">
            <div class="card front">
                <h2 id="current"></h2>
                <p id="front"></p>
                <h2 id="current2"></h2>
            </div>
            <div class="card back">
                <p id="back"></p>
            </div>
        </section>
        <section>
            <aside id="study">
                <button onclick="this.getRootNode().host.shuffle(event)">Shuffle Cards</button>
                <button onclick="this.getRootNode().host.exit(event)">Exit</button>
            </aside>
            <aside id="play">
                <button id="true" onclick="this.getRootNode().host.submit(event)">True</button>
                <button id="false" onclick="this.getRootNode().host.submit(event)">False</button>
            </aside>
            <small id="total"></small>
        </section>
    </main>
    <footer>
        <section>
            <h4>Reward Summary</h4>
            <h5 id="level">Level Mid</h5>
        </section>
        <ul>
            <li class="correct">Correct: <span id="correct"></span></li>
            <li class="wrong">Wrong: <span id="wrong"></span></li>
            <hr>
            <li class="score"><b id="high">High Score</b> <span id="score"></span></li>
            <li class="Highest">Highest <span id="highest"></span></li>
        </ul>
        <section>
            <button id="restart" onclick="this.getRootNode().host.restart(event)">Reset Game</button>
            <button id="collect">Collect Coins</button>
        </section>
    </footer>
`;

export default template;