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

function addCartItem (id, qty) {
	let products = getCart();
	let addedToCart = false;
	products.forEach(function(item) {
		if (item.id === id) {
			item.qty += qty;
			addedToCart = true;
		}
	});
	if (!addedToCart) {
		products.push({id: id, qty: qty});
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
		let id = +$(this).attr('data-item_id');
		let qty = +$('#cart-product-qty').val();
		if (Number.isInteger(qty) && qty > 0) {
			addCartItem(id, qty);
		}
		$('#cart-product-qty').val('1');
		showHeaderCartTotalQty();
	});

	// remove item
	$('.fc-cart-remove').click(function () {
		let id = +$(this).attr('data-item_id');
		removeCartItem(id);
		$(this).closest('.fc-cart-item').remove();
		updateCartTotals();
		showHeaderCartTotalQty();
	});

	// update item qty
	$('.fc-cart-qty').change(function () {
		let id = +$(this).attr('data-item_id');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvb2tpZS1jYXJ0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im15c2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHNldENvb2tpZShjbmFtZSwgY3ZhbHVlLCBleGRheXMpIHtcclxuXHRsZXQgZCA9IG5ldyBEYXRlKCk7XHJcblx0ZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgKGV4ZGF5cyoyNCo2MCo2MCoxMDAwKSk7XHJcblx0bGV0IGV4cGlyZXMgPSBcImV4cGlyZXM9XCIrIGQudG9VVENTdHJpbmcoKTtcclxuXHRkb2N1bWVudC5jb29raWUgPSBjbmFtZSArIFwiPVwiICsgY3ZhbHVlICsgXCI7XCIgKyBleHBpcmVzICsgXCI7cGF0aD0vXCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENvb2tpZShjbmFtZSkge1xyXG5cdGxldCBuYW1lID0gY25hbWUgKyBcIj1cIjtcclxuXHRsZXQgZGVjb2RlZENvb2tpZSA9IGRlY29kZVVSSUNvbXBvbmVudChkb2N1bWVudC5jb29raWUpO1xyXG5cdGxldCBjYSA9IGRlY29kZWRDb29raWUuc3BsaXQoJzsnKTtcclxuXHRmb3IobGV0IGkgPSAwOyBpIDxjYS5sZW5ndGg7IGkrKykge1xyXG5cdFx0bGV0IGMgPSBjYVtpXTtcclxuXHRcdHdoaWxlIChjLmNoYXJBdCgwKSA9PT0gJyAnKSB7XHJcblx0XHRcdGMgPSBjLnN1YnN0cmluZygxKTtcclxuXHRcdH1cclxuXHRcdGlmIChjLmluZGV4T2YobmFtZSkgPT09IDApIHtcclxuXHRcdFx0cmV0dXJuIGMuc3Vic3RyaW5nKG5hbWUubGVuZ3RoLCBjLmxlbmd0aCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBcIlwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRDYXJ0KGN2YWx1ZSkge1xyXG5cdHNldENvb2tpZSgnY2FydCcsIEpTT04uc3RyaW5naWZ5KGN2YWx1ZSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDYXJ0KCkge1xyXG5cdHJldHVybiBKU09OLnBhcnNlKGdldENvb2tpZSgnY2FydCcpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkQ2FydEl0ZW0gKGlkLCBxdHkpIHtcclxuXHRsZXQgcHJvZHVjdHMgPSBnZXRDYXJ0KCk7XHJcblx0bGV0IGFkZGVkVG9DYXJ0ID0gZmFsc2U7XHJcblx0cHJvZHVjdHMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRpZiAoaXRlbS5pZCA9PT0gaWQpIHtcclxuXHRcdFx0aXRlbS5xdHkgKz0gcXR5O1xyXG5cdFx0XHRhZGRlZFRvQ2FydCA9IHRydWU7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0aWYgKCFhZGRlZFRvQ2FydCkge1xyXG5cdFx0cHJvZHVjdHMucHVzaCh7aWQ6IGlkLCBxdHk6IHF0eX0pO1xyXG5cdH1cclxuXHRzZXRDYXJ0KHByb2R1Y3RzKTtcclxuXHRjb25zb2xlLmxvZyhkb2N1bWVudC5jb29raWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVDYXJ0SXRlbSAoaWQsIHF0eSkge1xyXG5cdGxldCBwcm9kdWN0cyA9IGdldENhcnQoKTtcclxuXHRsZXQgaW5kZXhUb1VwZGF0ZTtcclxuXHRwcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XHJcblx0XHRpZiAoaXRlbS5pZCA9PT0gaWQpIHtcclxuXHRcdFx0aW5kZXhUb1VwZGF0ZSA9IGluZGV4O1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdHByb2R1Y3RzW2luZGV4VG9VcGRhdGVdLnF0eSA9IHF0eTtcclxuXHRzZXRDYXJ0KHByb2R1Y3RzKTtcclxuXHRjb25zb2xlLmxvZyhkb2N1bWVudC5jb29raWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVDYXJ0SXRlbSAoaWQpIHtcclxuXHRsZXQgcHJvZHVjdHMgPSBnZXRDYXJ0KCk7XHJcblx0bGV0IGluZGV4VG9VcGRhdGU7XHJcblx0cHJvZHVjdHMuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xyXG5cdFx0aWYgKGl0ZW0uaWQgPT09IGlkKSB7XHJcblx0XHRcdGluZGV4VG9VcGRhdGUgPSBpbmRleDtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRwcm9kdWN0cy5zcGxpY2UoaW5kZXhUb1VwZGF0ZSwgMSk7XHJcblx0c2V0Q2FydChwcm9kdWN0cyk7XHJcblx0aWYgKHByb2R1Y3RzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0JCgnI2ZjLWNhcnQnKS5lbXB0eSgpO1xyXG5cdFx0JCgnI2ZjLWNhcnQtZW1wdHknKS5zaG93KCk7XHJcblx0fVxyXG5cdGNvbnNvbGUubG9nKGRvY3VtZW50LmNvb2tpZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENhcnRUb3RhbFF0eSAoKSB7XHJcblx0aWYgKGdldENvb2tpZShcImNhcnRcIikgIT09IFwiXCIpIHtcclxuXHRcdGxldCBwcm9kdWN0cyA9IGdldENhcnQoKTtcclxuXHRcdGxldCB0b3RhbFF0eSA9IDA7XHJcblx0XHRwcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0dG90YWxRdHkgKz0gaXRlbS5xdHk7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiB0b3RhbFF0eTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuIDA7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93SGVhZGVyQ2FydFRvdGFsUXR5ICgpIHtcclxuXHQkKCcjY2FydC10b3RhbC1xdHknKS5odG1sKGdldENhcnRUb3RhbFF0eSgpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQ2FydFRvdGFscygpIHtcclxuXHRsZXQgdG90YWxQcmljZSA9IDA7XHJcblx0JCgnLmZjLWl0ZW0tdG90YWwnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHRcdGxldCBxdHkgPSArJCh0aGlzKS5wYXJlbnRzKCcuZmMtY2FydC1pdGVtJykuZmluZCgnLmZjLWNhcnQtcXR5JykuZmlyc3QoKS52YWwoKTtcclxuXHRcdGxldCBwcmljZSA9ICskKHRoaXMpLmF0dHIoJ2RhdGEtaXRlbV9wcmljZScpO1xyXG5cdFx0Ly8gaXRlbSB0b3RhbFxyXG5cdFx0JCh0aGlzKS5odG1sKHF0eSAqIHByaWNlKTtcclxuXHRcdHRvdGFsUHJpY2UgKz0gKyQodGhpcykuaHRtbCgpO1xyXG5cdH0pO1xyXG5cdGxldCBzaGlwcGluZ1ByaWNlID0gKyQoJyNmYy1jYXJ0LXNoaXBwaW5nJykuaHRtbCgpO1xyXG5cdC8vIHRvdGFsXHJcblx0JCgnI2ZjLWNhcnQtdG90YWwnKS5odG1sKHRvdGFsUHJpY2UpO1xyXG5cdC8vIHRvdGFsIHdpdGggc2hpcHBpbmdcclxuXHQkKCcjZmMtY2FydC10b3RhbC13aXRoLXNoaXBwaW5nJykuaHRtbCh0b3RhbFByaWNlICsgc2hpcHBpbmdQcmljZSk7XHJcbn1cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuXHJcblx0aWYgKGdldENvb2tpZSgnY2FydCcpID09PSBcIlwiKSB7XHJcblx0XHRzZXRDYXJ0KFtdKTtcclxuXHR9XHJcblxyXG5cdC8vIGFkZCB0byBjYXJ0XHJcblx0JCgnI2FkZC10by1jYXJ0LWJ0bicpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGxldCBpZCA9ICskKHRoaXMpLmF0dHIoJ2RhdGEtaXRlbV9pZCcpO1xyXG5cdFx0bGV0IHF0eSA9ICskKCcjY2FydC1wcm9kdWN0LXF0eScpLnZhbCgpO1xyXG5cdFx0aWYgKE51bWJlci5pc0ludGVnZXIocXR5KSAmJiBxdHkgPiAwKSB7XHJcblx0XHRcdGFkZENhcnRJdGVtKGlkLCBxdHkpO1xyXG5cdFx0fVxyXG5cdFx0JCgnI2NhcnQtcHJvZHVjdC1xdHknKS52YWwoJzEnKTtcclxuXHRcdHNob3dIZWFkZXJDYXJ0VG90YWxRdHkoKTtcclxuXHR9KTtcclxuXHJcblx0Ly8gcmVtb3ZlIGl0ZW1cclxuXHQkKCcuZmMtY2FydC1yZW1vdmUnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRsZXQgaWQgPSArJCh0aGlzKS5hdHRyKCdkYXRhLWl0ZW1faWQnKTtcclxuXHRcdHJlbW92ZUNhcnRJdGVtKGlkKTtcclxuXHRcdCQodGhpcykuY2xvc2VzdCgnLmZjLWNhcnQtaXRlbScpLnJlbW92ZSgpO1xyXG5cdFx0dXBkYXRlQ2FydFRvdGFscygpO1xyXG5cdFx0c2hvd0hlYWRlckNhcnRUb3RhbFF0eSgpO1xyXG5cdH0pO1xyXG5cclxuXHQvLyB1cGRhdGUgaXRlbSBxdHlcclxuXHQkKCcuZmMtY2FydC1xdHknKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG5cdFx0bGV0IGlkID0gKyQodGhpcykuYXR0cignZGF0YS1pdGVtX2lkJyk7XHJcblx0XHRsZXQgcXR5ID0gKyQodGhpcykudmFsKCk7XHJcblx0XHRpZiAoTnVtYmVyLmlzSW50ZWdlcihxdHkpICYmIHF0eSA+IDApIHtcclxuXHRcdFx0dXBkYXRlQ2FydEl0ZW0oaWQsIHF0eSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKHRoaXMpLnZhbCgxKTtcclxuXHRcdFx0dXBkYXRlQ2FydEl0ZW0oaWQsIDEpO1xyXG5cdFx0fVxyXG5cdFx0dXBkYXRlQ2FydFRvdGFscygpO1xyXG5cdFx0c2hvd0hlYWRlckNhcnRUb3RhbFF0eSgpO1xyXG5cdH0pO1xyXG5cclxuXHRjb25zb2xlLmxvZyhkb2N1bWVudC5jb29raWUpO1xyXG5cdHVwZGF0ZUNhcnRUb3RhbHMoKTtcclxuXHRzaG93SGVhZGVyQ2FydFRvdGFsUXR5KCk7XHJcbn0pOyJdfQ==
