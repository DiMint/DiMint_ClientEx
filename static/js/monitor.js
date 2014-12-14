Array.prototype.remove = function(x) {
  var i;
  for (i in this) {
    if (this[i].toString() === x.toString()) {
      this.splice(i, 1);
    }
  }
}

$(function() {
  var updateInterval = 5000;
  var nodesInfo = {};
  var xVal = 0;
  var chartWidth = 30;

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
          nodesInfo[nodeId].cpuData.push({
            x: xVal,
            y: nodeInfo.cpu_percent * 100
          });

          if (nodesInfo[nodeId].memoryData.length > chartWidth) {
            nodesInfo[nodeId].memoryData.shift();
          }
          if (nodesInfo[nodeId].cpuData.length > chartWidth) {
            nodesInfo[nodeId].cpuData.shift();
          }
          chart = nodesInfo[nodeId].chartDiv.CanvasJSChart();
          chart.render();
          deleteNodes.remove(nodeId);
        } else {
          newData = {};
          newData.memoryData = [{
            x: xVal,
            y: nodeInfo.memory_percent * 100
          }];
          newData.cpuData = [{
            x: xVal,
            y: nodeInfo.cpu_percent * 100
          }];
          nodesInfo[nodeId] = newData;
          nodesInfo[nodeId].chartDiv = $("<div>").attr('id', nodeId).addClass("chart").appendTo($(".charts-container")).CanvasJSChart({
            title: {
              text: nodeId + "'s resource usage",
            },
            toolTip: {
              shared: true
            },
            data: [{
              dataPoints: newData.memoryData,
              type: "line",
              name: "Memory usage percent"
            }, {
              dataPoints: newData.cpuData,
              type: "line",
              name: "CPU usage percent"
            }]
          });
        }
      }
      xVal++;
      for (deletedNode of deleteNodes) {
        deleteNodes[deletedNode].chartDiv.remove();
        delete deleteNodes[deletedNode];
      }
    });
  };
  setInterval(updateMonitorInfoFunc, updateInterval);
  updateMonitorInfoFunc();
});
