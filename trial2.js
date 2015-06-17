
document.documentElement.style.webkitTouchCallout = 'none';

$(document).bind("mobileinit", function(){     // disables transitions
    $.mobile.defaultDialogTransition = "none";
    $.mobile.defaultTransition = 'none';
});

function getPhoneGapPath() {     // path to access audio files
    var path = window.location.pathname;
    path = path.substr( path, path.length - 10 );
    return 'file://' + path;
};


var time_delay = 600;


function shuffle(o){     // shuffles items in array 
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};


var draw_four = function(answer, list){      // mixes correct answer with 3 incorrect
	var group = [answer];
	var ind_ans = list.indexOf(answer);

	var nr1 = Math.floor(Math.random() * 10);
	var nr2 = 10 + Math.floor(Math.random() * 10);
	var nr3 = 20 + Math.floor(Math.random() * 10);

	if ((ind_ans === nr1) || (ind_ans === nr2) || (ind_ans === nr3)) {
		console.log("again");
		return draw_four(answer, list);
	} else { 
		group.push(list[nr1]); group.push(list[nr2]); group.push(list[nr3]);
		return shuffle(group);
	};
};

var current_level = 1;
var this_pack_eng = "";
var this_pack_pol = "";
var this_pack_examples = "";

var this_pack = "";
var data_lang = "eng";

function nextPack(data_eng, data_pol, data_examples) {     // updates app with new words
	this_pack_eng = data_eng;
	this_pack_pol = data_pol;
	this_pack_examples = data_examples;
	for(var i = 0; i < data_eng.length; i++) {
		var child = i + 1;
		if (data_lang === "eng"){
			$(".audio_files audio:nth-child(" + child + ")").attr("src", "audio/" + data_eng[i] + ".mp3");
		} else {
			$(".audio_files audio:nth-child(" + child + ")").attr("src", "audio/" + data_audio[i] + ".mp3");
		}
		if (i < 10) {
			$("#one_eng p:nth-child(" + child + ")").text(data_eng[i]); 
			$("#one_pol p:nth-child(" + child + ")").text(data_pol[i]);
		} else if (i < 20) {
			child -= 10;
			$("#two_eng p:nth-child(" + child + ")").text(data_eng[i]); 
			$("#two_pol p:nth-child(" + child + ")").text(data_pol[i]);
		} else {
			child -= 20;
			$("#three_eng p:nth-child(" + child + ")").text(data_eng[i]); 
			$("#three_pol p:nth-child(" + child + ")").text(data_pol[i]);			
		};
	};
};

nextPack(data01_e, data01_p, data01_examples);


var update_progress = function(){
	var progress = (prev_task_group_coor * 100) / lesson_groups.length;
	$("#study_bar_inner").css('width', progress + "%");
	$("#count" + current_level).text(Math.floor(progress) + " %");
	console.log("coor * 100 is " + prev_task_group_coor * 100 + " groups leangth is " + lesson_groups.length + " which divided gives " + progress)
};

var random_keys = function(word){      // generates array of keys for keyboard
	// for keyboard with 11 letters
	var alpha_letters = "abcdefghijklmnopqrstuvwxyz";
	shuffle(alpha_letters);
	var key_letters = [];
	var unique_keys = [];
	for (i=0; i<word.length ;i++) {
		key_letters.push(word.substr(i,1));
	};
	$.each(key_letters, function(i, el){
	    if($.inArray(el, unique_keys) === -1) unique_keys.push(el);
	});
	for (i=0; i<alpha_letters.length ;i++) {
		var alpha_let = alpha_letters.substr(i,1);
		if ($.inArray(alpha_let, unique_keys) == -1) {
			unique_keys.push(alpha_let);
		};
		if (unique_keys.length === 11) {
			return shuffle(unique_keys);
		};
	};	
};

