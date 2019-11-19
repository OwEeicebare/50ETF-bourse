
function uio(){
  return $("#signupForm").validate({
    
    onfocusout: function(element) { $(element).valid(); } ,
 rules: {
   firstname: "required",
   lastname: "required",
   chengjiaojiage:"digits",
   username: {
     required: true,
     minlength: 2
   },
   password: {
     required: true,
     minlength: 5
   },
   confirm_password: {
     required: true,
     minlength: 5,
     equalTo: "#password"
   },
   email: {
     required: true,
     email: true
   },
   "topic[]": {
     required: "#newsletter:checked",
     minlength: 2
   },
   agree: "required",
     
 },
 messages: {
   firstname: "请输入您的名字",
   lastname: "请输入您的姓氏",
   chengjiaojiage:"只能填写数字",
   username: {
     required: "请输入用户名",
     minlength: "用户名必需由两个字母组成"
   },
   password: {
     required: "请输入密码",
     minlength: "密码长度不能小于 5 个字母"
   },
   confirm_password: {
     required: "请输入密码",
     minlength: "密码长度不能小于 5 个字母",
     equalTo: "两次密码输入不一致"
   },
   email: "请输入一个正确的邮箱",
   agree: "请接受我们的声明",
   topic: "请选择两个主题"
 },

  errorPlacement: function(error, element) {
    // Append error within linked label
    $( element )
      .closest( "form" )
        .find( "div[for='" + element.attr( "id" ) + "']" )
          .append( error );
  },
  errorElement: "div",

});
}