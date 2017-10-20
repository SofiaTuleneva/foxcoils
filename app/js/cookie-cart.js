function setCookie(cname, cvalue, exdays) {
	let d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) === 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function setCart(cvalue) {
	setCookie('cart', JSON.stringify(cvalue));
}

function getCart() {
	return JSON.parse(getCookie('cart'));
}

function removeCartItem (id) {
	let products = getCart();
	let indexToUpdate;
	products.forEach(function(item, index) {
		if (item.id === id) {
			indexToUpdate = index;
		}
	});
	products.splice(indexToUpdate, 1);
	setCart(products);
	if (products.length === 0) {
		$('#fc-cart').empty();
		$('#fc-cart-empty').show();
	}
	console.log(document.cookie);
}

function getCartTotalQty () {
	if (getCookie("cart") !== "") {
		let products = getCart();
		let totalQty = 0;
		products.forEach(function(item) {
			totalQty += item.qty;
		});
		return totalQty;
	} else {
		return 0;
	}
}

function showHeaderCartTotalQty () {
	$('#cart-total-qty').html(getCartTotalQty());
}

function addCartItem (id, product, qty, options) {
	let products = getCart();
	let existsInCart = false;
	products.forEach(function(item) {
		if (item.id === id) {
			item.qty += qty;
			existsInCart = true;
		}
	});
	if (!existsInCart) {
		products.push({
			id: id,
			product: product,
			qty: qty,
			options: options
		});
	}
	setCart(products);
	console.log(document.cookie);
}

function updateCartItem (id, qty) {
	let products = getCart();
	let indexToUpdate;
	products.forEach(function(item, index) {
		if (item.id === id) {
			indexToUpdate = index;
		}
	});
	products[indexToUpdate].qty = qty;
	setCart(products);
	console.log(document.cookie);
}

function updateCartTotals() {
	let totalPrice = 0;
	$('.fc-item-total').each(function () {
		let qty = +$(this).parents('.fc-cart-item').find('.fc-cart-qty').first().val();
		let price = +$(this).attr('data-item_price');
		// item total
		$(this).html(qty * price);
		totalPrice += +$(this).html();
	});
	let shippingPrice = +$('#fc-cart-shipping').html();
	// total
	$('#fc-cart-total').html(totalPrice);
	// total with shipping
	$('#fc-cart-total-with-shipping').html(totalPrice + shippingPrice);
}

$(document).ready(function () {

	if (getCookie('cart') === "") {
		setCart([]);
	}

	// add to cart
	$('#add-to-cart-btn').click(function () {
		let product = +$(this).attr('data-item_id');
		let qty = +$('#cart-product-qty').val();
		let options = {};
		$('.fc-cart-option').each(function () {
			let name = $(this).attr('data-option_id');
			options[name] = $(this).val();
		});
		let id = product;
		for (let key in options) {
			id += ('_' + options[key]);
		}
		if (Number.isInteger(qty) && qty > 0) {
			addCartItem(id, product, qty, options);
		}
		// clear add form
		$('#cart-product-qty').val('1');
		showHeaderCartTotalQty();
	});

	// remove item
	$('.fc-btn-remove').click(function () {
		let id = $(this).attr('data-item_id');
		removeCartItem(id);
		$(this).closest('.fc-cart-item').remove();
		updateCartTotals();
		showHeaderCartTotalQty();
	});

	// update item qty
	$('.fc-cart-qty').keyup(function () {
		let id = $(this).attr('data-item_id');
		let qty = +$(this).val();
		if (Number.isInteger(qty) && qty > 0) {
			updateCartItem(id, qty);
		} else {
			$(this).val(1);
			updateCartItem(id, 1);
		}
		updateCartTotals();
		showHeaderCartTotalQty();
	});

	console.log(document.cookie);
	updateCartTotals();
	showHeaderCartTotalQty();

});


