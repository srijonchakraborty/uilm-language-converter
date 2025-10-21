/**
 * JSON Flattener utility class
 * Converts nested JSON objects into flat key-value pairs
 */
class JsonFlattener {
    /**
     * Flatten a JSON string into a flat object
     * @param {string} jsonString - JSON string to flatten
     * @returns {string} Flattened JSON string
     */
    static flattenJson(jsonString) {
        if (!jsonString || jsonString.trim() === '') {
            return '{}';
        }

        try {
            const jsonNode = JSON.parse(jsonString);
            const flattenedDict = {};
            this.flattenNode(jsonNode, '', flattenedDict);
            return JSON.stringify(flattenedDict, null, 2);
        } catch (error) {
            throw new Error(`Invalid JSON format: ${error.message}`);
        }
    }

    /**
     * Flatten a JSON node recursively
     * @param {any} node - JSON node to flatten
     * @param {string} prefix - Current key prefix
     * @param {Object} result - Result object to store flattened values
     */
    static flattenNode(node, prefix, result) {
        if (node === null || node === undefined) {
            result[prefix] = null;
            return;
        }

        if (Array.isArray(node)) {
            // Handle arrays
            for (let i = 0; i < node.length; i++) {
                const key = `${prefix}[${i}]`;
                this.flattenNode(node[i], key, result);
            }
        } else if (typeof node === 'object') {
            // Handle objects
            for (const [key, value] of Object.entries(node)) {
                const newKey = prefix === '' ? key : `${prefix}.${key}`;
                this.flattenNode(value, newKey, result);
            }
        } else {
            // Handle primitive values
            result[prefix] = node;
        }
    }

    /**
     * Get the value from a JSON node
     * @param {any} node - JSON node
     * @returns {any} Node value
     */
    static getValue(node) {
        if (node === null || node === undefined) {
            return null;
        }
        
        if (typeof node === 'object') {
            return node.toString();
        }
        
        return node;
    }
}