# anyGridJs


<img src="https://github.com/thincmedia/anyGridJs/blob/main/images/anyGridJs_Example.png" alt="anyGridJs Example">


DataTables.js: Lightweight, feature-rich JS library for dynamic data tables. Paginated, sortable, searchable, column joining, action handles &amp; URL definition. Works with any JS framework or vanilla JS. Flexible, customizable, responsive &amp; performant. Open-source &amp; MIT licensed.

## Key Features

  - Pagination: Effortlessly navigate large datasets with customizable page sizes
  - Sorting: Enable users to sort data by specific columns
  - Searching: Include a search bar for quick data filtering
  - Column Joining: Combine data from multiple columns for enhanced visualization
  - Action Handles: Add custom buttons for interactive functionality
  - URL Definition: Define URLs for data linking and seamless navigation
  - Framework Agnostic: Works with any JavaScript framework (React, Angular, Vue, Svelte etc.) or vanilla JS

## Why Choose anyGridJs?

 - Vanilla JS: No dependencies, works with any JavaScript framework or vanilla JS
 - Lightweight: Minimal footprint, optimized for performance
 - Customizable: Adapt the library to fit your project's unique needs
 - Responsive: Tables adapt to various screen sizes and devices
 - Flexible: Integrate with your preferred framework or use with vanilla JS
Get Started
- Extensible: you can extend the features nd functions of the library
- Minimal Configs: all you need is  a div with dataGrid id name,  a json data object, column definition in your app.js or via script tag directly on the html. See usage section below.

## Usage Example


There are two ways to use this the anyGrid package.

## Option A: Clone the GitHub repo:

1. go to your terminal and run:

```bash
git clone https://github.com/thincmedia/anyGridJs.git

````
2. now you can use anygridjs this way in your html file

```html

<link rel="stylesheet" href="./anyGridJs/anyGrid.css">

```

```html

<script type="module">

  import { AnyGrid } from './anyGridJs/anyGrid.js';

</script>

```


## Option B: Via npm

### Installation 


1. go to your terminal and run:

```bash

npm install anygridjs

````

2. now you can use anygridjs this way in your html file

```html

<link rel="stylesheet" href="./node_modules/anygridjs/anyGrid.css">

```

```html

<script type="module">

  import { AnyGrid } from './node_modules/anygridjs/anyGrid.js';

  // rest of js code (app.js) can come here e.g. data object, column definition etc ( see below)

</script>

```

## Javascript (app.js)
```javascript

// data object (JSON)

let data = [
  { id: 1, name: 'John', surname: 'Doe', age: 30, role: 'Developer', salary: 50000 },
  { id: 2, name: 'Jane', surname: 'Doe', age: 28, role: 'Designer', salary: 45000 },
  { id: 3, name: 'Jack', surname: 'Smith', age: 34, role: 'Product Manager', salary: 60000 }
  // Additional data trimmed for brevity
];
```

## Column Definition

```javascript

const columns = [
  { name: 'id', header: 'ID' },
  { name: 'fullName', header: 'Full Name', joinedColumns: ['name', 'surname'] },
  { name: 'age', header: 'Age' },
  { name: 'role', header: 'Role' },
  { name: 'salary', header: 'Salary',
    actions: [
      {
        label: 'Edit',
        url: 'edit/{id}',
        class: 'edit',
        id: 'edit-{id}',
      },
      {
        label: 'Delete',
        url: 'delete/{id}',
        class: 'delete',
        id: 'delete-{id}',
        confirm: true,
      },
    ],
  },
];

// create a new instance of anyGridJs

const dataGrid = new anyGrid(data, columns, 10);
```

## HTML 

```html

<div id="dataGrid"></div>

```

## Contribute

anyGridJs is an open-source project. Contributions, issues, and feature requests are welcome!

## License

anyGridJs is licensed under the MIT License.

## Keywords

Javascript datatables.

