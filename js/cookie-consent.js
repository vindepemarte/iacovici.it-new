// Cookie Consent Management System - GDPR Compliant
// Iacovici.it by Taxi Pet Erika

class CookieConsent {
    constructor() {
        this.cookieName = 'iacovici_cookie_consent';
        this.cookieExpiry = 365; // giorni
        this.consentGiven = false;
        this.preferences = {
            necessary: true,  // sempre attivo
            analytics: false,
            marketing: false
        };
        
        this.init();
    }

    init() {
        // Carica preferenze esistenti
        this.loadPreferences();
        
        // Se non c'è consenso, mostra il banner
        if (!this.hasConsent()) {
            this.showBanner();
        } else {
            // Applica le preferenze esistenti
            this.applyPreferences();
        }
        
        // Crea il bottone gestione cookie
        this.createManagementButton();
        
        // Event listeners
        this.initEventListeners();
    }

    hasConsent() {
        const consent = this.getCookie(this.cookieName);
        return consent !== null;
    }

    loadPreferences() {
        const consent = this.getCookie(this.cookieName);
        if (consent) {
            try {
                this.preferences = JSON.parse(consent);
                this.consentGiven = true;
            } catch (e) {
                console.error('Errore nel parsing delle preferenze cookie:', e);
            }
        }
    }

