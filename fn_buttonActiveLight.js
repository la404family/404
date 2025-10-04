// Fonction pour créer l'effet LED allumée sur le bouton actif
export function fn_buttonActiveLight(buttonElement) {
    // Récupérer les couleurs du gradient du bouton
    const palette = buttonElement.getAttribute('data-palette');
    
    // Définir les couleurs d'éclairage pour chaque palette
    const lightColors = {
        green: {
            glow: 'rgba(140, 205, 95, 0.9)',
            shadow: 'rgba(140, 205, 95, 0.6)',
            border: '#8ccd5f'
        },
        blue: {
            glow: 'rgba(105, 185, 240, 0.9)',
            shadow: 'rgba(105, 185, 240, 0.6)',
            border: '#69b9f0'
        },
        yellow: {
            glow: 'rgba(245, 210, 70, 0.9)',
            shadow: 'rgba(245, 210, 70, 0.6)',
            border: '#f5d246'
        },
        red: {
            glow: 'rgba(240, 125, 100, 0.9)',
            shadow: 'rgba(240, 125, 100, 0.6)',
            border: '#f07d64'
        },
        purple: {
            glow: 'rgba(190, 150, 235, 0.9)',
            shadow: 'rgba(190, 150, 235, 0.6)',
            border: '#be96eb'
        },
        cyan: {
            glow: 'rgba(110, 220, 230, 0.9)',
            shadow: 'rgba(110, 220, 230, 0.6)',
            border: '#6edce6'
        },
        orange: {
            glow: 'rgba(255, 180, 100, 0.9)',
            shadow: 'rgba(255, 180, 100, 0.6)',
            border: '#ffb464'
        },
        pink: {
            glow: 'rgba(255, 170, 200, 0.9)',
            shadow: 'rgba(255, 170, 200, 0.6)',
            border: '#ffaac8'
        }
    };
    
    // Retirer tous les styles actifs des autres boutons
    document.querySelectorAll('.palette-btn').forEach(btn => {
        btn.style.borderColor = '#9e8686';
        btn.style.borderWidth = '5px';
        btn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.4)';
        btn.style.transform = 'scale(1)';
    });
    
    // Appliquer l'effet LED au bouton actif
    if (lightColors[palette]) {
        const color = lightColors[palette];
        
        // Effet de lumière douce (glow LED)
        buttonElement.style.borderColor = color.border;
        buttonElement.style.borderWidth = '3px';
        buttonElement.style.boxShadow = `
            0 0 15px ${color.glow},
            0 0 25px ${color.shadow},
            0 0 35px ${color.shadow},
            inset 0 0 10px ${color.glow}
        `;
        buttonElement.style.transform = 'scale(1.15)';
        buttonElement.style.filter = 'brightness(1.3)';
        
        console.log(`💡 LED activée: ${palette} (${color.border})`);
    }
}

// Fonction pour initialiser l'effet LED sur tous les boutons
export function initButtonLights() {
    document.querySelectorAll('.palette-btn').forEach(button => {
        button.addEventListener('click', function() {
            fn_buttonActiveLight(this);
        });
    });
    
    console.log('💡 Système d\'éclairage LED des boutons initialisé');
}
