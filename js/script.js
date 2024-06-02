$(document).ready(function() {
    var currentPage = $('body').data('page');
    
    if (currentPage === 'penjualan') {
        initializePenjualanPage();
    } else if (currentPage === 'pembelian') {
        initializePembelianPage();
    } else if (currentPage === 'barang') {
        initializeBarangPage();
    } else if (currentPage === 'pemasok') {
        initializePemasokPage();
    }
});

if ($('body').data('page') === 'index') {
    displayTotalPenjualan();
    displayTotalPembelian();
    displayTotalBarang();
    displayTotalPemasok();
}

$('#saveDataButton').click(function() {
    saveDataPrompt();
});

$('#loadDataButton').click(function() {
    loadDataPrompt();
});

function saveDataPrompt() {
    var jsonData = {
        penjualan: JSON.parse(localStorage.getItem('penjualan') || '[]'),
        pembelian: JSON.parse(localStorage.getItem('pembelian') || '[]'),
        barang: JSON.parse(localStorage.getItem('barang') || '[]'),
        pemasok: JSON.parse(localStorage.getItem('pemasok') || '[]')
    };

    var jsonDataStr = JSON.stringify(jsonData, null, 2);

    var blob = new Blob([jsonDataStr], { type: 'application/json' });

    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.json';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function loadDataPrompt() {
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = async function() {
        var file = input.files[0];
        if (file) {
            try {
                var data = await file.text();
                var jsonData = JSON.parse(data);

                localStorage.setItem('penjualan', JSON.stringify(jsonData.penjualan));
                localStorage.setItem('pembelian', JSON.stringify(jsonData.pembelian));
                localStorage.setItem('barang', JSON.stringify(jsonData.barang));
                localStorage.setItem('pemasok', JSON.stringify(jsonData.pemasok));

                alert('Data loaded successfully.');
                location.reload();
            } catch (error) {
                console.error('Error loading data:', error);
                alert('Error loading data. Please try again.');
            }
        }
    };

    input.click();
}

function displayTotalPenjualan() {
let totalPenjualan = localStorage.getItem('totalPenjualan') || 0;
$('#total-penjualan').text('Rp' + parseFloat(totalPenjualan).toLocaleString('id-ID'));
}

function displayTotalPembelian() {
let totalPembelian = localStorage.getItem('totalPembelian') || 0;
$('#total-pembelian').text('Rp' + parseFloat(totalPembelian).toLocaleString('id-ID'));
}

function displayTotalBarang() {
let totalStock = localStorage.getItem('totalStock') || 0;
$('#total-barang').text(parseFloat(totalStock).toLocaleString('id-ID'));
}

function displayTotalPemasok() {
let totalPemasok = localStorage.getItem('totalPemasok') || 0;
$('#total-pemasok').text(parseFloat(totalPemasok).toLocaleString('id-ID'));
}


function initializePenjualanPage() {
    // Sales-specific initialization
    $('#dataTable').on('click', '.delete', deleteData);
    $('#showAddModal').click(function() {
        $('#addModal').modal('show');
    });
    $('#saveAdd').click(function() {
        addData('penjualan');
    });
    $('#dataTable').on('click', '.edit', function() {
        var index = $(this).data('index');
        prepareModalForEdit(index, 'penjualan');
        $('#dataModal').modal('show');
    });
    $('#saveData').click(function() {
        saveData('penjualan');
    });
    $('#loadData').click(function() {
        loadData('penjualan');
    });

    if (localStorage.getItem('penjualan')) {
        renderData(JSON.parse(localStorage.getItem('penjualan')), 'penjualan');
    }
    calculateTotalPenjualan(); // Calculate initial total sales
}

function initializePembelianPage() {
    // Purchases-specific initialization
    $('#dataTable').on('click', '.delete', deleteData);
    $('#showAddModal').click(function() {
        $('#addModal').modal('show');
    });
    $('#saveAdd').click(function() {
        addData('pembelian');
    });
    $('#dataTable').on('click', '.edit', function() {
        var index = $(this).data('index');
        prepareModalForEdit(index, 'pembelian');
        $('#dataModal').modal('show');
    });
    $('#saveData').click(function() {
        saveData('pembelian');
    });
    $('#loadData').click(function() {
        loadData('pembelian');
    });

    if (localStorage.getItem('pembelian')) {
        renderData(JSON.parse(localStorage.getItem('pembelian')), 'pembelian');
    }
    calculateTotalPembelian();
}

