# uilm-language-converter

<img width="1540" height="968" alt="image" src="https://github.com/user-attachments/assets/fab1e5ce-be8f-4342-9288-07af9457850d" />

## 📖 How to Use

### Basic Workflow
1. **Configure Settings**: Enter Module ID, Module Name, and Tenant ID
2. **Add Translations**: Input JSON translations for each language using:
   - Direct text input in textareas
   - Drag and drop JSON files
   - Click to browse and select files
3. **Format JSON**: Use the format button to beautify JSON content
4. **Generate Output**: Click "Generate" to process translations
5. **Export Results**: Copy to clipboard or download the generated JSON

### Language Input Methods
- **Manual Input**: Type or paste JSON directly into textareas
- **File Upload**: Drag JSON files onto the input areas or click to browse
- **Auto-formatting**: Use the format button to clean up JSON structure

### Configuration Options
- **Module ID**: Unique identifier for your module
- **Module Name**: Display name for the module
- **Tenant ID**: Tenant-specific identifier
- **Is Partially Translated**: Toggle for partial translation status

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup and modern web standards
- **CSS3**: Advanced styling with CSS Grid, Flexbox, and custom properties
- **Vanilla JavaScript**: No external dependencies, pure JavaScript
- **Font Awesome**: Icon library for UI elements
- **Google Fonts**: Inter font family for typography

### Key Components

#### App Class (`app.js`)
- Main application controller
- Event handling and UI interactions
- Drag and drop functionality
- Auto-save and localStorage management

#### TranslationProcessor Class (`translationProcessor.js`)
- Core translation processing logic
- JSON flattening and restructuring
- Validation and error handling

#### JsonFlattener Class (`jsonFlattener.js`)
- Converts nested JSON to flat key-value pairs
- Handles complex nested structures
- Maintains key hierarchy with dot notation

#### Utils Class (`utils.js`)
- Utility functions for common operations
- JSON formatting and validation
- Clipboard operations
- File download functionality
- Toast notifications

## 🎨 Customization

### CSS Variables
The project uses CSS custom properties for easy theming:

```css
:root {
    --primary-color: #3b82f6;
    --secondary-color: #6b7280;
    --success-color: #10b981;
    --error-color: #ef4444;
    --warning-color: #f59e0b;
    /* ... more variables */
}
```

### Adding New Languages
1. Add new language tab in `index.html`
2. Add corresponding textarea with unique ID
3. Update language mapping in `app.js`
4. Add language processing in `translationProcessor.js`

## 📱 Browser Support

- **Chrome**: 60+
- **Firefox**: 55+
- **Safari**: 12+
- **Edge**: 79+

## 🔧 Development

### Local Development
1. Clone the repository
2. Open `index.html` in your browser
3. Make changes to CSS or JavaScript files
4. Refresh browser to see changes

### File Structure Guidelines
- Keep HTML semantic and accessible
- Use CSS custom properties for theming
- Follow ES6+ JavaScript standards
- Maintain responsive design principles

## 🐛 Troubleshooting

### Common Issues
1. **JSON Validation Errors**: Ensure valid JSON syntax
2. **File Upload Issues**: Check file size (max 5MB) and format (.json only)
3. **Responsive Issues**: Clear browser cache and check viewport meta tag
4. **Auto-save Issues**: Check browser localStorage permissions

### Error Messages
- **Invalid JSON**: Check JSON syntax and formatting
- **File Too Large**: Reduce file size to under 5MB
- **Invalid File Type**: Only .json files are supported



## 🤝 Contributing

Contributions are welcome! 

### Contribution Guidelines
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


---

**Made with ❤️ for developers who need efficient translation management**
