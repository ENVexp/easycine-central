
document.addEventListener('DOMContentLoaded', e => {
    const dns = localStorage.getItem('dns');
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    document.getElementById('dns').value = dns;
    document.getElementById('username').value = username;
    document.getElementById('password').value = password;
})

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const dns = document.getElementById('dns').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    localStorage.setItem('dns', dns);
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    alert(`Dados Salvos:\nDNS: ${dns}\nUsername: ${username}\nPassword: ${password}`);
    window.location.href = '/movies';
});



// Função para o botão "Gerar"
function gerarDados() {
    fetch('/api/generateLogin')
        .then(async res => await res.json())
        .then(data => {
            const username = data.username;
            const password = data.password;
            document.getElementById('dns').value = 'http://tdck.cloud:8080/';
            document.getElementById('username').value = username;
            document.getElementById('password').value = password;
            alert(`Dados Gerados:\nUsername: ${username}\nPassword: ${password}`);
        })
        .catch(e => alert('Erro ao gerar dados :' + e.message))
}