function initializeBarangPage() {
    // Barang-specific initialization
    $('#dataTable').on('click', '.delete', deleteData);
    $('#showAddModal').click(function() {
        $('#addModal').modal('show');
    });
    $('#saveAdd').click(function() {
        addData('barang');
    });
    $('#dataTable').on('click', '.edit', function() {
        var index = $(this).data('index');
        prepareModalForEdit(index, 'barang');
        $('#dataModal').modal('show');
    });
    $('#saveData').click(function() {
        saveData('barang');
    });
    $('#loadData').click(function() {
        loadData('barang');
    });

    if (localStorage.getItem('barang')) {
        renderData(JSON.parse(localStorage.getItem('barang')), 'barang');
    }
}

function initializePemasokPage() {
    // Pemasok-specific initialization
    $('#dataTable').on('click', '.delete', deleteData);
    $('#showAddModal').click(function() {
        $('#addModal').modal('show');
    });
    $('#saveAdd').click(function() {
        addData('pemasok');
    });
    $('#dataTable').on('click', '.edit', function() {
        var index = $(this).data('index');
        prepareModalForEdit(index, 'pemasok');
        $('#dataModal').modal('show');
    });
    $('#saveData').click(function() {
        saveData('pemasok');
    });
    $('#loadData').click(function() {
        loadData('pemasok');
    });

    if (localStorage.getItem('pemasok')) {
        renderData(JSON.parse(localStorage.getItem('pemasok')), 'pemasok');
    }
}

// Common functions
function renderData(data, pageType) {
    var tableBody = $('#dataTable');
    tableBody.empty();
    data.forEach(function(item, index) {
        var row;
        if (pageType === 'penjualan') {
            row = `<tr id="data-row-${index}">
                <td>${item.id_penjualan}</td>
                <td>${item.kode_barang}</td>
                <td>${item.tanggal}</td>
                <td>${item.jumlah}</td>
                <td class="total-harga">${item.total}</td>
                <td>
                    <button class="btn btn-success edit" data-index="${index}">Edit</button>
                    <button class="btn btn-danger delete" data-index="${index}">Delete</button>
                </td>
            </tr>`;
        } else if (pageType === 'pembelian') {
            row = `<tr id="data-row-${index}">
                <td>${item.id_pembelian}</td>
                <td>${item.kode_barang}</td>
                <td>${item.tanggal}</td>
                <td>${item.jumlah}</td>
                <td class="total-harga">${item.total}</td>
                <td>
                    <button class="btn btn-success edit" data-index="${index}">Edit</button>
                    <button class="btn btn-danger delete" data-index="${index}">Delete</button>
                </td>
            </tr>`;
        } else if (pageType === 'barang') {
            row = `<tr id="data-row-${index}">
                <td>${item.kode_barang}</td>
                <td>${item.nama_barang}</td>
                <td>${item.harga_satuan}</td>
                <td class="stock">${item.stock}</td>
                <td><img src="${item.gambar_barang}" alt="Gambar Barang" width="125"></td>
                <td>
                    <button class="btn btn-success edit" data-index="${index}">Edit</button>
                    <button class="btn btn-danger delete" data-index="${index}">Delete</button>
                </td>
            </tr>`;
        } else if (pageType === 'pemasok') {
            row = `<tr id="data-row-${index}">
                <td>${item.kode_pemasok}</td>
                <td>${item.nama_pemasok}</td>
                <td>${item.alamat}</td>
                <td>${item.telepon}</td>
                <td>
                    <button class="btn btn-success edit" data-index="${index}">Edit</button>
                    <button class="btn btn-danger delete" data-index="${index}">Delete</button>
                </td>
            </tr>`;
        }
        tableBody.append(row);
    });
    if (pageType === 'penjualan') {
        calculateTotalPenjualan(); 
    } else if (pageType === 'pembelian') {
        calculateTotalPembelian();
    } else if (pageType === 'barang') {
        calculateTotalBarang();
    } else if (pageType === 'pemasok') {
        calculateTotalPemasok();
    }
}

