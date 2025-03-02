document.addEventListener('DOMContentLoaded', function () {
    // File Manager Code
    const fileTree = document.getElementById('file-tree');
    const addFolderButton = document.getElementById('add-folder');
    const addFileButton = document.getElementById('add-file');
    const closeAllButton = document.getElementById('close-all');
    let currentFolder = null;

    // Line Numbering System
    function initializeLineNumbers(editorId, numbersId) {
        const editor = document.getElementById(editorId);
        const numbers = document.getElementById(numbersId);

        function updateNumbers() {
            const lines = editor.value.split('\n').length;
            numbers.innerHTML = Array(lines).fill()
                .map((_, i) => `<div>${i + 1}</div>`).join('');
            numbers.scrollTop = editor.scrollTop;
        }

        editor.addEventListener('input', updateNumbers);
        editor.addEventListener('scroll', () => {
            numbers.scrollTop = editor.scrollTop;
        });
        updateNumbers();
    }

    // Initialize line numbers for all editors
    initializeLineNumbers('html-editor', 'html-line-numbers');
    initializeLineNumbers('css-editor', 'css-line-numbers');
    initializeLineNumbers('js-editor', 'js-line-numbers');

    // Code Execution
    const htmlEditor = document.getElementById('html-editor');
    const cssEditor = document.getElementById('css-editor');
    const jsEditor = document.getElementById('js-editor');
    const outputFrame = document.getElementById('output');

    function runCode() {
        const html = htmlEditor.value;
        const css = `<style>${cssEditor.value}</style>`;
        const js = `<script>${jsEditor.value}<\/script>`;
        const output = html + css + js;

        const outputDocument = outputFrame.contentDocument || outputFrame.contentWindow.document;
        outputDocument.open();
        outputDocument.write(output);
        outputDocument.close();
    }

    document.getElementById('run-button').addEventListener('click', runCode);

    // File Manager Functionality
    addFolderButton.addEventListener('click', function () {
        const folderName = prompt('Enter folder name:');
        if (folderName) {
            const folder = document.createElement('li');
            folder.innerHTML = `
                ${folderName}
                <button class="close-btn">×</button>
            `;
            folder.classList.add('folder');
            fileTree.appendChild(folder);
        }
    });

    addFileButton.addEventListener('click', function () {
        const fileName = prompt('Enter file name:');
        if (fileName) {
            const file = document.createElement('li');
            file.innerHTML = `
                ${fileName}
                <button class="close-btn">×</button>
            `;
            fileTree.appendChild(file);
        }
    });

    closeAllButton.addEventListener('click', () => {
        fileTree.innerHTML = '';
    });

    fileTree.addEventListener('click', (event) => {
        if (event.target.classList.contains('close-btn')) {
            event.target.parentElement.remove();
        }
    });
});