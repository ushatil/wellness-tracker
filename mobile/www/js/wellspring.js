var WELLSPRING_BASE_URL = "http://ec2-52-5-103-151.compute-1.amazonaws.com/wellspring/v1";

String.prototype.toReadableCase = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

var DEVICE_UUID=""

var VALUE_COLOR = "#FFFFCD";
var EQUILIBRIUM_COLOR = "#BEEFFF";
var SUPPORT_COLOR = "#F0D3FF";
var LIFESTYLE_COLOR = "#C8FFC8";

function wellspringReport(reportState) {
	return {
		type: "WellspringReport",
		overall: reportState["OVERALL"],
		reportSections: [
		                 {
		                	 type: "WellspringReportSection",
		                	 name: "LIFESTYLE",
		                	 overall: reportState["LIFESTYLE"],
		                	 subsections: [
		                 	             {
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "DIET",
		                 	            	 rating: reportState["DIET"]
		                 	             },{
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "EXERCISE",
		                 	            	 rating: reportState["EXERCISE"]
		                 	             },{
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "MEDITATION",
		                 	            	 rating: reportState["MEDITATION"]
		                 	             },{
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "RECREATION",
		                 	            	 rating: reportState["RECREATION"]
		                 	             }
             	             ]
		                 },
		                 {
		                	 type: "WellspringReportSection",
		                	 name: "SUPPORT",
		                	 overall: reportState["SUPPORT"],
		                	 subsections: [
		                 	             {
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "PROFESSIONALS",
		                 	            	 rating: reportState["PROFESSIONALS"]
		                 	             },{
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "FAMILY",
		                 	            	 rating: reportState["FAMILY"]
		                 	             },{
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "FRIENDS",
		                 	            	 rating: reportState["FRIENDS"]
		                 	             },{
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "COLLEAGUES",
		                 	            	 rating: reportState["COLLEAGUES"]
		                 	             }
             	             ]
		                 },
		                 {
		                	 type: "WellspringReportSection",
		                	 name: "EQUILIBRIUM",
		                	 overall: reportState["EQUILIBRIUM"],
		                	 subsections: [
		                 	             {
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "SCHOOL",
		                 	            	 rating: reportState["SCHOOL"]
		                 	             },{
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "WORK",
		                 	            	 rating: reportState["WORK"]
		                 	             },{
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "SELF",
		                 	            	 rating: reportState["SELF"]
		                 	             },{
		                 	            	 type: "WellspringReportSubsection",
		                 	            	 name: "HOME",
		                 	            	 rating: reportState["HOME"]
		                 	             }
             	             ]
		                 }
	                 ]
	};
}

var dummyValues = [{
		  "type": "WellspringValue",
		  "id": 1,
		  "description": "I like to be healthy",
		  "name": "health",
		  "vestSubSection": "DIET"
		},
		{
		  "type": "WellspringValue",
		  "id": 2,
		  "description": " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non turpis eros. " +
		  		"Nunc mauris dolor, rhoncus vitae eros vel, aliquet commodo arcu. Pellentesque faucibus ligula " +
		  		"et sapien euismod tempor et ac arcu. Ut vulputate vitae justo placerat sollicitudin. Donec non " +
		  		"pellentesque urna, vel varius enim. In hac habitasse platea dictumst. Phasellus tincidunt enim " +
		  		"luctus imperdiet sodales.",
		  "name": "lorem",
		  "vestSubSection": "SELF"
		},
		{
		  "type": "WellspringValue",
		  "id": 6,
		  "description": "Foo Bar is very important to me",
		  "name": "foo",
		  "vestSubSection": "SCHOOL"
		},
		{
		  "type": "WellspringValue",
		  "id": 4,
		  "description": "It's important to me that my friends come and ask me for favors. It makes me feel reliable",
		  "name": "favors",
		  "vestSubSection": "FRIENDS"
		}];

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

