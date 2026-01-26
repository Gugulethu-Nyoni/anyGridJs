export function renderComponent(targetElement) {
  const appRoot = targetElement || document.getElementById("app");

  if (!appRoot) {
    console.error("App root element not found");
    return () => {};
  }

  while (appRoot.firstChild) {
    appRoot.removeChild(appRoot.firstChild);
  }

  const h1_elem_v174ty = document.createElement("h1");
  appRoot.appendChild(h1_elem_v174ty);
  const text_node_vs64lb = document.createTextNode("The Flow ");
  h1_elem_v174ty.appendChild(text_node_vs64lb);

  // Create grid container
  const gridContainer = document.createElement("div");
  gridContainer.id = "anygrid";
  appRoot.appendChild(gridContainer);

  // Initialize AnyGrid after layout is loaded
  initializeLayout().then(() => {
    // Wait for next tick to ensure DOM is fully rendered
    setTimeout(() => {
      if (typeof AnyGrid !== 'undefined') {
        console.log("✅ AnyGrid loaded successfully");
        
        // Initialize the grid NOW - after DOM is ready and container exists
        const products = [
          { id: 1, title: 'Car', price: 20000 },
          { id: 2, title: 'Laptop', price: 1200 },
          { id: 3, title: 'Smartphone', price: 800 },
          { id: 4, title: 'Bicycle', price: 500 },
          { id: 5, title: 'Headphones', price: 150 },
          { id: 6, title: 'Refrigerator', price: 950 },
          { id: 7, title: 'Shoes', price: 120 },
          { id: 8, title: 'Watch', price: 350 },
          { id: 9, title: 'Desk', price: 400 },
          { id: 10, title: 'Television', price: 1100 }
        ];

        const columns = [
          {name:'id', header: 'ID', sortable: true, noModal: true},
          {name:'title', header: 'Name', sortable: true},
          {name:'price', header: 'Price', sortable: true, render: (value, row) => `R${value}` },
        ];

        const features = {
          theme: 'dark',
          gridModal: true,
          modalConfig: {
            editable: true,
            deletable: true
          },
          dataApiEndPoint: '#'
        };

        // Initialize AnyGrid - this should automatically find #anygrid
        new AnyGrid(products, columns, features);
        console.log("Grid initialized!");
        
      } else {
        console.log("❌ AnyGrid not available");
      }
    }, 100);
  });

  return () => {
    while (appRoot.firstChild) {
      appRoot.removeChild(appRoot.firstChild);
    }
  };
}