# il SETTICLAVIO aps – sito ufficiale

Sito statico per l'associazione di promozione sociale **il SETTICLAVIO aps** di Milano.
Costruito in HTML, CSS e JS vanilla, senza framework né build step.

## Struttura

```
ilsetticlavio.it/
├── index.html
├── README.md
└── assets/
    ├── css/style.css
    ├── js/main.js
    ├── images/        # logo, foto, sfondi (da aggiungere)
    └── docs/          # PDF statuto, regolamento, ecc. (da aggiungere)
```

## Anteprima locale

Aprire `index.html` direttamente nel browser oppure servire la cartella con un web server statico:

```bash
# Python 3
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Visitare poi http://localhost:8000.

## Asset da fornire

Le immagini referenziate dal sito vanno collocate in `assets/images/`:

| File | Uso |
|---|---|
| `logo.png` | Logo nell'header (consigliato ~160×48 px, sfondo trasparente) |
| `hero-bg.jpg` | Sfondo della sezione hero (consigliato 1920×1080) |
| `progetto-a-tempo.jpg` | Card progetto "A Tempo" |
| `progetto-tra-le-onde.jpg` | Card progetto "Tra le Onde" |
| `progetto-music-for-life.jpg` | Card progetto "Music for Life" |
| `luca-maggioni.jpg` | Ritratto Luca Maggioni (quadrato ≥400 px) |
| `gianni-gandini.jpg` | Ritratto Gianni Gandini (quadrato ≥400 px) |

I PDF associativi vanno in `assets/docs/`:

- `proposta-aziende.pdf`
- `documento-buona-causa.pdf`
- `statuto.pdf`
- `regolamento-interno.pdf`

Senza queste risorse il sito funziona ma mostra link rotti / immagini placeholder.

## Form contatti

Il form usa un fallback `mailto:` lato client (apre il client email dell'utente).
Per un invio "vero" lato server è sufficiente sostituire il blocco in
`assets/js/main.js` con una `fetch()` POST verso un endpoint (Formspree, Netlify Forms,
un backend custom, ecc.).

## Accessibilità & SEO

- Markup semantico (`header`, `main`, `section`, `article`, `footer`, `nav`).
- `aria-label`, `aria-expanded`, `role="status"` dove serve.
- Focus-visible custom, supporto `prefers-reduced-motion`.
- Meta description + Open Graph + JSON-LD `Organization`.
- `<link rel="canonical">` impostato.

## Browser supportati

Tutti i browser evergreen (Chrome, Edge, Firefox, Safari) con supporto CSS Grid e
IntersectionObserver. IE11 non supportato.
