const itemForm = document.getElementById("new-item-form");
if (itemForm) {
    itemForm.addEventListener("submit", (event) => {
        event.preventDefault()
    })
}

function logInputs() {
    const itemName = document.getElementById('itemName').value;
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;
    const description = document.getElementById('description').value;

    const newItemToInventory = {
        id: new Date(),
        name: itemName,
        category: category,
        price: price === '' ? null : Number(price),
        quantity: quantity === '' ? null : Number(quantity),
        description: description || null
    };

    const inventoryFromLocalStorage = localStorage.getItem("inventory");

    const existingInventory = JSON.parse(inventoryFromLocalStorage) || [];

    existingInventory.push(newItemToInventory)

    localStorage.setItem("inventory", JSON.stringify(existingInventory));
    history.back();
}

function getInventory(){
   const inventoryFromLocalStorage = localStorage.getItem("inventory");
    const inventoryJSON =  JSON.parse(inventoryFromLocalStorage)

   if (!inventoryJSON) {
    return;
   }

   renderInventory(inventoryJSON)
}

function renderInventory(inventory) {

    if (inventory.length === 0) {
        return;
    }

    let inventoryTableRow = inventory.map((element) => {
        return (
            `
                <tr>
                    <td>${element.name}</td>
                    <td>${element.description ?? "No description"}</td>
                    <td>${element.category}</td>
                    <td>${element.price}</td>
                    <td>
                      <div class="quantity-control">
                        <button class="quantity-btn" id="${element.id}_minus" onclick="handleQuantityButtonClick(this)">-</button>
                        <div class="quantity-value">
                           ${element.quantity ?? 0}
                        </div>
                        <button class="quantity-btn" id="${element.id}_plus" onclick="handleQuantityButtonClick(this)">+</button>
                       </div>
                    </td>
                    <td>${element.lastUpdated ?? "No date"}</td>
                </tr>
            `
        )
    });

   const tableBody= document.getElementById("inventory-body")
   tableBody.innerHTML = inventoryTableRow
}

function handleQuantityButtonClick(element) {
    const localStorageData =  localStorage.getItem('inventory')
    const localStorageParsed =  JSON.parse(localStorageData ?? [])

    const checkId = (array) => {
        return element.id.split("_")[0] === array.id
    }
    
    let filterMatchingitem = localStorageParsed.find(checkId)

    if (element.id.split("_")[1] == "minus") { 
        const subtractOne = {
            ...filterMatchingitem,
            quantity: filterMatchingitem.quantity - 1
        }
    
        const otherEntries = localStorageParsed.filter(data => data.id !== subtractOne.id)
    
        localStorage.setItem('inventory', JSON.stringify([...otherEntries, subtractOne]))
    } else {
        const addOne = {
            ...filterMatchingitem,
            quantity: filterMatchingitem.quantity + 1
        }
    
        const otherEntries = localStorageParsed.filter(data => data.id !== addOne.id)
    
        localStorage.setItem('inventory', JSON.stringify([...otherEntries, addOne]))
    }

    getInventory()
    
}