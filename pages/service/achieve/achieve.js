// pages/service/achieve/achieve.js
//获取应用实例
const app = getApp()
import * as echarts from '../../../ec-canvas/echarts';
var chart;

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    years: [2019,2020],
    currentYear: '',
    canvas: null,
    ec: {
      onInit: initChart
    },
  },

  onReady: function () {
    this.canvas = this.selectComponent('#mychart'); 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var years = [];
    if(year>2019){
      for(var i=0; i<=year-2019; i++){
        years[i] = (2019+i)+'年';
      };
      this.setData({
        currentYear: year+'年',
        years: years
      });
    }
  },

  // 选择年份
  selectYear: function(){
    var _this = this;
    wx.showActionSheet({
      itemList: _this.data.years,
      success(res) {
        var currentYear = _this.data.years[res.tapIndex];
        _this.setData({
          currentYear: currentYear
        })
        var data = [Math.random()*100,Math.random()*100,Math.random()*100,Math.random()*100,Math.random()*100,Math.random()*100,
                    Math.random()*100,Math.random()*100,Math.random()*100,Math.random()*100,Math.random()*100,Math.random()*100];
        refreshChart(data);
      }
    });
  },

})

// 初始化图表
function initChart(canvas, width, height, dpr){
   chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr //解决小程序视图模糊的问题
  });
  canvas.setChart(chart);
  var data = [Math.random()*100,Math.random()*100,Math.random()*100,Math.random()*100,Math.random()*100,Math.random()*100,
              Math.random()*100,Math.random()*100,Math.random()*100,Math.random()*100,Math.random()*100,Math.random()*100];
  refreshChart(data);
  return chart;
}
// 刷新图表数据
function refreshChart(data){
  var option = {
        color: ['#F3C438'],
        tooltip: {
            show: true,
        formatter: '{b}月\n业绩: {c}',
            axisPointer: {
                type: 'none'
            }
        },
        grid: {
          top: "3%",
          right: "0%",
          bottom: "0%",
          left: "0%",
          containLabel:true
       },
        xAxis: {
            type: 'category',
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            axisLine:{
              lineStyle:{
                color:'#999999'
              }
            },
            axisTick:{
              lineStyle:{
                opacity:0,
              }
            }
        },
        yAxis: {
            type: 'value',
            axisLine:{
              show:false,
              lineStyle:{
                color:'#979797'
              }
            },
            axisTick:{
              lineStyle:{
                opacity:0
              }
            }
        },
        series: [{
                name: '业绩',
                type: 'bar',
                barWidth: 10,
                data: data,
                itemStyle: {
                    normal: {
                        barBorderRadius: 5
                    }
                }
            }]
        };

  chart.setOption(option);
}