/**
 * Created by Leon on 2017/3/15.
 */
var Iot = {
    init: function () {
    },

    getTime: function (cc) {
        var mouth = (cc.getMonth() + 1) > 9 ? (cc.getMonth() + 1) : '0' + (cc.getMonth() + 1);
        var day = cc.getDate() > 9 ? cc.getDate() : '0' + cc.getDate();
        var hour = cc.getHours() > 9 ? cc.getHours() : +'0' + cc.getHours();
        var minutes = cc.getMinutes() > 9 ? cc.getMinutes() : '0' + cc.getMinutes();
        var seconds = cc.getSeconds() > 9 ? cc.getSeconds() : '0' + cc.getSeconds();
        cc = cc.getFullYear() + '-' + mouth + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
        return cc
    },

    //绘制横向柱状图
    barTable: function (title, unit, data, sendTime, xzip, dom_id) {

        //// 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById(dom_id));
        var option = {
            title: {
                text: title,
                left: 'center'

            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    params = params[0];
                    return params.name + ' : ' + params.value;
                },
                axisPointer: {
                    animation: false
                }
            },
            xAxis: {
                type: 'category',
                splitLine: {
                    show: false
                },
                data: sendTime,
                name: "时间"
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: false
                },
                name: unit
            },
            series: [{
                name: '温度',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: data
            }],
            dataZoom: [
                {
                    show: true,
                    type: 'slider',
                    start: 0,
                    end: 100
                }
            ]
        };
        myChart.setOption(option);


    },
    getData: function () {

        var time = new Date();
        var current_time = Iot.getTime(time);
        var before_time = +new Date(time) - 60 * 60 * 1000 * 24 * 30;
        before_time = new Date(before_time);
        before_time = Iot.getTime(before_time);

        $.ajax({
            url: iot_api,
            type: 'GET',
            data: {
                start_time: before_time,
                end_time: current_time
            }
            ,
            success: function (data) {
                if (data.status == 0) {
                    var sendTime = [];
                    var data1 = [];
                    var data2 = [];
                    var data3 = [];
                    var data4 = [];
                    var data5 = [];
                    data.result.forEach(function (item) {
                        sendTime.push(item.send_time);
                        data1.push(item.data1);
                        data2.push(item.data2);
                        data3.push(item.data3);
                        data4.push(item.data4);
                        data5.push(item.data5);
                    });
                    Iot.barTable('空气温度', "温度（ºC）", data1, sendTime, 'value', 'chart1');
                    Iot.barTable('环境亮度', "亮度（%rh）", data2, sendTime, 'value', 'chart2');
                    Iot.barTable('空气湿度', "湿度 （%）", data3, sendTime, 'value', 'chart3');
                    Iot.barTable('土壤湿度', "湿度 （%）", data4, sendTime, 'value', 'chart4');
                    Iot.barTable('实时曲线', "单位5", data5, sendTime, 'value', 'chart5');
                }
            }
        });
    }

};