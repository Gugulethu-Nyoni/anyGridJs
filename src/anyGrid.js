class AnyGrid {
  constructor(data, columns, initialItemsPerPage, gridcontainerid) {
    this.data = data;
    this.columns = columns;
    this.itemsPerPage = initialItemsPerPage;
    //console.log(this.itemsPerPage);
    //alert(this.itemsPerPage);
    this.currentPage = 1;
    this.tbody = null;
    this.searchInput = null;
    this.paginationContainer = null;
    this.filteredData = this.data;
    this.sortingOrder = {};
    this.dataTableId= this.generateUniqueId('anygrid-datatable');
    this.paginationContainerId= this.generateUniqueId('anygrid-pagination');
    this.gridContainerId = gridcontainerid ? `${gridcontainerid}` : 'anygrid';

    // Initialize the data grid
    this.initializeDataGrid();
    // Set up search input
    this.searchInput = document.getElementById('searchInput');
    this.searchInput.addEventListener('input', this.searchTable.bind(this));
  }


  generateUniqueId(prefix) {
      const randomPart = Math.random().toString(36).substring(2, 7); // Generate a 5-character random string
      return `${prefix}-${randomPart}`;
    }


  // Initialize the data grid layout and event listeners
initializeDataGrid() {
  //const dataGrid = document.querySelector(this.gridContainerId);
  const dataGrid = document.getElementById(this.gridContainerId);
  //alert("DATAGRID",dataGrid);
  if (dataGrid) {
    const options = [5, 10, 20, 50, 100]; // Define possible itemsPerPage options

    // Generate select options dynamically
    const selectOptions = options.map(option => `
      <option value="${option}" ${option === this.itemsPerPage ? 'selected' : ''}>${option}</option>
    `).join('');

    const htmlContent = `
      <div class="search-container"> 
      <input type="text" id="searchInput" placeholder="Search...">
      <select id="itemsPerPage">
        ${selectOptions}
      </select>
      </div>
      
      <table class="anygrid-table" id="${this.dataTableId}">
        <thead>
          <tr></tr>
        </thead>
        <tbody></tbody>
      </table>
      <div id="${this.paginationContainerId}" class="anygrid-pagination"></div>
    `;
    dataGrid.insertAdjacentHTML('afterbegin', htmlContent);

    // Add event listeners programmatically
    const searchInput = document.querySelector('#searchInput');
    searchInput.addEventListener('input', this.searchTable.bind(this));

    const itemsPerPageSelect = document.querySelector('#itemsPerPage');
    itemsPerPageSelect.value = this.itemsPerPage; // Set the initial value

    itemsPerPageSelect.addEventListener('change', (event) => {
      this.itemsPerPage = parseInt(event.target.value); // Update the value
      this.currentPage = 1; // Reset the current page
      this.renderData();
      this.updatePagination();
    });

    this.tbody = document.querySelector(`#${this.dataTableId} tbody`);
    this.paginationContainer = document.querySelector(`${this.paginationContainerId}`);

    this.renderData(this.data);
    this.updatePagination();
  }
}



  // Render the data in the table
  renderData() {
    this.tbody.innerHTML = '';
    const headerRow = document.querySelector(`#${this.dataTableId} thead tr`);
    headerRow.innerHTML = '';


// Create table headers
this.columns.forEach((column, index) => {
  if (!column.hidden) {
    const headerCell = document.createElement('th');
    headerCell.textContent = column.label || column.header;
    if (column.joinedColumns) {
      headerCell.setAttribute('colspan', column.joinedColumns.length); // Set colspan for joined columns
    } else {
      if (column.sortable) {
        headerCell.dataset.index = index;
        headerCell.addEventListener('click', () => this.sortTable(index));
        
        // Add sortable icon
        const sortableIcon = document.createElement('span');
        sortableIcon.innerHTML = ' ⇅'; // Use the Unicode character for the icon
        sortableIcon.style.fontSize = '1.1em';
        sortableIcon.style.marginLeft = '0.2em';
        sortableIcon.className = 'anygrid-column-sortable'; // Add class attribute
        headerCell.appendChild(sortableIcon);
      }
    }
    headerRow.appendChild(headerCell);
  }
});


    // Render action headers for the last column
    //const actionColumn = this.columns.find(col => col.name === 'actions');
    const actionColumn = this.columns.find(col => col.actions);
    console.log('Action Column:', actionColumn);
    if (actionColumn) {
      console.log("inside actions first if");
    actionColumn.actions.forEach((action) => {
    const headerCell = document.createElement('th');
    headerCell.textContent = action.label;
    headerRow.appendChild(headerCell);
   });
  }


    // Render rows of data
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    //const endIndex = Math.min(this.currentPage * this.itemsPerPage.value, this.data.length);
    const endIndex = Math.min(this.currentPage * this.itemsPerPage, this.filteredData.length);


  this.filteredData.slice(startIndex, endIndex).forEach((row) => {
  const tr = document.createElement('tr');
  this.columns.forEach((column) => {
    if (!column.hidden) {
      const cell = document.createElement('td');
      let value = column.joinedColumns ? column.joinedColumns.map(col => row[col]).join(' ') : row[column.name];

      if (column.render) {
      if (typeof column.render === 'string') {
      cell.innerHTML = column.render.replace(`{${column.name}}`, value);
      } else if (typeof column.render === 'function') {
      cell.innerHTML = column.render(value, row);
      }
      }
///
      else {
        if (column.joinedColumns) {
          cell.textContent = value;
          cell.setAttribute('colspan', column.joinedColumns.length);
        } else {
          cell.textContent = value;
        }
      }
      tr.appendChild(cell);
    }
  });


      // Render actions for the last column
        if (actionColumn) {
        console.log("inside actions second if");
        actionColumn.actions.forEach((action) => {
        const actionCell = document.createElement('td');
        const actionLink = document.createElement('a');
        actionLink.textContent = action.label;
        actionLink.href = action.url.replace('{id}', row.id);

        // Add class and id if they exist in the action object
        if (action.class) {
          actionLink.classList.add(action.class);
        }
        if (action.id) {
          actionLink.id = action.id.replace('{id}', row.id);
        }

        // Add onclick attribute for confirmation if specified
        if (action.confirm) {
          actionLink.setAttribute('onclick', "return confirm('Are you sure?')");
        }

        actionCell.appendChild(actionLink);
        tr.appendChild(actionCell);
      });

      }

      this.tbody.appendChild(tr);
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
  // Ensure this.itemsPerPage is directly used as an integer
  const itemsPerPage = this.itemsPerPage;  // No need to access '.value'
  
  // Calculate total pages based on the length of the filtered data
  const totalPages = Math.ceil(this.filteredData.length / itemsPerPage); 
  
  // Determine the start and end range for pagination buttons
  const startPage = Math.max(1, this.currentPage - 5);  // Show up to 5 pages before current
  const endPage = Math.min(startPage + 9, totalPages);  // Show up to 9 pages after current

  // Clear previous pagination buttons
  this.paginationContainer.innerHTML = '';

  // Create pagination buttons dynamically
  for (let i = startPage; i <= endPage; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.classList.add('pagination-button');
    
    // Highlight the current active page
    if (i === this.currentPage) {
      button.classList.add('active');
    }
    
    // Add click event to change the current page
    button.onclick = () => {
      this.currentPage = i;  // Update the current page
      this.renderData();     // Re-render the data for the new page
      this.updatePagination();  // Update the pagination buttons
    };
    
    // Append the button to the pagination container
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

export default AnyGrid;




