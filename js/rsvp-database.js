

function onSubmitButtonClicked() {
    
    console.log("chiedo: onSubmit");
    var firstName = firstNameInput.value;
    var lastName = lastNameInput.value;
    var email = emailInput.value;
    var message = messageInput.value;
    var numGuests = numGuestPicker.value;
    
    submitRsvp(firstName, lastName, email, message, numGuests);
}

function submitRsvp(firstName, lastName, email, message, numGuests) {
    // Disable inputs
    $(submitButton).button('loading');
    
    // A post entry.
    var postData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        message: message,
        numGuests: numGuests
    };
    
    // Assuming first/last name combo is unique are unique
    var userId = firstName + "_" + lastName;

    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates['/rsvps/' + userId] = postData;

    console.log("chiedo: userId=" + userId);
    return firebase.database().ref().update(updates, function(error) {
        if (error == null) {
            onRSVPSuccess();
        } else {
            onRSVPFailed();
        }
    });
}

function onRSVPSuccess() {
    formView.style.opacity = 0;
    rsvpSuccessView.style.visibility = "visible";
    rsvpSuccessView.style.opacity = 1.0;
}

function onRSVPFailed() {
    $(submitButton).button('reset');
}

// Dom elements
var firstNameInput = document.getElementById('firstNameInput');
var lastNameInput = document.getElementById('lastNameInput');
var emailInput = document.getElementById('emailInput');
var messageInput = document.getElementById('messageInput');
var numGuestPicker = document.getElementById('numGuestPicker');
var submitButton = document.getElementById('submitButton');
var formView = document.getElementById('formView');
var rsvpSuccessView = document.getElementById('rsvpSuccessView');

// Setup listeners
submitButton.addEventListener("click", onSubmitButtonClicked);

// Setup initial state
rsvpSuccessView.style.visibility = "hidden";
rsvpSuccessView.style.opacity = 0;