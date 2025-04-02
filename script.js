const itemForm = document.getElementById("new-item-form");
if (itemForm) {
    itemForm.addEventListener("submit", (event) => {
        event.preventDefault();
        logInputs();
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
    existingInventory.push(newItemToInventory);
    localStorage.setItem("inventory", JSON.stringify(existingInventory));
    history.back();
}

function getInventory() {
    const inventoryFromLocalStorage = localStorage.getItem("inventory");
    const inventoryJSON = JSON.parse(inventoryFromLocalStorage);

    if (!inventoryJSON) {
        return;
    }

    renderInventory(inventoryJSON);
}

function renderInventory(inventory) {
    if (inventory.length === 0) {
        return;
    }

    let inventoryTableRow = inventory.map((element) => {
        const quantity = element.quantity ?? 0;
        // Format price with Naira sign
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

    const checkId = (array) => {
        return element.id.split("_")[0] === array.id;
    }
    
    let filterMatchingItem = localStorageParsed.find(checkId);

    if (element.id.split("_")[1] == "minus") { 
        const subtractOne = {
            ...filterMatchingItem,
            quantity: filterMatchingItem.quantity - 1,
            lastUpdated: new Date().toLocaleDateString()
        };
        const otherEntries = localStorageParsed.filter(data => data.id !== subtractOne.id);
        localStorage.setItem('inventory', JSON.stringify([...otherEntries, subtractOne]));
    } else {
        const addOne = {
            ...filterMatchingItem,
            quantity: filterMatchingItem.quantity + 1,
            lastUpdated: new Date().toLocaleDateString()
        };
        const otherEntries = localStorageParsed.filter(data => data.id !== addOne.id);
        localStorage.setItem('inventory', JSON.stringify([...otherEntries, addOne]));
    }

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