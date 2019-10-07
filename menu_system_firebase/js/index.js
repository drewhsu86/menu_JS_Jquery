// HOMEWORK INSTRUCTIONS: Build an editable order form for a restauraunt!
// 1. Add the correct config object to the bottom of the index.html file for this folder. You will be using your own firebase database as the backend for this homework.
// 2. Build an editable order form for a restauraunt
// 3. A user should be able to add a dish to the order with a description
// 4. The user should be able to read all the items in the order out onto the page

// BONUS
// 1. Can you make it so that the user is able to edit each description the items in their order
// 2. Can you make it so that the user is able to delete an item from the order!
// 3. Can you add a price to each order item?
// 4. Can you create a total for all the items in the order?
// 5. Can you allow the user to add an image to their order?
// 6. Can you make it so that if the user tries to update the input with nothing it wont submit and sends the user an error?

$(function() {

	// 50% chance to show object-chan or array-kun under the submit button (images)
	// only make this decision once on load

	let mascotImg = 'images/submitChan.png';

	let rng = Math.random();
	console.log(rng);

	if (rng > 0.5) {
		mascotImg = 'images/submitKun.png';
	}

	$('#submitMascot').html(`<img src="${mascotImg}" style="width:90%">`);

	console.log('loaded');
	//Connect to database
	var response = firebase.database();
	var data = response.ref('menu');
	var dataOrders = response.ref('orders');
	var username = '';
	var password = '';
	var order = [];
	var dummyImg = 'image/';    // an image to show if no image url was uploaded to the database
	var localMenu = {};        // store the menu every time the firebase menu is read
	var salesTax = 0.10;			// display and include sales tax because you can't avoid death or taxes
  let totalPrice = 0;


	// on load - run the html once to fill in everything
	// print our order to html
	let newOrder = uniqOrder(order);

	htmlOrder(newOrder);


	// jQuery Event Listeners

	//CREATE
	$('#addDish').on('click', function(event) {

		//make an object to push into firebase with all the info filled in
		if ($('#dish').val()) {  // only if the dish name is filled in
		var dish = {
			name: $('#dish').val(),
			desc: $('#description').val(),
			price: parseFloat($('#price').val() || 0)
		};
		}

		$('#dish').val('');
		$('#description').val('');
		$('#price').val('');

		data.push(dish);
	});

	// READ
	// Firebase Event Listener - kinda like an API call
	data.on('value', function(response) {

		// data = response.ref('menu') so calling this menu would make it less confusing
		var menu = response.val();

			// used for the password system
			username = menu.username;
			password = menu.userpw;
			console.log('firebase values changed');

		$('#menu').html('');
		localMenu = {};		// empty the local Menu in order to fill it up again

		// cycle through all the dishes stored in firebase
		for (key in menu) {


			// grab each dish from the menu referenced from firebase (each one being referred to at the moment)
				var dish = menu[key];
				localMenu[key] = dish;  // add each dish to the local menu so we can store it

				if (key === 'username' || key === 'userpw') {continue;} // i put the username and password in the menu ref in firebase
				// if statement will skip over that iteration of the loop if the data is 'username' or 'userpw'

				// Capitalize first letter of dish.name
				let firstLetter = dish.name.charAt(0).toUpperCase();
				let restLetter = dish.name.slice(1);
				dish.name = firstLetter + restLetter;
				console.log('onValue key:' + key);

				// html to make a card to display the current dish
				var template = `
                <div class="col-md-6">
                    <div class="card bg-light text-dark mb-2">
                        <div class="card-body">
													<img src="${dish.image || dummyImg}" style="width:75%; padding:5px">
                          <h4>  ${dish.name} </h4>
												  <h3> ${dish.desc} </h3>
												  <p> <i> $${parseFloat(dish.price).toFixed(2)} </i> </p>
                        </div>
                        <div class="card-footer">
												<hr>
                            Add to your order! <button data-key="${key}" class="btn btn-primary addToOrder float-right"><i class="fa fa-plus"></i></button>
                        </div>
                    </div>
                </div>
            `;

				// append the html to the menu element
				$('#menu').append(template);

	} // end of for keys in menu

	});

//Reading from local menu (not update)
$('#menu').on('click', '.addToOrder', function() {

		var key = $(this).data('key');

		// read the dish using the key from localMenu
		console.log(localMenu[key]);
		console.log('menu Button key' + key);

		// add an object with extra info to the order array
		// original object + num
		let dish = localMenu[key];
		dish.key = key;  // will keep this for generating minus button later

		// order is an array of objects
		order.push(dish);
		console.log(order);

		// print our order to html
		let newOrder = uniqOrder(order);

		htmlOrder(newOrder);

});

// addOrder, + sign button to add or remove
// instead of changing the objects' num, we will remove them from the order array
// we will do a for loop from the back to not disrupt the orders

// adding to the order using + button
$('#order').on('click', '.addOrder', function() {

	console.log('addOrder');
	// we saved each button's data key, as well as added the keys to the objects in order array
		var key = $(this).data('key');
		console.log(key);

		// starting this forloop from order.length-1, going back down to 0
		for (dishIndex = order.length-1; dishIndex >= 0; dishIndex --) {
			//if we find the dish, we push the same dish and then break the forloop
			console.log(order[dishIndex].key);

			if (key === order[dishIndex].key) {
				order.push(order[dishIndex]); // add the same dish to the order Array
				break;   // break from the for loop
			}

		}

		// print our order to html
		let newOrder = uniqOrder(order);

		htmlOrder(newOrder);

});

// subtract from order using - button
$('#order').on('click', '.subOrder', function() {

	console.log('subOrder');
	// we saved each button's data key, as well as added the keys to the objects in order array
		var key = $(this).data('key');
		console.log(key);

		// starting this forloop from order.length-1, going back down to 0
		for (dishIndex = order.length-1; dishIndex >= 0; dishIndex --) {
			//if we find the dish, we splice that indexed dish and then break the forloop
			console.log(order[dishIndex].key);

			if (key === order[dishIndex].key) {
				order.splice(dishIndex,1); // splice out just the one we found
				break;   // break from the for loop
			}

		}

		// print our order to html
		let newOrder = uniqOrder(order);

		htmlOrder(newOrder);

});

// submit order button currently doesn't send the order anywhere so it just alerts the user
$('#submitOrder').on('click', function () {

	console.log('order: '+order);
	if (order.length > 0) {
		// alert('Sorry! We are currently not accepting orders! \nPlease stay tuned for more info!');

		// go to firebase -> orders and add the following object
		submittedOrder = {

				totalPrice: totalPrice,
				date: formatDate(),
				order: uniqOrder(order)

		};

		dataOrders.push(submittedOrder);

		// go to submittal.html
		window.location.href = "submittal.html";

	}
})

// function to print orders to the right side background
// simple for loop with html, the input is the array of dishes (newOrder)
// newOrder has a DIFFERENT STRUCTURE THAN order!!! newOrder is an array of {num: 1, obj: dish}
function htmlOrder(newOrder) {

	$('#order').html(''); // reset html of order side


		totalPrice = 0;		// just making sure the price is zero if there are no dishes in the order


	for (dish of newOrder) {
		template = `

				<li class="list-group-item"> <h3> ${dish.obj.name}, <i> x${dish.num} </i>: $${(dish.num*dish.obj.price).toFixed(2)} </h3>

				<button data-key="${dish.obj.key}" class="btn btn-danger subOrder float-right"><i class="fa fa-minus"></i></button>

				<button data-key="${dish.obj.key}" class="btn btn-primary addOrder float-right"><i class="fa fa-plus"></i></button>

				</li>

		`;
		$('#order').append(template);

		//update price
		totalPrice += parseFloat(dish.num)*parseFloat(dish.obj.price);
	}  // end of for dish of newOrder loop

	// last element of the dish is the sum of prices

	template = `

			<li class="list-group-item-info" style="padding:10px">
			<h3> Sub-Total: $${parseFloat(totalPrice).toFixed(2)}  <br>
			 Sales Tax: $${parseFloat(totalPrice*salesTax).toFixed(2)} (${(salesTax*100).toFixed()}%) <br> <hr>
			 Total Price: $${parseFloat(totalPrice*(1+salesTax)).toFixed(2)} </h3>
			</li>

	`;


	$('#order').append(template);

	if (newOrder.length <= 0) {
		totalPrice = 0;		// just making sure the price is zero if there are no dishes in the order
	}

}

	// input: order (array of objects), output: newOrder (duplicates removed, num changed)
	function uniqOrder(order) {

		let output = []; // intended result
		let dupeFound = false;

		for (dish of order) {

				// basic idea is to start at the beginning of the array
				// compare the dish with all the dishes in the output array
				// if one matches, the dish in output gets dish.num++
				// else, simply add the dish to the output array

				for (outDish of output) {

						// if the name, description and price are the same, it should be close enough
						if (dish.key === outDish.obj.key) {
								outDish.num ++;  // found a duplicate so the number in the output array goes up
								dupeFound = true; // found a duplicate, so we won't add this dish later on
						}

				}

				// if no duplicates were found we should add this dish
				if (dupeFound === false) {
							output.push({

									// structure {num: 1, obj: dish}
									num: 1,
									obj: dish

							});
				}
				dupeFound = false; // resets dupeFound to false for the next dish in the loop
		}

		return output;

	}

	// parse date format to read as string
	function formatDate() {

		let d = new Date();
		console.log('Date: ' + d);

		var day = d.getDate();
		var month = d.getMonth() + 1;
		var year = d.getFullYear();

		var hours = d.getHours();
		var min = d.getMinutes();
		var sec = d.getSeconds();

		return `${hours}:${min}:${sec} - ${month}/${day}/${year}`;
	}

});
