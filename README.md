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


There are three ways to use anyGrid in your html.

## Option A: Global JS Format

1. CSS set up (Optional)

```html

<link rel="stylesheet" href="./anyGridJs/anyGrid.css">

```

2. html: insert this containter somewhere in your html (before the js mark up shown in step 2)

```html
<div id="anyGrid"></div>
```

3. Add your js mark up in the html just before the </body> tag:

```html
<script src="https://unpkg.com/anygridjs@1.0.8/anyGrid.global.js"></script>
 <script src="app.js"></script>
 ```

 ## Your app.js 

 ```javascript

const data = [
  { id: 1, name: 'John', surname: 'Doe', age: 30, role: 'Developer', salary: 50000 },
  { id: 2, name: 'Jane', surname: 'Doe', age: 28, role: 'Designer', salary: 45000 },
  { id: 3, name: 'Jack', surname: 'Smith', age: 34, role: 'Product Manager', salary: 60000 },
  { id: 4, name: 'Emily', surname: 'Jones', age: 27, role: 'Marketing Specialist', salary: 47000 },
  // add more records 
];

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


const dataGrid = new AnyGrid(data, columns, 10);
```



## Option B: Global JS Format


1. html: insert this containter somewhere in your html (before the js mark up shown in step 2)

```html
<div id="anyGrid"></div>
```

2. Add your js mark up in the html just before the </body> tag:

```html
  <script src="https://unpkg.com/anygridjs@1.0.8/anyGrid.umd.js"></script>
 <script src="app.js"></script>
 ```


## Option C: ESM modules importmap

1. html: insert this containter somewhere in your html (before the js mark up shown in step 2)

```html
<div id="anyGrid"></div>
```

2. Add your js mark up in the html just before the </body> tag:

```html
<script type="importmap">
{
  "imports": {
    "anygridjs": "https://unpkg.com/anygridjs@1.0.8/anyGrid.mjs"
  }
}
</script>

<script type="module" src="esm_app.js"></script>

```

## esm_app.js 

```javascript
import AnyGrid from 'anygridjs';

const data = [
  { id: 1, name: 'John', surname: 'Doe', age: 30, role: 'Developer', salary: 50000 },
  { id: 2, name: 'Jane', surname: 'Doe', age: 28, role: 'Designer', salary: 45000 },
  { id: 3, name: 'Jack', surname: 'Smith', age: 34, role: 'Product Manager', salary: 60000 },
  { id: 4, name: 'Emily', surname: 'Jones', age: 27, role: 'Marketing Specialist', salary: 47000 },
  { id: 5, name: 'Michael', surname: 'Brown', age: 40, role: 'Software Engineer', salary: 55000 },
  { id: 6, name: 'Sarah', surname: 'Davis', age: 32, role: 'UX Researcher', salary: 52000 },
  ];


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

const dataGrid = new AnyGrid(data, columns, 10);

```



## The data object
```javascript

// data object (JSON)

const data = [
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


## Contribute

anyGridJs is an open-source project. Contributions, issues, and feature requests are welcome!

## License

anyGridJs is licensed under the MIT License.

## Keywords

Javascript datatables.

