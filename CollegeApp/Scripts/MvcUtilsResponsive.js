//ATENÇÃO - DECLARE UMA VARIAVEL EM UM SCRIPT GLOBAL EM SEU PROJETO, COMO OSTRADO ABAIXO, PARA HABILITAR A EXIBIÇÃO DO MODAL DE AGUARDE
//var showAguarde = true;


/* Regras de otimização de usabilidade do AtenaWEB
    - Procurar fazer as validações, regras de input, formatações de conteúdo, enfim, qualquer regra de usabilidade baseado em classes css, e adicionar aqui a regra
    - Exemplo:  Para fazer com que um campo exiba um calendário basta adicionar nele o atributo class="calendar"
                Para adicionar mais de uma regra use um espaço, por exemplo, para dizer que o campo é um calendário e é obrigatório use class="calendar required"

    
    CLASSES DE FORMATAÇÃO E VALIDAÇÃO (use no atributo class do html)
    required    - Denota a obrigatoriedade de um campo 
    calendar    - Transforma o campo em um date-picker usando jqueryUI e valida a data
    integer     - Permite a digitação somente de números inteiros positivos no campo
    zeroInteger - Permite a digitação somente de números inteiros positivos no campo e zero
    number      - valida valor numérico (com ponto decimal e sinal de negativo)
    cpf         - Coloca máscara e valida número de cpf 
    cnpj        - Coloca máscara e valida número de cnpj 
    email       - valida se o valor preenchido é um email (implementar)
    
*/


/*
--jaldo
Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + days);
}
*/

//Enumerador dos ícones das mensagens modais
var MensagemEnum = {
    INFO: 0,
    ERRO: 1,
    ALERTA: 2,
    OK: 3,
    QUESTAO: 4,
    NENHUM: 5
};


