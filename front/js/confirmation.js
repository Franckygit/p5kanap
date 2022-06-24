let params = (new URL(document.location)).searchParams; 
let orderId = params.get('orderId');


const displayOrderId = document.querySelector("#orderId")
displayOrderId.textContent = orderId


deleteStorage()
function deleteStorage() {
    const storage = window.localStorage
    storage.clear()
}