// DOM Elements
const phoneInput = document.getElementById('phone');
const messageInput = document.getElementById('message');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const downloadPngBtn = document.getElementById('download-png');
const downloadSvgBtn = document.getElementById('download-svg');
const newLinkBtn = document.getElementById('new-link-btn');
const generatorScreen = document.getElementById('generator-screen');
const resultScreen = document.getElementById('result-screen');
const generatedLinkInput = document.getElementById('generated-link');
const qrSizeSelect = document.getElementById('qr-size');
const navbarToggle = document.querySelector('.navbar-toggle');
const navLinks = document.querySelector('.nav-links');

// Phone number formatting and validation
phoneInput.addEventListener('input', (e) => {
    // Remove any non-digit character
    let value = e.target.value.replace(/\D/g, '');
    
    // Limit to 11 digits
    value = value.slice(0, 11);
    
    // Format the number
    let formattedValue = '';
    if (value.length > 0) {
        formattedValue = '(' + value.substring(0, 2);
        if (value.length > 2) {
            formattedValue += ') ' + value.substring(2, 7);
            if (value.length > 7) {
                formattedValue += '-' + value.substring(7, 11);
            }
        }
    }
    
    e.target.value = formattedValue;
});

// Mobile menu toggle
navbarToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Generate WhatsApp link and QR code
generateBtn.addEventListener('click', () => {
    const phone = phoneInput.value.replace(/\D/g, '');
    if (phone.length !== 11) {
        alert('Por favor, insira um número de telefone válido com 11 dígitos');
        return;
    }

    const message = encodeURIComponent(messageInput.value);
    const whatsappLink = `https://wa.me/55${phone}${message ? '?text=' + message : ''}`;
    generatedLinkInput.value = whatsappLink;

    // Generate QR code
    generateQRCode(whatsappLink);

    // Show result screen
    generatorScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
});

// Generate QR Code
function generateQRCode(text) {
    const qrcodeContainer = document.getElementById('qrcode');
    qrcodeContainer.innerHTML = '';

    const qr = qrcode(0, 'L');
    qr.addData(text);
    qr.make();

    const size = parseInt(qrSizeSelect.value);
    qrcodeContainer.innerHTML = qr.createSvgTag({
        cellSize: size / 33,
        margin: 0,
        scalable: true
    });

    const svg = qrcodeContainer.querySelector('svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.style.maxWidth = '300px';
    svg.style.borderRadius = '10px';
}

// Copy link to clipboard
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(generatedLinkInput.value);
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copiar';
        }, 2000);
    } catch (err) {
        alert('Falha ao copiar o link');
    }
});

// Download QR code
function downloadQRCode(format) {
    const svg = document.querySelector('#qrcode svg');
    const size = parseInt(qrSizeSelect.value);
    
    if (format === 'svg') {
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(svgBlob);
        link.download = 'whatsapp-qr.svg';
        link.click();
    } else {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        canvas.width = size;
        canvas.height = size;
        
        img.onload = () => {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0, size, size);
            
            const link = document.createElement('a');
            link.download = 'whatsapp-qr.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svg));
    }
}

downloadPngBtn.addEventListener('click', () => downloadQRCode('png'));
downloadSvgBtn.addEventListener('click', () => downloadQRCode('svg'));

// QR size change handler
qrSizeSelect.addEventListener('change', () => {
    generateQRCode(generatedLinkInput.value);
});

// Generate new link
newLinkBtn.addEventListener('click', () => {
    phoneInput.value = '';
    messageInput.value = '';
    resultScreen.classList.add('hidden');
    generatorScreen.classList.remove('hidden');
});