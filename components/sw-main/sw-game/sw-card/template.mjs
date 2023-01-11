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
        <button onclick="this.getRootNode().host.renderMode('study')">Enter Study Mode</button>
        <button onclick="this.getRootNode().host.renderMode('play')">Enter Play Mode</button>
        <p>swipe instructions</p>
    </header>
    <main>
        <section>
            <h4>Card <span id="current"></span> of <span id="total"></span></h4>
            <h5 id="timer"></h5>
            <aside>
                <button id="previous" onclick="this.getRootNode().host.previous(event)">Previous Card</button>
                <button id="next" onclick="this.getRootNode().host.next(event)">Next Card</button>
            </aside>
        </section>
        <section>
            <div id="front"></div>
            <div id="back"></div>
        </section>
        <section>
            <aside id="study">
                <button onclick="this.getRootNode().host.shuffle(event)">Shuffle Cards</button>
                <button onclick="this.getRootNode().host.exit(event)">Exit</button>
            </aside>
            <aside id="play">
                <button id="true" onclick="this.getRootNode().host.submit(event)">True</button>
                <button id="false" onclick="this.getRootNode().host.submit(event)">False</button>
                <button onclick="this.getRootNode().host.exit(event)">Quit</button>
            </aside>
        </section>
    </main>
    <footer>
        <section>
            <h4>Reward Summary</h4>
            <h5 id="level">Level Mid</h5>
        </section>
        <ul>
            <li class="corrects">Correct: <span id="correct"></span></li>
            <li class="wrongs">Wrong: <span id="wrong"></span></li>
            <hr>
            <li class="score"><b id="high">High Score</b> <span id="score">0%</span></li>
            <li class="Highest">Highest <span id="highest">0%</span></li>
        </ul>
        <section>
            <button id="restart" onclick="this.getRootNode().host.restart(event)">Restart Game</button>
            <button id="collect">Collect Coins</button>
        </section>
    </footer>
`;

export default template;