function newValue(name, description, vestSubSection) {
	var result = {
			"type" : "WellspringValue",
			"description" : description,
			"name" : name,
			"vestSubSection" : vestSubSection
	};
	return result;
}

function updatedValue(name, description, vestSubSection, id) {
	var result = {
			"type" : "WellspringValue",
			"description" : description,
			"name" : name,
			"vestSubSection" : vestSubSection,
			"id" : id
	};
	return result;
}

var ReportState;

function submitReport() {
	var requestBody = wellspringReport(ReportState);
	
	$.ajax({
		url : WELLSPRING_BASE_URL + "/report",
		headers : {Device: DEVICE_UUID},
		method : "POST",
		data: JSON.stringify(requestBody),
		success : function(data, status, xhr) {
			var responseBody = JSON.parse(data);
			if (responseBody.subsection && responseBody.value && responseBody.value != "NONE") {
				$("#intervention-line-1").html("You said you valued " + responseBody.value.toString().toReadableCase() + 
						", but you scored low in " + responseBody.subsection.toString().toReadableCase() + ".");
			} else if (responseBody.subsection) {
				$("#intervention-line-1").html("You scored low in " + responseBody.subsection.toString().toReadableCase() + ".");
			}
			if (responseBody.intervention) {
				$("#intervention-line-2").html(responseBody.intervention);
			}
			$.mobile.navigate("#intervention");
		},
		error : function(arg0, arg1, arg2) {
			errorPopup("Error submitting Value");
		}
	});
}

/**
 * BEGIN RAPHAEL SCRIPT FOR HOME PAGE
 * http://jsfiddle.net/1rcyLarh/6/
 */

/**
* The following method borrows from a Raphael-hosted example:
* http://raphaeljs.com/pie.js
* Raphael and Wellspring are both available under the MIT License
**/
function homeDashSector(canvas, destination, cx, cy, r, startAngle, endAngle, params, text, textParams) {
  var rad = Math.PI / 180;
  var x1 = cx + r * Math.cos(-startAngle * rad),
      x2 = cx + r * Math.cos(-endAngle * rad),
      y1 = cy + r * Math.sin(-startAngle * rad),
      y2 = cy + r * Math.sin(-endAngle * rad);
  var result = canvas.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
  result.touchstart(function() {
      result.stop().animate({transform: "s1.1 1.1 " + cx + " " + cy}, 500, "elastic");
  });
  result.touchend(function(event) {
      var offsetLeft = $("#home-dash-pie").offset().left;
      var offsetTop = $("#home-dash-pie").offset().top;
      var callback;
      if (event.changedTouches &&
          event.changedTouches[0] &&
          !Raphael.isPointInsidePath(result.attr("path"), event.changedTouches[0].clientX - offsetLeft, event.changedTouches[0].clientY - offsetTop)) {
    	  callback = function() {};
      } else {
    	  callback = function() {$.mobile.navigate(destination, {transition : "none"});};
      }
      	result.stop().animate({transform: ""}, 500, "elastic", callback);
  });
  result.touchcancel(function() {
      result.stop().animate({transform: ""}, 500, "elastic");
  });
  
  var middleAngle = ((startAngle + endAngle) / 2) * rad;
  var textX = cx + (r * Math.cos(middleAngle)) / 2;
  var textY = cy - (r * Math.sin(middleAngle)) / 2;
  
  /**
   * WARNING
   * The y value in webkit (Chrome / android) is doubled in Raphael.
   * This is a known bug in Raphael (https://github.com/DmitryBaranovskiy/raphael/issues/491)
   * This will need to be fixed for iOS
   */
  var text = canvas.text(textX, textY/2, text);
  text.attr(textParams);
  
}


