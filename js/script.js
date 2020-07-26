$(document).ready(function () {
	$("#tab-options a").click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});

	//Carrega Produtos
	var element = document.getElementById("div-products");
	if (element) {
		loadListProducts();
	}
	//Adicionar Cliente (Evento)
	$("#form-client").submit(function (e) {
		e.preventDefault();
		addClient();
	});
});

function addClient() {
	var json = {};

	json['name'] = $("#name").val();
	json['email'] = $("#email").val();
	json['phone'] = $("#phone").val();
	json['cep'] = $("#cep").val();
	json['address'] = $("#address").val();

	var isValid = true;
	for (key in json) {
		if (!json[key] || typeof json[key] == undefined || json[key] == null) {
			isValid = false;
		}
	}

	json['number'] = parseInt($("#number").val());

	if (!Number.isInteger(json['number'])) {
		isValid = false;
	}

	json['complement'] = $("#complement").val();

	if (!isValid) {
		alert("Falha ao processar requisição. Parâmetros Inválidos.");
	} else {
		alert("Cliente Adicionado.");
		$.ajax({
			type: "POST",
			data: JSON.stringify(json),
			dataType: "json",
			contentType: "application/json",
			url: "https://api-pizzabor.herokuapp.com/clients/",
			success: function (result) {
				alert(result.message);

				//Limpa elementos do form
				$("#form-client input").val('');

				//Carrega lista de clientes
				loadListClients();
			},
			error: function (result) {
				if (result.status == 0) {
					alert("Falha ao processar requisição. Erro na Conexão.");
				} else {
					alert(result.responseJSON.message);
				}
			}
		});
	}
}

///
/// Produtos
/// 

// Adicionar Produto
function addProduct(post_url, request_method, form_data) {
	var form_json = {};

	//Cria JSON e Valida dados de entrada.
	var flag = true;
	form_data.forEach((element) => {
		var temp_value = element.value;
		if (element.name != 'url') {
			if (!temp_value || typeof temp_value == undefined || temp_value == null) {
				flag = false;
				return;
			}
		}
		form_json[element.name] = temp_value;
	});


	if (!flag) {
		alert("Falha ao processar requisição. Parâmetros Inválidos.");
	} else {
		$.ajax({
			type: request_method,
			data: JSON.stringify(form_json),
			dataType: "json",
			contentType: "application/json",
			url: post_url,
			success: function (result) {
				alert(result.message);

				//Limpar elementos do form.
				$("#form-product input, #form-product textarea").val('');
				$("#form-product select").prop('selectedIndex', 0);

				//Carrega produtos na lista
				loadListProducts();
			},
			error: function (result) {
				switch (result.status) {
					case 0:
						alert("Falha ao processar requisição. Erro na Conexão.");
						break;
					default:
						alert(result.responseJSON.message);
						break;
				}
			}
		});
	}
}
