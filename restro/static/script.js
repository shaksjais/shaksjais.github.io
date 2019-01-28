const search = document.getElementById("tables").querySelector("input")
var tables = { "Table-1" : { "itemCount" : 0, "cost" : 0, "dishes" : [] }, "Table-2" : { "itemCount" : 0, "cost" : 0, "dishes" : [] }, "Table-3" : { "itemCount" : 0, "cost" : 0, "dishes" : [] }  }
var dishes = { "Chicken Burger" : { "id" : 1, "cost" : 400 }, "Pasta" : { "id" : 2, "cost" : 100.50 }, "French Fries" : { "id" : 3, "cost" : 200 }, "Pizza" : { "id" : 4, "cost" : 500.60 }, "Crusty Garlic Focaccia" : { "id" : 5, "cost" : 200.25 } }
function pageLoad() {
   const tableNames =  document.getElementsByClassName("table");
   Array.from(tableNames).forEach( function(table) {
       renderTable(table);
   })

   const dishList = document.getElementById("dishes")
   renderDishes(dishList);
}

search.addEventListener("input", function(e)
{
    const query = e.target.value.toLowerCase()
    const tables = document.getElementsByClassName('table');
    Array.from(tables).forEach( function(table) {
        const name = table.firstElementChild.innerHTML;
        if( name.toLowerCase().indexOf(query) == -1 ) {
            table.style.display = 'none';
        }
        else {
            table.style.display = 'list-item';
        }
    })
    
})

const searchMenu = document.getElementById("menu").querySelector("input")
searchMenu.addEventListener("input", function(e)
{
    const query = e.target.value.toLowerCase()
    const dishes = document.getElementsByClassName('dish');
    Array.from(dishes).forEach(function(dish) {
        const name = dish.firstElementChild.innerHTML;
        if( name.toLowerCase().indexOf(query) == -1 ) {
            dish.style.display = 'none';
        }
        else {
            dish.style.display = 'list-item';
        }
    })
    
})

function renderTable(table) {
    const tableId = table.firstElementChild.innerHTML;
    table.lastElementChild.innerHTML = "Rs. " + (tables[tableId]['cost'].toFixed(2)) + " | Total items:" + tables[tableId]['itemCount'];
}

function renderDishes(dishList) {
    for( dish in dishes ) {
        dishList.innerHTML += `<div draggable="true" ondragstart="drag(event)" class="dish">
        <label class="dName">${dish}</label>
        <label class="dCost">${dishes[dish]['cost']}</label>
        </div>`
    }
}

function updateTable(cost, name, table) {  
    const tableId = table.firstElementChild.innerHTML;
    tables[tableId]['cost'] += parseFloat(cost);
    tables[tableId]['itemCount'] += 1;
    tables[tableId]['dishes'].push(name);
    renderTable(table); 
}

function showDetails(table) {
    popUp(table);
}

function allowDrop(ev) {
    ev.preventDefault();
}
  
function drag(ev) {
    ev.dataTransfer.setData("cost", ev.target.lastElementChild.innerHTML);
    ev.dataTransfer.setData("name", ev.target.firstElementChild.innerHTML);
}
  
function drop(ev, el) {
    ev.preventDefault();
    var cost = ev.dataTransfer.getData("cost");
    var name = ev.dataTransfer.getData("name");
    updateTable(cost, name, el)
}

var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];

function popUp(table) {
    modal.style.display = "block";
    table.style.backgroundColor = "orange";
    const currentTable = tables[table.firstElementChild.innerHTML].dishes;
    const tableBody = document.getElementById('popup-body');
    let dishList = {};
    let i = 1;
    currentTable.forEach( function(dish) {
        dish in dishList ? dishList[dish] += 1 : dishList[dish] = 1;
    } )
    console.log(dishList);
    for( dish in dishList ) { 
        tableBody.innerHTML += `<tr><td class="sNo">${i++}</td>
        <td class="itemName">${dish}</td>
        <td class="itemPrice">${dishes[dish]['cost']}</td>
        <td>
            <label style="font-size: 10px; display: block" for="quantity">Number of Servings</label>
            <input id="quantity" name="quantity" class="quantity" type="number" min="0" step="1" value="${dishList[dish]}" />
        </td>
        <td><img class="remove" style="padding-left: 15px;" height="18px" src="./static/trash.svg" onclick="removeItem(this)" /></td>
        </tr>`;
    }
    renderCost(tableBody);
    inputListener(table, tableBody);
}

