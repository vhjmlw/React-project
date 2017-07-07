/**
 * Created by dongqiming on 2017/5/17.
 */

import $ from 'jquery';

class Request {
    synPost(url, data) {
        let result;
        $.ajax({
            type: 'POST',
            async: false,
            url: "cus/" + url,
            data: data,
            success: function (json) {
                if (json.code === "200") {
                    result = json.data;
                } else {
                    alert(json.message || "系统出错,请重新操作!");
                }
            },
            dataType: 'json',
        });
        return result;
    }
}

export default new Request();