function addData(pageType) {
    var newData;
    if (pageType === 'penjualan') {
        newData = {
            id_penjualan: $('#addId_penjualan').val(),
            kode_barang: $('#addKode_barang').val(),
            tanggal: $('#addTanggal').val(),
            jumlah: $('#addJumlah').val(),
            total: parseFloat($('#addTotal').val())
        };
    } else if (pageType === 'pembelian') {
        newData = {
            id_pembelian: $('#addId_pembelian').val(),
            kode_barang: $('#addKode_barang').val(),
            kode_supplier: $('#addKode_supplier').val(),
            tanggal: $('#addTanggal').val(),
            jumlah: $('#addJumlah').val(),
            total: $('#addTotal').val()
        };
    } else if (pageType === 'barang') {
        const fileInput = document.getElementById('addGambar_barang');
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onloadend = function() {
        newData = {
            kode_barang: $('#addKode_barang').val(),
            nama_barang: $('#addNama_barang').val(),
            harga_satuan: $('#addHarga_satuan').val(),
            stock: $('#addStock').val(),
            gambar_barang: reader.result
        };
        var data = JSON.parse(localStorage.getItem(pageType) || '[]');
        data.push(newData);
        localStorage.setItem(pageType, JSON.stringify(data));
        renderData(data, pageType);
        $('#addModal').modal('hide');
    };

    if (file) {
        reader.readAsDataURL(file);
    }
    return;
    } else if (pageType === 'pemasok') {
        newData = {
            kode_pemasok: $('#addKode_pemasok').val(),
            nama_pemasok: $('#addNama_pemasok').val(),
            alamat: $('#addAlamat').val(),
            telepon: $('#addTelepon').val()
        };
    }
    var data = JSON.parse(localStorage.getItem(pageType) || '[]');
    data.push(newData);
    localStorage.setItem(pageType, JSON.stringify(data));
    renderData(data, pageType);
    $('#addModal').modal('hide');
}

function prepareModalForEdit(index, pageType) {
    var data = JSON.parse(localStorage.getItem(pageType))[index];
    if (pageType === 'penjualan') {
        $('#dataModalLabel').text('Edit Data Penjualan');
        $('#dataId_penjualan').val(data.id_penjualan);
        $('#dataKode_barang').val(data.kode_barang);
        $('#dataTanggal').val(data.tanggal);
        $('#dataJumlah').val(data.jumlah);
        $('#dataTotal').val(data.total);
    } else if (pageType === 'pembelian') {
        $('#dataModalLabel').text('Edit Data Pembelian');
        $('#dataId_pembelian').val(data.id_pembelian);
        $('#dataKode_supplier').val(data.kode_supplier);
        $('#dataKode_barang').val(data.kode_barang);
        $('#dataTanggal').val(data.tanggal);
        $('#dataJumlah').val(data.jumlah);
        $('#dataTotal').val(data.total);
    } else if (pageType === 'barang') {
        $('#dataModalLabel').text('Edit Data Barang');
        $('#dataKode_barang').val(data.kode_barang);
        $('#dataNama_barang').val(data.nama_barang);
        $('#dataHarga_satuan').val(data.harga_satuan);
        $('#dataStock').val(data.stock);
        $('#dataGambar_barang').val(null);
    } else if (pageType === 'pemasok') {
        $('#dataModalLabel').text('Edit Data Pemasok');
        $('#dataKode_pemasok').val(data.kode_pemasok);
        $('#dataNama_pemasok').val(data.nama_pemasok);
        $('#dataAlamat').val(data.alamat);
        $('#dataTelepon').val(data.telepon);
    }
    $('#dataIndex').val(index);
}

