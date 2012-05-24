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
		
		self.plotArray([
			{date: (new Date(2011, 0, 1)), version: "2011"},
			{date: (new Date(2012, 0, 1)), version: "2012"}
		], self.drawYear);
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
		var dot, label, op = 1.0, hoverFunc, hideFunc;
		dot = self.paper.circle(xOffSet, self.dotRadius + 10, self.dotRadius - 6);
		dot.attr({
			'fill': '#cccccc',
			'fill-opacity': 1.0,
			'stroke': 'none'
		});
		
		dot.toBack();
		
		if (release.version.match(/^\d\.0/)) {
			dot.attr({
				'fill': '#d92027',
				r: self.dotRadius
			});
			dot.toFront();
		}

		label = self.paper.text(xOffSet, self.dotRadius + 10, release.version);
		label.attr({
			'fill': "#ffffff",
			'font-size': 20,
			'font-family': "'League Gothic', 'Futura-CondensedMedium', 'Gill Sans MT Condensed', 'Arial Narrow', sans-serif"
		});
		
		hoverFunc = function() {
			if (release.version.match(/^\d\.0/)) {
				dot.animate({r: self.dotRadius + 6}, 1000, 'bounce');
			} else {
				dot.animate({r: self.dotRadius}, 1000, 'bounce');
			}
		};
		hideFunc = function() {
			if (release.version.match(/^\d\.0/)) {
				dot.animate({r: self.dotRadius}, 1000, 'bounce');
			} else {
				dot.animate({r: self.dotRadius - 6}, 1000, 'bounce');
			}
		};
		$(dot.node).hover(hoverFunc, hideFunc);
		$(label.node).hover(hoverFunc, hideFunc);
	};
	
	self.drawYear = function (release, xOffset) {
		var label;
		label = self.paper.text(
			xOffset * 2,
			(self.dotRadius * 2) + 10,
			release.version
		);
		
		label.attr({
			'fill': '#000000',
			'fill-opacity': 0.5,
			'font-size': 10,
			'font-family': "sans-serif"
		});
	};
	
	self.init();
}

var timeline;
jQuery(function ($) {

	timeline = new Timeline('timeline', 940, 100, [
	{date: "October 23, 2011", version: "0.1"},
	{date: "November 30, 2011", version: "0.5"},
	{date: "December 18, 2011", version: "1.0.0"},
	{date: "December 30, 2011", version: "1.1.5"},
	{date: "April 11, 2012", version: "2.0.0"},
	{date: "April 27, 2012", version: "2.1.5"},
	{date: "May 21, 2012", version: "3.0.0"},
	{date: "June 27, 2012", version: "3.1.5"}
	]);
	
	$('div#timeline').css({
		'width': timeline.paper.width
	});
});