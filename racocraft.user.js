// ==UserScript==
// @name         Racó Minecraft Ore Generator
// @description  halo
// @version      1
// @match        https://raco.fib.upc.edu/home/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

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

    function generateWorld() {
        const monthTitle = document.querySelector('.calendariNomMes')?.innerText;
        if (!monthTitle) return;

        const rng = getSeededRandom(monthTitle);
        const stoneBlocks = document.querySelectorAll('.calendari td:not(.calendariDies, .calendariNomMes, .calendariDiaSetmana, .avui, .festa, .coses)');

        stoneBlocks.forEach(cell => {
            if (!cell.classList.contains('rareGold', 'rareIron', 'rareCoal')) {
                const roll = rng();
                if (roll < 0.02) {
                    cell.classList.add('rareGold');
                } else if (roll < 0.07) {
                    cell.classList.add('rareIron');
                } else if (roll < 0.14) {
                    cell.classList.add('rareCoal');
                }
            }
        });
        console.log("Mined " + stoneBlocks.length + " stone blocks!");
    }

    function addSplashText() {
        if (document.getElementById('raco-splash-text')) return;

        const splashTexts = [
            "Should have never happened",
            "Also try MommyASMR!",
            "El RacóCraft!",
            "Made by liceb_niek!",
            "Puta fib",
            "67🥀🥀🥀",
            "peak18f45k22",
            "😭😭😭😭😭😭",
            "eeee eee eeeeeeeeee - Sans",
            "Què succeeix?",
            "Drop table 'life'",
            "Also try studying!",
            "Skibidi FIBer!", // a partir daqui son totes d'un chat amb el gemini, quina bendició de missatges
            "What the sigma is PRO2?",
            "Rizzing up the Atenea server",
            "Mewing during the SO control",
            "Fanum tax on your ECTS!",
            "Based and Segfault-pilled!",
            "Looksmaxxing at the FIB bar!",
            "Debugging in Ohio!",
            "My GPA is cooked fr fr"
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

        // Add the text to the page
        logoLink.appendChild(splashSpan);

        console.log(selectedText);
    }

    function showGifPopup() {
        const gifPool = [
            "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2UyN3R3b2lvdzNlb2RucWg4NWw0NXBlcmRmdXltaWkxOXRtMWg4NiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tZmrqsqclG6ORPxC2l/giphy.gif",
            "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHppaWFqYnp6cGdzaGh2YmRxaW9rdnUwbDM3Z2FqYmkyNWcydmhlbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/lxxOGaDRk4f7R5TkBd/giphy.gif",
            "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExa2JrdnhpdWhpemtnYm5yd2M4eHlkNHNlaWF6MTNqMW1ueTNlOG50eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/vPzbDN4rBxuvtpSpzF/giphy.gif",
            "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbnZwaTgxZjE0NTFrMnZ2bHR3cXF3Y2IyZzVtcmx5bjQ5M3FzcTVndyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DEbcjhoX1zBTiXmr3M/giphy.gif",
            "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdTUwZHQ5anAzNnRmb2trZDc2MXo1bmpwMG1zajIycnJ0cWF3M3l5ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/IfPE0x5gfa5ctKpph6/giphy.gif",
            "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExZndjOTVtYnZlNDY2bG9vbHl6NjQzajI5bWhoamNrNG5zbHR3bWFvdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/D63HGAzG15LQrjBPRE/giphy.gif",
            "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnpyY290eHJsYmprbTR0N2tuNHhrdG5hd2U3dmdrcTdzZ2V0OWdtMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/s5wFafpHxqKbIEERl9/giphy.gif",
            "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExM25oMG5wdjJua3VvcHB4ODF5aDFtNTdqZWg1NmliaGM4dHVzMTZ1eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wKJSRY2OgYx2m6R4oA/giphy.gif",
            "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExazI4M2ZnbnAzNmc3NGppeTY2NDdoZ2dnbmtvb3dueXBlYW0ybnJkMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fYShjUkJAXW1YO6cNA/giphy.gif",
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODM1cDduMHRtd3R5dGltbThybTFjODExbnNhZW55NGpsZnZ3YmYwNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/0mnJ2b9aURW87xcFwG/giphy.gif",
            "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODM1cDduMHRtd3R5dGltbThybTFjODExbnNhZW55NGpsZnZ3YmYwNyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/gvnBUe6e3ZRxC/giphy.gif",
            "https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dzhiZGM1dWUyNzQzbGltYnIwZzN0bmljdDBleXBzODV5cml6eDAyMyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/soBMAXm3umWxErwzxx/giphy.gif"
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
