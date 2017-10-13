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

$(document).ready(function () {

	var products = [
		{id: 12, qty: 1},
		{id: 13, qty: 1},
		{id: 19, qty: 1},
		{id: 10, qty: 1},
		{id: 15, qty: 10}
	];

	// при изменении массива products

	setCookie('cart', JSON.stringify(products));
	console.log(document.cookie);

	// при выводе на экран

	function getCartTotalQty() {
		var productsRecieved = JSON.parse(getCookie('cart'));
		var totalQty = 0;
		productsRecieved.forEach(function(item) {
			totalQty += item.qty;
		});
		return totalQty;
	}

	$('#cart-total-qty').html(getCartTotalQty());

	var productsRecieved = JSON.parse(getCookie('cart'));


});