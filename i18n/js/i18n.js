/**
 * cookie操作
 */
//var ctx = [[@{/}]]

var getCookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var s = [cookie, expires, path, domain, secure].join('');
        var secure = options.secure ? '; secure' : '';
        var c = [name, '=', encodeURIComponent(value)].join('');
        var cookie = [c, expires, path, domain, secure].join('')
        document.cookie = cookie;
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

/**
 * 获取浏览器语言类型
 * @return {string} 浏览器国家语言
 */
var getNavLanguage = function(){
    if(navigator.appName == "Netscape"){
        var navLanguage = navigator.language;
        return navLanguage.substr(0,2);
    }
    return false;
}

/**
 * 设置语言类型： 默认为中文
 */
var i18nLanguage = "zh";
/*
设置一下网站支持的语言种类
 */
var webLanguage = ['zh', 'en', 'vi'];

/**
 * 执行页面i18n方法
 * @return
 */
var execI18n = function(Ii8nObj){
    console.log('i18nLanguage11111111', i18nLanguage)
    console.log(localStorage.getItem("curLanguage"))

    /*
    获取一下资源文件名
     */
    // var optionEle = $("#i18n_pagename");
    // if (optionEle.length < 1) {
    //     console.log("未找到页面名称元素，请在页面写入\n <meta id=\"i18n_pagename\" content=\"页面名(对应语言包的语言文件名)\">");
    //     return false;
    // };
    // var sourceName = optionEle.attr('content');
    // sourceName = sourceName.split('-');
    /*
    首先获取用户浏览器设备之前选择过的语言类型
     */
    if (localStorage.getItem("curLanguage")) {
        i18nLanguage = localStorage.getItem("curLanguage")
        $('#bootstrap-table').attr('data-locale', i18nLanguage);
    } else {
        // 获取浏览器语言
        var navLanguage = getNavLanguage();
        if (navLanguage) {
            // 判断是否在网站支持语言数组里
            var charSize = $.inArray(navLanguage, webLanguage);
            if (charSize > -1) {
                i18nLanguage = navLanguage;
                // 存到缓存中
                localStorage.setItem("curLanguage", navLanguage)
            };
        } else{
            console.log("not navigator");
            return false;
        }
    }
    /* 需要引入 i18n 文件*/
    if ($.i18n == undefined) {
        console.log("请引入i18n js 文件")
        return false;
    };
    console.log('i18nLanguage222222', i18nLanguage)
    /*
    这里需要进行i18n的翻译
     */
    jQuery.i18n.properties({
        // name : sourceName, //资源文件名称
        name : 'common',
        path :ctx + "system/language/" + i18nLanguage, //资源文件路径
        //path : 'http://192.168.102.61:8081/' + i18nLanguage, //资源文件路径
        mode : 'both', //用Map的方式使用资源文件中的值
        language : i18nLanguage,
        callback : function() {//加载成功后设置显示内容
            Ii8nObj && Object.keys(Ii8nObj).forEach(function (iKey) {
                console.log(Ii8nObj)
                console.log(iKey)
                var content_js = $.i18n.prop(iKey.toString()) ? $.i18n.prop(iKey.toString()) : iKey.toString()
                Ii8nObj[iKey] = content_js
            })

            var insertEle = $(".i18n");
            console.log(".i18n 写入中...");
            insertEle && insertEle.each(function() {
                // 根据i18n元素的 name 获取内容写入
                var content = $.i18n.prop($(this).attr('name')) ? $.i18n.prop($(this).attr('name')) : $(this).attr('name')
                $(this).html(content);
            });
            console.log("写入完毕");

            console.log(".i18n-input 写入中...");
            var insertInputEle = $(".i18n-input");
            insertInputEle && insertInputEle.each(function() {
                var selectAttr = $(this).attr('selectattr');
                if (!selectAttr) {
                    selectAttr = "value";
                };
                var content2 = $.i18n.prop($(this).attr('selectname')) ? $.i18n.prop($(this).attr('selectname')) : $(this).attr('selectname')

                $(this).attr(selectAttr, content2);
            });
            console.log("写入完毕");

        }
    });
}
