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

function addCartItem (id, product, qty, opt_material, opt_frame) {
	let products = getCart();
	let addedToCart = false;
	products.forEach(function(item) {
		if (item.id === id) {
			item.qty += qty;
			addedToCart = true;
		}
	});
	if (!addedToCart) {
		products.push({
			id: id,
			product: product,
			qty: qty,
			opt_material: opt_material,
			opt_frame: opt_frame
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

		let opt_material = +$('#option-material').val();
		let opt_frame = +$('#option-frame').val();
		let id = product + '_' + opt_material + '_' + opt_frame;

		let qty = +$('#cart-product-qty').val();

		if (Number.isInteger(qty) && qty > 0) {
			addCartItem(id, product, qty, opt_material, opt_frame);
		}

		// clear form
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



//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvb2tpZS1jYXJ0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibXlzY3JpcHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gc2V0Q29va2llKGNuYW1lLCBjdmFsdWUsIGV4ZGF5cykge1xyXG5cdGxldCBkID0gbmV3IERhdGUoKTtcclxuXHRkLnNldFRpbWUoZC5nZXRUaW1lKCkgKyAoZXhkYXlzKjI0KjYwKjYwKjEwMDApKTtcclxuXHRsZXQgZXhwaXJlcyA9IFwiZXhwaXJlcz1cIisgZC50b1VUQ1N0cmluZygpO1xyXG5cdGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgXCI9XCIgKyBjdmFsdWUgKyBcIjtcIiArIGV4cGlyZXMgKyBcIjtwYXRoPS9cIjtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q29va2llKGNuYW1lKSB7XHJcblx0bGV0IG5hbWUgPSBjbmFtZSArIFwiPVwiO1xyXG5cdGxldCBkZWNvZGVkQ29va2llID0gZGVjb2RlVVJJQ29tcG9uZW50KGRvY3VtZW50LmNvb2tpZSk7XHJcblx0bGV0IGNhID0gZGVjb2RlZENvb2tpZS5zcGxpdCgnOycpO1xyXG5cdGZvcihsZXQgaSA9IDA7IGkgPGNhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRsZXQgYyA9IGNhW2ldO1xyXG5cdFx0d2hpbGUgKGMuY2hhckF0KDApID09PSAnICcpIHtcclxuXHRcdFx0YyA9IGMuc3Vic3RyaW5nKDEpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGMuaW5kZXhPZihuYW1lKSA9PT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gYy5zdWJzdHJpbmcobmFtZS5sZW5ndGgsIGMubGVuZ3RoKTtcclxuXHRcdH1cclxuXHR9XHJcblx0cmV0dXJuIFwiXCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNldENhcnQoY3ZhbHVlKSB7XHJcblx0c2V0Q29va2llKCdjYXJ0JywgSlNPTi5zdHJpbmdpZnkoY3ZhbHVlKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENhcnQoKSB7XHJcblx0cmV0dXJuIEpTT04ucGFyc2UoZ2V0Q29va2llKCdjYXJ0JykpO1xyXG59XHJcblxyXG5mdW5jdGlvbiByZW1vdmVDYXJ0SXRlbSAoaWQpIHtcclxuXHRsZXQgcHJvZHVjdHMgPSBnZXRDYXJ0KCk7XHJcblx0bGV0IGluZGV4VG9VcGRhdGU7XHJcblx0cHJvZHVjdHMuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xyXG5cdFx0aWYgKGl0ZW0uaWQgPT09IGlkKSB7XHJcblx0XHRcdGluZGV4VG9VcGRhdGUgPSBpbmRleDtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRwcm9kdWN0cy5zcGxpY2UoaW5kZXhUb1VwZGF0ZSwgMSk7XHJcblx0c2V0Q2FydChwcm9kdWN0cyk7XHJcblx0aWYgKHByb2R1Y3RzLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0JCgnI2ZjLWNhcnQnKS5lbXB0eSgpO1xyXG5cdFx0JCgnI2ZjLWNhcnQtZW1wdHknKS5zaG93KCk7XHJcblx0fVxyXG5cdGNvbnNvbGUubG9nKGRvY3VtZW50LmNvb2tpZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENhcnRUb3RhbFF0eSAoKSB7XHJcblx0aWYgKGdldENvb2tpZShcImNhcnRcIikgIT09IFwiXCIpIHtcclxuXHRcdGxldCBwcm9kdWN0cyA9IGdldENhcnQoKTtcclxuXHRcdGxldCB0b3RhbFF0eSA9IDA7XHJcblx0XHRwcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0dG90YWxRdHkgKz0gaXRlbS5xdHk7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiB0b3RhbFF0eTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuIDA7XHJcblx0fVxyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93SGVhZGVyQ2FydFRvdGFsUXR5ICgpIHtcclxuXHQkKCcjY2FydC10b3RhbC1xdHknKS5odG1sKGdldENhcnRUb3RhbFF0eSgpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkQ2FydEl0ZW0gKGlkLCBwcm9kdWN0LCBxdHksIG9wdF9tYXRlcmlhbCwgb3B0X2ZyYW1lKSB7XHJcblx0bGV0IHByb2R1Y3RzID0gZ2V0Q2FydCgpO1xyXG5cdGxldCBhZGRlZFRvQ2FydCA9IGZhbHNlO1xyXG5cdHByb2R1Y3RzLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0aWYgKGl0ZW0uaWQgPT09IGlkKSB7XHJcblx0XHRcdGl0ZW0ucXR5ICs9IHF0eTtcclxuXHRcdFx0YWRkZWRUb0NhcnQgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdGlmICghYWRkZWRUb0NhcnQpIHtcclxuXHRcdHByb2R1Y3RzLnB1c2goe1xyXG5cdFx0XHRpZDogaWQsXHJcblx0XHRcdHByb2R1Y3Q6IHByb2R1Y3QsXHJcblx0XHRcdHF0eTogcXR5LFxyXG5cdFx0XHRvcHRfbWF0ZXJpYWw6IG9wdF9tYXRlcmlhbCxcclxuXHRcdFx0b3B0X2ZyYW1lOiBvcHRfZnJhbWVcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRzZXRDYXJ0KHByb2R1Y3RzKTtcclxuXHRjb25zb2xlLmxvZyhkb2N1bWVudC5jb29raWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVDYXJ0SXRlbSAoaWQsIHF0eSkge1xyXG5cdGxldCBwcm9kdWN0cyA9IGdldENhcnQoKTtcclxuXHRsZXQgaW5kZXhUb1VwZGF0ZTtcclxuXHRwcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGluZGV4KSB7XHJcblx0XHRpZiAoaXRlbS5pZCA9PT0gaWQpIHtcclxuXHRcdFx0aW5kZXhUb1VwZGF0ZSA9IGluZGV4O1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdHByb2R1Y3RzW2luZGV4VG9VcGRhdGVdLnF0eSA9IHF0eTtcclxuXHRzZXRDYXJ0KHByb2R1Y3RzKTtcclxuXHRjb25zb2xlLmxvZyhkb2N1bWVudC5jb29raWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB1cGRhdGVDYXJ0VG90YWxzKCkge1xyXG5cdGxldCB0b3RhbFByaWNlID0gMDtcclxuXHQkKCcuZmMtaXRlbS10b3RhbCcpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0bGV0IHF0eSA9ICskKHRoaXMpLnBhcmVudHMoJy5mYy1jYXJ0LWl0ZW0nKS5maW5kKCcuZmMtY2FydC1xdHknKS5maXJzdCgpLnZhbCgpO1xyXG5cdFx0bGV0IHByaWNlID0gKyQodGhpcykuYXR0cignZGF0YS1pdGVtX3ByaWNlJyk7XHJcblx0XHQvLyBpdGVtIHRvdGFsXHJcblx0XHQkKHRoaXMpLmh0bWwocXR5ICogcHJpY2UpO1xyXG5cdFx0dG90YWxQcmljZSArPSArJCh0aGlzKS5odG1sKCk7XHJcblx0fSk7XHJcblx0bGV0IHNoaXBwaW5nUHJpY2UgPSArJCgnI2ZjLWNhcnQtc2hpcHBpbmcnKS5odG1sKCk7XHJcblx0Ly8gdG90YWxcclxuXHQkKCcjZmMtY2FydC10b3RhbCcpLmh0bWwodG90YWxQcmljZSk7XHJcblx0Ly8gdG90YWwgd2l0aCBzaGlwcGluZ1xyXG5cdCQoJyNmYy1jYXJ0LXRvdGFsLXdpdGgtc2hpcHBpbmcnKS5odG1sKHRvdGFsUHJpY2UgKyBzaGlwcGluZ1ByaWNlKTtcclxufVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cclxuXHRpZiAoZ2V0Q29va2llKCdjYXJ0JykgPT09IFwiXCIpIHtcclxuXHRcdHNldENhcnQoW10pO1xyXG5cdH1cclxuXHJcblx0Ly8gYWRkIHRvIGNhcnRcclxuXHQkKCcjYWRkLXRvLWNhcnQtYnRuJykuY2xpY2soZnVuY3Rpb24gKCkge1xyXG5cdFx0bGV0IHByb2R1Y3QgPSArJCh0aGlzKS5hdHRyKCdkYXRhLWl0ZW1faWQnKTtcclxuXHJcblx0XHRsZXQgb3B0X21hdGVyaWFsID0gKyQoJyNvcHRpb24tbWF0ZXJpYWwnKS52YWwoKTtcclxuXHRcdGxldCBvcHRfZnJhbWUgPSArJCgnI29wdGlvbi1mcmFtZScpLnZhbCgpO1xyXG5cdFx0bGV0IGlkID0gcHJvZHVjdCArICdfJyArIG9wdF9tYXRlcmlhbCArICdfJyArIG9wdF9mcmFtZTtcclxuXHJcblx0XHRsZXQgcXR5ID0gKyQoJyNjYXJ0LXByb2R1Y3QtcXR5JykudmFsKCk7XHJcblxyXG5cdFx0aWYgKE51bWJlci5pc0ludGVnZXIocXR5KSAmJiBxdHkgPiAwKSB7XHJcblx0XHRcdGFkZENhcnRJdGVtKGlkLCBwcm9kdWN0LCBxdHksIG9wdF9tYXRlcmlhbCwgb3B0X2ZyYW1lKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBjbGVhciBmb3JtXHJcblx0XHQkKCcjY2FydC1wcm9kdWN0LXF0eScpLnZhbCgnMScpO1xyXG5cclxuXHRcdHNob3dIZWFkZXJDYXJ0VG90YWxRdHkoKTtcclxuXHR9KTtcclxuXHJcblx0Ly8gcmVtb3ZlIGl0ZW1cclxuXHQkKCcuZmMtYnRuLXJlbW92ZScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuXHRcdGxldCBpZCA9ICQodGhpcykuYXR0cignZGF0YS1pdGVtX2lkJyk7XHJcblx0XHRyZW1vdmVDYXJ0SXRlbShpZCk7XHJcblx0XHQkKHRoaXMpLmNsb3Nlc3QoJy5mYy1jYXJ0LWl0ZW0nKS5yZW1vdmUoKTtcclxuXHRcdHVwZGF0ZUNhcnRUb3RhbHMoKTtcclxuXHRcdHNob3dIZWFkZXJDYXJ0VG90YWxRdHkoKTtcclxuXHR9KTtcclxuXHJcblx0Ly8gdXBkYXRlIGl0ZW0gcXR5XHJcblx0JCgnLmZjLWNhcnQtcXR5Jykua2V5dXAoZnVuY3Rpb24gKCkge1xyXG5cdFx0bGV0IGlkID0gJCh0aGlzKS5hdHRyKCdkYXRhLWl0ZW1faWQnKTtcclxuXHRcdGxldCBxdHkgPSArJCh0aGlzKS52YWwoKTtcclxuXHRcdGlmIChOdW1iZXIuaXNJbnRlZ2VyKHF0eSkgJiYgcXR5ID4gMCkge1xyXG5cdFx0XHR1cGRhdGVDYXJ0SXRlbShpZCwgcXR5KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdCQodGhpcykudmFsKDEpO1xyXG5cdFx0XHR1cGRhdGVDYXJ0SXRlbShpZCwgMSk7XHJcblx0XHR9XHJcblx0XHR1cGRhdGVDYXJ0VG90YWxzKCk7XHJcblx0XHRzaG93SGVhZGVyQ2FydFRvdGFsUXR5KCk7XHJcblx0fSk7XHJcblxyXG5cdGNvbnNvbGUubG9nKGRvY3VtZW50LmNvb2tpZSk7XHJcblx0dXBkYXRlQ2FydFRvdGFscygpO1xyXG5cdHNob3dIZWFkZXJDYXJ0VG90YWxRdHkoKTtcclxuXHJcbn0pO1xyXG5cclxuXHJcbiJdfQ==
