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

//Dessiner les ennemis
for(let i=0; i<6 ; i++){
    let vanduul = document.createElement('img');
    vanduul.id = "vanduul" + i;
    vanduul.className = "ennemy";
    vanduul.src = "img/vanduul.png";
    vanduul.style.width = "100px";
    vanduul.style.height = "75px";
    vanduul.style.position = "absolute";
    vanduul.style.left = 200 * i + "px";
    vanduul.style.top = "0px";
    main.appendChild(vanduul);
}

const ennemyShoot = setInterval(() => {
    let ennemies = document.querySelectorAll(".ennemy");
    let shooter = getRandomEnemy(ennemies);
    let shooterLeft = parseInt(shooter.style.left);
    let shooterTop = parseInt(shooter.style.top);
    let shooterWidth = parseInt(shooter.style.width);
    let shooterHeight = parseInt(shooter.style.height);
    let ennemyLaser = document.createElement('img');
    ennemyLaser.src = "img/red_laser.png";
    ennemyLaser.style.width = "5px";
    ennemyLaser.style.height = "25px";
    ennemyLaser.style.position = "absolute";
    ennemyLaser.style.left = shooterLeft + (shooterWidth / 2) + "px"
    ennemyLaser.style.top = shooterTop + shooterHeight + "px"
    main.appendChild(ennemyLaser);
}, 1000)

//Faire bouger les ennemis
let vanduuls = document.querySelectorAll(".ennemy"); // tableau avec tous les éléments ennemi

vanduuls.forEach((vanduul) => {
    let ennemiMoveInterval = setInterval(() => {
        let currentTop = parseInt(vanduul.style.top);
        if(currentTop < screenHeight - parseInt(vanduul.style.height)){
            vanduul.style.top = (currentTop + 1) + "px";
        }else{
            vanduul.remove();
            clearInterval(ennemiMoveInterval); // clearInterval(ennemiMoveInterval) Pour stopper la répétition des instructions et ne pas encombrer la mémoire du navigateur
        }
    }, 16)
})

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
            playerLaser.style.bottom = playerTop + "px";
            playerLaser.style.left = playerLeft + (playerWidth / 2) + "px";
            main.appendChild(playerLaser);
            let movePlayerLaser = setInterval(() => {
                let currentBottom = parseInt(playerLaser.style.bottom);
                if(currentBottom < screenHeight){
                    playerLaser.style.bottom = (currentBottom + 5) + "px";
                    vanduuls.forEach((vanduul) => {
                        if(isCollide(playerLaser, vanduul)){
                            playerLaser.remove();
                            clearInterval(movePlayerLaser);
                            vanduul.src = "img/explosion.png";
                            setTimeout(() => {
                                vanduul.remove();
                            }, 500)
                        }
                    })
                }else{
                    playerLaser.remove();
                    clearInterval(movePlayerLaser); 
                }
            }, 16)
            break;
    }
})