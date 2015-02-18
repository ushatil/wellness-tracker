function newReport() {
	return {
		type: "WellspringReport",
		overall: false,
		reportSections: [
		                 {
		                	 type: "WellspringReportSection",
		                	 name: "LIFESTYLE",
		                	 overall: false,
		                	 subections: [
		                 	             {
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "DIET",
		                 	            	 rating: false
		                 	             },{
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "EXERCISE",
		                 	            	 rating: false
		                 	             },{
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "MEDITATION",
		                 	            	 rating: false
		                 	             },{
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "RECREATION",
		                 	            	 rating: false
		                 	             }
             	             ]
		                 },
		                 {
		                	 type: "WellspringReportSection",
		                	 name: "SUPPORT",
		                	 overall: false,
		                	 subections: [
		                 	             {
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "PROFESSIONALS",
		                 	            	 rating: false
		                 	             },{
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "FAMILY",
		                 	            	 rating: false
		                 	             },{
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "FRIENDS",
		                 	            	 rating: false
		                 	             },{
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "COLLEAGUES",
		                 	            	 rating: false
		                 	             }
             	             ]
		                 },
		                 {
		                	 type: "WellspringReportSection",
		                	 name: "EQUILIBRIUM",
		                	 overall: false,
		                	 subections: [
		                 	             {
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "SCHOOL",
		                 	            	 rating: false
		                 	             },{
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "WORK",
		                 	            	 rating: false
		                 	             },{
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "SELF",
		                 	            	 rating: false
		                 	             },{
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "HOME",
		                 	            	 rating: false
		                 	             }
             	             ]
		                 }
	                 ]
	};
}

var app = {
	    // Application Constructor
	    initialize: function() {
	        this.bindEvents();
	    },
	    // Bind Event Listeners
	    //
	    // Bind any events that are required on startup. Common events are:
	    // 'load', 'deviceready', 'offline', and 'online'.
	    bindEvents: function() {
	        document.addEventListener('deviceready', this.onDeviceReady, false);
	    },
	    // deviceready Event Handler
	    //
	    // The scope of 'this' is the event. In order to call the 'receivedEvent'
	    // function, we must explicitly call 'app.receivedEvent(...);'
	    onDeviceReady: function() {
	        app.receivedEvent('deviceready');
	    },
	    // Update DOM on a Received Event
	    receivedEvent: function(id) {
	    	$.mobile.navigate("#dashboard");
	    	$("#device-uuid").text(device.uuid);
	        console.log('Received Event: ' + id);
	    }
};

app.initialize();
