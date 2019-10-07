// the only purpose of this javascript is to make the "Processing..." text animated
$(function() {

		const delay = 1000; //in milliseconds
		const maxTimes = 3;
		let times = 3;


		let timer = setInterval(function () {

			if (times >= maxTimes) {
				$('#processing').html('Processing.');
				times = 1;
			} else {
				$('#processing').append('.');
				times ++;
			}

		}, delay);

});
