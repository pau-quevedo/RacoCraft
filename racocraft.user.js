// ==UserScript==
// @name         RacóCraft
// @description  helo
// @version      1.67
// @match        https://raco.fib.upc.edu/*
// @grant        none
// ==/UserScript==

// Pickaxe cursor
(function() {
    'use strict';

    // 1. Create the custom cursor element
    const customCursor = document.createElement('div');
    customCursor.id = 'mc-custom-cursor';
    document.body.appendChild(customCursor);

    const offsetX = -2;
    const offsetY = -10;

    // 2. Track mouse movement across the viewport
    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = (e.clientX + offsetX) + 'px';
        customCursor.style.top = (e.clientY + offsetY) + 'px';
    });

    // 3. Switch between normal and enchanted textures on hover
    const clickableSelector = 'a, a *, button, input[type="submit"], input[type="button"], [role="button"], .calendari td:has(a:link)';

    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(clickableSelector)) {
            customCursor.classList.add('enchanted');
        }
    });

    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(clickableSelector)) {
            customCursor.classList.remove('enchanted');
        }
    });

    // Trigger the swing animation on click
    document.addEventListener('mousedown', () => {
        // Reset animation if clicking rapidly
        customCursor.classList.remove('mining');
        void customCursor.offsetWidth; // Force DOM reflow
        customCursor.classList.add('mining');
    });

    // Remove the class once the swing animation completes
    customCursor.addEventListener('animationend', () => {
        customCursor.classList.remove('mining');
    });
})();

