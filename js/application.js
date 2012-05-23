/*jslint white: false, onevar: true, browser: true, devel: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: false, newcap: true, immed: true, laxbreak: true */
/*global jQuery, $, Raphael */

function Timeline(domID, width, height, releases) {
	if (!(this instanceof arguments.callee)) {
		return new arguments.callee(arguments);
	}
	
	var self = this;
	
	self.init = function () {
		self.paper = Raphael(domID, width, height);
		self.dotRadius = 26;
		
		self.parseDates();
		self.draw();
	};
	
	self.parseDates = function () {
		self.parsedReleases = [];
		
		$(releases).each(function (i, release) {
			var epochSeconds = Date.parse(release.date), 
			parsedDate = new Date(epochSeconds);
			
			self.parsedReleases.push({
				date: parsedDate,
				version: release.version
			});
		});
		self.startTime = self.parsedReleases[0].date.getTime();
		var endTime = $(self.parsedReleases).last()[0].date.getTime();
		self.timeSpan = endTime - self.startTime;
	};
	
	self.draw = function() {
		self.plotArray(self.parsedReleases, self.drawDotAndLabel);
	};
	
	self.plotArray = function(theArray, drawingCallback) {
		$(theArray).each(function(i, release) {
			var xOffset = 0,
			timeOffset = release.date.getTime() - self.startTime,
			timeRatio = timeOffset / self.timeSpan,
			graphWidth = self.paper.width - self.dotRadius * 2;
			
			xOffset = graphWidth * timeRatio + self.dotRadius;
			drawingCallback(release, xOffset);
		});
	};
	
	self.drawDotAndLabel = function (release, xOffSet) {
		var dot, label;
		dot = self.paper.circle(xOffSet, 40, self.dotRadius);
		dot.attr({
			'stroke-width': 0,
			'fill': '#cccccc',
			'fill-opacity': 1.0
		});
		
		label = self.paper.text(xOffSet, self.dotRadius, release.version);
		label.attr({
			'fill': "#ffffff",
			'font-size': 20,
			'font-family': "'League Gothic', 'Futura-CondensedMedium', 'Gill Sans MT Condensed', 'Arial Narrow', sans-serif"
		});
	};
	
	self.init();
}

var timeline;
jQuery(function ($) {
	
	timeline = new Timeline('timeline', 940, 81, [
		{date: "October 23, 2011", version: "0.1"},
		{date: "November 30, 2011", version: "0.5"},
		{date: "December 18, 2011", version: "1.0.0"},
		{date: "December 20, 2011", version: "1.0.5"},
		{date: "April 11, 2012", version: "2.0.0"},
		{date: "April 27, 2012", version: "2.0.5"},
		{date: "May 21, 2012", version: "3.0.0"}
	]);
	
});