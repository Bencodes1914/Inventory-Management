document.addEventListener('DOMContentLoaded', function() {
 const minusBtns = document.querySelectorAll('.quantity-btn:first-child');
 const plusBtns = document.querySelectorAll('.quantity-btn:last-child');
 
 document.addEventListener('DOMContentLoaded', function() {
    const sortableHeaders = document.querySelectorAll('th.sortable');
    
    sortableHeaders.forEach(sortableHeader => {
        sortableHeader.addEventListener('click', function() {
            const tbody = document.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            
            rows.reverse().forEach(row => tbody.appendChild(row));
        });
    });
});
});

function showConfirmation(actionType) {
 document.querySelectorAll('.confirm-btns').forEach(elem => {
     elem.style.display = 'none';
 });
 
 const confirmElement = document.getElementById(`${actionType}-confirm`);
 confirmElement.style.display = 'flex';
 
 document.querySelectorAll('.edit-btn, .delete-btn').forEach(btn => {
     btn.style.display = 'none';
 });
}

function confirmAction(actionType) {
 if (actionType === 'edit') {
     alert('Editing confirmed');
 } else if (actionType === 'delete') {
     alert('Delete confirmed');
 }
 
 resetButtons();
}

function cancelAction(actionType) {
 resetButtons();
}

function resetButtons() {
 document.querySelectorAll('.confirm-btns').forEach(elem => {
     elem.style.display = 'none';
 });
 
 document.querySelectorAll('.edit-btn, .delete-btn').forEach(btn => {
     btn.style.display = 'block';
 });
}

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
                        <button class="quantity-btn">-</button>
                        <div class="quantity-value">
                           ${element.quantity ?? 0}
                        </div>
                        <button class="quantity-btn">+</button>
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