function removeItem(btn) {
    let tableId = tableSelector();
    const dishList = tables[tableId];
    let count = dishList.dishes.length;
    let removeDish = btn.parentElement.parentElement.childNodes[2].innerHTML;
    dishList.dishes.forEach( function() {
        tables[tableId].dishes = tables[tableId].dishes.filter( i => i !== removeDish )
    })
    tables[tableId].itemCount = tables[tableId].dishes.length
    tables[tableId].cost -= dishes[removeDish].cost * ( count - tables[tableId].itemCount );
    btn.parentElement.parentElement.parentElement.removeChild(btn.parentElement.parentElement);
    renderCost(document.getElementById('popup-body'));
    renderTable(document.getElementById(tableId));
    
}

function tableSelector() {
    const tableNames = document.getElementsByClassName("table");
    let tableId = '';
    Array.from(tableNames).forEach(function (table) {
        if (table.style.backgroundColor == 'orange') {
            tableId = table.firstElementChild.innerHTML;
        }
    });
    return tableId;
}

function renderCost(tableBody) {    
    let totalCost = getCost(tableBody).split(":")[1];
    const totalcost = document.getElementById("totalcost")
    totalcost.innerHTML = "Total Cost: " + totalCost;
}

function getCost(tableBody) {
    let totalCost = 0;
    let totalCount = 0;
    const quantity = tableBody.getElementsByClassName("quantity");
    Array.from(quantity).forEach(function (count) {
        if( !(count.value == '') )
            totalCount += parseInt(count.value);
        totalCost += count.value * count.parentElement.previousElementSibling.innerHTML;
    });
    return totalCount + ":" + totalCost;
}

function closePopUp() {
  modal.style.display = "none";
  const tables = document.getElementsByClassName('table');
  const tableBody = document.getElementById('popup-body');
  tableBody.innerHTML = '';
  Array.from(tables).forEach( function(table) {
      table.style.backgroundColor = 'white';
  })
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    const tables = document.getElementsByClassName('table');
    Array.from(tables).forEach( function(table) {
        table.style.backgroundColor = 'white';
    })
  }
}

function inputListener(table, tableBody) {
    const quantity = document.getElementsByClassName("quantity");
    for (i = 0; i < quantity.length; i++) {
        quantity[i].addEventListener("focus", function (e) {
            e.srcElement.parentElement.firstElementChild.style.color = "blue";
            e.srcElement.parentElement.firstElementChild.style.fontSize = "11px";
        });
        quantity[i].addEventListener("focusout", function (e) {
            e.srcElement.parentElement.firstElementChild.style.color = "black";
            e.srcElement.parentElement.firstElementChild.style.fontSize = "10px";
            if(e.target.value == '0' || e.target.value == '')
                e.target.value = 1;
            validateInput(table, e, tableBody);
        });
        quantity[i].addEventListener("input", function(e) {
            validateInput(table, e, tableBody);
            
        })
    }
    
}

function validateInput(table, e, tableBody) {
    const currentTable = tables[table.firstElementChild.innerHTML];
    currentTable.dishes.push(e.target.parentElement.parentElement.childNodes[2].innerHTML);
    let costAndcount = getCost(tableBody);
    console.log(costAndcount);
    currentTable.cost = parseFloat(costAndcount.split(":")[1]);
    currentTable.itemCount = parseInt(costAndcount.split(":")[0]);
    renderCost(tableBody);
    renderTable(table);
}

function generateBill() {
    let tableId = tableSelector();
    tables[tableId] = { "itemCount" : 0, "cost" : 0, "dishes" : [] } ;
    let table = document.getElementById(tableId);
    table.parentElement.removeChild(table);
    alert(document.getElementById("totalcost").innerHTML);
    closePopUp();
}