// Import de la fonction pour changer la couleur Matrix
import { changeMatrixColor } from './fn_matrixLetter.js';
// Import de la fonction pour l'effet LED des boutons
import { fn_buttonActiveLight, initButtonLights } from './fn_buttonActiveLight.js';

// Palettes de couleurs révisées - Optimisées pour filtre caméra
// Palettes de couleurs optimisées avec contraste accentué
const colorPalettes = {
    green: {
        rgb: [
            [210, 245, 130],  // Light Mint - Fond clair (plus lumineux)
            [140, 205, 95],   // Medium Green - Transition (plus saturé)
            [65, 155, 80],    // Forest Green - Adjacent (écart amplifié)
            [30, 95, 50],     // Deep Green - Accent (plus sombre)
            [12, 40, 25]      // Dark Pine - Cellule principale (très sombre)
        ],
        hex: ["#d2f582", "#8ccd5f", "#419b50", "#1e5f32", "#0c2819"]
    },
    blue: {
        rgb: [
            [185, 230, 255],  // Crystal Blue - Fond clair (plus clair)
            [105, 185, 240],  // Serenity Blue - Transition (plus vif)
            [50, 125, 200],   // Azure Blue - Adjacent (contraste renforcé)
            [25, 75, 145],    // Deep Ocean - Accent (plus profond)
            [10, 35, 75]      // Midnight Blue - Cellule principale (quasi noir)
        ],
        hex: ["#b9e6ff", "#69b9f0", "#327dc8", "#194b91", "#0a234b"]
    },
    yellow: {
        rgb: [
            [255, 250, 150],  // Sunlight - Fond clair (presque blanc)
            [245, 210, 70],   // Golden Yellow - Transition (plus doré)
            [200, 160, 35],   // Amber - Adjacent (écart augmenté)
            [140, 105, 20],   // Honey - Accent (plus terre)
            [70, 50, 10]      // Bronze - Cellule principale (très sombre)
        ],
        hex: ["#fffa96", "#f5d246", "#c8a023", "#8c6914", "#46320a"]
    },
    red: {
        rgb: [
            [255, 195, 185],  // Peach Pink - Fond clair (plus pâle)
            [240, 125, 100],  // Coral Red - Transition (plus vif)
            [200, 65, 50],    // Crimson - Adjacent (rouge pur)
            [140, 30, 30],    // Burgundy - Accent (plus sombre)
            [70, 15, 18]      // Wine - Cellule principale (presque noir)
        ],
        hex: ["#ffc3b9", "#f07d64", "#c84132", "#8c1e1e", "#460f12"]
    },
    purple: {
        rgb: [
            [230, 210, 255],  // Lavender - Fond clair (plus lumineux)
            [190, 150, 235],  // Wisteria - Transition (plus saturé)
            [145, 90, 195],   // Royal Purple - Adjacent (contraste fort)
            [90, 45, 140],    // Deep Purple - Accent (plus profond)
            [45, 22, 70]      // Midnight Purple - Cellule principale (très sombre)
        ],
        hex: ["#e6d2ff", "#be96eb", "#915ac3", "#5a2d8c", "#2d1646"]
    },
    cyan: {
        rgb: [
            [180, 250, 255],  // Sky Light - Fond clair (plus éclatant)
            [110, 220, 230],  // Aqua - Transition (plus vif)
            [50, 175, 180],   // Teal - Adjacent (écart renforcé)
            [20, 110, 115],   // Deep Sea - Accent (plus foncé)
            [10, 55, 60]      // Abyssal - Cellule principale (presque noir)
        ],
        hex: ["#b4faff", "#6edce6", "#32afb4", "#146e73", "#0a373c"]
    },
    orange: {
        rgb: [
            [255, 225, 180],  // Peach Light - Fond clair
            [255, 180, 100],  // Mandarin - Transition
            [230, 125, 40],   // Tangerine - Adjacent
            [170, 75, 15],    // Burnt Orange - Accent
            [85, 40, 8]       // Deep Rust - Cellule principale
        ],
        hex: ["#ffe1b4", "#ffb464", "#e67d28", "#aa4b0f", "#552808"]
    },
    pink: {
        rgb: [
            [255, 220, 230],  // Rose Petal - Fond clair
            [255, 170, 200],  // Bubblegum - Transition
            [235, 100, 150],  // Hot Pink - Adjacent
            [180, 50, 100],   // Magenta - Accent
            [90, 25, 50]      // Deep Rose - Cellule principale
        ],
        hex: ["#ffdce6", "#ffaac8", "#eb6496", "#b43264", "#5a1932"]
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

// Fonction pour mettre à jour le bouton actif avec effet LED
function updateActiveButton(activeKey) {
    // Récupérer le bouton actif
    const activeButton = document.getElementById(`palette-${activeKey}`);
    
    // Appliquer l'effet LED au bouton actif
    if (activeButton) {
        fn_buttonActiveLight(activeButton);
    }
}

// Fonction pour initialiser les boutons de palette
function initPaletteButtons() {
    // Initialiser le système d'éclairage LED des boutons
    initButtonLights();
    
    // Ajouter les écouteurs d'événements aux boutons
    document.querySelectorAll('.palette-btn').forEach(button => {
        button.addEventListener('click', function () {
            const palette = this.getAttribute('data-palette');
            changePalette(palette);
        });
    });

    // Activer le bouton vert avec effet LED par défaut
    updateActiveButton('green');

    console.log('🎮 Boutons de palette initialisés avec effet LED');
}