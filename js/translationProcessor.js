/**
 * Translation Processor class
 * Handles the main translation processing logic
 */
class TranslationProcessor {
    /**
     * Process translations and generate the output structure
     * @param {Object} config - Configuration object
     * @returns {Array} Array of TranslationItem objects
     */
    static processTranslations(config) {
        const {
            moduleId,
            moduleName,
            tenantId,
            englishJson,
            frenchJson,
            italianJson,
            germanJson,
            isPartiallyTranslated
        } = config;

        // Flatten all JSON inputs
        const flattenedEnglish = JsonFlattener.flattenJson(englishJson);
        const flattenedFrench = JsonFlattener.flattenJson(frenchJson);
        const flattenedItalian = JsonFlattener.flattenJson(italianJson);
        const flattenedGerman = JsonFlattener.flattenJson(germanJson);

        // Parse flattened JSON strings
        const englishTranslations = JSON.parse(flattenedEnglish);
        const frenchTranslations = JSON.parse(flattenedFrench);
        const italianTranslations = JSON.parse(flattenedItalian);
        const germanTranslations = JSON.parse(flattenedGerman);

        // Get all unique keys from all translations
        const allKeys = new Set();
        Object.keys(englishTranslations).forEach(key => allKeys.add(key));
        Object.keys(frenchTranslations).forEach(key => allKeys.add(key));
        Object.keys(italianTranslations).forEach(key => allKeys.add(key));
        Object.keys(germanTranslations).forEach(key => allKeys.add(key));

        const result = [];

        // Process each key
        for (const key of allKeys) {
            const resources = [];

            // Add English translation
            if (englishTranslations.hasOwnProperty(key)) {
                resources.push({
                    Value: englishTranslations[key],
                    Culture: 'en-US'
                });
            }

            // Add French translation
            if (frenchTranslations.hasOwnProperty(key)) {
                resources.push({
                    Value: frenchTranslations[key],
                    Culture: 'fr-FR'
                });
            }

            // Add Italian translation
            if (italianTranslations.hasOwnProperty(key)) {
                resources.push({
                    Value: italianTranslations[key],
                    Culture: 'it-IT'
                });
            }

            // Add German translation
            if (germanTranslations.hasOwnProperty(key)) {
                resources.push({
                    Value: germanTranslations[key],
                    Culture: 'de-DE'
                });
            }

            // Create translation item
            const translationItem = {
                _id: Utils.generateUUID(),
                TenantId: tenantId,
                KeyName: key,
                ModuleId: moduleId,
                Module: moduleName,
                Value: null,
                Resources: resources,
                Routes: [],
                IsPartiallyTranslated: isPartiallyTranslated
            };

            result.push(translationItem);
        }

        return result;
    }

    /**
     * Validate input configuration
     * @param {Object} config - Configuration object
     * @returns {Object} Validation result
     */
    static validateConfig(config) {
        const errors = [];

        if (!config.moduleId || config.moduleId.trim() === '') {
            errors.push('Module ID is required');
        }

        if (!config.moduleName || config.moduleName.trim() === '') {
            errors.push('Module Name is required');
        }

        if (!config.tenantId || config.tenantId.trim() === '') {
            errors.push('Tenant ID is required');
        }

        // Validate JSON inputs
        const jsonInputs = [
            { name: 'English', value: config.englishJson },
            { name: 'French', value: config.frenchJson },
            { name: 'Italian', value: config.italianJson },
            { name: 'German', value: config.germanJson }
        ];

        for (const input of jsonInputs) {
            if (input.value && input.value.trim() !== '') {
                if (!Utils.isValidJSON(input.value)) {
                    errors.push(`${input.name} JSON is invalid`);
                }
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}