var light_green = function(){
	//setTimeout( function() {
	    update_progress();
		//$(item_id).css({
			//'background-color':'#00CC00',
			//'color':'white',
			//'text-shadow':'none'

			//'color':'#67FF4D',
			//'text-shadow': 'text-shadow:0px 0px 5px green;'
			//'text-shadow': '0px 0px 10px rgba(255,255,255,0.6), 0px 0px 30px rgba(255,255,255,0.4), 0px 0px 50px rgba(255,255,255,0.3), 0px 0px 180px rgba(255,255,255,0.3)',
			//'color': '#67FF4D',           #67FF4D
		//});
 
			$("#study_bar_inner").css({
				'box-shadow': '0px 0px 8px green',
				'background-color': '#67FF4D'
			});

	//}, delay);
	if (prev_task_group_coor !== lesson_groups.length) { 
		setTimeout( function() {
			//$(item_id).css({
				//'background-color':'#f6f6f6',
				//'color':'#333',
				//'text-shadow':'0 1 0 #f3f3f3'
				//'color':'white',
				//'text-shadow': '0 1px 0 #101010'
			//});
			$("#study_bar_inner").css({
				'box-shadow': 'none',
				'background-color': '#56BCEF'
			})
		}, time_delay);
	};
}

var light_red = function(){ 
		$("#study_bar_inner").css({
			'box-shadow': '0px 0px 7px #E04836',
			'background-color': '#F2583E'
		});
	setTimeout( function() {
		$("#study_bar_inner").css({
			'box-shadow': 'none',
			'background-color': '#56BCEF'
		})
	}, time_delay);
}

var button_bind = function(but_id, transl){
	$(but_id).off();
	console.log("but id: " + $(but_id).text());
	console.log("transl: " + transl);
	if ($(but_id).text() === transl) {
		$(but_id).on('tap', function(e) {
			playAudio('success');
			reaction("true");
			light_green(); 
		});
	} else {
		$(but_id).on('tap', function(e) {
			reaction("false");
			light_red()
		});
	};
};

english_vocab = data01_e; 


task_content = function(task, word){     // fills in a view with appropriate data
	if (task === "present") {
		$("#present_eng").text(this_pack_eng[word]);
		$("#present_pol").text(this_pack_pol[word]);
		$("#present_example").text(this_pack_examples[word]);
		$("#present_audio").attr("onclick", "playAudio('audio" + (word + 1) + "')");
		$("#present_img").attr("src", "images/" + english_vocab[word] + ".jpg");
		$("#cont_pres").off();
		$("#cont_pres").on('tap', function(e) {
		    playAudio('success');
			reaction("true");
			light_green();
		});
	}
	else if (task === "eng_pol") {
		$("#eng_pol_audio").attr("onclick", "playAudio('audio" + (word + 1) + "')");
		$("#eng_pol_eng").text(this_pack_eng[word]);
		var shuffled_ans = draw_four(this_pack_pol[word], this_pack_pol);
		$("#eng_pol_li1").text(shuffled_ans[0]);
		$("#eng_pol_li2").text(shuffled_ans[1]);
		$("#eng_pol_li3").text(shuffled_ans[2]);
		$("#eng_pol_li4").text(shuffled_ans[3]);
		button_bind("#eng_pol_li1", this_pack_pol[word]);
		button_bind("#eng_pol_li2", this_pack_pol[word]);
		button_bind("#eng_pol_li3", this_pack_pol[word]);
		button_bind("#eng_pol_li4", this_pack_pol[word]);
	}
	else if (task === "sound") {
		$("#sound_audio").attr("onclick", "playAudio('audio" + (word + 1) + "')");
		var shuffled_ans = draw_four(this_pack_pol[word], this_pack_pol);
		$("#sound_li1").text(shuffled_ans[0]);
		$("#sound_li2").text(shuffled_ans[1]);
		$("#sound_li3").text(shuffled_ans[2]);
		$("#sound_li4").text(shuffled_ans[3]);
		button_bind("#sound_li1", this_pack_pol[word]);
		button_bind("#sound_li2", this_pack_pol[word]);
		button_bind("#sound_li3", this_pack_pol[word]);
		button_bind("#sound_li4", this_pack_pol[word]);
	}
	else if (task === "example") {
		$("#example_img").attr("src", "images/" + english_vocab[word] + ".jpg");
		var pattern = new RegExp(this_pack_eng[word], 'gi');
		var replaced =  this_pack_examples[word].replace(pattern, ".....");
		$("#example_example").text(replaced);    /blue/gi
		var shuffled_ans = draw_four(this_pack_eng[word], this_pack_eng);
		$("#example_li1").text(shuffled_ans[0]);
		$("#example_li2").text(shuffled_ans[1]);
		$("#example_li3").text(shuffled_ans[2]);
		$("#example_li4").text(shuffled_ans[3]);
		button_bind("#example_li1", this_pack_eng[word]);
		button_bind("#example_li2", this_pack_eng[word]);
		button_bind("#example_li3", this_pack_eng[word]);
		button_bind("#example_li4", this_pack_eng[word]);
	}
	else if (task === "rewrite") {
		$("#rewrite_audio").attr("onclick", "playAudio('audio" + (word + 1) + "')");
		$("#rewrite_eng").text(this_pack_eng[word]);
		var keys = random_keys(this_pack_eng[word]);
		$(".key_rewrite").each(function(idx){
			$(this).text(keys[idx]);
		});
		$("#input_field_rewrite").attr('value', "");
		$("#sub_rewrite").off();
		$("#sub_rewrite").on('tap', function(e) {
			if ($("#input_field_rewrite").attr('value') === $("#rewrite_eng").text()) {
				playAudio('success');
				reaction("true");
				light_green();
			} else {light_red()};
		}); 
	}
	else if (task === "writing") {
		$("#writing_pol").text(this_pack_pol[word]);
		var keys = random_keys(this_pack_eng[word]);
		$(".key_writing").each(function(idx){
			$(this).text(keys[idx]);
		});
		$("#sub_writing").off();
		$("#input_field_writing").attr('value', "");
		$("#sub_writing").on('tap', function(e) {
			if ($("#input_field_writing").attr('value') === this_pack_eng[word]) {
				playAudio('success');
				reaction("true");
				light_green();
			} else {
				reaction("false");
				light_red()
			};
		}); 		
	}
	else if (task === "dictation") {
		$("#dictation_audio").attr("onclick", "playAudio('audio" + (word + 1) + "')");
		var keys = random_keys(this_pack_eng[word]);
		$(".key_dictation").each(function(idx){
			$(this).text(keys[idx]);
		});
		$("#sub_dictation").off();
		$("#input_field_dictation").attr('value', "");
		$("#sub_dictation").on('tap', function(e) {
			if ($("#input_field_dictation").attr('value') === this_pack_eng[word]) {
				playAudio('success');
				reaction("true");
				light_green();
			} else {
				reaction("false");
				light_red();
			};
		}); 
	};
};

