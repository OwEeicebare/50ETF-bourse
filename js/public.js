(function () {
    //定义空间名
    var publicMathod = window.publicMathod || {};
    window.publicMathod = publicMathod;
    //获取token信息
    publicMathod.token = '';
    publicMathod.staffToken = '';
    //设置上传接口
    publicMathod.upload = "http://192.168.1.46:8045/api/file/upload";
    //设置基本路径


    //publicMathod.hosturl = 'http://39.100.121.192:5001/';//api
   // publicMathod.agenceUrl = 'http://39.100.121.192:5006/',//登录到代理
       // publicMathod.frontUrl = 'http://39.100.121.192:5005/#/',//登录到前台
        //publicMathod.staffUrl = 'http://39.100.121.192:5004/' //登录到平台员工

     //publicMathod.hosturl = 'http://192.168.1.103:3333/';
    //publicMathod.hosturl = 'http://192.168.1.75:8001/';
    publicMathod.hosturl = 'http://192.168.1.202:5001/';
     publicMathod.agenceUrl = 'http://192.168.1.46:8080/'// 登录代理员工
    publicMathod.frontUrl = 'http://192.168.1.202:5005/',//登录到手机端
    // publicMathod.staffUrl = 'http://192.168.1.76:8081/' //登录到平台员工

    //post请求
    publicMathod.post = function (opt) {
        opt.url = opt.url || '';
        opt.data = JSON.stringify(opt.data) || null
        opt.datatype = opt.datatype || "json";
        opt.async = opt.async || true;
        opt.success = opt.success || function () { };
        opt.error = opt.error || function () { };
        opt.role = opt.role || "admin";
        jQuery.support.cors = true;//兼容IE跨域调用出现NoTransport
        $.ajax({
            type: "post",
            url: this.hosturl + opt.url,
            data: opt.data,
            dataType: opt.datatype,
            async: opt.async,
            cache: false,
            timeout: 20000,
            contentType: "application/json; charset=UTF-8",
            headers: { "token": publicMathod.token },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                opt.error(XMLHttpRequest, textStatus, errorThrown);
            },
            beforeSend: function (XMLHttpRequest, textStatus) {
                publicMathod.token = localStorage.getItem('Token') != null ? unescape(localStorage.getItem('Token')) : publicMathod.token;
       
                if (!publicMathod.token) {

                    layer.msg("您的登录失效了,请重新登录", { icon: 5, shade: 0.5, time: 1000 }, function () {
                        parent.location.href = '/login.html';
                    });
                    return false;
                }
            },
            complete: function (XMLHttpRequest, textStatus) {
            },
            success: function (data) {

                if (data.Status == "401") {
                    window.localStorage.clear()
                    layer.msg("您的登录失效了,请重新登录", { icon: 5, shade: 0.5, time: 1000 }, function () {
                        parent.location.href = '/login.html';
                    });
                }
                opt.success(data);
            }
        });
    }
       
    //get请求
    publicMathod.get = function (opt) {
        opt.url = opt.url || '';
        opt.data = opt.data || null;
        opt.datatype = opt.datatype || "json";
        opt.async = opt.async || true;
        opt.success = opt.success || function () { };
        opt.error = opt.error || function () { };
        opt.role = opt.role || "admin";
        jQuery.support.cors = true;//兼容IE跨域调用出现NoTransport
        $.ajax({
            type: "get",
            url: this.hosturl + opt.url,
            data: opt.data,
            dataType: opt.datatype,
            async: opt.async,
            cache: false,
            timeout: 20000,
            headers: { "token": this.token },
            contentType: "application/json; charset=UTF-8",
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                opt.error(XMLHttpRequest, textStatus, errorThrown);
            },
            beforeSend: function (XMLHttpRequest, textStatus) {
                publicMathod.token = localStorage.getItem('Token') != null ? unescape(localStorage.getItem('Token')) : publicMathod.token;
                if (!publicMathod.token) {
                    parent.location.href = '/login.html';
                    return false;
                }
            },
            complete: function (XMLHttpRequest, textStatus) {
            },
            success: function (data) {
                opt.success(data);
            }
        });
    }
    //获取url参数
    publicMathod.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }
     //获取页面权限
     publicMathod.getPermission = function (menuId,callback) {
        this.post({
            url:"api/SystemRole/GetPageRole",
            data:{"MenuID":menuId},
            success: function (result) {
                var Permission = result.Data;
                if(Permission == null){
                    layer.msg("您的登录失效了,请重新登录", { icon: 5, shade: 0.5, time: 1000 }, function () {
                        parent.location.href = '/login.html';
                    });
                }else{     
                    callback(result.Data) ;
                }
            }
        })
    }
    /** 
     * 加载所有代理商，三级下拉列表
     * urls：接口
     * forms：所在layui的form表单
     * obj：加载到的列表dom元素
     * 详细参考user/user_lsit.html用例
     * */
    publicMathod.getAllAgency = function (urls, forms, obj) {
        this.post({
            url: urls,
            success: function (result) {
                var str = "";
                for (var i = 0, len1 = result.Data.length; i < len1; i++) {
                    str += '<option value="' + result.Data[i].id + '">' + result.Data[i].title + '</option>';
                    for (var z = 0, len2 = result.Data[i].ChildNodes.length; z < len2; z++) {
                        str += '<option value="' + result.Data[i].ChildNodes[z].id + '">&emsp;' + result.Data[i].ChildNodes[z].title + '</option>';
                        for (var k = 0, len3 = result.Data[i].ChildNodes[z].ChildNodes.length; k < len3; k++) {
                            str += '<option value="' + result.Data[i].ChildNodes[z].ChildNodes[k].id + '">&emsp;&emsp;' + result.Data[i].ChildNodes[z].ChildNodes[k].title + '</option>';
                        }
                    }
                }
                obj.append(str);
                forms.render(); //更新全部
            }
        });
    }
    /** 
     * 加载所有母账号
     * urls：接口
     * forms：所在layui的form表单
     * obj：加载到的列表dom元素
     * 详细参考user/user_lsit.html用例
     * */
    publicMathod.getAllMotherAccount = function (urls, forms, obj) {
        this.post({
            url: urls,
            data: {
                "Ds": 0,
                "Ps": 0,
                "AgentId": 0,
                "page": 0,
                "limit": 0,
                "OrderKey": "",
                "Sort": "",
                "SearchKey": ""
            },
            success: function (result) {
                var str = "";
                for (var i = 0, len = result.Data.MaList.length; i < len; i++) {
                    // str += '<option value="'+result.Data.MaList[i].Id+'">'+result.Data.MaList[i].Ai+'</option>'
                    str += '<option value="' + result.Data.MaList[i].Id + '">' + result.Data.MaList[i].Id + '</option>'
                }
                obj.append(str);
                forms.render(); //更新全部
            }
        })
    }
    //获取下拉列表选中的文本
    publicMathod.getSelectText = function (objs) {
        var obj = document.getElementById(objs);
        for (i = 0; i < obj.length; i++) {
            if (obj[i].selected == true) {
                obj = obj[i].innerText.trim();//关键是通过option对象的innerText属性获取到选项文本
            }
        }
        return obj;
    }
    //非零正整数验证
    publicMathod.zznumber = function (str) {
        return /^\+?[1-9][0-9]*$/.test(str)
    }


    //加载下拉列表 适用于一级目录
    //2、参数：
    //urls：接口
    //forms：所在layui的form表单
    //obj：加载到的列表dom元素
    //详细参考user/user_lsit.html用例
    publicMathod.getDropdownList = function (urls, forms, obj) {
        this.post({
            url: urls,
            success: function (result) {
                var str = "";
                for (var i = 0; i < result.Data.length; i++) {
                    str += '<option value="' + result.Data[i].Id + '">' + result.Data[i].Name + '</option>';
                }
                obj.append(str);
                forms.render(); //更新全部
            }
        });
    }

    // 获取经理目录
    publicMathod.getJingLiList = function (urls, forms, obj) {
        this.post({
            url: urls,
            success: function (result) {
                var str = "";
                for (var i = 0; i < result.Data.length; i++) {
                    str += '<option value="' + result.Data[i].id + '">' + result.Data[i].stame + '</option>';
                }
                obj.append(str);
                forms.render(); //更新全部
            }
        });
    }


    //添加单选按钮
    //参数：
    //urls:接口
    //forms：所在layui的form表单
    //obj：加载到的列表dom元素
    //name:自定义名称
    //详细参考system/administrator_edit.html用例
    publicMathod.getRadio = function (urls, forms, obj, name) {
        this.post({
            url: urls,
            success: function (result) {
                var str = "";
                for (var i = 0; i < result.Data.length; i++) {
                    if (i == 0) {
                        str += '<input type="radio" name="' + name + '" lay-filter="' + name + '"  value="' + result.Data[i].Id + '" title="' + result.Data[i].Name + '" checked="">';
                    } else {
                        str += '<input type="radio" name="' + name + '" lay-filter="' + name + '" value="' + result.Data[i].Id + '" title="' + result.Data[i].Name + '">';
                    }

                }
                obj.append(str);
                forms.render(); //更新全部
            }
        });
    }



    //数组去重
    //参数 ：数组
    //返回 ：去重后的数组
    publicMathod.arrayRemoveItem = function (arr) {
        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = i + 1; j < arr.length; j++) {
                if (arr[i] == arr[j]) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr;
    }



    //平台员工
    //post请求
    publicMathod.staffPost = function (opt) {
        opt.url = opt.url || '';
        opt.data = JSON.stringify(opt.data) || null;
        opt.datatype = opt.datatype || "json";
        opt.async = opt.async || true;
        opt.success = opt.success || function () { };
        opt.error = opt.error || function () { };
        opt.role = opt.role || "admin";
        jQuery.support.cors = true;//兼容IE跨域调用出现NoTransport
        $.ajax({
            type: "post",
            url: this.hosturl + opt.url,
            data: opt.data,
            dataType: opt.datatype,
            async: opt.async,
            cache: false,
            timeout: 20000,
            contentType: "application/json; charset=UTF-8",
            headers: { "token": this.staffToken },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                opt.error(XMLHttpRequest, textStatus, errorThrown);
            },
            beforeSend: function (XMLHttpRequest, textStatus) {
                this.staffToken = sessionStorage.getItem('Token') != null ? unescape(sessionStorage.getItem('Token')) : this.staffToken;
                if (!publicMathod.staffToken) {
                    parent.location.href = '/login.html';
                    return false;
                }
            },
            complete: function (XMLHttpRequest, textStatus) {
                 //console.log('请求状态', textStatus);
            },
            success: function (data) {

                if (data.Status == "401") {
                    window.sessionStorage.clear()
                    layer.msg("您的登录失效了,请重新登录", { icon: 5, shade: 0.5, time: 1000 }, function () {
                        parent.location.href = '/login.html';
                    });
                }
                opt.success(data);
            }
        });
    }
    //加载下拉列表 适用于一级目录
    //2、参数：
    //urls：接口
    //forms：所在layui的form表单
    //obj：加载到的列表dom元素
    //详细参考user/user_lsit.html用例
    publicMathod.getStaffDropdownList = function (urls, forms, obj) {
        this.staffPost({
            url: urls,
            success: function (result) {
                var str = "";
                for (var i = 0; i < result.Data.length; i++) {
                    str += '<option value="' + result.Data[i].Id + '">' + result.Data[i].Name + '</option>';
                }
                obj.append(str);
                forms.render(); //更新全部
            }
        });
    }
    /** 
     * 加载所有代理商，三级下拉列表
     * urls：接口
     * forms：所在layui的form表单
     * obj：加载到的列表dom元素
     * 详细参考user/user_lsit.html用例
     * */
    publicMathod.getAllStaffAgency = function (urls, forms, obj) {
        this.staffPost({
            url: urls,
            success: function (result) {
                var str = "";
                for (var i = 0, len1 = result.Data.length; i < len1; i++) {
                    str += '<option value="' + result.Data[i].id + '">' + result.Data[i].title + '</option>';
                    for (var z = 0, len2 = result.Data[i].ChildNodes.length; z < len2; z++) {
                        str += '<option value="' + result.Data[i].ChildNodes[z].id + '">&emsp;' + result.Data[i].ChildNodes[z].title + '</option>';
                        for (var k = 0, len3 = result.Data[i].ChildNodes[z].ChildNodes.length; k < len3; k++) {
                            str += '<option value="' + result.Data[i].ChildNodes[z].ChildNodes[k].id + '">&emsp;&emsp;' + result.Data[i].ChildNodes[z].ChildNodes[k].title + '</option>';
                        }
                    }
                }
                obj.append(str);
                forms.render(); //更新全部
            }
        });
    }

    //导出报表
    
    publicMathod.exportExcel = function (url, fileNameC, data) {
        var loading = layer.msg('加载中',{icon:16,shade:0.3,time:0});
        var exportUrl = publicMathod.hosturl + url;
        var fileName = fileNameC + (new Date().Format("yyyy-MM-dd"));
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : null;
        //设置响应类型为blob类型
        xhr.responseType = "blob";
        xhr.onload = function () {
            if (this.status == "200") {
                //获取响应文件流　　
                var blob = this.response;
                var aElem = document.getElementById("downloadExcel");
                //将文件流保存到a标签
                aElem.href = window.URL.createObjectURL(blob);
                aElem.download = fileName + '.xls';
                layer.close(loading);
                layer.confirm('文件已导出, 立即下载？', function (index) {
                    aElem.click();
                    layer.close(index);
                });
            }
        }
        xhr.open("post", exportUrl, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhr.setRequestHeader("token", publicMathod.token);
        xhr.send(JSON.stringify(data));
    }




    Date.prototype.Format = function (fmt) { //author: meizz   
        var o = {
            "M+": this.getMonth() + 1,                 //月份   
            "d+": this.getDate(),                    //日   
            "h+": this.getHours(),                   //小时   
            "m+": this.getMinutes(),                 //分   
            "s+": this.getSeconds(),                 //秒   
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
            "S": this.getMilliseconds()             //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
})()