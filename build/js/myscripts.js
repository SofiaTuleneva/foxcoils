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

function showShippingTotal(val) {
	$('#fc-cart-shipping').html(val);
}

function scrollTop() {
	$('body, html').animate({scrollTop: 0}, 300);
}

function scrollToAddFrom() {
	$('html, body').animate({ scrollTop: $('#fc-scroll').offset().top }, 500);
}

$(document).ready(function () {
	if (getCookie('cart') === "") {
		setCart([]);
	}

	let optionsAlert = $('#product-add-options-alert');
	let alertSuccess = $('#product-add-alert-success');

	if (window.location.hash === '#addtocart') {
		$('.fc-cart-option').each(function () {
			$(this).closest('.form-group').addClass('has-error');
			optionsAlert.show();
		});
	}

	// add to cart
	$('#add-to-cart-btn').click(function () {
		optionsAlert.hide();
		alertSuccess.hide();
		$('.form-group').removeClass('has-error');


		let emptyOptions = $('.fc-cart-option option:selected[value=0]');
		if (emptyOptions.length > 0) {
			emptyOptions.each(function () {
				$(this).closest('.form-group').addClass('has-error');
			});
			optionsAlert.fadeIn(1000);
			return false;
		}


		let product = +$(this).attr('data-item_id');
		let qty = +$('#cart-product-qty').val();

		// check options
		let options = {};

		$('.fc-cart-option').each(function () {
			let name = $(this).attr('data-option_id');
			options[name] = +$(this).val();
		});

		let id = product;
		for (let key in options) {
			id += ('_' + options[key]);
		}
		if (Number.isInteger(qty) && qty > 0) {
			addCartItem(id, product, qty, options);
			alertSuccess.fadeIn(1000);
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

	$('.fc-shipping-method').change(function () {
		showShippingTotal($(this).val());
		updateCartTotals();
	});

	console.log(document.cookie);
	showShippingTotal($('.fc-shipping-method:checked').val());
	updateCartTotals();
	showHeaderCartTotalQty();
});



//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvb2tpZS1jYXJ0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibXlzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gc2V0Q29va2llKGNuYW1lLCBjdmFsdWUsIGV4ZGF5cykge1xyXG5cdGxldCBkID0gbmV3IERhdGUoKTtcclxuXHRkLnNldFRpbWUoZC5nZXRUaW1lKCkgKyAoZXhkYXlzKjI0KjYwKjYwKjEwMDApKTtcclxuXHRsZXQgZXhwaXJlcyA9IFwiZXhwaXJlcz1cIisgZC50b1VUQ1N0cmluZygpO1xyXG5cdGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgXCI9XCIgKyBjdmFsdWUgKyBcIjtcIiArIGV4cGlyZXMgKyBcIjtwYXRoPS9cIjtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q29va2llKGNuYW1lKSB7XHJcblx0bGV0IG5hbWUgPSBjbmFtZSArIFwiPVwiO1xyXG5cdGxldCBkZWNvZGVkQ29va2llID0gZGVjb2RlVVJJQ29tcG9uZW50KGRvY3VtZW50LmNvb2tpZSk7XHJcblx0bGV0IGNhID0gZGVjb2RlZENvb2tpZS5zcGxpdCgnOycpO1xyXG5cdGZvcihsZXQgaSA9IDA7IGkgPGNhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRsZXQgYyA9IGNhW2ldO1xyXG5cdFx0d2hpbGUgKGMuY2hhckF0KDApID09PSAnICcpIHtcclxuXHRcdFx0YyA9IGMuc3Vic3RyaW5nKDEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGMuaW5kZXhPZihuYW1lKSA9PT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gYy5zdWJzdHJpbmcobmFtZS5sZW5ndGgsIGMubGVuZ3RoKTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIFwiXCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldENhcnQoY3ZhbHVlKSB7XHJcblx0c2V0Q29va2llKCdjYXJ0JywgSlNPTi5zdHJpbmdpZnkoY3ZhbHVlKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENhcnQoKSB7XHJcblx0cmV0dXJuIEpTT04ucGFyc2UoZ2V0Q29va2llKCdjYXJ0JykpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVDYXJ0SXRlbSAoaWQpIHtcclxuXHRsZXQgcHJvZHVjdHMgPSBnZXRDYXJ0KCk7XHJcblx0bGV0IGluZGV4VG9VcGRhdGU7XHJcblx0cHJvZHVjdHMuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xyXG5cdFx0aWYgKGl0ZW0uaWQgPT09IGlkKSB7XHJcblx0XHRcdGluZGV4VG9VcGRhdGUgPSBpbmRleDtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRwcm9kdWN0cy5zcGxpY2UoaW5kZXhUb1VwZGF0ZSwgMSk7XHJcblx0c2V0Q2FydChwcm9kdWN0cyk7XHJcblx0aWYgKHByb2R1Y3RzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0JCgnI2ZjLWNhcnQnKS5lbXB0eSgpO1xyXG5cdFx0JCgnI2ZjLWNhcnQtZW1wdHknKS5zaG93KCk7XHJcblx0fVxyXG5cdGNvbnNvbGUubG9nKGRvY3VtZW50LmNvb2tpZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENhcnRUb3RhbFF0eSAoKSB7XHJcblx0aWYgKGdldENvb2tpZShcImNhcnRcIikgIT09IFwiXCIpIHtcclxuXHRcdGxldCBwcm9kdWN0cyA9IGdldENhcnQoKTtcclxuXHRcdGxldCB0b3RhbFF0eSA9IDA7XHJcblx0XHRwcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0dG90YWxRdHkgKz0gaXRlbS5xdHk7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiB0b3RhbFF0eTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuIDA7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93SGVhZGVyQ2FydFRvdGFsUXR5ICgpIHtcclxuXHQkKCcjY2FydC10b3RhbC1xdHknKS5odG1sKGdldENhcnRUb3RhbFF0eSgpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkQ2FydEl0ZW0gKGlkLCBwcm9kdWN0LCBxdHksIG9wdGlvbnMpIHtcclxuXHRsZXQgcHJvZHVjdHMgPSBnZXRDYXJ0KCk7XHJcblx0bGV0IGV4aXN0c0luQ2FydCA9IGZhbHNlO1xyXG5cdHByb2R1Y3RzLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0aWYgKGl0ZW0uaWQgPT09IGlkKSB7XHJcblx0XHRcdGl0ZW0ucXR5ICs9IHF0eTtcclxuXHRcdFx0ZXhpc3RzSW5DYXJ0ID0gdHJ1ZTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRpZiAoIWV4aXN0c0luQ2FydCkge1xyXG5cdFx0cHJvZHVjdHMucHVzaCh7XHJcblx0XHRcdGlkOiBpZCxcclxuXHRcdFx0cHJvZHVjdDogcHJvZHVjdCxcclxuXHRcdFx0cXR5OiBxdHksXHJcblx0XHRcdG9wdGlvbnM6IG9wdGlvbnNcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRzZXRDYXJ0KHByb2R1Y3RzKTtcclxuXHRjb25zb2xlLmxvZyhkb2N1bWVudC5jb29raWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVDYXJ0SXRlbSAoaWQsIHF0eSkge1xyXG5cdGxldCBwcm9kdWN0cyA9IGdldENhcnQoKTtcclxuXHRsZXQgaW5kZXhUb1VwZGF0ZTtcclxuXHRwcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XHJcblx0XHRpZiAoaXRlbS5pZCA9PT0gaWQpIHtcclxuXHRcdFx0aW5kZXhUb1VwZGF0ZSA9IGluZGV4O1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdHByb2R1Y3RzW2luZGV4VG9VcGRhdGVdLnF0eSA9IHF0eTtcclxuXHRzZXRDYXJ0KHByb2R1Y3RzKTtcclxuXHRjb25zb2xlLmxvZyhkb2N1bWVudC5jb29raWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVDYXJ0VG90YWxzKCkge1xyXG5cdGxldCB0b3RhbFByaWNlID0gMDtcclxuXHQkKCcuZmMtaXRlbS10b3RhbCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0bGV0IHF0eSA9ICskKHRoaXMpLnBhcmVudHMoJy5mYy1jYXJ0LWl0ZW0nKS5maW5kKCcuZmMtY2FydC1xdHknKS5maXJzdCgpLnZhbCgpO1xyXG5cdFx0bGV0IHByaWNlID0gKyQodGhpcykuYXR0cignZGF0YS1pdGVtX3ByaWNlJyk7XHJcblx0XHQvLyBpdGVtIHRvdGFsXHJcblx0XHQkKHRoaXMpLmh0bWwocXR5ICogcHJpY2UpO1xyXG5cdFx0dG90YWxQcmljZSArPSArJCh0aGlzKS5odG1sKCk7XHJcblx0fSk7XHJcblx0bGV0IHNoaXBwaW5nUHJpY2UgPSArJCgnI2ZjLWNhcnQtc2hpcHBpbmcnKS5odG1sKCk7XHJcblx0Ly8gdG90YWxcclxuXHQkKCcjZmMtY2FydC10b3RhbCcpLmh0bWwodG90YWxQcmljZSk7XHJcblxyXG5cdC8vIHRvdGFsIHdpdGggc2hpcHBpbmdcclxuXHQkKCcjZmMtY2FydC10b3RhbC13aXRoLXNoaXBwaW5nJykuaHRtbCh0b3RhbFByaWNlICsgc2hpcHBpbmdQcmljZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNob3dTaGlwcGluZ1RvdGFsKHZhbCkge1xyXG5cdCQoJyNmYy1jYXJ0LXNoaXBwaW5nJykuaHRtbCh2YWwpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzY3JvbGxUb3AoKSB7XHJcblx0JCgnYm9keSwgaHRtbCcpLmFuaW1hdGUoe3Njcm9sbFRvcDogMH0sIDMwMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNjcm9sbFRvQWRkRnJvbSgpIHtcclxuXHQkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogJCgnI2ZjLXNjcm9sbCcpLm9mZnNldCgpLnRvcCB9LCA1MDApO1xyXG59XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcblx0aWYgKGdldENvb2tpZSgnY2FydCcpID09PSBcIlwiKSB7XHJcblx0XHRzZXRDYXJ0KFtdKTtcclxuXHR9XHJcblxyXG5cdGxldCBvcHRpb25zQWxlcnQgPSAkKCcjcHJvZHVjdC1hZGQtb3B0aW9ucy1hbGVydCcpO1xyXG5cdGxldCBhbGVydFN1Y2Nlc3MgPSAkKCcjcHJvZHVjdC1hZGQtYWxlcnQtc3VjY2VzcycpO1xyXG5cclxuXHRpZiAod2luZG93LmxvY2F0aW9uLmhhc2ggPT09ICcjYWRkdG9jYXJ0Jykge1xyXG5cdFx0JCgnLmZjLWNhcnQtb3B0aW9uJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdCQodGhpcykuY2xvc2VzdCgnLmZvcm0tZ3JvdXAnKS5hZGRDbGFzcygnaGFzLWVycm9yJyk7XHJcblx0XHRcdG9wdGlvbnNBbGVydC5zaG93KCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vIGFkZCB0byBjYXJ0XHJcblx0JCgnI2FkZC10by1jYXJ0LWJ0bicpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdG9wdGlvbnNBbGVydC5oaWRlKCk7XHJcblx0XHRhbGVydFN1Y2Nlc3MuaGlkZSgpO1xyXG5cdFx0JCgnLmZvcm0tZ3JvdXAnKS5yZW1vdmVDbGFzcygnaGFzLWVycm9yJyk7XHJcblxyXG5cclxuXHRcdGxldCBlbXB0eU9wdGlvbnMgPSAkKCcuZmMtY2FydC1vcHRpb24gb3B0aW9uOnNlbGVjdGVkW3ZhbHVlPTBdJyk7XHJcblx0XHRpZiAoZW1wdHlPcHRpb25zLmxlbmd0aCA+IDApIHtcclxuXHRcdFx0ZW1wdHlPcHRpb25zLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdCQodGhpcykuY2xvc2VzdCgnLmZvcm0tZ3JvdXAnKS5hZGRDbGFzcygnaGFzLWVycm9yJyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRvcHRpb25zQWxlcnQuZmFkZUluKDEwMDApO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGxldCBwcm9kdWN0ID0gKyQodGhpcykuYXR0cignZGF0YS1pdGVtX2lkJyk7XHJcblx0XHRsZXQgcXR5ID0gKyQoJyNjYXJ0LXByb2R1Y3QtcXR5JykudmFsKCk7XHJcblxyXG5cdFx0Ly8gY2hlY2sgb3B0aW9uc1xyXG5cdFx0bGV0IG9wdGlvbnMgPSB7fTtcclxuXHJcblx0XHQkKCcuZmMtY2FydC1vcHRpb24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0bGV0IG5hbWUgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtb3B0aW9uX2lkJyk7XHJcblx0XHRcdG9wdGlvbnNbbmFtZV0gPSArJCh0aGlzKS52YWwoKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGxldCBpZCA9IHByb2R1Y3Q7XHJcblx0XHRmb3IgKGxldCBrZXkgaW4gb3B0aW9ucykge1xyXG5cdFx0XHRpZCArPSAoJ18nICsgb3B0aW9uc1trZXldKTtcclxuXHRcdH1cclxuXHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKHF0eSkgJiYgcXR5ID4gMCkge1xyXG5cdFx0XHRhZGRDYXJ0SXRlbShpZCwgcHJvZHVjdCwgcXR5LCBvcHRpb25zKTtcclxuXHRcdFx0YWxlcnRTdWNjZXNzLmZhZGVJbigxMDAwKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBjbGVhciBhZGQgZm9ybVxyXG5cdFx0JCgnI2NhcnQtcHJvZHVjdC1xdHknKS52YWwoJzEnKTtcclxuXHRcdHNob3dIZWFkZXJDYXJ0VG90YWxRdHkoKTtcclxuXHR9KTtcclxuXHJcblx0Ly8gcmVtb3ZlIGl0ZW1cclxuXHQkKCcuZmMtYnRuLXJlbW92ZScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGxldCBpZCA9ICQodGhpcykuYXR0cignZGF0YS1pdGVtX2lkJyk7XHJcblx0XHRyZW1vdmVDYXJ0SXRlbShpZCk7XHJcblx0XHQkKHRoaXMpLmNsb3Nlc3QoJy5mYy1jYXJ0LWl0ZW0nKS5yZW1vdmUoKTtcclxuXHRcdHVwZGF0ZUNhcnRUb3RhbHMoKTtcclxuXHRcdHNob3dIZWFkZXJDYXJ0VG90YWxRdHkoKTtcclxuXHR9KTtcclxuXHJcblx0Ly8gdXBkYXRlIGl0ZW0gcXR5XHJcblx0JCgnLmZjLWNhcnQtcXR5Jykua2V5dXAoZnVuY3Rpb24gKCkge1xyXG5cdFx0bGV0IGlkID0gJCh0aGlzKS5hdHRyKCdkYXRhLWl0ZW1faWQnKTtcclxuXHRcdGxldCBxdHkgPSArJCh0aGlzKS52YWwoKTtcclxuXHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKHF0eSkgJiYgcXR5ID4gMCkge1xyXG5cdFx0XHR1cGRhdGVDYXJ0SXRlbShpZCwgcXR5KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQodGhpcykudmFsKDEpO1xyXG5cdFx0XHR1cGRhdGVDYXJ0SXRlbShpZCwgMSk7XHJcblx0XHR9XHJcblx0XHR1cGRhdGVDYXJ0VG90YWxzKCk7XHJcblx0XHRzaG93SGVhZGVyQ2FydFRvdGFsUXR5KCk7XHJcblx0fSk7XHJcblxyXG5cdCQoJy5mYy1zaGlwcGluZy1tZXRob2QnKS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xyXG5cdFx0c2hvd1NoaXBwaW5nVG90YWwoJCh0aGlzKS52YWwoKSk7XHJcblx0XHR1cGRhdGVDYXJ0VG90YWxzKCk7XHJcblx0fSk7XHJcblxyXG5cdGNvbnNvbGUubG9nKGRvY3VtZW50LmNvb2tpZSk7XHJcblx0c2hvd1NoaXBwaW5nVG90YWwoJCgnLmZjLXNoaXBwaW5nLW1ldGhvZDpjaGVja2VkJykudmFsKCkpO1xyXG5cdHVwZGF0ZUNhcnRUb3RhbHMoKTtcclxuXHRzaG93SGVhZGVyQ2FydFRvdGFsUXR5KCk7XHJcbn0pO1xyXG5cclxuXHJcbiJdfQ==
