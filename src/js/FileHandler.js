import { addClassToElement, removeClassFromElement, setNodeTextContent } from './utils';

export class FileHandler {
  constructor(fileInputId, dragId, dropTextId) {
    this.selectedFile = null;
    this.fileInput = document.getElementById(fileInputId);
    this.dragElement = document.getElementById(dragId);
    this.dropText = document.getElementById(dropTextId);

    this.init();
  }

  init() {
    this.fileInput.addEventListener('change', (event) => this.handleFileSelect(event));
    this.dragElement.addEventListener('dragover', (event) => this.handleDragOver(event));
    this.dragElement.addEventListener('dragleave', () => this.handleDragLeave());
    this.dragElement.addEventListener('drop', (event) => this.handleDrop(event));
  }

  handleFileSelect(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      addClassToElement(this.dragElement, 'active');
      setNodeTextContent(this.dropText, 'Release to Upload');
      this.displayFile();
    } else {
      console.error('No file selected');
    }
  }

  handleDragOver(event) {
    event.preventDefault();
    addClassToElement(this.dragElement, 'active');
    setNodeTextContent(this.dropText, 'Release to Upload');
  }

  handleDragLeave() {
    removeClassFromElement(this.dragElement, 'active');
    setNodeTextContent(this.dropText, 'Drag & Drop');
  }

  handleDrop(event) {
    event.preventDefault();
    this.selectedFile = event.dataTransfer.files[0];
    this.displayFile();
  }

  displayFile() {}

  handleConvertFile() {}
}
