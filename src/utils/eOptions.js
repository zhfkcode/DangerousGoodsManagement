import echarts from 'echarts'
export let lineOption = {
  // backgroundColor: '#080b30',
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      lineStyle: {
        color: '#dddc6b'
      }
    },
    formatter: '{a0}<br/>{b0} : {c0}'
  },
  legend: {
    show: false,
    top: '0%',
    data: ['月份'],
    textStyle: {
      color: 'rgba(255,255,255,.5)',
      fontSize: '12',
    }
  },
  grid: {
    left: '10',
    top: '30',
    right: '50',
    bottom: '10',
    containLabel: true
  },

  xAxis: [{
    name: "时间",
    type: 'category',
    boundaryGap:['30%', '30%'],
    axisLabel: {
      textStyle: {
        color: "#4c9bfd",
        fontSize: 14,
      },
    },
    nameTextStyle: {
      color: "#4c9bfd",
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,.2)'
      }
    },
    
    data: [3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4, 3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4]


  }, {

    axisPointer: {
      show: false
    },
    axisLine: {
      show: false
    },
    position: 'bottom',
    offset: 20,



  }],

  yAxis: [{
    type: 'value',
    axisTick: {
      show: false
    },
    name: "数值",
    nameTextStyle: {
      color: "#4c9bfd",
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,.1)'
      }
    },
    axisLabel: {
      textStyle: {
        color: "#4c9bfd",
        fontSize: 14,
      },
    },

    splitLine: {
      lineStyle: {
        color: 'rgba(255,255,255,.1)'
      }
    }
  }],
  series: [{
      name: '月份',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
    //   showSymbol: false,
      lineStyle: {

        normal: {
          color: '#0184d5',
          width: 2
        }
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(1, 132, 213, 0.4)'
          }, {
            offset: 0.8,
            color: 'rgba(1, 132, 213, 0.1)'
          }], false),
          shadowColor: 'rgba(0, 0, 0, 0.1)',
        }
      },
      itemStyle: {
        normal: {
          color: '#0184d5',
          borderColor: 'rgba(221, 220, 107, .1)',
          borderWidth: 8
        }
      },
      data: [3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4, 3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4]

    },
    {
      name: 'IOS',
      type: 'bar',
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
    //   showSymbol: false,
      lineStyle: {

        normal: {
          color: '#00d887',
          width: 2
        }
      },
    //   areaStyle: {
    //     normal: {
    //       color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
    //         offset: 0,
    //         color: 'rgba(0, 216, 135, 0.4)'
    //       }, {
    //         offset: 0.8,
    //         color: 'rgba(0, 216, 135, 0.1)'
    //       }], false),
    //       shadowColor: 'rgba(0, 0, 0, 0.1)',
    //     }
    //   },
      itemStyle: {
        normal: {
          color: '#00d887',
          // borderColor: 'rgba(221, 220, 107, .1)',
          // borderWidth: 12
        }
      },
      data:[3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4, 3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4]
    },

  ]
}
export let lineOption2 = {
  // backgroundColor: '#080b30',
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      lineStyle: {
        color: '#dddc6b'
      }
    },
    formatter: '{a0}<br/>{b0} : {c0}'
  },
  legend: {
    show: false,
    top: '0%',
    data: ['月份'],
    textStyle: {
      color: 'rgba(255,255,255,.5)',
      fontSize: '12',
    }
  },
  grid: {
    left: '10',
    top: '30',
    right: '50',
    bottom: '10',
    containLabel: true
  },

  xAxis: [{
    name: "时间",
    type: 'category',
    nameRotate: -45,
    // boundaryGap:['20%', '30%'],
    axisLabel: {
      textStyle: {
        color: "#4c9bfd",
        fontSize: 12,
      },
    },
    nameTextStyle: {
      color: "#4c9bfd",
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,.2)'
      }
    },
    
    data: [3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4, 3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4]


  }, {

    axisPointer: {
      show: false
    },
    axisLine: {
      show: false
    },
    position: 'bottom',
    offset: 20,



  }],

  yAxis: [{
    type: 'value',
    axisTick: {
      show: false
    },
    name: "数值",
    nameTextStyle: {
      color: "#4c9bfd",
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255,255,255,.1)'
      }
    },
    axisLabel: {
      textStyle: {
        color: "#4c9bfd",
        fontSize: 12,
      },
    },

    splitLine: {
      lineStyle: {
        color: 'rgba(255,255,255,.1)'
      }
    }
  }],
  series: [{
      name: '月份',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
    //   showSymbol: false,
      lineStyle: {

        normal: {
          color: '#0184d5',
          width: 2
        }
      },
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgba(1, 132, 213, 0.4)'
          }, {
            offset: 0.8,
            color: 'rgba(1, 132, 213, 0.1)'
          }], false),
          shadowColor: 'rgba(0, 0, 0, 0.1)',
        }
      },
      itemStyle: {
        normal: {
          color: '#0184d5',
          borderColor: 'rgba(221, 220, 107, .1)',
          borderWidth: 8
        }
      },
      data: [3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4, 3, 4, 3, 4, 3, 4, 3, 6, 2, 4, 2, 4]

    },

  ]
}
export let pieOption = {
  title: {
      text: '状态统计图',
      textStyle: {
        color: '#ffffff'
      }
  },
  tooltip: {
      trigger: 'item',
      // formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  // legend: {
  //     type: 'scroll',
  //     orient: 'vertical',
  //     right: 10,
  //     top: 20,
  //     bottom: 20,
  //     data: data.legendData,

  //     selected: data.selected
  // },
  series: [
      {
          name: '状态',
          type: 'pie',
          radius: '55%',
          center: ['40%', '50%'],
          data: [],
          label: {
            position: 'inner'
          },
          emphasis: {
              itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
          }
      }
  ]
}


