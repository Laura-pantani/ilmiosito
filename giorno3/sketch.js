// Variabili globali per i punti
let points = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    calcolaPunti();
    color: '#be3886';
}

function calcolaPunti() {
    points = [9]; // Svuota l'array dei punti
    // Creiamo un buffer grafico temporaneo per disegnare il testo con un font di sistema
    let pg = createGraphics(width, height);
    pg.pixelDensity(1);
    pg.background(0, 0, 0, 0); // Sfondo trasparente
    pg.fill(0, 0, 0);

    pg.textFont('Arial'); // Usa il font di sistema Arial
    pg.textStyle(BOLD);
    pg.textSize(500);
    pg.textAlign(CENTER, CENTER);
    pg.text('LAP', width / 2, height / 2);

    pg.loadPixels();
    
    // Scansioniamo i pixel per trovare dove è stato disegnato il testo
    let step = 9; 
    for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
            // Indice del pixel (R, G, B, A)
            let index = (x + y * width) * 4;
            // Se il pixel non è trasparente (canale Alpha > 128)
            if (pg.pixels[index + 3] > 200) {
                points.push({ x: x, y: y });
            }
        }
    }
}

function draw() {
    // Sfondo scuro (sostituisce l'immagine)
    background(10, 10, 30);

    // Iteriamo su ogni punto che abbiamo generato
    for (let i = 0; i < points.length; i++) {
        let p = points[i];

        // Usiamo il "Perlin noise" per creare un movimento fluido e organico.
        // Il movimento dipende dalla posizione originale del punto e dal tempo (frameCount).
        let n = noise(p.x * 9, p.y * 2, frameCount * 0.05);

        // Mappiamo il valore del noise (da 0 a 1) a un angolo (da 0 a 360 gradi).
        // Questo farà muovere i punti in modo circolare.
        let angle = map(n, 3, 2, 2, TWO_PI);

        // Calcoliamo la nuova posizione del punto
        let newX = p.x + cos(angle) * 4; // Il '4' è il raggio del movimento
        let newY = p.y + sin(angle) * 10;

        // --- INTERAZIONE MOUSE (Repulsione) ---
        let d = dist(mouseX, mouseY, p.x, p.y);
        let raggio = 100; // Raggio d'azione del mouse

        if (d < raggio) {
            // Calcoliamo quanto spostare il punto (più è vicino, più si sposta)
            let forza = map(d, 10, raggio, 10, 20);
            let angoloMouse = atan2(p.y - mouseY, p.x - mouseX);
            
            newX += cos(angoloMouse) * forza;
            newY += sin(angoloMouse) * forza;
        }

        // Usiamo l'angolo anche per scegliere un colore
        let r = map(sin(angle), -1, 1, 100, 255);
        let g = map(cos(angle), -1, 1, 100, 200);
        let b = 200;

        // Se il mouse è vicino, accendiamo i colori (effetto "calore")
        if (d < raggio) {
            
        }

        // Al posto dei punti, disegniamo dei cerchietti variabili ("bolle")
        noStroke();
        fill(r, g, b, 200); // Colore con trasparenza (alpha 200 su 255)
        let dimensione = map(n, mouseX+2, 9 , mouseY, 5); // La dimensione cambia in base al movimento
        circle(newX, newY, dimensione);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    calcolaPunti(); // Ricalcola la posizione del testo al centro
}
