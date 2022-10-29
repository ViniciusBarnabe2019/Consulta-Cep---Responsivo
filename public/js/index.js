const inputSearch = document.getElementById('input_search')
const iconSearch = document.getElementById('icon_search')
const spanSearch = document.getElementsByTagName('span')[0]
const modal = document.getElementsByTagName('dialog')[0]
const close = document.getElementsByTagName('button')[0]
const textoModal = document.getElementById('text_msg')
var map

inputSearch.addEventListener('focus', ()=> {
	icon_search.style.color = 'white'
	spanSearch.style.backgroundColor = '#208E92'
	spanSearch.style.borderColor = '#208E92'
	spanSearch.style.boxShadow = '0 0 0 0.1em #208E92'
})

inputSearch.addEventListener('blur', () => {
  icon_search.style.color = 'black'
  spanSearch.style.backgroundColor = '#e9ecef';
  spanSearch.style.borderColor = '#e9ecef'
  spanSearch.style.boxShadow = 'none'
})

function checaNumero(event) {
	var codigo_asc = event.which 
	
	if(codigo_asc == 13){
		pesquisar()
		return true
	}	
	else if (codigo_asc > 31 && (codigo_asc < 48 || codigo_asc > 57)) {
		return false
	} 
	else {
		return true
	}
}

function pesquisar(){
	var cep = inputSearch.value
	
	if(cep.length != 8){
		abreModal(1)
		return
	}
	
	const xhr = new XMLHttpRequest()

	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 400){
			console.log(xhr.status)
		}
	}

	xhr.open("GET", "https://viacep.com.br/ws/" + cep + "/json/", false)
	xhr.send()
	
	exibe(JSON.parse(xhr.response))
}

function exibe(objeto){
	if(objeto.erro){
		abreModal(3)
		return
	}
	document.getElementById('cep').innerText = objeto.cep == "" ? '---' : objeto.cep 
	document.getElementById('logradouro').innerText = objeto.logradouro == "" ? '---' : objeto.logradouro
	document.getElementById('complemento').innerText = objeto.complemento == "" ? '---' : objeto.complemento
	document.getElementById('bairro').innerText = objeto.bairro == "" ? '---' : objeto.bairro 
	document.getElementById('local').innerText = objeto.localidade == "" ? '---' : objeto.localidade
	document.getElementById('uf').innerText = objeto.uf == "" ? '---' : objeto.uf
	document.getElementById('ibge').innerText = objeto.ibge == "" ? '---' : objeto.ibge
	document.getElementById('gia').innerText = objeto.gia == "" ? '---' : objeto.gia
	document.getElementById('ddd').innerText = objeto.ddd == "" ? '---' : objeto.ddd 
	document.getElementById('siafi').innerText = objeto.siafi == "" ? '---' : objeto.siafi
	
	geoLocation(new google.maps.Geocoder, map, objeto.uf, objeto.localidade, objeto.logradouro)
}

function abreModal(n){
	if(n == 1){
		text_msg.innerText = 'Digite um CEP Válido...'
	}
	else if(n == 2){
		text_msg.innerText = 'Ocorreu um Erro ao Gerar o Mapa...'
	}
	else if(n == 3){
		text_msg.innerText = 'Verifique o CEP e/ou Tente Novamente Mais Tarde!'
	}
	modal.showModal()
}

close.addEventListener('click', () => {
	modal.close()
})

//Mapa
function geoLocation(geocoder, map, uf, localidade, logradouro){
	geocoder.geocode({
		address: uf + "," + localidade + "," + logradouro,
        componentRestrictions: {
            country: 'br',
        }
    }, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location)
			
            new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            })
        }
		else {
            abreModal(2)
        }
    })
}

function criaMapa() {
	var configs = {
	  center: new google.maps.LatLng(-34.397, 150.644),
	  zoom: 8
	};
	map = new google.maps.Map(document.getElementById("map"), configs);
}
//End Mapa