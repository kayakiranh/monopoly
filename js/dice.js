$(document).ready(function () {
    let history = [];
    const dice = $('#dice__cube');
    const animationSpeed = dice.css('transition-duration').split(',')[0].replace(/[^-\d\.]/g, '') * 1000;

    function rollDice(side) {
        let currentClass = dice.attr('class').split(' ')[0];
        let newClass = 'show-' + side;

        dice.removeClass();

        if (currentClass == newClass) {
            dice.addClass(newClass + ' show-same');
            setTimeout(function () {
                dice.removeClass('show-same');
            }, animationSpeed);
        } else {
            dice.addClass(newClass);
        }

        history.push(side);
    }

    function soundEffectWithFilter(hp, tl, corner) {
        let audio = $("#dice__audio")[0];
        if (corner == "1") audio = $("#corner__audio")[0];
        else if (hp == "0" && tl == "0") audio = $("#luck__audio")[0];
        else if (hp == "-1" && tl == "-1") audio = $("#dice__audio")[0];
        else if (parseInt(hp) > 0 || parseInt(tl) > 0) audio = $("#positive__audio")[0];
        else if (parseInt(hp) < 0 || parseInt(tl) < 0) audio = $("#negative__audio")[0];
        else if (hp == "50" && tl == "20") audio = $("#start__audio")[0];


        audio.pause();
        audio.currentTime = 0;
        audio.play();
    }

    document.body.onkeyup = function (e) {
        if (e.keyCode == 32) {
            const isRolling = $("#diceArea").hasClass("rolling");
            if (isRolling === false) {
                rolling();
            }
            else {
                alert("rolling");
            }
        }
    }

    function rolling() {
        setTimeout(function () {
            //şans kartını sıfırla
            $("div.card-container div.card").css("transform", "rotateY(0deg)");
            $('div.back').data('hp', -10);
            $('div.back').data('tl', -10);
            $('div.back').data('text', 'Şans kartı seçiminde değilsin. Şansını önceden görmeye çalıştığın için -10 HP cezalandırıldın.');
            $('div.back').text('Şans kartı seçiminde değilsin. Şansını önceden görmeye çalıştığın için -10 HP cezalandırıldın.');
            //işlemler bitene kadar zar atmasını engelle
            $("#diceArea").addClass("rolling");
            $("#diceArea").css("pointer-events", "none");

            rollDice('front');
            soundEffectWithFilter(-1, -1, 0);
            setTimeout(function () {
                rollDice('back');
                soundEffectWithFilter(-1, -1, 0);
                setTimeout(function () {
                    rollDice('right');
                    soundEffectWithFilter(-1, -1, 0);
                    setTimeout(function () {
                        rollDice('left');
                        soundEffectWithFilter(-1, -1, 0);
                        setTimeout(function () {
                            rollDice('top');
                            soundEffectWithFilter(-1, -1, 0);
                            setTimeout(function () {
                                rollDice('bottom');
                                soundEffectWithFilter(-1, -1, 0);
                                setTimeout(function () {

                                    const finalHp = $('#finalHp').text();
                                    const finalTl = $('#finalTl').text();

                                    //zar at
                                    const number = Math.floor((Math.random() * 6) + 1)
                                    dice.removeClass();
                                    dice.addClass('show-front');

                                    if (number == 1) { rollDice('front'); }
                                    else if (number == 6) { rollDice('back'); }
                                    else if (number == 4) { rollDice('right'); }
                                    else if (number == 3) { rollDice('left'); }
                                    else if (number == 2) { rollDice('top'); }
                                    else if (number == 5) { rollDice('bottom'); }

                                    //hesaplamaya başla
                                    const atilanZar = number;
                                    const ilkToplamZarText = $('#totalDice').text();
                                    const ilkToplamZarInt = parseInt(ilkToplamZarText);

                                    let sonToplamZarInt = ilkToplamZarInt + parseInt(atilanZar);

                                    //son toplam zar değerini yazdır
                                    $('#totalDice').text(sonToplamZarInt);

                                    //ilk ve son pozisyonların data-id değerleri
                                    const ilkPozisyonId = ilkToplamZarInt - (32 * parseInt(Math.floor(ilkToplamZarInt / 32)));
                                    const sonPozisyonId = sonToplamZarInt - (32 * parseInt(Math.floor(sonToplamZarInt / 32)));
                                    soundEffectWithFilter(-1, -1, 0);

                                    //son pozizson id değerini yazdır
                                    $('#lastId').text(sonPozisyonId);

                                    //son pozisyonun hangi kartta olduğunu bul
                                    const sonKart = $("div").find(`[data-id='${sonPozisyonId}']`);

                                    //son kart şans kartımı kontrol et
                                    if (sonKart.data('text') == 'Şans Kartı Seç') {
                                        const luckArray = [
                                            {
                                                hp: "0",
                                                tl: "500",
                                                text: "İngiliz turistlere sahte para verdin, 20 pound dolandırdın"
                                            }, {
                                                hp: "100",
                                                tl: "0",
                                                text: "Ayakta tedavi edildin, 100 HP yenilendi"
                                            }, {
                                                hp: "0",
                                                tl: "140",
                                                text: "Taksici uzun yoldan gitti, 140 ₺ dolandırıldın"
                                            }, {
                                                hp: "-150",
                                                tl: "0",
                                                text: "İnşaattaki kürtlerle kavga ettin, 150 HP dayak yedin"
                                            }, {
                                                hp: "-40",
                                                tl: "0",
                                                text: "Trafikte kavga çıktı, 40 HP dayak yedin"
                                            }, {
                                                hp: "0",
                                                tl: "400",
                                                text: "Telefon dolandırıcılığı yaptın, 400 ₺ dolandırıldın"
                                            }, {
                                                hp: "0",
                                                tl: "400",
                                                text: "Hastaneye uğradın, 200 HP yenilendi"
                                            }
                                        ];
                                        const randomItem = luckArray[Math.floor(Math.random() * luckArray.length)];

                                        $('div.back').data('hp', randomItem.hp);
                                        $('div.back').data('tl', randomItem.tl);
                                        $('div.back').data('text', randomItem.text);
                                        $('div.back').text(randomItem.text);
                                        $("div.card-container div.card div.front").trigger("click");

                                        const luckHp = $('div.back').data('hp');
                                        const lucktl = $('div.back').data('tl');

                                        $('#finalHp').text(parseInt(finalHp) + parseInt(luckHp));
                                        $('#finalTl').text(parseInt(finalTl) + parseInt(lucktl));

                                        sonKart.data('hp', luckHp);
                                        sonKart.data('tl', lucktl);
                                    }

                                    //başlangıç noktasına gittiyse; son pozisyon değerini 0 yap, bakiyeye +50 HP +20 TL ekle ve yazdır, audio çal
                                    if (sonToplamZarInt == 32 || sonToplamZarInt % 32 == 0) {

                                        $('#lastPoint').text(0);
                                        $('#finalHp').text(parseInt(finalHp) + 50);
                                        $('#finalTl').text(parseInt(finalTl) + 20);
                                        //animasyon ve ses
                                        $("#player").animate({ top: sonKart.data("top"), left: sonKart.data("left") }, 2000, 'linear');
                                        soundEffectWithFilter(0, 0, 0);
                                    }
                                    //toplam atılan zar sayısı 32'den büyük ise, en az 1 tur atılmıştır. farklı hesaplama yap
                                    else if (sonToplamZarInt >= 32) {
                                        //son pozisyon değerini yazdır
                                        $('#lastPoint').text(sonPozisyonId);

                                        //son pozisyon id, ilk pozisyon id'den büyük ise; başlangıç noktasından geçti demektir. bakiyeye +50 HP +20 TL ekle ve yazdır
                                        if (parseInt(sonPozisyonId) < parseInt(ilkPozisyonId)) {
                                            $('#finalHp').text(parseInt(finalHp) + 50);
                                            $('#finalTl').text(parseInt(finalTl) + 20);
                                        }

                                        //son pozisyondaki hp ve tl değerini ekleyip yazdır
                                        $('#finalHp').text(parseInt(finalHp) + parseInt(sonKart.data("hp")));
                                        $('#finalTl').text(parseInt(finalTl) + parseInt(sonKart.data("tl")));

                                        //animasyon ve ses
                                        $("#player").animate({ top: sonKart.data("top"), left: sonKart.data("left") }, 2000, 'linear');
                                        soundEffectWithFilter(sonKart.data("hp"), sonKart.data("tl"), sonKart.data("corner"));
                                    }
                                    //toplam atılan zar sayısı 32'den küçük ise, ilk tur için hesaplama yap
                                    else {
                                        //son pozisyon değerini yazdır
                                        $('#lastPoint').text(sonPozisyonId);

                                        //son pozisyondaki hp ve tl değerini ekleyip yazdır
                                        $('#finalHp').text(parseInt(finalHp) + parseInt(sonKart.data("hp")));
                                        $('#finalTl').text(parseInt(finalTl) + parseInt(sonKart.data("tl")));

                                        //animasyon ve ses
                                        $("#player").animate({ top: sonKart.data("top"), left: sonKart.data("left") }, 2000, 'linear');
                                        soundEffectWithFilter(sonKart.data("hp"), sonKart.data("tl"), sonKart.data("corner"));
                                    }

                                    //tarihçeye son kart bilgilerini yazdır.
                                    $("#tarihceLog").append("<p><hr />Zar : " + atilanZar + " | Total Zar : " + sonToplamZarInt + "<br />HP : " + $('#finalHp').text() + " | TL : " + $('#finalTl').text() + "<br />İşlem: " + sonKart.data('text') + "<br />Sonuç : " + sonKart.data('hp') + " HP, " + sonKart.data('tl') + " ₺</p>");

                                    //öldümü diye kontrol et
                                    const deadCheck = parseInt($('#finalHp').text());
                                    if (deadCheck <= 0) {
                                        //herşeyi sıfırla
                                        $('#tarihceLog').empty();
                                        $('#finalHp').text(100);
                                        $('#finalTl').text(100);
                                        $('#lastPoint').text(0);
                                        $('#totalDice').text(0);
                                        sansKartiniSifirla();
                                        //animasyon, audio ve uyarı
                                        soundEffectWithFilter(-1, -1, -1);
                                        $("#player").animate({ top: '760px', left: '1270px' }, 2000, 'linear');

                                        const audio = $("#dead__audio")[0];
                                        audio.pause();
                                        audio.currentTime = 0;
                                        audio.play();

                                        alert("dead");
                                    }
                                    //zar atmasına izin ver
                                    $("#diceArea").removeClass("rolling");
                                    $("#diceArea").css("pointer-events", "auto");

                                }, 1000);
                            }, 1000);
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }

    $('#dice__cube').on('click ', function () {
        const isRolling = $("#diceArea").hasClass("rolling");
        if (isRolling === false) {
            rolling();
        }
        else {
            alert("rolling");
        }
    });
});