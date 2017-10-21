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
		let optionsAlert = $('#product-add-options-alert');
		optionsAlert.fadeOut();
		$('.form-group').removeClass('has-error');


		let emptyOptions = $('.fc-cart-option option:selected[value=0]');
		if (emptyOptions.length > 0) {
			emptyOptions.each(function () {
				$(this).closest('.form-group').addClass('has-error');
			});
			optionsAlert.fadeIn();
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



//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvb2tpZS1jYXJ0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im15c2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHNldENvb2tpZShjbmFtZSwgY3ZhbHVlLCBleGRheXMpIHtcclxuXHRsZXQgZCA9IG5ldyBEYXRlKCk7XHJcblx0ZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgKGV4ZGF5cyoyNCo2MCo2MCoxMDAwKSk7XHJcblx0bGV0IGV4cGlyZXMgPSBcImV4cGlyZXM9XCIrIGQudG9VVENTdHJpbmcoKTtcclxuXHRkb2N1bWVudC5jb29raWUgPSBjbmFtZSArIFwiPVwiICsgY3ZhbHVlICsgXCI7XCIgKyBleHBpcmVzICsgXCI7cGF0aD0vXCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENvb2tpZShjbmFtZSkge1xyXG5cdGxldCBuYW1lID0gY25hbWUgKyBcIj1cIjtcclxuXHRsZXQgZGVjb2RlZENvb2tpZSA9IGRlY29kZVVSSUNvbXBvbmVudChkb2N1bWVudC5jb29raWUpO1xyXG5cdGxldCBjYSA9IGRlY29kZWRDb29raWUuc3BsaXQoJzsnKTtcclxuXHRmb3IobGV0IGkgPSAwOyBpIDxjYS5sZW5ndGg7IGkrKykge1xyXG5cdFx0bGV0IGMgPSBjYVtpXTtcclxuXHRcdHdoaWxlIChjLmNoYXJBdCgwKSA9PT0gJyAnKSB7XHJcblx0XHRcdGMgPSBjLnN1YnN0cmluZygxKTtcclxuXHRcdH1cclxuXHRcdGlmIChjLmluZGV4T2YobmFtZSkgPT09IDApIHtcclxuXHRcdFx0cmV0dXJuIGMuc3Vic3RyaW5nKG5hbWUubGVuZ3RoLCBjLmxlbmd0aCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBcIlwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRDYXJ0KGN2YWx1ZSkge1xyXG5cdHNldENvb2tpZSgnY2FydCcsIEpTT04uc3RyaW5naWZ5KGN2YWx1ZSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDYXJ0KCkge1xyXG5cdHJldHVybiBKU09OLnBhcnNlKGdldENvb2tpZSgnY2FydCcpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlQ2FydEl0ZW0gKGlkKSB7XHJcblx0bGV0IHByb2R1Y3RzID0gZ2V0Q2FydCgpO1xyXG5cdGxldCBpbmRleFRvVXBkYXRlO1xyXG5cdHByb2R1Y3RzLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcclxuXHRcdGlmIChpdGVtLmlkID09PSBpZCkge1xyXG5cdFx0XHRpbmRleFRvVXBkYXRlID0gaW5kZXg7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0cHJvZHVjdHMuc3BsaWNlKGluZGV4VG9VcGRhdGUsIDEpO1xyXG5cdHNldENhcnQocHJvZHVjdHMpO1xyXG5cdGlmIChwcm9kdWN0cy5sZW5ndGggPT09IDApIHtcclxuXHRcdCQoJyNmYy1jYXJ0JykuZW1wdHkoKTtcclxuXHRcdCQoJyNmYy1jYXJ0LWVtcHR5Jykuc2hvdygpO1xyXG5cdH1cclxuXHRjb25zb2xlLmxvZyhkb2N1bWVudC5jb29raWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDYXJ0VG90YWxRdHkgKCkge1xyXG5cdGlmIChnZXRDb29raWUoXCJjYXJ0XCIpICE9PSBcIlwiKSB7XHJcblx0XHRsZXQgcHJvZHVjdHMgPSBnZXRDYXJ0KCk7XHJcblx0XHRsZXQgdG90YWxRdHkgPSAwO1xyXG5cdFx0cHJvZHVjdHMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdHRvdGFsUXR5ICs9IGl0ZW0ucXR5O1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gdG90YWxRdHk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHJldHVybiAwO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2hvd0hlYWRlckNhcnRUb3RhbFF0eSAoKSB7XHJcblx0JCgnI2NhcnQtdG90YWwtcXR5JykuaHRtbChnZXRDYXJ0VG90YWxRdHkoKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZENhcnRJdGVtIChpZCwgcHJvZHVjdCwgcXR5LCBvcHRpb25zKSB7XHJcblx0bGV0IHByb2R1Y3RzID0gZ2V0Q2FydCgpO1xyXG5cdGxldCBleGlzdHNJbkNhcnQgPSBmYWxzZTtcclxuXHRwcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdGlmIChpdGVtLmlkID09PSBpZCkge1xyXG5cdFx0XHRpdGVtLnF0eSArPSBxdHk7XHJcblx0XHRcdGV4aXN0c0luQ2FydCA9IHRydWU7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0aWYgKCFleGlzdHNJbkNhcnQpIHtcclxuXHRcdHByb2R1Y3RzLnB1c2goe1xyXG5cdFx0XHRpZDogaWQsXHJcblx0XHRcdHByb2R1Y3Q6IHByb2R1Y3QsXHJcblx0XHRcdHF0eTogcXR5LFxyXG5cdFx0XHRvcHRpb25zOiBvcHRpb25zXHJcblx0XHR9KTtcclxuXHR9XHJcblx0c2V0Q2FydChwcm9kdWN0cyk7XHJcblx0Y29uc29sZS5sb2coZG9jdW1lbnQuY29va2llKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQ2FydEl0ZW0gKGlkLCBxdHkpIHtcclxuXHRsZXQgcHJvZHVjdHMgPSBnZXRDYXJ0KCk7XHJcblx0bGV0IGluZGV4VG9VcGRhdGU7XHJcblx0cHJvZHVjdHMuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xyXG5cdFx0aWYgKGl0ZW0uaWQgPT09IGlkKSB7XHJcblx0XHRcdGluZGV4VG9VcGRhdGUgPSBpbmRleDtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRwcm9kdWN0c1tpbmRleFRvVXBkYXRlXS5xdHkgPSBxdHk7XHJcblx0c2V0Q2FydChwcm9kdWN0cyk7XHJcblx0Y29uc29sZS5sb2coZG9jdW1lbnQuY29va2llKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQ2FydFRvdGFscygpIHtcclxuXHRsZXQgdG90YWxQcmljZSA9IDA7XHJcblx0JCgnLmZjLWl0ZW0tdG90YWwnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHRcdGxldCBxdHkgPSArJCh0aGlzKS5wYXJlbnRzKCcuZmMtY2FydC1pdGVtJykuZmluZCgnLmZjLWNhcnQtcXR5JykuZmlyc3QoKS52YWwoKTtcclxuXHRcdGxldCBwcmljZSA9ICskKHRoaXMpLmF0dHIoJ2RhdGEtaXRlbV9wcmljZScpO1xyXG5cdFx0Ly8gaXRlbSB0b3RhbFxyXG5cdFx0JCh0aGlzKS5odG1sKHF0eSAqIHByaWNlKTtcclxuXHRcdHRvdGFsUHJpY2UgKz0gKyQodGhpcykuaHRtbCgpO1xyXG5cdH0pO1xyXG5cdGxldCBzaGlwcGluZ1ByaWNlID0gKyQoJyNmYy1jYXJ0LXNoaXBwaW5nJykuaHRtbCgpO1xyXG5cdC8vIHRvdGFsXHJcblx0JCgnI2ZjLWNhcnQtdG90YWwnKS5odG1sKHRvdGFsUHJpY2UpO1xyXG5cdC8vIHRvdGFsIHdpdGggc2hpcHBpbmdcclxuXHQkKCcjZmMtY2FydC10b3RhbC13aXRoLXNoaXBwaW5nJykuaHRtbCh0b3RhbFByaWNlICsgc2hpcHBpbmdQcmljZSk7XHJcbn1cclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuXHJcblx0aWYgKGdldENvb2tpZSgnY2FydCcpID09PSBcIlwiKSB7XHJcblx0XHRzZXRDYXJ0KFtdKTtcclxuXHR9XHJcblxyXG5cdC8vIGFkZCB0byBjYXJ0XHJcblx0JCgnI2FkZC10by1jYXJ0LWJ0bicpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGxldCBvcHRpb25zQWxlcnQgPSAkKCcjcHJvZHVjdC1hZGQtb3B0aW9ucy1hbGVydCcpO1xyXG5cdFx0b3B0aW9uc0FsZXJ0LmZhZGVPdXQoKTtcclxuXHRcdCQoJy5mb3JtLWdyb3VwJykucmVtb3ZlQ2xhc3MoJ2hhcy1lcnJvcicpO1xyXG5cclxuXHJcblx0XHRsZXQgZW1wdHlPcHRpb25zID0gJCgnLmZjLWNhcnQtb3B0aW9uIG9wdGlvbjpzZWxlY3RlZFt2YWx1ZT0wXScpO1xyXG5cdFx0aWYgKGVtcHR5T3B0aW9ucy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGVtcHR5T3B0aW9ucy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHQkKHRoaXMpLmNsb3Nlc3QoJy5mb3JtLWdyb3VwJykuYWRkQ2xhc3MoJ2hhcy1lcnJvcicpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0b3B0aW9uc0FsZXJ0LmZhZGVJbigpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cclxuXHRcdGxldCBwcm9kdWN0ID0gKyQodGhpcykuYXR0cignZGF0YS1pdGVtX2lkJyk7XHJcblx0XHRsZXQgcXR5ID0gKyQoJyNjYXJ0LXByb2R1Y3QtcXR5JykudmFsKCk7XHJcblxyXG5cdFx0Ly8gY2hlY2sgb3B0aW9uc1xyXG5cdFx0bGV0IG9wdGlvbnMgPSB7fTtcclxuXHJcblx0XHQkKCcuZmMtY2FydC1vcHRpb24nKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0bGV0IG5hbWUgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtb3B0aW9uX2lkJyk7XHJcblx0XHRcdG9wdGlvbnNbbmFtZV0gPSArJCh0aGlzKS52YWwoKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGxldCBpZCA9IHByb2R1Y3Q7XHJcblx0XHRmb3IgKGxldCBrZXkgaW4gb3B0aW9ucykge1xyXG5cdFx0XHRpZCArPSAoJ18nICsgb3B0aW9uc1trZXldKTtcclxuXHRcdH1cclxuXHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKHF0eSkgJiYgcXR5ID4gMCkge1xyXG5cdFx0XHRhZGRDYXJ0SXRlbShpZCwgcHJvZHVjdCwgcXR5LCBvcHRpb25zKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBjbGVhciBhZGQgZm9ybVxyXG5cdFx0JCgnI2NhcnQtcHJvZHVjdC1xdHknKS52YWwoJzEnKTtcclxuXHRcdHNob3dIZWFkZXJDYXJ0VG90YWxRdHkoKTtcclxuXHR9KTtcclxuXHJcblx0Ly8gcmVtb3ZlIGl0ZW1cclxuXHQkKCcuZmMtYnRuLXJlbW92ZScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGxldCBpZCA9ICQodGhpcykuYXR0cignZGF0YS1pdGVtX2lkJyk7XHJcblx0XHRyZW1vdmVDYXJ0SXRlbShpZCk7XHJcblx0XHQkKHRoaXMpLmNsb3Nlc3QoJy5mYy1jYXJ0LWl0ZW0nKS5yZW1vdmUoKTtcclxuXHRcdHVwZGF0ZUNhcnRUb3RhbHMoKTtcclxuXHRcdHNob3dIZWFkZXJDYXJ0VG90YWxRdHkoKTtcclxuXHR9KTtcclxuXHJcblx0Ly8gdXBkYXRlIGl0ZW0gcXR5XHJcblx0JCgnLmZjLWNhcnQtcXR5Jykua2V5dXAoZnVuY3Rpb24gKCkge1xyXG5cdFx0bGV0IGlkID0gJCh0aGlzKS5hdHRyKCdkYXRhLWl0ZW1faWQnKTtcclxuXHRcdGxldCBxdHkgPSArJCh0aGlzKS52YWwoKTtcclxuXHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKHF0eSkgJiYgcXR5ID4gMCkge1xyXG5cdFx0XHR1cGRhdGVDYXJ0SXRlbShpZCwgcXR5KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQodGhpcykudmFsKDEpO1xyXG5cdFx0XHR1cGRhdGVDYXJ0SXRlbShpZCwgMSk7XHJcblx0XHR9XHJcblx0XHR1cGRhdGVDYXJ0VG90YWxzKCk7XHJcblx0XHRzaG93SGVhZGVyQ2FydFRvdGFsUXR5KCk7XHJcblx0fSk7XHJcblxyXG5cdGNvbnNvbGUubG9nKGRvY3VtZW50LmNvb2tpZSk7XHJcblx0dXBkYXRlQ2FydFRvdGFscygpO1xyXG5cdHNob3dIZWFkZXJDYXJ0VG90YWxRdHkoKTtcclxuXHJcbn0pO1xyXG5cclxuXHJcbiJdfQ==