/* Funcoes genéricas usada no projeto AtenaWEB */
jQuery(function ($) {

    // Inicialização default da variável global do diretório de imagens, deve ser inicilializada no config.js
    if (window.location != 'undefined' && window.location.host != 'undefined') {

        var path = '/Content/images' //pasta onde estão as imagens

        if (window.location.pathname.split('/')[1] != 'undefined' && window.location.pathname.split('/')[1].length > 0) {
            if (window.location.hostname == "localhost")
                imagesPath = window.location.protocol + "//" + window.location.host + path;
            else
                imagesPath = window.location.protocol + "//" + window.location.host + "/" + /* window.location.pathname.split('/')[1] + */ path;
        }
        else {
            imagesPath = window.location.protocol + "//" + window.location.host + path;
        }
    }
    else { 

        if (typeof imagesPath == 'undefined') imagesPath = '../Content/images';
        if (window['imagesPath'] == undefined) imagesPath = '../Content/images';
        if (window['imagesPath'] == void 0) imagesPath = '../Content/images';
    }

    //Configuração padrão dos calendários
    $.datepicker.regional['pt-BR'] = {
        closeText: 'Fechar',
        prevText: 'M&ecirc;s Anterior',
        nextText: 'Pr&oacute;ximo M&ecirc;s',
        currentText: 'Hoje',
        monthNames: ['Janeiro', 'Fevereiro', 'Mar&ccedil;o', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        dayNames: ['Domingo', 'Segunda-feira', 'Ter&ccedil;a-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'S&aacute;bado'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'S&aacute;b'],
        dayNamesMin: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'S&aacute;b'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 0,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    //Aplica a configuração para todos os calendários que forem criados a partir daqui
    $.datepicker.setDefaults($.datepicker.regional['pt-BR']);

    loadClassRules(document);

    //Configura as mensagens padrões de validação do plugin
    /*$.extend($.validator.messages, {
        required: "Campo obrigatório.",
        remote: "Campo inválido.",
        email: "Email inválido.",
        url: "URL inválida.",
        date: "Data inválida.",
        dateISO: "Data inválida.",
        calendar: "Data inválida",
        number: "Número inválido.",
        integer: "Número inválido.",
        zeroInteger: "Número inválido.",
        creditcard: "Nº de cartão inválido.",
        equalTo: "Dados diferentes.",
        accept: "Tipo inválido.",
        maxlength: $.validator.format("Máximo de {0} caracteres."),
        minlength: $.validator.format("Mínimo de {0} caracteres."),
        rangelength: $.validator.format("Tamanho entre {0} e {1} caracteres."),
        range: $.validator.format("Valor entre {0} e {1}."),
        max: $.validator.format("Valor máximo: {0}."),
        min: $.validator.format("Valor mínimo: {0}."),
        cnpj: "CNPJ inválido",
        cpf: "CPF inválido"
    });

    //Sobrescreve o método number e range por causa do ponto decimal, pois ele considera virgula como padrão
    $.validator.methods.number = function (value, element) {
        return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:[\s\.,]\d{3})+)(?:[\.,]\d+)?$/.test(value);
    }
    $.validator.methods.range = function (value, element, param) {
        var globalizedValue = value.replace(",", ".");
        return this.optional(element) || (globalizedValue >= param[0] && globalizedValue <= param[1]);
    }

    // Adiciona um método ao plugin para validar datas reais em formato nacional (d/m/a)
    $.validator.addMethod("calendar", function (value, element) {
        var check = false;
        var re = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
        if (re.test(value)) {
            var adata = value.split('/');
            var dd = parseInt(adata[0], 10); // dia
            var mm = parseInt(adata[1], 10); // mes
            var yyyy = parseInt(adata[2], 10); // ano
            //Tenta criar uma nova data com os valores passados
            var xdata = new Date(yyyy, mm - 1, dd);
            if ((xdata.getFullYear() == yyyy) && (xdata.getMonth() == mm - 1) && (xdata.getDate() == dd))
                check = true;
            else
                check = false;
        } else
            check = false;
        return this.optional(element) || check;
    },
        "Data inválida."
    );

    // Adiciona um método ao plugin para validar cnpj
    $.validator.addMethod("cnpj", function (cnpj, element) {
        cnpj = $.trim(cnpj);// retira espaços em branco

        // DEIXA APENAS OS NÚMEROS
        cnpj = replaceAll(cnpj, '/', '');
        cnpj = replaceAll(cnpj, '.', '');
        cnpj = replaceAll(cnpj, '-', '');
        cnpj = replaceAll(cnpj, '_', '');
        //Se estiver em branco considera true
        if (cnpj.length == 0) return true;


        var numeros, digitos, soma, i, resultado, pos, tamanho, digitos_iguais;
        digitos_iguais = 1;

        if (cnpj.length < 14 && cnpj.length < 15) {
            return false;
        }
        for (i = 0; i < cnpj.length - 1; i++) {
            if (cnpj.charAt(i) != cnpj.charAt(i + 1)) {
                digitos_iguais = 0;
                break;
            }
        }

        if (!digitos_iguais) {
            tamanho = cnpj.length - 2
            numeros = cnpj.substring(0, tamanho);
            digitos = cnpj.substring(tamanho);
            soma = 0;
            pos = tamanho - 7;

            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2) {
                    pos = 9;
                }
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0)) {
                return false;
            }
            tamanho = tamanho + 1;
            numeros = cnpj.substring(0, tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2) {
                    pos = 9;
                }
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1)) {

                return false;
            }

            return true;
        } else {

            return false;
        }
    });


    //Adiciona o método de validação de cpf
    $.validator.addMethod("cpf", function (value, element) {
        value = $.trim(value);

        //Se estiver em branco considera true
        if (value.length == 0) return true;

        value = value.replace('.', '');
        value = value.replace('.', '');
        cpf = value.replace('-', '');
        while (cpf.length < 11) cpf = "0" + cpf;
        var expReg = /^0+$|^1+$|^2+$|^3+$|^4+$|^5+$|^6+$|^7+$|^8+$|^9+$/;
        var a = [];
        var b = new Number;
        var c = 11;
        for (i = 0; i < 11; i++) {
            a[i] = cpf.charAt(i);
            if (i < 9) b += (a[i] * --c);
        }
        if ((x = b % 11) < 2) { a[9] = 0 } else { a[9] = 11 - x }
        b = 0;
        c = 11;
        for (y = 0; y < 10; y++) b += (a[y] * c--);
        if ((x = b % 11) < 2) { a[10] = 0; } else { a[10] = 11 - x; }

        var retorno = true;
        if ((cpf.charAt(9) != a[9]) || (cpf.charAt(10) != a[10]) || cpf.match(expReg)) retorno = false;

        return this.optional(element) || retorno;

    });

    //Adiciona o método que compara duas datas. É preciso ter um campo com a classe startDate e outro com a endDate pra funcionar
    $.validator.addMethod("endDate", function (value, element) {

        var startDate = $('input.startDate').val();
        //Se nenhum foi preenchido considera válido, outro validador deve se ocupar da obrigatoriedade
        if (startDate == "" && value == "")
            return true;

        //Só valida se os dois foram preenchidos corretamente, o formato não compete a este validador
        if (validarData(startDate) && validarData(value)) {
            return compararDatas(value, startDate, true);
        }
        else {
            return true;
        }

    }, "Data final deve ser maior que a inicial");

    //Adiciona o método que compara dois valores. É preciso ter um campo com a classe minValue e outro com a maxValue pra funcionar
    $.validator.addMethod("maxValue", function (value, element) {
        var $minField = $('input.minValue');
        var minValue = parseFloat($minField.val().replace(",", "."));

        var $maxField = $(element);
        var maxValue = parseFloat(value.replace(",", "."));

        //Só valida se os dois foram preenchidos corretamente, a obrigatoriedade e o formato não competem a este validador
        if (isNaN(minValue) || isNaN(maxValue))
            return true;
        else
            return (minValue <= maxValue);
    }, "Valor final deve ser maior que o inicial");

    //Adiciona o método que valida se o número inteiro é zero
    $.validator.addMethod("integer", function (value, element) {
        //Só valida se o valor foi preenchido corretamente, a obrigatoriedade e o formato não competem a este validador
        if (value == undefined || value == null || value == "")
            return true;

        var intValue = parseInt(value);


        if ($(element).hasClass("zeroInteger"))
            return intValue != NaN;
        else
            return (intValue != NaN && intValue > 0)
    }, "Número inválido.");


    //Faz com que o uso das classes css usem as validações customizadas
    $.validator.addClassRules("calendar", { calendar: true });
    $.validator.addClassRules("cnpj", { cnpj: true });
    $.validator.addClassRules("cpf", { cpf: true });
    $.validator.addClassRules("startDate", { calendar: true });
    $.validator.addClassRules("endDate", { calendar: true, endDate: true });
    $.validator.addClassRules("maxValue", { maxValue: true });
    $.validator.addClassRules("integer", { integer: true });
    $.validator.addClassRules("zeroInteger", { integer: true });

    //Configura o documento para usar o plugin tooltip que exibe a propriedade title em um frame
    //$(document).tooltip();


    // workaround para problemas do jqueryUI dialog
    try { $("#textoModal").dialog("destroy"); } catch (e) { }
*/
});

function loadClassRules(context) {
    var calendarios = $('.calendar', context);

    $.datepicker.regional['pt-BR'] = {
        closeText: 'Fechar',
        prevText: 'M&ecirc;s Anterior',
        nextText: 'Pr&oacute;ximo M&ecirc;s',
        currentText: 'Hoje',
        monthNames: ['Janeiro', 'Fevereiro', 'Mar&ccedil;o', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        dayNames: ['Domingo', 'Segunda-feira', 'Ter&ccedil;a-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'S&aacute;bado'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'S&aacute;b'],
        dayNamesMin: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'S&aacute;b'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 0,
        isRTL: false,
        showMonthAfterYear: false,
        showButtonPanel: true,
        yearSuffix: ''
    };
    //Aplica a configuração para todos os calendários que forem criados a partir daqui
    $.datepicker.setDefaults($.datepicker.regional['pt-BR']);
    if (calendarios.length > 0) calendarios.datepicker($.datepicker.regional['pt-BR']);

    // Funcao que permite somente numeros inteiros no controle, chama um callback pra validar se o valor inserido é numérico ao perder o foco
    //$(".integer", context).numeric({ negative: false, decimal: false }, getNumeric);
    //$(".number", context).numeric({ decimal: "," }, getNumeric);
    //$(".zeroInteger", context).numeric({ negative: false, decimal: false }, getNumeric);
}

//funcao generica que interrompe a propagação de um evento nos controles DOM
function cancelEvent(event) {
    if (event.stopPropagation) { // W3C/addEventListener()
        event.stopPropagation();
    } else { // Older IE.
        event.cancelBubble = true;
    }
}

function getNumeric(data) {
    data = data.replace(/[^0-9]/, "");
}

function isInteger(data) {
    /// <summary>
    /// Verifica se o valor passado é um número inteiro positivo
    /// </summary>
    /// <param name="data" type="String">Dado a ser validado</param>
    var intRegex = /^\d+$/;
    return intRegex.test(data);
}

function CheckFileSizeAllowed(fileName, fileMaxSize) {
    /// <summary>
    /// Verifica tamanho de arquivo permitido para upload.
    /// [0: Ok | 1: Arquivo acima do limite informado | -1: Arquivo inválido/corrompido]
    /// </summary>
    /// <param name= "nameFile" type="String">Nome do arquivo</param>
    /// <param name= "sizeMaxFile" type="String">Tamanho máximo do arquivo</param>
    var allowed = 0;
    var inputFile = document.getElementById(fileName);
    if (navigator.appName == "Microsoft Internet Explorer") {
        var imagem = new Image();
        imagem.src = inputFile.value;
        var tamanhoArquivo = imagem.fileSize;
        if (tamanhoArquivo > 0) {
            if (tamanhoArquivo > fileMaxSize) {
                allowed = 1;
            }
        }
        else {
            allowed = -1;
        }
    }
    else {
        if (parseInt(inputFile.files[0].size) > 0) {
            if (parseInt(inputFile.files[0].size) > fileMaxSize) {
                allowed = 1;
            }
        }
        else {
            allowed = -1;
        }
    }
    return allowed;
}

function submitForm(formId) {
    /// <summary>
    /// Exibe o modal de aguarde e envia o formulário. Deve ser usada somente para posts completos. Não use para chamadas AJAX 
    /// </summary>
    /// <param name="formId" type="String"> Id do formulário a ser enviado </param>
    submitFormMsg(formId, 'Aguarde...')
}

function clearForm(formId) {
    /// <summary>
    /// Limpa todos os campos do formulário. Use a classe skipClean nos campos que não deseja limpar e eles serão mantidos.
    /// </summary>
    /// <param name="formId" type="String"> Id do formulário</param>

    var $form = $("#" + formId);
    $form.find("input:checked:not(.skipClean)").each(function (index, element) {
        $(this).removeAttr("checked");
    });
    $form.find("input[type='text']:not(.skipClean)").val("");
    $form.find("textarea:not(.skipClean)").html("");
    $form.find("select:not(.skipClean)").val("");
}

function submitFormMsg(formId, mensagem) {
    /// <summary>
    /// Exibe o modal de aguarde com mensagem personalizada e envia o formulario. Deve ser usada somente para posts completos. Não use para chamadas AJAX 
    /// </summary>
    /// <param name="formId" type="String"> Id do formulário a ser enviado </param>
    /// <param name="mensagem" type="String"> Texto a ser exibido na modal de aguarde </param>
    modalAguarde(mensagem);
    $('input:button').attr('disabled', true);
    $('#' + formId).submit();
}


function sendAjaxPost(urlAction, data, loaderControl, callBack) {
    /// <summary>
    /// Faz uma chamada ajax via POST, exibe o loader (se informado), trata erro e exibe em modal (se ocorrer)
    /// </summary>
    /// <param name="urlAction" type="String"> url do controller/action a ser chamado </param>
    /// <param name="data" type="String"> dados serializados a serem enviados na requisição </param>
    /// <param name="loaderControl" type="Controle DOM"> Opcional, controle que exibirá o loader enquanto a requisição estiver em processo</param>
    /// <param name="callBack" type="function"> função javascript a ser chamada quando a requisição for completada com sucesso </param>
    sendAjaxRequest("POST", urlAction, data, loaderControl, callBack);
}


function sendAjaxGet(urlAction, data, loaderControl, callBack) {
    /// <summary>
    /// Faz uma chamada ajax via GET, exibe o loader (se informado), trata erro e exibe em modal (se ocorrer)
    /// </summary>
    /// <param name="urlAction" type="String"> url do controller/action a ser chamado </param>
    /// <param name="data" type="String"> dados serializados a serem enviados na requisição </param>
    /// <param name="loaderControl" type="Controle DOM"> Opcional, controle que exibirá o loader enquanto a requisição estiver em processo</param>
    /// <param name="callBack" type="function"> função javascript a ser chamada quando a requisição for completada com sucesso </param>
    sendAjaxRequest("GET", urlAction, data, loaderControl, callBack);
}

function sendAjaxRequest(type, urlAction, data, loaderControl, callBack) {
    /// <summary>
    /// Faz uma chamada ajax, usando os parâmetros passados
    /// </summary>
    /// <param name="type" type="String"> POST ou GET </param>
    /// <param name="urlAction" type="String"> url do controller/action a ser chamado </param>
    /// <param name="data" type="String"> dados serializados a serem enviados na requisição </param>
    /// <param name="loaderControl" type="Controle DOM">Opcional, controle que exibirá o loader enquanto a requisição estiver em processo</param>
    /// <param name="callBack" type="function"> função javascript a ser chamada quando a requisição for completada com sucesso </param>

    $.ajax({
        url: urlAction,
        data: data,
        type: type,
        beforeSend: function () {
            if (loaderControl != null && loaderControl != undefined) {
                $(loaderControl).show();

            }
            else {
                modalAguarde("Aguarde...");
            }
        },
        complete: function () {
            if (loaderControl != null && loaderControl != undefined) {
                $(loaderControl).hide();
            }
            else {
                fecharModalAguarde();
                //$('body').removeClass('modal-open');
                //$('.modal-backdrop').remove();
            }
        },
        error: function (request, status, error) {
            modalErro("Erro", request.responseText);
        },
        success: callBack
    });
}

function createDialogForm(containerId, opt) {
    /// <summary>
    /// Cria um modal silenciosamente, sem exibi-lo. Este método deve ser chamado de preferência no load das páginas
    /// </summary>
    /// <param name="containerId" type="String">Id da div que será usada como formulário modal </param>
    /// <param name="title" type="String">Título do modal</param>
    /// <param name="height" type="String">Altura da janela modal, em pixels</param>
    /// <param name="width" type="String">Largura da janela modal, em pixels</param>
    /// <param name="callBack" type="function">Função javascript a ser chamada quando o modal for fechado</param>
    $("#" + containerId).dialog(opt);
}

function showDialogForm(containerId, opt) {
    /// <summary>
    /// Exibe um modal criado anteriormente com o método createDialogForm
    /// </summary>
    /// <param name="containerId" type="String">Id da div que será usada como formulário modal </param>
    $("#" + containerId).dialog(opt).dialog("open");
}

function createAndShowDialogForm(containerId, title, height, width, callBack) {
    /// <summary>
    /// Cria um modal com o container passado, e exibe em seguida, porém se o conteúdo for grande pode ser um tanto lento, neste caso o ideal seria preparar o modal primeiro com createDialogForm e exibi-lo somente quando for exigido, com showDialogForm
    /// </summary>
    /// <param name="containerId" type="String">Id da div que será usada como formulário modal </param>
    /// <param name="title" type="String">Título do modal</param>
    /// <param name="height" type="String">Altura da janela modal, em pixels</param>
    /// <param name="width" type="String">Largura da janela modal, em pixels</param>
    /// <param name="callBack" type="function">Função javascript a ser chamada quando o modal for fechado</param>
    var opt = {
        autoOpen: false,
        height: height,
        width: width,
        modal: true,
        closeOnEscape: false,
        hide: 500,
        closeText: "Fechar",
        title: title,
        buttons: {
            "Fechar": function () {
                $(this).dialog("close");
            }
        },
        close: function () {
            if (callBack != null && callBack != undefined) callBack.call();
            $("#" + containerId).dialog("close");
        }
    }
    createDialogForm(containerId, opt);
    showDialogForm(containerId, opt);
}

function closeDialogForm(containerId) {
    /// <summary>
    /// Fecha um modal em exibição pelo seu id, se não houver nenhum ou não for encontrado nada acontecerá
    /// </summary>
    /// <param name="containerId" type="String">Id da div usada na abertura da modal</param>
    $("#" + containerId).dialog("close");
}

function checkChangesOnClose(modal, callBackOnClose) {
    /// <summary>
    /// Função privada que verifica se houve alteração de dados em uma modal e apresenta uma confirmação ao usuário. Não usar diretamente.
    /// </summary>
    /// <param name="containerId" type="String">Id da div que será usada como modal</param>
    var onConfirm = function () {
        fecharModal();
        $(modal).dialog("close");
        if (callBackOnClose != null && callBackOnClose != undefined) callBackOnClose.call();
        fecharModalAguarde();
    }

    if ($(".checkChanges", modal).data('changed')) {
        return modalSimNao("Confirmação", "Deseja sair sem salvar as alterações realizadas?", onConfirm, null);
    }
    else {
        $(modal).dialog("close");
        if (callBackOnClose != null && callBackOnClose != undefined) callBackOnClose.call();
        fecharModalAguarde();

    }
}

function enableCheckChangesOnClose(containerId) {
    /// <summary>
    /// Função privada que habilita o conteúdo de uma modal para verificar se houve alterações de dados ao fechar, não usar diretamente.
    /// </summary>
    /// <param name="containerId" type="String">Id da div que será usada como modal</param>
    $(".checkChanges :input").change(function () {
        $(this).closest('.checkChanges').data('changed', true);
    });
}

function clearCheckChangesOnClose(containerId, callBackOnAction) {
    /// <summary>
    /// Função privada que define o formulário como não alterado após o o botão de ação da modal ser executado. Não use diretamente
    /// </summary>
    /// <param name="containerId" type="String">Id da div que será usada como modal</param>
    $(".checkChanges", "#" + containerId).data('changed', false);
    if (callBackOnAction != undefined && callBackOnAction != null)
        callBackOnAction.call();
}



function showUrlInDialog(urlAction, data, containerId, title, height, width, actionButtonLabel, callBackOnAction, callBackOnClose) {
    /// <summary>
    /// Carrega uma url (PartialView) e exibe o conteúdo como modal, apresenta a modal de aguarde enquanto carrega.
    /// </summary>
    /// <param name="urlAction" type="String">Url do controller/action que retorna a partial view</param>
    /// <param name="data" type="String">Dados serializados a serem enviados na requisição</param>
    /// <param name="containerId" type="String">Id da div que será usada como modal </param>
    /// <param name="title" type="String">Título do modal</param>
    /// <param name="height" type="String">Altura da janela modal, em pixels</param>
    /// <param name="width" type="String">Largura da janela modal, em pixels</param>
    /// <param name="actionButtonLabel" type="String">Label do botão de ação (pode ser Salvar, Incluir, Confirmar, Associar, etc), se nada for informado o botão não existirá</param>
    /// <param name="callBackOnAction" type="function">Função javascript a ser chamada quando o botão de ação for clicado, se nada for informado o botão apenas fechará o modal</param>
    /// <param name="callBackOnClose" type="function">Função javascript a ser chamada quando o modal for fechado, útil para atualizar alguma lista na página que chamou o modal</param>
    //modalAguarde("Aguarde...");
    var buttons = new Array();
    var i = 0;

    //Se foi definido adiciona o botão Action
    if (actionButtonLabel != null) {
        var onAction;
        if (callBackOnAction != null)
            onAction = function () {
                clearCheckChangesOnClose(containerId, callBackOnAction);
            };
        else
            onAction = function () {
                checkChangesOnClose(this, null);
            };

        buttons[i++] = { text: actionButtonLabel, click: onAction };
    }

    //Adiciona o botão fechar 
    buttons[i] = {
        text: "Fechar",
        click: function () {
            checkChangesOnClose(this, callBackOnClose);
        }
    };
    var opt = {
        autoOpen: false,
        dialogClass: "no-close",
        height: height,
        width: width,
        modal: true,
        closeText: "Fechar",
        title: title,
        closeOnEscape: false,
        hide: 500,
        buttons: buttons
    };
    $("#" + containerId).dialog(opt);

    var onSuccess = function (data) {
        $("#" + containerId).html(data);
        loadClassRules("#" + containerId);
        enableCheckChangesOnClose(containerId);
        showDialogForm(containerId, opt);
    }
    sendAjaxGet(urlAction, data, null, onSuccess);

    //só pra não rolar a pagina
    return false;
}

function showUrlInContainer(urlAction, data, containerId, loaderControl) {
    /// <summary>
    /// Carrega uma url (PartialView) e exibe o conteúdo no container informado
    /// </summary>
    /// <param name="urlAction" type="String">Url do controller/action que retorna a partial view</param>
    /// <param name="data" type="String">Dados serializados a serem enviados na requisição</param>
    /// <param name="containerId" type="String">Id do container, onde o conteúdo todo deverá ser renderizado</param>
    /// <param name="loaderControl" type="Controle DOM">Opcional, controle que exibirá o loader enquanto a requisição estiver em processo, se não informado a modal de aguarde será exibida</param>

    $.ajax({
        url: urlAction,
        data: data,
        type: "GET",
        beforeSend: function () {
            if (loaderControl != null && loaderControl != undefined) {
                $(loaderControl).show();
            }
            else {
                modalAguarde("Aguarde...");
            }
        },
        complete: function () {
            if (loaderControl != null && loaderControl != undefined) {
                $(loaderControl).hide();
            }
            else {
                fecharModalAguarde();
                $('body').removeClass('modal-open');
                $('.modal-backdrop').remove();
            }
        },
        error: function (request, status, error) {
            modalErro("Erro", request.responseText);
        },
        success: function (data) {
            $("#" + containerId).html(data);
            enableCheckChangesOnClose(containerId);
            $("#" + containerId).show();
        }
    });

    //só pra não rolar a pagina
    return false;
}

function submitAjaxForm(containerId, loaderControl, callBackOnSuccess) {
    /// <summary>
    /// Verifica se um formulário é válido antes de enviá-lo, e apresenta os erros de validação do servidor (se houver) ou o conteúdo retornado.
    /// O atributo action e method do formulário serão usados para definir o Controller/Action a ser chamado, o conteúdo do form será enviado de forma serializada
    /// PRA FUNCIONAR O CONTROLLER PRECISA RETORNAR O MÉTODO PartialViewBaseInfoValidated
    /// </summary>
    /// <param name="containerId" type="String">Id do form ou de um container onde o formulário deve estar inserido, o conteúdo retornado pela urlAction será inserido neste container</param>
    /// <param name="loaderControl" type="Controle DOM">Opcional, controle que exibirá o loader enquanto a requisição estiver em processo, se não informado a modal de aguarde será exibida</param>
    /// <param name="callBackOnSuccess" type="function">Função javascript a ser chamada se o retorno do ActionResult for OK</param>
    var $form = findForm(containerId);
    if ($form == null || $form == undefined) {
        modalErro("Envio de Formulário", "Nenhum formulário foi encontrado para envio");
        return;
    }

    $.validator.unobtrusive.parse("#" + containerId);

    if ($form.valid()) {

        $.ajax({
            url: $form.attr('action'),
            data: $form.serialize(),
            type: $form.attr("method"),
            beforeSend: function () {
                if (loaderControl != null && loaderControl != undefined) {
                    $(loaderControl).show();
                }
                else {
                    modalAguarde("Aguarde...");
                }
            },
            complete: function () {
                if (loaderControl != null && loaderControl != undefined) {
                    $(loaderControl).hide();
                }
                else {
                    fecharModalAguarde();
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                }
            },
            error: function (request, status, error) {
                modalErro("Erro", request.responseText);
            },
            success: function (data) {
                $("#" + containerId).html(data[1]);
                if (data[0] == true) {
                    if (callBackOnSuccess != null && callBackOnSuccess != undefined)
                        callBackOnSuccess.call(data);
                }
                else {
                    $.validator.unobtrusive.parse("#" + containerId);
                }
            }
        });
    }

    //só pra não rolar a pagina
    return false;
}


function submitFormWithRedirect(containerId, loaderControl, urlAction) {
    /// <summary>
    /// Verifica se um formulário é válido antes de enviá-lo, e apresenta os erros de validação do servidor (se houver). Se ok redireciona para a URL informada
    /// Os atributos action e method do formulário serão usados para definir o Controller/Action a ser chamado
    /// PRA FUNCIONAR O CONTROLLER PRECISA RETORNAR O MÉTODO BaseInfoToJson
    /// </summary>
    /// <param name="containerId" type="String">Id do form ou de um container onde o formulário deve estar inserido, o conteúdo retornado pela urlAction será inserido neste container</param>
    /// <param name="loaderControl" type="Controle DOM">Opcional, controle que exibirá o loader enquanto a requisição estiver em processo, se não informado a modal de aguarde será exibida</param>
    /// <param name="urlAction" type="String">Url que será chamada na tela inteira, passando o retorno como dados serializados</param>
    var $form = findForm(containerId);
    if ($form == null || $form == undefined) {
        modalErro("Envio de Formulário", "Nenhum formulário foi encontrado para envio");
        return;
    }

    $.validator.unobtrusive.parse("#" + containerId);

    if ($form.valid()) {

        $.ajax({
            url: $form.attr('action'),
            data: $form.serialize(),
            type: $form.attr("method"),
            beforeSend: function () {
                if (loaderControl != null && loaderControl != undefined) {
                    $(loaderControl).show();
                }
                else {
                    modalAguarde("Aguarde...");
                }
            },
            complete: function () {
                if (loaderControl != null && loaderControl != undefined) {
                    $(loaderControl).hide();
                }
                else {
                    fecharModalAguarde();
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                }
            },
            error: function (request, status, error) {
                modalErro("Erro", request.responseText);
            },
            success: function (data) {
                if (data[0] == true) {
                    window.location = urlAction + "?" + $.param(data[1]);
                }
                else {
                    $("#" + containerId).html(data[1]);
                    $.validator.unobtrusive.parse("#" + containerId);
                }
            }
        });
    }

    //só pra não rolar a pagina
    return false;
}

function findForm(containerId) {
    /// <summary>
    /// Método que encontra um formulário no container informado (incluindo ele próprio). Retorna null se nenhuma TAG <form> existir
    /// </summary>
    /// <param name="containerId" type="String">Id do form ou de um container onde o formulário deve estar inserido</param>
    var $form = null;
    var $container = $("#" + containerId);
    if ($container.is("form"))
        $form = $container;
    else
        $form = $container.find("form");

    return $form;
}

/* Função que exibe uma mensagem temporária de erro ao usuário, que some ao ser clicada.
   selector - seletor css para um ou mais containers (div, span, etc) que serão exibidos. Se não possuírem a classe boxMessage será adicionada a todos eles. 
   text - mensagem a ser exibida */
function showErrorMessageOn(selector, text) {
    showMessage(selector, "alert-danger", text);
}
/* Função que exibe uma mensagem temporária de warning ao usuário, que some ao ser clicada.
   selector - seletor css para um ou mais containers (div, span, etc) que serão exibidos. Se não possuírem a classe boxMessage será adicionada a todos eles. 
   text - mensagem a ser exibida */
function showWarningMessageOn(selector, text) {
    showMessage(selector, "alert-warning", text);
}
/* Função que exibe uma mensagem temporária de sucesso ao usuário, que some ao ser clicada.
   selector - seletor css para um ou mais containers (div, span, etc) que serão exibidos. Se não possuírem a classe boxMessage será adicionada a todos eles. 
   text - mensagem a ser exibida */
function showSuccessMessageOn(selector, text) {
    showMessage(selector, "alert-success", text);
}
/* Função que exibe uma mensagem temporária comum ao usuário, que some ao ser clicada.
   selector - seletor css para um ou mais containers (div, span, etc) que serão exibidos. Se não possuírem a classe boxMessage será adicionada a todos eles. 
   text - mensagem a ser exibida */
function showMessageOn(selector, text) {
    showMessage(selector, "ajax", text);
}

/* Função que exibe uma mensagem temporária de erro ao usuário, que some ao ser clicada. É necessário ter um container com a classe boxMessage para funcionar
   text - mensagem a ser exibida */
function showErrorMessage(text) {
    showMessage(".boxMessage", "alert-danger", text);
}
/* Função que exibe uma mensagem temporária de warning ao usuário, que some ao ser clicada. É necessário ter um container com a classe boxMessage para funcionar
   text - mensagem a ser exibida */
function showWarningMessage(text) {
    showMessage(".boxMessage", "alert-warning", text);
}
/* Função que exibe uma mensagem temporária de sucesso ao usuário, que some ao ser clicada. É necessário ter um container com a classe boxMessage para funcionar
   text - mensagem a ser exibida */
function showSuccessMessage(text) {
    showMessage(".boxMessage", "alert-success", text);
}
/* Função que exibe uma mensagem temporária comum ao usuário, que some ao ser clicada. É necessário ter um container com a classe boxMessage para funcionar
   text - mensagem a ser exibida */
function showMessage(text) {
    showMessage(".boxMessage", "ajax", text);
}

/* Função que realmente cria a mensagem na tela, não deve ser chamada diretamente */
function showMessage(selector, messageType, text) {
    var $boxMessage = $(selector);

    $boxMessage.each(function () {

        if (!$(this).hasClass("boxMessage"))
            $(this).addClass("boxMessage");

        if ($(this).css("display") != "none")
            return false;
        if (!$(this).hasClass("alert")) {
            $(this).addClass("alert");
        }
        // Botão de fechar
        var $html = $("<button type='button' class='close-alert' data-dismiss='alert' aria-hidden='true'>&times;</button><p>" + text + "</p>");
        $(this).prepend();
        $(this).removeClass("alert-warning").removeClass("alert-danger").removeClass("alert-success").removeClass("ajax").hide();
        $(this).addClass(messageType).addClass("cursorPointer");

        $(this).append($html);
        $(this).show();
        $(this).click(function () {
            $(this).dequeue();
            $(this).hide();
            cancelEvent(event);
        });

    });
}

/* Função que aplica a validação padrão de formulários do Atena */
function validateForm(formId) {
    $.validator.unobtrusive.parse("#" + formId);
}

/* Função que troca todas as ocorrências de uma string por outra, na sentença informada */
function replaceAll(string, token, newtoken) {
    while (string.indexOf(token) != -1) {
        string = string.replace(token, newtoken);
    }
    return string;
}


/* Funcao que permite somente numeros inteiros no controle. Usar no atributo onkeyup=inteiro(this) */
function inteiro(campo) {
    for (i = 0; i < campo.value.length; i++) {
        campo.value = campo.value.replace(/[^0-9]/, "");
    }
}

/*Função que verifica se uma data é válida ou nao, tanto no formato quanto se existe no calendário */
function validarData(data) {
    try {
        var result = $.datepicker.parseDate('dd/mm/yy', data);
        return true;
    }
    catch (e) {
        return false;
    }
}


/*Funcao que compara as datas, passe a que deveria ser maior e a menor e informe se podem ser iguais, a fun??o retorna true se os valores estiverem de acordo  
    Passe no formato dd/MM/yyyy */
function compararDatas(dataMaior, dataMenor, permiteIgual) {

    if (dataMaior == '' || dataMenor == '') {
        return false;
    }

    if (!validarData(dataMaior)) return false;
    if (!validarData(dataMenor)) return false;

    //Se permite igual nao foi informado recebe true por padrao
    if (permiteIgual == null) permiteIgual = true;

    var nova_data1 = parseInt(dataMaior.split("/")[2].toString() + dataMaior.split("/")[1].toString() + dataMaior.split("/")[0].toString());
    var nova_data2 = parseInt(dataMenor.split("/")[2].toString() + dataMenor.split("/")[1].toString() + dataMenor.split("/")[0].toString());

    if (permiteIgual) {
        return (nova_data1 >= nova_data2);
    }
    else {
        return (nova_data1 > nova_data2);
    }

}
/*Funcao que escreve o contaúdo do modal no DOM, não chamar diretamente */
function montaHtmlModal(mensagem, title, tipo, botoes) {
    var image = "";
    var cssClass = "";
    var btnClass = "";
    var button;
    //Primeiramente remove a div, se ela já existir
    $("#divModal").remove();
    // Inicializa os tipos
    if (tipo != MensagemEnum.NENHUM) {
        //html += "<td class=\"iconeModal\">";
        if (tipo == MensagemEnum.INFO) {
            //image = "<span class='glyphicon glyphicon-info-sign'></span>";
            image = "<img src='" + imagesPath + "/modal/Confirmacao_48x48.png' />";
            cssClass = "bg-success";
            btnClass = "btn-success";
        }
        else if (tipo == MensagemEnum.ERRO) {
            //image = "<span class='glyphicon glyphicon-minus-sign'></span>";
            image = "<img src='" + imagesPath + "/modal/Erro_48x48.png' />";
            cssClass = "bg-danger";
            btnClass = "btn-danger";
        }

        else if (tipo == MensagemEnum.ALERTA) {
            //image = "<span class='glyphicon glyphicon-exclamation-sign'></span>";
            image = "<img src='" + imagesPath + "/modal/Alerta_48x48.png' />";
            cssClass = "bg-warning";
            btnClass = "btn-warning";
        }

        else if (tipo == MensagemEnum.OK) {
            image = "<img src='" + imagesPath + "/modal/Confirmacao_48x48.png' />";
            //image = "<span class='glyphicon glyphicon-ok-sign'></span>";
            cssClass = "bg-success";
            btnClass = "btn-success";
        }

        else if (tipo == MensagemEnum.QUESTAO) {
            image = "<img src='" + imagesPath + "/modal/Questao.png' />";
            cssClass = "bg-primary";
            btnClass = "btn-primary";
        }
    }

    html = new String();
    html += "<div class='modal fade' id='divModal'>";
    html += "<div class='modal-dialog'>";
    html += "<div class='modal-content'>";
    html += "<div class='modal-header " + cssClass + "'>";
    html += "<h4 class='modal-title'>" + title + "</h4></div>"; // Titulo
    html += "<div class='modal-body'><p>";
    html += image;
    html += mensagem + "</p></div>"; // Mensagem
    html += "<div class='modal-footer'> ";
    html += "</div></div></div></div>";
    $modal = $(html);

    // Gera os botões com actions
    $.each(botoes, function (key, value) {
        $button = $("<button type='button' class='btn'></button>");
        if (key.toString().toUpperCase() == "NÃO" || key.toString().toUpperCase() == "FECHAR") {
            $button.addClass("btn-default");
            $button.prop("data-dismiss", "modal");
            $button.append(key);
        }
        else {
            $button.addClass(btnClass);
            $button.append(key);
        }
        // callback
        var callback;
        if (value == null || typeof value != "function" || value == undefined) {
            callback = function () { fecharModal() };
        }
        $button.on("click", function (e) {
            value.call();
        });
        $modal.find(".modal-footer").append($button);
    });


    return $modal;

}

///*Funcao que escreve o contaúdo do modal no DOM, não chamar diretamente */
//function montaHtmlModal(mensagem, tipo) {
//    //Primeiramente remove a div, se ela já existir

//    $("#divModal").remove();
//    html = new String();
//    html += "<div id='divModal'>";
//    html += "<table class='tableModal' id='tabelaPrincipal' width='100%'>";
//    html += "<tbody>";
//    html += "<tr>";

//    if (tipo != MensagemEnum.NENHUM) {
//        html += "<td class=\"iconeModal\">";
//        if (tipo == MensagemEnum.INFO) {
//            html += "<img src='" + imagesPath + "/modal/Info.png' />";
//        }
//        else if (tipo == MensagemEnum.ERRO) {
//            html += "<img src='" + imagesPath + "/modal/Erro.png' />";
//        }

//        else if (tipo == MensagemEnum.ALERTA) {
//            html += "<img src='" + imagesPath + "/modal/Alerta.png' />";
//        }

//        else if (tipo == MensagemEnum.OK) {
//            html += "<img src='" + imagesPath + "/modal/Confirmacao.png' />";
//        }

//        else if (tipo == MensagemEnum.QUESTAO) {
//            html += "<img src='" + imagesPath + "/modal/Questao.png' />";
//        }
//        html += "</td>";
//    }

//    html += "<td class=\"textoModal\">" + mensagem + "</td>";
//    html += "</tr>";

//    html += "</tbody>";
//    html += "</table>";

//    html += '</div>';
//    return html;

//}

/*Funcao que monta a janela modal de aguarde, deve ser usada em todo submit ou chamada ajax, para evitar duplo envio */
function modalAguarde(mensagem) {
    //Se o projeto não utiliza o aguarde então não exibe
    if (typeof showAguarde == 'undefined') return false; // Any scope
    if (window['showAguarde'] == undefined) return false;// Global scope
    if (window['showAguarde'] == void 0) return false;// Old browsers
    if (showAguarde == false) return false; //

    var html;
    if (mensagem == null) mensagem = "Aguarde...";

    try {

        //Primeiramente remove a div, se ela já existir
        $("#divAguarde").remove();
        html = new String();
        html += "<div class='modal fade' id='divAguarde' tabindex='-1' role='dialog' aria-labelledby='divAguardeLabel' aria-hidden='true'>";
        html += "<div class='modal-dialog'><div class='modal-content'><div class='modal-header bg-primary'>";
        html += "<h4 class='modal-title' id='divAguardeLabel'>Aguarde</h3>";
        html += "</div>";
        html += "<div class='modal-body'>";
        html += "<img src='" + imagesPath + "/ajaxLoading.gif' alt='Aguarde' /> " + mensagem;
        html += "</div></div></div>";
        html += '</div>';

        $('body').append(html);
        try { $("#divAguarde").modal("hide"); } catch (e) { }
        $("#divAguarde").modal({
            keyboard: false
        });
        return true;

    } catch (e) {
        alert(e.description);
    }
}
function modalMensagem(titulo, mensagem, tipo, botoes, width, height) {
    mensagem = replaceAll(mensagem, "&gt;", ">");
    mensagem = replaceAll(mensagem, "&lt;", "<");
    if (typeof width == 'undefined' || width == "undefined" || width == null || width == "")
        width = "auto";

    if (typeof height == 'undefined' || height == "undefined" || height == null || height == "")
        height = "auto";

    try {
        $('body').append(montaHtmlModal(mensagem, titulo, tipo, botoes));

        //exclui a modal (se existir)
        try {
            $("#divModal").modal("hide");
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        } catch (e) { }
        $('#divModal').modal('show');

        //$("#divModal").dialog({
        //    dialogClass: "no-close",
        //    resizable: false,
        //    width: width,
        //    height: height,
        //    closeOnEscape: false,
        //    hide: 500,
        //    autoOpen: false,
        //    modal: true,
        //    title: titulo,
        //    buttons: botoes
        //});

        //$("#divModal").dialog('open');
        //$(".ui-dialog-buttonpane").find('button').addClass('botaoModal');

        //retorna false só pra não rolar a tela
        return false;

    } catch (e) {
        alert(e);
    }
}

///*Funcao que monta a janela modal, não deve ser chamada diretamente */
//function modalMensagem(titulo, mensagem, tipo, botoes, width, height) {
//    //Permite exibição de HTML
//    mensagem = replaceAll(mensagem, "&gt;", ">");
//    mensagem = replaceAll(mensagem, "&lt;", "<");

//    if (typeof width == 'undefined' || width == "undefined" || width == null || width == "")
//        width = "auto";

//    if (typeof height == 'undefined' || height == "undefined" || height == null || height == "")
//        height = "auto";

//    try {
//        $('body').append(montaHtmlModal(mensagem, tipo));

//        //exclui a modal (se existir)
//        try { $("#divModal").dialog("destroy"); } catch (e) { }

//        $("#divModal").dialog({
//            dialogClass: "no-close",
//            resizable: false,
//            width: width,
//            height: height,
//            closeOnEscape: false,
//            hide: 500,
//            autoOpen: false,
//            modal: true,
//            title: titulo,
//            buttons: botoes
//        });

//        $("#divModal").dialog('open');
//        //$(".ui-dialog-buttonpane").find('button').addClass('botaoModal');

//        //retorna false só pra não rolar a tela
//        return false;

//    } catch (e) {
//        alert(e);
//    }
//}


/* Função que exibe um modal com o ícone de sucesso e botão OK
   titulo    - Título do modal
   mensagem  - Texto de conteúdo do modal */
function modalSucesso(titulo, mensagem) {
    var botoes = { 'OK': fecharModal };
    return modalMensagem(titulo, mensagem, MensagemEnum.OK, botoes);
}
/* Função que exibe um modal com o ícone de alerta e botão OK
   titulo    - Título do modal
   mensagem  - Texto de conteúdo do modal */
function modalAlerta(titulo, mensagem) {
    var botoes = { 'OK': fecharModal };
    return modalMensagem(titulo, mensagem, MensagemEnum.ALERTA, botoes);
}
/* Função que exibe um modal com o ícone de informação e botão OK
   titulo    - Título do modal
   mensagem  - Texto de conteúdo do modal */
function modalInfo(titulo, mensagem) {
    var botoes = { 'OK': fecharModal };
    return modalMensagem(titulo, mensagem, MensagemEnum.INFO, botoes);
}
/* Função que exibe um modal com o ícone de erro e botão OK
   titulo    - Título do modal
   mensagem  - Texto de conteúdo do modal */
function modalErro(titulo, mensagem) {
    var botoes = { 'OK': fecharModal };
    return modalMensagem(titulo, mensagem, MensagemEnum.ERRO, botoes);
}

function modalTexto(titulo, mensagem, width, height) {
    /// <summary>Exibe Modal com texto (Não possui botão OK)</summary>
    /// <param name="titulo" type="Object">Título da Modal</param>
    /// <param name="mensagem" type="Object">Texto do corpo da Modal</param>
    /// <param name="width" type="Object">Largura (Se não passar será default 'auto')</param>
    /// <param name="height" type="Object">Altura (Se não passar será default 'auto')</param>

    return modalMensagem(titulo, mensagem, MensagemEnum.NENHUM, null, width, height);
}

/* Função que exibe um modal com os botões Sim e Não 
   titulo    - Título do modal
   mensagem  - Texto de conteúdo do modal
   funcaoSim - funcao javascript a ser chamada se clicado em Sim (se nulo fechará o modal)
   funcaoNao - funcao javascript a ser chamada se clicado em Nao (se nulo fechará o modal) */
function modalSimNao(titulo, mensagem, funcaoSim, funcaoNao) {
    if (funcaoSim == null) funcaoSim = fecharModal;
    if (funcaoNao == null) funcaoNao = fecharModal;

    var botoes = { 'Sim': funcaoSim, 'N\u00e3o': funcaoNao };
    return modalMensagem(titulo, mensagem, MensagemEnum.QUESTAO, botoes);
}

/* Função que exibe um modal com os botões Sim, Não e Cancelar 
   titulo    - Título do modal
   mensagem  - Texto de conteúdo do modal
   funcaoSim - funcao javascript a ser chamada se clicado em Sim (se nulo fechará o modal)
   funcaoNao - funcao javascript a ser chamada se clicado em Nao (se nulo fechará o modal)*/
function modalSimNaoCancelar(titulo, mensagem, funcaoSim, funcaoNao) {
    if (funcaoSim == null) funcaoSim = fecharModal;
    if (funcaoNao == null) funcaoNao = fecharModal;

    var botoes = { 'Sim': funcaoSim, 'N\u00e3o': funcaoNao, 'Cancelar': fecharModal };
    return modalMensagem(titulo, mensagem, MensagemEnum.QUESTAO, botoes);
}

/*Função que fecha o modal aberto pelos comandos de modais*/
function fecharModal() {
    $("#divModal").modal('hide');
}
/*Função que fecha o modal de aguarde*/
function fecharModalAguarde() {
    $("#divAguarde").modal('hide');
}

/*Funcao que verifica se o arquivo anexado eh valido de acordo com um array de extensoes permitidas */
function validarAnexo(idInputFile, arrExtensoes) {
    // aqui voce coloca as extenssoes que quer procurar
    //exts = [ 'xls' , 'xlsx'];

    var exts = arrExtensoes;
    var $file = $('#' + idInputFile);
    var fOk = false;

    //Verifica se tem algo preenchido
    if ($file.val() == "") return false;

    //Valida as extens?es permitidas
    for (i = 0; i < exts.length; i++) {
        if ($file.val().toLowerCase().lastIndexOf('.' + exts[i]) != -1) fOk = true;
    }

    if (!fOk) {
        $file.focus();
        return false;
    }
    else {
        return true;
    }
}

/*Retorna valor de uma variavel Cookie*/
//Ex.: var username = getCookie("username");
function getCookie(c_name) {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1) {
        c_value = null;
    }
    else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
}

/*Seta valor para Cookie*/
//Ex.: setCookie("username", username, 365);
function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function eraseCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


//Funcao que verifica os campos obrigatórios na grid
function validateFormFields(containerId) {
    /// <summary>
    /// Valida os campos dentro de um container qualquer, não precise ser necessáriamente um formulário, quanto aos tipos de dados informados, e adiciona um span na frente de cada um que estiver inválido.
    /// Este script usa as classes css para fazer a verificação. Classes validadas: required, integer, number (implementar), calendar (implementar), email (implementar), cpf (implementar), cnpj (implementar)
    /// </summary>
    /// <param name="containerId" type="String">Id do form ou de um container onde os campos a serem validados estão inseridos</param>

    var $form = $("#" + containerId);
    var invalido = false;
    //Primeiramente remove a classe adicionada anteriormente
    $("span.validationError", $form).remove();
    $(".input-validation-error", $form).removeClass("input-validation-error");

    //Valida os dados de campos requeridos
    $(".required", $form).each(function (i) {
        var naoPreenchido = true;

        if ($(this).attr('type') == 'radio') {
            var valor = $('input[name=' + this.name + ']:checked').val();
            naoPreenchido = (valor == undefined);
        }
        else {
            naoPreenchido = ($(this).val() == '' || $(this).val() == null);
        }

        if (naoPreenchido) {
            //Adiciona a classe com borda vermelha e o evento pra remover quando for digitado
            showValidationMessageErrorForField(this, "Campo requerido");
            invalido = true;
        }
    });

    //Valida os campos do tipo inteiro
    $(".integer:not(.input-validation-error), .zeroInteger:not(.input-validation-error)", $form).each(function (i) {
        var error = !isInteger($(this).val());

        //valida se permite zero
        if (!error && !$(this).hasClass("zeroInteger"))
            error = (parseInt($(this).val()) == 0);

        if (error) {
            //Adiciona a classe com borda vermelha e o evento pra remover quando for digitado
            showValidationMessageErrorForField(this, "Número inválido");
            invalido = true;
        }
    });

    $("input[minlength]").each(function (index) {
        if ($(this).val().length < $(this).attr("minlength")) {
            showValidationMessageErrorForField(this, "Mínimo de " + $(this).attr("minlength") + " caracteres");
            invalido = true;
        }
    });
    if (invalido)
        return false;

    return true;
}

function showValidationMessageErrorForField(field, message) {
    //var $span = $("<span class=\"validationError\">" + message + "</span>");
    var $errorInput = $(field).parent().parent().find(".label-danger");
    if ($errorInput.length > 0) $errorInput.remove();
    var $span = $("<span class='label label-danger'>" + message + "</span>");
    //$span.delay(10000).fadeOut(2000, function () { $(this).remove() });
    console.log($(field).parent());
    $span.insertAfter($(field).parent());
    $span.click(function () { $(this).remove() });
    //$(field).addClass('input-validation-error');
    $(field).parent().parent().addClass("has-error").addClass("has-feedback");

    $(field).change(function () {
        $(field).parent().parent().removeClass("has-error").removeClass("has-feedback");
        $span.remove();
    });
}


function saveAjaxHistory(stateObject) {
    /// <summary>
    /// Função usada pela searchbar e grid para salvar uma pesquisa AJAX no histórico do browser para quando o usuário usar o botão Voltar do navegador ela poder ser restaurada
    /// </summary>
    /// <param name="stateObject" type="object">Um objeto serializado contendo todas as informações que permitam restaurar o estado da pesquisa. Precisa ter, ao menos, dois atributos: title e url</param>

    // Save state on history stack
    // - First argument is any object that will let you restore state
    // - Second argument is a title (not the page title, and not currently used)
    // - Third argument is the URL - this will appear in the browser address bar
    if (history.pushState) {
        history.pushState(stateObject, stateObject.title, "");
    }
}

/*
 *
 * Copyright (c) 2006-2011 Sam Collett (http://www.texotela.co.uk)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * 
 * Version 1.3
 * Demo: http://www.texotela.co.uk/code/jquery/numeric/
 *
 */
(function ($) {
    /*
     * Allows only valid characters to be entered into input boxes.
     * Note: fixes value when pasting via Ctrl+V, but not when using the mouse to paste
      *      side-effect: Ctrl+A does not work, though you can still use the mouse to select (or double-click to select all)
     *
     * @name     numeric
     * @param    config      { decimal : "." , negative : true }
     * @param    callback     A function that runs if the number is not valid (fires onblur)
     * @author   Sam Collett (http://www.texotela.co.uk)
     * @example  $(".numeric").numeric();
     * @example  $(".numeric").numeric(","); // use , as separater
     * @example  $(".numeric").numeric({ decimal : "," }); // use , as separator
     * @example  $(".numeric").numeric({ negative : false }); // do not allow negative values
     * @example  $(".numeric").numeric(null, callback); // use default values, pass on the 'callback' function
     *
     */
    $.fn.numeric = function (config, callback) {
        if (typeof config === 'boolean') {
            config = { decimal: config };
        }
        config = config || {};
        // if config.negative undefined, set to true (default is to allow negative numbers)
        if (typeof config.negative == "undefined") config.negative = true;
        // set decimal point
        var decimal = (config.decimal === false) ? "" : config.decimal || ".";
        // allow negatives
        var negative = (config.negative === true) ? true : false;
        // callback function
        var callback = typeof callback == "function" ? callback : function () { };
        // set data and methods
        return this.data("numeric.decimal", decimal).data("numeric.negative", negative).data("numeric.callback", callback).keypress($.fn.numeric.keypress).keyup($.fn.numeric.keyup).blur($.fn.numeric.blur);
    }

    $.fn.numeric.keypress = function (e) {
        // get decimal character and determine if negatives are allowed
        var decimal = $.data(this, "numeric.decimal");
        var negative = $.data(this, "numeric.negative");
        // get the key that was pressed
        var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
        // allow enter/return key (only when in an input box)
        if (key == 13 && this.nodeName.toLowerCase() == "input") {
            return true;
        }
        else if (key == 13) {
            return false;
        }
        var allow = false;
        // allow Ctrl+A
        if ((e.ctrlKey && key == 97 /* firefox */) || (e.ctrlKey && key == 65) /* opera */) return true;
        // allow Ctrl+X (cut)
        if ((e.ctrlKey && key == 120 /* firefox */) || (e.ctrlKey && key == 88) /* opera */) return true;
        // allow Ctrl+C (copy)
        if ((e.ctrlKey && key == 99 /* firefox */) || (e.ctrlKey && key == 67) /* opera */) return true;
        // allow Ctrl+Z (undo)
        if ((e.ctrlKey && key == 122 /* firefox */) || (e.ctrlKey && key == 90) /* opera */) return true;
        // allow or deny Ctrl+V (paste), Shift+Ins
        if ((e.ctrlKey && key == 118 /* firefox */) || (e.ctrlKey && key == 86) /* opera */
        || (e.shiftKey && key == 45)) return true;
        // if a number was not pressed
        if (key < 48 || key > 57) {
            /* '-' only allowed at start and if negative numbers allowed */
            if (this.value.indexOf("-") != 0 && negative && key == 45 && (this.value.length == 0 || ($.fn.getSelectionStart(this)) == 0)) return true;
            /* only one decimal separator allowed */
            if (decimal && key == decimal.charCodeAt(0) && this.value.indexOf(decimal) != -1) {
                allow = false;
            }
            // check for other keys that have special purposes
            if (
                key != 8 /* backspace */ &&
                key != 9 /* tab */ &&
                key != 13 /* enter */ &&
                key != 35 /* end */ &&
                key != 36 /* home */ &&
                key != 37 /* left */ &&
                key != 39 /* right */ &&
                key != 46 /* del */
            ) {
                allow = false;
            }
            else {
                // for detecting special keys (listed above)
                // IE does not support 'charCode' and ignores them in keypress anyway
                if (typeof e.charCode != "undefined") {
                    // special keys have 'keyCode' and 'which' the same (e.g. backspace)
                    if (e.keyCode == e.which && e.which != 0) {
                        allow = true;
                        // . and delete share the same code, don't allow . (will be set to true later if it is the decimal point)
                        if (e.which == 46) allow = false;
                    }
                        // or keyCode != 0 and 'charCode'/'which' = 0
                    else if (e.keyCode != 0 && e.charCode == 0 && e.which == 0) {
                        allow = true;
                    }
                }
            }
            // if key pressed is the decimal and it is not already in the field
            if (decimal && key == decimal.charCodeAt(0)) {
                if (this.value.indexOf(decimal) == -1) {
                    allow = true;
                }
                else {
                    allow = false;
                }
            }
        }
        else {
            allow = true;
        }
        return allow;
    }

    $.fn.numeric.keyup = function (e) {
        var val = this.value;
        if (val.length > 0) {
            // get carat (cursor) position
            var carat = $.fn.getSelectionStart(this);
            // get decimal character and determine if negatives are allowed
            var decimal = $.data(this, "numeric.decimal");
            var negative = $.data(this, "numeric.negative");

            // prepend a 0 if necessary
            if (decimal != "") {
                // find decimal point
                var dot = val.indexOf(decimal);
                // if dot at start, add 0 before
                if (dot == 0) {
                    this.value = "0" + val;
                }
                // if dot at position 1, check if there is a - symbol before it
                if (dot == 1 && val.charAt(0) == "-") {
                    this.value = "-0" + val.substring(1);
                }
                val = this.value;
            }

            // if pasted in, only allow the following characters
            var validChars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, '-', decimal];
            // get length of the value (to loop through)
            var length = val.length;
            // loop backwards (to prevent going out of bounds)
            for (var i = length - 1; i >= 0; i--) {
                var ch = val.charAt(i);
                // remove '-' if it is in the wrong place
                if (i != 0 && ch == "-") {
                    val = val.substring(0, i) + val.substring(i + 1);
                }
                    // remove character if it is at the start, a '-' and negatives aren't allowed
                else if (i == 0 && !negative && ch == "-") {
                    val = val.substring(1);
                }
                var validChar = false;
                // loop through validChars
                for (var j = 0; j < validChars.length; j++) {
                    // if it is valid, break out the loop
                    if (ch == validChars[j]) {
                        validChar = true;
                        break;
                    }
                }
                // if not a valid character, or a space, remove
                if (!validChar || ch == " ") {
                    val = val.substring(0, i) + val.substring(i + 1);
                }
            }
            // remove extra decimal characters
            var firstDecimal = val.indexOf(decimal);
            if (firstDecimal > 0) {
                for (var i = length - 1; i > firstDecimal; i--) {
                    var ch = val.charAt(i);
                    // remove decimal character
                    if (ch == decimal) {
                        val = val.substring(0, i) + val.substring(i + 1);
                    }
                }
            }
            // set the value and prevent the cursor moving to the end
            this.value = val;
            $.fn.setSelection(this, carat);
        }
    }

    $.fn.numeric.blur = function () {
        var decimal = $.data(this, "numeric.decimal");
        var callback = $.data(this, "numeric.callback");
        var val = this.value;
        if (val != "") {
            var re = new RegExp("^\\d+$|\\d*" + decimal + "\\d+");
            if (!re.exec(val)) {
                callback.apply(this);
            }
        }
    }

    $.fn.removeNumeric = function () {
        return this.data("numeric.decimal", null).data("numeric.negative", null).data("numeric.callback", null).unbind("keypress", $.fn.numeric.keypress).unbind("blur", $.fn.numeric.blur);
    }

    // Based on code from http://javascript.nwbox.com/cursor_position/ (Diego Perini <dperini@nwbox.com>)
    $.fn.getSelectionStart = function (o) {
        if (o.createTextRange) {
            var r = document.selection.createRange().duplicate();
            r.moveEnd('character', o.value.length);
            if (r.text == '') return o.value.length;
            return o.value.lastIndexOf(r.text);
        } else return o.selectionStart;
    }

    // set the selection, o is the object (input), p is the position ([start, end] or just start)
    $.fn.setSelection = function (o, p) {
        // if p is number, start and end are the same
        if (typeof p == "number") p = [p, p];
        // only set if p is an array of length 2
        if (p && p.constructor == Array && p.length == 2) {
            if (o.createTextRange) {
                var r = o.createTextRange();
                r.collapse(true);
                r.moveStart('character', p[0]);
                r.moveEnd('character', p[1]);
                r.select();
            }
            else if (o.setSelectionRange) {
                o.focus();
                o.setSelectionRange(p[0], p[1]);
            }
        }
    }

})(jQuery);
