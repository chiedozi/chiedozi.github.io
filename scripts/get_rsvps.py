import urllib2
import json

# put header row
outputString = "firstName,lastName,isAttending,email,numGuests,invitedBy,message,dietRestrictions"

f = urllib2.urlopen("https://wedding-site-e4c4d.firebaseio.com/rsvps.json?print=pretty")
parsedJson = json.load(f)

for userId in parsedJson:
	# get json for user
	userInfo = parsedJson[userId]

	# parse properties
	firstName = userInfo["firstName"]
	lastName = userInfo["lastName"]
	isAttending = userInfo["isAttending"]
	message = userInfo["message"]
        
	dietRestrictions = ""
	if "dietRestrictions" in userInfo:
		dietRestrictions = userInfo["dietRestrictions"]

	email = ""
	if "email" in userInfo:
		email = userInfo["email"]

	guestList = None
	numGuests = 0
	if "guests" in userInfo:
		guestList = userInfo["guests"]
		numGuests = len(guestList)

	if isAttending:
		numGuests += 1
	else:
		continue
		
	rowString = '"%s","%s","%s","%s","%s","%s","%s","%s"' % (firstName, lastName, isAttending, email, numGuests, userId, message, dietRestrictions)
	outputString += "\n" + rowString

	# Iterate over and print guests
	if guestList is not None:
		for guestInfo in guestList:
			rowString = '"%s","%s","%s","%s","%s","%s","%s","%s"' % (guestInfo["firstName"], guestInfo["lastName"], isAttending, "", "", userId, "", "")
			outputString += "\n" + rowString

print outputString

# Save output to file
outputFile = open("rsvps.csv", "w")
outputFile.write(outputString.encode('utf8'))
outputFile.close()
