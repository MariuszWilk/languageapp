
$(document).bind("mobileinit", function(){     // disables transitions
    $.mobile.defaultDialogTransition = "none";
    $.mobile.defaultTransition = 'none';
});

function getPhoneGapPath() {     // path to access audio files
    var path = window.location.pathname;
    path = path.substr( path, path.length - 10 );
    return 'file://' + path;
};

/*
var current_task = "#present";


var new_task = function (button_id, page_id){     // jumps between tasks
	$(button_id).bind('tap', function(e) {
	    $(current_task).hide();
	    $(page_id).show();
	    current_task = page_id;
	});
};
*/

var lesson_groups = [
	[[1,0],[1,1],[1,2],[2,0],[3,0],[2,1],[2,2]],
	[[3,1],[4,0],[1,3],[1,4],[1,5],[3,2],[2,3]],
	[[2,4],[3,3],[4,1],[4,2],[5,0],[6,0],[5,1]],
	[[1,6],[1,7],[1,8],[1,9],[2,5],[2,6],[3,4]],
	[[4,4],[4,3],[3,5],[2,7],[3,6],[4,5],[7,0]],
	[[6,1],[5,2],[7,1],[6,2],[5,3],[2,8],[4,6]],
	[[5,4],[3,7],[2,9],[5,5],[4,7],[3,8],[5,6]],
	[[6,3],[7,2],[6,4],[7,3],[6,5],[4,8],[7,6]],
	[[7,4],[3,9],[6,6],[7,5],[5,7],[4,9],[5,8]],
	[[6,7],[7,7],[6,8],[5,9],[6,9],[7,8],[7,9]]
];

var num_tasks = {
	1:"present",
	2:"eng_pol",
	3:"rewrite",
	4:"example",
	5:"dictation",
	6:"sound",
	7:"writing"
};


var this_pack = "";


function nextPack(data_eng, data_pol, data_examples) {     // updates app with new words

	for(var i = 0; i < data_eng.length; i++) {
		var child = i + 1;
		$(".audio_files audio:nth-child(" + child + ")").attr("src", "audio/" + data_eng[i] + ".mp3"); 
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

nextPack(data02_e, data02_p, data02_examples);

var prev_task_group_coor = [1,0];
var previous_task_name = "present";

var reaction = function(is_correct){
	if (is_correct === "false") {
		console.log("incorrect answer"); 
		// copy current coordinate to the next list
		// insert 'present' task as the next item 
	};
	if (prev_task_group_coor[1] === lesson_groups[prev_task_group_coor[0]].length - 1) {   //6
		prev_task_group_coor[0] += 1;
		prev_task_group_coor[1] = 0;
    } else {
		prev_task_group_coor[1] += 1;
    };
    var next_task_name = num_tasks[lesson_groups[prev_task_group_coor[0]][prev_task_group_coor[1]][0]]; // present
	var next_word_num = lesson_groups[prev_task_group_coor[0]][prev_task_group_coor[1]][1]; // elephant
    $("#" + previous_task_name).hide();
    $("#" + next_task_name).show();
    previous_task_name = next_task_name;
	console.log("next word: " + next_word_num);
};

$("#cont_pres").bind('tap', function(e) {     // ONLY CHECKING
	reaction("true");
});


/*
function playAudio(id) {      // plays audio in PhoneGap	
    var audioElement = document.getElementById(id);
    var url = getPhoneGapPath() + audioElement.getAttribute('src');
    var my_media = new Media(url,
            // success callback
             function () { console.log("playAudio():Audio Success"); },
            // error callback
             function (err) { console.log("playAudio():Audio Error: " + err); }
    );
    my_media.play();
};
*/


function playAudio(id) {      // plays audio in browser
	var audio_file = document.getElementById(id);
	audio_file.play();
}


$("#quit").bind('tap', function(e) {      // quits the app
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
	    if (button_id === "#listview" || button_id === "#progress" || button_id === "#study" || button_id === "#test") {
	    	$("#navpanel").panel( "close" );
	    	$("#header").text(button_id.charAt(1).toUpperCase() + button_id.slice(2));
	    };
	});
}



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
new_view('#progress', '#pg2');
new_view('#study', '#pg3');
new_view('#test', '#pg4');

/*
new_task("#cont_pres", "#eng_pol")
new_task("#ans_eng_pol", "#sound")
new_task("#ans_sound", "#example")
new_task("#ans_example", "#rewrite")
new_task("#sub_rewrite", "#writing")
new_task("#sub_writing", "#dictation")
new_task("#sub_dictation", "#present")
*/

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






