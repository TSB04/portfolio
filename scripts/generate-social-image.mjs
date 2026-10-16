import sharp from "sharp";
import { fileURLToPath } from "node:url";

// Deterministic social card, generated locally without remote assets.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><radialGradient id="glow"><stop stop-color="#26385f"/><stop offset="1" stop-color="#0c1220"/></radialGradient></defs>
<rect width="1200" height="630" fill="#0c1220"/>
<circle cx="1030" cy="285" r="360" fill="url(#glow)"/>
<circle cx="1030" cy="285" r="225" fill="none" stroke="#344367"/>
<circle cx="1030" cy="285" r="190" fill="none" stroke="#344367"/>
<path d="M72 78h54" stroke="#818cf8" stroke-width="4"/>
<g font-family="Arial, sans-serif">
<text x="146" y="86" fill="#a5b4fc" font-size="20" letter-spacing="4">TSB / ENGINEERING NOTEBOOK</text>
<text x="72" y="255" fill="#e8edf6" font-size="70" font-weight="700">Thierno Sadou</text>
<text x="72" y="337" fill="#e8edf6" font-size="78" font-weight="700">BARRY</text>
<text x="76" y="400" fill="#a5b4fc" font-size="30">Full Stack Engineer</text>
<text x="76" y="447" fill="#93a1b8" font-size="22">Java · Spring Boot · React · AI</text>
<path d="M76 506h1048" stroke="#2a3852"/>
<text x="76" y="557" fill="#e8edf6" font-size="22">tsb-dev.fr</text>
<text x="1124" y="557" text-anchor="end" fill="#93a1b8" font-size="20">Paris, France · Portfolio</text>
</g></svg>`;
await sharp(Buffer.from(svg)).png().toFile(fileURLToPath(new URL("../public/og-image.png", import.meta.url)));
console.log("Generated public/og-image.png (1200 × 630)");
