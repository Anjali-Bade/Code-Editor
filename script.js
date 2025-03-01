document.addEventListener("DOMContentLoaded", () => {
    // Initialize CodeMirror
    const editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
      mode: "htmlmixed",
      theme: "dracula",
      lineNumbers: true,
      autoCloseTags: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      indentUnit: 2,
      tabSize: 2,
      indentWithTabs: false,
      lineWrapping: true,
      extraKeys: {
        Tab: (cm) => {
          if (cm.somethingSelected()) {
            cm.indentSelection("add")
          } else {
            cm.replaceSelection("  ", "end")
          }
        },
      },
    })
  
    // Set initial content
    editor.setValue(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>Welcome to my website.</p>
    
    <script>
      console.log("Hello from JavaScript!");
    </script>
  </body>
  </html>`)
  
    // Update line and column display
    editor.on("cursorActivity", () => {
      const cursor = editor.getCursor()
      document.querySelector(".line-col").textContent = Ln ${cursor.line + 1}, Col ${cursor.ch + 1}
    })
  
    // Handle file clicks
    const files = document.querySelectorAll(".file")
    files.forEach((file) => {
      file.addEventListener("click", function () {
        // Remove active class from all files
        files.forEach((f) => f.classList.remove("active"))
        // Add active class to clicked file
        this.classList.add("active")
  
        // Get file name
        const fileName = this.querySelector("span:not(.file-icon)").textContent
  
        // Update tabs
        updateTabs(fileName)
  
        // Update editor mode based on file extension
        updateEditorMode(fileName, editor)
  
        // Update status bar
        updateStatusBar(fileName)
      })
    })
  
    // Handle tab clicks
    const tabs = document.querySelectorAll(".tab")
    tabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        // Remove active class from all tabs
        tabs.forEach((t) => t.classList.remove("active"))
        // Add active class to clicked tab
        this.classList.add("active")
  
        // Get file name
        const fileName = this.querySelector("span").textContent
  
        // Update file explorer
        updateFileExplorer(fileName)
  
        // Update editor mode
        updateEditorMode(fileName, editor)
  
        // Update status bar
        updateStatusBar(fileName)
      })
  
      // Handle close button
      const closeBtn = tab.querySelector(".close-btn")
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        if (tabs.length > 1 && tab.classList.contains("active")) {
          // If closing active tab, activate another tab
          const nextTab = tab.nextElementSibling || tab.previousElementSibling
          nextTab.classList.add("active")
  
          // Update file explorer and editor
          const fileName = nextTab.querySelector("span").textContent
          updateFileExplorer(fileName)
          updateEditorMode(fileName, editor)
          updateStatusBar(fileName)
        }
  
        // Remove the tab
        if (tabs.length > 1) {
          tab.remove()
        }
      })
    })
  
    // Function to update tabs
    function updateTabs(fileName) {
      // Check if tab already exists
      let tabExists = false
      const tabs = document.querySelectorAll(".tab")
  
      tabs.forEach((tab) => {
        const tabFileName = tab.querySelector("span").textContent
        if (tabFileName === fileName) {
          // Remove active class from all tabs
          tabs.forEach((t) => t.classList.remove("active"))
          // Add active class to this tab
          tab.classList.add("active")
          tabExists = true
        }
      })
  
      // If tab doesn't exist, create new tab
      if (!tabExists) {
        const tabsContainer = document.querySelector(".tabs")
        const newTab = document.createElement("div")
        newTab.className = "tab active"
        newTab.innerHTML = `
          <span>${fileName}</span>
          <button class="close-btn">×</button>
        `
  
        // Remove active class from all tabs
        tabs.forEach((t) => t.classList.remove("active"))
  
        // Add new tab
        tabsContainer.appendChild(newTab)
  
        // Add event listeners to new tab
        newTab.addEventListener("click", function () {
          const allTabs = document.querySelectorAll(".tab")
          allTabs.forEach((t) => t.classList.remove("active"))
          this.classList.add("active")
  
          updateFileExplorer(fileName)
          updateEditorMode(fileName, editor)
          updateStatusBar(fileName)
        })
  
        // Add event listener to close button
        const closeBtn = newTab.querySelector(".close-btn")
        closeBtn.addEventListener("click", (e) => {
          e.stopPropagation()
          const allTabs = document.querySelectorAll(".tab")
  
          if (allTabs.length > 1 && newTab.classList.contains("active")) {
            // If closing active tab, activate another tab
            const nextTab = newTab.nextElementSibling || newTab.previousElementSibling
            nextTab.classList.add("active")
  
            // Update file explorer and editor
            const nextFileName = nextTab.querySelector("span").textContent
            updateFileExplorer(nextFileName)
            updateEditorMode(nextFileName, editor)
            updateStatusBar(nextFileName)
          }
  
          // Remove the tab
          if (allTabs.length > 1) {
            newTab.remove()
          }
        })
      }
    }
  
    // Function to update file explorer
    function updateFileExplorer(fileName) {
      const files = document.querySelectorAll(".file")
      files.forEach((file) => {
        const fileNameElement = file.querySelector("span:not(.file-icon)")
        if (fileNameElement && fileNameElement.textContent === fileName) {
          files.forEach((f) => f.classList.remove("active"))
          file.classList.add("active")
        }
      })
    }
  
    // Function to update editor mode
    function updateEditorMode(fileName, editor) {
      const extension = fileName.split(".").pop().toLowerCase()
      let mode
      let content = ""
  
      switch (extension) {
        case "html":
          mode = "htmlmixed"
          content = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>Welcome to my website.</p>
    
    <script>
      console.log("Hello from JavaScript!");
    </script>
  </body>
  </html>`
          break
        case "css":
          mode = "css"
          content = `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
  }
  
  h1 {
    color: #333;
    text-align: center;
  }
  
  p {
    line-height: 1.6;
    color: #666;
  }`
          break
        case "js":
          mode = "javascript"
          content = `// JavaScript code
  function greet(name) {
    return \Hello, \${name}!\;
  }
  
  console.log(greet('World'));
  
  // DOM manipulation
  document.addEventListener('DOMContentLoaded', function() {
    const heading = document.querySelector('h1');
    if (heading) {
      heading.addEventListener('click', function() {
        this.style.color = getRandomColor();
      });
    }
  });
  
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }`
          break
        case "java":
          mode = "text/x-java"
          content = `public class HelloWorld {
    public static void main(String[] args) {
      System.out.println("Hello, World!");
      
      // Create an instance of the class
      HelloWorld instance = new HelloWorld();
      instance.greet("Java Developer");
    }
    
    public void greet(String name) {
      System.out.println("Welcome, " + name + "!");
    }
  }`
          break
        case "cpp":
        case "c":
          mode = extension === "cpp" ? "text/x-c++src" : "text/x-csrc"
          content =
            extension === "cpp"
              ? `#include <iostream>
  #include <string>
  
  class Greeter {
  private:
    std::string message;
    
  public:
    Greeter(const std::string& msg) : message(msg) {}
    
    void greet() const {
      std::cout << message << std::endl;
    }
  };
  
  int main() {
    std::cout << "Hello, World!" << std::endl;
    
    Greeter greeter("Welcome to C++");
    greeter.greet();
    
    return 0;
  }`
              : `#include <stdio.h>
  #include <stdlib.h>
  
  void greet(const char* name) {
    printf("Hello, %s!\\n", name);
  }
  
  int main() {
    printf("Hello, World!\\n");
    
    greet("C Programmer");
    
    return 0;
  }`
          break
        case "py":
          mode = "python"
          content = `def greet(name):
      """
      A simple function to greet someone
      """
      return f"Hello, {name}!"
  
  class Person:
      def _init_(self, name, age):
          self.name = name
          self.age = age
      
      def introduce(self):
          return f"My name is {self.name} and I am {self.age} years old."
  
  # Main program
  if _name_ == "_main_":
      print(greet("World"))
      
      # Create a Person instance
      person = Person("Alice", 30)
      print(person.introduce())`
          break
        default:
          mode = "htmlmixed"
          content = `// File: ${fileName}
  // Edit your code here`
      }
  
      editor.setOption("mode", mode)
      editor.setValue(content)
    }
  
    // Function to update status bar
    function updateStatusBar(fileName) {
      const extension = fileName.split(".").pop().toLowerCase()
      let language
  
      switch (extension) {
        case "html":
          language = "HTML"
          break
        case "css":
          language = "CSS"
          break
        case "js":
          language = "JavaScript"
          break
        case "java":
          language = "Java"
          break
        case "cpp":
          language = "C++"
          break
        case "c":
          language = "C"
          break
        case "py":
          language = "Python"
          break
        default:
          language = "Plain Text"
      }
  
      document.querySelector(".language-mode").textContent = language
    }
  
    // Set initial cursor position
    editor.setCursor({ line: 0, ch: 0 })
    document.querySelector(".line-col").textContent = "Ln 1, Col 1"
  })