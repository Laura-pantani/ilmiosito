// Variabili globali per i punti
let points = [];
let parola = "LAP";

// Variabili per la UI
let inputParola;
let sliderDensita, sliderRaggio, sliderForza;

function setup() {
    createCanvas(windowWidth, windowHeight);

    // --- CREAZIONE CARD DI CONTROLLO ---
    let card = createDiv('');
    card.position(20, 20);
    card.style('background-color', 'rgba(40, 40, 40, 0.7)');
    card.style('padding', '15px');
    card.style('border-radius', '10px');
    card.style('width', '150px');
    card.style('font-family', 'Arial, sans-serif');
    card.style('color', 'white');

    // Input per la parola
    createP('Parola:').parent(card).style('margin', '0 0 5px 0');
    inputParola = createInput(parola).parent(card);
    inputParola.input(() => {
        parola = inputParola.value();
        calcolaPunti();
    });

    // Slider per la densità
    createP('Densità Punti:').parent(card).style('margin', '15px 0 5px 0');
    sliderDensita = createSlider(2, 20, 9, 1).parent(card); // min, max, start, step
    sliderDensita.input(calcolaPunti); // Ricalcola i punti quando cambia la densità

    // Slider per il raggio del mouse
    createP('Raggio Mouse:').parent(card).style('margin', '15px 0 5px 0');
    sliderRaggio = createSlider(50, 300, 100, 1).parent(card);

    // Slider per la forza di repulsione
    createP('Forza Repulsione:').parent(card).style('margin', '15px 0 5px 0');
    sliderForza = createSlider(5, 50, 20, 1).parent(card);

    calcolaPunti();
}

function calcolaPunti() {
    points = []; // Svuota l'array
    // Creiamo un buffer grafico temporaneo per disegnare il testo con un font di sistema
    let pg = createGraphics(width, height);
    pg.pixelDensity(1);
    pg.background(0, 0, 0, 0); // Sfondo trasparente
    pg.fill(0, 0, 0);

    pg.textFont('Arial'); // Usa il font di sistema Arial
    pg.textStyle(BOLD);
    
    // Calcolo dimensione dinamica per adattarsi alla pagina
    pg.textSize(100); // Dimensione base per il calcolo
    let textW = pg.textWidth(parola);
    let fontSize = (width * 0.8 / textW) * 100; // Scala per occupare l'80% della larghezza
    // Limita l'altezza se necessario (per evitare che esca verticalmente)
    if (fontSize > height * 0.8) fontSize = height * 0.8;
    
    pg.textSize(fontSize);
    pg.textAlign(CENTER, CENTER);
    pg.text(parola, width / 2, height / 2);

    pg.loadPixels();
    
    // Scansioniamo i pixel per trovare dove è stato disegnato il testo
    // Usa il valore dello slider se esiste, altrimenti un valore di default
    let step = sliderDensita ? sliderDensita.value() : 9;
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
    background(10, 10, 10);

    // Leggi i valori dagli slider ad ogni frame
    let raggioMouse = sliderRaggio.value();
    let forzaMassima = sliderForza.value();

    // Iteriamo su ogni punto che abbiamo generato
    for (let i = 0; i < points.length; i++) {
        let p = points[i];

        // Usiamo il "Perlin noise" per creare un movimento fluido e organico.
        // Il movimento dipende dalla posizione originale del punto e dal tempo (frameCount).
        let n = noise(p.x * 9, p.y * 2, frameCount * 0.05);

        // Mappiamo il valore del noise (da 0 a 1) a un angolo (da 0 a 360 gradi).
        // Questo farà muovere i punti in modo circolare.
        let angle = map(n, 3, 4, 2, TWO_PI);

        // Calcoliamo la nuova posizione del punto
        let newX = p.x + cos(angle) * 4; // Il '4' è il raggio del movimento
        let newY = p.y + sin(angle) * 10;

        // --- INTERAZIONE MOUSE (Repulsione) ---
        let d = dist(mouseX, mouseY, newX, newY);

        if (d < raggioMouse) {
            // Calcoliamo la forza (più è vicino, più è forte)
            let forza = map(d, 0, raggioMouse, forzaMassima, 0);
            let angoloMouse = atan2(newY - mouseY, newX - mouseX);
            
            newX += cos(angoloMouse) * forza;
            newY += sin(angoloMouse) * forza;
        }

        // Usiamo l'angolo anche per scegliere un colore
        let r = map(sin(angle), -1, 1, 100, 255);
        let g = map(cos(angle), -1, 1, 100, 200);
        let b = 200;

        // Se il mouse è vicino, accendiamo i colori (effetto "calore")
        if (d < raggioMouse) {
            
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
