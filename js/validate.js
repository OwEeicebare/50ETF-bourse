$('form').validate({
  onFocus: function () {
    this.parent().addClass('active');
    return false;
  },
  onBlur: function () {
    var $parent = this.parent();
    var _status = parseInt(this.attr('data-status'));
    $parent.removeClass('active');
    if (!_status) {
      $parent.addClass('error');
    }
    return false;
  }
});



$('form').on('submit', function (event) {
  event.preventDefault();
  var er = $(this).validate('submitValidate')
  console.log(er);
  if (er) {
    $("[type='submit']").attr("lay-submit", "sub_btn").click()
  }
  //return boolean;
});