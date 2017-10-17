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

function addProductToCart (id, inputQty) {
	let qty = +inputQty;

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
		console.log(document.cookie);
	};

	if (getCookie("cart") !== "") {
		setProductsCookie();
	} else {
		setCookie('cart', JSON.stringify([]));
		setProductsCookie();
	}

	showCartTotalQty();
}




function addProductToCart2 (id, inputQty) {
	let qty = +inputQty;

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
		console.log(document.cookie);
	};

	if (getCookie("cart") !== "") {
		setProductsCookie();
	} else {
		setCookie('cart', JSON.stringify([]));
		setProductsCookie();
	}

	showCartTotalQty();
}







function updateCartItem (id, qty) {
	let products = JSON.parse(getCookie('cart'));
	if (products.length !== 0) {
		let indexToUpdate;
		products.forEach(function(item, index) {
			if (item.id === id) {
				indexToUpdate = index;
			}
		});
		if (qty === 'remove') {
			products.splice(indexToUpdate, 1);
			if (products.length === 0) {
				$('#fc-cart').empty();
				$('#fc-cart-empty').show();
			}
		} else {
			if (Number.isInteger(qty) && qty > 0) {
				products[indexToUpdate] = {id: id, qty: qty};
			}
		}
		indexToUpdate = undefined;
		setCookie('cart', JSON.stringify(products));
		console.log(document.cookie);
		showCartTotalQty();
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

	$('#add-to-cart-btn').click(function () {
		let id = +$(this).attr('data-item_id');
		let qty = +$('#cart-product-qty').val();

		if (Number.isInteger(qty) && qty > 0) {
			addProductToCart(id, qty);
		}
	});

	$('.fc-cart-remove').click(function () {
		let id = +$(this).attr('data-item_id');
		updateCartItem(id, 'remove');
		$(this).closest('tr').remove();
	});

	$('.fc-cart-qty').change(function () {
		let id = +$(this).attr('data-item_id');
		let qty = +$(this).val();

		if (Number.isInteger(qty) && qty > 0) {
			updateCartItem(id, qty);
		} else {
			$(this).val('1');
			updateCartItem(id, 1);
		}
	});

	console.log(document.cookie);
	showCartTotalQty();
});