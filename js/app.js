init();
function init() {
    $(".table").hide();
    $("#start").show();
    $("#rules").hide();
    $("#diceArea").hide();
    $("#status").hide();
    $("#tarihce").hide();
    $("#player").hide();
}

function sansKartiniSifirla() {
    $("div.card-container div.card").css("transform", "rotateY(0deg)");
    $('div.back').data('hp', -10);
    $('div.back').data('tl', -10);
    $('div.back').data('text', 'Şans kartı seçiminde değilsin. Şansını önceden görmeye çalıştığın için cezalandırıldın.');
    $('div.back').text('Şans kartı seçiminde değilsin. Şansını önceden görmeye çalıştığın için cezalandırıldın.');
}

$(document).on('click', '#startGame', function () {
    $(".table").show();
    $("#start").hide();
    $("#rules").show();
    $("#diceArea").show();
    $("#status").show();
    $("#tarihce").show();
    $("#player").show();
    sansKartiniSifirla();
});

$(document).on('click', '#buyHpLink', function () {
    const finalHp = $('#finalHp').text();
    const finalTl = $('#finalTl').text();

    if (parseInt(finalTl) >= 100) {
        const kalanTl = parseInt(finalTl) - 100;
        $('#finalTl').text(kalanTl);
        $('#finalHp').text(parseInt(finalHp) + 20);

        $("#tarihceLog").append("<p><hr />HP : " + $('#finalHp').text() + " | TL : " + $('#finalTl').text() + "<br />İşlem: 100 ₺ karşılığı 20 HP satın aldınız  <br />Sonuç : 20 HP, -100 ₺</p>");
    }
    else {
        alert("yetersiz bakiye");
    }
});



$('input[type=range]').on('input', function () {
    console.log($(this)[0].value);
    const finalVolume = parseFloat(parseInt($(this)[0].value) / 100)
    $('audio').prop('volume', finalVolume);
});


$(document).on('click', '.card-container div.front', function () {
    //son pozisyonun hangi kartta olduğunu bul
    const sonPozisyonId = $('#lastId').text();
    const sonKart = $("div").find(`[data-id='${sonPozisyonId}']`);

    //son kart şans kartımı kontrol et
    if (sonKart.data('text') != 'Şans Kartı Seç') {
        const finalHp = $('#finalHp').text();
        const finalTl = $('#finalTl').text();
        $('#finalHp').text(parseInt(finalHp) + parseInt("-10"));
        $('#finalTl').text(parseInt(finalTl) + parseInt("-10"));

        $("#tarihceLog").append("<p><hr />HP : " + $('#finalHp').text() + " | TL : " + $('#finalTl').text() + "<br />İşlem: Şans kartı seçiminde değilsin. Şansını önceden görmeye çalıştığın için cezalandırıldın. <br />Sonuç : -10 HP, -10 ₺</p>");
    }

    if ($('div.card-container div.card').css('transform') == 'matrix3d(-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1)') {
        $("div.card-container div.card").css("transform", "rotateY(0deg)");
    }
    else {
        $("div.card-container div.card").css("transform", "rotateY(180deg)");
    }

    const deadCheck = parseInt($('#finalHp').text());
    if (deadCheck <= 0) {
        //herşeyi sıfırla
        $('#tarihceLog').empty();
        $('#finalHp').text(100);
        $('#finalTl').text(100);
        $('#lastPoint').text(0);
        $('#totalDice').text(0);

        setTimeout(function () {
            sansKartiniSifirla();
            setTimeout(function () {
                //animasyon, audio ve uyarı
                soundEffectWithFilter(-1, -1, -1);
                $("#player").animate({ top: '760px', left: '1270px' }, 2000, 'linear');

                const audio = $("#dead__audio")[0];
                audio.pause();
                audio.currentTime = 0;
                audio.play();

                alert("dead");
            }, 1000);
        }, 1000);


    }

});