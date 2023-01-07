const template = document.createElement("template");

template.innerHTML = `
    <link rel="stylesheet" href="components/sw-main/sw-game/sw-card/shadow.css">
    <header>
        <label>Game Level</label>
        <select>
            <option>Junior</option>
            <option>Mid</option>
            <option>Senior</option>
        </select>
        <button>Enter Study Mode</button>
        <button>Enter Play Mode</button>
        <p>swipe instructions</p>
    </header>
    <main>
        <section>
            <h4>Card <span id="current"></span> of <span id="total"></span></h4>
            <h5>00 : 00</h5>
            <aside>
                <button id="previous" onclick="this.getRootNode().host.previous(event)">Previous Card</button>
                <button id="next" onclick="this.getRootNode().host.next(event)">Next Card</button>
            </aside>
        </section>
        <section>
            <div id="front">front</div>
            <div id="back">back</div>
        </section>
        <section>
            <aside>
                <button id="true" onclick="this.getRootNode().host.submit(event)">True</button>
                <button id="false" onclick="this.getRootNode().host.submit(event)">False</button>
                <button id="quit" onclick="this.getRootNode().host.finish(event)">Quit</button>
            </aside>
            <aside>
                <button>Shuffle Cards</button>
                <button id="exit" onclick="this.getRootNode().host.finish(event)">Exit</button>
            </aside>
        </section>
    </main>
    <footer>
        <section>
            <h4>Reward Summary</h4>
            <h5>Level Mid</h5>
            <h5>Time Left/New High 00:00</h5>
            <h5>Highest 00:00</h5>
        </section>
        <ul>
            <li class="corrects">Correct: <span id="correct"></span></li>
            <li class="wrongs">Wrong: <span id="wrong"></span></li>
            <hr>
            <li class="score"><b id="high">High Score</b> <span id="score">0%</span></li>
            <li class="Highest">Highest <span id="highest">0%</span></li>
        </ul>
        <section>
            <button id="restart" onclick="this.getRootNode().host.restart(event)">Replay Game</button>
            <button id="collect">Collect Coins</button>
        </section>
    </footer>
`;

export default template;