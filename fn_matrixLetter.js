// Caractères pour l'effet Matrix
const matrixChars = [
    // Lettres A-Z
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    // Caractères chinois
    '中', '国', '人', '大', '小', '天', '地', '水', '火', '木', '金', '土', '日', '月', '星', '光', '明', '暗', '好', '坏',
    // Caractères hébreux
    'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת',
    // Caractères arabes
    'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي',
    // Caractères grecs
    'Α', 'Β', 'Γ', 'Δ', 'Ε', 'Ζ', 'Η', 'Θ', 'Ι', 'Κ', 'Λ', 'Μ', 'Ν', 'Ξ', 'Ο', 'Π', 'Ρ', 'Σ', 'Τ', 'Υ', 'Φ', 'Χ', 'Ψ', 'Ω'
];

// Palettes de couleurs pour l'effet Matrix
const matrixColorPalettes = {
    green: "#8ccd5f",   // Medium Green - coordonné avec palette caméra
    blue: "#69b9f0",    // Serenity Blue - coordonné avec palette caméra
    yellow: "#f5d246",  // Golden Yellow - coordonné avec palette caméra
    red: "#f07d64",     // Coral Red - coordonné avec palette caméra
    purple: "#be96eb",  // Wisteria - coordonné avec palette caméra
    cyan: "#6edce6",    // Aqua - coordonné avec palette caméra
    orange: "#ffb464",  // Mandarin - coordonné avec palette caméra
    pink: "#ffaac8"     // Bubblegum - coordonné avec palette caméra
};

// Variables pour l'effet Matrix
let matrixColumns = [];
let matrixCanvas, matrixCtx;
let currentMatrixColor = matrixColorPalettes.green;

// Fonction pour initialiser et animer l'effet Matrix
export function fn_matrixLetter() {
    matrixCanvas = document.getElementById("matrixCanvas");
    matrixCtx = matrixCanvas.getContext("2d");

    // Configurer la taille du canvas Matrix
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const fontSize = 14;
    const columns = matrixCanvas.width / fontSize;

    // Initialiser les colonnes
    for (let i = 0; i < columns; i++) {
        matrixColumns[i] = 1;
    }

    // Fonction d'animation
    function drawMatrix() {
        // Fond semi-transparent pour l'effet de traînée
        matrixCtx.fillStyle = "rgba(0, 0, 0, 0.04)";
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        // Style du texte avec couleur dynamique
        matrixCtx.fillStyle = currentMatrixColor;
        matrixCtx.font = fontSize + "px monospace";

        // Dessiner les caractères
        for (let i = 0; i < matrixColumns.length; i++) {
            // Choisir un caractère aléatoire
            const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];

            // Position du caractère
            const x = i * fontSize;
            const y = matrixColumns[i] * fontSize;

            matrixCtx.fillText(char, x, y);

            // Réinitialiser la colonne si elle dépasse l'écran
            if (y > matrixCanvas.height && Math.random() > 0.975) {
                matrixColumns[i] = 0;
            }

            // Faire descendre le caractère
            matrixColumns[i]++;
        }
    }

    // Redimensionnement du canvas Matrix
    window.addEventListener('resize', function () {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;

        const newColumns = matrixCanvas.width / fontSize;
        matrixColumns = [];
        for (let i = 0; i < newColumns; i++) {
            matrixColumns[i] = 1;
        }
    });

    // Démarrer l'animation
    setInterval(drawMatrix, 35);
}

// Fonction pour changer la couleur des lettres Matrix
export function changeMatrixColor(paletteKey) {
    if (matrixColorPalettes[paletteKey]) {
        currentMatrixColor = matrixColorPalettes[paletteKey];
        console.log(`🌈 Couleur Matrix changée vers: ${paletteKey} (${currentMatrixColor})`);
    }
}