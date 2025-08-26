// Lösenordsskydd konfiguration
const PASSWORD_CONFIG = {
    CORRECT_PASSWORD: 'solida123',
    MAX_ATTEMPTS: 3,
    SESSION_KEY: 'solida_auth_session'
};

class PasswordProtection {
    constructor() {
        console.log('🔐 PasswordProtection konstruktor startar...');
        
        // Hitta alla nödvändiga DOM-element
        this.passwordOverlay = document.getElementById('password-overlay');
        this.passwordForm = document.getElementById('password-form');
        this.passwordInput = document.getElementById('password-input');
        this.passwordError = document.getElementById('password-error');
        this.mainApp = document.getElementById('mainContainer');
        
        // Debug: Logga alla element
        console.log('📋 DOM-element kontroll:');
        console.log('  passwordOverlay:', this.passwordOverlay);
        console.log('  passwordForm:', this.passwordForm);
        console.log('  passwordInput:', this.passwordInput);
        console.log('  passwordError:', this.passwordError);
        console.log('  mainApp:', this.mainApp);
        
        // Kontrollera att alla element finns
        const missingElements = [];
        if (!this.passwordOverlay) missingElements.push('password-overlay');
        if (!this.passwordForm) missingElements.push('password-form');
        if (!this.passwordInput) missingElements.push('password-input');
        if (!this.passwordError) missingElements.push('password-error');
        if (!this.mainApp) missingElements.push('mainContainer');
        
        if (missingElements.length > 0) {
            console.error('❌ Saknade DOM-element:', missingElements);
            return;
        } else {
            console.log('✅ Alla nödvändiga DOM-element hittades');
        }
        
        // Försöksräknare
        this.attempts = 0;
        this.isLocked = false;
        
        console.log('🚀 Initialiserar lösenordsskydd...');
        this.initializePasswordProtection();
    }
    
    initializePasswordProtection() {
        console.log('🔍 Kontrollerar befintlig session...');
        
        // Kontrollera om användaren redan är inloggad
        const hasExistingSession = this.checkExistingSession();
        console.log('📊 Befintlig session:', hasExistingSession);
        
        if (hasExistingSession) {
            console.log('✅ Giltig session hittad - ger åtkomst automatiskt');
            this.grantAccess();
            return;
        } else {
            console.log('❌ Ingen giltig session - visar lösenordsskärm');
        }
        
        // Lyssna på formulärinlämning
        this.passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validatePassword();
        });
        
        // Lyssna på Enter-tangent i lösenordsfältet
        this.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.validatePassword();
            }
        });
        
        // Fokusera på lösenordsfältet när sidan laddas
        setTimeout(() => {
            this.passwordInput.focus();
        }, 500);
    }
    
    checkExistingSession() {
        console.log('🔎 checkExistingSession() körs...');
        
        // NYTT: Rensa session vid varje ny flik/fönster för säkerhet
        console.log('🔒 Rensar sessions för säkerhet - kräver nytt lösenord');
        localStorage.removeItem(PASSWORD_CONFIG.SESSION_KEY);
        return false;
    }
    
    validatePassword() {
        if (this.isLocked) return;
        
        const enteredPassword = this.passwordInput.value;
        
        if (enteredPassword === PASSWORD_CONFIG.CORRECT_PASSWORD) {
            // Spara session i localStorage
            this.saveSession();
            this.grantAccess();
        } else {
            this.attempts++;
            this.showError();
            
            if (this.attempts >= PASSWORD_CONFIG.MAX_ATTEMPTS) {
                this.lockPassword();
            }
        }
    }
    
    saveSession() {
        try {
            const sessionData = {
                authenticated: true,
                password: PASSWORD_CONFIG.CORRECT_PASSWORD,
                timestamp: Date.now()
            };
            localStorage.setItem(PASSWORD_CONFIG.SESSION_KEY, JSON.stringify(sessionData));
        } catch (error) {
            console.warn('Kunde inte spara session:', error);
        }
    }
    
    grantAccess() {
        console.log('🚪 grantAccess() körs - ger användaren åtkomst...');
        
        // Dölj lösenordsskärm med animering
        console.log('🎭 Animerar bort lösenordsskärm...');
        this.passwordOverlay.style.animation = 'fadeOut 0.5s ease-out';
        
        setTimeout(() => {
            console.log('⏰ setTimeout i grantAccess körs (efter 500ms)...');
            
            this.passwordOverlay.style.display = 'none';
            this.mainApp.style.display = 'block';
            this.mainApp.style.animation = 'fadeIn 0.5s ease-out';
            
            console.log('👁️ Visibility ändrat:');
            console.log('  - passwordOverlay display:', this.passwordOverlay.style.display);
            console.log('  - mainApp display:', this.mainApp.style.display);
            
            // Initialisera QuoteCalculator efter framgångsrik inloggning
            console.log('🚀 Initialiserar huvudapplikation...');
            if (window.quoteCalculator) {
                window.quoteCalculator.init();
            } else {
                window.quoteCalculator = new QuoteCalculator();
            }
        }, 500);
    }
    
    showError() {
        let errorMessage = `Fel lösenord, försök igen (${this.attempts} av ${PASSWORD_CONFIG.MAX_ATTEMPTS} försök)`;
        
        if (this.attempts >= PASSWORD_CONFIG.MAX_ATTEMPTS) {
            errorMessage = `För många felaktiga försök. Klicka på "Försök igen" för att återställa.`;
        }
        
        this.passwordError.textContent = errorMessage;
        this.passwordError.style.display = 'block';
        this.passwordInput.value = '';
        
        if (!this.isLocked) {
            this.passwordInput.focus();
        }
    }
    
    lockPassword() {
        this.isLocked = true;
        this.passwordInput.disabled = true;
        
        // Kontrollera om reset-knappen redan finns
        let resetButton = document.getElementById('password-reset-btn');
        if (resetButton) {
            resetButton.remove();
        }
        
        // Skapa "Försök igen" knapp
        resetButton = document.createElement('button');
        resetButton.textContent = 'Försök igen';
        resetButton.id = 'password-reset-btn';
        resetButton.style.cssText = `
            background: #6c757d;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            margin-top: 1rem;
            display: block;
            width: 100%;
            transition: background-color 0.3s ease;
        `;
        
        resetButton.addEventListener('mouseenter', () => {
            resetButton.style.backgroundColor = '#5a6268';
        });
        
        resetButton.addEventListener('mouseleave', () => {
            resetButton.style.backgroundColor = '#6c757d';
        });
        
        resetButton.addEventListener('click', () => {
            this.resetPassword();
        });
        
        // Lägg till knappen efter lösenordsfältet
        this.passwordInput.parentNode.appendChild(resetButton);
    }
    
    resetPassword() {
        this.attempts = 0;
        this.isLocked = false;
        this.passwordInput.disabled = false;
        this.passwordError.style.display = 'none';
        this.passwordInput.focus();
        
        // Ta bort resetknappen
        const resetButton = document.getElementById('password-reset-btn');
        if (resetButton) {
            resetButton.remove();
        }
    }
    
    resetApp() {
        console.log('🔄 Nollställer hela applikationen...');
        
        // Rensa alla textinput-fält med KORREKTA ID:n
        const textInputs = [
            'customer-company', 'customer-contact', 'customer-address', 'customer-phone', 
            'customer-email', 'customer-city', 'customer-postal-code', 'customer-fastighetsbeteckning',
            'fp_antal_fonster', 'fp_antal_rutor'
        ];
        
        console.log('📝 Rensar text/number input-fält...');
        let clearedFields = 0;
        textInputs.forEach(id => {
            const field = document.getElementById(id);
            if (field) {
                field.value = '';
                clearedFields++;
            }
        });
        console.log(`✅ ${clearedFields} textfält rensade`);
        
        // Rensa alla select-fält
        const selectInputs = [
            'bostadstyp', 'stadfrekvens', 'fp_fastighet', 'fp_fonstertyp', 'fp_antal_sidor',
            'access-method', 'pets', 'parking', 'preferred-day', 'preferred-time'
        ];
        
        console.log('📋 Rensar select-fält...');
        let clearedSelects = 0;
        selectInputs.forEach(id => {
            const field = document.getElementById(id);
            if (field) {
                field.selectedIndex = 0;
                clearedSelects++;
            }
        });
        console.log(`✅ ${clearedSelects} select-fält rensade`);
        
        // Rensa textarea-fält
        const textareas = ['allergies'];
        textareas.forEach(id => {
            const field = document.getElementById(id);
            if (field) {
                field.value = '';
            }
        });
        
        // Rensa date-fält
        const dateFields = ['start-date'];
        dateFields.forEach(id => {
            const field = document.getElementById(id);
            if (field) {
                field.value = '';
            }
        });
        
        // Avmarkera alla checkboxes
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        console.log(`☑️  Rensar ${checkboxes.length} checkboxes...`);
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Sätt första radio button som vald för alla radio-grupper
        const radioGroups = ['fp_oppning', 'fp_sprojs', 'fp_sprojs_typ', 'fp_rengoring', 'fp_karmar', 'fp_stege', 'fp_skylift'];
        radioGroups.forEach(groupName => {
            const radios = document.querySelectorAll(`input[name="${groupName}"]`);
            radios.forEach(radio => radio.checked = false);
        });
        
        // Dölj fönsterputs-tillägg
        const fonsterpputsTillagg = document.getElementById('fonsterputs-tillagg');
        if (fonsterpputsTillagg) {
            fonsterpputsTillagg.style.display = 'none';
        }
        
        // Dölj hemstädning schema
        const hemstadningSchema = document.getElementById('hemstadning-schema');
        if (hemstadningSchema) {
            hemstadningSchema.style.display = 'none';
        }
        
        // Nollställ alla priser
        this.resetAllPriceDisplays();
        
        console.log('✅ Applikationen nollställd framgångsrikt');
    }
    
    resetAllPriceDisplays() {
        const priceIds = [
            'stad-grundpris', 'stad-tillagg', 'stad-total', 'stad-rut-pris',
            'fonsterputs-price', 'stadtjanster_cost', 'stadtjanster_tillagg_cost', 'total_stad_price'
        ];
        
        priceIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '0 kr';
            }
        });
        
        // Dölj prisdisplays
        const priceDisplays = ['stad-price-display', 'fonsterputs-price-display'];
        priceDisplays.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none';
            }
        });
    }
    
    initializeMainApplication() {
        console.log('🚀 initializeMainApplication() startar...');
        
        // Kontrollera att alla nödvändiga element finns
        const requiredElements = [
            'quote-form',
            'objektets_forutsattningar_cost',
            'fonsterinformation_cost',
            'tillagg_cost',
            'submit-btn'
        ];
        
        console.log('🔍 Kontrollerar nödvändiga element...');
        console.log('📋 Söker efter element:', requiredElements);
        
        // Detaljerad kontroll av varje element
        requiredElements.forEach(id => {
            const element = document.getElementById(id);
            console.log(`  - ${id}: ${element ? '✅ HITTAT' : '❌ SAKNAS'}`);
            if (!element) {
                console.log(`    🔍 Sökning efter '${id}':`, document.querySelectorAll(`#${id}, [id*="${id}"], [name="${id}"]`));
            }
        });
        
        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
            console.error('❌ KRITISKA ELEMENT SAKNAS:', missingElements);
            console.log('🔍 Alla form-element:', document.querySelectorAll('form'));
            console.log('🔍 Alla input-element:', document.querySelectorAll('input'));
            console.log('🔍 Alla element med ID:', document.querySelectorAll('[id]'));
            console.log('🔍 mainContainer innehåll:', this.mainApp ? this.mainApp.innerHTML.substring(0, 500) + '...' : 'mainContainer saknas');
            
            setTimeout(() => {
                console.log('⏰ Försöker igen efter 1 sekund...');
                this.initializeMainApplication();
            }, 1000);
            return;
        }
        
        console.log('✅ Alla nödvändiga element hittades');
        
        try {
            // Initialisera kalkylatorn
            console.log('🧮 Skapar QuoteCalculator...');
            window.calculator = new QuoteCalculator();
            console.log('✅ QuoteCalculator initialiserad');
            
            // Initialisera tema-toggle
            console.log('🎨 Skapar ThemeToggle...');
            window.themeToggle = new ThemeToggle();
            console.log('✅ ThemeToggle initialiserad');
            
            // Initialisera AdditionalServiceManager
            console.log('📝 Skapar AdditionalServiceManager...');
            window.additionalServiceManager = new AdditionalServiceManager();
            console.log('✅ AdditionalServiceManager initialiserad');
            
            // Visa navigation bar
            this.showNavigationBar();
            
            console.log('🎉 Hela applikationen framgångsrikt initialiserad!');
            
        } catch (error) {
            console.error('❌ Fel vid initialisering av huvudapplikation:', error);
            console.log('📊 Error stack:', error.stack);
        }
    }
    
    logout() {
        console.log('👋 Loggar ut användaren...');
        
        // Rensa sessionsdata
        sessionStorage.removeItem('solidaPassword');
        localStorage.removeItem('solidaPassword');
        
        // Nollställ appen
        if (window.quoteCalculator) {
            window.quoteCalculator.resetApp();
        }
        
        // Dölj navigation bar
        this.hideNavigationBar();
        
        // Visa lösenordsskärmen igen
        this.passwordOverlay.style.display = 'flex';
        this.mainContainer.style.display = 'none';
        
        // Rensa lösenordsfältet
        this.passwordInput.value = '';
        this.passwordInput.focus();
        
        // Återställ antal försök
        this.attempts = 0;
        
        console.log('✅ Användaren är utloggad');
    }
    
    showNavigationBar() {
        const navigationBar = document.querySelector('.navigation-bar');
        if (navigationBar) {
            navigationBar.classList.add('visible');
            console.log('✅ Navigation bar visas');
        } else {
            console.warn('⚠️ Navigation bar hittades inte');
        }
    }
    
    hideNavigationBar() {
        const navigationBar = document.querySelector('.navigation-bar');
        if (navigationBar) {
            navigationBar.classList.remove('visible');
            console.log('✅ Navigation bar dold');
        } else {
            console.warn('⚠️ Navigation bar hittades inte');
        }
    }
}

class ThemeToggle {
    constructor() {
        this.init();
    }

    init() {
        this.cleanup();
        this.setupThemeToggle();
        this.loadSavedTheme();
        window.currentThemeToggleInstance = this;
    }

    cleanup() {
        if (window.currentThemeToggleInstance && window.currentThemeToggleInstance.themeToggle) {
            const oldToggle = window.currentThemeToggleInstance.themeToggle;
            const oldHandler = window.currentThemeToggleInstance.handleToggleClick;
            if (oldToggle && oldHandler) {
                oldToggle.removeEventListener('click', oldHandler);
            }
        }
    }

    setupThemeToggle() {
        this.themeToggle = document.getElementById('theme-toggle');
        if (this.themeToggle) {
            this.handleToggleClick = () => this.toggleTheme();
            this.themeToggle.addEventListener('click', this.handleToggleClick);
        }
    }

    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme');
        const isDark = savedTheme === 'dark';
        
        if (isDark) {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            document.body.setAttribute('data-theme', 'light');
        }
        
        // Update theme icons
        const lightIcon = document.querySelector('.theme-icon-light');
        const darkIcon = document.querySelector('.theme-icon-dark');
        
        if (lightIcon && darkIcon) {
            if (isDark) {
                lightIcon.style.display = 'none';
                darkIcon.style.display = 'block';
            } else {
                lightIcon.style.display = 'block';
                darkIcon.style.display = 'none';
            }
        }
    }

    toggleTheme() {
        console.log('🎨 Theme toggle klickad');
        const currentTheme = document.body.getAttribute('data-theme');
        const isDark = currentTheme === 'light';
        document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        console.log(`🎨 Tema ändrat till: ${isDark ? 'mörkt' : 'ljust'}`);
        
        // Update theme icons
        const lightIcon = document.querySelector('.theme-icon-light');
        const darkIcon = document.querySelector('.theme-icon-dark');
        
        if (lightIcon && darkIcon) {
            if (isDark) {
                lightIcon.style.display = 'none';
                darkIcon.style.display = 'block';
            } else {
                lightIcon.style.display = 'block';
                darkIcon.style.display = 'none';
            }
            console.log('✅ Theme ikoner uppdaterade');
        } else {
            console.warn('⚠️ Theme ikoner hittades inte');
        }
    }
}

