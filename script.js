const main = document.querySelector('main');
const screenHeight = window.innerHeight;
const screenWidth = window.innerWidth;

// Checker la collision
let isCollide = function(a,b){
    return !(
        ((a.y + a.height) < b.y) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    )
}

// Générer un nombre aléatoire
let getRandomInt = function (max) {
    return Math.floor(Math.random() * max);
}

// sélection aléatoire d'un ennemi
let getRandomEnemy = (ennemiesList) => {
    let randomInt = getRandomInt(ennemiesList.length);
    // on va chercher l'élément de notre tableau qui se trouve à l'index indiqué par randomInt
    let enemyShooter = ennemiesList[randomInt];
    return enemyShooter;
}

// Dessiner les ennemis et stocker dans un tableau
let vanduuls = [];
// Centrage horizontal des ennemis
const nbEnnemis = 6;
const ennemiWidth = 100;
const espaceEntre = 50;
const totalWidth = nbEnnemis * ennemiWidth + (nbEnnemis - 1) * espaceEntre;
const startLeft = (screenWidth - totalWidth) / 2;
for(let i=0; i<nbEnnemis ; i++){
    let vanduul = document.createElement('img');
    vanduul.id = "vanduul" + i;
    vanduul.className = "ennemy";
    vanduul.src = "img/vanduul.png";
    vanduul.style.width = ennemiWidth + "px";
    vanduul.style.height = "75px";
    vanduul.style.position = "absolute";
    vanduul.style.left = (startLeft + i * (ennemiWidth + espaceEntre)) + "px";
    vanduul.style.top = "0px";
    main.appendChild(vanduul);
    vanduuls.push(vanduul);
}

// Variables pour l'animation et la vie
let ennemyLasers = [];
let playerLasers = [];
let lastEnnemyShoot = 0;
let playerLives = 3;

// Affichage des vies
const livesDisplay = document.createElement('div');
livesDisplay.style.position = 'absolute';
livesDisplay.style.top = '10px';
livesDisplay.style.left = '10px';
livesDisplay.style.color = 'white';
livesDisplay.style.fontSize = '2em';
livesDisplay.style.fontFamily = 'Arial, sans-serif';
livesDisplay.textContent = 'Vies : ' + playerLives;
main.appendChild(livesDisplay);

