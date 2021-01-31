$(document).ready(function () {
    var page = 0;
    const limit = 16;
    getAllCard(page, limit);


    $('#load').on('click', function () {
        page += limit;
        getAllCard(page, (page+limit));
    })
});


function getAllCard(page, limit) {
    $.ajax({
        url: 'https://db.ygoprodeck.com/api/v7/cardinfo.php',
        method: 'GET',
        success: function (res) {
            var cards = '';
            $.each(res.data.slice(page, limit), function (ind, val) {
                cards += '<div class="col-6 col-md-4 col-xl-3 mb-3" data-id="'+ val.id +'" onclick="getById(this)" style="cursor: zoom-in"> ' +
                    '<div class="card">' +
                    '<img src="' + val.card_images[0].image_url + '" class="card-img-top">' +
                    '<div class="card-body">' +
                    '<h6>' + ((val.name.length > 15) ? val.name.substring(0, 15) + '...' : val.name) + '</h6>' +
                    '<p class="card-text">' + ((val.desc.length > 40) ? val.desc.substring(0, 40) + '...': val.desc) + '</p>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            });
            $('#cards').append(cards);
        }
    });
}

function getById(obj)
{
    var id = $(obj).data('id');
    $.ajax({
        url: 'https://db.ygoprodeck.com/api/v7/cardinfo.php?id=' + id,
        method: 'GET',
        success: function (res) {
            console.log(res);
            $('#piccard').attr('src', res.data[0].card_images[0].image_url);
            $('#detailModalLabel').html(res.data[0].name);
            $('#cardname').html(res.data[0].name);
            $('#carddesc').html(res.data[0].desc);
            $('#type').html((res.data[0].type != 'Spell Card' && res.data[0].type != 'Trap Card') ? '[' + res.data[0].type.replaceAll(' ', ' / ') + ']' : '[' + res.data[0].type + ']');
            $('#race').html(res.data[0].race);
            $('#rarity').html((res.data[0].card_sets != null) ? res.data[0].card_sets[0].set_rarity : '-');
            $('#level').html(res.data[0].level || 0);
            $('#atk').html(res.data[0].atk || 0);
            $('#def').html(res.data[0].def || 0);
            $('#detailModal').modal('show');
        }
    });
}

function search()
{
    var query = $('#search').val();
    if (query.trim().indexOf(' ') != -1) {
        var url = '?fname=' + encodeURI(query);
    } else {
        var url = '?fname=' + encodeURI(query);
    }

    $.ajax({
        url: 'https://db.ygoprodeck.com/api/v7/cardinfo.php' + url,
        method: 'GET',
        success: function (res) {
            $('#cards').empty();
            var cards = '';
            $.each(res.data, function (ind, val) {
                cards += '<div class="col-6 col-md-4 col-xl-3 mb-3" data-id="'+ val.id +'" onclick="getById(this)" style="cursor: zoom-in"> ' +
                    '<div class="card">' +
                    '<img src="' + val.card_images[0].image_url + '" class="card-img-top">' +
                    '<div class="card-body">' +
                    '<h6>' + ((val.name.length > 20) ? val.name.substring(0, 20) + '...' : val.name) + '</h6>' +
                    '<p class="card-text">' + ((val.desc.length > 25) ? val.desc.substring(0, 25) + '...': val.desc) + '</p>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            });
            $('#load').hide();
            $('#cards').append(cards);
        },
        error: function (err) {
            $('#cards').empty();
            $('#cards').append('<div class="col-12 text-center" style="font-weigth: 600"><p>Tidak ada data kartu. Pastikan masukan nama kartu secara lengkap atau cukup masukan satu kosa kata saja</p></div>');
        }
    });

}
