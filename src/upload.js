function uploadAudio() {
    const input = document.getElementById('audioInput');
    const file = input.files[0];
    if (!file) {
        alert('Пожалуйста, выберите файл.');
        return;
    }

    const formData = new FormData();
    formData.append('audio', file);

    fetch('/upload-audio', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('transcription').textContent = data.transcription;
        })
        .catch(error => {
            console.error('Ошибка при загрузке файла:', error);
        });
}