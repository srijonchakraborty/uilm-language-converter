/**
 * Main Application class
 * Handles UI interactions and coordinates the translation process
 */
class App {
    constructor() {
        this.currentLanguage = 'en';
        this.initializeEventListeners();
        this.initializeTabs();
    }

    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        // Generate button
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.handleGenerate();
        });

        // Clear button
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.handleClear();
        });

        // Copy button
        document.getElementById('copyBtn').addEventListener('click', () => {
            this.handleCopy();
        });

        // Download button
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.handleDownload();
        });

        // Language tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.currentTarget.dataset.lang;
                this.switchLanguage(lang);
            });
        });

        // Format JSON buttons
        document.querySelectorAll('.input-actions .btn-icon').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.title;
                if (action === 'Format JSON') {
                    this.handleFormatJSON(e);
                } else if (action === 'Clear') {
                    this.handleClearLanguage(e);
                }
            });
        });

        // Initialize drag and drop functionality
        this.initializeDragAndDrop();

        // Auto-save functionality
        this.initializeAutoSave();
    }

    /**
     * Initialize language tabs
     */
    initializeTabs() {
        this.switchLanguage('en');
    }

    /**
     * Switch active language tab
     * @param {string} lang - Language code
     */
    switchLanguage(lang) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-lang="${lang}"]`).classList.add('active');

        // Update language inputs
        document.querySelectorAll('.language-input').forEach(input => {
            input.classList.remove('active');
        });
        document.querySelector(`.language-input[data-lang="${lang}"]`).classList.add('active');

        this.currentLanguage = lang;
    }

    /**
     * Handle generate button click
     */
    async handleGenerate() {
        try {
            Utils.showLoading(true);

            // Get configuration
            const config = this.getConfiguration();

            // Validate configuration
            const validation = TranslationProcessor.validateConfig(config);
            if (!validation.isValid) {
                Utils.showToast(validation.errors.join(', '), 'error');
                return;
            }

            // Process translations
            const result = TranslationProcessor.processTranslations(config);

            // Display result
            this.displayResult(result);

            Utils.showToast('Translations generated successfully!', 'success');

        } catch (error) {
            Utils.showToast(`Error: ${error.message}`, 'error');
        } finally {
            Utils.showLoading(false);
        }
    }

    /**
     * Get configuration from form inputs
     * @returns {Object} Configuration object
     */
    getConfiguration() {
        return {
            moduleId: document.getElementById('moduleId').value.trim(),
            moduleName: document.getElementById('moduleName').value.trim(),
            tenantId: document.getElementById('tenantId').value.trim(),
            englishJson: document.getElementById('englishJson').value.trim(),
            frenchJson: document.getElementById('frenchJson').value.trim(),
            italianJson: document.getElementById('italianJson').value.trim(),
            germanJson: document.getElementById('germanJson').value.trim(),
            isPartiallyTranslated: document.getElementById('isPartiallyTranslated').checked
        };
    }

    /**
     * Display processing result
     * @param {Array} result - Processing result
     */
    displayResult(result) {
        const outputJson = JSON.stringify(result, null, 2);
        document.getElementById('outputJson').textContent = outputJson;

        // Update statistics
        const uniqueLanguages = new Set();
        result.forEach(item => {
            item.Resources.forEach(resource => {
                uniqueLanguages.add(resource.Culture);
            });
        });

        document.getElementById('itemCount').textContent = result.length;
        document.getElementById('languageCount').textContent = uniqueLanguages.size;

        // Store result for copy/download
        this.lastResult = outputJson;
    }

    /**
     * Handle clear button click
     */
    handleClear() {
        if (confirm('Are you sure you want to clear all inputs?')) {
            // Clear configuration inputs
            document.getElementById('moduleId').value = '';
            document.getElementById('moduleName').value = '';
            document.getElementById('tenantId').value = '';
            document.getElementById('isPartiallyTranslated').checked = true;

            // Clear language inputs
            document.getElementById('englishJson').value = '';
            document.getElementById('frenchJson').value = '';
            document.getElementById('italianJson').value = '';
            document.getElementById('germanJson').value = '';

            // Clear output
            document.getElementById('outputJson').textContent = '';
            document.getElementById('itemCount').textContent = '0';
            document.getElementById('languageCount').textContent = '0';

            this.lastResult = null;
            
            // Re-enable drag and drop for all zones
            this.enableDragAndDropForAllZones();
            
            Utils.showToast('All inputs cleared', 'success');
        }
    }

    /**
     * Handle copy button click
     */
    async handleCopy() {
        if (!this.lastResult) {
            Utils.showToast('No output to copy', 'warning');
            return;
        }

        try {
            await Utils.copyToClipboard(this.lastResult);
            Utils.showToast('Output copied to clipboard!', 'success');
        } catch (error) {
            Utils.showToast('Failed to copy to clipboard', 'error');
        }
    }

    /**
     * Handle download button click
     */
    handleDownload() {
        if (!this.lastResult) {
            Utils.showToast('No output to download', 'warning');
            return;
        }

        const config = this.getConfiguration();
        const filename = `translations_${config.moduleId || 'output'}_${new Date().toISOString().split('T')[0]}.json`;
        
        Utils.downloadText(this.lastResult, filename);
        Utils.showToast('Output downloaded successfully!', 'success');
    }

    /**
     * Handle format JSON button click
     * @param {Event} e - Click event
     */
    handleFormatJSON(e) {
        const languageInput = e.target.closest('.language-input');
        const textarea = languageInput.querySelector('textarea');
        
        try {
            const formatted = Utils.formatJSON(textarea.value);
            textarea.value = formatted;
            Utils.showToast('JSON formatted successfully!', 'success');
        } catch (error) {
            Utils.showToast('Invalid JSON format', 'error');
        }
    }

    /**
     * Handle clear language button click
     * @param {Event} e - Click event
     */
    handleClearLanguage(e) {
        const languageInput = e.target.closest('.language-input');
        const textarea = languageInput.querySelector('textarea');
        const lang = languageInput.dataset.lang;
        
        if (confirm(`Clear ${lang.toUpperCase()} translations?`)) {
            textarea.value = '';
            // Update drag drop overlay after clearing
            const zone = textarea.closest('.drag-drop-zone');
            this.updateDragDropOverlay(zone, textarea);
            // Re-enable drag and drop for this zone
            this.enableDragAndDropForZone(zone);
            Utils.showToast(`${lang.toUpperCase()} translations cleared`, 'success');
        }
    }

    /**
     * Initialize drag and drop functionality for language input areas
     */
    initializeDragAndDrop() {
        const dragDropZones = document.querySelectorAll('.drag-drop-zone');
        
        dragDropZones.forEach(zone => {
            const textarea = zone.querySelector('textarea');
            const lang = zone.dataset.lang;
            
            // Create hidden file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json';
            fileInput.className = 'file-input';
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e, textarea, lang));
            zone.appendChild(fileInput);
            
            // Click to browse files
            zone.addEventListener('click', (e) => {
                // Only allow click if zone doesn't have content
                if (!zone.classList.contains('has-content')) {
                    fileInput.click();
                }
            });
            
            // Drag and drop events
            zone.addEventListener('dragover', (e) => this.handleDragOver(e, zone));
            zone.addEventListener('dragleave', (e) => this.handleDragLeave(e, zone));
            zone.addEventListener('drop', (e) => this.handleDrop(e, zone, textarea, lang));
            
            // Update overlay visibility based on content
            textarea.addEventListener('input', () => {
                this.updateDragDropOverlay(zone, textarea);
            });
            
            // Initial overlay state
            this.updateDragDropOverlay(zone, textarea);
        });
    }

    /**
     * Handle drag over event
     * @param {DragEvent} e - Drag event
     * @param {HTMLElement} zone - Drag drop zone element
     */
    handleDragOver(e, zone) {
        // Only allow drag over if zone doesn't have content
        if (zone.classList.contains('has-content')) {
            return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        zone.classList.add('drag-over');
    }

    /**
     * Handle drag leave event
     * @param {DragEvent} e - Drag event
     * @param {HTMLElement} zone - Drag drop zone element
     */
    handleDragLeave(e, zone) {
        e.preventDefault();
        e.stopPropagation();
        zone.classList.remove('drag-over');
    }

    /**
     * Handle drop event
     * @param {DragEvent} e - Drop event
     * @param {HTMLElement} zone - Drag drop zone element
     * @param {HTMLTextAreaElement} textarea - Target textarea
     * @param {string} lang - Language code
     */
    handleDrop(e, zone, textarea, lang) {
        // Only allow drop if zone doesn't have content
        if (zone.classList.contains('has-content')) {
            return;
        }
        
        e.preventDefault();
        e.stopPropagation();
        zone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0], textarea, lang);
        }
    }

    /**
     * Handle file selection from input
     * @param {Event} e - File input event
     * @param {HTMLTextAreaElement} textarea - Target textarea
     * @param {string} lang - Language code
     */
    handleFileSelect(e, textarea, lang) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file, textarea, lang);
        }
    }

    /**
     * Process uploaded file
     * @param {File} file - Uploaded file
     * @param {HTMLTextAreaElement} textarea - Target textarea
     * @param {string} lang - Language code
     */
    processFile(file, textarea, lang) {
        // Validate file type
        if (!file.name.toLowerCase().endsWith('.json')) {
            Utils.showToast('Please select a JSON file', 'error');
            return;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            Utils.showToast('File size too large. Maximum 5MB allowed.', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                
                // Validate JSON content
                if (!Utils.isValidJSON(content)) {
                    Utils.showToast('Invalid JSON file format', 'error');
                    return;
                }
                
                // Format and set content
                const formatted = Utils.formatJSON(content);
                textarea.value = formatted;
                
                // Update overlay visibility
                const zone = textarea.closest('.drag-drop-zone');
                this.updateDragDropOverlay(zone, textarea);
                
                // Disable drag and drop for this zone
                this.disableDragAndDropForZone(zone);
                
                // Trigger auto-save
                this.saveToLocalStorage();
                
                Utils.showToast(`${lang.toUpperCase()} JSON loaded successfully!`, 'success');
                
            } catch (error) {
                Utils.showToast(`Error reading file: ${error.message}`, 'error');
            }
        };
        
        reader.onerror = () => {
            Utils.showToast('Error reading file', 'error');
        };
        
        reader.readAsText(file);
    }

    /**
     * Update drag drop overlay visibility
     * @param {HTMLElement} zone - Drag drop zone element
     * @param {HTMLTextAreaElement} textarea - Textarea element
     */
    updateDragDropOverlay(zone, textarea) {
        if (textarea.value.trim()) {
            zone.classList.add('has-content');
        } else {
            zone.classList.remove('has-content');
        }
    }

    /**
     * Disable drag and drop functionality for a specific zone
     * @param {HTMLElement} zone - Drag drop zone element
     */
    disableDragAndDropForZone(zone) {
        zone.style.pointerEvents = 'none';
        zone.style.cursor = 'default';
        
        // Re-enable pointer events for textarea only
        const textarea = zone.querySelector('textarea');
        if (textarea) {
            textarea.style.pointerEvents = 'auto';
            textarea.style.cursor = 'text';
        }
    }

    /**
     * Enable drag and drop functionality for a specific zone
     * @param {HTMLElement} zone - Drag drop zone element
     */
    enableDragAndDropForZone(zone) {
        zone.style.pointerEvents = 'auto';
        zone.style.cursor = 'pointer';
        
        // Reset textarea cursor
        const textarea = zone.querySelector('textarea');
        if (textarea) {
            textarea.style.cursor = 'text';
        }
    }

    /**
     * Enable drag and drop functionality for all zones
     */
    enableDragAndDropForAllZones() {
        const dragDropZones = document.querySelectorAll('.drag-drop-zone');
        dragDropZones.forEach(zone => {
            this.enableDragAndDropForZone(zone);
            this.updateDragDropOverlay(zone, zone.querySelector('textarea'));
        });
    }

    /**
     * Initialize auto-save functionality
     */
    initializeAutoSave() {
        const inputs = [
            'moduleId', 'moduleName', 'tenantId',
            'englishJson', 'frenchJson', 'italianJson', 'germanJson'
        ];

        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', Utils.debounce(() => {
                    this.saveToLocalStorage();
                }, 1000));
            }
        });

        // Load from localStorage on page load
        this.loadFromLocalStorage();
    }

    /**
     * Save current state to localStorage
     */
    saveToLocalStorage() {
        const config = this.getConfiguration();
        localStorage.setItem('uilm_converter_state', JSON.stringify(config));
    }

    /**
     * Load state from localStorage
     */
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('uilm_converter_state');
            if (saved) {
                const config = JSON.parse(saved);
                
                document.getElementById('moduleId').value = config.moduleId || '';
                document.getElementById('moduleName').value = config.moduleName || '';
                document.getElementById('tenantId').value = config.tenantId || '';
                document.getElementById('isPartiallyTranslated').checked = config.isPartiallyTranslated !== false;
                document.getElementById('englishJson').value = config.englishJson || '';
                document.getElementById('frenchJson').value = config.frenchJson || '';
                document.getElementById('italianJson').value = config.italianJson || '';
                document.getElementById('germanJson').value = config.germanJson || '';
                
                // Update drag drop overlays after loading from localStorage
                document.querySelectorAll('.drag-drop-zone').forEach(zone => {
                    const textarea = zone.querySelector('textarea');
                    this.updateDragDropOverlay(zone, textarea);
                    
                    // Disable drag and drop if content exists
                    if (textarea.value.trim()) {
                        this.disableDragAndDropForZone(zone);
                    }
                });
            }
        } catch (error) {
            console.warn('Failed to load saved state:', error);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});