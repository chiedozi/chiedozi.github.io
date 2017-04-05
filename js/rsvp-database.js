

function onSubmitButtonClicked() {
    if (!validateForm()) {
        return;
    }
    
    submitRsvp();
}

function submitRsvp() {
    // Disable inputs
    $(submitButton).button('loading');
    
    // A post entry.
    var postData = generatePostData();
    
    // Assuming first/last name combo is unique are unique
    var userId = (postData.firstName.replace(/\s+/g, "_") + "_" + postData.lastName.replace(/\s+/g, "_")).toLowerCase();

    // Write the new post's data simultaneously in the posts list and the user's post list.
    return firebase.database().ref('/rsvps/' + userId).set(postData, function(error) {
        if (error == null) {
            onRSVPSuccess(postData);
        } else {
            onRSVPFailed();
        }
    });
}

function generatePostData() {
    var firstName = firstNameInput.value;
    var lastName = lastNameInput.value;
    var message = messageInput.value;
    var email = null;
    var numGuests = 0;
    var guestNames = null;
    
    var postData = {
        firstName: firstName,
        lastName: lastName,
        message: message,
        isAttending: isAttendingSelected(),
    };
    
    if (isAttendingSelected()) {
        postData.numGuests = numGuestPicker.value;
        postData.guests = getGuestNames();
        postData.email = emailInput.value;
    }
    
    postData.createdAt = Date.now();
    
    return postData;
}

function onRSVPSuccess(data) {
    if (data.isAttending == true) {
        rsvpText.textContent = "Thank you for rsvping!  We will see you in August!";
    } else {
        rsvpText.textContent = "We're sorry we won't see you this summer.  Thanks for letting us know."
    }
    
    formView.style.opacity = 0;
    rsvpSuccessView.style.display = "block";
    rsvpSuccessView.style.visibility = "visible";
    rsvpSuccessView.style.opacity = 1.0;
    $("#rsvpText").goTo();
}

function onRSVPFailed() {
    $(submitButton).button('reset');
}

function onGuestPickerChanged() {
    var numGuests = numGuestPicker.value;
    var container = $("#guestInputsContainer");
    
    // Save the current guest names
    var guestNames = getGuestNames();
    
    // Empty the container
    container.empty();
    
    for (var i = 0; i < numGuests; i++) {
        var guestNum = i + 1;
        var firstName = null;
        var lastName = null;
        
        if (i < guestNames.length) {
            firstName = guestNames[i].firstName;
            lastName = guestNames[i].lastName;
        }
        
        container.append($("<div id='guest" + guestNum + "Container' class='form-group'>").append(
            createGuestLabelString(guestNum),
            createNameInput(guestNum, true, firstName),
            createNameInput(guestNum, false, lastName)
        ));
    }
}

function createGuestLabelString(guestNumber) {
    return "<label class='control-label col-xs-12' for='guest" + guestNumber + "NameInput'>Guest " + guestNumber + "</label>";
}

function createNameInput(guestNumber, firstName, str) {
    var namePrefix = firstName == true ? "First" : "Last";
    var inputClass = firstName == true ? "firstNameInput" : "lastNameInput"
    var nameHolder = firstName == true ? "firstNameHolder" : "lastNameHolder"
    var placeholderString = namePrefix + " Name";
    var inputId = "guest" + guestNumber + namePrefix + "NameInput";
    
    if (str === null) {
        str = "";
    }
    
    return $("<div class='col-xs-6 " + nameHolder + "'>").append("<input type='text' class='form-control " + inputClass + "' id='" + inputId + "' placeholder='" + placeholderString + "' value='" + str + "'/>")
}

function getGuestNames() {
    var container = $("#guestInputsContainer");
    var i = 1;
    var names = [];
    
    while (true) {
        var firstNameInput = document.querySelector("#guest" + i + "FirstNameInput");
        var lastNameInput = document.querySelector("#guest" + i + "LastNameInput");
      
        // 20 is to protect against infinite loop
        if (firstNameInput === null || lastNameInput === null || i > 20) {
            break;
        }
        
        names.push({"firstName": firstNameInput.value, "lastName": lastNameInput.value})
        i++;
    }
    
    return names;
}

