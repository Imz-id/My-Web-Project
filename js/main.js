// ==============================
// MAIN JAVASCRIPT LOGIC
// ==============================

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadConfig();
    initNavbar();
    
    // Cek halaman yang sedang aktif untuk menjalankan script spesifik
    const path = window.location.pathname;
    
    if (path.includes('tools.html')) {
        initTools();
    } else if (path.includes('documentation.html')) {
        initDocs();
    }
});

// --- THEME MANAGEMENT (DARK/LIGHT MODE) ---
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if(!themeToggle) return;

    // Cek localStorage
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme, themeToggle);

    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        let newTheme = theme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme, themeToggle);
    });
}

function updateThemeIcon(theme, button) {
    button.textContent = theme === 'dark' ? '☀' : '☾';
}

// --- APPLY CONFIGURATION ---
function loadConfig() {
    if (typeof siteConfig === 'undefined') return;

    // Update Logo Teks
    const logoText = document.getElementById('site-logo-text');
    if (logoText) logoText.textContent = siteConfig.siteName;

    // Update Logo Image
    const logoImg = document.getElementById('site-logo-img');
    if (logoImg) {
        logoImg.src = siteConfig.logo;
        // Fallback jika gambar error
        logoImg.onerror = function() { this.style.display = 'none'; };
    }

    // Update Footer Year & Name
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
    
    const footerNameEl = document.getElementById('footer-name');
    if (footerNameEl) footerNameEl.textContent = siteConfig.authorName || siteConfig.siteName;

    // Hero Section (Home)
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) heroTitle.textContent = siteConfig.siteName;

    const heroSubtitle = document.getElementById('hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = siteConfig.tagline;

    const homeHero = document.getElementById('home-hero');
    if (homeHero && siteConfig.backgrounds.home) {
        homeHero.style.backgroundImage = `url('${siteConfig.backgrounds.home}')`;
    }

    // About Page
    const aboutTitle = document.getElementById('about-title');
    if (aboutTitle) aboutTitle.textContent = siteConfig.siteName;
    
    const aboutDesc = document.getElementById('about-description');
    if (aboutDesc) aboutDesc.textContent = siteConfig.description;

    const socialContainer = document.getElementById('social-links');
    if (socialContainer && siteConfig.socials) {
        siteConfig.socials.forEach(social => {
            const btn = document.createElement('a');
            btn.href = social.url;
            btn.textContent = social.name;
            btn.className = 'social-btn';
            btn.target = '_blank';
            socialContainer.appendChild(btn);
        });
    }
}

// --- NAVBAR MOBILE (HAMBURGER) ---
function initNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if(hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

// --- TOOLS PAGE LOGIC ---
function initTools() {
    if (typeof toolsData === 'undefined') return;
    
    const grid = document.getElementById('tools-grid');
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');
    const noResults = document.getElementById('no-results');

    renderTools(toolsData, grid);

    // Search Logic
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        clearBtn.style.display = query.length > 0 ? 'block' : 'none';
        
        const filtered = toolsData.filter(tool => 
            tool.name.toLowerCase().includes(query) || 
            tool.description.toLowerCase().includes(query)
        );

        renderTools(filtered, grid);
        noResults.classList.toggle('hidden', filtered.length > 0);
    });

    // Clear Search
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        renderTools(toolsData, grid);
        noResults.classList.add('hidden');
    });
}

function renderTools(data, container) {
    container.innerHTML = '';
    data.forEach(tool => {
        const a = document.createElement('a');
        a.href = tool.url;
        a.target = tool.target || '_self';
        a.className = 'tool-card';
        
        a.innerHTML = `
            <div class="tool-info">
                <span class="tool-name">${tool.name}</span>
                <span class="tool-desc">${tool.description}</span>
            </div>
            <span class="tool-icon-arrow">↗</span>
        `;
        container.appendChild(a);
    });
}

// --- DOCUMENTATION PAGE LOGIC ---
function initDocs() {
    if (typeof docsData === 'undefined') return;
    
    const grid = document.getElementById('docs-grid');
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');
    const noResults = document.getElementById('no-results');

    renderDocs(docsData, grid);

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        clearBtn.style.display = query.length > 0 ? 'block' : 'none';
        
        const filtered = docsData.filter(doc => 
            doc.title.toLowerCase().includes(query) || 
            doc.category.toLowerCase().includes(query) ||
            doc.description.toLowerCase().includes(query)
        );

        renderDocs(filtered, grid);
        noResults.classList.toggle('hidden', filtered.length > 0);
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        renderDocs(docsData, grid);
        noResults.classList.add('hidden');
    });
}

function renderDocs(data, container) {
    container.innerHTML = '';
    data.forEach(doc => {
        const a = document.createElement('a');
        a.href = doc.url;
        a.className = 'doc-card';
        
        a.innerHTML = `
            <img src="${doc.image}" alt="${doc.title}" class="doc-image" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZmlsbD0iI2ZmZiIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'">
            <div class="doc-content">
                <span class="doc-category">${doc.category}</span>
                <h3 class="doc-title">${doc.title}</h3>
                <p class="doc-desc">${doc.description}</p>
            </div>
        `;
        container.appendChild(a);
    });
}
