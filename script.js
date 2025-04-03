document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search-box input");
    if (searchInput) {
        console.log("Search input found");
        searchInput.addEventListener("input", () => {
            const searchTerm = searchInput.value.toLowerCase();
            console.log("Search term:", searchTerm);
            filterInventory(searchTerm);
        });
    } else {
        console.error("Search input still not found after DOM load");
    }
});

function filterInventory(searchTerm) {
    const inventory = JSON.parse(localStorage.getItem("inventory") || '[]');
    console.log("Inventory:", inventory);
    const filteredInventory = inventory.filter(item => {
        return (
            (item.name || "").toLowerCase().includes(searchTerm) ||
            (item.description || "").toLowerCase().includes(searchTerm) ||
            (item.category || "").toLowerCase().includes(searchTerm) ||
            (item.price || 0).toString().includes(searchTerm) ||
            (item.quantity || 0).toString().includes(searchTerm)
        );
    });
    console.log("Filtered:", filteredInventory);
    renderInventory(filteredInventory);
}

const itemForm = document.getElementById("new-item-form");
if (itemForm) {
    itemForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent default form submission
        logInputs(); // Call logInputs only once here
    });
}

function logInputs() {
    const itemName = document.getElementById('itemName').value;
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;
    const description = document.getElementById('description').value;

    const newItemToInventory = {
        id: new Date().toISOString(),
        name: itemName,
        category: category,
        price: price === '' ? null : Number(price),
        quantity: quantity === '' ? null : Number(quantity),
        description: description || null,
        lastUpdated: new Date().toLocaleDateString()
    };

    const inventoryFromLocalStorage = localStorage.getItem("inventory");
    const existingInventory = JSON.parse(inventoryFromLocalStorage) || [];
    
    // Check if item with same ID already exists (just in case)
    if (!existingInventory.some(item => item.id === newItemToInventory.id)) {
        existingInventory.push(newItemToInventory);
        localStorage.setItem("inventory", JSON.stringify(existingInventory));
    }
    
    // Reset form and navigate back
    itemForm.reset();
    history.back();
}

function getInventory() {
    const inventoryFromLocalStorage = localStorage.getItem("inventory");
    const inventoryJSON = JSON.parse(inventoryFromLocalStorage);

    if (!inventoryJSON) {
        return;
    }

    // Sort the inventory before rendering
    const sortedInventory = [...inventoryJSON].sort((a, b) => a.name.localeCompare(b.name));
    renderInventory(sortedInventory);
}

function renderInventory(inventory) {
    if (inventory.length === 0) {
        return;
    }

    // Sort the inventory by name to ensure consistent order
    const sortedInventory = [...inventory].sort((a, b) => a.name.localeCompare(b.name));

    let inventoryTableRow = sortedInventory.map((element) => {
        const quantity = element.quantity ?? 0;
        const formattedPrice = element.price !== null ? `₦${element.price.toLocaleString()}` : 'N/A';
        
        return (
            `
                <tr>
                    <td>${element.name}</td>
                    <td>${element.description ?? "No description"}</td>
                    <td>${element.category}</td>
                    <td>${formattedPrice}</td>
                    <td>
                      <div class="quantity-control">
                        <button class="quantity-btn" id="${element.id}_minus" 
                            ${quantity === 0 ? 'disabled' : ''} 
                            onclick="handleQuantityButtonClick(this)">-</button>
                        <div class="quantity-value">
                           ${quantity}
                        </div>
                        <button class="quantity-btn" id="${element.id}_plus" 
                            onclick="handleQuantityButtonClick(this)">+</button>
                       </div>
                    </td>
                    <td>${element.lastUpdated}</td>
                    <td>
                        <button class="edit-btn" onclick="editItem('${element.id}')">Edit</button>
                        <button class="delete-btn" onclick="deleteItem('${element.id}')">Delete</button>
                    </td>
                </tr>
            `
        );
    });
    const tableBody = document.getElementById("inventory-body");
    tableBody.innerHTML = inventoryTableRow.join('');
}

function handleQuantityButtonClick(element) {
    const localStorageData = localStorage.getItem('inventory');
    const localStorageParsed = JSON.parse(localStorageData ?? []);

    const itemId = element.id.split("_")[0];
    const isIncrement = element.id.split("_")[1] === "plus";

    // Update the inventory array while preserving the order
    const updatedInventory = localStorageParsed.map(item => {
        if (item.id === itemId) {
            return {
                ...item,
                quantity: isIncrement ? item.quantity + 1 : Math.max(0, item.quantity - 1),
                lastUpdated: new Date().toLocaleDateString()
            };
        }
        return item;
    });

    // Save the updated inventory back to localStorage
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));

    // Re-render the table
    getInventory();
}

function deleteItem(itemId) {
    if (confirm('Are you sure you want to delete this item?')) {
        const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
        const updatedInventory = inventory.filter(item => item.id !== itemId);
        localStorage.setItem('inventory', JSON.stringify(updatedInventory));
        getInventory();
    }
}

function editItem(itemId) {
    const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
    const itemToEdit = inventory.find(item => item.id === itemId);
    
    if (itemToEdit) {
        const newName = prompt('Enter new name:', itemToEdit.name);
        if (newName !== null) {
            const updatedInventory = inventory.map(item => {
                if (item.id === itemId) {
                    return { 
                        ...item, 
                        name: newName,
                        lastUpdated: new Date().toLocaleDateString()
                    };
                }
                return item;
            });
            localStorage.setItem('inventory', JSON.stringify(updatedInventory));
            getInventory();
        }
    }
}