const CONFIG = {
    // Fönsterputs-priser (exkl moms)
    WINDOW_PRICING: {
        // Antal våningar
        FLOORS: {
            1: 0,
            2: 200,
            3: 400,
            4: 600
        },
        // Åtkomst
        ACCESS: {
            'Lättåtkomliga': 0,
            'Viss åtkomst med stege': 250,
            'Kräver lift eller annan specialutrustning': 1200
        },
        // Antal fönster (fast pris per intervall)
        WINDOW_COUNT: {
            '1-10': 400,
            '11-20': 760,
            '21-30': 1140,
            '31-40': 1520,
            '41-50': 1900,
            'over_50_per_window': 38
        },
        // Fönstertyp tillägg per fönster
        WINDOW_TYPE: {
            'spröjs': 12,
            'fasta fönster': -5,
            'öppningsbara': 10
        },
        // Övriga tillägg
        EXTRAS: {
            'inglasad_balkong': 500,
            'kallarfonster_0_5': 120,
            'kallarfonster_6_10': 220,
            'kallarfonster_11_plus': 320,
            'invandig_puts_per_window': 35
        },
        // Regelbunden putsning rabatter
        REGULAR_CLEANING: {
            'Enstaka tillfälle': 0,
            'Var 8:e vecka': -0.10,    // 10% rabatt
            'Var 4:e vecka': -0.20     // 20% rabatt
        }
    },

    // Städtjänster-priser (exkl moms)
    CLEANING_PRICING: {
        // Grundpriser baserat på bostadstyp och frekvens
        BASE_PRICES: {
            '1a_30kvm': {
                'varje_vecka': 450,
                'varannan_vecka': 500,
                'varje_manad': 600,
                'endast_denna_gang': 700
            },
            '1a_40kvm': {
                'varje_vecka': 550,
                'varannan_vecka': 600,
                'varje_manad': 750,
                'endast_denna_gang': 900
            },
            '2a_50kvm': {
                'varje_vecka': 650,
                'varannan_vecka': 700,
                'varje_manad': 850,
                'endast_denna_gang': 1000
            },
            '2a_60kvm': {
                'varje_vecka': 800,
                'varannan_vecka': 850,
                'varje_manad': 1050,
                'endast_denna_gang': 1250
            },
            '3a_70kvm': {
                'varje_vecka': 900,
                'varannan_vecka': 950,
                'varje_manad': 1200,
                'endast_denna_gang': 1400
            },
            '4a_90kvm': {
                'varje_vecka': 1125,
                'varannan_vecka': 1250,
                'varje_manad': 1500,
                'endast_denna_gang': 1800
            },
            'enplansvilla_100kvm': {
                'varje_vecka': 1200,
                'varannan_vecka': 1500,
                'varje_manad': 1800,
                'endast_denna_gang': 2200
            },
            'tvåplansvilla_140kvm': {
                'varje_vecka': 1575,
                'varannan_vecka': 1800,
                'varje_manad': 2100,
                'endast_denna_gang': 2500
            }
        },
        
        // Tilläggstjänster
        SERVICES: {
            'hemstadning': 0,        // Ingen extra kostnad (ingår i grundpris)
            'storstadning': 800,     // +800kr tillägg
            'flyttstadning': 1200,   // +1200kr tillägg
            'visningsstadning': 600, // +600kr tillägg
            'kontorsstadning': 1000  // +1000kr tillägg
        },

        // Detaljerade beskrivningar för arbetsbeskrivning
        SERVICE_DESCRIPTIONS: {
            'hemstadning': {
                'title': 'HEMSTÄDNING - VAD SOM INGÅR',
                'content': `
• SOVRUM, VARDAGSRUM, ARBETSRUM:
  - Dammtorkar vågräta ytor
  - Dammsuger mattor, golv och golvlister
  - Avfläckning av luckor, kontakter, lampknappar, foder, lister, dörrar och dörrhandtag
  - Putsning av speglar
  - Tömning av papperskorgar (brännbart och komposterbart)
  - Dammtorkar tavelramar och lampor
  - Avfläckning och moppning av golv

• KÖK OCH MATPLATS:
  Samma punkter som i listan ovan och dessutom:
  - Rengöring av kakel/stänkskydd över diskbänk
  - Rengöring av spisen utvändigt
  - Rengöring av micro in- och utvändigt
  - Avtorkning av hushållsmaskiner
  - Avtorkning av kyl och frys utvändigt
  - Rengöring av sopkärl
  - Avtorkning av matsalsbord och stolar
  - Rengöring av diskho, diskbänk och blandare

• BADRUM OCH TOALETTER:
  Samma punkter som i listan högst upp och dessutom:
  - Rengöring av badkar och duschutrymme
  - Borttagning av fläckar på badrumsmöbler
  - Rengöring av hängare och handdukstork
  - Rengöring av handfat utsida/insida
  - Rengöring av toalett utsida/insida

• TVÄTTSTUGA OCH GROVENTRÉ:
  - Dammtorkning, dammsugning och moppning av fria ytor`
            },
            'storstadning': {
                'title': 'STORSTÄDNING - VAD SOM INGÅR',
                'content': `
• BOSTADSRUM:
  - Dammtorkar vågräta ytor, även ovanpå skåp
  - Dammsuger textilmöbler, mattor, golv samt golvlister
  - Avtorkning av luckor, element, takventiler, kontakter, lampknappar, foder, karmar, lister, dörrar och dörrhandtag
  - Putsning av speglar
  - Tömning av papperskorgar (brännbart samt komposterbart)
  - Dammtorkar tavelramar och lampor
  - Avfläckning och moppning av golv

• KÖK OCH MATPLATS:
  Samma som punkterna ovan och även:
  - Rengöring av kakel över diskbänk
  - Rengöring av spisfläkt/fläktkåpan, filter och skyddsglas
  - Rengöring av micro, ugn och spis in- och utvändigt
  - Avtorkning av hushållsmaskiner
  - Avtorkning av kyl/frys/disk utvändigt
  - Rengöring av sopkärl
  - Avtorkning av matsalsbord samt stolar
  - Rengöring av diskho, diskbänk och blandare

• BADRUM OCH TOALETTER:
  Samma som punkterna under bostadsrum och även:
  - Rengöring av badkar och duschutrymme
  - Avkalkning av golv/vägg/duschväggar
  - Rengöring av golvbrunnar
  - Rengöring av väggar och synliga rör
  - Utvändig rengöring av badrumsmöbler
  - Rengöring av handfat utsida/insida
  - Rengöring av toalett utsida/insida

• TVÄTTSTUGA OCH GROVENTRÉ:
  - Dammtorkning, dammsugning, avtorkning och moppning av fria ytor
  - Dammtorkning ovanpå tvättmaskin/torktumlare, avtorkning av maskinerna utvändigt
  - Rengöring av tvättmedelsfack
  - Rengöring av filter i torktumlaren
  - Rengöring av diskbänk, diskho och blandare`
            },
            'flyttstadning': {
                'title': 'FLYTTSTÄDNING - VAD SOM INGÅR',
                'content': `
• KÖK OCH MATPLATS:
  - Damma av väggar och tak
  - Rengör köksfläkt, spis, ugn, plåtar
  - Rengör bakom spisen
  - Rengör kyl-/frys in- och utvändigt
  - Rengör bakom kylskåp/frys
  - Rengör diskmaskin in- och utvändigt
  - Torka ur alla skåp och lådor
  - Torka ovanpå och under alla skåp
  - Torka alla skåpsluckor/lådfronter
  - Rengör diskho och blandare
  - Rengör avlastnings- och arbetsytor
  - Rengör ev. fasta takarmaturer
  - Rengör element, även bakom
  - Torka av golvlister och socklar
  - Dammsug och torka golv
  - Torka av dörr, dörrkarm och handtag

• SAMTLIGA RUM:
  - Damma av väggar och tak
  - Rengör garderober in- och utvändigt
  - Rengör ovanpå garderober och skåp
  - Rengör element, även bakom
  - Torka av dörr, dörrkarm och handtag
  - Torka av golvlister
  - Putsa speglar
  - Dammsug och torka golv

• BADRUM OCH TOALETTER:
  - Damma tak och rengör väggar
  - Rengör toalett
  - Rengör handfat och blandare
  - Rengör badkar och blandare
  - Rengör duschkabin och blandare
  - Rengör badrumsskåp in- och utvändigt
  - Putsa speglar
  - Rengör ev. fasta takarmaturer
  - Avfläcka samtliga målade ytor
  - Rengör golvbrunn
  - Rengör ventilationsdon utvändigt
  - Rengör golv
  - Torka av dörr, dörrkarm och handtag

• TVÄTTSTUGA OCH GROVENTRÉ:
  - Damma av väggar och tak
  - Rengör tvättmaskin och tvättmedelsfack
  - Rengör torktumlare och filter
  - Rengör torkskåp och filter
  - Rengör tvättho
  - Rengör förvaringsutrymmen
  - Rengör golvbrunn
  - Rengör ventilationsdon
  - Rengör golv
  - Torka av dörr, dörrkarm och handtag`
            },
            'visningsstadning': {
                'title': 'VISNINGSSTÄDNING - VAD SOM INGÅR',
                'content': `
• BOSTADSRUM:
  - Dammtorkning av vågräta ytor
  - Dammsugning av mattor, golv och golvlister
  - Avfläckning av luckor, kontakter, lampknappar, foder, lister, dörrar och dörrhandtag
  - Putsning av speglar
  - Tömning av papperskorgar (brännbart och komposterbart)
  - Dammtorkning av tavelramar och lampor
  - Avfläckning och moppning av golv

• BADRUM OCH TOALETTER:
  Som ovan, och även:
  - Rengöring av badkar och duschutrymme
  - Avfläckning av badrumsmöbler
  - Avtorkning av hängare och handdukstork
  - Rengöring av handfat utsida/insida
  - Rengöring av toalett utsida/insida

• KÖK OCH MATPLATS:
  Samma punkter som bostadsrum, och även:
  - Rengöring av kakel/stänkskydd över diskbänk
  - Rengöring av spisen utvändigt
  - Rengöring av micro in- och utvändigt
  - Avtorkning av hushållsmaskiner
  - Avtorkning av kyl och frys utvändigt
  - Rengöring av sopkärl
  - Avtorkning av matsalsbord och stolar
  - Rengöring av diskho, diskbänk och blandare

• TVÄTTSTUGA OCH GROVENTRÉ:
  - Rengöring av diskho, diskbänk och blandare
  - Dammtorkning, dammsugning och moppning av fria ytor`
            },
            'kontorsstadning': {
                'title': 'KONTORSSTÄDNING - VAD SOM INGÅR',
                'content': `
• KONTORSYTOR:
  - Dammtorkning av skrivbord och kontorsytor
  - Dammsugning av golv och mattor
  - Tömning av papperskorgar
  - Rengöring av dataskärmar och tangentbord
  - Avtorkning av telefoner
  - Putsning av speglar och glaspartier

• KÖKSUTRYMMEN:
  - Rengöring av diskbänk och diskho
  - Avtorkning av kyl/frys
  - Rengöring av micro
  - Tömning av sopkärl
  - Avtorkning av matsalsbord och stolar

• SANITÄRA UTRYMMEN:
  - Rengöring av toaletter
  - Rengöring av handfat
  - Påfyllning av tvål och pappersprodukter
  - Moppning av golv`
            },
            'fonsterputs': {
                'title': 'FÖNSTERPUTS - VAD SOM INGÅR',
                'content': `
• GRUNDLÄGGANDE FÖNSTERPUTS:
  - Rengöring av fönsterglas
  - Avtorkning av fönsterkarmar
  - Rengöring av fönsterbänkar
  - Borttagning av spindelnät

• EXTRA TJÄNSTER (vid behov):
  - Rengöring av persienner
  - Avfrostning av fönster
  - Rengöring av utanpåliggande solskydd`
            }
        },

        // Fönsterputs tillägg inom städtjänster - uppdaterade detaljerade priser
        WINDOW_CLEANING: {
            // Grundpriser per fönster baserat på fönstertyp
            BASE_PRICES: {
                'standardfonster': 35,      // 35kr per fönster
                'blandat': 40,              // 40kr per fönster
                'stora_partier': 65         // 65kr per fönster
            },
            
            // Fastighetstyp multiplikatorer
            PROPERTY_MULTIPLIERS: {
                'villa_radhus': 1.0,        // Standardpris
                'lagenhet': 0.9,            // 10% rabatt
                'affarslokal': 1.2,         // 20% tillägg
                'kommersiell_lokal': 1.3,   // 30% tillägg
                'restaurang': 1.4           // 40% tillägg
            },
            
            // Öppningstyp multiplikatorer
            OPENING_MULTIPLIERS: {
                'utat': 1.0,                // Standard
                'inat': 1.1,                // 10% tillägg
                'gar_ej_oppna': 1.2         // 20% tillägg
            },
            
            // Rengöringstyp multiplikatorer
            CLEANING_TYPE_MULTIPLIERS: {
                'invandig_utvandig': 1.0,   // Standard
                'bara_invandig': 0.6,       // 40% rabatt
                'bara_utvandig': 0.7        // 30% rabatt
            },
            
            // Spröjs påverkar priset
            SPROJS_FEES: {
                'nej': 0,                   // Ingen extra kostnad
                'lostagbart': 10,           // 10kr extra per fönster
                'fast': 15                  // 15kr extra per fönster + rutkostnad
            },
            
            // Fast spröjs - kostnad per ruta
            RUTA_FEE: 5,                    // 5kr per ruta
            
            // Sidor multiplikatorer
            SIDES_MULTIPLIERS: {
                '2': 1.0,                   // Standardpris
                '4': 1.6,                   // 60% tillägg
                '6': 2.1                    // 110% tillägg
            },
            
            // Tillgänglighet tillägg (fasta summor)
            ACCESSIBILITY_FEES: {
                'karmar_ja': 15,            // 15kr extra per fönster
                'stege_ja': 200,            // 200kr fast tillägg för hela jobbet
                'skylift_ja': 1500          // 1500kr fast tillägg för hela jobbet
            }
        }
    },

    EXTRAS: {
        VAT_RATE: 0.25,           // 25% moms
        RUT_DEDUCTION: 0.50,      // 50% RUT-avdrag
        RUT_MAX_SINGLE: 75000,    // Max 75 000 kr per person
        RUT_MAX_SHARED: 150000    // Max 150 000 kr för två personer
    }
};

class QuoteCalculator {
    constructor() {
        this.init();
    }

    init() {
        console.log('🎨 QuoteCalculator initialiserad');
        
        // Visa navigation bar
        this.showNavigationBar();
        
        this.setupTabNavigation();
        this.setupServiceListeners();
        this.setupFormListeners();
        this.setupRUTListeners();
        this.setupGDPRModal();
        this.setDefaultDates();
        this.populateDropdowns();
        this.setupCleaningServiceListeners();
    }

    initializeMainApplication() {
        console.log('🚀 Initialiserar huvudapplikation');
        
        const requiredElements = [
            'company', 'email', 'phone', 'address', 'postal_code', 'city',
            'antal_vaningar', 'typ_fastighet', 'fonster_atkomst', 'antal_fonster'
        ];

        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
            console.error('❌ Saknade DOM-element:', missingElements);
            return false;
        }

        console.log('✅ Alla obligatoriska element hittade');
        this.setupServiceListeners();
        this.updateRUTSections();
        this.calculateQuote();
        this.updateSubmitButton();
        return true;
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;

                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
                
                // Transfer customer data when switching to work description tab
                if (targetTab === 'arbetsbeskrivning') {
                    this.transferCustomerDataToWorkDescription();
                }
                
