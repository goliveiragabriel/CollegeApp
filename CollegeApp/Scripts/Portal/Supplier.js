jQuery(function () {

    $('#buscar-cep').click(function () {
        $('#Cep').cep({
            load: function () {
                //Exibe a div loading
                $('#loading').show();
            },
            complete: function () {
                //Esconde a div loading
                $('#loading').hide();
            },
            error: function (msg) {
                //Exibe em alert a mensagem de erro retornada
                alert(msg);
            },
            success: function (data) {
                $('#Street').val(data.tipoLogradouro + ' ' + data.logradouro);
                //$('#CLI_BAIRRO').val(data.bairro);
                $('#State').val(data.estado);
                $('#City').val(data.cidade);
                $('#Number').focus();
            }
        });
    });

});