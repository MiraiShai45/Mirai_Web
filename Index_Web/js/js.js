// ========== NAVIGATION MENU TOGGLE ==========
(function() {
    'use strict';
    
    // Initialize navigation menu
    function initializeMenu() {
        const pull = document.getElementById('pull');
        const nav = document.querySelector('.main-nav');
        
        if (!pull || !nav) {
            console.warn('Pull or Nav not found');
            return;
        }
        
        console.log('Menu initialized: pull=', !!pull, 'nav=', !!nav);
        
        // Click on hamburger button
        pull.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            nav.classList.toggle('active');
            console.log('☰ Hamburger clicked - Menu active:', nav.classList.contains('active'));
        });
        
        // Close menu on link click (mobile)
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    nav.classList.remove('active');
                    console.log('✓ Link clicked - Menu closed');
                }
            });
        });
        
        // Close menu on resize to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                nav.classList.remove('active');
            }
        });
        
        // Close menu on outside click (mobile)
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                const isClickOnNav = nav.contains(e.target);
                const isClickOnPull = pull.contains(e.target);
                
                if (!isClickOnNav && !isClickOnPull) {
                    nav.classList.remove('active');
                }
            }
        });
    }
    
    // Execute when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeMenu);
    } else {
        initializeMenu();
    }
})();
// ========== FORM PASSWORD TOGGLE ==========
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
        input.type = input.type === 'password' ? 'text' : 'password';
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('password');
            const confirmPassword = document.getElementById('confirm-password');
            
            if (password && confirmPassword && password.value !== confirmPassword.value) {
                alert('Passwords do not match!');
                return;
            }
            
            alert('Account created successfully!');
        });
    }
});


// ========== INTERSECTION OBSERVERS ==========
document.addEventListener('DOMContentLoaded', function() {
    // Gallery items animation observer
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.gallery-item, .design-post').forEach(item => {
        observer.observe(item);
    });

    // Lazy image loading observer
    const images = document.querySelectorAll('img[data-src]');
    const imageOptions = {
        threshold: 0,
        rootMargin: '0px 0px 50px 0px'
    };

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('fade-in');
                imageObserver.unobserve(img);
            }
        });
    }, imageOptions);

    images.forEach(img => imageObserver.observe(img));
});


// ========== VIDEO MODAL FUNCTIONS ==========
function openVideoModal(element) {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('modalVideo');
    
    if (modal && iframe && element && element.dataset.videoId) {
        const videoId = element.dataset.videoId;
        const title = element.dataset.title || '';
        const description = element.dataset.description || '';
        
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        
        const titleEl = document.getElementById('videoModalTitle');
        const descEl = document.getElementById('videoModalDescription');
        
        if (titleEl) titleEl.textContent = title;
        if (descEl) descEl.textContent = description;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('modalVideo');
    
    if (modal) modal.style.display = 'none';
    if (iframe) iframe.src = '';
    document.body.style.overflow = '';
}


// ========== VIDEO MODAL EVENT LISTENERS ==========
document.addEventListener('DOMContentLoaded', function() {
    const videoModal = document.getElementById('videoModal');
    
    if (videoModal) {
        // Close button handler
        const closeButtons = videoModal.querySelectorAll('.close, .modal-close, .close-video');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                closeVideoModal();
            });
        });
        
        // Click outside modal closes it
        window.addEventListener('click', function(event) {
            if (event.target === videoModal) {
                closeVideoModal();
            }
        });
        
        // Escape key closes modal
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && videoModal.style.display === 'block') {
                closeVideoModal();
            }
        });
    }
});



// ========== GALLERY MODAL ==========
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('galleryModal');
    if (!modal) return;
    
    const modalImg = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalDate = document.getElementById('modalDate');
    const modalTags = document.getElementById('modalTags');
    let currentIndex = 0;
    let galleryItems = [];

    // Collect gallery items
    document.querySelectorAll('.design-image-container').forEach((container, index) => {
        const post = container.closest('.design-post');
        if (post) {
            const img = container.querySelector('img');
            const header = post.querySelector('.design-header h3');
            const desc = post.querySelector('.design-description p');
            const date = post.querySelector('.design-date');
            const tags = post.querySelector('.design-tags');
            
            galleryItems.push({
                img: img ? img.src : '',
                title: header ? header.textContent : '',
                desc: desc ? desc.textContent : '',
                date: date ? date.textContent : '',
                tags: tags ? tags.innerHTML : ''
            });

            container.addEventListener('click', function() {
                currentIndex = index;
                openGalleryModal(currentIndex);
            });
        }
    });

    function openGalleryModal(index) {
        if (index < 0 || index >= galleryItems.length) return;
        
        const item = galleryItems[index];
        if (modalImg) modalImg.src = item.img;
        if (modalTitle) modalTitle.textContent = item.title;
        if (modalDesc) modalDesc.textContent = item.desc;
        if (modalDate) modalDate.textContent = item.date;
        if (modalTags) modalTags.innerHTML = item.tags;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    function closeGalleryModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // Navigation buttons
    const prevBtn = modal.querySelector('.prev-btn');
    const nextBtn = modal.querySelector('.next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            openGalleryModal(currentIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % galleryItems.length;
            openGalleryModal(currentIndex);
        });
    }

    // Close button
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeGalleryModal);
    }

    // Click outside modal
    modal.addEventListener('click', function(e) {
        if (e.target === modal) closeGalleryModal();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') closeGalleryModal();
            if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
            if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
        }
    });
});