                // Transfer customer data when switching to tilläggstjänst tab
                if (targetTab === 'tillaggtjanst') {
                    this.transferCustomerDataToTillaggstjanst();
                }
            });
        });
    }

    setupServiceListeners() {
        console.log('🔧 Sätter upp lyssnare för tjänster');
        
        // Lyssna på checkboxar för att visa/dölja input-fält
        const serviceCheckboxes = document.querySelectorAll('.service-header input[type="checkbox"]');
        serviceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const serviceId = e.target.id;
                const inputField = document.querySelector(`#${serviceId}_m2, #${serviceId}_lm, #${serviceId}_st`);
                
                console.log(`📦 Tjänst ${serviceId} ${e.target.checked ? 'aktiverad' : 'inaktiverad'}`);
                
                if (inputField) {
                    inputField.style.display = e.target.checked ? 'block' : 'none';
                    if (!e.target.checked) {
                        inputField.value = '';
                    }
                }
                
                this.calculateQuote();
                this.updateSubmitButton();
                // Update work description when services change
                this.generateDetailedWorkDescription();
            });
        });

        // Lyssna på input-värden
        const serviceInputs = document.querySelectorAll('.service-input');
        serviceInputs.forEach(input => {
            input.addEventListener('input', () => {
                console.log(`📊 Värde ändrat för ${input.id}: ${input.value}`);
                this.calculateQuote();
                this.updateSubmitButton();
                // Update work description when quantities change
                this.generateDetailedWorkDescription();
            });
        });
    }

    setupFormListeners() {
        const formInputs = document.querySelectorAll('#company, #email, #phone, #address, #postal_code, #city');
        formInputs.forEach(input => {
            input.addEventListener('input', () => this.updateSubmitButton());
        });

        // Main quote form submission
        const quoteForm = document.getElementById('quote-form');
        if (quoteForm) {
            quoteForm.addEventListener('submit', (e) => this.handleQuoteSubmit(e));
        }

        // Arbetsbeskrivning form submission
        const arbetsbeskrivningForm = document.getElementById('arbetsbeskrivning-form');
        if (arbetsbeskrivningForm) {
            arbetsbeskrivningForm.addEventListener('submit', (e) => this.handleArbetsbeskrivningSubmit(e));
        }
        
        // Arbetsbeskrivning form validation
        const arbFormInputs = document.querySelectorAll('#arb-company, #arb-email, #arb-phone, #arb-address, #arb-postal_code, #arb-city');
        arbFormInputs.forEach(input => {
            input.addEventListener('input', () => this.updateArbetsbeskrivningSubmitButton());
        });
    }

    setupRUTListeners() {
        // RUT property and customer eligibility listeners
        const fastighetRUTRadios = document.querySelectorAll('input[name="fastighet_rut_berättigad"]');
        const kundRUTRadios = document.querySelectorAll('input[name="är_du_berättigad_rut_avdrag"]');
        const delatRUTSection = document.getElementById('delat-rut-section');
        const materialSection = document.getElementById('materialkostnad-section');

        fastighetRUTRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateRUTSections();
                this.calculateQuote();
            });
        });

        kundRUTRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateRUTSections();
                this.calculateQuote();
            });
        });

        // Shared RUT listeners
        const sharedRUTRadios = document.querySelectorAll('input[name="delat_rut_avdrag"]');
        sharedRUTRadios.forEach(radio => {
            radio.addEventListener('change', () => this.calculateQuote());
        });

        // Material cost listener
        const materialSelect = document.getElementById('materialkostnad');
        if (materialSelect) {
            materialSelect.addEventListener('change', () => this.calculateQuote());
        }

        // Project settings listeners
        const projectInputs = document.querySelectorAll('input[name="projekttyp"], input[name="bostadssituation"], input[name="farghantering"], input[name="garanti"], #resekostnad');
        projectInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.calculateQuote();
                // Update work description when project settings change
                this.generateDetailedWorkDescription();
            });
            if (input.type !== 'radio') {
                input.addEventListener('input', () => {
                    this.calculateQuote();
                    this.generateDetailedWorkDescription();
                });
            }
        });
    }

    updateRUTSections() {
        const fastighetRUT = document.querySelector('input[name="fastighet_rut_berättigad"]:checked');
        const kundRUT = document.querySelector('input[name="är_du_berättigad_rut_avdrag"]:checked');
        const delatRUTSection = document.getElementById('delat-rut-section');
        const materialSection = document.getElementById('materialkostnad-section');

        const fastighetEligible = fastighetRUT && fastighetRUT.value === 'Ja - Villa/Radhus';
        const kundEligible = kundRUT && kundRUT.value === 'Ja - inkludera RUT-avdrag i anbudet';
        const bothEligible = fastighetEligible && kundEligible;

        if (delatRUTSection) {
            delatRUTSection.style.display = bothEligible ? 'block' : 'none';
        }

        if (materialSection) {
            materialSection.style.display = bothEligible ? 'block' : 'none';
        }
    }

    calculateQuote() {
        console.log('💰 Beräknar fönsterputs-offert...');
        
        let totalCostExclVat = 0;

        // 1. Antal våningar
        const antalVaningar = document.getElementById('antal_vaningar')?.value;
        if (antalVaningar) {
            const floorKey = antalVaningar === '4+' ? 4 : parseInt(antalVaningar);
            const floorCost = CONFIG.WINDOW_PRICING.FLOORS[floorKey] || 0;
            totalCostExclVat += floorCost;
            console.log(`🏢 Våningar (${antalVaningar}): ${floorCost} kr`);
        }

        // 2. Åtkomst
        const fonsterAtkomst = document.getElementById('fonster_atkomst')?.value;
        if (fonsterAtkomst && CONFIG.WINDOW_PRICING.ACCESS[fonsterAtkomst]) {
            const accessCost = CONFIG.WINDOW_PRICING.ACCESS[fonsterAtkomst];
            totalCostExclVat += accessCost;
            console.log(`🪜 Åtkomst (${fonsterAtkomst}): ${accessCost} kr`);
        }

        // 3. Antal fönster (grundpris)
        const antalFonster = parseInt(document.getElementById('antal_fonster')?.value) || 0;
        let windowBaseCost = 0;
        if (antalFonster > 0) {
            if (antalFonster <= 10) windowBaseCost = CONFIG.WINDOW_PRICING.WINDOW_COUNT['1-10'];
            else if (antalFonster <= 20) windowBaseCost = CONFIG.WINDOW_PRICING.WINDOW_COUNT['11-20'];
            else if (antalFonster <= 30) windowBaseCost = CONFIG.WINDOW_PRICING.WINDOW_COUNT['21-30'];
            else if (antalFonster <= 40) windowBaseCost = CONFIG.WINDOW_PRICING.WINDOW_COUNT['31-40'];
            else if (antalFonster <= 50) windowBaseCost = CONFIG.WINDOW_PRICING.WINDOW_COUNT['41-50'];
            else windowBaseCost = antalFonster * CONFIG.WINDOW_PRICING.WINDOW_COUNT.over_50_per_window;
            
            totalCostExclVat += windowBaseCost;
            console.log(`🪟 Grundpris fönster (${antalFonster} st): ${windowBaseCost} kr`);
        }

        // 4. Fönstertyp tillägg
        let windowTypeAdjustment = 0;
        document.querySelectorAll('input[name="fonstertyp"]:checked').forEach(checkbox => {
            const typeValue = checkbox.value;
            const adjustment = CONFIG.WINDOW_PRICING.WINDOW_TYPE[typeValue] || 0;
            windowTypeAdjustment += adjustment * antalFonster;
            console.log(`✨ Fönstertyp (${typeValue}): ${adjustment * antalFonster} kr`);
        });
        totalCostExclVat += windowTypeAdjustment;

        // 5. Inglasad balkong
        const inglasadBalkong = document.querySelector('input[name="inglasad_balkong"]:checked')?.value;
        if (inglasadBalkong === 'Ja') {
            const balkongCost = CONFIG.WINDOW_PRICING.EXTRAS.inglasad_balkong;
            totalCostExclVat += balkongCost;
            console.log(`🏠 Inglasad balkong: ${balkongCost} kr`);
        }

        // 6. Källarfönster
        const kallarfonster = parseInt(document.getElementById('kallarfonster')?.value) || 0;
        if (kallarfonster > 0) {
            let kallarCost = 0;
            if (kallarfonster <= 5) kallarCost = CONFIG.WINDOW_PRICING.EXTRAS.kallarfonster_0_5;
            else if (kallarfonster <= 10) kallarCost = CONFIG.WINDOW_PRICING.EXTRAS.kallarfonster_6_10;
            else kallarCost = CONFIG.WINDOW_PRICING.EXTRAS.kallarfonster_11_plus;
            
            totalCostExclVat += kallarCost;
            console.log(`🕳️ Källarfönster (${kallarfonster} st): ${kallarCost} kr`);
        }

        // 7. Invändig fönsterputs
        const invandigPuts = document.querySelector('input[name="invandig_puts"]:checked')?.value;
        if (invandigPuts === 'Ja' && antalFonster > 0) {
            const invandigCost = antalFonster * CONFIG.WINDOW_PRICING.EXTRAS.invandig_puts_per_window;
            totalCostExclVat += invandigCost;
            console.log(`🏠 Invändig puts (${antalFonster} st): ${invandigCost} kr`);
        }

        // Projekttyp pålägg
        let projekttyp_paslag = 0;
        const projekttyp = document.querySelector('input[name="projekttyp"]:checked');
        if (projekttyp && totalCostExclVat > 0) {
            switch (projekttyp.value) {
                case 'Akut':
                    projekttyp_paslag = totalCostExclVat * 0.25;
                    break;
                case 'Helgtjänst':
                    projekttyp_paslag = totalCostExclVat * 0.30;
                    break;
            }
            totalCostExclVat += projekttyp_paslag;
        }

        // Bostadssituation pålägg
        let bostadssituation_paslag = 0;
        const bostadssituation = document.querySelector('input[name="bostadssituation"]:checked');
        if (bostadssituation && bostadssituation.value === 'Bebott' && totalCostExclVat > 0) {
            bostadssituation_paslag = totalCostExclVat * 0.15;
            totalCostExclVat += bostadssituation_paslag;
        }

        // Garanti pålägg
        let garanti_paslag = 0;
        const garanti = document.querySelector('input[name="garanti"]:checked');
        if (garanti && garanti.value === '5 år' && totalCostExclVat > 0) {
            garanti_paslag = totalCostExclVat * 0.12;
            totalCostExclVat += garanti_paslag;
        }

        // Ingen färghantering för fönsterputs - ta bort denna sektion

        // Resekostnad
        let resekostnad = 0;
        const resekostnadInput = document.getElementById('resekostnad');
        if (resekostnadInput && resekostnadInput.value) {
            const km = parseFloat(resekostnadInput.value) || 0;
            if (km > 0) {
                resekostnad = km * 6.5;
                totalCostExclVat += resekostnad;
            }
        }

        // Regelbunden putsning rabatt (sist före moms)
        let regelbundenRabatt = 0;
        const regelbundenPutsning = document.querySelector('input[name="regelbunden_putsning"]:checked');
        if (regelbundenPutsning && totalCostExclVat > 0) {
            const rabattProcent = CONFIG.WINDOW_PRICING.REGULAR_CLEANING[regelbundenPutsning.value] || 0;
            if (rabattProcent < 0) {
                regelbundenRabatt = Math.abs(totalCostExclVat * rabattProcent);
                totalCostExclVat -= regelbundenRabatt;
                console.log(`🔄 Regelbunden puts rabatt (${regelbundenPutsning.value}): -${regelbundenRabatt} kr`);
            }
        }

        // Beräkna moms
        const vatAmount = totalCostExclVat * CONFIG.EXTRAS.VAT_RATE;
        const totalInclVat = totalCostExclVat + vatAmount;

        // Beräkna RUT-avdrag
        let rutDeduction = 0;
        let materialDeduction = 0;
        const hasRutDeduction = this.checkRUTEligibility();
        if (hasRutDeduction) {
            // Materialkostnad avdrag
            const materialSelect = document.getElementById('materialkostnad');
            const materialPercent = materialSelect ? parseFloat(materialSelect.value) || 0 : 0;
            if (materialPercent > 0) {
                materialDeduction = (totalCostExclVat * materialPercent) / 100;
            }

            // Arbetskostnad för RUT = total - materialkostnad
            const workCostForRut = totalCostExclVat - materialDeduction;
            const calculatedRutDeduction = workCostForRut * CONFIG.EXTRAS.RUT_DEDUCTION;
            
            const isSharedRut = document.querySelector('input[name="delat_rut_avdrag"]:checked')?.value === 'Ja';
            const maxRutAmount = isSharedRut ? 150000 : 75000;
            rutDeduction = Math.min(calculatedRutDeduction, maxRutAmount);
        }

        const finalTotal = totalInclVat - rutDeduction;

        console.log(`💰 Totalt exkl moms: ${totalCostExclVat} kr`);
        console.log(`💰 Moms: ${vatAmount} kr`);
        console.log(`💰 Totalt inkl moms: ${totalInclVat} kr`);
        console.log(`💰 Material avdrag: ${materialDeduction} kr`);
        console.log(`💰 RUT-avdrag: ${rutDeduction} kr`);
        console.log(`💰 Slutsumma: ${finalTotal} kr`);

        this.updatePricingDisplay(totalCostExclVat, vatAmount, totalInclVat, rutDeduction, finalTotal, {
            materialDeduction
        });
    }

    checkRUTEligibility() {
        const fastighetRUT = document.querySelector('input[name="fastighet_rut_berättigad"]:checked');
        const kundRUT = document.querySelector('input[name="är_du_berättigad_rut_avdrag"]:checked');
        
        const fastighetEligible = fastighetRUT && fastighetRUT.value === 'Ja - Villa/Radhus';
        const kundEligible = kundRUT && kundRUT.value === 'Ja - inkludera RUT-avdrag i anbudet';
        
        return fastighetEligible && kundEligible;
    }

    getServiceDisplayName(serviceKey) {
        const displayNames = {
            'RUM': 'Målning vardagsrum/sovrum',
            'KOK_BADRUM': 'Målning kök/badrum',
            'HALL_TRAPPHUS': 'Målning hall/trapphus',
            'TAKTEXTIL': 'Målning taktextil',
            'VARDAGSRUM_SOVRUM': 'Tapetsering vardagsrum/sovrum',
            'TAPETBORTTAGNING': 'Tapetborttagning',
            'FONSTERFARG': 'Fönstertärg',
            'PUTSFASAD': 'Putsfasad',
            'STENMALING': 'Stenmålning',
            'TRAFORVASK': 'Träförfvask',
            'HYRA_VECKA': 'Ställning hyra/vecka',
            'UPPMONTERING': 'Ställning uppmontering',
            'NEDMONTERING': 'Ställning nedmontering',
            'TRANSPORT': 'Ställning transport',
            'MALA_FONSTER': 'Måla fönster',
            'FONSTERKITT': 'Fönsterkitt',
            'SPECIALBEHANDLING': 'Specialbehandling',
            'GRUNDMALING': 'Grundmålning',
            'SPACKLING': 'Spackling',
            'SLIPNING': 'Slipning',
            'MASKERING': 'Maskering'
        };
        return displayNames[serviceKey] || serviceKey;
    }

    updatePricingDisplay(totalExclVat, vatAmount, totalInclVat, rutDeduction, finalTotal, extras = {}) {
        // Update subtotal price display (matches Sternbecks structure)
        const subtotalPriceDisplay = document.getElementById('subtotal-price-display');
        if (subtotalPriceDisplay) {
            subtotalPriceDisplay.textContent = new Intl.NumberFormat('sv-SE').format(Math.round(totalExclVat)) + ' kr';
        }

        // Update total with VAT
        const totalWithVat = document.getElementById('total-with-vat');
        if (totalWithVat) {
            totalWithVat.innerHTML = '<strong>' + new Intl.NumberFormat('sv-SE').format(Math.round(totalInclVat)) + ' kr</strong>';
        }

        // Update RUT deduction if applicable
        const rutDeductionEl = document.getElementById('rut-deduction');
        const rutRow = document.getElementById('rut-row');
        const rutPreliminaryText = document.getElementById('rut-preliminary-text');
        const materialRow = document.getElementById('material-row');
        const materialDeductionEl = document.getElementById('material-deduction');

        if (rutDeduction > 0) {
            if (rutDeductionEl) {
                rutDeductionEl.textContent = '-' + new Intl.NumberFormat('sv-SE').format(Math.round(rutDeduction)) + ' kr';
            }
            if (rutRow) {
                rutRow.style.display = 'flex';
            }
            if (rutPreliminaryText) {
                rutPreliminaryText.style.display = 'block';
            }

            // Update material deduction if exists
            const { materialDeduction = 0 } = extras;
            if (materialDeduction > 0 && materialDeductionEl && materialRow) {
                materialDeductionEl.textContent = '-' + new Intl.NumberFormat('sv-SE').format(Math.round(materialDeduction)) + ' kr';
                materialRow.style.display = 'flex';
            } else if (materialRow) {
                materialRow.style.display = 'none';
            }
        } else {
            if (rutRow) {
                rutRow.style.display = 'none';
            }
            if (rutPreliminaryText) {
                rutPreliminaryText.style.display = 'none';
            }
            if (materialRow) {
                materialRow.style.display = 'none';
            }
        }

        // Update final customer price
        const finalCustomerPrice = document.getElementById('final-customer-price');
        if (finalCustomerPrice) {
            finalCustomerPrice.innerHTML = '<strong>' + new Intl.NumberFormat('sv-SE').format(Math.round(finalTotal)) + ' kr</strong>';
        }
    }

    generateWorkDescription(selectedServices) {
        const workList = document.getElementById('workDescription');
        if (!workList) {
            console.log('⚠️ workDescription element inte hittat');
            return;
        }

        workList.innerHTML = '';

        if (selectedServices.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Inga tjänster valda än';
            workList.appendChild(li);
            return;
        }

        selectedServices.forEach(service => {
            const li = document.createElement('li');
            li.textContent = `${service.name}: ${service.quantity} ${service.unit} × ${new Intl.NumberFormat('sv-SE').format(service.unitPrice)} kr = ${new Intl.NumberFormat('sv-SE').format(service.total)} kr`;
            workList.appendChild(li);
            console.log(`📝 Arbetsbeskrivning: ${li.textContent}`);
        });

        // Lägg till ROT-information om relevant
        const hasRotDeduction = this.checkROTEligibility();
        if (hasRotDeduction) {
            const li = document.createElement('li');
            li.textContent = 'ROT-avdrag beräknas på 70% av arbetskostnaden';
            workList.appendChild(li);
        }
    }

    updateSubmitButton() {
        const requiredFields = ['quote-date', 'company', 'email', 'phone', 'address', 'postal_code', 'city'];
        const submitButton = document.getElementById('submit-btn');
        
        if (!submitButton) return;

        const allFieldsFilled = requiredFields.every(fieldId => {
            const field = document.getElementById(fieldId);
            return field && field.value.trim() !== '';
        });

        const hasSelectedServices = Object.keys(CONFIG.SERVICE_PRICES).some(serviceId => {
            const checkbox = document.getElementById(serviceId);
            const inputField = document.querySelector(`#${serviceId}_m2, #${serviceId}_lm, #${serviceId}_st`);
            return checkbox && checkbox.checked && inputField && parseFloat(inputField.value) > 0;
        });

        submitButton.disabled = !allFieldsFilled || !hasSelectedServices;
    }

    async handleQuoteSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }

        const submitBtn = document.getElementById('submit-btn');
        const quoteForm = document.getElementById('quote-form');
        const successMessage = document.getElementById('success-message');
        const errorMessage = document.getElementById('error-message');

        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');

            const data = this.collectFormData();
            console.log('Skickar anbudsdata:', data);

            await this.submitToNetlifyFunction(data);

            // Show success message
            quoteForm.style.display = 'none';
            successMessage.style.display = 'block';
            
        } catch (error) {
            console.error('Fel vid skickning:', error);
            
            // Show error message
            quoteForm.style.display = 'none';
            errorMessage.style.display = 'block';
            
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    }

    async handleArbetsbeskrivningSubmit(e) {
        e.preventDefault();
        
        if (!this.validateArbetsbeskrivningForm()) {
            return;
        }

        const form = e.target;
        const submitBtn = form.querySelector('.submit-btn');
        const successMessage = document.getElementById('arb-success-message');
        const errorMessage = document.getElementById('arb-error-message');

        try {
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');

            const formData = new FormData(form);
            const data = {
                type: 'arbetsbeskrivning',
                timestamp: new Date().toISOString(),
                arbetsbeskrivningsDatum: formData.get('work-date'),
                kundInfo: {
                    företag: formData.get('arb-company'),
                    kontaktperson: formData.get('arb-contact_person'),
                    email: formData.get('arb-email'),
                    telefon: formData.get('arb-phone'),
                    adress: formData.get('arb-address'),
                    fastighetsbeteckning: formData.get('arb-fastighetsbeteckning'),
                    postnummer: formData.get('arb-postal_code'),
                    ort: formData.get('arb-city')
                },
                projektBeskrivning: formData.get('arb-beskrivning'),
                gdprConsent: formData.get('arb-gdpr-consent') === 'on'
            };

            await this.submitToNetlifyFunction(data);
            
            // Show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';
            
        } catch (error) {
            console.error('Fel vid skickning:', error);
            
            // Show error message
            form.style.display = 'none';
            errorMessage.style.display = 'block';
            
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }
    }

    validateForm() {
        let isValid = true;
        const requiredFields = [
            { id: 'quote-date', name: 'Anbudsdatum' },
            { id: 'company', name: 'Företag/Namn' },
            { id: 'email', name: 'E-post' },
            { id: 'phone', name: 'Telefonnummer' },
            { id: 'address', name: 'Adress' },
            { id: 'postal_code', name: 'Postnummer' },
            { id: 'city', name: 'Ort' },
            { id: 'antal_vaningar', name: 'Antal våningar' },
            { id: 'typ_fastighet', name: 'Typ av fastighet' },
            { id: 'fonster_atkomst', name: 'Fönstrens åtkomst' },
            { id: 'antal_fonster', name: 'Antal fönster' }
        ];

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });

        // Validate required fields
        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            const errorDiv = document.getElementById(`${field.id}-error`);
            
            if (!input.value.trim()) {
                if (errorDiv) {
                    errorDiv.textContent = `${field.name} är obligatorisk`;
                    errorDiv.style.display = 'block';
                }
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });

        // Validate email format
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (emailInput.value.trim() && !emailRegex.test(emailInput.value.trim())) {
            if (emailError) {
                emailError.textContent = 'Ange en giltig e-postadress';
                emailError.style.display = 'block';
            }
            emailInput.classList.add('error');
            isValid = false;
        }

        // Validate postal code format (5 digits)
        const postalCodeInput = document.getElementById('postal_code');
        const postalCodeError = document.getElementById('postal_code-error');
        const postalCodeRegex = /^[0-9]{5}$/;
        
        if (postalCodeInput.value.trim() && !postalCodeRegex.test(postalCodeInput.value.trim())) {
            if (postalCodeError) {
                postalCodeError.textContent = 'Ange ett giltigt postnummer (5 siffror)';
                postalCodeError.style.display = 'block';
            }
            postalCodeInput.classList.add('error');
            isValid = false;
        }

        // Validate that at least one window type is selected
        const hasSelectedWindowType = document.querySelectorAll('input[name="fonstertyp"]:checked').length > 0;
        const fonsterTypError = document.getElementById('fonstertyp-error');

        if (!hasSelectedWindowType) {
            if (fonsterTypError) {
                fonsterTypError.textContent = 'Välj minst en fönstertyp';
                fonsterTypError.style.display = 'block';
            }
            isValid = false;
        } else {
            if (fonsterTypError) {
                fonsterTypError.style.display = 'none';
            }
        }

        // Validate GDPR consent
        const gdprConsent = document.getElementById('gdpr-consent');
        const gdprError = document.getElementById('gdpr-consent-error');
        
        if (!gdprConsent.checked) {
            if (gdprError) {
                gdprError.textContent = 'Du måste godkänna behandling av personuppgifter';
                gdprError.style.display = 'block';
            }
            isValid = false;
        }

        return isValid;
    }
    
    transferCustomerDataToWorkDescription() {
        const customerFieldMapping = {
            'company': 'arb-company',
            'contact_person': 'arb-contact_person',
            'email': 'arb-email',
            'phone': 'arb-phone',
            'address': 'arb-address',
            'fastighetsbeteckning': 'arb-fastighetsbeteckning',
            'postal_code': 'arb-postal_code',
            'city': 'arb-city'
        };
        
        Object.entries(customerFieldMapping).forEach(([quoteFieldId, workDescFieldId]) => {
            const quoteField = document.getElementById(quoteFieldId);
            const workDescField = document.getElementById(workDescFieldId);
            
            if (quoteField && workDescField && quoteField.value.trim()) {
                workDescField.value = quoteField.value;
            }
        });
        
        // Generate work description based on selected services
        this.updateCleaningWorkDescription();
        
        console.log('📋 Kunddata överförd från Anbud till Arbetsbeskrivning');
    }
    
    transferCustomerDataToTillaggstjanst() {
        const customerFieldMapping = {
            'company': 'tillagg-customer-company',
            'contact_person': 'tillagg-customer-contact',
            'email': 'tillagg-customer-email',
            'address': 'tillagg-customer-address'
        };
        
        Object.entries(customerFieldMapping).forEach(([quoteFieldId, tillaggFieldId]) => {
            const quoteField = document.getElementById(quoteFieldId);
            const tillaggField = document.getElementById(tillaggFieldId);
            
            if (quoteField && tillaggField && quoteField.value.trim()) {
                tillaggField.value = quoteField.value;
            }
        });
        
        console.log('📋 Kunddata överförd från Anbud till Tilläggstjänst');
    }
    
    generateDetailedWorkDescription() {
        const workDescriptionTextarea = document.getElementById('arb-beskrivning');
        if (!workDescriptionTextarea) return;
        
        const windowInfo = this.getWindowInfoForWorkDescription();
        const projectInfo = this.getProjectInfoForWorkDescription();
        
        let workDescription = "ARBETSBESKRIVNING - FÖNSTERPUTS\n\n";
        
        workDescription += "OBJEKTSINFORMATION:\n\n";
        
        if (projectInfo.antalVaningar) {
            workDescription += `• Byggnad: ${projectInfo.antalVaningar} våningar\n`;
        }
        if (projectInfo.typFastighet) {
            workDescription += `• Fastighetstyp: ${projectInfo.typFastighet}\n`;
        }
        if (projectInfo.fonsterAtkomst) {
            workDescription += `• Åtkomst: ${projectInfo.fonsterAtkomst}\n`;
        }
        
        workDescription += "\nFÖNSTERINFORMATION:\n\n";
        
        if (windowInfo.antalFonster) {
            workDescription += `• Antal fönster att putsa: ${windowInfo.antalFonster} st\n`;
        }
        
        if (windowInfo.fonstertyper.length > 0) {
            workDescription += `• Fönstertyper: ${windowInfo.fonstertyper.join(', ')}\n`;
        }
        
        if (windowInfo.kallarfonster && parseInt(windowInfo.kallarfonster) > 0) {
            workDescription += `• Källarfönster/gluggar: ${windowInfo.kallarfonster} st\n`;
        }
        
        if (windowInfo.inglasadBalkong === 'Ja') {
            workDescription += "• Inglasad balkong: Ja\n";
        }
        
        if (windowInfo.invandigPuts === 'Ja') {
            workDescription += "• Invändig fönsterputs: Ja\n";
        }
        
        workDescription += "\nUTFÖRANDE:\n\n";
        workDescription += "• Professionell fönsterputs av alla angivna fönster\n";
        workDescription += "• Rengöring av både glas och fönsterramar\n";
        workDescription += "• Användning av miljövänliga rengöringsmedel\n";
        workDescription += "• Säker hantering av all utrustning och material\n";
        
        workDescription += "Solida Städ & Fönsterputs AB\nProfessionell fönsterputs med kvalitetsgaranti";
        
        workDescriptionTextarea.value = workDescription;
    }
    
    getWindowInfoForWorkDescription() {
        const antalFonster = document.getElementById('antal_fonster')?.value || '';
        const kallarfonster = document.getElementById('kallarfonster')?.value || '0';
        const inglasadBalkong = document.querySelector('input[name="inglasad_balkong"]:checked')?.value || 'Nej';
        const invandigPuts = document.querySelector('input[name="invandig_puts"]:checked')?.value || 'Nej';
        
        const fonstertyper = [];
        document.querySelectorAll('input[name="fonstertyp"]:checked').forEach(checkbox => {
            fonstertyper.push(checkbox.value);
        });
        
        return {
            antalFonster,
            kallarfonster,
            inglasadBalkong,
            invandigPuts,
            fonstertyper
        };
    }
    
    getProjectInfoForWorkDescription() {
        const antalVaningar = document.getElementById('antal_vaningar')?.value || '';
        const typFastighet = document.getElementById('typ_fastighet')?.value || '';
        const fonsterAtkomst = document.getElementById('fonster_atkomst')?.value || '';
        
        return {
            antalVaningar,
            typFastighet,
            fonsterAtkomst
        };
    }
    
    getTillaggInfoForWorkDescription() {
        const regelbundenPutsning = [];
        document.querySelectorAll('input[name="regelbunden_putsning"]:checked').forEach(checkbox => {
            regelbundenPutsning.push(checkbox.value);
        });
        
        const kommentar = document.getElementById('kommentar')?.value || '';
        
        return {
            regelbundenPutsning,
            kommentar
        };
    }

    getSelectedServicesForWorkDescription() {
        const services = [];
        const serviceDescriptions = {
            'vaggmaling': {
                name: 'Väggmålning',
                description: '• VÄGGMÅLNING:\n  - Grundlig rengöring och preparation av väggytor\n  - Spackling av mindre skador och ojämnheter\n  - Slipning av spackel för jämn yta\n  - Grundmålning vid behov\n  - Två strykningar med högkvalitativ väggfärg\n  - Målning utförs med roller och pensel för professionell finish'
            },
            'vagg_spackling': {
                name: 'Väggmålning med spackling',
                description: '• VÄGGMÅLNING MED OMFATTANDE SPACKLING:\n  - Noggrann genomgång och reparation av alla väggskador\n  - Omfattande spackling av sprickor, hål och ojämnheter\n  - Slipning för perfekt jämn yta\n  - Grundmålning av spacklad yta\n  - Två strykningar med högkvalitativ väggfärg\n  - Extra omsorg för enhetlig färgton över hela ytan'
            },
            'takmalning': {
                name: 'Takmålning',
                description: '• TAKMÅLNING:\n  - Skyddstäckning av golv och möbler\n  - Rengöring och preparation av takyta\n  - Spackling av mindre skador\n  - Grundmålning vid behov\n  - Två strykningar med takfärg\n  - Användning av professionell takutrustning för jämnt resultat'
            },
            'snickerier': {
                name: 'Målning snickerier',
                description: '• MÅLNING AV SNICKERIER:\n  - Demontage av beslag vid behov\n  - Slipning av befintlig färg/lack\n  - Spackling av skador och ojämnheter\n  - Grundmålning med lämplig grund\n  - Två strykningar med snickerifärg/lack\n  - Återmontering av beslag\n  - Extra precision för professionell finish'
            },
            'dorrar': {
                name: 'Målning dörrar',
                description: '• DÖRRMÅLNING:\n  - Nedtagning av dörrar för optimal målning\n  - Avmontering av handtag och beslag\n  - Slipning av samtliga ytor\n  - Spackling av skador\n  - Grundmålning\n  - Två strykningar med högkvalitativ dörr/snickerifärg\n  - Återhängning med korrekt justering'
            },
            'tapetsering': {
                name: 'Tapetsering',
                description: '• TAPETSERING:\n  - Borttagning av befintlig tapet vid behov\n  - Preparation och utjämning av väggyta\n  - Spackling och slipning för perfekt underlag\n  - Grundning av väggyta\n  - Professionell uppsättning av ny tapet\n  - Noggrann kantbehandling och fogar\n  - Slutkontroll för bubblor och ojämnheter'
            },
            'fasadmaling': {
                name: 'Fasadmålning',
                description: '• FASADMÅLNING:\n  - Högtryckstvätt av fasadyta\n  - Reparation av sprickor och skador\n  - Spackling med utomhuspackel\n  - Grundmålning med fasadgrund\n  - Två strykningar med högkvalitativ fasadfärg\n  - Skydd av omgivning och växtlighet\n  - Arbete utförs endast under lämpliga väderförhållanden'
            }
        };
        
        Object.entries(serviceDescriptions).forEach(([serviceId, serviceInfo]) => {
            const checkbox = document.getElementById(serviceId);
            const inputField = document.querySelector(`#${serviceId}_m2, #${serviceId}_lm, #${serviceId}_st`);
            
            if (checkbox && checkbox.checked && inputField && parseFloat(inputField.value) > 0) {
                const quantity = parseFloat(inputField.value);
                const unit = serviceInfo.name.includes('dörrar') ? 'st' : 
                           serviceInfo.name.includes('snickerier') ? 'lm' : 'm²';
                
                services.push({
                    name: serviceInfo.name,
                    description: `${serviceInfo.description}\n  - Omfattning: ${quantity} ${unit}`,
                    quantity: quantity,
                    unit: unit
                });
            }
        });
        
        return services;
    }
    
    getProjectSettingsForWorkDescription() {
        return {
            projektTyp: document.querySelector('input[name="projekttyp"]:checked')?.value || 'Standard',
            bostadsSituation: document.querySelector('input[name="bostadssituation"]:checked')?.value || 'Obebott',
            fargHantering: document.querySelector('input[name="farghantering"]:checked')?.value || 'Företaget ordnar',
            garanti: document.querySelector('input[name="garanti"]:checked')?.value || '2 år',
            resekostnad: parseFloat(document.getElementById('resekostnad')?.value) || 0
        };
    }
    
    validateArbetsbeskrivningForm() {
        let isValid = true;
        const requiredFields = [
            { id: 'work-date', name: 'Datum' },
            { id: 'arb-company', name: 'Företag/Namn' },
            { id: 'arb-email', name: 'E-post' },
            { id: 'arb-phone', name: 'Telefonnummer' },
            { id: 'arb-address', name: 'Adress' },
            { id: 'arb-postal_code', name: 'Postnummer' },
            { id: 'arb-city', name: 'Ort' },
            { id: 'arb-beskrivning', name: 'Projektbeskrivning' }
        ];

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });

        // Validate required fields
        requiredFields.forEach(field => {
            const input = document.getElementById(field.id);
            const errorDiv = document.getElementById(`${field.id}-error`);
            
            if (!input.value.trim()) {
                if (errorDiv) {
                    errorDiv.textContent = `${field.name} är obligatorisk`;
                    errorDiv.style.display = 'block';
                }
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
        });

        // Validate email format
        const emailInput = document.getElementById('arb-email');
        const emailError = document.getElementById('arb-email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (emailInput.value.trim() && !emailRegex.test(emailInput.value.trim())) {
            if (emailError) {
                emailError.textContent = 'Ange en giltig e-postadress';
                emailError.style.display = 'block';
            }
            emailInput.classList.add('error');
            isValid = false;
        }

        // Validate postal code format (5 digits)
        const postalCodeInput = document.getElementById('arb-postal_code');
        const postalCodeError = document.getElementById('arb-postal_code-error');
        const postalCodeRegex = /^[0-9]{5}$/;
        
        if (postalCodeInput.value.trim() && !postalCodeRegex.test(postalCodeInput.value.trim())) {
            if (postalCodeError) {
                postalCodeError.textContent = 'Ange ett giltigt postnummer (5 siffror)';
                postalCodeError.style.display = 'block';
            }
            postalCodeInput.classList.add('error');
            isValid = false;
        }

        // Validate GDPR consent
        const gdprConsent = document.getElementById('arb-gdpr-consent');
        const gdprError = document.getElementById('arb-gdpr-consent-error');
        
        if (!gdprConsent.checked) {
            if (gdprError) {
                gdprError.textContent = 'Du måste godkänna behandling av personuppgifter';
                gdprError.style.display = 'block';
            }
            isValid = false;
        }

        return isValid;
    }
    
    updateArbetsbeskrivningSubmitButton() {
        const requiredFields = ['work-date', 'arb-company', 'arb-email', 'arb-phone', 'arb-address', 'arb-postal_code', 'arb-city', 'arb-beskrivning'];
        const submitButton = document.getElementById('arb-submit-btn');
        
        if (!submitButton) return;

        const allFieldsFilled = requiredFields.every(fieldId => {
            const field = document.getElementById(fieldId);
            return field && field.value.trim() !== '';
        });

        submitButton.disabled = !allFieldsFilled;
    }

    collectFormData() {
        const data = {
            type: 'quote',
            timestamp: new Date().toISOString(),
            anbudsNummer: `SM-${Date.now()}`,
            anbudsDatum: document.getElementById('quote-date')?.value,
            kundInfo: {
                företag: document.getElementById('company').value,
                kontaktperson: document.getElementById('contact_person').value,
                email: document.getElementById('email').value,
                telefon: document.getElementById('phone').value,
                adress: document.getElementById('address').value,
                fastighetsbeteckning: document.getElementById('fastighetsbeteckning').value,
                postnummer: document.getElementById('postal_code').value,
                ort: document.getElementById('city').value
            },
            tjanster: this.collectSelectedServices(),
            rutAvdrag: this.collectRUTData(),
            totaler: this.collectPricingTotals()
        };

        return data;
    }

    collectSelectedServices() {
        const services = [];
        
        Object.entries(CONFIG.SERVICE_PRICES).forEach(([serviceId, serviceConfig]) => {
            const checkbox = document.getElementById(serviceId);
            const inputField = document.querySelector(`#${serviceId}_m2, #${serviceId}_lm, #${serviceId}_st`);
            
            if (checkbox && checkbox.checked && inputField) {
                const quantity = parseFloat(inputField.value) || 0;
                if (quantity > 0) {
                    services.push({
                        tjanst: checkbox.nextElementSibling.textContent,
                        serviceId: serviceId,
                        antal: quantity,
                        enhet: serviceConfig.unit,
                        pris: serviceConfig.price,
                        total: serviceConfig.price * quantity
                    });
                }
            }
        });

        return services;
    }


    collectRUTData() {
        const fastighetRUT = document.querySelector('input[name="fastighet_rut_berättigad"]:checked');
        const kundRUT = document.querySelector('input[name="är_du_berättigad_rut_avdrag"]:checked');
        const delatRUT = document.querySelector('input[name="delat_rut_avdrag"]:checked');
        
        return {
            fastighetBerättigad: fastighetRUT?.value || 'Nej - Hyresrätt/Kommersiell fastighet',
            kundBerättigad: kundRUT?.value || 'Nej - visa fullpris utan avdrag',
            delatRUT: delatRUT?.value || 'Nej',
            materialkostnad: document.getElementById('materialkostnad')?.value || '0'
        };
    }

    collectPricingTotals() {
        return {
            exklMoms: document.getElementById('subtotal-price-display')?.textContent || '0 kr',
            inklMoms: document.getElementById('total-with-vat')?.textContent || '0 kr',
            rotAvdrag: document.getElementById('rot-deduction')?.textContent || '0 kr',
            materialAvdrag: document.getElementById('material-deduction')?.textContent || '0 kr',
            slutsumma: document.getElementById('final-customer-price')?.textContent || '0 kr'
        };
    }

    async submitToNetlifyFunction(data) {
        const response = await fetch('/.netlify/functions/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    resetApp() {
        console.log('🔄 QuoteCalculator resetApp() startar...');
        const checkboxInputs = document.querySelectorAll('input[type="checkbox"]');
        const radioInputs = document.querySelectorAll('input[type="radio"]');
        const textInputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="number"], input[type="date"]');
        const textareas = document.querySelectorAll('textarea');
        const selects = document.querySelectorAll('select');

        checkboxInputs.forEach(input => input.checked = false);
        radioInputs.forEach(input => input.checked = false);
        textInputs.forEach(input => input.value = '');
        textareas.forEach(textarea => textarea.value = '');
        selects.forEach(select => select.selectedIndex = 0);
        
        console.log(`✅ Resetat: ${checkboxInputs.length} checkboxes, ${radioInputs.length} radiobuttons, ${textInputs.length} text inputs, ${textareas.length} textareas, ${selects.length} selects`);

        // Reset radio buttons to defaults
        const defaultRadios = {
            'projekttyp': 'Standard',
            'bostadssituation': 'Obebott',
            'farghantering': 'Företaget ordnar',
            'garanti': '2 år',
            'delat_rot_avdrag': 'Nej',
            'fastighet_rot_berättigad': 'Nej - Hyresrätt/Kommersiell fastighet',
            'är_du_berättigad_rot_avdrag': 'Nej - visa fullpris utan avdrag',
            'inglasad_balkong': 'Nej',
            'invandig_puts': 'Nej'
        };

        Object.entries(defaultRadios).forEach(([name, value]) => {
            const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
            if (radio) radio.checked = true;
        });

        // Reset service input fields visibility
        const serviceInputs = document.querySelectorAll('.service-input');
        serviceInputs.forEach(input => {
            input.style.display = 'none';
            input.value = '';
        });

        // Reset ROT sections visibility
        this.updateRUTSections();
        
        this.resetPriceDisplays();
        this.calculateQuote();
        
        // Reset default dates
        this.setDefaultDates();
        
        // Reset fönsterputs fields and hide sections
        this.clearWindowCleaningFields();
        const fonsterputsTillagg = document.getElementById('fonsterputs-tillagg');
        if (fonsterputsTillagg) {
            fonsterputsTillagg.style.display = 'none';
        }
        
        // Hide hemstädning schema
        const hemstadningSchema = document.getElementById('hemstadning-schema');
        if (hemstadningSchema) {
            hemstadningSchema.style.display = 'none';
        }
        
        // Hide estimated time display
        const estimatedTimeDisplay = document.getElementById('estimated-time-display');
        if (estimatedTimeDisplay) {
            estimatedTimeDisplay.style.display = 'none';
        }
        
        // Hide price displays
        const stadtPriceDisplay = document.getElementById('stad-price-display');
        if (stadtPriceDisplay) {
            stadtPriceDisplay.style.display = 'none';
        }
        
        // Clear all new customer and additional fields
        const additionalFields = [
            'customer-company', 'customer-contact', 'customer-email', 'customer-phone',
            'customer-address', 'customer-fastighetsbeteckning', 'customer-postal-code', 'customer-city',
            'preferred-day', 'preferred-time', 'start-date', 'access-method',
            'pets', 'allergies', 'parking'
        ];
        
        additionalFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = false;
                } else if (field.tagName === 'SELECT') {
                    field.selectedIndex = 0;
                } else {
                    field.value = '';
                }
            }
        });
        
        // Show reset notification
        this.showResetNotification();

        // Switch to first tab
        const firstTab = document.querySelector('.tab-button');
        if (firstTab) firstTab.click();
    }
    
    setupGDPRModal() {
        const gdprLinks = document.querySelectorAll('#gdpr-details-link, #arb-gdpr-details-link');
        const gdprModal = document.getElementById('gdpr-modal');
        const gdprModalClose = document.getElementById('gdpr-modal-close');
        const gdprModalOk = document.getElementById('gdpr-modal-ok');

        gdprLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                gdprModal.style.display = 'flex';
            });
        });

        const closeModal = () => {
            gdprModal.style.display = 'none';
        };

        if (gdprModalClose) {
            gdprModalClose.addEventListener('click', closeModal);
        }

        if (gdprModalOk) {
            gdprModalOk.addEventListener('click', closeModal);
        }

        // Close modal when clicking outside
        gdprModal.addEventListener('click', (e) => {
            if (e.target === gdprModal) {
                closeModal();
            }
        });
    }
    
    setDefaultDates() {
        // Set today's date as default for both forms
        const today = new Date();
        const todayString = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        
        const quoteDateInput = document.getElementById('quote-date');
        const workDateInput = document.getElementById('work-date');
        
        if (quoteDateInput) {
            quoteDateInput.value = todayString;
            console.log('📅 Anbudsdatum satt till dagens datum:', todayString);
        }
        
        if (workDateInput) {
            workDateInput.value = todayString;
            console.log('📅 Arbetsbeskrivningsdatum satt till dagens datum:', todayString);
        }
    }

    resetPriceDisplays() {
        const priceElements = ['totalExklMoms', 'momsAmount', 'totalInklMoms', 'rotAvdrag', 'slutsumma'];
        priceElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '0 kr';
            }
        });

        const workDescriptionElement = document.getElementById('workDescription');
        if (workDescriptionElement) {
            workDescriptionElement.innerHTML = '';
        }
    }

    showResetNotification() {
        let notification = document.getElementById('resetNotification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'resetNotification';
            notification.className = 'reset-notification';
            notification.textContent = '✓ Formuläret har återställts';
            document.body.appendChild(notification);
        }

        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Nya metoder för städtjänster
    populateDropdowns() {
        console.log('🔧 Populerar dropdown-menyer för städtjänster (inga dropdown-menyer att populera för nya fönsterputs-formuläret)');
        // De nya fönsterputs-fälten är antingen statiska dropdowns eller input-fält som inte behöver populeras
    }

    setupCleaningServiceListeners() {
        console.log('🎯 Sätter upp event listeners för städtjänster');
        
        // Lyssna på ändringar i bostadstyp och frekvens
        const bostadstyp = document.getElementById('bostadstyp');
        const stadfrekvens = document.getElementById('stadfrekvens');
        
        if (bostadstyp) {
            bostadstyp.addEventListener('change', () => {
                this.calculateCleaningPrice();
                this.updateCleaningWorkDescription();
            });
        }
        
        if (stadfrekvens) {
            stadfrekvens.addEventListener('change', () => {
                this.calculateCleaningPrice();
                this.updateCleaningWorkDescription();
            });
        }

        // Lyssna på tjänstval checkboxes
        const serviceCheckboxes = document.querySelectorAll('input[name="stadtjanster"]');
        serviceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.handleServiceSelection(checkbox);
                this.calculateCleaningPrice();
                this.updateCleaningWorkDescription();
                
                // Visa/dölj hemstädning schema
                if (checkbox.value === 'hemstadning') {
                    this.toggleHemstadningSchema(checkbox.checked);
                }
            });
        });
        
        // Lyssna på akut-service checkbox för pristillägg
        const akutServiceCheckbox = document.getElementById('akut-service');
        if (akutServiceCheckbox) {
            akutServiceCheckbox.addEventListener('change', () => {
                this.calculateCleaningPrice();
                this.updateCleaningWorkDescription();
            });
        }
        
        // Lyssna på bostadstyp-ändringar för estimerad tid (redan deklarerad ovan)
        if (bostadstyp) {
            bostadstyp.addEventListener('change', () => {
                this.updateEstimatedTime();
            });
        }
        
        
        // Lyssna på alla kundinformationsfält för automatisk överföring
        const customerFields = [
            'customer-company', 'customer-contact', 'customer-email', 'customer-phone',
            'customer-address', 'customer-fastighetsbeteckning', 'customer-postal-code', 'customer-city'
        ];
        
        customerFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => {
                    this.updateCleaningWorkDescription();
                    // Kopiera data till arbetsbeskrivning-formuläret
                    this.copyCustomerDataToWorkDescription();
                });
            }
        });
        
        // Lyssna på övriga nya fält
        const otherFields = [
            'preferred-day', 'preferred-time', 'start-date', 'access-method',
            'pets', 'allergies', 'parking'
        ];
        
        otherFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                const eventType = field.type === 'textarea' ? 'input' : 'change';
                field.addEventListener(eventType, () => {
                    this.updateCleaningWorkDescription();
                });
            }
        });

        // Lyssna på nummer-input för små rutor
        const antalRutorInput = document.getElementById('fp_antal_rutor');
        if (antalRutorInput) {
            antalRutorInput.addEventListener('input', () => {
                this.calculateCleaningPrice();
                this.updateCleaningWorkDescription();
            });
        }

        // Lyssna på select-fält för fönsterputs
        const fonsterputsSelects = ['fp_fastighet', 'fp_fonstertyp', 'fp_antal_sidor'];
        fonsterputsSelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                select.addEventListener('change', () => {
                    this.calculateCleaningPrice();
                    this.updateCleaningWorkDescription();
                });
            }
        });
        
        // Lyssna på number-inputs för fönsterputs
        const fonsterputsNumbers = ['fp_antal_fonster'];
        fonsterputsNumbers.forEach(numberId => {
            const input = document.getElementById(numberId);
            if (input) {
                input.addEventListener('input', () => {
                    this.calculateCleaningPrice();
                    this.updateCleaningWorkDescription();
                });
            }
        });

        // Lyssna på alla radiobuttons för fönsterputs
        const radioGroups = [
            'fp_oppning', 'fp_sprojs', 'fp_sprojs_typ', 'fp_rengoring', 
            'fp_karmar', 'fp_stege', 'fp_skylift'
        ];
        
        radioGroups.forEach(groupName => {
            const radios = document.querySelectorAll(`input[name="${groupName}"]`);
            radios.forEach(radio => {
                radio.addEventListener('change', () => {
                    // Hantera spröjs-logik
                    if (groupName === 'fp_sprojs') {
                        this.handleSprojsSelection(radio.value);
                    }
                    if (groupName === 'fp_sprojs_typ') {
                        this.handleSprojsTypeSelection(radio.value);
                    }
                    
                    this.calculateCleaningPrice();
                    this.updateCleaningWorkDescription();
                });
            });
        });
    }

    handleSprojsSelection(value) {
        const sprojsDetaljer = document.getElementById('fp_sprojs_detaljer');
        const antalRutorSection = document.getElementById('fp_antal_rutor_section');
        
        if (value === 'ja') {
            sprojsDetaljer.style.display = 'block';
        } else {
            sprojsDetaljer.style.display = 'none';
            if (antalRutorSection) {
                antalRutorSection.style.display = 'none';
            }
            
            // Rensa spröjs-relaterade fält
            const sprojsRadios = document.querySelectorAll('input[name="fp_sprojs_typ"]');
            sprojsRadios.forEach(radio => radio.checked = false);
            
            const antalRutorInput = document.getElementById('fp_antal_rutor');
            if (antalRutorInput) antalRutorInput.value = '';
        }
    }

    handleSprojsTypeSelection(value) {
        const antalRutorSection = document.getElementById('fp_antal_rutor_section');
        
        if (value === 'fast' && antalRutorSection) {
            antalRutorSection.style.display = 'block';
        } else if (antalRutorSection) {
            antalRutorSection.style.display = 'none';
            const antalRutorInput = document.getElementById('fp_antal_rutor');
            if (antalRutorInput) antalRutorInput.value = '';
        }
    }
    
    toggleHemstadningSchema(show) {
        const hemstadningSchema = document.getElementById('hemstadning-schema');
        if (hemstadningSchema) {
            hemstadningSchema.style.display = show ? 'block' : 'none';
            console.log(`${show ? '✅' : '❌'} Hemstädning schema ${show ? 'visas' : 'döljs'}`);
        }
    }
    
    updateEstimatedTime() {
        const bostadstyp = document.getElementById('bostadstyp')?.value;
        const estimatedTimeDisplay = document.getElementById('estimated-time-display');
        const estimatedTimeText = document.getElementById('estimated-time-text');
        
        const estimatedTimes = {
            '1a_30kvm': '1,5-2 timmar',
            '1a_40kvm': '2-2,5 timmar', 
            '2a_50kvm': '2,5-3 timmar',
            '2a_60kvm': '3-3,5 timmar',
            '3a_70kvm': '3,5-4 timmar',
            '4a_90kvm': '4-5 timmar',
            'enplansvilla_100kvm': '4-6 timmar',
            'tvåplansvilla_140kvm': '6-8 timmar'
        };
        
        if (bostadstyp && estimatedTimes[bostadstyp]) {
            if (estimatedTimeDisplay) estimatedTimeDisplay.style.display = 'block';
            if (estimatedTimeText) estimatedTimeText.textContent = `Estimerad tid: ${estimatedTimes[bostadstyp]}`;
            console.log(`⏱️ Estimerad tid uppdaterad: ${estimatedTimes[bostadstyp]}`);
        } else {
            if (estimatedTimeDisplay) estimatedTimeDisplay.style.display = 'none';
            if (estimatedTimeText) estimatedTimeText.textContent = 'Välj bostadstyp för att se estimerad tid';
        }
    }
    
    copyCustomerDataToWorkDescription() {
        // Kopiera kundinformation till arbetsbeskrivning-formuläret
        const mappings = {
            'customer-company': 'arb-company',
            'customer-contact': 'arb-contact_person', 
            'customer-email': 'arb-email',
            'customer-phone': 'arb-phone',
            'customer-address': 'arb-address',
            'customer-fastighetsbeteckning': 'arb-fastighetsbeteckning',
            'customer-postal-code': 'arb-postal_code',
            'customer-city': 'arb-city'
        };
        
        Object.entries(mappings).forEach(([sourceId, targetId]) => {
            const sourceField = document.getElementById(sourceId);
            const targetField = document.getElementById(targetId);
            
            if (sourceField && targetField) {
                targetField.value = sourceField.value;
            }
        });
        
        console.log('✅ Kundinformation kopierad till arbetsbeskrivning');
    }

    handleServiceSelection(checkbox) {
        const fonsterputsTillagg = document.getElementById('fonsterputs-tillagg');
        
        // Visa/dölj fönsterputs-tillägg beroende på om fönsterputs är valt
        if (checkbox.value === 'fonsterputs') {
            if (checkbox.checked) {
                fonsterputsTillagg.style.display = 'block';
            } else {
                fonsterputsTillagg.style.display = 'none';
                // Rensa fönsterputs-fält när det döljs
                this.clearWindowCleaningFields();
            }
        }
    }

    clearWindowCleaningFields() {
        // Rensa select-fält
        const selectFields = ['fp_fastighet', 'fp_fonstertyp', 'fp_antal_sidor'];
        selectFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.selectedIndex = 0;
            }
        });
        
        // Rensa number inputs
        const numberFields = ['fp_antal_fonster', 'fp_antal_rutor'];
        numberFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = '';
            }
        });
        
        // Rensa alla radiobuttons
        const radioGroups = [
            'fp_oppning', 'fp_sprojs', 'fp_sprojs_typ', 'fp_rengoring',
            'fp_karmar', 'fp_stege', 'fp_skylift'
        ];
        
        radioGroups.forEach(groupName => {
            const radios = document.querySelectorAll(`input[name="${groupName}"]`);
            radios.forEach(radio => radio.checked = false);
        });
        
        // Dölj villkorliga sektioner
        const sprojsDetaljer = document.getElementById('fp_sprojs_detaljer');
        if (sprojsDetaljer) {
            sprojsDetaljer.style.display = 'none';
        }
        
        const antalRutorSection = document.getElementById('fp_antal_rutor_section');
        if (antalRutorSection) {
            antalRutorSection.style.display = 'none';
        }
        
        // Dölj prisvisning
        const priceDisplay = document.getElementById('fonsterputs-price-display');
        if (priceDisplay) {
            priceDisplay.style.display = 'none';
        }
    }

    calculateCleaningPrice() {
        console.log('💰 Beräknar städtjänster-priser');
        
        const bostadstyp = document.getElementById('bostadstyp')?.value;
        const stadfrekvens = document.getElementById('stadfrekvens')?.value;
        
        let grundpris = 0;
        let tillaggerKostnad = 0;
        
        // Beräkna grundpris baserat på bostadstyp och frekvens
        if (bostadstyp && stadfrekvens && CONFIG.CLEANING_PRICING.BASE_PRICES[bostadstyp]) {
            grundpris = CONFIG.CLEANING_PRICING.BASE_PRICES[bostadstyp][stadfrekvens] || 0;
        }

        // Beräkna tilläggstjänster
        const selectedServices = document.querySelectorAll('input[name="stadtjanster"]:checked');
        selectedServices.forEach(service => {
            if (service.value !== 'hemstadning' && service.value !== 'fonsterputs') {
                tillaggerKostnad += CONFIG.CLEANING_PRICING.SERVICES[service.value] || 0;
            }
        });

        // Beräkna fönsterputs-tillägg med nya detaljerade priser
        const fonsterputsChecked = document.getElementById('fonsterputs')?.checked;
        if (fonsterputsChecked) {
            const fonsterputsPris = this.calculateWindowCleaningPrice();
            tillaggerKostnad += fonsterputsPris;
            // Visa fönsterputs-pris separat
            this.updateWindowCleaningPriceDisplay(fonsterputsPris);
        } else {
            // Dölj fönsterputs-prisvisning om inte valt
            this.updateWindowCleaningPriceDisplay(0);
        }
        
        // Beräkna totalpris
        let totalPris = grundpris + tillaggerKostnad;
        
        // Lägg till akuttjänst-tillägg (50%)
        const akutServiceChecked = document.getElementById('akut-service')?.checked;
        if (akutServiceChecked) {
            const akutTillagg = totalPris * 0.5; // 50% tillägg
            tillaggerKostnad += akutTillagg;
            console.log(`🚨 Akuttjänst-tillägg (50%): ${akutTillagg} kr`);
        }

        // Uppdatera prisvisning
        this.updateCleaningPriceDisplay(grundpris, tillaggerKostnad);
    }

    calculateWindowCleaningPrice() {
        console.log('🪟 Beräknar fönsterputs-pris');
        
        // Hämta alla värden från nya formuläret
        const fastighet = document.getElementById('fp_fastighet')?.value;
        const fonstertyp = document.getElementById('fp_fonstertyp')?.value;
        const oppning = document.querySelector('input[name="fp_oppning"]:checked')?.value;
        const rengoring = document.querySelector('input[name="fp_rengoring"]:checked')?.value;
        const antalFonster = parseInt(document.getElementById('fp_antal_fonster')?.value) || 0;
        const antalSidor = document.getElementById('fp_antal_sidor')?.value;
        
        // Kontrollera grundläggande krav
        if (!fonstertyp || !fastighet || antalFonster <= 0) {
            console.log('⚠️ Saknar obligatoriska fönsterputs-värden');
            this.updateWindowCleaningPriceDisplay(0);
            return 0;
        }

        // Beräkna grundpris per fönster
        let grundPrisPerFonster = CONFIG.CLEANING_PRICING.WINDOW_CLEANING.BASE_PRICES[fonstertyp] || 0;
        console.log(`📊 Grundpris per fönster (${fonstertyp}): ${grundPrisPerFonster} kr`);
        
        // Applicera fastighetstyp multiplikator
        const fastighetMultiplikator = CONFIG.CLEANING_PRICING.WINDOW_CLEANING.PROPERTY_MULTIPLIERS[fastighet] || 1.0;
        grundPrisPerFonster *= fastighetMultiplikator;
        console.log(`🏠 Efter fastighetstyp (${fastighet}): ${grundPrisPerFonster} kr per fönster`);
        
        // Applicera öppningstyp multiplikator
        if (oppning) {
            const oppningMultiplikator = CONFIG.CLEANING_PRICING.WINDOW_CLEANING.OPENING_MULTIPLIERS[oppning] || 1.0;
            grundPrisPerFonster *= oppningMultiplikator;
            console.log(`🚪 Efter öppningstyp (${oppning}): ${grundPrisPerFonster} kr per fönster`);
        }
        
        // Applicera rengöringstyp multiplikator
        if (rengoring) {
            const rengoringMultiplikator = CONFIG.CLEANING_PRICING.WINDOW_CLEANING.CLEANING_TYPE_MULTIPLIERS[rengoring] || 1.0;
            grundPrisPerFonster *= rengoringMultiplikator;
            console.log(`🧹 Efter rengöringstyp (${rengoring}): ${grundPrisPerFonster} kr per fönster`);
        }
        
        // Applicera sidor multiplikator
        if (antalSidor) {
            const sideMultiplikator = CONFIG.CLEANING_PRICING.WINDOW_CLEANING.SIDES_MULTIPLIERS[antalSidor] || 1.0;
            grundPrisPerFonster *= sideMultiplikator;
            console.log(`📐 Efter antal sidor (${antalSidor}): ${grundPrisPerFonster} kr per fönster`);
        }
        
        // Beräkna totalpris för alla fönster
        let totalPris = grundPrisPerFonster * antalFonster;
        console.log(`💰 Grundtotal (${grundPrisPerFonster} × ${antalFonster}): ${totalPris} kr`);

        // Hantera spröjs-tillägg
        const sprojs = document.querySelector('input[name="fp_sprojs"]:checked')?.value;
        if (sprojs === 'ja') {
            const sprojsTyp = document.querySelector('input[name="fp_sprojs_typ"]:checked')?.value;
            if (sprojsTyp) {
                const sprojsAvgift = CONFIG.CLEANING_PRICING.WINDOW_CLEANING.SPROJS_FEES[sprojsTyp] || 0;
                const totalSprojsAvgift = sprojsAvgift * antalFonster;
                totalPris += totalSprojsAvgift;
                console.log(`🪟 Spröjs tillägg (${sprojsTyp}): ${sprojsAvgift} kr × ${antalFonster} = ${totalSprojsAvgift} kr`);
                
                // Extra avgift för små rutor om fast spröjs
                if (sprojsTyp === 'fast') {
                    const antalRutor = parseInt(document.getElementById('fp_antal_rutor')?.value) || 0;
                    if (antalRutor > 0) {
                        const rutorAvgift = antalRutor * CONFIG.CLEANING_PRICING.WINDOW_CLEANING.RUTA_FEE * antalFonster;
                        totalPris += rutorAvgift;
                        console.log(`🔢 Rutor tillägg: ${antalRutor} rutor × ${CONFIG.CLEANING_PRICING.WINDOW_CLEANING.RUTA_FEE} kr × ${antalFonster} fönster = ${rutorAvgift} kr`);
                    }
                }
            }
        }

        // Hantera tillgänglighetstillägg
        const karmar = document.querySelector('input[name="fp_karmar"]:checked')?.value;
        const stege = document.querySelector('input[name="fp_stege"]:checked')?.value;
        const skylift = document.querySelector('input[name="fp_skylift"]:checked')?.value;
        
        if (karmar === 'ja') {
            const karmarAvgift = CONFIG.CLEANING_PRICING.WINDOW_CLEANING.ACCESSIBILITY_FEES['karmar_ja'] * antalFonster;
            totalPris += karmarAvgift;
            console.log(`🪟 Karmar tillägg: ${CONFIG.CLEANING_PRICING.WINDOW_CLEANING.ACCESSIBILITY_FEES['karmar_ja']} kr × ${antalFonster} = ${karmarAvgift} kr`);
        }
        
        if (stege === 'ja') {
            const stegeAvgift = CONFIG.CLEANING_PRICING.WINDOW_CLEANING.ACCESSIBILITY_FEES['stege_ja'];
            totalPris += stegeAvgift;
            console.log(`🪜 Stege tillägg: ${stegeAvgift} kr`);
        }
        
        if (skylift === 'ja') {
            const skyliftAvgift = CONFIG.CLEANING_PRICING.WINDOW_CLEANING.ACCESSIBILITY_FEES['skylift_ja'];
            totalPris += skyliftAvgift;
            console.log(`🏗️ Skylift tillägg: ${skyliftAvgift} kr`);
        }

        totalPris = Math.round(totalPris);
        console.log(`💰 Total fönsterputs kostnad: ${totalPris} kr`);

        // Uppdatera fönsterputs-prisvisning
        this.updateWindowCleaningPriceDisplay(totalPris);

        return totalPris;
    }

    updateWindowCleaningPriceDisplay(pris) {
        const fonsterputsPriceElement = document.getElementById('fonsterputs-price');
        const priceDisplay = document.getElementById('fonsterputs-price-display');
        
        if (fonsterputsPriceElement) {
            fonsterputsPriceElement.textContent = `${pris} kr`;
        }
        
        // Visa/dölj prisvisning beroende på om det finns ett pris
        if (priceDisplay) {
            if (pris > 0) {
                priceDisplay.style.display = 'block';
            } else {
                priceDisplay.style.display = 'none';
            }
        }
    }

    updateCleaningPriceDisplay(grundpris, tillaggerKostnad) {
        // Uppdatera grundpris
        const stadtGrundprisElement = document.getElementById('stad-grundpris');
        if (stadtGrundprisElement) {
            stadtGrundprisElement.textContent = `${grundpris} kr`;
        }
        
        // Beräkna totalpris före moms
        const subtotal = grundpris + tillaggerKostnad;
        
        // Uppdatera subtotal (exkl moms)
        const subtotalElement = document.getElementById('subtotal-price-display');
        if (subtotalElement) {
            subtotalElement.textContent = `${subtotal} kr`;
        }
        
        // Beräkna moms (25%)
        const vatAmount = subtotal * 0.25;
        const totalWithVat = subtotal + vatAmount;
        
        // Uppdatera total inkl moms
        const totalWithVatElement = document.getElementById('total-with-vat');
        if (totalWithVatElement) {
            totalWithVatElement.textContent = `${totalWithVat} kr`;
        }
        
        // Slutpris (samma som inkl moms för denna app)
        const finalPriceElement = document.getElementById('final-customer-price');
        if (finalPriceElement) {
            finalPriceElement.textContent = `${totalWithVat} kr`;
        }
        
        // Visa/dölj akuttjänst-rad
        const akutServiceChecked = document.getElementById('akut-service')?.checked;
        const akutPriceRow = document.getElementById('akut-price-row');
        const akutTillaggPriceElement = document.getElementById('akut-tillagg-price');
        
        if (akutServiceChecked && akutPriceRow && akutTillaggPriceElement) {
            const akutTillagg = (grundpris + tillaggerKostnad) * 0.5;
            akutTillaggPriceElement.textContent = `${akutTillagg} kr`;
            akutPriceRow.style.display = 'flex';
        } else if (akutPriceRow) {
            akutPriceRow.style.display = 'none';
        }
        
        // Visa/dölj fönster-rad
        const fonsterputsChecked = document.getElementById('fonsterputs')?.checked;
        const fonsterPriceRow = document.getElementById('fonster-price-row');
        
        if (fonsterputsChecked && fonsterPriceRow) {
            fonsterPriceRow.style.display = 'flex';
        } else if (fonsterPriceRow) {
            fonsterPriceRow.style.display = 'none';
        }
        
        // Visa prissektion om det finns något pris
        const priceSection = document.getElementById('main-price-section');
        if (priceSection) {
            if (grundpris > 0 || tillaggerKostnad > 0) {
                priceSection.style.display = 'block';
            } else {
                priceSection.style.display = 'none';
            }
        }
    }

    updateCleaningWorkDescription() {
        console.log('📝 Uppdaterar arbetsbeskrivning för städtjänster');
        
        const workDescriptionTextarea = document.getElementById('arb-beskrivning');
        if (!workDescriptionTextarea) {
            console.warn('❌ Arbetsbeskrivning-fält hittades inte');
            return;
        }

        // Hämta grundinformation
        const bostadstyp = document.getElementById('bostadstyp')?.value;
        const stadfrekvens = document.getElementById('stadfrekvens')?.value;
        const selectedServices = document.querySelectorAll('input[name="stadtjanster"]:checked');
        const akutService = document.getElementById('akut-service')?.checked;

        // Skapa arbetsbeskrivning i Solida Måleri stil
        let workDescription = "";

        // Kontrollera om några tjänster är valda
        if (selectedServices.length === 0 && !bostadstyp) {
            workDescription = "Välj tjänster under Anbud-fliken så genereras en detaljerad arbetsbeskrivning automatiskt här.";
            workDescriptionTextarea.value = workDescription;
            return;
        }

        // Huvudrubrik
        workDescription += "SOLIDA STÄD & FÖNSTERPUTS AB\n";
        workDescription += "ARBETSBESKRIVNING\n\n";

        // Grundinformation
        if (bostadstyp && stadfrekvens) {
            const bostadstypText = document.querySelector(`#bostadstyp option[value="${bostadstyp}"]`)?.textContent || '';
            const frekvensText = document.querySelector(`#stadfrekvens option[value="${stadfrekvens}"]`)?.textContent || '';
            
            workDescription += "UPPDRAGSINFO:\n";
            workDescription += `Bostadstyp: ${bostadstypText}\n`;
            workDescription += `Frekvens: ${frekvensText}\n`;
            
            if (akutService) {
                workDescription += "AKUTTJÄNST: Ja (+50% tillägg)\n";
            }
            
            workDescription += "\n" + "=".repeat(60) + "\n\n";
        }

        // Lägg till detaljerade beskrivningar för valda tjänster
        if (selectedServices.length > 0) {
            selectedServices.forEach(service => {
                const serviceValue = service.value;
                console.log('🔍 Service value:', serviceValue);
                console.log('🔍 SERVICE_DESCRIPTIONS:', CONFIG.CLEANING_PRICING.SERVICE_DESCRIPTIONS);
                const serviceDescription = CONFIG.CLEANING_PRICING.SERVICE_DESCRIPTIONS[serviceValue];
                console.log('🔍 Found description:', serviceDescription);
                
                if (serviceDescription) {
                    workDescription += serviceDescription.title + "\n\n";
                    workDescription += serviceDescription.content + "\n\n";
                    workDescription += "=".repeat(60) + "\n\n";
                } else {
                    console.warn('❌ Ingen beskrivning hittades för:', serviceValue);
                }
                
                // Lägg till fönsterputs-detaljer om det är valt
                if (serviceValue === 'fonsterputs') {
                    const fastighet = document.getElementById('fp_fastighet')?.value;
                    const fonstertyp = document.getElementById('fp_fonstertyp')?.value;
                    const oppning = document.querySelector('input[name="fp_oppning"]:checked')?.value;
                    const rengoring = document.querySelector('input[name="fp_rengoring"]:checked')?.value;
                    const antalFonster = document.getElementById('fp_antal_fonster')?.value;
                    const antalSidor = document.getElementById('fp_antal_sidor')?.value;
                    const sprojs = document.querySelector('input[name="fp_sprojs"]:checked')?.value;
                    const sprojsTyp = document.querySelector('input[name="fp_sprojs_typ"]:checked')?.value;
                    const antalRutor = document.getElementById('fp_antal_rutor')?.value;
                    const karmar = document.querySelector('input[name="fp_karmar"]:checked')?.value;
                    const stege = document.querySelector('input[name="fp_stege"]:checked')?.value;
                    const skylift = document.querySelector('input[name="fp_skylift"]:checked')?.value;

                    if (fastighet && fonstertyp) {
                        workDescription += "FÖNSTERPUTS TILLÄGG - DETALJER:\n";
                        
                        // Fastighetstyp
                        const fastighetOptions = {
                            'villa_radhus': 'Villa/Radhus',
                            'lagenhet': 'Lägenhet', 
                            'affarslokal': 'Affärslokal',
                            'kommersiell_lokal': 'Kommersiell lokal',
                            'restaurang': 'Restaurang'
                        };
                        workDescription += `• Fastighetstyp: ${fastighetOptions[fastighet] || fastighet}\n`;
                        
                        // Fönstertyp
                        const fonstertypOptions = {
                            'standardfonster': 'Standardfönster',
                            'blandat': 'Blandat',
                            'stora_partier': 'Stora fönsterpartier'
                        };
                        workDescription += `• Fönstertyp: ${fonstertypOptions[fonstertyp] || fonstertyp}\n`;
                        
                        // Öppning
                        if (oppning) {
                            const oppningOptions = {
                                'utat': 'Öppnas utåt',
                                'inat': 'Öppnas inåt', 
                                'gar_ej_oppna': 'Går ej att öppna'
                            };
                            workDescription += `• Öppning: ${oppningOptions[oppning] || oppning}\n`;
                        }
                        
                        // Rengöringstyp
                        if (rengoring) {
                            const rengoringOptions = {
                                'invandig_utvandig': 'Invändig och utvändig rengöring',
                                'bara_invandig': 'Bara invändig rengöring',
                                'bara_utvandig': 'Bara utvändig rengöring'
                            };
                            workDescription += `• Rengöringstyp: ${rengoringOptions[rengoring] || rengoring}\n`;
                        }
                        
                        // Antal fönster och sidor
                        if (antalFonster) {
                            workDescription += `• Antal fönster: ${antalFonster} st\n`;
                        }
                        if (antalSidor) {
                            workDescription += `• Antal sidor att putsa: ${antalSidor} sidor\n`;
                        }
                        
                        // Spröjs-information
                        if (sprojs === 'ja' && sprojsTyp) {
                            const sprojsOptions = {
                                'fast': 'Fönster med fast spröjs',
                                'lostagbart': 'Fönster med löstagbart spröjs'
                            };
                            let sprojsText = sprojsOptions[sprojsTyp] || sprojsTyp;
                            if (sprojsTyp === 'fast' && antalRutor && parseInt(antalRutor) > 0) {
                                sprojsText += ` (${antalRutor} små rutor per fönster)`;
                            }
                            workDescription += `• Spröjs: ${sprojsText}\n`;
                        } else if (sprojs === 'nej') {
                            workDescription += "• Spröjs: Inga spröjs\n";
                        }
                        
                        // Tillgänglighetskrav
                        const tillganglighetKrav = [];
                        if (karmar === 'ja') tillganglighetKrav.push('Fönsterkarmar rengörs och torkas');
                        if (stege === 'ja') tillganglighetKrav.push('Stege behövs för åtkomst');
                        if (skylift === 'ja') tillganglighetKrav.push('Skylift/kran behövs');
                        
                        if (tillganglighetKrav.length > 0) {
                            workDescription += `• Särskilda krav: ${tillganglighetKrav.join(', ')}\n`;
                        }
                        
                        workDescription += "\nFönsterputs utförs professionellt med miljövänliga rengöringsmedel. Priset inkluderar all utrustning och säker åtkomst till fönstren.\n\n";
                    }
                }
            });
        }

        // Lägg till kundinformation
        const customerCompany = document.getElementById('customer-company')?.value;
        const customerContact = document.getElementById('customer-contact')?.value;
        const customerEmail = document.getElementById('customer-email')?.value;
        const customerPhone = document.getElementById('customer-phone')?.value;
        const customerAddress = document.getElementById('customer-address')?.value;
        const customerPostalCode = document.getElementById('customer-postal-code')?.value;
        const customerCity = document.getElementById('customer-city')?.value;
        
        if (customerCompany || customerEmail || customerPhone) {
            workDescription += "KUNDINFORMATION:\n";
            if (customerCompany) workDescription += `• Företag/Namn: ${customerCompany}\n`;
            if (customerContact) workDescription += `• Kontaktperson: ${customerContact}\n`;
            if (customerEmail) workDescription += `• E-post: ${customerEmail}\n`;
            if (customerPhone) workDescription += `• Telefon: ${customerPhone}\n`;
            if (customerAddress) workDescription += `• Adress: ${customerAddress}\n`;
            if (customerPostalCode && customerCity) workDescription += `• Ort: ${customerPostalCode} ${customerCity}\n`;
            workDescription += "\n";
        }
        
        // Lägg till akut/jourservice information (akutService redan deklarerad ovan)
        if (akutService) {
            workDescription += "AKUTTJÄNST:\n";
            workDescription += "• Samma dag eller nästa dag-tjänst begärd\n";
            workDescription += "• Pristillägg: +50%\n\n";
        }
        
        // Lägg till hemstädning schema (om hemstädning är vald)
        const hemstadningChecked = document.getElementById('hemstadning')?.checked;
        if (hemstadningChecked) {
            const preferredDay = document.getElementById('preferred-day')?.value;
            const preferredTime = document.getElementById('preferred-time')?.value;
            const startDate = document.getElementById('start-date')?.value;
            
            if (preferredDay || preferredTime || startDate) {
                workDescription += "SCHEMA HEMSTÄDNING:\n";
                if (preferredDay) workDescription += `• Föredragen dag: ${preferredDay}\n`;
                if (preferredTime) workDescription += `• Föredragen tid: ${preferredTime}\n`;
                if (startDate) workDescription += `• Startdatum: ${startDate}\n`;
                workDescription += "\n";
            }
        }
        
        // Lägg till tillgänglighet & nyckelhantering
        const accessMethod = document.getElementById('access-method')?.value;
        if (accessMethod) {
            workDescription += "ÅTKOMST:\n";
            workDescription += `• Åtkomst till fastigheten: ${accessMethod}\n\n`;
        }
        
        // Lägg till husdjur & allergier
        const pets = document.getElementById('pets')?.value;
        const allergies = document.getElementById('allergies')?.value;
        if (pets || allergies) {
            workDescription += "SÄRSKILDA KRAV:\n";
            if (pets && pets !== 'nej') workDescription += `• Husdjur: ${pets}\n`;
            if (allergies) workDescription += `• Allergier/Önskemål: ${allergies}\n`;
            workDescription += "\n";
        }
        
        // Lägg till parkering
        const parking = document.getElementById('parking')?.value;
        if (parking) {
            workDescription += "PARKERING:\n";
            workDescription += `• Parkeringsmöjligheter: ${parking}\n\n`;
        }

        // Lägg till allmän information och garanti
        if (selectedServices.length > 0) {
            workDescription += "UTFÖRANDE OCH GARANTI:\n";
            workDescription += "• Professionell städning utförs av erfaren personal\n";
            workDescription += "• Användning av miljövänliga rengöringsmedel\n";
            workDescription += "• All utrustning och material ingår\n";
            workDescription += "• Kvalitetsgaranti på utfört arbete\n";
            workDescription += "• RUT-avdrag kan tillämpas (50% skattereduktion)\n\n";
        }

        // Lägg till slutinformation
        workDescription += "UTFÖRANDE:\n";
        workDescription += "• Professionell städning med erfaren personal\n";
        workDescription += "• Miljövänliga rengöringsmedel används\n";
        workDescription += "• All nödvändig utrustning ingår\n";
        workDescription += "• Kvalitetsgaranti på utfört arbete\n\n";
        
        workDescription += "Med vänliga hälsningar,\n";
        workDescription += "SOLIDA STÄD & FÖNSTERPUTS AB";

        // Uppdatera arbetsbeskrivningsfältet
        workDescriptionTextarea.value = workDescription;
        
        console.log('✅ Arbetsbeskrivning uppdaterad för städtjänster');
    }
    
    showNavigationBar() {
        const navigationBar = document.querySelector('.navigation-bar');
        if (navigationBar) {
            navigationBar.classList.add('visible');
            console.log('✅ Navigation bar visas från QuoteCalculator');
        } else {
            console.warn('⚠️ Navigation bar hittades inte från QuoteCalculator');
        }
    }
}

