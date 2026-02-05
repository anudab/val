// Create floating hearts in background
function createHearts() {
    const heartsContainer = document.getElementById('hearts');
    const heartEmojis = ['💕', '💖', '💗', '💓', '💝', '❤️', '💘', '💞'];
    
    setInterval(() => {
        const heart = document.createElement('span');
        heart.classList.add('heart');
        heart.innerText = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
        heartsContainer.appendChild(heart);
        
        // Remove heart after animation
        setTimeout(() => {
            heart.remove();
        }, 6000);
    }, 300);
}

// Make the No button run away
const noBtn = document.getElementById('noBtn');
let noClickCount = 0;

noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('click', moveNoButton);
noBtn.addEventListener('touchstart', moveNoButton);

function moveNoButton(e) {
    e.preventDefault();
    noClickCount++;
    
    const messages = [
        "No",
        "Are you sure?",
        "Really?",
        "Think again!",
        "Pretty please?",
        "💔",
        "Don't do this!",
        "I'll be sad...",
        "Come on!",
        "Last chance!"
    ];
    
    // Update button text
    noBtn.innerText = messages[Math.min(noClickCount, messages.length - 1)];
    
    // Move button to random position
    const card = document.querySelector('.card');
    const cardRect = card.getBoundingClientRect();
    
    const maxX = window.innerWidth - noBtn.offsetWidth - 20;
    const maxY = window.innerHeight - noBtn.offsetHeight - 20;
    
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.style.zIndex = '1000';
    
    // Make yes button bigger each time
    const yesBtn = document.getElementById('yesBtn');
    const currentScale = parseFloat(yesBtn.dataset.scale) || 1;
    const newScale = Math.min(currentScale + 0.1, 2);
    yesBtn.dataset.scale = newScale;
    yesBtn.style.transform = `scale(${newScale})`;
}

const submitBtn = document.getElementById('submitPasscodeBtn');
const passcodeInput = document.getElementById('passcodeInput');

submitBtn.addEventListener('click', () => {
    const enteredPasscode = passcodeInput.value;
    
    if (enteredPasscode === CONFIG.PASSCODE) {
        document.getElementById('passcodeView').classList.add('hidden');
        document.getElementById('questionView').classList.remove('hidden');
    } else {
        passcodeInput.style.borderColor = '#ff4444';
        passcodeInput.style.animation = 'shake 0.5s ease';
        passcodeInput.value = '';
        passcodeInput.placeholder = 'Wrong passcode, try again! 💔';
        
        setTimeout(() => {
            passcodeInput.style.animation = '';
        }, 500);
    }
});

// Allow Enter key to submit passcode
passcodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        submitBtn.click();
    }
});
// Handle Yes button click
const yesBtn = document.getElementById('yesBtn');
yesBtn.addEventListener('click', () => {
    // Hide question, show success
    document.getElementById('questionView').classList.add('hidden');
    document.getElementById('successView').classList.remove('hidden');
    
    // Hide the runaway No button
    noBtn.style.display = 'none';
    
    // Send email notification that she said YES!
    sendEmail(true);
    
    // Launch confetti!
    launchConfetti();
    
    // More confetti waves
    setTimeout(launchConfetti, 500);
    setTimeout(launchConfetti, 1000);
    setTimeout(launchConfetti, 1500);
});

// Confetti function
function launchConfetti() {
    const confettiContainer = document.getElementById('confetti');
    const colors = ['#ff6b95', '#ff4081', '#e91e63', '#f48fb1', '#ff80ab', '#ffd700', '#ff69b4', '#ff1493'];
    const shapes = ['❤️', '💕', '💖', '✨', '🌟', '💝'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            // Random between emoji and colored square
            if (Math.random() > 0.5) {
                confetti.innerText = shapes[Math.floor(Math.random() * shapes.length)];
                confetti.style.fontSize = (Math.random() * 15 + 10) + 'px';
            } else {
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            }
            
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confettiContainer.appendChild(confetti);
            
            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }, i * 30);
    }
}

function sendEmail(accepted) {
    // ============================================
    // EMAILJS SETUP - Follow these steps:
    // ============================================
    // 1. Go to https://www.emailjs.com/ and create a FREE account
    // 2. Add an Email Service (Gmail, Outlook, etc.) and get the SERVICE_ID
    // 3. Create an Email Template with these variables:
    //    - {{status}} - "ACCEPTED" or "DECLINED"
    //    - {{message}} - The full message
    //    - {{time}} - Timestamp
    //    Get the TEMPLATE_ID
    // 4. Go to Account > API Keys and copy your PUBLIC_KEY
    // 5. Replace the values below:
    // ============================================
    
    const SERVICE_ID = CONFIG.EMAILJS_SERVICE_ID;
    const TEMPLATE_ID = CONFIG.EMAILJS_TEMPLATE_ID;
    const PUBLIC_KEY = CONFIG.EMAILJS_PUBLIC_KEY;
    
    // Initialize EmailJS
    emailjs.init(PUBLIC_KEY);
    
    const templateParams = {
        to_email: CONFIG.NOTIFICATION_EMAIL,
        status: accepted ? '🎉 ACCEPTED! 💕' : '💔 Declined',
        message: accepted 
            ? 'GREAT NEWS! She clicked YES and wants to be your Valentine! 💘 Go celebrate! 🎉❤️'
            : 'Unfortunately, the proposal was declined.',
        time: new Date().toLocaleString()
    };
    
    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('Email sent successfully!', response.status, response.text);
        })
        .catch(function(error) {
            console.log('Email failed to send:', error);
        });
}

// Start the hearts animation
createHearts();

// Add some sparkle to the title
document.querySelector('h1').addEventListener('mouseover', function() {
    this.style.transform = 'scale(1.1)';
});

document.querySelector('h1').addEventListener('mouseout', function() {
    this.style.transform = 'scale(1)';
});
