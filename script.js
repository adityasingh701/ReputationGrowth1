// ================================
// THE BLACK SELLER - SCRIPT.JS
// ================================


const couponInput = document.getElementById("couponCode");
const couponMessage = document.getElementById("couponMessage");
const applyCouponBtn = document.getElementById("applyCouponBtn");

let discountPercent = 0;
let couponApplied = false;


const orderForm = document.getElementById("orderForm");
const orderIdInput = document.getElementById("orderId");


const platformSelect = document.getElementById("platform");
const quantitySelect = document.getElementById("quantity");
const customBox = document.getElementById("customBox");
const customQuantity = document.getElementById("customQuantity");
const wishTypeSelect = document.getElementById("wishType");


const totalPriceElement = document.getElementById("totalPrice");


// ================================
// AUTO ORDER ID
// ================================


function generateOrderId(platform = "GEN") {
    const now = new Date();


    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");


    const random = Math.floor(100 + Math.random() * 900);


    return `TBS-${platform}-${year}${month}${day}-${random}`;
}


orderIdInput.value = generateOrderId();


// ================================
// CUSTOM QUANTITY TOGGLE
// ================================


quantitySelect.addEventListener("change", () => {
    if (quantitySelect.value === "custom") {
        customBox.classList.remove("hidden");
    } else {
        customBox.classList.add("hidden");
        customQuantity.value = "";
    }


    calculatePrice();
});


// ================================
// ORDER ID UPDATE ON PLATFORM CHANGE
// ================================


platformSelect.addEventListener("change", () => {


    let code = "GEN";


    if (platformSelect.value === "map") {
        code = "GM";
    }


    if (platformSelect.value === "5best") {
        code = "FB";
    }


    if (platformSelect.value === "justdial") {
    code = "JD";
    }
    
    orderIdInput.value = generateOrderId(code);


    calculatePrice();
});


// ================================
// LIVE PRICE CALCULATION
// ================================


wishTypeSelect.addEventListener("change", calculatePrice);
customQuantity.addEventListener("input", calculatePrice);


function calculatePrice() {


    const platform = platformSelect.value;
    const wishType = wishTypeSelect.value;


    let quantity = 0;


    if (quantitySelect.value === "custom") {
        quantity = parseInt(customQuantity.value) || 0;
    } else {
        quantity = parseInt(quantitySelect.value) || 0;
    }


    let rate = 0;


    // Google Maps Pricing
    if (platform === "map") {


        if (wishType === "1") rate = 25;
        if (wishType === "2") rate = 30;
        if (wishType === "3") rate = 35;


    }


    // 5BestInCity Pricing
    if (platform === "5best") {


        if (wishType === "1") rate = 20;
        if (wishType === "2") rate = 25;
        if (wishType === "3") rate = 30;


    }

    if (platform === "justdial") {

    if (wishType === "1") rate = 30;
    if (wishType === "2") rate = 35;
    if (wishType === "3") rate = 40;

    }
    

    let total = quantity * rate;

if(discountPercent > 0){
    total = total - ((total * discountPercent) / 100);
}

totalPriceElement.innerText =
`₹${Math.round(total)}`;
}


// ================================
// FORM SUBMIT
// ================================


orderForm.addEventListener("submit", async function (e) {


    e.preventDefault();


    const name = document.getElementById("name").value.trim();
    const whatsapp = document.getElementById("whatsapp").value.trim();
    const businessLink = document.getElementById("businessLink").value.trim();
    const language = document.getElementById("language").value;
    const notes = document.getElementById("notes").value.trim();


    let platform = "";

if(platformSelect.value === "map"){
    platform = "Google Maps";
}

if(platformSelect.value === "5best"){
    platform = "5BestInCity";
}

if(platformSelect.value === "justdial"){
    platform = "Justdial";
}


    const wishType =
        wishTypeSelect.value === "1"
            ? "1 Line"
            : wishTypeSelect.value === "2"
            ? "2 Line"
            : "3 Line";


    const quantity =
        quantitySelect.value === "custom"
            ? customQuantity.value
            : quantitySelect.value;


    const totalPrice = totalPriceElement.innerText;


    // ================================
    // VALIDATIONS
    // ================================


    if (name.length < 2) {
        alert("Please enter a valid name.");
        return;
    }


    if (!/^[6-9]\d{9}$/.test(whatsapp)) {
        alert("Please enter a valid 10 digit WhatsApp number.");
        return;
    }


    if (!platformSelect.value) {
        alert("Please select a platform.");
        return;
    }


    if (!wishTypeSelect.value) {
        alert("Please select wish type.");
        return;
    }


    if (!quantity || quantity <= 0) {
        alert("Please select quantity.");
        return;
    }


    // ================================
    // BUTTON LOADING
    // ================================


    const submitBtn = document.querySelector(".submit-btn");


    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting...";


    const formData = {
        orderId: orderIdInput.value,
        name: name,
        whatsapp: `+91${whatsapp}`,
        platform: platform,
        businessLink: businessLink,
        quantity: quantity,
        wishType: wishType,
        language: language,
        notes: notes,
        totalPrice: totalPrice,
        status: "New Lead",
        source: "Website"
    };


    try {


        // ================================
        // GOOGLE APPS SCRIPT WEB APP URL
        // ================================


        const response = await fetch(
            "https://script.google.com/macros/s/AKfycbyUF4MY28AxJqZN4Od3INuoQPfNymMn0U4yE1v8lpTeYoDyvFRhkn4nl7lzZxaSAGQXlw/exec",
            {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            }
        );


        document.getElementById(
    "successDetails"
).innerHTML = `
<b>Order ID:</b> ${formData.orderId}<br>
<b>Platform:</b> ${platform}<br>
<b>Quantity:</b> ${quantity} Wishes<br>
<b>Wish Type:</b> ${wishType}<br>
<b>Total Amount:</b> ${totalPrice}<br><br>

Our team will contact you on
WhatsApp shortly.
`;

document.getElementById(
    "successModal"
).style.display = "flex";


        orderForm.reset();


        totalPriceElement.innerText = "₹0";


        customBox.classList.add("hidden");


        orderIdInput.value = generateOrderId();


    } catch (error) {


        alert(
            "Something went wrong. Please try again."
        );


        console.error(error);


    } finally {


        submitBtn.disabled = false;
        submitBtn.innerText = "Place Order";


    }



function closeSuccessModal(){
    document.getElementById(
        "successModal"
    ).style.display = "none";
}

    applyCouponBtn.addEventListener("click",()=>{

    const code =
        couponInput.value
        .trim()
        .toUpperCase();

    if(couponApplied){
        couponMessage.innerHTML =
        "✅ Coupon already applied";
        couponMessage.style.color="green";
        return;
    }

    if(code === "SOMU20"){

        discountPercent = 20;

        couponApplied = true;

        couponMessage.innerHTML =
        "🎉 Code Applied Successfully! 20% Discount Activated";

        couponMessage.style.color="green";

        calculatePrice();
    }

    else{

        couponMessage.innerHTML =
        "❌ Invalid Coupon Code";

        couponMessage.style.color="red";
    }

});
