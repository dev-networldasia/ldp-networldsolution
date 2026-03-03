const fs = require('fs');
const files = fs.readdirSync('d:/projects/ldp-networldsolution/assets/images/logo-branch');
const chunks = [[], [], []];

// Shuffle files or just distribute them
files.forEach((file, index) => {
    chunks[index % 3].push(file);
});

let html = '<div class="trust__marquee-container">\n';

chunks.forEach((chunk, i) => {
    let rowClass = i === 1 ? ' trust__marquee--reverse' : '';
    html += `  <div class="trust__marquee${rowClass}">\n`;

    // Original contents
    html += `    <div class="trust__marquee-content">\n`;
    chunk.forEach(file => {
        // basic alt text is file without extension
        let name = file.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        html += `      <div class="item-logo"><img src="assets/images/logo-branch/${file}" alt="${name}" /></div>\n`;
    });
    html += `    </div>\n`;

    // Duplicate for infinite scroll
    html += `    <div class="trust__marquee-content" aria-hidden="true">\n`;
    chunk.forEach(file => {
        let name = file.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        html += `      <div class="item-logo"><img src="assets/images/logo-branch/${file}" alt="${name}" /></div>\n`;
    });
    html += `    </div>\n`;

    html += `  </div>\n`;
});
html += '</div>';

fs.writeFileSync('d:/projects/ldp-networldsolution/temp_marquee.html', html);
console.log('done');