// Animation principale
function animate(time) {
    // Déplacement des ennemis
    vanduuls.forEach((vanduul) => {
        if (!vanduul.parentNode) return;
        let currentTop = parseInt(vanduul.style.top);
        let height = parseInt(vanduul.style.height);
        if(currentTop < screenHeight - height){
            vanduul.style.top = (currentTop + 1) + "px";
            // Collision ennemi <-> joueur
            if (player.parentNode && isCollide(vanduul, player)) {
                vanduul.src = "img/explosion.png";
                setTimeout(() => {
                    vanduul.remove();
                }, 500);
                // Effet de collision sur le joueur (perte de vie)
                if (playerLives === 3) {
                    player.src = "img/vanguard.png";
                } else if (playerLives === 2) {
                    player.src = "img/vanguarddmg1.png";
                } else if (playerLives === 1) {
                    player.src = "img/vanguarddmg2.png";
                }
                playerLives--;
                livesDisplay.textContent = 'Vies : ' + playerLives;
                setTimeout(() => {
                    player.remove();
                    if (playerLives > 0) {
                        if (playerLives === 2) {
                            player.src = "img/vanguarddmg1.png";
                        } else if (playerLives === 1) {
                            player.src = "img/vanguarddmg2.png";
                        } else {
                            player.src = "img/vanguard.png";
                        }
                        main.appendChild(player);
                    } else {
                        player.src = "img/explosion.png";
                        livesDisplay.textContent = 'GAME OVER';
                    }
                }, 500);
            }
        }else{
            vanduul.remove();
        }
    });

    // Tir ennemi toutes les 1500ms
    if (!lastEnnemyShoot || time - lastEnnemyShoot > 1500) {
        let aliveVanduuls = vanduuls.filter(v => v.parentNode);
        if (aliveVanduuls.length > 0) {
            let shooter = getRandomEnemy(aliveVanduuls);
            let shooterLeft = parseInt(shooter.style.left);
            let shooterTop = parseInt(shooter.style.top);
            let shooterWidth = parseInt(shooter.style.width);
            let shooterHeight = parseInt(shooter.style.height);
            let ennemyLaser = document.createElement('img');
            ennemyLaser.src = "img/red_laser.png";
            ennemyLaser.style.width = "5px";
            ennemyLaser.style.height = "25px";
            ennemyLaser.style.position = "absolute";
            ennemyLaser.style.left = shooterLeft + (shooterWidth / 2) + "px";
            ennemyLaser.style.top = shooterTop + shooterHeight + "px";
            main.appendChild(ennemyLaser);
            ennemyLasers.push(ennemyLaser);
        }
        lastEnnemyShoot = time;
    }

    // Animation des lasers ennemis
    ennemyLasers = ennemyLasers.filter(laser => laser.parentNode);
    ennemyLasers.forEach((ennemyLaser) => {
        let ennemyLaserTop = parseInt(ennemyLaser.style.top);
        if(ennemyLaserTop < screenHeight){
            ennemyLaser.style.top = (ennemyLaserTop + 5) + "px";
            // Collision laser ennemi <-> joueur
            if (player.parentNode && isCollide(ennemyLaser, player)) {
                ennemyLaser.remove();
                // Changement d'image selon le nombre de vies
                if (playerLives === 3) {
                    player.src = "img/vanguard.png";
                } else if (playerLives === 2) {
                    player.src = "img/vanguarddmg1.png";
                } else if (playerLives === 1) {
                    player.src = "img/vanguarddmg2.png";
                }
                playerLives--;
                livesDisplay.textContent = 'Vies : ' + playerLives;
                setTimeout(() => {
                    player.remove();
                    if (playerLives > 0) {
                        // Réapparition du joueur avec la bonne image
                        if (playerLives === 2) {
                            player.src = "img/vanguarddmg1.png";
                        } else if (playerLives === 1) {
                            player.src = "img/vanguarddmg2.png";
                        } else {
                            player.src = "img/vanguard.png";
                        }
                        // On ne modifie plus la position du vaisseau lors de la réapparition
                        main.appendChild(player);
                    } else {
                        player.src = "img/explosion.png";
                        livesDisplay.textContent = 'GAME OVER';
                    }
                }, 500);
            }
        }else{
            ennemyLaser.remove();
        }
    });

    // Animation des lasers du joueur
    playerLasers = playerLasers.filter(laser => laser.parentNode);
    playerLasers.forEach((playerLaser) => {
        let currentBottom = parseInt(playerLaser.style.bottom);
        if(currentBottom < screenHeight){
            playerLaser.style.bottom = (currentBottom + 5) + "px";
            vanduuls.forEach((vanduul) => {
                if(vanduul.parentNode && isCollide(playerLaser, vanduul)){
                    playerLaser.remove();
                    vanduul.src = "img/explosion.png";
                    setTimeout(() => {
                        vanduul.remove();
                    }, 500);
                }
            });
        }else{
            playerLaser.remove();
        }
    });

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

//Faire apparaitre le joueur 
const player = document.createElement('img');
player.src = "img/vanguard.png";
player.style.height = "100px";
player.style.width = "100px";
player.style.position = "absolute";
player.style.left = (screenWidth / 2 - 50) + "px";
player.style.bottom = "0px"
main.appendChild(player);

//le faire bouger de gauche à droite avec les flèches du clavier
document.addEventListener('keydown', (event) => {
    let playerTop = parseInt(player.style.bottom) + parseInt(player.style.height);
    let playerLeft = parseInt(player.style.left);
    let playerWidth = parseInt(player.style.width);
    switch(event.key){
        case 'ArrowRight':
            let toTheRight = playerLeft += 10;
            player.style.left = toTheRight + "px";
            break;
        
        case 'ArrowLeft':
            let toTheLeft = playerLeft -= 10;
            player.style.left = toTheLeft + "px";
            break;

        case ' ':
            let playerLaser = document.createElement('img');
            playerLaser.src = "img/green_laser.png";
            playerLaser.style.width = "5px";
            playerLaser.style.height = "25px";
            playerLaser.style.position = "absolute";
            playerLaser.style.display ="block";
            playerLaser.style.bottom = playerTop + "px";
            playerLaser.style.left = playerLeft + (playerWidth / 2) + "px";
            main.appendChild(playerLaser);
            playerLasers.push(playerLaser);
            break;
    }
})