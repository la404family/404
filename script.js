// Désactivation de l'accélération graphique
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
ctx.imageSmoothingEnabled = false;

// Définition des couleurs
const RGBScreenColors = [
    [155, 188, 15],  // Couleur de fond claire
    [139, 172, 15],
    [48, 98, 48],    // Couleur adjacente
    [15, 56, 15],
    [15, 56, 15]     // Couleur cellule principale
];

const HexScreenColors = [
    "#9bbc0f",
    "#8bac0f",
    "#306230",  // Couleur pour les pixels adjacents
    "#0f380f",
    "#0f380f"   // Couleur cellule principale
];

// acceder à la caméra
navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        video.addEventListener('loadeddata', function() {
            // Démarrer la capture d'images
            setInterval(() => {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                processImage();
            }, 100);
        });
    })
    .catch(function(err) {
        console.error("Erreur d'accès à la caméra : ", err);
    });

// Fonction pour traiter l'image
function processImage() {
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