task_content("present", 0);     // loading the first view: present

var original_groups = [     // list of [task-type, word nr in data-set]
	[1,0],[1,1],[1,2],[2,0],[3,0],[2,1],[2,2], 
	[3,1],[4,0],[1,3],[1,4],[1,5],[3,2],[2,3],
	[2,4],[3,3],[4,1],[4,2],[5,0],[6,0],[5,1],
	[1,6],[1,7],[1,8],[1,9],[2,5],[2,6],[3,4],
	[4,4],[4,3],[3,5],[2,7],[3,6],[4,5],[7,0],
	[6,1],[5,2],[7,1],[6,2],[5,3],[2,8],[4,6],
	[5,4],[3,7],[2,9],[5,5],[4,7],[3,8],[5,6],
	[6,3],[7,2],[6,4],[7,3],[6,5],[4,8],[7,6],
	[7,4],[3,9],[6,6],[7,5],[5,7],[4,9],[5,8],
	[6,7],[7,7],[6,8],[5,9],[6,9],[7,8],[7,9]
];

var lesson_groups = JSON.parse( JSON.stringify( original_groups ) );

var num_tasks = {
	1:"present",
	2:"eng_pol",
	3:"rewrite",
	4:"example",
	5:"dictation",
	6:"sound",
	7:"writing"
};

var prev_task_group_coor = 0;
var previous_task_name = "present";

var reaction = function(is_correct){     // finds next task, presents it & updates lesson_groups
	console.log("last group_coor: ", prev_task_group_coor);
	if (is_correct === "false") {
		console.log("incorrect answer"); 
		if (prev_task_group_coor > lesson_groups.length - 5) { 
			lesson_groups.splice(lesson_groups.length, 0, lesson_groups[prev_task_group_coor]); // copy current coordinate to the end
		} else {
			lesson_groups.splice(prev_task_group_coor + 3, 0, lesson_groups[prev_task_group_coor]); // copy current coordinate 3 places forward
		}
		lesson_groups.splice(prev_task_group_coor + 1, 0, [1,lesson_groups[prev_task_group_coor][1]]); // insert 'present' task as the next item 
	};
	prev_task_group_coor += 1;
	if (prev_task_group_coor === lesson_groups.length) {  
	 	setTimeout( function() {
			$("#" + previous_task_name).hide();
			$("#lesson_end").show();
		}, time_delay);
		return
    };
    console.log("next group_coor: ", prev_task_group_coor);
    var next_task_name = num_tasks[lesson_groups[prev_task_group_coor][0]]; // eg present
	var next_word_num = lesson_groups[prev_task_group_coor][1]; // eg 1 (elephant)
	setTimeout( function() {
		task_content(next_task_name, next_word_num);
		$("#" + previous_task_name).hide();
		$("#" + next_task_name).show();
	    previous_task_name = next_task_name;  
    }, time_delay);
};

