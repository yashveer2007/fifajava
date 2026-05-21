

const cartItems = JSON.parse(sessionStorage.getItem("js_cart_items") || "[]");
const currency  = sessionStorage.getItem("js_cart_currency") || "inr";

const EX_RATE = 91.94;   

if (cartItems.length === 0) {
    window.location.href = "index.html";
}

function formatPrice(baseInr) {
    if (currency === "usd") {
        return "$" + (baseInr / EX_RATE).toFixed(2);
    }
    return "₹" + baseInr;
}

const cpItemsList   = document.getElementById("cp-items-list");
const cpTotalAmount = document.getElementById("cp-total-amount");

function renderSummary() {
    cpItemsList.innerHTML = "";

    
    cartItems.forEach(function(item) {
        const row = document.createElement("div");
        row.className = "cp-item-row";

        
        const img = document.createElement("img");
        img.src       = item.image;
        img.alt       = item.name;
        img.className = "cp-item-img";
        row.appendChild(img);

        
        const info = document.createElement("div");
        info.className = "cp-item-info";

        const nameEl = document.createElement("p");
        nameEl.className   = "cp-item-name";
        nameEl.textContent = item.name;
        info.appendChild(nameEl);

        
        if (item.size && item.size !== "Regular") {
            const sizeEl = document.createElement("p");
            sizeEl.className   = "cp-item-size";
            sizeEl.textContent = item.size;
            info.appendChild(sizeEl);
        }

        row.appendChild(info);

        
        const priceCol = document.createElement("div");
        priceCol.className = "cp-item-price-col";

        const qtyEl = document.createElement("span");
        qtyEl.className   = "cp-item-qty";
        qtyEl.textContent = "×" + item.qty;
        priceCol.appendChild(qtyEl);

        const priceEl = document.createElement("span");
        priceEl.className   = "cp-item-price";
        priceEl.textContent = formatPrice(item.basePrice * item.qty);
        priceCol.appendChild(priceEl);

        row.appendChild(priceCol);
        cpItemsList.appendChild(row);
    });

    
    const total = cartItems.reduce(function(sum, item) {
        return sum + item.basePrice * item.qty;
    }, 0);

    cpTotalAmount.textContent = formatPrice(total);
}

renderSummary();

const methodRadios = document.querySelectorAll('input[name="paymentMethod"]');
const cardFields   = document.getElementById("cp-card-fields");
const upiFields    = document.getElementById("cp-upi-fields");

function updatePaymentFields() {
    const selected = document.querySelector('input[name="paymentMethod"]:checked');
    const method   = selected ? selected.value : "cash";

    if (method === "card") {
        cardFields.style.display = "flex";
        upiFields.style.display  = "none";
    } else if (method === "upi") {
        cardFields.style.display = "none";
        upiFields.style.display  = "flex";
    } else {
        
        cardFields.style.display = "none";
        upiFields.style.display  = "none";
    }

    
    document.querySelectorAll(".cp-field-error").forEach(function(el) {
        el.textContent = "";
    });
}

methodRadios.forEach(function(radio) {
    radio.addEventListener("change", updatePaymentFields);
});

updatePaymentFields();

function getCurrentUser() {
    return JSON.parse(
        localStorage.getItem("js_current_user") ||
        sessionStorage.getItem("js_current_user") ||
        "null"
    );
}

function getUserRecord(email) {
    const users = JSON.parse(localStorage.getItem("js_users") || "[]");
    return users.find(function(u) { return u.email === email; }) || null;
}

function saveUserRecord(updatedUser) {
    const users = JSON.parse(localStorage.getItem("js_users") || "[]");
    const idx   = users.findIndex(function(u) { return u.email === updatedUser.email; });
    if (idx !== -1) {
        users[idx] = updatedUser;
        localStorage.setItem("js_users", JSON.stringify(users));
    }
}

const saveRow      = document.getElementById("cp-save-row");
const saveCheckbox = document.getElementById("cp-save-payment");
const currentUser  = getCurrentUser();

if (!currentUser) {
    saveRow.style.display = "none";
}

if (currentUser) {
    const record = getUserRecord(currentUser.email);
    if (record && record.paymentInfo) {
        const pi = record.paymentInfo;

        
        const savedRadio = document.querySelector(
            'input[name="paymentMethod"][value="' + pi.method + '"]'
        );
        if (savedRadio) {
            savedRadio.checked = true;
            updatePaymentFields();
        }

        if (pi.method === "card") {
            document.getElementById("cp-card-number").value = pi.cardNumber || "";
            document.getElementById("cp-card-expiry").value = pi.cardExpiry || "";
            document.getElementById("cp-card-name").value   = pi.cardName   || "";
            
        }

        if (pi.method === "upi") {
            document.getElementById("cp-upi-id").value = pi.upiId || "";
        }
    }
}

const cardNumberInput = document.getElementById("cp-card-number");
const cardExpiryInput = document.getElementById("cp-card-expiry");

