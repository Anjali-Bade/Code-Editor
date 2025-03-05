document.addEventListener('DOMContentLoaded', () => {
  const loader = document.querySelector('.loader');
  const fileTree = document.getElementById('file-tree');
  const tabs = document.querySelectorAll('.tab');
  const editors = document.querySelectorAll('.editor-wrapper');
  const output = document.getElementById('output');
  const consoleElement = document.getElementById('console');
  const contextMenu = document.createElement('div');
  
  let currentFolder = null;
  let currentFile = null;
  let fileSystem = JSON.parse(localStorage.getItem('fileSystem')) || {};

  contextMenu.className = 'context-menu';
  document.body.appendChild(contextMenu);

  // File system functions
  function renderFileTree() {
      fileTree.innerHTML = '';
      Object.keys(fileSystem).forEach(folder => {
          const folderElement = document.createElement('li');
          folderElement.innerHTML = `
              <div class="folder-header" data-folder="${folder}">
                  <span>
                      <i class="fas fa-folder"></i> ${folder}
                  </span>
                  <i class="fas fa-times delete-btn" onclick="deleteFolder('${folder}')"></i>
              </div>
              <ul class="file-list"></ul>
          `;
          
          const fileList = folderElement.querySelector('.file-list');
          fileSystem[folder].forEach(file => {
              const fileElement = document.createElement('li');
              fileElement.className = 'file-item';
              fileElement.innerHTML = `
                  <span onclick="openFile('${folder}', '${file.name}')">
                      <i class="fas fa-file-code"></i> ${file.name}
                  </span>
                  <i class="fas fa-times delete-btn" 
                     onclick="deleteFile('${folder}', '${file.name}')"></i>
              `;
              fileList.appendChild(fileElement);
          });
          fileTree.appendChild(folderElement);
      });
  }

  function openFile(folder, fileName) {
      const file = fileSystem[folder].find(f => f.name === fileName);
      if (file) {
          currentFolder = folder;
          currentFile = fileName;
          document.getElementById('html-editor').value = file.html || '';
          document.getElementById('css-editor').value = file.css || '';
          document.getElementById('js-editor').value = file.js || '';
          document.querySelectorAll('.editor').forEach(editor => editor.disabled = false);
      }
  }

  function saveCurrentFile() {
      if (currentFolder && currentFile) {
          const folderFiles = fileSystem[currentFolder];
          const fileIndex = folderFiles.findIndex(f => f.name === currentFile);
          if (fileIndex !== -1) {
              folderFiles[fileIndex].html = document.getElementById('html-editor').value;
              folderFiles[fileIndex].css = document.getElementById('css-editor').value;
              folderFiles[fileIndex].js = document.getElementById('js-editor').value;
              localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
          }
      }
  }

  // File/folder operations
  window.deleteFolder = function(folderName) {
      if (confirm(`Delete folder "${folderName}" and all its contents?`)) {
          delete fileSystem[folderName];
          if (currentFolder === folderName) clearEditors();
          localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
          renderFileTree();
      }
  }

  window.deleteFile = function(folderName, fileName) {
      if (confirm(`Delete file "${fileName}"?`)) {
          fileSystem[folderName] = fileSystem[folderName].filter(f => f.name !== fileName);
          if (currentFile === fileName) clearEditors();
          localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
          renderFileTree();
      }
  }

  function clearEditors() {
      currentFolder = currentFile = null;
      document.getElementById('html-editor').value = '';
      document.getElementById('css-editor').value = '';
      document.getElementById('js-editor').value = '';
      document.querySelectorAll('.editor').forEach(editor => editor.disabled = true);
  }

  // Event listeners
  document.getElementById('add-folder').addEventListener('click', () => {
      const folderName = prompt('Enter folder name:');
      if (folderName) {
          if (!fileSystem[folderName]) {
              fileSystem[folderName] = [];
              localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
              renderFileTree();
          } else {
              alert('Folder already exists!');
          }
      }
  });

  document.getElementById('add-file').addEventListener('click', () => {
      const folderName = prompt('Enter folder name:');
      if (folderName && fileSystem[folderName]) {
          const fileName = prompt('Enter file name:');
          if (fileName) {
              fileSystem[folderName].push({ 
                  name: fileName, 
                  html: '', 
                  css: '', 
                  js: '' 
              });
              localStorage.setItem('fileSystem', JSON.stringify(fileSystem));
              renderFileTree();
              openFile(folderName, fileName);
          }
      } else {
          alert('Folder does not exist!');
      }
  });

  tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const editorType = tab.dataset.editor;
      editors.forEach(editor => {
          editor.style.display = editor.dataset.editor === editorType ? 'block' : 'none';
      });
  }));

  document.getElementById('run').addEventListener('click', () => {
      loader.style.display = 'block';
      try {
          const html = document.getElementById('html-editor').value;
          const css = `<style>${document.getElementById('css-editor').value}</style>`;
          const js = `<script>${document.getElementById('js-editor').value}<\/script>`;
          
          const iframeDoc = output.contentDocument || output.contentWindow.document;
          iframeDoc.open();
          iframeDoc.write(html + css + js);
          iframeDoc.close();

          output.contentWindow.onerror = (message, source, lineno, colno, error) => {
              consoleElement.innerHTML += `<div class="log error">Error: ${message} (Line ${lineno})</div>`;
          };
      } catch (error) {
          console.error('Execution error:', error);
      } finally {
          loader.style.display = 'none';
      }
  });

  document.getElementById('fullscreen').addEventListener('click', () => {
      const elem = document.querySelector('.outputscreen');
      if (!document.fullscreenElement) {
          elem.requestFullscreen().catch(console.error);
      } else {
          document.exitFullscreen();
      }
  });

  // Auto-save and line numbers
  const updateLineNumbers = (editor) => {
      const lines = editor.value.split('\n').length;
      editor.previousElementSibling.innerHTML = 
          Array(lines).fill().map((_, i) => i + 1).join('<br>');
  };

  ['html', 'css', 'js'].forEach(type => {
      const editor = document.getElementById(`${type}-editor`);
      editor.addEventListener('input', () => {
          saveCurrentFile();
          updateLineNumbers(editor);
      });
  });

  // Initial setup
  renderFileTree();
  clearEditors();
});