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
		"HOME" : -1,
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

/***
 * 
 * BEGIN RAPHAEL SCRIPT FOR SLIDERS
 * 
 */

function drawSlider(canvas, outsideX, outsideY, insideX, insideY, descriptor, callback){
    /**
    ** Descriptor should be a list such that:
    ** descriptor[0] = vest subsection (all caps)
    ** descriptor[1] = vest subsection display name
    **/
    var radius = 15;
    var pathWord = "M" + (outsideX - radius).toString() + "," + (outsideY - radius).toString() + "L" + (insideX - radius).toString() + "," +             (insideY - radius).toString();

    var path = canvas.path(pathWord);
    
    
    var startingX = (insideX - outsideX) / 2 + outsideX - radius;
    var startingY = (insideY - outsideY) / 2 + outsideY - radius;
    
    var knob = canvas.ellipse( startingX, startingY, 2 * radius, 2 * radius )
                   .attr( 'fill', 'red' )
                   .attr( 'stroke', 'rgba(80,80,80,0.5)' );

    var result = {
        x : startingX,
        y : startingY,
        onDragStart : function(x, y, event) {
            knob.animate(params = {"fill" : "lime"});
        },

        onDragFinish : function(event) {
            return;
        },

        onMove : function (dx, dy, x, y, event) {
            if ((x <= outsideX) == (insideX > outsideX)) {
                newY = outsideY;
                newX = outsideX;
            } else if ((x >= insideX) == (insideX > outsideX)) {
                newY = insideY;
                newX = insideX;
            } else {
                newY = (((x - outsideX) / (insideX - outsideX)) * (insideY - outsideY)) + outsideY;
                newX = x;
            }
            result.x = newX - radius;
            result.y = newY - radius;
            ReportState[descriptor[0]] = 100 * ( 1 - ((newX - outsideX) / (insideX - outsideX)));
            knob.animate(params = {"cx" : newX - radius, "cy" : newY - radius});
            callback();
        }
    }
    knob.drag(result.onMove, result.onDragStart, result.onDragFinish);
    return result;
}

function polygonPathWord(topLeft, topRight, bottomLeft, bottomRight) {
    var topLeftWord = Math.floor(topLeft.x).toString() + "," + Math.floor(topLeft.y).toString();
    var topRightWord = Math.floor(topRight.x).toString() + "," + Math.floor(topRight.y).toString();
    var bottomRightWord = Math.floor(bottomRight.x).toString() + "," + Math.floor(bottomRight.y).toString();
    var bottomLeftWord = Math.floor(bottomLeft.x).toString() + "," + Math.floor(bottomLeft.y).toString();
    
    return "M" + topLeftWord + "L" + topRightWord + "L" + bottomRightWord + "L" + bottomLeftWord + "Z";
}

function fourSliders(divId, topLeftDescriptor, topRightDescriptor, bottomLeftDescriptor, bottomRightDescriptor) {
    /**
    ** Params:
    ** 0: divId of the div that will be turned into a 4-sliers widget
    ** 1: topLeftDescriptor
    ** 2: topRightDescriptor
    ** 3: bottomLeftDescriptor
    ** 4: bottomRightDescriptor
    ** All descriptors should string lists be of the form [<subsection name (all caps)>, <subsection display name>]
    **/
	
	//
	// A note about the usage of JQuery.width():
	// 
	// According to JQuery documentation, .width() is supposed to return the
	// computed pixel value. HOWEVER, this method is called before the div is
	// initalized and its value is computed, so it is returning the percentage.
	//
	
	var percentageWidth = $("#" + divId).width();
	var height = (percentageWidth / 100) * $(window).width();
	var width = height;
	$("#" + divId).height(height);
    var canvas = Raphael(container = divId, height=height, width=width);
    var midpointX = width / 2;
    var midpointY = height / 2;
    var radius = 30;
    
    var topLeft;
    var topRight;
    var bottomLeft;
    var bottomRight;
    var path;
    
    var callback = function() {
        var pathWord = polygonPathWord(topLeft, topRight, bottomLeft, bottomRight);
        path.animate({"path" : pathWord});
    }
    
    topLeft = drawSlider(canvas, 2*radius, 2*radius, midpointX - radius, midpointY - radius, topLeftDescriptor, callback);
    topRight = drawSlider(canvas, width - 2*radius, 2*radius, midpointX + radius, midpointY - radius, topRightDescriptor, callback);
    bottomLeft = drawSlider(canvas, 2*radius, height - 2*radius, midpointX - radius, midpointY + radius, bottomLeftDescriptor, callback);
    bottomRight = drawSlider(canvas, width - 2*radius, height - 2*radius, midpointX + radius, midpointY + radius, bottomRightDescriptor, callback);
    
    path = canvas.path(polygonPathWord(topLeft, topRight, bottomLeft, bottomRight));
    path.attr({"fill" : "white", "opacity" : 0.3, "stroke-opacity" : 0});
    path.toBack();
}

/**
 * 
 * END RAPHAEL SCRIPT FOR SLIDERS
 * 
 */

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

function onLifestyleCreate() {
	fourSliders("lifestyle-sliders", ["DIET", "Diet"], ["EXERCISE", "Exercise"], ["MEDITATION", "Meditation"], ["RECREATION", "Recreation"]);
}

function onSupportCreate() {
	fourSliders("support-sliders", ["FAMILY", "Family"], ["FRIENDS", "Friends"], ["COLLEAGUES", "Colleagues"], ["PROFESSIONALS", "Professional"]);
}

function onEquilibriumCreate() {
	fourSliders("equilibrium-sliders", ["HOME", "Home"], ["SCHOOL", "School"], ["WORK", "Work"], ["SELF", "Self"]);
}

function debugOutput() {
	$("#overall-out").text(ReportState["OVERALL"].toString());
	$("#lifestyle-out").text(ReportState["LIFESTYLE"].toString());
	$("#support-out").text(ReportState["SUPPORT"].toString());
	$("#equilibrium-out").text(ReportState["EQUILIBRIUM"].toString());
	$("#diet-out").text(ReportState["DIET"].toString());
	$("#exercise-out").text(ReportState["EXERCISE"].toString());
	$("#meditation-out").text(ReportState["MEDITATION"].toString());
	$("#recreation-out").text(ReportState["RECREATION"].toString());
	$("#family-out").text(ReportState["FAMILY"].toString());
	$("#friends-out").text(ReportState["FRIENDS"].toString());
	$("#colleagues-out").text(ReportState["COLLEAGUES"].toString());
	$("#professionals-out").text(ReportState["PROFESSIONALS"].toString());
	$("#home-out").text(ReportState["HOME"].toString());
	$("#school-out").text(ReportState["SCHOOL"].toString());
	$("#self-out").text(ReportState["SELF"].toString());
	$("#work-out").text(ReportState["WORK"].toString());
}

function bindWellspringEvents() {
	$('#dashboard').on('pageshow', onHomeDashShow);
	$('#statistics').on('pageshow', onStatisticsShow);
	$('#report-dashboard').on('pageshow', onReportDashShow);
	$('#report-lifestyle').on('pageshow', onLifestyleShow);
	$('#report-support').on('pageshow', onSupportShow);
	$('#report-equilibrium').on('pageshow', onEquilibriumShow);
	
	$('#report-lifestyle').on('pagecreate', onLifestyleCreate);
	$('#report-support').on('pagecreate', onSupportCreate);
	$('#report-equilibrium').on('pagecreate', onEquilibriumCreate);
	
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
