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