function drawHomeScreenWidget() {
	var percentageWidth = $("#home-dash-pie").width();
	var height = (percentageWidth / 100) * $(window).width();
	var width = height;
	$("#home-dash-pie").height(height);
	
	var centerX = width / 2;
	var centerY = height / 2;
	var radius = ((height + width) / 4) * 0.85
	
	var textParams = {"font-size" : "24px"};
	
	var canvas = new Raphael("home-dash-pie", height, width);
	homeDashSector(canvas, "#values", centerX, centerY, radius, 45, 135, {"fill" : VALUE_COLOR}, "Values", textParams);
	homeDashSector(canvas, "#report-lifestyle", centerX, centerY, radius, 135, 225, {"fill" : LIFESTYLE_COLOR}, "Lifestyle", textParams);
	homeDashSector(canvas, "#report-support", centerX, centerY, radius, 225, 315, {"fill" : SUPPORT_COLOR}, "Support", textParams);
	homeDashSector(canvas, "#report-equilibrium", centerX, centerY, radius, 315, 405, {"fill" : EQUILIBRIUM_COLOR}, "Equilibrium", textParams);
}



/**
 * END RAPHAEL SCRIPT FOR HOME PAGE
 */

/***
 * 
 * BEGIN RAPHAEL SCRIPT FOR SLIDERS
 * 
 */

var redYellowRainbow = new Rainbow();
var yellowGreenRainbow = new Rainbow();

redYellowRainbow.setNumberRange(0, 50);
redYellowRainbow.setSpectrum('red', 'yellow');

yellowGreenRainbow.setNumberRange(50, 100);
yellowGreenRainbow.setSpectrum('yellow', 'lime');

var gradientLookup = [];

for (var i = 0; i <= 100; i++) {
	var color;
    if (i < 50) {
    	color = "#" + redYellowRainbow.colourAt(i);
    } else {
    	color = "#" + yellowGreenRainbow.colourAt(i);
    }
    gradientLookup.push(color);
}