function validateForm() {
    var isValid = true;
    
    isValid = validateTextInput(firstNameInput) && isValid;
    isValid = validateTextInput(lastNameInput) && isValid;
    isValid = validateRadioButtons() && isValid;
    
    // Validate guests
    var numGuests = numGuestPicker.value;
    for (var i = 1; i <= numGuests; i++) {
        var guestNum = i + 1;
        var guestFirstNameInput = document.querySelector("#guest" + i + "FirstNameInput");
        var guestLastNameInput = document.querySelector("#guest" + i + "LastNameInput");
        
        isValid = validateTextInput(guestFirstNameInput) && isValid;
        isValid = validateTextInput(guestLastNameInput) && isValid;
    }
    
//    if (isAttendingSelected()) {
//        isValid = validateEmailField(emailInput) && isValid;   
//    }
    
    errorContainer.style.opacity = isValid == true ? 0 : 1;
    return isValid;
}

function validateTextInput(textInput) {
    var textValue = textInput.value;
    if (textValue == null || textValue.length == 0) {
        textInput.parentNode.classList.add("has-error");
        console.log("add listener");
        textInput.addEventListener("input", checkTextInput);
        return false;
    }
    
    textInput.parentNode.classList.remove("has-error");
    textInput.removeEventListener("input", checkTextInput);
    return true;
}

function checkTextInput(event) {
    validateTextInput(event.target);
}

function validateEmailField(textInput) {
    return validateTextInput(textInput);
}

function validateRadioButtons() {
    var result = $('input[name="attendRadioGroup"]:checked').val();
    if (result === undefined) {
        attendRadioGroup.classList.add("has-error");
        return false;
    }
    
    attendRadioGroup.classList.remove("has-error");
    return true;
}

function onWillAttendStatusChanged() {
    var guestInfoContainer = document.getElementById('guestInfoContainer');
    if (isAttendingSelected()) {
        $('#guestInfoContainer').css("display", "block");
    } else {
        $('#guestInfoContainer').css("display", "none");
    }
    
    if (attendRadioGroup.classList.contains("has-error")) {     
        validateRadioButtons();      
    }
}

function isAttendingSelected() {
    var result = $('input[name="attendRadioGroup"]:checked').val();
    return result == "yes";
}

// Dom elements
var firstNameInput = document.getElementById('firstNameInput');
var lastNameInput = document.getElementById('lastNameInput');
var emailInput = document.getElementById('emailInput');
var messageInput = document.getElementById('messageInput');
var numGuestPicker = document.getElementById('numGuestPicker');
var guestInputsContainer = document.getElementById('guestInputsContainer');
var submitButton = document.getElementById('submitButton');
var formView = document.getElementById('formView');
var rsvpSuccessView = document.getElementById('rsvpSuccessView');
var rsvpText = document.getElementById('rsvpText');

var attendRadioGroup = document.getElementById('attendRadioContainer');
var willAttendRadio = document.getElementById('willAttendRadio');
var willNotAttendRadio = document.getElementById('willNotAttendRadio');
var errorLabel = document.getElementById('errorLabel');
var errorContainer = document.getElementById('errorContainer');

// Setup listeners
submitButton.addEventListener("click", onSubmitButtonClicked);
numGuestPicker.addEventListener("change", onGuestPickerChanged);
willAttendRadio.addEventListener("click", onWillAttendStatusChanged);
willNotAttendRadio.addEventListener("click", onWillAttendStatusChanged);

// Setup initial state
rsvpSuccessView.style.block = "none";
rsvpSuccessView.style.visibility = "hidden";
rsvpSuccessView.style.opacity = 0;
onWillAttendStatusChanged();

// Scroll to plugin
(function($) {
    $.fn.goTo = function() {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'fast');
        return this; // for chaining...
    }
})(jQuery);