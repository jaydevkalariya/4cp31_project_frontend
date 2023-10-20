<div className="section">
<h3>Cakes Customization</h3>
<div style={{ display: 'flex', justifyContent: 'center' }}>
  <VictoryPie
    width={100} // Adjust the width to make it smaller
    height={100} // Adjust the height to make it smaller
    data={[
      { x: `Customized\n${((reportData.customize / (reportData.customize + reportData.notCustomize)) * 100).toFixed(1)}%`, y: reportData.customize },
      { x: `Non-Customized\n${((reportData.notCustomize / (reportData.customize + reportData.notCustomize)) * 100).toFixed(1)}%`, y: reportData.notCustomizedCakes },
    ]}
    colorScale={['#00C49F', '#FF8042']}
    innerRadius={20} // Adjust the innerRadius for a doughnut-style chart
    labelRadius={30} // Adjust the label radius for positioning
    labels={({ datum }) => null} // Disable the default labels
  />
  <VictoryLabel
    textAnchor="middle"
    verticalAnchor="middle"
    x={12} // Adjust the x position
    y={12} // Adjust the y position
    text={`${(reportData.customize / (reportData.customize + reportData.notCustomize) * 100).toFixed(1)}%`}
    style={{ fontSize: 20, fill: 'black' }}
  />
</div>
</div>