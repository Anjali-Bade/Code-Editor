document.addEventListener('DOMContentLoaded', function () {
  const fileTree = document.getElementById('file-tree');
  const codeEditor = document.getElementById('code');
  const addFolderButton = document.getElementById('add-folder');
  const addFileButton = document.getElementById('add-file');
  const closeAllButton = document.getElementById('close-all');

  let currentFolder = null; // Track the currently selected folder

  // Load file content when a file is clicked
  fileTree.addEventListener('click', function (event) {
      if (event.target.tagName === 'LI') {
          const fileName = event.target.textContent.split(' ')[0]; // Remove close button text
          loadFileContent(fileName);
      }
  });

  // Add a new folder to the sidebar
  addFolderButton.addEventListener('click', function () {
      const folderName = prompt('Enter the name of the new folder:');
      if (folderName) {
          const folder = document.createElement('li');
          folder.textContent = folderName;
          folder.classList.add('folder');
          const closeBtn = document.createElement('button');
          closeBtn.textContent = '×';
          closeBtn.classList.add('close-btn');
          folder.appendChild(closeBtn);
          fileTree.appendChild(folder);
      }
  });

  // Add a new file to the sidebar
  addFileButton.addEventListener('click', function () {
      const fileName = prompt('Enter the name of the new file:');
      if (fileName) {
          const file = document.createElement('li');
          file.textContent = fileName;
          const closeBtn = document.createElement('button');
          closeBtn.textContent = '×';
          closeBtn.classList.add('close-btn');
          file.appendChild(closeBtn);
          if (currentFolder) {
              currentFolder.appendChild(file);
          } else {
              fileTree.appendChild(file);
          }
      }
  });

  // Close all files and folders
  closeAllButton.addEventListener('click', function () {
      fileTree.innerHTML = ''; // Clear the file tree
      codeEditor.value = ''; // Clear the editor
  });

  // Add a close button to each file/folder
  fileTree.addEventListener('click', function (event) {
      if (event.target.classList.contains('close-btn')) {
          const item = event.target.parentElement;
          item.remove(); // Remove the file/folder from the sidebar
          if (codeEditor.value.includes(item.textContent.split(' ')[0])) {
              codeEditor.value = ''; // Clear the editor if the file was open
          }
      }
  });

  // Simulate loading file content
  function loadFileContent(fileName) {
      codeEditor.value = `// Content of ${fileName}\n// Start coding here...`;
  }

  // Track the currently selected folder
  fileTree.addEventListener('click', function (event) {
      if (event.target.classList.contains('folder')) {
          currentFolder = event.target;
      }
  });
});