/*
function playAudio(id) {      // plays audio in PhoneGap	
    var audioElement = document.getElementById(id);
    var url = getPhoneGapPath() + audioElement.getAttribute('src');
    var my_media = new Media(url,
            function () {
                my_media.release();
            },
            function (err) {
                my_media.release();
            }
    );
    my_media.play();
};
*/



function playAudio(id) {      // plays audio in browser
	var audio_file = document.getElementById(id);
	audio_file.play();
}




$("#quit").bind('tap', function(e) {     // quits the app
	navigator.app.exitApp() 
});


var current_div = "#pg1";

var new_view = function (button_id, page_id){     // jumps through the menu
	$(button_id).bind('tap', function(e) {
	    $(current_div).hide();
	    console.log("switching to " + page_id);
	    console.log("button_id: " + button_id);
	    $(page_id).show();
	    console.log("current div before: " + current_div);
	    current_div = page_id;
	    console.log("current div after: " + current_div);
	    console.log("   ");
	    if (button_id === "#listview" || button_id === "#test") {
	    	$("#navpanel").panel( "close" );
	    	$("#header").text(button_id.charAt(1).toUpperCase() + button_id.slice(2));
	    } else if (button_id === "#study") {
	        $("#navpanel").panel( "close" );
	    	$("#header").text("Lesson " + current_level);
	    }
	});
};



var make_keyboard = function (key, key_back, input_field){     // enables buttons in keyboard  
	var $inp = $(input_field);
	$(key).bind('tap', function(e) {      // enables keys
		$inp.attr("value", $inp.attr("value") + $(this).text());
	});
	$(key_back).bind('tap', function(e) {      // enables backspace
		$inp.attr(  "value",  $inp.attr("value").slice(0,-1) );
	});
};

make_keyboard(".key_writing", ".key_back_writing", "#input_field_writing");
make_keyboard(".key_rewrite", ".key_back_rewrite", "#input_field_rewrite");
make_keyboard(".key_dictation", ".key_back_dictation", "#input_field_dictation");

new_view('#listview', '#pg1');
new_view('#study', '#pg3');
new_view('#test', '#pg4');


$("#next_lesson").on('tap', function(e) {
	current_level += 1;
	$("#header").text("Lesson " + current_level);
	lesson_groups = JSON.parse( JSON.stringify( original_groups ) );
	for (i=0; i<original_groups.length ;i++) {
		lesson_groups[i][1] += (current_level - 1) * 10;
	};
	console.log(lesson_groups);
	prev_task_group_coor = 0;
	previous_task_name = "present";
	task_content("present", lesson_groups[0][1]);
	$("#study_bar_inner").css('width', "0%");
	$("#count" + current_level).text("0 %");
	$('#lesson_end').hide();
	$('#present').show();
	if (current_level < 3) {
		$('#next_lesson').text("Start Lesson " + (current_level + 1));
	} else {
		$('#next_lesson').hide();
		$('#go_test').show();
	}
});

$("#download").on('tap', function(e) {
	english_vocab = english_pics;
	data_lang = "nor";
	nextPack(data02_e, data02_p, data02_examples);
	current_level = 1;
	lesson_groups = JSON.parse( JSON.stringify( original_groups ) );

	if (prev_task_group_coor != lesson_groups.length) {
		var task_showing = num_tasks[lesson_groups[prev_task_group_coor][0]];
		console.log(task_showing);
		$('#' + task_showing).hide();
	} else {
		$('#lesson_end').hide();
	};

	prev_task_group_coor = 0;
	previous_task_name = "present";
	task_content("present", lesson_groups[0][1]);
	$("#study_bar_inner").css('width', "0%");
	$("#count1").text("0 %");
	$("#count2").text("0 %");
	$("#count3").text("0 %");
	$('#present').show();
	$('#next_lesson').text("Start Lesson " + (current_level + 1));
	$('#next_lesson').show();
	$('#go_test').hide();
	$("#header").text("Listview");
	$('#pg4').hide();
	$('#pg1').show();
	current_div = "#pg1";
});