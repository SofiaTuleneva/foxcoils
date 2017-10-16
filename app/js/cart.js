function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}



function addProductToCart (id, qty) {

	let setProductsCookie = function () {
		let products = JSON.parse(getCookie('cart'));
		if (products.length !== 0) {
			let isTheSameProduct = false;
			products.forEach(function(item) {
				if (item.id === id) {
					item.qty += qty;
					isTheSameProduct = true;
				}
			});
			if (!isTheSameProduct) {
				products.push({id: id, qty: qty});
			}
		} else {
			products.push({id: id, qty: qty});
		}
		setCookie('cart', JSON.stringify(products));
	};

	if (getCookie("cart") !== "") {
		setProductsCookie();
	} else {
		setCookie('cart', JSON.stringify([]));
		setProductsCookie();
	}

	showCartTotalQty();
}


function getCartProducts () {
	if (getCookie("cart") !== "") {
		return JSON.parse(getCookie('cart'));
	}
}


function getCartTotalQty () {
	if (getCookie("cart") !== "") {
		let products = JSON.parse(getCookie('cart'));
		let totalQty = 0;
		products.forEach(function(item) {
			totalQty += item.qty;
		});
		return totalQty;
	} else {
		return 0;
	}
}

function showCartTotalQty () {
	$('#cart-total-qty').html(getCartTotalQty());
}


$(document).ready(function () {
	console.log(document.cookie);
	showCartTotalQty();
});

