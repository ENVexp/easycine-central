const dns = localStorage.getItem('dns');
const username = localStorage.getItem('username');
const password = localStorage.getItem('password');
const select = document.getElementById('categorySelect');
const input = document.getElementById('searchInput');
const btn = document.getElementById('searchBtn')
let categoryIdSelected = -1;
let nameMovie = '';

async function main(){
    await loadMovies();
    loadCategory();

    select.addEventListener('change', e=>{
       categoryIdSelected = select.options[select.selectedIndex].value;
       console.log(categoryIdSelected)
    });

    input.addEventListener('input', e=>{
        nameMovie = input.value;
        console.log(nameMovie)
    })

    btn.addEventListener('click', e=>{
        filterMovies();
    })
}
main();

/*
 document.getElementById('searchBtn').addEventListener('click', function () {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const selectedCategory = document.getElementById('categorySelect').value;

            const movieItems = document.querySelectorAll('.movie-item');

            movieItems.forEach(item => {
                const title = item.getAttribute('data-title').toLowerCase();
                const category = item.getAttribute('data-category');

                // Filtro de categoria e título
                const matchesCategory = selectedCategory === 'todos' || category === selectedCategory;
                const matchesSearch = title.includes(searchTerm);

                if (matchesCategory && matchesSearch) {
                    item.style.display = 'block';  // Exibe o item
                } else {
                    item.style.display = 'none';  // Oculta o item
                }
            });
*/

function filterMovies(){
    const list = document.getElementById('list-movies');
    list.querySelectorAll('.movie-item')
    .forEach(item=>{
        const categoryId = item.getAttribute('data-category');
        const name = item.getAttribute('data-title');
        if((categoryIdSelected == categoryId || categoryIdSelected==-1)
             && String(name).toLocaleLowerCase().includes(String(nameMovie).toLocaleLowerCase().trim())){
            item.style.display = 'block'
        }else{
            item.style.display = 'none';
        }
    })
}


function loadCategory() {
    get(`/api/categories?dns=${dns}&username=${username}&password=${password}`)
        .then(data => {
            const option = document.createElement('option');
            option.value = -1;
            option.innerText = 'Todos';
            select.appendChild(option)
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.category_id;
                option.innerText = String(category.category_name).replace('Filmes | ', '');
                select.appendChild(option)
            });
        })
        .catch(e => console.log(e))
}


async function loadMovies() {
    const list = document.getElementById('list-movies');
    const bar = document.getElementById("progressBar");
    const display = list.style.display;
    bar.style.display = 'block';
    list.style.display = 'none';
    const res = await get(`/api/movies?dns=${dns}&username=${username}&password=${password}`);
    console.log(res)
    res.forEach(e => {
        const div = document.createElement('div');
        div.classList.add('col', 'movie-item');
        div.setAttribute('data-category', e.category_id);
        div.setAttribute('data-title', e.name);
        div.innerHTML = `
                    <div class="card">
                        <img src="${e.stream_icon}" class="card-img-top" alt="Filme 1" style="height: 300px; object-fit: fill;">
                            <div class="card-body text-center">
                                <h6 class="card-title mb-4">${e.name}</h6>
                            <a href="${createUrlPlayer(e.stream_id)}" class="btn btn-light w-100 mb-2">
                                <i class="fas fa-play"></i> Assistir
                            </a>
                             <a href="${createUrlDownload(e.stream_id, e.name)}" class="btn btn-light w-100 mb-2">
                                <i class="fas fa-download"></i> Baixar
                            </a>
                            <a href="${createUrlDownloadToBot(e)}" class="btn btn-light w-100">
                               <i class="fas fa-robot"></i> Gerar para bot
                            </a>
                        </div>
                    </div>  
        `;
        list.appendChild(div);
    })
    list.style.display = display;
    bar.style.display = 'none';

}

async function get(url) {
    return await(await fetch(url)).json();
}

function createUrlPlayer(id){
    return `/player?dns=${dns}&user=${username}&pass=${password}&id=${id}&type=movie`
}


function createUrlDownload(id, name){
    return `/api/movie-download?dns=${dns}&username=${username}&password=${password}&name=${name}&id=${id}`;
}

function createUrlDownloadToBot(info){
    return `/api/movie-download-bot?dns=${dns}&username=${username}&password=${password}&info=${encodeURIComponent(JSON.stringify(info))}`;
}