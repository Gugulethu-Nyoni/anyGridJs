class AnyGrid {
  constructor(data, columns, initialItemsPerPage, gridcontainerid) {
    this.data = data;
    this.columns = columns;
    this.itemsPerPage = initialItemsPerPage;
    this.currentPage = 1;
    this.tbody = null;
    this.searchInput = null;
    this.paginationContainer = null;
    this.filteredData = this.data;
    this.sortingOrder = {};
    this.gridContainerId = gridcontainerid ? `#${gridcontainerid}` : '#anyGrid';

    // Initialize the data grid
    this.initializeDataGrid();

    // Set up search input
    this.searchInput = document.getElementById('searchInput');
    this.searchInput.addEventListener('input', this.searchTable.bind(this));
  }

  // Initialize the data grid layout and event listeners
  initializeDataGrid() {
    const dataGrid = document.querySelector(this.gridContainerId);
    if (dataGrid) {
      const htmlContent = `
        <input type="text" id="searchInput" placeholder="Search...">
        <select id="itemsPerPage">
          <option value="5">5</option>
          <option value="10" selected>10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        
        <table id="dataTable">
          <thead>
            <tr></tr>
          </thead>
          <tbody></tbody>
        </table>
        <div id="pagination"></div>
      `;
      
      dataGrid.insertAdjacentHTML('afterbegin', htmlContent);

      // Add event listeners programmatically
      const searchInput = document.querySelector('#searchInput');
      searchInput.addEventListener('input', this.searchTable.bind(this));
      const itemsPerPageSelect = document.querySelector('#itemsPerPage');
      itemsPerPageSelect.addEventListener('change', (event) => this.updateItemsPerPage(event.target.value));
    }

    this.tbody = document.querySelector('#dataTable tbody');
    this.itemsPerPage = document.querySelector('#itemsPerPage');
    this.paginationContainer = document.querySelector('#pagination');

    this.renderData(this.data);
    this.updatePagination();
  }

  // Render the data in the table
  renderData() {
    this.tbody.innerHTML = '';
    const headerRow = document.querySelector('#dataTable thead tr');
    headerRow.innerHTML = '';

    // Create table headers
    this.columns.forEach((column, index) => {
      if (!column.hidden) {
        const headerCell = document.createElement('th');
        headerCell.textContent = column.label || column.header;
        if (column.joinedColumns) {
          headerCell.setAttribute('colspan', column.joinedColumns.length); // Set colspan for joined columns
        } else {
          headerCell.dataset.index = index;
          headerCell.addEventListener('click', () => this.sortTable(index));
        }
        headerRow.appendChild(headerCell);
      }
    });

    // Render action headers for the last column
    const actionColumn = this.columns.find(col => col.name === 'actions');
    if (actionColumn) {  // Check if the column has actions before rendering headers
    const actionColumn = this.columns[this.columns.length - 1];
    actionColumn.actions.forEach((action) => {
      const headerCell = document.createElement('th');
      headerCell.textContent = action.label;
      headerRow.appendChild(headerCell);
    });
  }



    // Render rows of data
    const startIndex = (this.currentPage - 1) * this.itemsPerPage.value;
    const endIndex = Math.min(this.currentPage * this.itemsPerPage.value, this.data.length);
    this.filteredData.slice(startIndex, endIndex).forEach((item) => {
      const row = document.createElement('tr');

      this.columns.forEach((column) => {
        if (!column.hidden) {
          const cell = document.createElement('td');
          if (column.joinedColumns) {
            // Concatenate values from joined columns
            const joinedValue = column.joinedColumns.map(col => item[col]).join(' ');
            cell.textContent = joinedValue;
            cell.setAttribute('colspan', column.joinedColumns.length);
          } else {
            cell.textContent = item[column.name];
          }
          row.appendChild(cell);
        }
      });

      // Render actions for the last column
      if (actionColumn) {  // Check if the column has actions
        actionColumn.actions.forEach((action) => {
        const actionCell = document.createElement('td');
        const actionLink = document.createElement('a');
        actionLink.textContent = action.label;
        actionLink.href = action.url.replace('{id}', item.id);

        // Add class and id if they exist in the action object
        if (action.class) {
          actionLink.classList.add(action.class);
        }
        if (action.id) {
          actionLink.id = action.id.replace('{id}', item.id);
        }

        // Add onclick attribute for confirmation if specified
        if (action.confirm) {
          actionLink.setAttribute('onclick', "return confirm('Are you sure?')");
        }

        actionCell.appendChild(actionLink);
        row.appendChild(actionCell);
      });

      }

      this.tbody.appendChild(row);
    });

    this.updatePagination();
  }





  // Update the items per page and re-render data
  updateItemsPerPage = (value) => {
    this.itemsPerPage.value = value;
    this.renderData();
  }

  // Update pagination buttons
  updatePagination() {
    const totalPages = Math.ceil(this.data.length / this.itemsPerPage.value); // Recalculate total pages
    const startPage = Math.max(1, this.currentPage - 5);
    const endPage = Math.min(startPage + 10, totalPages);

    this.paginationContainer.innerHTML = '';

    for (let i = startPage; i <= endPage; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.classList.add('pagination-button');
      button.onclick = () => {
        this.currentPage = i;
        this.renderData(); // Render data for the new page
        this.updatePagination(); // Update pagination buttons after rendering data
      };
      this.paginationContainer.appendChild(button);
    }
  }

  // Filter the table based on search input
  searchTable = (event) => {
    const searchValue = this.searchInput.value.toLowerCase();

    const filteredData = this.data.filter((item) => {
      // Search through each column defined in the columns array
      for (const column of this.columns) {
        // If the column name maps to an actual data key and contains the search value, return true
        if (item.hasOwnProperty(column.name) && item[column.name].toString().toLowerCase().includes(searchValue)) {
          return true;
        }
        // If the column is a joined column, check if any of the joined columns contain the search value
        if (column.joinedColumns) {
          const joinedValue = column.joinedColumns.map(col => item[col]).join(' ').toLowerCase();
          if (joinedValue.includes(searchValue)) {
            return true;
          }
        }
      }
      // If no match found in any column, return false
      return false;
    });
    this.filteredData = filteredData;

    this.renderData();
  }

  // Sort the table based on the clicked column
  sortTable(n) {
    const columnHeader = this.columns[n].name; // Use the column name instead of the label or header

    // Toggle sorting order
    if (!this.sortingOrder[columnHeader] || this.sortingOrder[columnHeader] === 'desc') {
      this.sortingOrder[columnHeader] = 'asc';
    } else {
      this.sortingOrder[columnHeader] = 'desc';
    }

    // Sort the data based on the current sorting order for this column
    const sortedData = [...this.filteredData].sort((a, b) => {
      const valueA = typeof a[columnHeader] === 'string' ? a[columnHeader].toLowerCase() : a[columnHeader];
      const valueB = typeof b[columnHeader] === 'string' ? b[columnHeader].toLowerCase() : b[columnHeader];

      if (this.sortingOrder[columnHeader] === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    this.filteredData = sortedData;
    this.renderData();
    this.updatePagination();
  }
}

//export { AnyGrid };
export default AnyGrid;
