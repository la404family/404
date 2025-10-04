// ========================================
// POINT D'ENTRÉE PRINCIPAL - MODULES INJECTION
// ========================================

// Import des modules
import { fn_gameBoyCamera } from './fn_gameBoyCamera.js';
import { fn_matrixLetter } from './fn_matrixLetter.js';

// ========================================
// INITIALISATION DE L'APPLICATION
// ========================================

// Fonction d'initialisation principale
function initApplication() {
    console.log('🚀 Initialisation de l\'application 404...');

    // Initialiser l'effet Matrix en arrière-plan
    fn_matrixLetter();
    console.log('✅ Module Matrix initialisé');

    // Initialiser la caméra Game Boy au premier plan
    fn_gameBoyCamera();
    console.log('✅ Module Game Boy Camera initialisé');

    console.log('🎉 Application 404 prête !');
}

// Démarrage de l'application
initApplication();
