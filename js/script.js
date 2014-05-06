var settings = {
	colors: {
		A1: { r:28,  g:31,  b:38  }, //
		A2: { r:35,  g:40,  b:48  }, //
		A3: { r:43,  g:48,  b:59  }, //
		A4: { r:51,  g:61,  b:70  }, //
		A5: { r:79,  g:91,  b:102 }, //
		A6: { r:101, g:115, b:126 }, //
		B1: { r:167, g:173, b:186 }, //
		B2: { r:192, g:197, b:206 }, //
		B3: { r:223, g:225, b:232 }, //
		B4: { r:239, g:241, b:245 }, //
		C1: { r:191, g:97,  b:106 }, //
		C2: { r:235, g:203, b:139 }, //
		C3: { r:254, g:204, b:102 }, //
		C4: { r:150, g:181, b:180 }, //
	}
};

var inspectData = {};

$(function(){
	rivets.configure({
		templateDelimiters: ['{{', '}}']
	});
	rivets.formatters.color = {
		read: function(rgb) {
			return $.colpick.rgbToHex(rgb)
		},
		publish: function(hex) {
			return $.colpick.hexToRgb(hex)
		}
	}
	rivets.formatters.rgba = function(rgb, a) {
		return "rgba(" + rgb.r + "," + rgb.g + ","  + rgb.b + ","  + a + ")";
	}
	rivets.bind($('html'), {
		settings: settings
	});

	var picker = $('#color_picker').colpick({
		flat:true,
		layout:'rgbhex',
		submit:0,
		colorScheme:'dark',
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			if(!bySetColor){
				$('#editor .colors li.active').each(function(){
					settings.colors[$(this).attr('data-bg')] = rgb;
				});
			}
		}
	});

	$('#editor .colors li').click(function(e){
		if(!e.ctrlKey && !e.metaKey){
			$('#editor .colors li').removeClass('active');
		}
		$('#color_picker').removeClass('inactive');
		$(this).addClass('active');
		picker.colpickSetColor($.colpick.rgbToHex(settings.colors[$(this).attr('data-bg')]), false);
	});

	$('#ui').click(function(){ 
		$('#editor .colors li').removeClass('active');
		$('#color_picker').addClass('inactive');
	});
	// Disable transitions when clicking on color picker
	$("#color_picker .colpick_color, #color_picker .colpick_hue").on("mousedown mouseup", function(e){
		$(this).toggleClass( "mousedown", e.type === "mousedown" );
	});

	$('#ui').mouseover(function(event){
		var target = $(event.target);
		isText = target.is("span") || target.is("i") || target.is("button") || target.is("input");
		inspectData = {};
		setInspectData(target, isText);
		$.each(inspectData, function(key, value){
			if(value == undefined) delete inspectData[key];
		});
		$("#inspect_data").text(getInspectString());
	});
	$('#ui').mouseout(function(event){
		$("#inspect_data").text("");
	});

	function setInspectData(obj, isText){
		if(obj.attr('id') == "ui") return inspectData;

		if(inspectData.bg  == undefined) inspectData.bg  = obj.attr('data-bg' );
		if(inspectData.bgh == undefined) inspectData.bgh = obj.attr('data-bgh');
		if(inspectData.tc  == undefined && isText) inspectData.tc  = obj.attr('data-tc' );
		if(inspectData.tch == undefined && isText) inspectData.tch = obj.attr('data-tch');

		if(inspectData.bg  == undefined || inspectData.bgh == undefined || inspectData.tc  == undefined || inspectData.tch == undefined){
			return setInspectData(obj.parent(), isText);
		} else {
			return inspectData;
		}
	}
	function getInspectString(){
		result = "";
		if(inspectData.bg  != undefined) result += ", background: " + inspectData.bg;
		if(inspectData.bgh != undefined) result += ", background-hover: " + inspectData.bgh;
		if(inspectData.tc  != undefined) result += ", text: " + inspectData.tc;
		if(inspectData.tch != undefined) result += ", text-hover: " + inspectData.tch;
		return result;
	}

});