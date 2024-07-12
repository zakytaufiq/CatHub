document.addEventListener("DOMContentLoaded", function() {
    fetchBreeds(); // Mengambil daftar breed yang tersedia
    fetchCatImages(1); // Mengambil gambar kucing, halaman pertama
  });
  // Mengambil daftar breed yang tersedia
  async function fetchBreeds() {
    try {
      // Mengirim permintaan untuk mengambil data ras kucing dari dengan API key 
      const response = await fetch('https://api.thecatapi.com/v1/breeds', {
        headers: {
          'x-api-key': 'live_0Qho5LTKmutPoee1F3ES2uAbnnQqj6UzuO8ZD3Qwa2eK2lnkDtOWGbuz9ZimQ9Tg' // API-key yang diberikan melalui email
        }
      });
      // Mengonversi respons menjadi format JSON
      const data = await response.json();
     // Mendapatkan elemen DOM tempat dropdown akan ditampilkan
      const breedFilter = document.getElementById('breedFilter');
      //iterasi untuk membuat dropdown
      data.forEach(breed => {
        const option = document.createElement('option');
        option.textContent = breed.name;
        option.value = breed.id; 
        breedFilter.appendChild(option);
      });
  
      setupFilter(); // mengatur filter setelah dropdown dibuat
    } catch (error) {
      console.error('Error fetching breeds: ', error);
    }
  }
  // Mengambil gambar kucing
  async function fetchCatImages(page, breedId = '') {
    const limit = 50; //jumlah gambar yang ingin ditampilkan 
    
    //hitung indeks awal dan akhir yang akan ditampilkan sesai halaman
    const startIndex = (page - 1) * 9; 
    const endIndex = startIndex + 9;

     // URL API untuk mengambil gambar kucing dari Cat API
    let apiUrl = `https://api.thecatapi.com/v1/images/search?limit=${limit}&has_breeds=1&size=small`;
    
    //menambah paramater breed id jika ada
    if (breedId !== '') {
      apiUrl += `&breed_ids=${breedId}`;
    }
  
    try {
       // Mengirim permintaan GET ke API dengan API key
      const response = await fetch(apiUrl, {
        headers: {
          'x-api-key': 'live_0Qho5LTKmutPoee1F3ES2uAbnnQqj6UzuO8ZD3Qwa2eK2lnkDtOWGbuz9ZimQ9Tg' // Ganti dengan API key Anda
        }
      });
      // Mengonversi respons menjadi format JSON
      const data = await response.json();
      // Mendapatkan elemen DOM tempat gambar kucing akan ditampilkan
      const catCards = document.getElementById('catCards');
  
      // Mengambil gambar sesuai dengan halaman yang dipilih
      const displayedCats = data.slice(startIndex, endIndex);
  
      catCards.innerHTML = ''; // Kosongkan konten sebelum menambahkan gambar baru
      
      //Menggunakan perluangan untuk menambahkan gambar kucing ke kartu
      displayedCats.forEach(cat => {
        const breed = cat.breeds.length > 0 ? cat.breeds[0] : {};
        const card = `
          <div class="col">
            <div class="card shadow-sm h-100">
            <a href="detail.html?id=${cat.id}" >  
            <div class="card-content d-flex flex-column">
              <img src="${cat.url}" class="card-img-top card-img" alt="Cat">  
               <div class="card-info">
                <h5 class="my-1 text-center "> ${breed.name}</h5>
               </div>
              </div>
            </a>
            </div>
          </div>
        `;
        catCards.innerHTML += card; //menambahkan card ke elemen kontainer
      });
  
      setupPagination(data.length); // Set up pagination berdasarkan total gambar yang diterima
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }
  
  //mangatur pagination gambar kucing berdasarkan total gambar yang diterima
  function setupPagination(totalImages) {
    const totalPages = Math.ceil(totalImages / 9); // Hitung total halaman berdasarkan 9 gambar per halaman
    const paginationElement = document.getElementById('pagination');
  
    paginationElement.innerHTML = ''; // Kosongkan elemen pagination sebelum menambahkan tombol baru
    
    // Membuat tombol halaman untuk setiap halaman yang tersedia
    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement('li');
      li.classList.add('page-item');
      const a = document.createElement('a');
      a.classList.add('page-link');
      a.href = '#';
      a.textContent = i;

      // Menambahkan event listener untuk mengambil gambar kucing berdasarkan halaman dan jenis ras yang dipilih
      a.addEventListener('click', function(event) {
        event.preventDefault();
        const breedId = document.getElementById('breedFilter').value;
        fetchCatImages(i, breedId); // Ambil gambar berdasarkan halaman dan breed yang dipilih
      });
      li.appendChild(a);
      paginationElement.appendChild(li);  
    }
  }
  
  // Filter(dropdown) berdasasrkan jenis ras kucing
  function setupFilter() {
    const breedFilter = document.getElementById('breedFilter');
    // Menambahkan event listener untuk merespons perubahan pada filter ras kucing
    breedFilter.addEventListener('change', function() {
      const breedId = breedFilter.value.toLowerCase();
      // Memanggil fungsi fetchCatImages untuk menampilkan gambar berdasarkan jenis ras yang dipilih
      fetchCatImages(1, breedId); 
    });
  }
  