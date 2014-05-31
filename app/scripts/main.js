$(document).ready(function() {

	$('#appNotes-success').hide();
	$('#appNotes-error').hide();
	$('#notes').autosize();

	$('#notes').val('Write your notes here');

	$('#notes').focus(function(e) {
		if ( $(this).val() == 'Write your notes here' ) {
			$(this).val('');
		}
	});

	$('#notes').blur(function(e) {
		if ( $(this).val() == '' ) {
			$(this).val('Write your notes here');
		}
	});	

	$('#appNotes-email').hide();

	$('#appNotes-sendbtn').click(function(e) {

		e.preventDefault();

		//fade in email address field
		$(this).fadeOut({
			complete:function() {
				$('#appNotes-email').fadeIn();
				try {
					var savedEmail = localStorage.getItem('hcc-messageNotes-email');
					$('#email').val(savedEmail);
				} catch (e) {

				}			
			}
		});
	});

	$('#notesForm').submit(function(e) {

		e.preventDefault();

		//validate for email
		if ($('#email').val() == '') {
			//show error message
			$('input[name=email]').before('<p class="appNotes-emailError">Please enter your email</p>').fadeIn();
			return;
		} else {
			$('.appNotes-emailError').remove();
		}



		if (!$(this).hasClass('disabled') ) {

			$('#appNotes-notesSubmit').val('Sending...');
			$('#appNotes-notesSubmit').addClass('disabled');			

			var userNotes;

			if ($('#notes').val() == 'Write your notes here') {
				userNotesText = ''
			} else {
				userNotesText = $('#notes').val();
			}

			var formData = {
				staticNotes: $('#appNotes-staticNotes').html(),
				userNotes: userNotesText,
				userEmail:$('#email').val()
			}

			//send data to php file
			$.ajax({
				type:'POST',
				url:'lib/controller.php',
				data:formData,
				dataType:'json',
				success:notesComplete,
				error:notesError
			});

			//save email in localStorage to be used later
			try {
				localStorage.setItem('hcc-messageNotes-email', $('#email').val());
			} catch(e) {
			//this can fail silently, that's ok. It just means the user will have to enter their email in each time
			//if their device doesn't support local storage.

			}
		}

		//clear out notes
	});

	$(document).foundation();

});


function notesComplete(data,status,obj) {

	if (data[0].status == 'sent') {

		$('#appNotes-email').fadeOut({
			//reset the notes button
			complete:function() {
				window.scrollTo(0,0);
				$(this).find('#appNotes-notesSubmit').removeClass('disabled').val('Send');
				$('#notes').val('Write your notes here');
				$('#appNotes-success').fadeIn({
					duration:200,
					complete:function() {
						setTimeout(function() {
							$('#appNotes-success').fadeOut();
							$('#appNotes-sendbtn').fadeIn();
						},1200);					
					}
				});
			}
		});	
	} else {
		window.scrollTo(0,0);
		$('#appNotes-notesSubmit').removeClass('disabled').val('Send');
		$('#appNotes-error').fadeIn({
			duration:200,
			complete:function() {
				setTimeout(function() {
					$('#appNotes-error').fadeOut();
				},1200);					
			}
		});				
	}
}

function notesError(data,status,obj) {
	window.scrollTo(0,0);
	$('#appNotes-notesSubmit').removeClass('disabled').val('Send');
	$('#appNotes-error').fadeIn({
		duration:200,
		complete:function() {
			setTimeout(function() {
				$('#appNotes-error').fadeOut();
			},1200);					
		}
	});	
}