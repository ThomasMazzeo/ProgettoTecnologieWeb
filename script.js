document.addEventListener('DOMContentLoaded', () => {

    
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    
    const starsContainer = document.getElementById('stars-container');

    for (let i = 0; i < 25; i++) {
        const star = document.createElement('div');
        star.classList.add('shooting-star');

        const left = Math.random() * 120 - 20;
        const top = Math.random() * 120 - 20;

        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 6;
        const scale = Math.random() * 0.7 + 0.5;

        star.style.left = `${left}vw`;
        star.style.top = `${top}vh`;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${delay}s`;
        star.style.setProperty('--star-scale', scale);

        starsContainer.appendChild(star);
    }

    
    const btnNo = document.getElementById('btn-no');

    function muoviBottone(e) {
        if(e && e.type === 'touchstart') {
            e.preventDefault(); 
        }

        
        const rect = btnNo.getBoundingClientRect();
        const currentX = rect.left;
        const currentY = rect.top;

        
        btnNo.style.position = 'fixed';

        
        const distance = Math.random() * 200 + 80;

        
        const angle = Math.random() * Math.PI * 2;

       
        let newX = currentX + (Math.cos(angle) * distance);
        let newY = currentY + (Math.sin(angle) * distance);

        
        newX = Math.max(10, Math.min(newX, window.innerWidth - btnNo.offsetWidth - 20));
        newY = Math.max(10, Math.min(newY, window.innerHeight - btnNo.offsetHeight - 20));

        
        btnNo.style.left = `${newX}px`;
        btnNo.style.top = `${newY}px`;
    }

    
    btnNo.addEventListener('mouseover', muoviBottone);
    
    btnNo.addEventListener('touchstart', muoviBottone, {passive: false});

   
    const btnYes = document.getElementById('btn-yes');
    const nextButtons = document.querySelectorAll('.next-btn');

    let scelteSerata = { data: '', ora: '', cibo: '', luogo: '' };

    function goToStep(currentStepId, nextStepId) {
        document.getElementById(currentStepId).classList.remove('active');
        document.getElementById(currentStepId).classList.add('hidden');

        document.getElementById(nextStepId).classList.remove('hidden');
        document.getElementById(nextStepId).classList.add('active');
    }

    btnYes.addEventListener('click', () => {
        btnNo.style.position = 'static';
        goToStep('step-1', 'step-2');
    });

    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = this.closest('.step-section').id;
            const nextStep = this.getAttribute('data-next');

            if(currentStep === 'step-3') {
                const date = document.getElementById('date-picker').value;
                const time = document.getElementById('time-picker').value;
                if(!date || !time) {
                    alert("Prima inserisci un giorno ed un ora! 🥺");
                    return;
                }
                scelteSerata.data = date;
                scelteSerata.ora = time;
            }

            if(currentStep === 'step-4') {
                const selectedFood = document.querySelector('.food-item.selected');
                if(!selectedFood) {
                    alert("Scegli cosa mangiare prima! 🍔");
                    return;
                }
                scelteSerata.cibo = selectedFood.innerText;
            }

            if(currentStep === 'step-5') {
                scelteSerata.luogo = this.getAttribute('data-choice');

                // === INSERISCI QUI IL TUO LINK FORMSPREE ===
                fetch("INSERISCI_QUI_IL_TUO_LINK_FORMSPREE", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify(scelteSerata)
                })
                    .then(response => console.log("Email inviata!"))
                    .catch(error => console.log("Errore", error));
            }

            goToStep(currentStep, nextStep);
        });
    });

    
    const foodItems = document.querySelectorAll('.food-item');
    foodItems.forEach(item => {
        item.addEventListener('click', function() {
            foodItems.forEach(f => f.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    
    if (!isTouchDevice) {
        const customCursor = document.getElementById('custom-cursor');
        let lastTime = 0;

        document.addEventListener('mousemove', function(e) {
            customCursor.style.left = e.clientX + 'px';
            customCursor.style.top = e.clientY + 'px';

            const now = Date.now();
            if (now - lastTime < 25) return;
            lastTime = now;

            const numParticles = 2;
            for(let i = 0; i < numParticles; i++) {
                const particle = document.createElement('div');
                particle.classList.add('cursor-particle');

                particle.style.left = e.pageX + 'px';
                particle.style.top = e.pageY + 'px';

                const moveX = (Math.random() - 0.5) * 50;
                const moveY = Math.random() * 60 + 20;

                particle.style.setProperty('--move-x', `${moveX}px`);
                particle.style.setProperty('--move-y', `${moveY}px`);

                const colors = ['#ffffff', '#ffb6c1', '#ff9aa2', '#ffd700'];
                const color = colors[Math.floor(Math.random() * colors.length)];

                const size = Math.random() * 5 + 4;

                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.background = color;
                particle.style.boxShadow = `0 0 8px ${color}, 0 0 15px ${color}`;

                document.body.appendChild(particle);

                setTimeout(() => { particle.remove(); }, 800);
            }
        });

        const clickableElements = document.querySelectorAll('.btn, .food-item, input, select');
        clickableElements.forEach(el => {
            el.addEventListener('mouseenter', () => customCursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => customCursor.classList.remove('hovering'));
        });
    }

});
