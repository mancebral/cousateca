jQuery(function($) { // DOM is now ready and jQuery's $ alias sandboxed
    $('#nav button').click(function(){
        $('html, body').animate({
            scrollTop: $("#footer").offset().top
        }, 300);
    });

    $('#mensaxe_consola button').click(function(){
        pechar_consola();
    });

    function pechar_consola(){
        $('#mensaxe_consola').slideUp();
    }

    function abrir_consola(_mensaxe){
        $('#mensaxe_consola .contido_consola').empty().html(_mensaxe);
        $('#mensaxe_consola').slideDown();
    }

    $('#btn_querer_usar').click(function(){

        var cousa_id = $(this).data('id');
        $('.contido_enviar_usar').html('<div class="campo_form"><label for="nome_solicitante">Nome</label><input type="text" id="nome_solicitante"></input></div><div class="campo_form"><label for="email_solicitante">E-mail</label><input type="email" id="email_solicitante"></input></div><div class="intro">Recibirás un correo sobre como poñerte en contacto co dono da cousa.</div><div class="submit_contenedor"><button type="submit" data-id="'+cousa_id+'">Enviar</button><i class="material-icons spin">loop</i></div>');
        $('.contido_enviar_usar').slideDown();

        $('.contido_enviar_usar input').on('input', function() {
            pechar_consola();
        });

        /* Chamadas ajax */
        /* Enviar solicitude de cousa */
        $('.contido_enviar_usar button').click(function(){
            if( !$('#nome_solicitante').val() ) {
                abrir_consola('O campo nome está vacío');
            }else if(!$('#email_solicitante').val()){
                abrir_consola('O campo E-mail está vacío');
            }else if(!$('#email_solicitante').is(':valid')){
                abrir_consola('O e-mail introducido non é valido');
            }else{
                $('.submit_contenedor i').fadeIn();

                var id = $(this).data('id');
                var email = $('#email_solicitante').val();
                var nome = $('#nome_solicitante').val();

                $.ajax({
                    type: "POST",
                    url: bm_ajax.ajax_url,
                    data: {
                        'action':'pedir_cousa',
                        'cousa_id': id,
                        'email': email,
                        'nome': nome
                    },
                    success: function(msg){
                        var msg_json = JSON.parse(msg);
                        $('.submit_contenedor i').fadeOut();
                        abrir_consola('A solicitude foi enviada');
                    }
                });
            }
        });
    });

    /* Gardar cousa */
    $('#btn_gardar_cousa').click(function(){

        var checkeado = $('#disponible').prop('checked');
        var id = $(this).data('id');

        $.ajax({
            type: "POST",
            url: bm_ajax.ajax_url,
            data: {
                'action':'gardar_cousa',
                'cousa_id': id,
                'checked': checkeado
            },
            success: function(msg){
                var msg_json = JSON.parse(msg);
                abrir_consola('Gardáronse os cambios');
            }
        });
    });


    /* Eliminar cousa */
    $('#btn_eliminar_cousa').click(function(){
        var cousa_id = $(this).data('id');
        $('body').append('<div id="full_conver"><button class="close" type="button"><i class="material-icons">close</i></button><div class="container"><div class="row align-items-center justify-content-center"><div class="col-md-8"><h3>Estás seguro que queres eliminar a cousa?</h3><p>Unha vez que a elimines xa non haberá volta atrás</p><button class="button_03" type="button" id="confirmar_eliminacion">Si</button><button type="button" class="button_03" id="cancelar_eliminacion">Non</button></div></div></div></div>');

        $('#full_conver .close').click(function(){
            $('#full_conver').fadeOut(function(){
                $(this).remove();
            });
        });

        $('#full_conver #cancelar_eliminacion').click(function(){
            $('#full_conver').fadeOut(function(){
                $(this).remove();
            });
        });

        $('#full_conver #confirmar_eliminacion').click(function(){
            $.ajax({
                type: "POST",
                url: bm_ajax.ajax_url,
                data: {
                    'action':'eliminar_cousa',
                    'cousa_id': cousa_id,
                },
                success: function(msg){
                    var msg_json = JSON.parse(msg);
                    window.location = '/cousas?deleted';
                }
            });
        });
    });

    $('.bloque_edicion.checkbox').click(function(){
        if($("input#disponible").prop('checked')){

            $(this).removeClass('checked');
             $('input#disponible').prop("checked", false);
        }else{
            $(this).addClass('checked');
             $('input#disponible').prop("checked", true);
        }
    });

    $('#buscar').submit(function(){
        var texto = $('#buscar input').val();
        var page_url = '/?s='+texto;

        escribir_busqueda(page_url, 'Resultado da búsqueda ' + texto + ':');

        return false;
    });

    $('.listado_tax_buscar a').click(function(){
        var page_url = $(this).attr('href');
        var tax_name = $(this).text();

        escribir_busqueda(page_url, 'Cousas arquivadas en ' + tax_name + ':');

        return false;
    });

    function escribir_busqueda(_url, _txt){

        var alto = $('#list_cousas').height();
        $('#list_cousas').height(alto);

        removeMarkers();

        $('#list_cousas').empty().load(_url + ' #list_cousas .row', function(){
            $('.resultado_busqueda').empty().append(_txt);
            $('#list_cousas').height('auto');
            loadMarkers();
        });

    }

    /* Engadir cousa */
    $('#bm_cousaform_selecciona_uso').change(function(){
        if(!$('#contenedor_licenza_form').is(":visible")){
            $('#contenedor_licenza_form').slideDown();
        }
        $('.dentro_licenza .uso').empty().text($('#bm_cousaform_selecciona_uso option:selected').text() + '.');
        var val = $(this).val();
        switch (val) {
            case 'regalo':
                $('.ver-en-regalar').slideDown();
                $('.condicional').each(function(){
                    if(!$(this).hasClass('ver-en-regalar')){
                        $(this).slideUp();
                    }
                });
                break;
            case 'intercambio':
                $('.ver-en-intercambio').slideDown();
                $('.condicional').each(function(){
                    if(!$(this).hasClass('ver-en-intercambio')){
                        $(this).slideUp();
                    }
                });
                break;
            default:
                $('.ver-en-prestar').slideDown();
                $('.condicional').each(function(){
                    if(!$(this).hasClass('ver-en-prestar')){
                        $(this).slideUp();
                    }
                });
        }
    });

    $('.cmb2-radio-list li').click(function(){

        $(this).siblings().removeClass('checked');

        if($("input", this).prop('checked')){
            $(this).addClass('checked');
        }
    });

    var tempo = '', propositos = '', destinatarios = '', aportacion = '';
    $('#selectores_licenza input[type="radio"]').change(function(){
        switch ($(this).attr('name')) {
            case 'bm_cousaform_tempo':
                tempo = ' <span>Tempo: <span class="minus">' + $(this).siblings('label').text().split("info_outline").join("") + '</span></span>';
                break;
            case 'bm_cousaform_propositos':
                propositos = ' <span>Propósitos: <span class="minus">' + $(this).siblings('label').text().split("info_outline").join("") + '</span></span>';
                break;
            case 'bm_cousaform_destinatarios':
                destinatarios = ' <span>Destinatari@s: <span class="minus">' + $(this).siblings('label').text().split("info_outline").join("") + '</span></span>';
                break;
            case 'bm_cousaform_aportacion':
                aportacion = ' <span>Aportación: <span class="minus">' + $(this).siblings('label').text().split("info_outline").join("") + '</span></span>';
                break;
            default:
        }
        $('.dentro_licenza .seleccions').empty().html(tempo + propositos + destinatarios + aportacion);
        $('#bm_cousaform_licenza_escollida').val($('.dentro_licenza .uso').html() + $('.dentro_licenza .seleccions').html());
        console.log($('#bm_cousaform_licenza_escollida').val());
    });

    $('button').popover();

    $('.term button').click(function(){
        $('#contenedor_licenza_form').slideDown();
    });

    $('#contenedor_licenza_form button.cerrar').click(function(){
        $('#contenedor_licenza_form').slideUp();
    });
});