function drawSlider(canvas, outsideX, outsideY, insideX, insideY, descriptor, callback, radius){
    /**
    ** Descriptor should be a list such that:
    ** descriptor[0] = vest subsection (all caps)
    ** descriptor[1] = vest subsection display name
    **/
    var pathWord = "M" + (outsideX - radius).toString() + "," + (outsideY - radius).toString() + "L" + (insideX - radius).toString() + "," +             (insideY - radius).toString();

    var path = canvas.path(pathWord);
    // Note: 5% margin is hard-coded here
    var leftMargin = (5 / 100) * $(window).width();
    
    
    var startingX = (insideX - outsideX) / 2 + outsideX - radius;
    var startingY = (insideY - outsideY) / 2 + outsideY - radius;
    
    var knob = canvas.ellipse( startingX, startingY, 2 * radius, 2 * radius )
                   .attr( 'fill', 'white' )
                   .attr( 'stroke', 'rgba(80,80,80,0.5)' );
    
    var text = canvas.text(startingX, startingY/2, "");
    text.attr('font-size', '18px');

    var result = {
        x : startingX,
        y : startingY,
        onDragStart : function(x, y, event) {
            result.onMove(x, y, x, y, event);
        },

        onDragFinish : function(event) {
        	refreshProgressBars();
        },

        onMove : function (dx, dy, x, y, event) {
        	x = x - leftMargin;
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
            var rating = 100 * ( 1 - ((newX - outsideX) / (insideX - outsideX)));
            ReportState[descriptor[0]] = rating;
            
            var newColor = gradientLookup[Math.floor(rating)];
            
            knob.animate(params = {"cx" : result.x, "cy" : result.y, "fill" : newColor});
            text.animate(params = {'x' : result.x, 'y' : result.y});
            text.attr('text', rating.toFixed(1) + "%")
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
    var radius = 45;
    
    var topLeft;
    var topRight;
    var bottomLeft;
    var bottomRight;
    var path;
    
    var callback = function() {
        var pathWord = polygonPathWord(topLeft, topRight, bottomLeft, bottomRight);
        path.animate({"path" : pathWord});
    }
    
    topLeft = drawSlider(canvas, 2*radius, 2*radius, midpointX - radius, midpointY - radius, topLeftDescriptor, callback, radius/2);
    topRight = drawSlider(canvas, width - 2*radius, 2*radius, midpointX + radius, midpointY - radius, topRightDescriptor, callback, radius/2);
    bottomLeft = drawSlider(canvas, 2*radius, height - 2*radius, midpointX - radius, midpointY + radius, bottomLeftDescriptor, callback, radius/2);
    bottomRight = drawSlider(canvas, width - 2*radius, height - 2*radius, midpointX + radius, midpointY + radius, bottomRightDescriptor, callback, radius/2);
    
    path = canvas.path(polygonPathWord(topLeft, topRight, bottomLeft, bottomRight));
    path.attr({"fill" : "white", "opacity" : 0.3, "stroke-opacity" : 0});
    path.toBack();
}

/**
 * 
 * END RAPHAEL SCRIPT FOR SLIDERS
 * 
**/

/**
 * BEGIN VALUES SCRIPT (KNOCKOUT)
 * 
 */

var ADD_MODE="ADD";
var EDIT_MODE="EDIT";
var valuesAddMode = "";
var selectBoxInitialized=false;

var ViewModel = function(values) {
	   var self = this;
	   this.values = ko.observableArray(values);
	   this.showValue = function(value) {
			$("#value-add-name").val(value["name"]);
			$("#value-add-description").val(value["description"]);
			$("#value-add-id").val(value["id"]);
			$("#value-add-subsection").val(value["vestSubSection"]);
			$("#value-add-submit").text("Save");
			valuesAddMode = EDIT_MODE;
		   $.mobile.navigate("#value-add");
	   }
	   this.deleteValue = function(value) {
		   $("#value-delete-name").text(value["name"]);
		   $("#value-delete-id").val(value["id"]);
		   $.mobile.navigate("#value-delete");
	   }
	};
	
var valuesModel = new ViewModel([]);

function onValueAddShow() {
	$("#value-add-subsection").selectmenu("refresh");
}

function refreshValues() {
	$.ajax({
		url : WELLSPRING_BASE_URL + "/value",
		headers : {Device: DEVICE_UUID},
		method : "GET",
		success : function(data, status, xhr) {
			var responseBody = JSON.parse(data);
			if (responseBody.list) {
				valuesModel.values.removeAll();
				for (var i = 0; i < responseBody.list.length; i++) {
					valuesModel.values.push(responseBody.list[i]);
				}
			} else {
				errorPopup("Error getting values");
			}
		},
		error : function(arg0, arg1, arg2) {
			errorPopup("Error getting values");
		}
	});
}
	
function onValueAddSubmit() {
	var inputsValid = true;
	var missingFields = [];
	if (!$('#value-add-name').val()) {
		inputsValid = false;
		missingFields.push('Name');
	}
	if (!$('#value-add-description').val()) {
		inputsValid = false;
		missingFields.push('Description');
	}
	
	if (!inputsValid) {
		var message = "<p>The following values were missing:</p>";
		for (var i = 0; i < missingFields.length; i++) {
			message += "<p>" + missingFields[i] + "</p>";
		}
		$('#value-add-validator-popup').html(message);
		$('#value-add-validator-popup').popup('open', {});
		return;
	}
	
	if (valuesAddMode == ADD_MODE) {
	
		var value = newValue($('#value-add-name').val(), $('#value-add-description').val(), $('#value-add-subsection').val());
		
		$.ajax({
			url : WELLSPRING_BASE_URL + "/value",
			headers : {Device: DEVICE_UUID},
			method : "POST",
			data: JSON.stringify(value),
			success : function(data, status, xhr) {
				refreshValues();
				$.mobile.navigate("#values");
			},
			error : function(arg0, arg1, arg2) {
				$.mobile.navigate("#values");
				errorPopup("Error submitting Value");
			}
		});
		
	} else if (valuesAddMode == EDIT_MODE) {
		var id = $('#value-add-id').val();
		var value = updatedValue($('#value-add-name').val(), $('#value-add-description').val(), $('#value-add-subsection').val(), id);
		
		$.ajax({
			url : WELLSPRING_BASE_URL + "/value/" + encodeURIComponent(id.toString()),
			headers : {Device: DEVICE_UUID},
			method : "PUT",
			data: JSON.stringify(value),
			success : function(data, status, xhr) {
				refreshValues();
				$.mobile.navigate("#values");
			},
			error : function(arg0, arg1, arg2) {
				$.mobile.navigate("#values");
				errorPopup("Error submitting Value");
			}
		});
	}
}

function onValueDeleteSubmit() {
	var id = $('#value-delete-id').val();
	$.ajax({
		url : WELLSPRING_BASE_URL + "/value/" + encodeURIComponent(id.toString()),
		headers : {Device: DEVICE_UUID},
		method : "DELETE",
		success : function(data, status, xhr) {
			refreshValues();
			$.mobile.navigate("#values");
		},
		error : function(arg0, arg1, arg2) {
			$.mobile.navigate("#values");
			errorPopup("Error deleting Value");
		}
	});
}

function onAddValueButtonTap() {
	valuesAddMode=ADD_MODE;
	$("#value-add-name").val("");
	$("#value-add-description").val("");
	$("#value-add-subsection").val("DIET");
	$("#value-add-submit").text("Add");
	$.mobile.navigate('#value-add');
}
	
/**
 * 
 * END VALUES SCRIPT
 * 
 */

/**
 * 
 * BEGIN STATS SCRIPT
 * 
 */

var STATS_GRAPH_LABEL_OFFSET = 30;

function wellspringStatsGraph(divId, color, width, height, labels, points) {
    var canvas = Raphael(container = divId, width=width, height=height);
    var functionalHeight = height - STATS_GRAPH_LABEL_OFFSET;
    
    // TODO: Change grey fill
    canvas.rect(0, 0, width, functionalHeight)
    .attr({"fill" : color});
       points = quickSortByX(points);
    
    for (i = 0; i < labels.length; i++) {
        var x = labels[i]["location"] * width;
        var pathWord = "M" + x.toString() + "," + 0 + "L" + x.toString() + ","
        + functionalHeight.toString() + "Z";
        canvas.path(pathWord).attr({"stroke-width" : 0.5});
        canvas.text(x, functionalHeight + STATS_GRAPH_LABEL_OFFSET / 2, labels[i]["label"]);
    }
    
    var statsPath = "M";
    for (i = 0; i < points.length; i++) {
         var x = points[i]["x"] * width;
        var y = ((1 - points[i]["y"]) + 0.1) * functionalHeight; // The +0.1 is because the actual range of y is [0.2, 1]
        canvas.ellipse(x, y, 5, 5).attr('fill', 'black');
        
        statsPath += x.toString() + "," + y.toString()
        + ((i < points.length - 1) ? "L" : "");
        
    }
    if (points.length > 1) {
        canvas.path(statsPath).attr({"stroke-width" : 2});
    }
    
    return canvas;
}

function quickSortByX(points) {
    if (points.length <= 1) {
        return points;
    }
    
    var pivot = points.pop();
    var left = [];
    var right = [];
    for (i = 0; i < points.length; i++) {
        if (points[i]["x"] <= pivot["x"]) {
            left.push(points[i]);
        } else {
            right.push(points[i]);
        }
    }
    
    return quickSortByX(left).concat([pivot], quickSortByX(right));
}

var canvases = [];

function drawStatistics(pointsLookup, labels) {
	var canvasCount = canvases.length;
	for (i = 0; i < canvasCount; i++) {
		var canvas = canvases.pop();
		canvas.clear();
	}
	
	//TODO: Load labels and points from AJAX
	
	/**var labels = [
	              {"location" : 0.3, "label" : "Tue\nMar 03"},
	              {"location" : 0.6, "label" : "Wed\nMar 04"}
	              ];

  var points = [
      {"x" : 0.2, "y" : 0.8},
      {"x" : 0.5, "y" : 0.3},
      {"x" : 0.65, "y" : 0.6},
      {"x" : 0.3, "y" : 0.5},
      {"x" : 0.8, "y" : 0.2}
      ];**/
  
  //TODO: Height is hard-coded as 200. Un-hard-code
  	canvases.push(wellspringStatsGraph("mood-stats", "grey", $("#mood-stats").width(), 200, labels, pointsLookup["MOOD"]));
  	canvases.push(wellspringStatsGraph("equilibrium-stats", EQUILIBRIUM_COLOR, $("#equilibrium-stats").width(), 200, labels, pointsLookup["EQUILIBRIUM"]));
  	canvases.push(wellspringStatsGraph("support-stats", SUPPORT_COLOR, $("#support-stats").width(), 200, labels, pointsLookup["SUPPORT"]));
  	canvases.push(wellspringStatsGraph("lifestyle-stats", LIFESTYLE_COLOR, $("#lifestyle-stats").width(), 200, labels, pointsLookup["LIFESTYLE"]));
}

var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function onStatisticsShow() {
	var now = new Date();
	var nowUTC = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
	var lastWeek = nowUTC - (7*24*60*60*1000);
	var timeSpan = nowUTC - lastWeek;
	

	
	$.ajax({
		url : WELLSPRING_BASE_URL + "/stats/7",
		headers : {Device: DEVICE_UUID},
		method : "GET",
		success : function(data, status, xhr) {
			var labels = [];
			var pointsLookup = {"MOOD" : [], "SUPPORT" : [], "LIFESTYLE" : [], "EQUILIBRIUM" : []};
			var responseBody = JSON.parse(data);
			
			for (var i = 0; i < 7; i++) {
				var beginningOfDay = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()-i);
				var x = (beginningOfDay - lastWeek) / timeSpan;
				var label = weekdays[beginningOfDay.getDay()] + "\n" + months[beginningOfDay.getMonth()] + " " + beginningOfDay.getDate().toString();
				labels.push({"location" : x, "label" : label})
			}
			
			if (responseBody.fullStatistics) {
				var fullStatistics = responseBody.fullStatistics;
				for (var i = 0; i < fullStatistics.length; i++) {
					if (fullStatistics[i] && fullStatistics[i].category && fullStatistics[i].categoryStatistics) {
						var category = fullStatistics[i].category;
						var categoryStatistics = fullStatistics[i].categoryStatistics;
						for (var j = 0; j < categoryStatistics.length; j++) {
							if (categoryStatistics[j] && categoryStatistics[j].time && categoryStatistics[j].rating) {
								var pointY = categoryStatistics[j].rating / 5;
								var pointX = (Date.parse(categoryStatistics[j].time) - lastWeek) / timeSpan;
								pointsLookup[category].push({x : pointX, y : pointY});
							}
						}
					}
				}
			}
			drawStatistics(pointsLookup, labels);
			
		},
		error : function(arg0, arg1, arg2) {
			errorPopup("Error getting values");
		}
	});
}

/**
 * END STATS SCRIPT
 */

function refreshProgressBars() {
	var properties_filled = 0;
	for (var member in ReportState) {
		if (ReportState.hasOwnProperty(member)) {
			if (ReportState[member] != -1) {
				properties_filled++;
			}
		}
	}
	if (properties_filled == 16) {
		showSubmitReportButtons();
		return;
	}
	var progress = Math.floor((properties_filled / 16) * 100);
	$(".progress-bar").each(function() {
		$(this).val(progress);
	});
}

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

var valuesBound = false;
function onValuesShow() {
	if (!valuesBound) {
		ko.applyBindings(valuesModel);
		refreshValues();
	}
	valuesBound = true;
}

function onLifestyleCreate() {
	fourSliders("lifestyle-sliders", ["DIET", "Diet"], ["EXERCISE", "Exercise"], ["MEDITATION", "Meditation"], ["RECREATION", "Recreation"]);
}

function onSupportCreate() {
	fourSliders("support-sliders", ["FRIENDS", "Friends"], ["FAMILY", "Family"], ["COLLEAGUES", "Colleagues"], ["PROFESSIONALS", "Professionals"]);
}

function onEquilibriumCreate() {
	fourSliders("equilibrium-sliders", ["SCHOOL", "School"], ["WORK", "Work"], ["SELF", "Self"], ["HOME", "Home"]);
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
	$('#values').on('pageshow', onValuesShow);
	$('#statistics').on('pageshow', onStatisticsShow);
	$('#report-dashboard').on('pageshow', onReportDashShow);
	$('#report-lifestyle').on('pageshow', onLifestyleShow);
	$('#report-support').on('pageshow', onSupportShow);
	$('#report-equilibrium').on('pageshow', onEquilibriumShow);
	$('#value-add').on('pageshow', onValueAddShow);
	
	$('#dashboard').on('pagecreate', drawHomeScreenWidget);
	
	$('#report-lifestyle').on('pagecreate', onLifestyleCreate);
	$('#report-support').on('pagecreate', onSupportCreate);
	$('#report-equilibrium').on('pagecreate', onEquilibriumCreate);
	
	$('#value-add-submit').on('tap', onValueAddSubmit);
	$('#value-delete-submit').on('tap', onValueDeleteSubmit);
	$('#value-add-button').on('tap', onAddValueButtonTap);
	
	$('.submit-report-button').each(function() {
		$(this).on('tap', submitReport);
	});
	
	$("input[name='dashboard-overall']").change(function() {
		if ($(this).is(":checked")) {
			ReportState["OVERALL"] = Number($(this).val());
			refreshProgressBars();
		}
	})
	
	$("input[name='report-dashboard-overall']").change(function() {
		if ($(this).is(":checked")) {
			ReportState["OVERALL"] = Number($(this).val());
			refreshProgressBars();
		}
	})
	
	$("input[name='lifestyle-overall']").change(function() {
		if ($(this).is(":checked")) {
			ReportState["LIFESTYLE"] = Number($(this).val());
			refreshProgressBars();
		}
	})
	
	$("input[name='support-overall']").change(function() {
		if ($(this).is(":checked")) {
			ReportState["SUPPORT"] = Number($(this).val());
			refreshProgressBars();
		}
	})
	
	$("input[name='equilibrium-overall']").change(function() {
		if ($(this).is(":checked")) {
			ReportState["EQUILIBRIUM"] = Number($(this).val());
		}
	})
	
	// Stop-gap
	$('#debug-output').on('pageshow', debugOutput);
}

function registerDevice() {
	$.ajax({
		url : WELLSPRING_BASE_URL + "/register",
		headers : {Device: DEVICE_UUID},
		method : "POST",
		success : function(response) {
			//$("#ajax-test-output").text("AJAX Success");
		},
		error : function(arg0, arg1, arg2) {
			//$("#ajax-test-output").text("AJAX Failed");
		}
	});
}


function errorPopup(message) {
	$('#error-popup').html(message);
	$('#error-popup').popup('open', {x : $(window).width() / 2, y :$(window).height() / 2});
}

function showSubmitReportButtons() {
	$(".progress-bar").each(function() {
		$(this).hide();
	});
	$('.submit-report-button').each(function() {
		$(this).show();
	});
}

function overlayShow() {
	// Show an overlay that indicates things are churning
}

function overlayClear() {
	// Clear the overlay from overlayShow()
}

function browserDebug() {
	WELLSPRING_BASE_URL = "http://localhost/django/wellspring/v1";
	DEVICE_UUID = "Browser";
	$('#error-popup').popup();
	ReportState = newReportState();
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
	    	DEVICE_UUID = device.uuid;
	    	$.mobile.navigate("#dashboard");
	    	$("#DEVICE_UUID").text(DEVICE_UUID);
	        console.log('Received Event: ' + id);
	    	$('#error-popup').popup();
	        registerDevice();
	    }
};

app.initialize();