// =================
// ADDITIONAL SERVICE MANAGER
// =================
class AdditionalServiceManager {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isDrawing = false;
        this.hasSignature = false;
        
        this.setupModal();
        this.setupSignatureCanvas();
        this.setupEventListeners();
    }
    
    setupModal() {
        this.modal = document.getElementById('additional-service-modal');
        this.form = document.getElementById('tillaggtjanst-form');
        this.openBtn = document.getElementById('additional-service-btn');
        this.closeBtn = document.getElementById('additional-service-close');
        this.cancelBtn = document.getElementById('additional-service-cancel');
    }
    
    setupSignatureCanvas() {
        // Setup fullscreen signature elements
        this.signatureModal = document.getElementById('signature-fullscreen-modal');
        this.fullscreenCanvas = document.getElementById('signature-fullscreen-canvas');
        this.signaturePreview = document.getElementById('tillagg-signature-preview');
        this.signaturePlaceholder = this.signaturePreview?.querySelector('.signature-placeholder');
        this.signatureImage = document.getElementById('tillagg-signature-image');
        
        // Setup fullscreen canvas
        if (this.fullscreenCanvas) {
            this.fullscreenCtx = this.fullscreenCanvas.getContext('2d');
            this.setupFullscreenCanvasStyles();
        }
        
        // Signature data storage
        this.signatureBase64 = null;
    }
    
    resizeFullscreenCanvas() {
        if (!this.fullscreenCanvas || !this.fullscreenCtx) return;
        
        // Get device pixel ratio for high DPI support
        const dpr = window.devicePixelRatio || 1;
        const rect = this.fullscreenCanvas.getBoundingClientRect();
        
        // Set the internal size to the display size multiplied by dpr
        this.fullscreenCanvas.width = rect.width * dpr;
        this.fullscreenCanvas.height = rect.height * dpr;
        
        // Scale the context to ensure correct drawing operations
        this.fullscreenCtx.scale(dpr, dpr);
        
        // Set the display size to the original size
        this.fullscreenCanvas.style.width = rect.width + 'px';
        this.fullscreenCanvas.style.height = rect.height + 'px';
        
        this.setupFullscreenCanvasStyles();
    }
    
    setupFullscreenCanvasStyles() {
        if (!this.fullscreenCtx) return;
        
        this.fullscreenCtx.strokeStyle = '#000000'; // Black for clear signature
        this.fullscreenCtx.lineWidth = 4; // Optimal thickness for mobile
        this.fullscreenCtx.lineCap = 'round';
        this.fullscreenCtx.lineJoin = 'round';
        this.fullscreenCtx.imageSmoothingEnabled = true;
        this.fullscreenCtx.imageSmoothingQuality = 'high';
    }
    
    setupEventListeners() {
        // Modal open/close
        if (this.openBtn) {
            this.openBtn.addEventListener('click', () => this.openModal());
        }
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closeModal());
        }
        
        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => this.closeModal());
        }
        
        // Close modal when clicking outside
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });
        }
        
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        // Fullscreen signature button (tab version)
        const fullscreenBtn = document.getElementById('tillagg-signature-fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.openFullscreenSignature());
        }
        
        // Clear signature button (tab version)
        const clearBtn = document.getElementById('tillagg-clear-signature');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearSignature());
        }
        
        // Fullscreen signature controls
        const fullscreenClearBtn = document.getElementById('signature-fullscreen-clear');
        const fullscreenCancelBtn = document.getElementById('signature-fullscreen-cancel');
        const fullscreenSaveBtn = document.getElementById('signature-fullscreen-save');
        
        if (fullscreenClearBtn) {
            fullscreenClearBtn.addEventListener('click', () => this.clearFullscreenSignature());
        }
        
        if (fullscreenCancelBtn) {
            fullscreenCancelBtn.addEventListener('click', () => this.closeFullscreenSignature());
        }
        
        if (fullscreenSaveBtn) {
            fullscreenSaveBtn.addEventListener('click', () => this.saveFullscreenSignature());
        }
        
        // Fullscreen signature canvas events
        this.setupFullscreenCanvasEvents();
        
        // Window resize listener for fullscreen canvas
        window.addEventListener('resize', () => {
            if (this.signatureModal && this.signatureModal.style.display !== 'none') {
                setTimeout(() => this.resizeFullscreenCanvas(), 100);
            }
        });
    }
    
    setupFullscreenCanvasEvents() {
        if (!this.fullscreenCanvas) return;
        
        // Mouse events
        this.fullscreenCanvas.addEventListener('mousedown', (e) => this.startFullscreenDrawing(e));
        this.fullscreenCanvas.addEventListener('mousemove', (e) => this.drawFullscreen(e));
        this.fullscreenCanvas.addEventListener('mouseup', () => this.stopFullscreenDrawing());
        this.fullscreenCanvas.addEventListener('mouseout', () => this.stopFullscreenDrawing());
        
        // Touch events for mobile
        this.fullscreenCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (e.touches.length === 1) {
                this.startFullscreenDrawing(e);
            }
        }, { passive: false });
        
        this.fullscreenCanvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length === 1) {
                this.drawFullscreen(e);
            }
        }, { passive: false });
        
        this.fullscreenCanvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopFullscreenDrawing();
        }, { passive: false });
        
        this.fullscreenCanvas.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this.stopFullscreenDrawing();
        }, { passive: false });
    }
    
    // Fullscreen signature methods
    openFullscreenSignature() {
        if (!this.signatureModal) return;
        
        // Try to force landscape orientation on mobile
        if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(() => {
                console.log('Could not lock orientation');
            });
        }
        
        // Show modal
        this.signatureModal.style.display = 'flex';
        
        // Initialize canvas after modal is visible
        setTimeout(() => {
            this.resizeFullscreenCanvas();
            this.clearFullscreenSignature();
        }, 100);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
    
    closeFullscreenSignature() {
        if (!this.signatureModal) return;
        
        // Unlock orientation
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
        
        // Hide modal
        this.signatureModal.style.display = 'none';
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
    
    clearFullscreenSignature() {
        if (!this.fullscreenCanvas || !this.fullscreenCtx) return;
        
        // Clear canvas
        this.fullscreenCtx.clearRect(0, 0, this.fullscreenCanvas.width, this.fullscreenCanvas.height);
        
        // Reset drawing state
        this.isDrawing = false;
        this.hasSignature = false;
    }
    
    saveFullscreenSignature() {
        if (!this.fullscreenCanvas || !this.hasSignature) {
            alert('Vänligen signera innan du sparar');
            return;
        }
        
        // Create compressed signature image
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        
        // Set desired output size (higher quality: 800x400px)
        tempCanvas.width = 800;
        tempCanvas.height = 400;
        
        // Fill with white background
        tempCtx.fillStyle = 'white';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        
        // Enable high-quality rendering
        tempCtx.imageSmoothingEnabled = true;
        tempCtx.imageSmoothingQuality = 'high';
        
        // Scale and draw the signature with high quality
        tempCtx.drawImage(this.fullscreenCanvas, 0, 0, tempCanvas.width, tempCanvas.height);
        
        // Convert to base64 PNG with maximum quality
        this.signatureBase64 = tempCanvas.toDataURL('image/png', 1.0);
        
        // Update preview
        this.updateSignaturePreview();
        
        // Close fullscreen modal
        this.closeFullscreenSignature();
        
        // Show confirmation
        this.showSignatureConfirmation();
    }
    
    updateSignaturePreview() {
        if (!this.signatureBase64) return;
        
        // Hide placeholder, show image
        if (this.signaturePlaceholder) {
            this.signaturePlaceholder.style.display = 'none';
        }
        
        if (this.signatureImage) {
            this.signatureImage.src = this.signatureBase64;
            this.signatureImage.style.display = 'block';
        }
        
        // Show clear button
        const clearBtn = document.getElementById('clear-signature');
        if (clearBtn) {
            clearBtn.style.display = 'block';
        }
    }
    
    showSignatureConfirmation() {
        // Create temporary confirmation message
        const confirmation = document.createElement('div');
        confirmation.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #28a745;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
        `;
        confirmation.innerHTML = '✅ Signering sparad!';
        
        document.body.appendChild(confirmation);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (confirmation.parentNode) {
                confirmation.parentNode.removeChild(confirmation);
            }
        }, 3000);
    }
    
    // Fullscreen drawing methods
    startFullscreenDrawing(e) {
        this.isDrawing = true;
        this.hasSignature = true;
        
        const point = this.getEventPoint(e, this.fullscreenCanvas);
        this.fullscreenCtx.beginPath();
        this.fullscreenCtx.moveTo(point.x, point.y);
    }
    
    drawFullscreen(e) {
        if (!this.isDrawing) return;
        
        const point = this.getEventPoint(e, this.fullscreenCanvas);
        this.fullscreenCtx.lineTo(point.x, point.y);
        this.fullscreenCtx.stroke();
    }
    
    stopFullscreenDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.fullscreenCtx.beginPath();
        }
    }
    
    getEventPoint(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        // Calculate accurate coordinates considering device pixel ratio and scaling
        const x = (clientX - rect.left) * (canvas.width / rect.width) / dpr;
        const y = (clientY - rect.top) * (canvas.height / rect.height) / dpr;
        
        return { x, y };
    }
    
    openModal() {
        this.populateCustomerInfo();
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Reset form
        this.form.reset();
        
        // Wait for modal to render then setup canvas properly
        setTimeout(() => {
            this.resizeCanvas();
            this.clearSignature();
        }, 50);
        
        this.hideError();
        this.hideSuccess();
    }
    
    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    populateCustomerInfo() {
        // Auto-fill customer info from main form
        const customerName = document.getElementById('additional-customer-name');
        const customerPhone = document.getElementById('additional-customer-phone');
        const customerAddress = document.getElementById('additional-customer-address');
        
        if (customerName) {
            const firstName = document.getElementById('first_name')?.value || '';
            const lastName = document.getElementById('last_name')?.value || '';
            const company = document.getElementById('company_name')?.value || '';
            customerName.value = company ? `${firstName} ${lastName} (${company})` : `${firstName} ${lastName}`;
        }
        
        if (customerPhone) {
            customerPhone.value = document.getElementById('phone_number')?.value || '';
        }
        
        if (customerAddress) {
            const street = document.getElementById('street_address')?.value || '';
            const postal = document.getElementById('postal_code')?.value || '';
            const city = document.getElementById('city')?.value || '';
            customerAddress.value = `${street}, ${postal} ${city}`;
        }
    }
    
    getCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
        
        return {
            x: (clientX - rect.left) * (scaleX / (window.devicePixelRatio || 1)),
            y: (clientY - rect.top) * (scaleY / (window.devicePixelRatio || 1))
        };
    }
    
    startDrawing(e) {
        this.isDrawing = true;
        const coords = this.getCoordinates(e);
        
        this.ctx.beginPath();
        this.ctx.moveTo(coords.x, coords.y);
    }
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const coords = this.getCoordinates(e);
        
        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.stroke();
        this.hasSignature = true;
    }
    
    stopDrawing() {
        if (this.isDrawing) {
            this.isDrawing = false;
            this.ctx.beginPath();
        }
    }
    
    clearSignature() {
        // Clear the signature preview and hide image
        if (this.signatureImage) {
            this.signatureImage.style.display = 'none';
        }
        
        if (this.signaturePlaceholder) {
            this.signaturePlaceholder.style.display = 'block';
        }
        
        // Clear signature data
        this.signatureBase64 = null;
        this.hasSignature = false;
        
        // Hide clear button
        const clearBtn = document.getElementById('clear-signature');
        if (clearBtn) {
            clearBtn.style.display = 'none';
        }
        
        this.hideError();
    }
    
    getSignatureBase64() {
        return this.signatureBase64;
    }
    
    validateForm() {
        const serviceTypeEl = document.getElementById('tillagg-service-type');
        const servicePriceEl = document.getElementById('tillagg-service-price');
        
        if (!serviceTypeEl || !serviceTypeEl.value.trim()) {
            this.showError('Vänligen ange typ av tilläggstjänst');
            if (serviceTypeEl) serviceTypeEl.focus();
            return false;
        }
        
        const priceValue = servicePriceEl ? parseFloat(servicePriceEl.value) : 0;
        if (!servicePriceEl || !servicePriceEl.value.trim() || isNaN(priceValue) || priceValue <= 0) {
            this.showError('Vänligen ange ett giltigt pris för tilläggstjänsten');
            if (servicePriceEl) servicePriceEl.focus();
            return false;
        }
        
        if (!this.signatureBase64) {
            this.showError('Signatur krävs för att godkänna tilläggstjänsten');
            return false;
        }
        
        return true;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        const submitBtn = document.getElementById('tillagg-submit-btn');
        const spinner = document.getElementById('tillagg-loading-spinner');
        
        // Show loading state
        submitBtn.disabled = true;
        spinner.style.display = 'inline-block';
        
        try {
            const formData = this.collectFormData();
            await this.sendToWebhook(formData);
            this.showSuccess();
        } catch (error) {
            console.error('Error sending additional service:', error);
            this.showError('Ett fel uppstod vid skickning av tilläggstjänsten. Vänligen försök igen.');
        } finally {
            // Hide loading state
            submitBtn.disabled = false;
            spinner.style.display = 'none';
        }
    }
    
    collectFormData() {
        const originalAnbudsId = this.generateAnbudsId();
        
        const nameEl = document.getElementById('tillagg-customer-company');
        const phoneEl = document.getElementById('tillagg-customer-contact');
        const addressEl = document.getElementById('tillagg-customer-address');
        const typeEl = document.getElementById('tillagg-service-type');
        const priceEl = document.getElementById('tillagg-service-price');
        const dateEl = document.getElementById('tillagg-service-date');
        const commentEl = document.getElementById('tillagg-service-comment');
        
        // Signatur-data för Zapier
        const signatureBase64 = this.getSignatureBase64();
        const signatureTimestamp = new Date().toISOString();
        const hasSignature = !!signatureBase64;
        
        return {
            kundInfo: {
                namn: nameEl ? nameEl.value : '',
                telefon: phoneEl ? phoneEl.value : '',
                adress: addressEl ? addressEl.value : ''
            },
            tilläggstyp: typeEl ? typeEl.value : '',
            pris: priceEl ? parseFloat(priceEl.value) || 0 : 0,
            datum: dateEl ? dateEl.value : '',
            kommentar: commentEl ? commentEl.value || '' : '',
            
            // Signatur-data för Zapier-integration
            signatur_base64: signatureBase64,
            signatur_timestamp: signatureTimestamp,
            signatur_tillagd: hasSignature,
            
            // Legacy field för bakåtkompatibilitet
            signaturBild: signatureBase64,
            
            tidsstämpel: signatureTimestamp,
            ursprungligtAnbud: originalAnbudsId,
            källa: 'Solida Städ & Fönsterputs AB - Tilläggstjänst'
        };
    }
    
    generateAnbudsId() {
        // Generate a simple anbud ID based on customer info and timestamp
        const nameEl = document.getElementById('tillagg-customer-company');
        const customerName = nameEl ? nameEl.value : 'UNKNOWN';
        const timestamp = Date.now();
        const nameCode = customerName.replace(/[^A-Z0-9]/gi, '').toUpperCase().substring(0, 6) || 'NONAME';
        return `TILLAGG-${nameCode}-${timestamp}`;
    }
    
    async sendToWebhook(data) {
        const webhookUrl = '/.netlify/functions/submit';
        
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    }
    
    showError(message) {
        const errorEl = document.getElementById('tillagg-signature-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';
        }
    }
    
    hideError() {
        const errorEl = document.getElementById('tillagg-signature-error');
        if (errorEl) {
            errorEl.style.display = 'none';
        }
    }
    
    showSuccess() {
        const formEl = document.getElementById('tillaggtjanst-form');
        const successEl = document.getElementById('tillagg-success-message');
        
        if (formEl) formEl.style.display = 'none';
        if (successEl) successEl.style.display = 'block';
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            if (formEl) formEl.style.display = 'block';
            if (successEl) successEl.style.display = 'none';
            // Reset form
            if (formEl) formEl.reset();
            this.clearSignature();
        }, 5000);
    }
    
    hideSuccess() {
        const successEl = document.getElementById('additional-service-success');
        if (successEl) {
            successEl.style.display = 'none';
        }
    }
    
    // Test function for debugging
    testIntegrity() {
        console.log('🧪 Testing Additional Service Manager integrity...');
        
        const tests = {
            modal: !!this.modal,
            canvas: !!this.canvas,
            context: !!this.ctx,
            openBtn: !!this.openBtn,
            closeBtn: !!this.closeBtn,
            cancelBtn: !!this.cancelBtn,
            form: !!this.form
        };
        
        console.log('Elements found:', tests);
        
        const allElementsFound = Object.values(tests).every(test => test);
        console.log(allElementsFound ? '✅ All elements found' : '❌ Some elements missing');
        
        return allElementsFound;
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 DOM Content Loaded');
    
    // Add a small delay to ensure all elements are rendered
    setTimeout(() => {
        console.log('🚀 Initializing application...');
        window.passwordProtection = new PasswordProtection();
        window.quoteCalculator = new QuoteCalculator();
        window.themeToggle = new ThemeToggle();
        window.additionalServiceManager = new AdditionalServiceManager();
        console.log('✅ Application initialized');
    }, 50);

    // Setup navigation buttons
    const logoutBtn = document.getElementById('logout-btn');
    const resetBtn = document.getElementById('reset-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log('🚪 Logout knapp klickad');
            if (window.passwordProtection) {
                window.passwordProtection.logout();
            } else {
                console.warn('⚠️ passwordProtection är inte tillgängligt');
            }
        });
        console.log('✅ Logout knapp event listener tillagd');
    } else {
        console.warn('⚠️ Logout knapp hittades inte');
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            console.log('🔄 Reset knapp klickad');
            if (window.quoteCalculator) {
                window.quoteCalculator.resetApp();
            } else {
                console.warn('⚠️ quoteCalculator är inte tillgängligt');
            }
        });
        console.log('✅ Reset knapp event listener tillagd');
    } else {
        console.warn('⚠️ Reset knapp hittades inte');
    }
    
    // Theme toggle test
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        console.log('✅ Theme toggle knapp hittad');
    } else {
        console.warn('⚠️ Theme toggle knapp hittades inte');
    }
});

// Backup initialization if DOM event fails
window.addEventListener('load', function() {
    console.log('🌟 Window Load Event');
    
    if (!window.passwordProtection) {
        console.log('🔧 Backup initialization triggered');
        setTimeout(() => {
            window.passwordProtection = new PasswordProtection();
            window.quoteCalculator = new QuoteCalculator();
            window.themeToggle = new ThemeToggle();
            window.additionalServiceManager = new AdditionalServiceManager();
            console.log('✅ Backup initialization complete');
        }, 100);
    }
});

// Global login function for direct testing
window.testDirectLogin = function() {
    console.log('🧪 Direct login test called');
    const passwordInput = document.getElementById('password-input');
    if (passwordInput) {
        passwordInput.value = 'solida123';
        console.log('Password set to:', passwordInput.value);
        
        // Try to login directly
        if (window.passwordProtection) {
            window.passwordProtection.handleLogin();
        } else {
            console.log('❌ PasswordProtection not found, trying direct approach');
            const overlay = document.getElementById('password-overlay');
            const main = document.getElementById('mainContainer');
            if (overlay && main) {
                overlay.style.display = 'none';
                main.style.display = 'block';
                console.log('✅ Direct UI switch completed');
            }
        }
    }
};