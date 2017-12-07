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
		$('#city').parents('.form-group').removeClass('has-error');
		$('#choose-city-alert').hide();
		$('#country-field').hide();
	});

	$('#cdek').change(function () {
		if ($(this).val() === '?') {
			$('#city').parents('.form-group').addClass('has-error');
			$('#choose-city-alert').fadeIn();
		}
	});

	$('#abroad').change(function () {
		$('#country-field').fadeIn();
	});

	console.log(document.cookie);
	showShippingTotal($('.fc-shipping-method:checked').val());
	updateCartTotals();
	showHeaderCartTotalQty();
});


/**
 * автокомплит
 * подтягиваем список городов ajax`ом, данные jsonp в зависмости от введённых символов
 */
$(function() {
	$("#city").autocomplete({
		source : function(request, response) {
			$.ajax({
				url : "http://api.cdek.ru/city/getListByTerm/jsonp.php?callback=?",
				dataType : "jsonp",
				data : {
					q : function() {
						return $("#city").val()
					},
					name_startsWith : function() {
						return $("#city").val()
					}
				},
				success : function(data) {
					response($.map(data.geonames, function(item) {
						return {
							label : item.name,
							value : item.name,
							id : item.id,
							regionId : item.regionId,
							countryId : item.countryId
						}
					}));
				}
			});
		},
		minLength : 1,
		select : function(event, ui) {
			$('#city').attr('data-selected', 1);

			let currentCityId = +ui.item.id;
			let currentRegionId = +ui.item.regionId;
			let currentCountryId = +ui.item.countryId;

			let specialPriceRegions = [59, 6, 13, 55];
			const DEFAULT_PRICE = 250;
			const SPECIAL_PRICE = 700;
			const ABROAD_PRICE = 1000;

			let price;
			if (currentCountryId !== 1) {
				price = ABROAD_PRICE;
			} else if (specialPriceRegions.indexOf(currentRegionId) !== -1) {
				price = SPECIAL_PRICE;
			} else {
				price = DEFAULT_PRICE;
			}

			$('#cdekCityId').val(currentCityId);
			$('#cdek').val(price);

			if ($('#cdek:checked').length) {
				showShippingTotal(price);
				updateCartTotals();
			}

			$('#city').parents('.form-group').removeClass('has-error');
			$('#choose-city-alert').hide();
		}
	});

//		/**
//		 * ajax-запрос на сервер для получения информации по доставке
//		 */
//		$('#cdek').submit(function() {
//
//			var formData = form2js('cdek', '.', true, function(node) {
//				if(node.id && node.id.match(/callbackTest/)) {
//					return {
//						name : node.id,
//						value : node.innerHTML
//					};
//				}
//			});
//			var formDataJson = JSON.stringify(formData);
//			// console.log(JSON.stringify(formData));
//			document.getElementById('testArea').innerHTML = 'Отправляемые данные: <br />' + JSON.stringify(formData, null, '\t');
//
//			$.ajax({
//				url : 'http://api.cdek.ru/calculator/calculate_price_by_jsonp.php',
//				jsonp : 'callback',
//				data : {
//					"json" : formDataJson
//				},
//				type : 'GET',
//				dataType : "jsonp",
//				success : function(data) {
//					console.log(data);
//					if(data.hasOwnProperty("result")) {
//						document.getElementById('resArea').innerHTML = 'Цена доставки: ' + data.result.price + '<br />Срок доставки: ' + data.result.deliveryPeriodMin + ' - ' + data.result.deliveryPeriodMax + 'дн. ' + '<br />Планируемая дата доставки: c ' + data.result.deliveryDateMin + ' по ' + data.result.deliveryDateMax + '<br />id тарифа, по которому произведён расчёт: ' + data.result.tariffId + '<br />';
//						if(data.result.hasOwnProperty("cashOnDelivery")) {
//							document.getElementById('resArea').innerHTML = document.getElementById('resArea').innerHTML + 'Ограничение оплаты наличными, от (руб): ' + data.result.cashOnDelivery;
//						}
//					} else {
//						for(var key in data["error"]) {
//							// console.log(key);
//							// console.log(data["error"][key]);
//							document.getElementById('resArea').innerHTML = document.getElementById('resArea').innerHTML+'Код ошибки: ' + data["error"][key].code + '<br />Текст ошибки: ' + data["error"][key].text + '<br /><br />';
//						}
//					}
//				}
//			});
//			return false;
//		});


});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoic2NyaXB0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIHNldENvb2tpZShjbmFtZSwgY3ZhbHVlLCBleGRheXMpIHtcclxuXHRsZXQgZCA9IG5ldyBEYXRlKCk7XHJcblx0ZC5zZXRUaW1lKGQuZ2V0VGltZSgpICsgKGV4ZGF5cyoyNCo2MCo2MCoxMDAwKSk7XHJcblx0bGV0IGV4cGlyZXMgPSBcImV4cGlyZXM9XCIrIGQudG9VVENTdHJpbmcoKTtcclxuXHRkb2N1bWVudC5jb29raWUgPSBjbmFtZSArIFwiPVwiICsgY3ZhbHVlICsgXCI7XCIgKyBleHBpcmVzICsgXCI7cGF0aD0vXCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENvb2tpZShjbmFtZSkge1xyXG5cdGxldCBuYW1lID0gY25hbWUgKyBcIj1cIjtcclxuXHRsZXQgZGVjb2RlZENvb2tpZSA9IGRlY29kZVVSSUNvbXBvbmVudChkb2N1bWVudC5jb29raWUpO1xyXG5cdGxldCBjYSA9IGRlY29kZWRDb29raWUuc3BsaXQoJzsnKTtcclxuXHRmb3IobGV0IGkgPSAwOyBpIDxjYS5sZW5ndGg7IGkrKykge1xyXG5cdFx0bGV0IGMgPSBjYVtpXTtcclxuXHRcdHdoaWxlIChjLmNoYXJBdCgwKSA9PT0gJyAnKSB7XHJcblx0XHRcdGMgPSBjLnN1YnN0cmluZygxKTtcclxuXHRcdH1cclxuXHRcdGlmIChjLmluZGV4T2YobmFtZSkgPT09IDApIHtcclxuXHRcdFx0cmV0dXJuIGMuc3Vic3RyaW5nKG5hbWUubGVuZ3RoLCBjLmxlbmd0aCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBcIlwiO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzZXRDYXJ0KGN2YWx1ZSkge1xyXG5cdHNldENvb2tpZSgnY2FydCcsIEpTT04uc3RyaW5naWZ5KGN2YWx1ZSkpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDYXJ0KCkge1xyXG5cdHJldHVybiBKU09OLnBhcnNlKGdldENvb2tpZSgnY2FydCcpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlQ2FydEl0ZW0gKGlkKSB7XHJcblx0bGV0IHByb2R1Y3RzID0gZ2V0Q2FydCgpO1xyXG5cdGxldCBpbmRleFRvVXBkYXRlO1xyXG5cdHByb2R1Y3RzLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaW5kZXgpIHtcclxuXHRcdGlmIChpdGVtLmlkID09PSBpZCkge1xyXG5cdFx0XHRpbmRleFRvVXBkYXRlID0gaW5kZXg7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0cHJvZHVjdHMuc3BsaWNlKGluZGV4VG9VcGRhdGUsIDEpO1xyXG5cdHNldENhcnQocHJvZHVjdHMpO1xyXG5cdGlmIChwcm9kdWN0cy5sZW5ndGggPT09IDApIHtcclxuXHRcdCQoJyNmYy1jYXJ0JykuZW1wdHkoKTtcclxuXHRcdCQoJyNmYy1jYXJ0LWVtcHR5Jykuc2hvdygpO1xyXG5cdH1cclxuXHRjb25zb2xlLmxvZyhkb2N1bWVudC5jb29raWUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDYXJ0VG90YWxRdHkgKCkge1xyXG5cdGlmIChnZXRDb29raWUoXCJjYXJ0XCIpICE9PSBcIlwiKSB7XHJcblx0XHRsZXQgcHJvZHVjdHMgPSBnZXRDYXJ0KCk7XHJcblx0XHRsZXQgdG90YWxRdHkgPSAwO1xyXG5cdFx0cHJvZHVjdHMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XHJcblx0XHRcdHRvdGFsUXR5ICs9IGl0ZW0ucXR5O1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gdG90YWxRdHk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHJldHVybiAwO1xyXG5cdH1cclxufVxyXG5cclxuZnVuY3Rpb24gc2hvd0hlYWRlckNhcnRUb3RhbFF0eSAoKSB7XHJcblx0JCgnI2NhcnQtdG90YWwtcXR5JykuaHRtbChnZXRDYXJ0VG90YWxRdHkoKSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZENhcnRJdGVtIChpZCwgcHJvZHVjdCwgcXR5LCBvcHRpb25zKSB7XHJcblx0bGV0IHByb2R1Y3RzID0gZ2V0Q2FydCgpO1xyXG5cdGxldCBleGlzdHNJbkNhcnQgPSBmYWxzZTtcclxuXHRwcm9kdWN0cy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdGlmIChpdGVtLmlkID09PSBpZCkge1xyXG5cdFx0XHRpdGVtLnF0eSArPSBxdHk7XHJcblx0XHRcdGV4aXN0c0luQ2FydCA9IHRydWU7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0aWYgKCFleGlzdHNJbkNhcnQpIHtcclxuXHRcdHByb2R1Y3RzLnB1c2goe1xyXG5cdFx0XHRpZDogaWQsXHJcblx0XHRcdHByb2R1Y3Q6IHByb2R1Y3QsXHJcblx0XHRcdHF0eTogcXR5LFxyXG5cdFx0XHRvcHRpb25zOiBvcHRpb25zXHJcblx0XHR9KTtcclxuXHR9XHJcblx0c2V0Q2FydChwcm9kdWN0cyk7XHJcblx0Y29uc29sZS5sb2coZG9jdW1lbnQuY29va2llKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQ2FydEl0ZW0gKGlkLCBxdHkpIHtcclxuXHRsZXQgcHJvZHVjdHMgPSBnZXRDYXJ0KCk7XHJcblx0bGV0IGluZGV4VG9VcGRhdGU7XHJcblx0cHJvZHVjdHMuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xyXG5cdFx0aWYgKGl0ZW0uaWQgPT09IGlkKSB7XHJcblx0XHRcdGluZGV4VG9VcGRhdGUgPSBpbmRleDtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRwcm9kdWN0c1tpbmRleFRvVXBkYXRlXS5xdHkgPSBxdHk7XHJcblx0c2V0Q2FydChwcm9kdWN0cyk7XHJcblx0Y29uc29sZS5sb2coZG9jdW1lbnQuY29va2llKTtcclxufVxyXG5cclxuZnVuY3Rpb24gdXBkYXRlQ2FydFRvdGFscygpIHtcclxuXHRsZXQgdG90YWxQcmljZSA9IDA7XHJcblx0JCgnLmZjLWl0ZW0tdG90YWwnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHRcdGxldCBxdHkgPSArJCh0aGlzKS5wYXJlbnRzKCcuZmMtY2FydC1pdGVtJykuZmluZCgnLmZjLWNhcnQtcXR5JykuZmlyc3QoKS52YWwoKTtcclxuXHRcdGxldCBwcmljZSA9ICskKHRoaXMpLmF0dHIoJ2RhdGEtaXRlbV9wcmljZScpO1xyXG5cdFx0Ly8gaXRlbSB0b3RhbFxyXG5cdFx0JCh0aGlzKS5odG1sKHF0eSAqIHByaWNlKTtcclxuXHRcdHRvdGFsUHJpY2UgKz0gKyQodGhpcykuaHRtbCgpO1xyXG5cdH0pO1xyXG5cdGxldCBzaGlwcGluZ1ByaWNlID0gKyQoJyNmYy1jYXJ0LXNoaXBwaW5nJykuaHRtbCgpO1xyXG5cdC8vIHRvdGFsXHJcblx0JCgnI2ZjLWNhcnQtdG90YWwnKS5odG1sKHRvdGFsUHJpY2UpO1xyXG5cclxuXHQvLyB0b3RhbCB3aXRoIHNoaXBwaW5nXHJcblx0JCgnI2ZjLWNhcnQtdG90YWwtd2l0aC1zaGlwcGluZycpLmh0bWwodG90YWxQcmljZSArIHNoaXBwaW5nUHJpY2UpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzaG93U2hpcHBpbmdUb3RhbCh2YWwpIHtcclxuXHQkKCcjZmMtY2FydC1zaGlwcGluZycpLmh0bWwodmFsKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2Nyb2xsVG9wKCkge1xyXG5cdCQoJ2JvZHksIGh0bWwnKS5hbmltYXRlKHtzY3JvbGxUb3A6IDB9LCAzMDApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzY3JvbGxUb0FkZEZyb20oKSB7XHJcblx0JCgnaHRtbCwgYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6ICQoJyNmYy1zY3JvbGwnKS5vZmZzZXQoKS50b3AgfSwgNTAwKTtcclxufVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xyXG5cdGlmIChnZXRDb29raWUoJ2NhcnQnKSA9PT0gXCJcIikge1xyXG5cdFx0c2V0Q2FydChbXSk7XHJcblx0fVxyXG5cclxuXHRsZXQgb3B0aW9uc0FsZXJ0ID0gJCgnI3Byb2R1Y3QtYWRkLW9wdGlvbnMtYWxlcnQnKTtcclxuXHRsZXQgYWxlcnRTdWNjZXNzID0gJCgnI3Byb2R1Y3QtYWRkLWFsZXJ0LXN1Y2Nlc3MnKTtcclxuXHJcblx0aWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoID09PSAnI2FkZHRvY2FydCcpIHtcclxuXHRcdCQoJy5mYy1jYXJ0LW9wdGlvbicpLmVhY2goZnVuY3Rpb24gKCkge1xyXG5cdFx0XHQkKHRoaXMpLmNsb3Nlc3QoJy5mb3JtLWdyb3VwJykuYWRkQ2xhc3MoJ2hhcy1lcnJvcicpO1xyXG5cdFx0XHRvcHRpb25zQWxlcnQuc2hvdygpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvLyBhZGQgdG8gY2FydFxyXG5cdCQoJyNhZGQtdG8tY2FydC1idG4nKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRvcHRpb25zQWxlcnQuaGlkZSgpO1xyXG5cdFx0YWxlcnRTdWNjZXNzLmhpZGUoKTtcclxuXHRcdCQoJy5mb3JtLWdyb3VwJykucmVtb3ZlQ2xhc3MoJ2hhcy1lcnJvcicpO1xyXG5cclxuXHJcblx0XHRsZXQgZW1wdHlPcHRpb25zID0gJCgnLmZjLWNhcnQtb3B0aW9uIG9wdGlvbjpzZWxlY3RlZFt2YWx1ZT0wXScpO1xyXG5cdFx0aWYgKGVtcHR5T3B0aW9ucy5sZW5ndGggPiAwKSB7XHJcblx0XHRcdGVtcHR5T3B0aW9ucy5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHQkKHRoaXMpLmNsb3Nlc3QoJy5mb3JtLWdyb3VwJykuYWRkQ2xhc3MoJ2hhcy1lcnJvcicpO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0b3B0aW9uc0FsZXJ0LmZhZGVJbigxMDAwKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRsZXQgcHJvZHVjdCA9ICskKHRoaXMpLmF0dHIoJ2RhdGEtaXRlbV9pZCcpO1xyXG5cdFx0bGV0IHF0eSA9ICskKCcjY2FydC1wcm9kdWN0LXF0eScpLnZhbCgpO1xyXG5cclxuXHRcdC8vIGNoZWNrIG9wdGlvbnNcclxuXHRcdGxldCBvcHRpb25zID0ge307XHJcblxyXG5cdFx0JCgnLmZjLWNhcnQtb3B0aW9uJykuZWFjaChmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGxldCBuYW1lID0gJCh0aGlzKS5hdHRyKCdkYXRhLW9wdGlvbl9pZCcpO1xyXG5cdFx0XHRvcHRpb25zW25hbWVdID0gKyQodGhpcykudmFsKCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRsZXQgaWQgPSBwcm9kdWN0O1xyXG5cdFx0Zm9yIChsZXQga2V5IGluIG9wdGlvbnMpIHtcclxuXHRcdFx0aWQgKz0gKCdfJyArIG9wdGlvbnNba2V5XSk7XHJcblx0XHR9XHJcblx0XHRpZiAoTnVtYmVyLmlzSW50ZWdlcihxdHkpICYmIHF0eSA+IDApIHtcclxuXHRcdFx0YWRkQ2FydEl0ZW0oaWQsIHByb2R1Y3QsIHF0eSwgb3B0aW9ucyk7XHJcblx0XHRcdGFsZXJ0U3VjY2Vzcy5mYWRlSW4oMTAwMCk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gY2xlYXIgYWRkIGZvcm1cclxuXHRcdCQoJyNjYXJ0LXByb2R1Y3QtcXR5JykudmFsKCcxJyk7XHJcblx0XHRzaG93SGVhZGVyQ2FydFRvdGFsUXR5KCk7XHJcblx0fSk7XHJcblxyXG5cdC8vIHJlbW92ZSBpdGVtXHJcblx0JCgnLmZjLWJ0bi1yZW1vdmUnKS5jbGljayhmdW5jdGlvbiAoKSB7XHJcblx0XHRsZXQgaWQgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtaXRlbV9pZCcpO1xyXG5cdFx0cmVtb3ZlQ2FydEl0ZW0oaWQpO1xyXG5cdFx0JCh0aGlzKS5jbG9zZXN0KCcuZmMtY2FydC1pdGVtJykucmVtb3ZlKCk7XHJcblx0XHR1cGRhdGVDYXJ0VG90YWxzKCk7XHJcblx0XHRzaG93SGVhZGVyQ2FydFRvdGFsUXR5KCk7XHJcblx0fSk7XHJcblxyXG5cdC8vIHVwZGF0ZSBpdGVtIHF0eVxyXG5cdCQoJy5mYy1jYXJ0LXF0eScpLmtleXVwKGZ1bmN0aW9uICgpIHtcclxuXHRcdGxldCBpZCA9ICQodGhpcykuYXR0cignZGF0YS1pdGVtX2lkJyk7XHJcblx0XHRsZXQgcXR5ID0gKyQodGhpcykudmFsKCk7XHJcblx0XHRpZiAoTnVtYmVyLmlzSW50ZWdlcihxdHkpICYmIHF0eSA+IDApIHtcclxuXHRcdFx0dXBkYXRlQ2FydEl0ZW0oaWQsIHF0eSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKHRoaXMpLnZhbCgxKTtcclxuXHRcdFx0dXBkYXRlQ2FydEl0ZW0oaWQsIDEpO1xyXG5cdFx0fVxyXG5cdFx0dXBkYXRlQ2FydFRvdGFscygpO1xyXG5cdFx0c2hvd0hlYWRlckNhcnRUb3RhbFF0eSgpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcuZmMtc2hpcHBpbmctbWV0aG9kJykuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuXHRcdHNob3dTaGlwcGluZ1RvdGFsKCQodGhpcykudmFsKCkpO1xyXG5cdFx0dXBkYXRlQ2FydFRvdGFscygpO1xyXG5cdFx0JCgnI2NpdHknKS5wYXJlbnRzKCcuZm9ybS1ncm91cCcpLnJlbW92ZUNsYXNzKCdoYXMtZXJyb3InKTtcclxuXHRcdCQoJyNjaG9vc2UtY2l0eS1hbGVydCcpLmhpZGUoKTtcclxuXHRcdCQoJyNjb3VudHJ5LWZpZWxkJykuaGlkZSgpO1xyXG5cdH0pO1xyXG5cclxuXHQkKCcjY2RlaycpLmNoYW5nZShmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAoJCh0aGlzKS52YWwoKSA9PT0gJz8nKSB7XHJcblx0XHRcdCQoJyNjaXR5JykucGFyZW50cygnLmZvcm0tZ3JvdXAnKS5hZGRDbGFzcygnaGFzLWVycm9yJyk7XHJcblx0XHRcdCQoJyNjaG9vc2UtY2l0eS1hbGVydCcpLmZhZGVJbigpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKCcjYWJyb2FkJykuY2hhbmdlKGZ1bmN0aW9uICgpIHtcclxuXHRcdCQoJyNjb3VudHJ5LWZpZWxkJykuZmFkZUluKCk7XHJcblx0fSk7XHJcblxyXG5cdGNvbnNvbGUubG9nKGRvY3VtZW50LmNvb2tpZSk7XHJcblx0c2hvd1NoaXBwaW5nVG90YWwoJCgnLmZjLXNoaXBwaW5nLW1ldGhvZDpjaGVja2VkJykudmFsKCkpO1xyXG5cdHVwZGF0ZUNhcnRUb3RhbHMoKTtcclxuXHRzaG93SGVhZGVyQ2FydFRvdGFsUXR5KCk7XHJcbn0pO1xyXG5cclxuXHJcbi8qKlxyXG4gKiDQsNCy0YLQvtC60L7QvNC/0LvQuNGCXHJcbiAqINC/0L7QtNGC0Y/Qs9C40LLQsNC10Lwg0YHQv9C40YHQvtC6INCz0L7RgNC+0LTQvtCyIGFqYXhg0L7QvCwg0LTQsNC90L3Ri9C1IGpzb25wINCyINC30LDQstC40YHQvNC+0YHRgtC4INC+0YIg0LLQstC10LTRkdC90L3Ri9GFINGB0LjQvNCy0L7Qu9C+0LJcclxuICovXHJcbiQoZnVuY3Rpb24oKSB7XHJcblx0JChcIiNjaXR5XCIpLmF1dG9jb21wbGV0ZSh7XHJcblx0XHRzb3VyY2UgOiBmdW5jdGlvbihyZXF1ZXN0LCByZXNwb25zZSkge1xyXG5cdFx0XHQkLmFqYXgoe1xyXG5cdFx0XHRcdHVybCA6IFwiaHR0cDovL2FwaS5jZGVrLnJ1L2NpdHkvZ2V0TGlzdEJ5VGVybS9qc29ucC5waHA/Y2FsbGJhY2s9P1wiLFxyXG5cdFx0XHRcdGRhdGFUeXBlIDogXCJqc29ucFwiLFxyXG5cdFx0XHRcdGRhdGEgOiB7XHJcblx0XHRcdFx0XHRxIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiAkKFwiI2NpdHlcIikudmFsKClcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRuYW1lX3N0YXJ0c1dpdGggOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuICQoXCIjY2l0eVwiKS52YWwoKVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sXHJcblx0XHRcdFx0c3VjY2VzcyA6IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0XHRcdHJlc3BvbnNlKCQubWFwKGRhdGEuZ2VvbmFtZXMsIGZ1bmN0aW9uKGl0ZW0pIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRcdFx0XHRsYWJlbCA6IGl0ZW0ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZSA6IGl0ZW0ubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRpZCA6IGl0ZW0uaWQsXHJcblx0XHRcdFx0XHRcdFx0cmVnaW9uSWQgOiBpdGVtLnJlZ2lvbklkLFxyXG5cdFx0XHRcdFx0XHRcdGNvdW50cnlJZCA6IGl0ZW0uY291bnRyeUlkXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHRcdG1pbkxlbmd0aCA6IDEsXHJcblx0XHRzZWxlY3QgOiBmdW5jdGlvbihldmVudCwgdWkpIHtcclxuXHRcdFx0JCgnI2NpdHknKS5hdHRyKCdkYXRhLXNlbGVjdGVkJywgMSk7XHJcblxyXG5cdFx0XHRsZXQgY3VycmVudENpdHlJZCA9ICt1aS5pdGVtLmlkO1xyXG5cdFx0XHRsZXQgY3VycmVudFJlZ2lvbklkID0gK3VpLml0ZW0ucmVnaW9uSWQ7XHJcblx0XHRcdGxldCBjdXJyZW50Q291bnRyeUlkID0gK3VpLml0ZW0uY291bnRyeUlkO1xyXG5cclxuXHRcdFx0bGV0IHNwZWNpYWxQcmljZVJlZ2lvbnMgPSBbNTksIDYsIDEzLCA1NV07XHJcblx0XHRcdGNvbnN0IERFRkFVTFRfUFJJQ0UgPSAyNTA7XHJcblx0XHRcdGNvbnN0IFNQRUNJQUxfUFJJQ0UgPSA3MDA7XHJcblx0XHRcdGNvbnN0IEFCUk9BRF9QUklDRSA9IDEwMDA7XHJcblxyXG5cdFx0XHRsZXQgcHJpY2U7XHJcblx0XHRcdGlmIChjdXJyZW50Q291bnRyeUlkICE9PSAxKSB7XHJcblx0XHRcdFx0cHJpY2UgPSBBQlJPQURfUFJJQ0U7XHJcblx0XHRcdH0gZWxzZSBpZiAoc3BlY2lhbFByaWNlUmVnaW9ucy5pbmRleE9mKGN1cnJlbnRSZWdpb25JZCkgIT09IC0xKSB7XHJcblx0XHRcdFx0cHJpY2UgPSBTUEVDSUFMX1BSSUNFO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHByaWNlID0gREVGQVVMVF9QUklDRTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0JCgnI2NkZWtDaXR5SWQnKS52YWwoY3VycmVudENpdHlJZCk7XHJcblx0XHRcdCQoJyNjZGVrJykudmFsKHByaWNlKTtcclxuXHJcblx0XHRcdGlmICgkKCcjY2RlazpjaGVja2VkJykubGVuZ3RoKSB7XHJcblx0XHRcdFx0c2hvd1NoaXBwaW5nVG90YWwocHJpY2UpO1xyXG5cdFx0XHRcdHVwZGF0ZUNhcnRUb3RhbHMoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0JCgnI2NpdHknKS5wYXJlbnRzKCcuZm9ybS1ncm91cCcpLnJlbW92ZUNsYXNzKCdoYXMtZXJyb3InKTtcclxuXHRcdFx0JCgnI2Nob29zZS1jaXR5LWFsZXJ0JykuaGlkZSgpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuLy9cdFx0LyoqXHJcbi8vXHRcdCAqIGFqYXgt0LfQsNC/0YDQvtGBINC90LAg0YHQtdGA0LLQtdGAINC00LvRjyDQv9C+0LvRg9GH0LXQvdC40Y8g0LjQvdGE0L7RgNC80LDRhtC40Lgg0L/QviDQtNC+0YHRgtCw0LLQutC1XHJcbi8vXHRcdCAqL1xyXG4vL1x0XHQkKCcjY2RlaycpLnN1Ym1pdChmdW5jdGlvbigpIHtcclxuLy9cclxuLy9cdFx0XHR2YXIgZm9ybURhdGEgPSBmb3JtMmpzKCdjZGVrJywgJy4nLCB0cnVlLCBmdW5jdGlvbihub2RlKSB7XHJcbi8vXHRcdFx0XHRpZihub2RlLmlkICYmIG5vZGUuaWQubWF0Y2goL2NhbGxiYWNrVGVzdC8pKSB7XHJcbi8vXHRcdFx0XHRcdHJldHVybiB7XHJcbi8vXHRcdFx0XHRcdFx0bmFtZSA6IG5vZGUuaWQsXHJcbi8vXHRcdFx0XHRcdFx0dmFsdWUgOiBub2RlLmlubmVySFRNTFxyXG4vL1x0XHRcdFx0XHR9O1xyXG4vL1x0XHRcdFx0fVxyXG4vL1x0XHRcdH0pO1xyXG4vL1x0XHRcdHZhciBmb3JtRGF0YUpzb24gPSBKU09OLnN0cmluZ2lmeShmb3JtRGF0YSk7XHJcbi8vXHRcdFx0Ly8gY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoZm9ybURhdGEpKTtcclxuLy9cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVzdEFyZWEnKS5pbm5lckhUTUwgPSAn0J7RgtC/0YDQsNCy0LvRj9C10LzRi9C1INC00LDQvdC90YvQtTogPGJyIC8+JyArIEpTT04uc3RyaW5naWZ5KGZvcm1EYXRhLCBudWxsLCAnXFx0Jyk7XHJcbi8vXHJcbi8vXHRcdFx0JC5hamF4KHtcclxuLy9cdFx0XHRcdHVybCA6ICdodHRwOi8vYXBpLmNkZWsucnUvY2FsY3VsYXRvci9jYWxjdWxhdGVfcHJpY2VfYnlfanNvbnAucGhwJyxcclxuLy9cdFx0XHRcdGpzb25wIDogJ2NhbGxiYWNrJyxcclxuLy9cdFx0XHRcdGRhdGEgOiB7XHJcbi8vXHRcdFx0XHRcdFwianNvblwiIDogZm9ybURhdGFKc29uXHJcbi8vXHRcdFx0XHR9LFxyXG4vL1x0XHRcdFx0dHlwZSA6ICdHRVQnLFxyXG4vL1x0XHRcdFx0ZGF0YVR5cGUgOiBcImpzb25wXCIsXHJcbi8vXHRcdFx0XHRzdWNjZXNzIDogZnVuY3Rpb24oZGF0YSkge1xyXG4vL1x0XHRcdFx0XHRjb25zb2xlLmxvZyhkYXRhKTtcclxuLy9cdFx0XHRcdFx0aWYoZGF0YS5oYXNPd25Qcm9wZXJ0eShcInJlc3VsdFwiKSkge1xyXG4vL1x0XHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNBcmVhJykuaW5uZXJIVE1MID0gJ9Cm0LXQvdCwINC00L7RgdGC0LDQstC60Lg6ICcgKyBkYXRhLnJlc3VsdC5wcmljZSArICc8YnIgLz7QodGA0L7QuiDQtNC+0YHRgtCw0LLQutC4OiAnICsgZGF0YS5yZXN1bHQuZGVsaXZlcnlQZXJpb2RNaW4gKyAnIC0gJyArIGRhdGEucmVzdWx0LmRlbGl2ZXJ5UGVyaW9kTWF4ICsgJ9C00L0uICcgKyAnPGJyIC8+0J/Qu9Cw0L3QuNGA0YPQtdC80LDRjyDQtNCw0YLQsCDQtNC+0YHRgtCw0LLQutC4OiBjICcgKyBkYXRhLnJlc3VsdC5kZWxpdmVyeURhdGVNaW4gKyAnINC/0L4gJyArIGRhdGEucmVzdWx0LmRlbGl2ZXJ5RGF0ZU1heCArICc8YnIgLz5pZCDRgtCw0YDQuNGE0LAsINC/0L4g0LrQvtGC0L7RgNC+0LzRgyDQv9GA0L7QuNC30LLQtdC00ZHQvSDRgNCw0YHRh9GR0YI6ICcgKyBkYXRhLnJlc3VsdC50YXJpZmZJZCArICc8YnIgLz4nO1xyXG4vL1x0XHRcdFx0XHRcdGlmKGRhdGEucmVzdWx0Lmhhc093blByb3BlcnR5KFwiY2FzaE9uRGVsaXZlcnlcIikpIHtcclxuLy9cdFx0XHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNBcmVhJykuaW5uZXJIVE1MID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc0FyZWEnKS5pbm5lckhUTUwgKyAn0J7Qs9GA0LDQvdC40YfQtdC90LjQtSDQvtC/0LvQsNGC0Ysg0L3QsNC70LjRh9C90YvQvNC4LCDQvtGCICjRgNGD0LEpOiAnICsgZGF0YS5yZXN1bHQuY2FzaE9uRGVsaXZlcnk7XHJcbi8vXHRcdFx0XHRcdFx0fVxyXG4vL1x0XHRcdFx0XHR9IGVsc2Uge1xyXG4vL1x0XHRcdFx0XHRcdGZvcih2YXIga2V5IGluIGRhdGFbXCJlcnJvclwiXSkge1xyXG4vL1x0XHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coa2V5KTtcclxuLy9cdFx0XHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKGRhdGFbXCJlcnJvclwiXVtrZXldKTtcclxuLy9cdFx0XHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXNBcmVhJykuaW5uZXJIVE1MID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc0FyZWEnKS5pbm5lckhUTUwrJ9Ca0L7QtCDQvtGI0LjQsdC60Lg6ICcgKyBkYXRhW1wiZXJyb3JcIl1ba2V5XS5jb2RlICsgJzxiciAvPtCi0LXQutGB0YIg0L7RiNC40LHQutC4OiAnICsgZGF0YVtcImVycm9yXCJdW2tleV0udGV4dCArICc8YnIgLz48YnIgLz4nO1xyXG4vL1x0XHRcdFx0XHRcdH1cclxuLy9cdFx0XHRcdFx0fVxyXG4vL1x0XHRcdFx0fVxyXG4vL1x0XHRcdH0pO1xyXG4vL1x0XHRcdHJldHVybiBmYWxzZTtcclxuLy9cdFx0fSk7XHJcblxyXG5cclxufSk7Il19
