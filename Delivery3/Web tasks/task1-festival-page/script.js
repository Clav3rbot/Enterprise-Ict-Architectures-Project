function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

function showDay(day) {
    document.querySelectorAll('.lineup-day').forEach(dayElement => {
        dayElement.classList.remove('active');
    });
    
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(day).classList.add('active');
    event.target.classList.add('active');
}

function updateCountdown() {
    const festivalDate = new Date('July 15, 2026 12:00:00').getTime();
    const now = new Date().getTime();
    const distance = festivalDate - now;
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = String(days).padStart(3, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    
    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<div class="countdown-content"><p>Festival is Live! 🎉</p></div>';
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

function subscribeNewsletter() {
    const email = document.getElementById('newsletter-email').value;
    if (email && email.includes('@')) {
        alert('Thank you for subscribing! You will receive updates at ' + email);
        document.getElementById('newsletter-email').value = '';
    } else {
        alert('Please enter a valid email address.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const ticketButtons = document.querySelectorAll('.ticket-button');
    ticketButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ticketType = this.parentElement.querySelector('.ticket-type').textContent;
            const ticketPrice = this.parentElement.querySelector('.ticket-price').textContent;
            alert(`You're about to purchase ${ticketType} for ${ticketPrice}!\n\nThis is a demo. In a real scenario, you would be redirected to a payment page.`);
        });
    });
});

let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        return;
    }
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    }
    
    lastScroll = currentScroll;
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.feature, .artist-card, .ticket-card, .gallery-item');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
        observer.observe(element);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.querySelector('.gallery-overlay p').textContent;
            alert(`Viewing: ${text}\n\nIn a full implementation, this would open a lightbox gallery.`);
        });
    });
});

function createParticle() {
    const hero = document.querySelector('.hero');
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = '2px';
    particle.style.height = '2px';
    particle.style.background = 'rgba(255, 255, 255, 0.5)';
    particle.style.borderRadius = '50%';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animation = 'float ' + (Math.random() * 3 + 2) + 's ease-in-out infinite';
    hero.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 5000);
}

setInterval(createParticle, 300);

const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        50% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) translateX(50px);
            opacity: 0;
        }
    }
    
    .navbar {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
`;
document.head.appendChild(style);
