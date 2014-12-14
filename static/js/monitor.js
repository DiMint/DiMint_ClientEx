Array.prototype.remove = function(x) {
  var i;
  for (i in this) {
    if (this[i].toString() === x.toString()) {
      this.splice(i, 1);
    }
  }
};

var md5ToColor = function(md5Str) {
  return "#" + md5Str.slice(0, 6);
};

var shortNodeId = function(nodeId) {
  return nodeId.substr(0, 5) + "...";
}

$(function() {
  var updateInterval = 5000;
  var nodesInfo = {};
  var xVal = 0;
  var chartWidth = 30;
  var summaryData = [];
  var summaryDataIndex = [];
  var summaryChartDiv = $("#summaryChart").CanvasJSChart({
    title: {
      text: "Summary - node key count compare"
    },
    toolTip: {
      shared: true
    },
    data: [],
    axisX: {
      labelAngle: 45
    }
  });

  var updateMonitorInfoFunc = function(){
    $.ajax({
      'url': '/monitor',
      'type': 'get',
    }).then(function(result){
      var nodeId, newData, deleteNodes, chart;
      if (!result.ok) {
        console.log('error');
        return;
      }

      deleteNodes = Object.keys(nodesInfo);

      for(nodeInfo of result.state) {
        nodeId = nodeInfo.node_id;
        if (nodeId in nodesInfo) {
          nodesInfo[nodeId].memoryData.push({
            x: xVal,
            y: nodeInfo.memory_percent * 100
          });
          nodesInfo[nodeId].keyData.push({
            x: xVal,
            y: nodeInfo.key_count
          });

          if (nodesInfo[nodeId].memoryData.length > chartWidth) {
            nodesInfo[nodeId].memoryData.shift();
          }
          if (nodesInfo[nodeId].keyData.length > chartWidth) {
            nodesInfo[nodeId].keyData.shift();
          }
          chart = nodesInfo[nodeId].chartDiv.CanvasJSChart();
          chart.render();

          summaryData[summaryDataIndex.indexOf(shortNodeId(nodeId))].y = nodeInfo.key_count;
          deleteNodes.remove(nodeId);
        } else {
          newData = {};
          newData.memoryData = [{
            x: xVal,
            y: nodeInfo.memory_percent * 100
          }];
          newData.keyData = [{
            x: xVal,
            y: nodeInfo.key_count
          }];
          nodesInfo[nodeId] = newData;
          nodesInfo[nodeId].chartDiv = $("<div>").attr('id', nodeId).addClass("chart").appendTo($(".charts-container")).CanvasJSChart({
            title: {
              text: nodeId + "'s resource usage",
            },
            toolTip: {
              shared: true
            },
            axisY: {
              minimum: 0
            },
            axisY2: {
              minimum: 0
            },
            data: [{
              dataPoints: newData.memoryData,
              type: "line",
              name: "Memory usage percent",
              axisYType: "primary"
            }, {
              dataPoints: newData.keyData,
              type: "line",
              name: "count of key",
              axisYType: "secondary"
            }]
          });

          summaryData.push({
            label: shortNodeId(nodeId),
            y: nodeInfo.key_count,
            color: md5ToColor(nodeInfo.role === "master" ? nodeId : nodeInfo.master_node_id)
          });
          summaryDataIndex.push(shortNodeId(nodeId));
        }
      }
      xVal++;

      for (deletedNode of deleteNodes) {
        var i = summaryDataIndex.indexOf(shortNodeId(deletedNodes));
        summaryData.splice(i, 1);
        summaryDataIndex.remove(shortNodeId(deletedNode));
        deleteNodes[deletedNode].chartDiv.remove();
        delete deleteNodes[deletedNode];
      }

      chart = summaryChartDiv.CanvasJSChart();
      chart.options.data = [{dataPoints: summaryData}];
      chart.render();
    });
  };
  setInterval(updateMonitorInfoFunc, updateInterval);
  updateMonitorInfoFunc();
});