(function() {
    'use strict';

    let primerMes = true;

    // 1. Create a "World Seed" that changes ONLY on F5/Page Load
    // We store it in sessionStorage so it persists during AJAX navigation
    let sessionSeed = sessionStorage.getItem('raco_mc_seed');
    if (!sessionSeed) {
        sessionSeed = Math.floor(Math.random() * 1000000);
        sessionStorage.setItem('raco_mc_seed', sessionSeed);
    }

    function getSeededRandom(monthText) {
        // Combine the Month Name with our Session Seed
        let combinedSeed = monthText + sessionSeed;
        let hash = 0;
        for (let i = 0; i < combinedSeed.length; i++) {
            hash = ((hash << 5) - hash) + combinedSeed.charCodeAt(i);
            hash |= 0;
        }
        return function() {
            let t = hash += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    function randomOres() {
        const monthTitle = document.querySelector('.calendariNomMes')?.innerText;
        if (!monthTitle) return;

        const rng = getSeededRandom(monthTitle);
        const stoneBlocks = document.querySelectorAll('.calendari td:not(.calendariDies, .calendariNomMes, .calendariDiaSetmana, .avui, .festa, .coses)');

        stoneBlocks.forEach(cell => {
            if (!cell.classList.contains('rareCopper', 'rareIron', 'rareCoal')) {
                const roll = rng();
                if (roll < 0.02) {
                    cell.classList.add('rareCopper');
                } else if (roll < 0.07) {
                    cell.classList.add('rareIron');
                } else if (roll < 0.14) {
                    cell.classList.add('rareCoal');
                }
            }
        });
        //console.log("Mined " + stoneBlocks.length + " stone blocks!");
    }

    // aux func for festiveDays func
    function emeraldDays(eventId) {
        const calendarCells = document.querySelectorAll(`.calendari a[href="#${eventId}"]`);
        calendarCells.forEach(anchor => {
            const calendarCell = anchor.closest("td");

            if (calendarCell) {
                calendarCell.classList.add("esFestiu");
            }
        });
    }

    function festiveDays() {
        const eventItems = document.querySelectorAll('.events ul li.futur, .events ul li.passat');
        eventItems.forEach(item => {
            const monthTitle = document.querySelector('.calendariNomMes')?.innerText;
            const nameAnchor = item.querySelector('a[name]');
            const linkWithText = item.querySelectorAll('a')[1];

            if (nameAnchor && linkWithText) {
                const eventId = nameAnchor.getAttribute('name');
                const text = linkWithText.textContent.toUpperCase();

                if (text.includes('VACANCES') || text.includes('FESTIU')) {
                    const dies = item.querySelectorAll('a')[0];
                    const textDies = dies.textContent.trim();

                    const [start, end = start] = textDies.trim().split('-');

                    const startDay = parseInt(start.split("/")[0], 10);
                    const endDay = parseInt(end.split("/")[0], 10);

                    //console.log(textDies + ": " + startDay + "  end:" + endDay);

                    emeraldDays(startDay);
                    if (startDay != endDay) emeraldDays(endDay);
                }

                else if (text.includes('HORARI DE')) {
                    const calendarCell = document.querySelector(`.calendari a[href="#${eventId-1}"]`)?.closest("td");
                    if (calendarCell) {
                        calendarCell.classList.add("canviHorari");
                    }
                }
                else if (text.includes('FESTA FIB')) {
                    const calendarCell = document.querySelector(`.calendari a[href="#${eventId-1}"]`)?.closest("td");
                    if (calendarCell) {
                        calendarCell.classList.add("esFestaFib");
                    }
                }
            }
        });
    }

    function generateWorld() {
        randomOres();
        festiveDays();
    }

    function addSplashText() {
        if (document.getElementById('raco-splash-text')) return;

        const splashTexts = [
            "Should have always happened",
            "Also try MommyASMR!",
            "El RacóCraft!",
            "Made by liceb_niek!",
            "67🥀🥀🥀",
            "peak18f45k22",
            "🗿",
            "eeee eee eeeeeeeeee - Sans",
            "Què succeeix?",

            "Drop table 'life'",
            "Also try studying!",
            "Skibidi FIBer!",
            "What the sigma es PRO2?",
            "Rizzing up the Atenea server",
            "Fanum tax on your ECTS!",
            "Mewing al bar de la FIB",
            "My GPA is cooked fr fr",

            "BOMBOCLAAAT"
        ];

        // Pick a random text
        const randomIndex = Math.floor(Math.random() * splashTexts.length);
        const selectedText = splashTexts[randomIndex];

        // Find the logo image and its parent link
        const logoImg = document.getElementById('logoraco');
        if (!logoImg) return;
        const logoLink = logoImg.parentElement;

        // Create the span element for the text
        const splashSpan = document.createElement('span');
        splashSpan.id = 'raco-splash-text';
        splashSpan.innerText = selectedText;

        // Make sure the link can hold absolute positioned items
        logoLink.style.position = 'relative';
        logoLink.style.display = 'inline-block';
        logoLink.style.fontSize = 0;

        // Add the text to the page
        logoLink.appendChild(splashSpan);

        //console.log(selectedText);
    }

    function showGifPopup() {
        const gifPool = [
            // cat explodes
            "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2UyN3R3b2lvdzNlb2RucWg4NWw0NXBlcmRmdXltaWkxOXRtMWg4NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tZmrqsqclG6ORPxC2l/giphy.gif",
            // speed in ballon d'or
            "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHppaWFqYnp6cGdzaGh2YmRxaW9rdnUwbDM3Z2FqYmkyNWcydmhlbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lxxOGaDRk4f7R5TkBd/giphy.gif",
            // wazaaaa cat
            "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2JrdnhpdWhpemtnYm5yd2M4eHlkNHNlaWF6MTNqMW1ueTNlOG50eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vPzbDN4rBxuvtpSpzF/giphy.gif",
            // 😼
            "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnZwaTgxZjE0NTFrMnZ2bHR3cXF3Y2IyZzVtcmx5bjQ5M3FzcTVndyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DEbcjhoX1zBTiXmr3M/giphy.gif",
            // dolphin laugh man wazaaaaa
            "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTUwZHQ5anAzNnRmb2trZDc2MXo1bmpwMG1zajIycnJ0cWF3M3l5ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/IfPE0x5gfa5ctKpph6/giphy.gif",
            // speed
            "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZndjOTVtYnZlNDY2bG9vbHl6NjQzajI5bWhoamNrNG5zbHR3bWFvdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/D63HGAzG15LQrjBPRE/giphy.gif",
            // speed's mom is kinda homeless
            "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnpyY290eHJsYmprbTR0N2tuNHhrdG5hd2U3dmdrcTdzZ2V0OWdtMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/s5wFafpHxqKbIEERl9/giphy.gif",
            // silver sonic wants to eat my ass
            "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExM25oMG5wdjJua3VvcHB4ODF5aDFtNTdqZWg1NmliaGM4dHVzMTZ1eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wKJSRY2OgYx2m6R4oA/giphy.gif",
            // subway surfers gameplay
            "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExazI4M2ZnbnAzNmc3NGppeTY2NDdoZ2dnbmtvb3dueXBlYW0ybnJkMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fYShjUkJAXW1YO6cNA/giphy.gif",
            // joe (family guy) dies
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODM1cDduMHRtd3R5dGltbThybTFjODExbnNhZW55NGpsZnZ3YmYwNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/0mnJ2b9aURW87xcFwG/giphy.gif",
            // peter and dolphin love
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODM1cDduMHRtd3R5dGltbThybTFjODExbnNhZW55NGpsZnZ3YmYwNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/gvnBUe6e3ZRxC/giphy.gif",
            // cat explodes pt 2
            "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dzhiZGM1dWUyNzQzbGltYnIwZzN0bmljdDBleXBzODV5cml6eDAyMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/soBMAXm3umWxErwzxx/giphy.gif",
            // cat throne
            "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExemJ3M2RiYWFkdm5yMW4xbmw0Ymw3dzhjcTg2YmFpYW45azZvc21rbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bdIHP4CqxvdUe2MJH8/giphy.gif",
            // dont know but its speed
            "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcTEwdnRtNHFvdnNzejRlMnYwbDA4cjU5bnN5cnAwMmFxYncycGs2cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/SmOQs0jw2Psv30dGak/giphy.gif",
            // kai watching speed unbox messi
            "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmtmYXhlZzIwd2RtMzE4YzRnZHFlbzlxeThqbG1zZ2t2NG1scXRqcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ynVFeDsjKiyRRRJ1Jz/giphy.gif",
            // speed after seeing ksi forehead
            "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWo4d21manZmeTh1M3NhYTl3Z2Q2MnNvY3M3ejMyYjRnMXVlcTZrMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GCO5WNzFmlc0vjK8cA/giphy.gif",
            // speed crashout after 2-2
            "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmRsYnNnaDhjMnZka2E5eWZjbm45ZThxeGo2dzkwc2NmNGNyNnBpYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/N8mKAhJOUa3gPzHW68/giphy.gif",
            // flight fucked up
            "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmd5dTFiYzVzNGxsejY5dmM2YW1sc2Q4N21oYmhwMjQ5cTMzYW5hNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/yasK38fdvOi6IR1gbn/giphy.gif",
            // something something flight something something
            "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWV2MTkyNDNrb21ndGhwdXRzNWJ4aXBxZGV0d2kzN2VzODF6NHp4MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/IcL0dEz31YiDXR1tqp/giphy.gif"
        ];

        // Pick a random text
        const randomIndex = Math.floor(Math.random() * gifPool.length);
        const selectedGif = gifPool[randomIndex];
        // 1. Create the overlay background (The dark dimming effect)
        const overlay = document.createElement('div');
        overlay.id = 'minecraft-popup-overlay';

        // Style it to cover the ENTIRE screen
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)'; // Dark Minecraft dirt background style
        overlay.style.zIndex = '99999'; // On top of EVERYTHING
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.backdropFilter = 'blur(4px)'; // Optional: blurs the page behind it

        // 2. Create the GIF Container
        const gifContainer = document.createElement('img');
        // Replace this URL with any GIF you want!
        // Example: A creeper exploding, a "Connection Lost" screen, or a funny meme.
        //gifContainer.src = 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/3/3b/Grass_Block_(side_texture)_JE2_BE2.png';
        gifContainer.src = selectedGif;
        gifContainer.style.maxWidth = '500px';
        gifContainer.style.border = '4px solid white'; // Minecraft style border
        gifContainer.style.boxShadow = '10px 10px 0px black'; // Chunky shadow

        // 3. Create a "Back to Game" Button
        const closeBtn = document.createElement('button');
        closeBtn.innerText = 'Back to Game';

        // Style the button to look like a Minecraft button
        closeBtn.style.marginTop = '20px';
        closeBtn.style.padding = '10px 30px';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.fontFamily = "'Minecraft', sans-serif"; // Uses your custom font
        closeBtn.style.color = 'white';
        closeBtn.style.backgroundColor = '#727272'; // Stone button color
        closeBtn.style.border = '2px solid black';
        closeBtn.style.borderTop = '2px solid #dbdbdb'; // Lighting effect
        closeBtn.style.borderLeft = '2px solid #dbdbdb';
        closeBtn.style.cursor = 'pointer';

        // Hover effect for the button
        closeBtn.onmouseover = function() { this.style.backgroundColor = '#8b8b8b'; };
        closeBtn.onmouseout = function() { this.style.backgroundColor = '#727272'; };

        // 4. Close the popup when clicked
        closeBtn.onclick = function() {
            document.body.removeChild(overlay);
        };

        // 5. Assemble and Inject
        overlay.appendChild(gifContainer);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);
    }

    function addLanguageForPopup() {
        const idiomes = document.getElementById("idiomes");
        if (!idiomes) return;

        const li = document.createElement("li");
        const a = document.createElement("a");
        a.appendChild(document.createTextNode("Huh?"));
        li.appendChild(a);
        idiomes.appendChild(li);

        a.addEventListener('click', showGifPopup); // associate the function above with the click event

        idiomes.parentElement.setAttribute('style', 'width:' + 28 + 'em');
        //idiomes.style.transform = "translate(-200, 0)";
    }

    var addLanguage=true;
    var randomCalendar=true;
    var nameWindow=true;
    var splashText=true;


    if (addLanguage) {
        addLanguageForPopup();
    }

    if (randomCalendar) {
        generateWorld();
        const observer = new MutationObserver(() => {
            generateWorld();
        });
        const target = document.querySelector('.calendari');
        if (target) observer.observe(target, { childList: true, subtree: true });
    }

    if (nameWindow) {
        var title = document.querySelector('title');
        title.innerText = 'RacóCraft';
    }

    if (splashText) {
        addSplashText();
    }

})();
