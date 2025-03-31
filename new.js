document.addEventListener('DOMContentLoaded', function() {
 const minusBtns = document.querySelectorAll('.quantity-btn:first-child');
 const plusBtns = document.querySelectorAll('.quantity-btn:last-child');
 
 minusBtns.forEach(btn => {
     btn.addEventListener('click', function() {
         const valueSpan = this.nextElementSibling;
         let value = parseInt(valueSpan.textContent);
         if (value > 0) {
             valueSpan.textContent = value - 1;
         }
     });
 });
 
 plusBtns.forEach(btn => {
     btn.addEventListener('click', function() {
         const valueSpan = this.previousElementSibling;
         let value = parseInt(valueSpan.textContent);
         valueSpan.textContent = value + 1;
     });
 });
 
 const sortableHeaders = document.querySelectorAll('th.sortable');
 
 sortableHeaders.forEach(sortableHeader => {
     sortableHeader.addEventListener('click', function() {
         const tbody = document.querySelector('tbody');
         const rows = Array.from(tbody.querySelectorAll('tr'));
         
         rows.reverse().forEach(row => tbody.appendChild(row));
     });
 });

 // Form submission event listener
 const newItemForm = document.getElementById('new-item-form');
 if (newItemForm) {
     newItemForm.addEventListener('submit', function(event) {
         event.preventDefault();

         // Get input values
         const itemName = document.getElementById('itemName').value;
         const category = document.getElementById('category').value;
         const price = document.getElementById('price').value;
         const quantity = document.getElementById('quantity').value;
         const description = document.getElementById('description').value;

         // Create a new table row
         const inventoryTable = document.querySelector('table tbody');
         
         // Check if inventoryTable exists
         if (inventoryTable) {
             const newRow = document.createElement('tr');

             // Format the current date
             const currentDate = new Date().toLocaleDateString('en-GB');

             // Populate the row with input values
             newRow.innerHTML = `
                 <td>${itemName}</td>
                 <td>${description}</td>
                 <td>${category}</td>
                 <td>$${parseFloat(price).toFixed(2)}</td>
                 <td>${quantity}</td>
                 <td>${currentDate}</td>
                 <td>
                     <div class="flex space-x-2">
                         <button class="edit-btn" onclick="showConfirmation('edit')"><i class="edit-icon"></i></button>
                         <button class="delete-btn" onclick="showConfirmation('delete')"><i class="delete-icon"></i></button>
                     </div>
                 </td>
             `;

             // Add the new row to the table
             inventoryTable.appendChild(newRow);

             // Reset the form
             newItemForm.reset();

             // Redirect to inventory page
             window.location.href = 'index.html';
         }
     });
 }
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