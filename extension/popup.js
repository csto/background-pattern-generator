var api = 'https://api.github.com/repos/subtlepatterns/SubtlePatterns/contents/?callback=loadPatterns';
var patterns = [];
var page = 1;

loadPatterns = function (response) {
  for (var i in response.data) {
    var file = response.data[i];
    if (/\.png$/.test(file.name)) {
      patterns.push(file);
    }
  }
}

createPatterns = function () {
  for (var i = 0; i < 12; i++) {
    $div = $('<div></div>');
    $div.addClass('pattern');
    $('#patterns').append($div);
  }
}

showPatterns = function (page) {
  var total = Math.ceil(patterns.length / 12);
  $('#page').html(page + '/' + total);
  var list = patterns.slice(page * 12 - 12, page * 12);
  $patterns = $('.pattern');
  for (var i in list) {
    var file = list[i];
    console.log(file);
    var url = 'https://raw.github.com/subtlepatterns/SubtlePatterns/master/' + file.name;
    
    $($patterns[i]).css({
      'background-image': 'url(' + url + ')'
    }).data('url', url).data('name', file.name);
  }
}

process = function () {
  $('#image').html('<img src=' + $('.selected').data('url') + ' />');
  var color = $('#color').val();
  var opacity = $('#opacity').val() / 100;
  var blend = $('#blend').val();
  var pattern = $('#image img')[0];
  var canvas = $('#canvas')[0];

	var context = canvas.getContext('2d');
	context.beginPath();
  context.rect(0, 0, 1500, 1500);
  context.fillStyle = color;
  context.fill();
  
  if (blend === 'normal' && opacity === 1) {
    opacity = 0;
  }
  
  Pixastic.process(pattern, "blend", { amount: opacity, mode: blend, image: canvas }, function () {
    var canvas = $('#image canvas')[0];
    $('#download').attr('href', canvas.toDataURL('image/png').replace('data:image/png', 'data:application/octet-stream'));
    $('#download').attr('download', $('.selected').data('name'));
    $('#download').prop('disabled', false);
    chrome.extension.sendMessage({
      pattern: canvas.toDataURL('image/png'),
      selector: $('#target').val()
    });
  });
}

$(document).on('click', '.pattern', function () {
  $('.pattern').removeClass('selected');
  $(this).addClass('selected');
  process();
});

$(document).on('click', '#next', function () {
  var total = Math.ceil(patterns.length / 12);
  if (page < total) {
    $('.pattern').removeClass('selected');
    $('#prev').prop('disabled', false);
    page++;
    showPatterns(page);
    if (page === total) {
      $('#next').prop('disabled', true);
    }
  }
});

$(document).on('click', '#prev', function () {
  if (page > 1) {
    $('.pattern').removeClass('selected');
    $('#next').prop('disabled', false);
    page--;
    showPatterns(page);
    if (page === 1) {
      $('#prev').prop('disabled', true);
    }
  }
});

$(function () {
  $('#color').minicolors();
  createPatterns();
  showPatterns(page);
  
  $('#color').change(function () {
    process();
  });

  $('#blend').change(function () {
    process();
  });
  
  $('#opacity-range').change(function () {
    $('#opacity').val($(this).val());
    process();
  });
  
  $('#opacity').change(function () {
    $('#opacity-range').val($(this).val());
    process();
  });
  
});