cardNumberInput.addEventListener("input", function() {
    let raw = cardNumberInput.value.replace(/\D/g, "");
    let groups = [];
    
    for (let i = 0; i < raw.length && i < 16; i += 4) {
        groups.push(raw.slice(i, i + 4));
    }
    cardNumberInput.value = groups.join(" ");
});

cardExpiryInput.addEventListener("input", function() {
    let raw = cardExpiryInput.value.replace(/\D/g, "");
    if (raw.length > 2) {
        raw = raw.slice(0, 2) + " / " + raw.slice(2, 4);
    }
    cardExpiryInput.value = raw;
});

function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) el.textContent = msg;
}
function clearError(id) {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
}

function validateCardNumber(val) {
    const digits = val.replace(/\s/g, "");
    if (digits.length !== 16 || !/^\d+$/.test(digits)) {
        showError("cp-card-number-err", "Enter a valid 16-digit card number.");
        return false;
    }
    clearError("cp-card-number-err");
    return true;
}

function validateCardExpiry(val) {
    const match = val.replace(/\s/g, "").match(/^(\d{2})\/(\d{2})$/);
    if (!match) {
        showError("cp-card-expiry-err", "Use MM / YY format.");
        return false;
    }
    const month = parseInt(match[1], 10);
    const year  = parseInt("20" + match[2], 10);
    const now   = new Date();
    if (month < 1 || month > 12) {
        showError("cp-card-expiry-err", "Invalid month.");
        return false;
    }
    if (year < now.getFullYear() ||
       (year === now.getFullYear() && month < now.getMonth() + 1)) {
        showError("cp-card-expiry-err", "Card has expired.");
        return false;
    }
    clearError("cp-card-expiry-err");
    return true;
}

function validateCvv(val) {
    if (!/^\d{3,4}$/.test(val.trim())) {
        showError("cp-card-cvv-err", "CVV must be 3 or 4 digits.");
        return false;
    }
    clearError("cp-card-cvv-err");
    return true;
}

function validateCardName(val) {
    if (val.trim().length < 2) {
        showError("cp-card-name-err", "Enter the name as printed on the card.");
        return false;
    }
    clearError("cp-card-name-err");
    return true;
}

function validateUpiId(val) {
    if (!/^[a-zA-Z0-9.\-_]+@[a-zA-Z0-9]+$/.test(val.trim())) {
        showError("cp-upi-id-err", "Enter a valid UPI ID (e.g. name@upi).");
        return false;
    }
    clearError("cp-upi-id-err");
    return true;
}

function validatePayment(method) {
    if (method === "card") {
        const a = validateCardNumber(document.getElementById("cp-card-number").value);
        const b = validateCardExpiry(document.getElementById("cp-card-expiry").value);
        const c = validateCvv(document.getElementById("cp-card-cvv").value);
        const d = validateCardName(document.getElementById("cp-card-name").value);
        return a && b && c && d;
    }
    if (method === "upi") {
        return validateUpiId(document.getElementById("cp-upi-id").value);
    }
    return true;   
}

function persistPaymentInfo(method) {
    if (!currentUser) return;
    if (!saveCheckbox.checked) return;

    const record = getUserRecord(currentUser.email);
    if (!record) return;

    
    const pi = { method: method };

    if (method === "card") {
        pi.cardNumber = document.getElementById("cp-card-number").value;
        pi.cardExpiry = document.getElementById("cp-card-expiry").value;
        pi.cardName   = document.getElementById("cp-card-name").value;
    }
    if (method === "upi") {
        pi.upiId = document.getElementById("cp-upi-id").value;
    }

    
    const updatedUser = Object.assign({}, record, { paymentInfo: pi });
    saveUserRecord(updatedUser);
}

const overlay       = document.getElementById("cp-overlay");
const overlaySecsEl = document.getElementById("cp-overlay-secs");

function showOrderComplete() {
    document.body.classList.add("noscroll");

    
    
    
    
    overlay.classList.add("show");

    
    let secsLeft = 5;
    overlaySecsEl.textContent = secsLeft;

    const countdown = setInterval(function() {
        secsLeft--;
        overlaySecsEl.textContent = secsLeft;

        if (secsLeft <= 0) {
            clearInterval(countdown);   

            
            sessionStorage.removeItem("js_cart_items");
            sessionStorage.removeItem("js_cart_currency");

            
            window.location.replace("index.html");
        }
    }, 1000);
}

const placeOrderBtn = document.getElementById("cp-place-order-btn");
const globalError   = document.getElementById("cp-global-error");

placeOrderBtn.addEventListener("click", function() {
    globalError.textContent = "";

    const selected = document.querySelector('input[name="paymentMethod"]:checked');
    const method   = selected ? selected.value : "cash";

    
    if (!validatePayment(method)) return;

    
    persistPaymentInfo(method);

    
    placeOrderBtn.disabled    = true;
    placeOrderBtn.textContent = "Processing...";

    
    
    setTimeout(function() {
        showOrderComplete();
    }, 600);
});
