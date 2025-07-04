export function initSettings() {
  const backgroundInput = document.getElementById('background-image');

  window.setBackground = () => {
    const file = backgroundInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        document.body.style.backgroundImage = `url(${reader.result})`;
        localStorage.setItem('background', reader.result);
        logActivity('Изменён фон');
      };
      reader.readAsDataURL(file);
    }
  };

  const savedBackground = localStorage.getItem('background');
  if (savedBackground) {
    document.body.style.backgroundImage = `url(${savedBackground})`;
  }
}