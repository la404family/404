// Import de la fonction pour changer la couleur Matrix
import { changeMatrixColor } from './fn_matrixLetter.js';

// Définition des palettes de couleurs
const colorPalettes = {
    green: {
        rgb: [
            [155, 188, 15],  // Couleur de fond claire
            [139, 172, 15],
            [48, 98, 48],    // Couleur adjacente
            [15, 56, 15],
            [15, 56, 15]     // Couleur cellule principale
        ],
        hex: ["#9bbc0f", "#8bac0f", "#306230", "#0f380f", "#0f380f"]
    },
    blue: {
        rgb: [
            [155, 176, 223],  // Couleur de fond claire bleue
            [139, 160, 207],
            [48, 98, 144],    // Couleur adjacente bleue
            [15, 40, 96],
            [15, 24, 64]      // Couleur cellule principale bleue
        ],
        hex: ["#9bb0df", "#8ba0cf", "#306290", "#0f2860", "#0f1840"]
    },
    yellow: {
        rgb: [
            [251, 247, 6],    // Couleur de fond claire jaune #FBF706FF
            [169, 167, 24],   // #A9A718FF
            [165, 149, 21],   // Couleur adjacente jaune #A59515FF
            [92, 91, 15],     // #5C5B0FFF
            [40, 34, 6]       // Couleur cellule principale jaune #282206FF
        ],
        hex: ["#FBF706FF", "#A9A718FF", "#A59515FF", "#5C5B0FFF", "#282206FF"]
    },
    red: {
        rgb: [
            [223, 155, 15],   // Couleur de fond claire rouge
            [207, 139, 15],
            [144, 48, 48],    // Couleur adjacente rouge
            [96, 15, 15],
            [64, 15, 15]      // Couleur cellule principale rouge
        ],
        hex: ["#df9b0f", "#cf8b0f", "#903030", "#600f0f", "#400f0f"]
    }
};

// Palette active par défaut
let currentPalette = 'green';
let RGBScreenColors = colorPalettes[currentPalette].rgb;
let HexScreenColors = colorPalettes[currentPalette].hex;

// Fonction pour traiter l'image
function processImage(ctx, canvas) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Calculer la distance de couleur
        let minDistance = Infinity;
        let closestColorIndex = -1;

        for (let j = 0; j < RGBScreenColors.length; j++) {
            const color = RGBScreenColors[j];
            const distance = Math.sqrt(
                Math.pow(r - color[0], 2) +
                Math.pow(g - color[1], 2) +
                Math.pow(b - color[2], 2)
            );

            if (distance < minDistance) {
                minDistance = distance;
                closestColorIndex = j;
            }
        }

        // Remplacer la couleur par la couleur correspondante
        if (closestColorIndex !== -1) {
            data[i] = RGBScreenColors[closestColorIndex][0];
            data[i + 1] = RGBScreenColors[closestColorIndex][1];
            data[i + 2] = RGBScreenColors[closestColorIndex][2];
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// Fonction principale pour initialiser la caméra Game Boy
export function fn_gameBoyCamera() {
    // Récupération et configuration du canvas
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.imageSmoothingEnabled = false;

    // Calcul de la taille du canvas (30% de la largeur de l'écran, format carré)
    const canvasSize = Math.floor(window.innerWidth * 0.3);
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    canvas.style.width = canvasSize + 'px';
    canvas.style.height = canvasSize + 'px';

    // Accès à la caméra
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            video.addEventListener('loadeddata', function () {
                // Démarrer la capture d'images
                setInterval(() => {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    processImage(ctx, canvas);
                }, 100);
            });
        })
        .catch(function (err) {
            console.error("Erreur d'accès à la caméra : ", err);
        });

    // Redimensionnement dynamique lors du changement de taille de fenêtre
    window.addEventListener('resize', function () {
        const newCanvasSize = Math.floor(window.innerWidth * 0.3);
        canvas.width = newCanvasSize;
        canvas.height = newCanvasSize;
        canvas.style.width = newCanvasSize + 'px';
        canvas.style.height = newCanvasSize + 'px';
    });

    // Initialiser les boutons de palette
    initPaletteButtons();
}

// Fonction pour changer de palette de couleurs
function changePalette(paletteKey) {
    if (colorPalettes[paletteKey]) {
        currentPalette = paletteKey;
        RGBScreenColors = colorPalettes[paletteKey].rgb;
        HexScreenColors = colorPalettes[paletteKey].hex;

        // Changer aussi la couleur des lettres Matrix
        changeMatrixColor(paletteKey);

        // Mettre à jour les boutons actifs
        updateActiveButton(paletteKey);

        console.log(`🎨 Palette changée vers: ${paletteKey} (Camera + Matrix)`);
    }
}

// Fonction pour mettre à jour le bouton actif
function updateActiveButton(activeKey) {
    // Retirer la classe active de tous les boutons
    document.querySelectorAll('.palette-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Ajouter la classe active au bouton sélectionné
    const activeButton = document.getElementById(`palette-${activeKey}`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Fonction pour initialiser les boutons de palette
function initPaletteButtons() {
    // Ajouter les écouteurs d'événements aux boutons
    document.querySelectorAll('.palette-btn').forEach(button => {
        button.addEventListener('click', function () {
            const palette = this.getAttribute('data-palette');
            changePalette(palette);
        });
    });

    // Marquer le bouton vert comme actif par défaut
    updateActiveButton('green');

    console.log('🎮 Boutons de palette initialisés');
}