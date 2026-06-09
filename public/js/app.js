// 加载图表
async function loadChart() {
  try {
    const response = await fetch('/api/chart-data');
    const chartData = await response.json();
    
    const ctx = document.getElementById('dataChart').getContext('2d');
    
    if (window.myChart) {
      window.myChart.destroy();
    }
    
    window.myChart = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Error loading chart:', error);
  }
}

// 加载数据表格
async function loadTable() {
  try {
    const response = await fetch('/api/items');
    const items = await response.json();
    
    const tbody = document.getElementById('itemsTable');
    tbody.innerHTML = '';
    
    items.forEach(item => {
      const row = tbody.insertRow();
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.value}</td>
        <td>${item.created_at}</td>
      `;
    });
  } catch (error) {
    console.error('Error loading table:', error);
  }
}

// 添加数据
document.getElementById('addForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const value = document.getElementById('value').value;
  
  try {
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, value })
    });
    
    if (response.ok) {
      document.getElementById('name').value = '';
      document.getElementById('value').value = '';
      loadChart();
      loadTable();
    }
  } catch (error) {
    console.error('Error adding item:', error);
  }
});

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
  loadChart();
  loadTable();
});
