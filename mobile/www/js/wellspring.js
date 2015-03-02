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

function newReportState() {
	return {
		"OVERALL" : -1,
		"LIFESTYLE" : -1,
		"SUPPORT" : -1,
		"EQUILIBRIUM" : -1,
		"SELF" : -1,
		"SCHOOL" : -1,
		"SELF" : -1,
		"WORK" : -1,
		"FAMILY" : -1,
		"PROFESSIONALS" : -1,
		"COLLEAGUES" : -1,
		"FRIENDS" : -1,
		"EXERCISE" : -1,
		"DIET" : -1,
		"MEDITATION" : -1,
		"RECREATION" : -1
	};
}

var ReportState;

function onHomeDashShow() {
	if (ReportState) {
		var overall = ReportState["OVERALL"];
		if (overall != -1) {
			overall = overall.toString();
			$("#dashboard-overall-radio-" + overall).attr("checked", "checked");
			$("input[name='dashboard-overall']").checkboxradio("refresh");
		}
	}
}

function onStatisticsShow() {
	return;
}

function onReportDashShow() {
	if (ReportState) {
		var overall = ReportState["OVERALL"];
		if (overall != -1) {
			overall = overall.toString();
			$("#report-dashboard-overall-radio-" + overall).attr("checked", "checked");
			$("input[name='report-dashboard-overall']").checkboxradio("refresh");
		}
	}
}

function onLifestyleShow() {
	return;
}

function onSupportShow() {
	return;
}

function onEquilibriumShow() {
	return;
}

function onValuesShow() {
	return;
}

function debugOutput() {
	$("#overall-out").text(ReportState["OVERALL"].toString());
	$("#lifestyle-out").text(ReportState["LIFESTYLE"].toString());
	$("#support-out").text(ReportState["SUPPORT"].toString());
	$("#equilibrium-out").text(ReportState["EQUILIBRIUM"].toString());
}

function bindWellspringEvents() {
	$('#dashboard').on('pageshow', onHomeDashShow);
	$('#statistics').on('pageshow', onStatisticsShow);
	$('#report-dashboard').on('pageshow', onReportDashShow);
	$('#report-lifestyle').on('pageshow', onLifestyleShow);
	$('#report-support').on('pageshow', onSupportShow);
	$('#report-equilibrium').on('pageshow', onEquilibriumShow);
	
	$("input[name='dashboard-overall']").change(function() {
		if ($(this).is(":checked")) {
			ReportState["OVERALL"] = Number($(this).val());
		}
	})
	
	$("input[name='report-dashboard-overall']").change(function() {
		if ($(this).is(":checked")) {
			ReportState["OVERALL"] = Number($(this).val());
		}
	})
	
	$("input[name='lifestyle-overall']").change(function() {
		if ($(this).is(":checked")) {
			ReportState["LIFESTYLE"] = Number($(this).val());
		}
	})
	
	$("input[name='support-overall']").change(function() {
		if ($(this).is(":checked")) {
			ReportState["SUPPORT"] = Number($(this).val());
		}
	})
	
	$("input[name='equilibrium-overall']").change(function() {
		if ($(this).is(":checked")) {
			ReportState["EQUILIBRIUM"] = Number($(this).val());
		}
	})
	
	// Stop-gap
	$('#configure').on('pageshow', debugOutput);
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
	        bindWellspringEvents();
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
	    	ReportState = newReportState();
	    	$.mobile.navigate("#dashboard");
	    	$("#device-uuid").text(device.uuid);
	        console.log('Received Event: ' + id);
	    }
};

app.initialize();