function saveData(pageType) {
    var index = $('#dataIndex').val();
    var data = JSON.parse(localStorage.getItem(pageType) || '[]');
    var newData;
    if (pageType === 'penjualan') {
        newData = {
            id_penjualan: $('#dataId_penjualan').val(),
            kode_barang: $('#dataKode_barang').val(),
            tanggal: $('#dataTanggal').val(),
            jumlah: $('#dataJumlah').val(),
            total: parseFloat($('#dataTotal').val())
        };
    } else if (pageType === 'pembelian') {
        newData = {
            id_pembelian: $('#dataId_pembelian').val(),
            kode_barang: $('#dataKode_barang').val(),
            kode_supplier: $('#dataKode_supplier').val(),
            tanggal: $('#dataTanggal').val(),
            jumlah: $('#dataJumlah').val(),
            total: $('#dataTotal').val()
        };
    } else if (pageType === 'barang') {
        const fileInput = document.getElementById('dataGambar_barang');
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onloadend = function() {
            newData = {
                kode_barang: $('#dataKode_barang').val(),
                nama_barang: $('#dataNama_barang').val(),
                harga_satuan: $('#dataHarga_satuan').val(),
                stock: $('#dataStock').val(),
                gambar_barang: file ? reader.result : data[index].gambar_barang
            };
            if (index === "") {
                data.push(newData);
            } else {
                data[index] = newData;
            }
            localStorage.setItem(pageType, JSON.stringify(data));
            renderData(data, pageType);
            $('#dataModal').modal('hide');
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            newData = {
                kode_barang: $('#dataKode_barang').val(),
                nama_barang: $('#dataNama_barang').val(),
                harga_satuan: $('#dataHarga_satuan').val(),
                stock: $('#dataStock').val(),
                gambar_barang: data[index].gambar_barang
            };
            if (index === "") {
                data.push(newData);
            } else {
                data[index] = newData;
            }
            localStorage.setItem(pageType, JSON.stringify(data));
            renderData(data, pageType);
            $('#dataModal').modal('hide');
        }
        return;
    } else if (pageType === 'pemasok') {
        newData = {
            kode_pemasok: $('#dataKode_pemasok').val(),
            nama_pemasok: $('#dataNama_pemasok').val(),
            alamat: $('#dataAlamat').val(),
            telepon: $('#dataTelepon').val()
        };
    }
    if (index === "") {
        data.push(newData);
    } else {
        data[index] = newData;
    }
    localStorage.setItem(pageType, JSON.stringify(data));
    renderData(data, pageType);
    $('#dataModal').modal('hide');
}

function deleteData() {
    if (!confirm('Are you sure you want to delete this data?')) return;
    var index = $(this).data('index');
    var pageType = $('body').data('page');
    var data = JSON.parse(localStorage.getItem(pageType));
    data.splice(index, 1);
    localStorage.setItem(pageType, JSON.stringify(data));
    renderData(data, pageType);
}

function loadData(pageType) {
    var file = pageType + '.json'; // sales.json, purchases.json, barang.json, or pemasok.json
    $.ajax({
        url: file,
        dataType: 'json',
        success: function(response) {
            localStorage.setItem(pageType, JSON.stringify(response.data));
            renderData(response.data, pageType);
        }
    });
}

function calculateTotalPenjualan() {
    let totalPenjualan = 0;
    $('#dataTable tr').each(function() {
        let totalHarga = parseFloat($(this).find('.total-harga').text());
        if (!isNaN(totalHarga)) {
            totalPenjualan += totalHarga;
        }
    });
    $('#total-penjualan').text('Rp' + totalPenjualan.toLocaleString('id-ID'));
    localStorage.setItem('totalPenjualan', totalPenjualan);
}

function calculateTotalPembelian() {
    let totalPembelian = 0;
    $('#dataTable tr').each(function() {
        let totalHarga = parseFloat($(this).find('.total-harga').text());
        if (!isNaN(totalHarga)) {
            totalPembelian += totalHarga;
        }
    });
    $('#total-pembelian').text('Rp' + totalPembelian.toLocaleString('id-ID'));
    localStorage.setItem('totalPembelian', totalPembelian);
}


function calculateTotalBarang() {
    let totalStock = 0;
    $('#dataTable tr').each(function() {
        let stock = parseFloat($(this).find('.stock').text());
        if (!isNaN(stock)) {
            totalStock += stock;
        }
    });
    $('#total-barang').text(totalStock.toLocaleString('id-ID'));
    localStorage.setItem('totalStock', totalStock);
}

function calculateTotalPemasok() {
    let totalPemasok = 0;
    $('#dataTable tr').each(function() {
        let kodePemasok = $(this).find('td:first').text();
        if (kodePemasok) {
            totalPemasok++;
        }
    });
    $('#total-pemasok').text(totalPemasok.toLocaleString('id-ID'));
    localStorage.setItem('totalPemasok', totalPemasok);
}