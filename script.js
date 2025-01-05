const user = 'KRB105C';
const repo = 'timetoon.github.io;
const baseURL = 'https://timetoon.github.io/'; // Domain baru
const token = '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'; // Token Anda

async function fetchFiles() {
    const url = `https://api.github.com/repos/${user}/${repo}/contents/`;
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        const data = await response.json();

        if (!Array.isArray(data)) {
            console.error('Expected array but received:', data);
            return;
        }

        let output = '';
        let categories = new Set();

        data.forEach(item => {
            // Periksa hanya file yang berakhiran .html
            if (item.type === 'file' && item.name.endsWith('.html')) {
                const fileURL = item.download_url;  // URL untuk mengunduh file .html

                // Ambil isi dari file .html untuk menampilkan meta description, kategori, dan gambar
                fetch(fileURL)
                    .then(response => response.text())
                    .then(html => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const metaDescription = doc.querySelector('meta[name="description"]') ? doc.querySelector('meta[name="description"]').content : 'Tidak ada deskripsi tersedia.';
                        const metaCategory = doc.querySelector('meta[name="categ"]') ? doc.querySelector('meta[name="categ"]').content : 'Tanpa Kategori';

                        // Ambil semua gambar dalam file HTML
                        const images = doc.querySelectorAll('img');
                        let imageHTML = '';
                        images.forEach(img => {
                            imageHTML += `<img src="${img.src}" alt="${img.alt || 'Image'}" width="200" height="300" />`;
                        });

                        // Debugging
                        console.log(`File: ${item.name}`);
                        console.log(`Meta Description: ${metaDescription}`);
                        console.log(`Meta Category: ${metaCategory}`);
                        console.log(`Gambar: ${imageHTML}`);

                        // Tambahkan kategori ke set
                        categories.add(metaCategory);

                        // Tampilkan nama file, deskripsi, dan gambar
                        output += `
                            <a href="${fileURL}" target="_blank" class="file-item" data-category="${metaCategory}">
                                <div>
                                    <p>${item.name.replace('.html', '')}</p> <!-- Menampilkan nama file tanpa ekstensi -->
                                    <p>${metaDescription}</p>
                                    ${imageHTML} <!-- Menampilkan gambar -->
                                </div>
                            </a>
                        `;
                    })
                    .catch(error => console.log('Error fetching file contents:', error));
            }
        });

        // Tunggu sampai semua file diproses sebelum ditampilkan
        document.getElementById('file-list').innerHTML = output;

        // Tambahkan kategori ke dropdown filter
        const categoryFilter = document.getElementById('category-filter');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

    } catch (error) {
        console.log('Error fetching file list:', error);
    }
}

document.getElementById('filter-button').addEventListener('click', () => {
    const filterSelect = document.getElementById('category-filter');
    filterSelect.style.display = filterSelect.style.display === 'block' ? 'none' : 'block';
});

function searchFiles() {
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    const files = document.querySelectorAll('.file-item');

    files.forEach(file => {
        const fileName = file.querySelector('p').textContent.toLowerCase();
        if (fileName.includes(searchValue)) {
            file.style.display = '';
        } else {
            file.style.display = 'none';
        }
    });
}

function filterByCategory() {
    const selectedCategory = document.getElementById('category-filter').value;
    const files = document.querySelectorAll('.file-item');

    files.forEach(file => {
        if (selectedCategory === '' || file.dataset.category === selectedCategory) {
            file.style.display = '';
        } else {
            file.style.display = 'none';
        }
    });
}

fetchFiles();

// Ukuran blob
const blobSize = 500; // Sesuaikan dengan ukuran blob

// Menambahkan lebih banyak blobs secara dinamis
for (let i = 0; i < 1; i++) {
    const blob = document.createElement('div');
    blob.classList.add('blob');
    document.getElementById('background-container').appendChild(blob);

    // Mengatur posisi awal blob agar tidak keluar layar
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const maxTop = viewportHeight - blobSize;
    const maxLeft = viewportWidth - blobSize;

    const topPosition = Math.random() * maxTop + 'px';
    const leftPosition = Math.random() * maxLeft + 'px';

    blob.style.top = topPosition;
    blob.style.left = leftPosition;

    // Kecepatan animasi secara acak
    blob.style.animationDuration = Math.random() * 10 + 10 + 's';
}

// Fungsi untuk menyesuaikan posisi blob jika ukuran jendela diubah
window.addEventListener('resize', () => {
    const blobs = document.querySelectorAll('.blob');
    blobs.forEach(blob => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const maxTop = viewportHeight - blobSize;
        const maxLeft = viewportWidth - blobSize;

        blob.style.top = Math.min(parseFloat(blob.style.top), maxTop) + 'px';
        blob.style.left = Math.min(parseFloat(blob.style.left), maxLeft) + 'px';
    });
});

function fetchFileList() {
  // Tampilkan animasi loading
  document.getElementById('loading-spinner').style.display = 'block';

  fetch('url-ke-file-list')
    .then(response => response.json())
    .then(data => {
      // Proses data file list di sini
      console.log(data);

      // Sembunyikan animasi loading setelah data dimuat
      document.getElementById('loading-spinner').style.display = 'none';

      // Tampilkan data file list di halaman
      displayFileList(data);
    })
    .catch(error => {
      console.error('Error:', error);

      // Sembunyikan animasi loading jika terjadi error
      document.getElementById('loading-spinner').style.display = 'none';
    });
}

function displayFileList(fileList) {
  const listContainer = document.getElementById('file-list');
  fileList.forEach(file => {
    const listItem = document.createElement('li');
    listItem.textContent = file.name;
    listContainer.appendChild(listItem);
  });
}

// Panggil fungsi fetch saat halaman dimuat
window.onload = fetchFileList;