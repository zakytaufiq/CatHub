document.addEventListener("DOMContentLoaded", function() {
    fetchBreeds(); // Mengambil daftar breed yang tersedia
    fetchCatImages(1); // Mengambil gambar kucing, halaman pertama
  });
  
  async function fetchBreeds() {
    try {
      const response = await fetch('https://api.thecatapi.com/v1/breeds', {
        headers: {
          'x-api-key': 'live_0Qho5LTKmutPoee1F3ES2uAbnnQqj6UzuO8ZD3Qwa2eK2lnkDtOWGbuz9ZimQ9Tg' // Ganti dengan API key Anda
        }
      });
      const data = await response.json();
      const breedFilter = document.getElementById('breedFilter');
  
      data.forEach(breed => {
        const option = document.createElement('option');
        option.textContent = breed.name;
        option.value = breed.id; // Gunakan ID breed untuk filter jika diperlukan
        breedFilter.appendChild(option);
      });
  
      setupFilter(); // Setelah opsi dropdown dibangun, atur filter
    } catch (error) {
      console.error('Error fetching breeds: ', error);
    }
  }
  
  async function fetchCatImages(page, breedId = '') {
    const limit = 100;
    const startIndex = (page - 1) * 9;
    const endIndex = startIndex + 9;
    let apiUrl = `https://api.thecatapi.com/v1/images/search?limit=${limit}&has_breeds=1`;
  
    if (breedId !== '') {
      apiUrl += `&breed_ids=${breedId}`;
    }
  
    try {
      const response = await fetch(apiUrl, {
        headers: {
          'x-api-key': 'live_0Qho5LTKmutPoee1F3ES2uAbnnQqj6UzuO8ZD3Qwa2eK2lnkDtOWGbuz9ZimQ9Tg' // Ganti dengan API key Anda
        }
      });
      const data = await response.json();
      const catCards = document.getElementById('catCards');
  
      // Mengambil 9 gambar sesuai dengan halaman yang dipilih
      const displayedCats = data.slice(startIndex, endIndex);
  
      catCards.innerHTML = ''; // Kosongkan konten sebelum menambahkan gambar baru
  
      displayedCats.forEach(cat => {
        const breed = cat.breeds.length > 0 ? cat.breeds[0] : {};
        const card = `
          <div class="col">
            <div class="card shadow-sm h-100">
              <h5 class="card-title mb-0 text-center">Breed: ${breed.name}</h5>
              <img src="${cat.url}" class="card-img-top card-img" alt="Cat">
              <div class="card-body d-flex flex-column">
                <a href="detail.html?id=${cat.id}" class="btn btn-primary mt-auto">Learn more</a>
              </div>
            </div>
          </div>
        `;
        catCards.innerHTML += card;
      });
  
      setupPagination(data.length); // Set up pagination based on total images received
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }
  
  function setupPagination(totalImages) {
    const totalPages = Math.ceil(totalImages / 9); // Hitung total halaman berdasarkan 9 gambar per halaman
    const paginationElement = document.getElementById('pagination');
  
    paginationElement.innerHTML = ''; // Kosongkan elemen pagination sebelum menambahkan tombol baru
  
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement('li');
      li.classList.add('page-item');
      const a = document.createElement('a');
      a.classList.add('page-link');
      a.href = '#';
      a.textContent = i;
      a.addEventListener('click', function(event) {
        event.preventDefault();
        const breedId = document.getElementById('breedFilter').value;
        fetchCatImages(i, breedId); // Ambil gambar berdasarkan halaman dan breed yang dipilih
      });
      li.appendChild(a);
      paginationElement.appendChild(li);
    }
  }
  
  function setupFilter() {
    const breedFilter = document.getElementById('breedFilter');
    breedFilter.addEventListener('change', function() {
      const breedId = breedFilter.value.toLowerCase();
      fetchCatImages(1, breedId); // Setel ulang tampilan gambar berdasarkan breed yang dipilih
    });
  }
  