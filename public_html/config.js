(function() {
	var tbs = window.tbs = window.tbs || {};

	// Which RFID event to look for when triggered.
	// Options are 'added', 'removed', or 'updated'
	tbs.RFIDEventName = 'added';

	// Location of the RFID Server
	tbs.RFIDServerUrl = 'http://192.168.0.16:8081/rfid';

	// API Root for all XOMNI calls
	tbs.XOMNIApiRoot = 'http://thebigspace.api.xomni.com/';	

	// The product ID of the item in XOMNI that is used as a test
	// This is the product info that will be looked up when you click
	// on the home page as opposed to waiting for the RFID trigger
	tbs.XOMNITestProducTId = 1102;

	// Time in milisecodns to continuously ping the RFID server
	tbs.RFIDPingInterval = 1000;
})();