    showBanner() {
        // Rimuovi banner esistente se presente
        const existingBanner = document.getElementById('cookie-banner');
        if (existingBanner) {
            existingBanner.remove();
        }

        // Crea il banner
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <div class="cookie-banner-text">
                    <h3>🍪 Gestione Cookie</h3>
                    <p>Utilizziamo cookie per migliorare la tua esperienza sul nostro sito. I cookie necessari sono sempre attivi, mentre puoi scegliere per gli altri.</p>
                </div>
                <div class="cookie-banner-actions">
                    <button class="btn-cookie accept-all">Accetta Tutti</button>
                    <button class="btn-cookie necessary-only">Solo Necessari</button>
                    <button class="btn-cookie customize">Personalizza</button>
                </div>
            </div>
        `;

        // Aggiungi stili inline per garantire visibilità
        this.addBannerStyles();
        
        // Aggiungi al DOM
        document.body.appendChild(banner);
        
        // Animazione di entrata
        setTimeout(() => {
            banner.classList.add('show');
        }, 100);
    }

    showPreferencesModal() {
        // Rimuovi modal esistente se presente
        const existingModal = document.getElementById('cookie-preferences-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'cookie-preferences-modal';
        modal.className = 'cookie-modal';
        modal.innerHTML = `
            <div class="cookie-modal-content">
                <div class="cookie-modal-header">
                    <h2>Preferenze Cookie</h2>
                    <button class="cookie-modal-close">&times;</button>
                </div>
                
                <div class="cookie-modal-body">
                    <p>Gestisci le tue preferenze sui cookie. I cookie necessari sono sempre attivi per il funzionamento del sito.</p>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <h3>Cookie Necessari</h3>
                            <label class="cookie-switch">
                                <input type="checkbox" checked disabled>
                                <span class="cookie-slider"></span>
                            </label>
                        </div>
                        <p>Questi cookie sono essenziali per il funzionamento del sito web e non possono essere disattivati.</p>
                        <div class="cookie-details">
                            <strong>Esempi:</strong> Sessione utente, preferenze tema, consenso cookie
                        </div>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <h3>Cookie Analitici</h3>
                            <label class="cookie-switch">
                                <input type="checkbox" id="analytics-consent" ${this.preferences.analytics ? 'checked' : ''}>
                                <span class="cookie-slider"></span>
                            </label>
                        </div>
                        <p>Ci aiutano a capire come i visitatori interagiscono con il sito web raccogliendo informazioni in forma anonima.</p>
                        <div class="cookie-details">
                            <strong>Servizi:</strong> Google Analytics (se implementato)
                        </div>
                    </div>
                    
                    <div class="cookie-category">
                        <div class="cookie-category-header">
                            <h3>Cookie Marketing</h3>
                            <label class="cookie-switch">
                                <input type="checkbox" id="marketing-consent" ${this.preferences.marketing ? 'checked' : ''}>
                                <span class="cookie-slider"></span>
                            </label>
                        </div>
                        <p>Utilizzati per tracciare i visitatori attraverso i siti web per visualizzare annunci pertinenti e coinvolgenti.</p>
                        <div class="cookie-details">
                            <strong>Servizi:</strong> Facebook Pixel, Google Ads (future implementazioni)
                        </div>
                    </div>
                </div>
                
                <div class="cookie-modal-footer">
                    <button class="btn-cookie secondary" id="cookie-reject-all">Rifiuta Tutti</button>
                    <button class="btn-cookie primary" id="cookie-save-preferences">Salva Preferenze</button>
                </div>
            </div>
        `;

        // Aggiungi stili per il modal
        this.addModalStyles();
        
        document.body.appendChild(modal);
        
        // Mostra il modal
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    createManagementButton() {
        // Crea il bottone flottante per gestire le preferenze
        const button = document.createElement('button');
        button.id = 'cookie-management-btn';
        button.className = 'cookie-management-btn';
        button.innerHTML = '🍪';
        button.title = 'Gestisci Cookie';
        
        // Stili inline
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(139, 92, 246, 0.9);
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        `;
        
        // Hover effect
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
            button.style.background = 'rgba(139, 92, 246, 1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.background = 'rgba(139, 92, 246, 0.9)';
        });
        
        document.body.appendChild(button);
    }

    initEventListeners() {
        // Event delegation per i bottoni del banner
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('accept-all')) {
                this.acceptAll();
            } else if (e.target.classList.contains('necessary-only')) {
                this.acceptNecessaryOnly();
            } else if (e.target.classList.contains('customize')) {
                this.showPreferencesModal();
            } else if (e.target.id === 'cookie-management-btn') {
                this.showPreferencesModal();
            } else if (e.target.classList.contains('cookie-modal-close')) {
                this.closeModal();
            } else if (e.target.id === 'cookie-save-preferences') {
                this.savePreferences();
            } else if (e.target.id === 'cookie-reject-all') {
                this.rejectAll();
            }
        });

        // Chiudi modal cliccando fuori
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cookie-modal')) {
                this.closeModal();
            }
        });

        // Chiudi modal con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    acceptAll() {
        this.preferences = {
            necessary: true,
            analytics: true,
            marketing: true
        };
        this.saveConsent();
        this.hideBanner();
        this.showNotification('Tutte le preferenze cookie sono state accettate', 'success');
    }

    acceptNecessaryOnly() {
        this.preferences = {
            necessary: true,
            analytics: false,
            marketing: false
        };
        this.saveConsent();
        this.hideBanner();
        this.showNotification('Salvate solo le preferenze per i cookie necessari', 'info');
    }

    rejectAll() {
        this.preferences = {
            necessary: true,
            analytics: false,
            marketing: false
        };
        this.saveConsent();
        this.closeModal();
        this.showNotification('Cookie non necessari rifiutati', 'info');
    }

    savePreferences() {
        const analyticsConsent = document.getElementById('analytics-consent');
        const marketingConsent = document.getElementById('marketing-consent');
        
        this.preferences = {
            necessary: true,
            analytics: analyticsConsent ? analyticsConsent.checked : false,
            marketing: marketingConsent ? marketingConsent.checked : false
        };
        
        this.saveConsent();
        this.closeModal();
        this.showNotification('Preferenze cookie salvate con successo', 'success');
    }

    saveConsent() {
        const consentData = JSON.stringify(this.preferences);
        this.setCookie(this.cookieName, consentData, this.cookieExpiry);
        this.consentGiven = true;
        this.applyPreferences();
    }

    applyPreferences() {
        // Applica le preferenze cookie
        if (this.preferences.analytics) {
            this.loadAnalytics();
        } else {
            this.removeAnalytics();
        }
        
        if (this.preferences.marketing) {
            this.loadMarketing();
        } else {
            this.removeMarketing();
        }
        
        // Salva in localStorage per accesso rapido
        localStorage.setItem('cookie_preferences', JSON.stringify(this.preferences));
    }

    loadAnalytics() {
        // Carica Google Analytics se il consenso è dato
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
        
        // Placeholder per implementazione futura
        console.log('Analytics cookie abilitati');
    }

    removeAnalytics() {
        // Rimuovi Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
        
        console.log('Analytics cookie disabilitati');
    }

    loadMarketing() {
        // Placeholder per cookie marketing
        console.log('Marketing cookie abilitati');
    }

    removeMarketing() {
        // Rimuovi cookie marketing
        console.log('Marketing cookie disabilitati');
    }

    hideBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.add('hide');
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }

    closeModal() {
        const modal = document.getElementById('cookie-preferences-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
        document.body.style.overflow = '';
    }

    showNotification(message, type = 'info') {
        // Utilizza il sistema di notifiche esistente se disponibile
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            // Fallback semplice
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#10b981' : '#3b82f6'};
                color: white;
                padding: 1rem;
                border-radius: 8px;
                z-index: 10001;
                font-size: 14px;
                max-width: 300px;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    }

    // Utility functions per gestione cookie
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }

    // Metodi per gestire le preferenze da codice esterno
    getPreferences() {
        return this.preferences;
    }

    hasAnalyticsConsent() {
        return this.preferences.analytics;
    }

    hasMarketingConsent() {
        return this.preferences.marketing;
    }

    revokeConsent() {
        this.deleteCookie(this.cookieName);
        localStorage.removeItem('cookie_preferences');
        this.preferences = {
            necessary: true,
            analytics: false,
            marketing: false
        };
        this.consentGiven = false;
        this.showBanner();
        this.showNotification('Consenso cookie revocato', 'info');
    }

    addBannerStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .cookie-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(15, 23, 42, 0.95);
                backdrop-filter: blur(10px);
                border-top: 1px solid rgba(139, 92, 246, 0.3);
                z-index: 10000;
                transform: translateY(100%);
                transition: transform 0.3s ease-out;
            }
            
            .cookie-banner.show {
                transform: translateY(0);
            }
            
            .cookie-banner.hide {
                transform: translateY(100%);
            }
            
            .cookie-banner-content {
                max-width: 1200px;
                margin: 0 auto;
                padding: 1.5rem;
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 1.5rem;
            }
            
            .cookie-banner-text {
                flex: 1;
                min-width: 300px;
            }
            
            .cookie-banner-text h3 {
                color: #8b5cf6;
                margin: 0 0 0.5rem 0;
                font-size: 1.25rem;
            }
            
            .cookie-banner-text p {
                color: #e2e8f0;
                margin: 0;
                line-height: 1.5;
            }
            
            .cookie-banner-actions {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }
            
            .btn-cookie {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 8px;
                font-size: 0.875rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                white-space: nowrap;
            }
            
            .btn-cookie.accept-all {
                background: #8b5cf6;
                color: white;
            }
            
            .btn-cookie.accept-all:hover {
                background: #7c3aed;
            }
            
            .btn-cookie.necessary-only {
                background: transparent;
                color: #8b5cf6;
                border: 1px solid #8b5cf6;
            }
            
            .btn-cookie.necessary-only:hover {
                background: rgba(139, 92, 246, 0.1);
            }
            
            .btn-cookie.customize {
                background: transparent;
                color: #e2e8f0;
                border: 1px solid #475569;
            }
            
            .btn-cookie.customize:hover {
                background: rgba(71, 85, 105, 0.3);
            }
            
            @media (max-width: 768px) {
                .cookie-banner-content {
                    flex-direction: column;
                    text-align: center;
                }
                
                .cookie-banner-actions {
                    width: 100%;
                    justify-content: center;
                }
                
                .btn-cookie {
                    flex: 1;
                    min-width: 120px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    addModalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .cookie-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .cookie-modal.show {
                opacity: 1;
                visibility: visible;
            }
            
            .cookie-modal-content {
                background: #1e293b;
                border-radius: 16px;
                border: 1px solid rgba(139, 92, 246, 0.3);
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                transform: scale(0.9);
                transition: transform 0.3s ease;
            }
            
            .cookie-modal.show .cookie-modal-content {
                transform: scale(1);
            }
            
            .cookie-modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid rgba(71, 85, 105, 0.3);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .cookie-modal-header h2 {
                color: #8b5cf6;
                margin: 0;
                font-size: 1.5rem;
            }
            
            .cookie-modal-close {
                background: none;
                border: none;
                color: #94a3b8;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .cookie-modal-close:hover {
                background: rgba(71, 85, 105, 0.3);
                color: #e2e8f0;
            }
            
            .cookie-modal-body {
                padding: 1.5rem;
            }
            
            .cookie-modal-body > p {
                color: #e2e8f0;
                margin-bottom: 1.5rem;
                line-height: 1.6;
            }
            
            .cookie-category {
                margin-bottom: 1.5rem;
                padding: 1rem;
                background: rgba(30, 41, 59, 0.5);
                border-radius: 8px;
                border: 1px solid rgba(71, 85, 105, 0.3);
            }
            
            .cookie-category-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 0.5rem;
            }
            
            .cookie-category-header h3 {
                color: #e2e8f0;
                margin: 0;
                font-size: 1.125rem;
            }
            
            .cookie-category p {
                color: #94a3b8;
                margin: 0.5rem 0;
                line-height: 1.5;
                font-size: 0.875rem;
            }
            
            .cookie-details {
                color: #64748b;
                font-size: 0.8rem;
                margin-top: 0.5rem;
            }
            
            .cookie-switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }
            
            .cookie-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .cookie-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #475569;
                transition: 0.4s;
                border-radius: 24px;
            }
            
            .cookie-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: 0.4s;
                border-radius: 50%;
            }
            
            input:checked + .cookie-slider {
                background-color: #8b5cf6;
            }
            
            input:checked + .cookie-slider:before {
                transform: translateX(26px);
            }
            
            input:disabled + .cookie-slider {
                background-color: #8b5cf6;
                cursor: not-allowed;
            }
            
            .cookie-modal-footer {
                padding: 1.5rem;
                border-top: 1px solid rgba(71, 85, 105, 0.3);
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
            }
            
            .btn-cookie.primary {
                background: #8b5cf6;
                color: white;
            }
            
            .btn-cookie.primary:hover {
                background: #7c3aed;
            }
            
            .btn-cookie.secondary {
                background: transparent;
                color: #94a3b8;
                border: 1px solid #475569;
            }
            
            .btn-cookie.secondary:hover {
                background: rgba(71, 85, 105, 0.3);
                color: #e2e8f0;
            }
            
            @media (max-width: 768px) {
                .cookie-modal-content {
                    width: 95%;
                    margin: 1rem;
                }
                
                .cookie-modal-footer {
                    flex-direction: column;
                }
                
                .cookie-category-header {
                    flex-direction: column;
                    align-items: flex-start;
                    gap: 0.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Inizializza il sistema di gestione cookie quando il DOM è pronto
document.addEventListener('DOMContentLoaded', function() {
    window.cookieConsent = new CookieConsent();
});

// Esporta per uso globale
window.CookieConsent = CookieConsent; 