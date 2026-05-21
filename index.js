if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

 {
    let mbtn = document.getElementById("mbtn")
    let logo = document.getElementById("logo")
    let logospan = document.getElementById("logospan")

    function goToMainPage() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    mbtn.onclick = goToMainPage;
    logo.style.cursor = "pointer";
    logospan.addEventListener("click", goToMainPage);
}

 {
    const locationbtn = document.getElementById("locationbtn");
    const locationdropdown = document.getElementById("locationdropdown");

    locationbtn.addEventListener("click", () => {
        locationdropdown.classList.toggle("show");
        locationbtn.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
        if (!locationbtn.contains(e.target) && !locationdropdown.contains(e.target)) {
            locationdropdown.classList.remove("show");
            locationbtn.classList.remove("active");
        }
    });

    const exrate = 91.94;
    const india = document.getElementById("india");
    const usa = document.getElementById("usa");

    india.onclick = function() {
        locationbtn.textContent = `INDIA ▾`
        locationdropdown.classList.remove("show");
        locationbtn.classList.remove("active");

        
        let price = document.getElementsByClassName("price");
        let len = price.length;

        let i;
        for(i=0; i<len; i++) {
            let value = price[i].dataset.price;
            let convertedvalue = (value);
            price[i].textContent = `₹${convertedvalue}`;
        }
    }
    usa.onclick = function() {
        locationbtn.textContent = `USA ▾`
        locationdropdown.classList.remove("show");
        locationbtn.classList.remove("active");

        
        let price = document.getElementsByClassName("price");
        let len = price.length;

        let i;
        for(i=0; i<len; i++) {
            let value =  price[i].dataset.price;
            value = parseFloat(value);
            let convertedvalue = (value/exrate).toFixed(2);
            price[i].textContent = `$${convertedvalue}`;
        }
    }
}

{
    
    const signinbtn        = document.getElementById("signin");
    const signinmodal      = document.getElementById("signinmodal");
    const signinmodalcontainer = document.getElementById("signinmodalcontainer");
    const signinmodalclosebtn  = document.getElementById("signinmodalclosebtn");

    
    const sibutton   = document.getElementById("sibutton");
    const joinbutton = document.getElementById("joinbutton");

    
    const signinform  = document.getElementById("signinform");
    const siEmail     = document.getElementById("si-email");
    const siPassword  = document.getElementById("si-password");
    const siRemember  = document.getElementById("si-remember");
    const siSubmitBtn = document.getElementById("sisubmitbtn");
    const siError     = document.getElementById("si-error");

    
    const joinform      = document.getElementById("joinform");
    const joinFirstname = document.getElementById("join-firstname");
    const joinLastname  = document.getElementById("join-lastname");
    const joinEmail     = document.getElementById("join-email");
    const joinPassword  = document.getElementById("join-password");
    const joinSubmitBtn = document.getElementById("joinsubmitbtn");
    const joinError     = document.getElementById("join-error");

    
    
    
    

    function getUsers() {
        return JSON.parse(localStorage.getItem("js_users") || "[]");
    }

    function saveUsers(users) {
        localStorage.setItem("js_users", JSON.stringify(users));
    }

    
    
    
    function getCurrentUser() {
        return JSON.parse(
            localStorage.getItem("js_current_user") ||
            sessionStorage.getItem("js_current_user") ||
            "null"
        );
    }

    function setCurrentUser(userData, remember) {
        const value = JSON.stringify(userData);
        if (remember) {
            localStorage.setItem("js_current_user", value);
        } else {
            sessionStorage.setItem("js_current_user", value);
        }
    }

    function clearCurrentUser() {
        localStorage.removeItem("js_current_user");
        sessionStorage.removeItem("js_current_user");
    }

    
    

    function isValidEmail(email) {
        
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    }

    function isValidPassword(pw) {
        
        return pw.length >= 8 && /\d/.test(pw);
    }

    
    
    

    function updateHeader(user) {
        if (user) {
            signinbtn.textContent = user.firstName + " ▾";
        } else {
            signinbtn.textContent = "Sign In";
        }
    }

    

    function openModal() {
        signinmodalcontainer.classList.add("show");
        document.body.classList.add("noscroll");
    }

    function closeModal() {
        signinmodalcontainer.classList.remove("show");
        document.body.classList.remove("noscroll");
        
        siError.textContent = "";
        joinError.textContent = "";
    }

    
    
    

    function checkSignInForm() {
        const emailOk    = isValidEmail(siEmail.value);
        const passwordOk = siPassword.value.length > 0;
        siSubmitBtn.disabled = !(emailOk && passwordOk);
    }

    siEmail.addEventListener("input", checkSignInForm);
    siPassword.addEventListener("input", checkSignInForm);

    

    function checkJoinForm() {
        const firstOk    = joinFirstname.value.trim().length > 0;
        const lastOk     = joinLastname.value.trim().length > 0;
        const emailOk    = isValidEmail(joinEmail.value);
        const passwordOk = isValidPassword(joinPassword.value);
        joinSubmitBtn.disabled = !(firstOk && lastOk && emailOk && passwordOk);
    }

    joinFirstname.addEventListener("input", checkJoinForm);
    joinLastname.addEventListener("input", checkJoinForm);
    joinEmail.addEventListener("input", checkJoinForm);

    
    
    joinPassword.addEventListener("input", function () {
        const pw = joinPassword.value;
        if (pw.length > 0 && !isValidPassword(pw)) {
            joinError.textContent = "Password needs 8+ characters and at least one number.";
        } else {
            joinError.textContent = "";
        }
        checkJoinForm();
    });

    

    signinform.addEventListener("submit", function (e) {
        e.preventDefault();          
        siError.textContent = "";    

        const email    = siEmail.value.trim().toLowerCase();
        const password = siPassword.value;
        const remember = siRemember.checked;

        
        const users = getUsers();
        const match = users.find(function (u) { return u.email === email; });

        if (!match) {
            siError.textContent = "No account found with that email.";
            return;
        }
        if (match.password !== password) {
            siError.textContent = "Incorrect password. Please try again.";
            return;
        }

        
        const session = { email: match.email, firstName: match.firstName };
        setCurrentUser(session, remember);
        updateHeader(session);
        closeModal();
    });

    

    joinform.addEventListener("submit", function (e) {
        e.preventDefault();
        joinError.textContent = "";

        const email     = joinEmail.value.trim().toLowerCase();
        const password  = joinPassword.value;
        const firstName = joinFirstname.value.trim();
        const lastName  = joinLastname.value.trim();

        const users = getUsers();

        
        const alreadyExists = users.find(function (u) { return u.email === email; });
        if (alreadyExists) {
            joinError.textContent = "An account with this email already exists. Try signing in.";
            return;
        }

        
        
        const newUser = {
            email:       email,
            password:    password,
            firstName:   firstName,
            lastName:    lastName,
            orders:      [],       
            saved:       [],       
            paymentInfo: null      
        };

        users.push(newUser);
        saveUsers(users);          

        
        const session = { email: newUser.email, firstName: newUser.firstName };
        setCurrentUser(session, true);
        updateHeader(session);
        closeModal();
    });

    
    

    signinbtn.addEventListener("click", function () {
        const currentUser = getCurrentUser();
        if (currentUser) {
            clearCurrentUser();
            updateHeader(null);
        } else {
            openModal();
        }
    });

    

    signinmodalclosebtn.addEventListener("click", closeModal);

    document.addEventListener("click", function (e) {
        if (
            !signinmodal.contains(e.target) &&
            !signinbtn.contains(e.target)
        ) {
            closeModal();
        }
    });

    

    sibutton.addEventListener("click", function () {
        joinform.classList.remove("show");
        signinform.classList.remove("remove");
        sibutton.classList.remove("notactive");
        joinbutton.classList.remove("active");
        signinmodal.classList.remove("join");
        siError.textContent   = "";
        joinError.textContent = "";
    });

    joinbutton.addEventListener("click", function () {
        joinform.classList.add("show");
        signinform.classList.add("remove");
        sibutton.classList.add("notactive");
        joinbutton.classList.add("active");
        signinmodal.classList.add("join");
        siError.textContent   = "";
        joinError.textContent = "";
    });

    
    
    
    

    (function restoreSession() {
        const currentUser = getCurrentUser();
        updateHeader(currentUser);
    })();
}

{
    
    
    
    const products = [
        { name: "Hot Coffee",         id: "hotcoffee"  },
        { name: "Cold Coffee",        id: "coldcoffee" },
        { name: "Matcha",             id: "matcha"     },
        { name: "Hot Tea",            id: "hottea"     },
        { name: "Ice Tea",            id: "icetea"     },
        { name: "Bottled Water",      id: "water"      },
        { name: "Breakfast Sandwich", id: "sandwich"   },
        { name: "Breakfast Wrap",     id: "wrap"       },
        { name: "Croissant",          id: "croissant"  },
        { name: "Muffin",             id: "muffin"     },
    ];

    
    const searchicon           = document.getElementById("searchicon");
    const searchmodalcontainer = document.getElementById("searchmodalcontainer");
    const searchmodal          = document.getElementById("searchmodal");
    const searchinput          = document.getElementById("searchinput");
    const searchresults        = document.getElementById("searchresults");

    

    function openSearch() {
        searchmodalcontainer.classList.add("show");
        searchinput.focus();
    }

    function closeSearch() {
        searchmodalcontainer.classList.remove("show");
        searchinput.value        = "";
        searchresults.innerHTML  = "";
    }

    searchicon.addEventListener("click", function (e) {
        e.stopPropagation();
        openSearch();
    });

    document.addEventListener("click", function (e) {
        if (
            !searchmodal.contains(e.target) &&
            !searchicon.contains(e.target)
        ) {
            closeSearch();
        }
    });

    

    function getMatches(query) {
        const q = query.trim().toLowerCase();
        if (!q) return [];
        return products.filter(function (p) {
            return p.name.toLowerCase().includes(q);
        });
    }

    

    function goToProduct(productId) {
        closeSearch();

        
        document.getElementById("meb").click();

        const targetDiv   = document.getElementById(productId + "div");
        const targetModal = document.getElementById(productId + "modal");

        if (!targetDiv || !targetModal) return;

        setTimeout(function () {
            const rawTop  = targetDiv.getBoundingClientRect().top + window.pageYOffset;
            const scrollTo = rawTop - 70;

            window.scrollTo({ top: scrollTo, behavior: "smooth" });

            closeAllModals();
            targetModal.classList.add("show");
            targetDiv.style.zIndex = "900";
        }, 80);
    }

    

    function renderResults(matches, query) {
        searchresults.innerHTML = "";

        if (!query.trim()) return;

        if (matches.length === 0) {
            const msg       = document.createElement("p");
            msg.className   = "search-noresult";
            msg.textContent = `No results for "${query}" — try "coffee", "matcha", or "croissant".`;
            searchresults.appendChild(msg);
            return;
        }

        matches.forEach(function (product) {
            const btn       = document.createElement("button");
            btn.className   = "search-result-item";
            btn.textContent = product.name;

            btn.addEventListener("click", function () {
                goToProduct(product.id);
            });

            searchresults.appendChild(btn);
        });
    }

    

    searchinput.addEventListener("input", function () {
        const matches = getMatches(searchinput.value);
        renderResults(matches, searchinput.value);
    });

    searchinput.addEventListener("keydown", function (e) {
        if (e.key !== "Enter") return;
        const matches = getMatches(searchinput.value);
        if (matches.length === 1) {
            goToProduct(matches[0].id);
        }
    });
}

 {

window.PRODUCTS = {
    trending: {
        name:        "Trending",
        image:       "images/hotcoffee.png",
        price:       320,
        description: "Our most-loved drink right now. A smooth, perfectly balanced hot coffee crafted from single-origin beans — warming, bold, and endlessly satisfying.",
        tags:        ["Fan Favourite", "Hot"],
        sizes:       ["Tall", "Grande", "Venti"],
    },
    smt: {
        name:        "Seasonal Special",
        image:       "images/coldcoffee.png",
        price:       380,
        description: "A limited-edition cold coffee creation made with seasonal flavours and our signature cold-brew base. Try it before it's gone!",
        tags:        ["Limited", "Cold"],
        sizes:       ["Tall", "Grande", "Venti"],
    },
    hotcoffee: {
        name:        "Hot Coffee",
        image:       "images/hotcoffee.png",
        price:       280,
        description: "Classic hand-crafted hot coffee brewed with premium Arabica beans. Rich aroma, smooth body, perfect at any time of the day.",
        tags:        ["Hot", "Caffeinated"],
        sizes:       ["Tall", "Grande", "Venti"],
    },
    coldcoffee: {
        name:        "Cold Coffee",
        image:       "images/coldcoffee.png",
        price:       320,
        description: "Chilled espresso poured over ice with your choice of milk. Refreshingly strong and incredibly smooth — the perfect pick-me-up.",
        tags:        ["Cold", "Caffeinated"],
        sizes:       ["Tall", "Grande", "Venti"],
    },
    matcha: {
        name:        "Matcha",
        image:       "images/matcha.png",
        price:       350,
        description: "Ceremonial-grade Japanese matcha whisked into steamed milk. Earthy, creamy, and naturally energising — a calm alternative to coffee.",
        tags:        ["Hot / Cold", "Antioxidants"],
        sizes:       ["Tall", "Grande", "Venti"],
    },
    hottea: {
        name:        "Hot Tea",
        image:       "images/hottea.png",
        price:       200,
        description: "Premium loose-leaf tea steeped to perfection. Choose from classic Assam, soothing chamomile, or our fragrant masala blend.",
        tags:        ["Hot", "Soothing"],
        sizes:       ["Tall", "Grande"],
    },
    icetea: {
        name:        "Ice Tea",
        image:       "images/icetea.png",
        price:       240,
        description: "Freshly brewed tea chilled over ice and lightly sweetened. Available in peach, lemon, and hibiscus — crisp and incredibly refreshing.",
        tags:        ["Cold", "Refreshing"],
        sizes:       ["Tall", "Grande", "Venti"],
    },
    water: {
        name:        "Bottled Water",
        image:       "images/water.png",
        price:       80,
        description: "Chilled purified mineral water. The cleanest, simplest refreshment — always a good idea.",
        tags:        ["Cold", "Non-caffeinated"],
        sizes:       ["500 ml", "1 L"],
    },
    sandwich: {
        name:        "Breakfast Sandwich",
        image:       "images/sandwich.png",
        price:       320,
        description: "A toasted artisan roll filled with a fluffy egg patty, melted cheese, and your choice of chicken or veggie filling. Hearty and delicious.",
        tags:        ["Food", "Warm"],
        sizes:       ["Regular"],
    },
    wrap: {
        name:        "Breakfast Wrap",
        image:       "images/wrap.png",
        price:       300,
        description: "A soft flour tortilla packed with scrambled eggs, fresh vegetables, and a drizzle of our house sauce. Light yet filling.",
        tags:        ["Food", "Warm"],
        sizes:       ["Regular"],
    },
    croissant: {
        name:        "Croissant",
        image:       "images/croissant.png",
        price:       220,
        description: "Buttery, flaky, and golden-brown. Our all-butter croissant is baked fresh every morning — pair it with any drink for the perfect start.",
        tags:        ["Food", "Baked"],
        sizes:       ["Regular"],
    },
    muffin: {
        name:        "Muffin",
        image:       "images/muffin.png",
        price:       180,
        description: "A generously-sized, moist muffin available in blueberry, double chocolate, or banana walnut. Perfect with your morning coffee.",
        tags:        ["Food", "Baked"],
        sizes:       ["Regular"],
    },
};

function closeAllModals() {
    document.querySelectorAll('.productmodal').forEach(function(modal) {
        modal.classList.remove('show');
    });
    document.querySelectorAll('.productdiv').forEach(function(div) {
        div.style.zIndex = "1";
    });
}

function buildModal(productId) {
    const product = window.PRODUCTS[productId];
    if (!product) return null;

    let qty = 1;
    let sizeMultiplier = 1;   

    const frag = document.createDocumentFragment();

    
    const img = document.createElement("img");
    img.src       = product.image;
    img.alt       = product.name;
    img.className = "modal-product-img";
    frag.appendChild(img);

    
    const info = document.createElement("div");
    info.className = "modal-info";

    
    const nameEl = document.createElement("p");
    nameEl.className   = "modal-name";
    nameEl.textContent = product.name;
    info.appendChild(nameEl);

    
    const tagsEl = document.createElement("div");
    tagsEl.className = "modal-tags";
    product.tags.forEach(function(tag) {
        const span = document.createElement("span");
        span.className   = "modal-tag";
        span.textContent = tag;
        tagsEl.appendChild(span);
    });
    info.appendChild(tagsEl);

    
    const desc = document.createElement("p");
    desc.className   = "modal-desc";
    desc.textContent = product.description;
    info.appendChild(desc);

    
    if (product.sizes.length > 1) {
        const sizeLabel = document.createElement("p");
        sizeLabel.className   = "modal-size-label";
        sizeLabel.textContent = "SIZE";
        info.appendChild(sizeLabel);

        const sizeRow = document.createElement("div");
        sizeRow.className = "modal-size-row";

        product.sizes.forEach(function(size, index) {
            const sizeBtn = document.createElement("button");
            sizeBtn.className   = "modal-size-btn" + (index === 0 ? " selected" : "");
            sizeBtn.textContent = size;
            sizeBtn.dataset.multiplier = index === 0 ? 1 : index === 1 ? 1.5 : 2;

            sizeBtn.addEventListener("click", function(e) {
                e.stopPropagation();
                sizeRow.querySelectorAll(".modal-size-btn").forEach(function(b) {
                    b.classList.remove("selected");
                });
                sizeBtn.classList.add("selected");
                sizeMultiplier = parseFloat(sizeBtn.dataset.multiplier);
                updatePriceDisplay();
            });

            sizeRow.appendChild(sizeBtn);
        });
        info.appendChild(sizeRow);
    }

    frag.appendChild(info);

    
    const bottomBar = document.createElement("div");
    bottomBar.className = "modal-bottom";

    
    const priceEl = document.createElement("p");
    priceEl.className      = "price modal-price";
    priceEl.dataset.price  = product.price;
    priceEl.textContent    = `₹${product.price}`;
    bottomBar.appendChild(priceEl);

    
    function updatePriceDisplay() {
        const newPrice = product.price * sizeMultiplier;
        priceEl.dataset.price = newPrice;
        
        const locText = document.getElementById("locationbtn").textContent || "";
        const isUSD = locText.includes("USA");
        const exrate = 91.94;
        const symbol = isUSD ? "$" : "₹";
        const displayPrice = isUSD ? (newPrice / exrate).toFixed(2) : newPrice;
        priceEl.textContent = symbol + displayPrice;
    }

    
    const qtyRow = document.createElement("div");
    qtyRow.className = "modal-qty-row";

    const minusBtn = document.createElement("button");
    minusBtn.className   = "modal-qty-btn";
    minusBtn.textContent = "−";

    const qtyDisplay = document.createElement("span");
    qtyDisplay.className   = "modal-qty-display";
    qtyDisplay.textContent = qty;

    const plusBtn = document.createElement("button");
    plusBtn.className   = "modal-qty-btn";
    plusBtn.textContent = "+";

    minusBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        if (qty > 1) {
            qty--;
            qtyDisplay.textContent = qty;
        }
    });
    plusBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        qty++;
        qtyDisplay.textContent = qty;
    });

    qtyRow.appendChild(minusBtn);
    qtyRow.appendChild(qtyDisplay);
    qtyRow.appendChild(plusBtn);
    bottomBar.appendChild(qtyRow);

    
    const atcBtn = document.createElement("button");
    atcBtn.className   = "atc modal-atc";
    atcBtn.textContent = "ADD TO CART";

    atcBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        atcBtn.classList.add("added");
        atcBtn.textContent = "ADDED ✓";

        const selectedSizeBtn = atcBtn.closest('.productmodal')
                                      .querySelector('.modal-size-btn.selected');
        const chosenSize = selectedSizeBtn ? selectedSizeBtn.textContent : product.sizes[0];

        window.addToCart(productId, qty, chosenSize);
        
        // Close the modal after adding
        closeAllModals();
        
        // Reset button state after brief delay so user sees "ADDED ✓"
        setTimeout(function() {
            atcBtn.classList.remove("added");
            atcBtn.textContent = "ADD TO CART";
        }, 600);
    });

    bottomBar.appendChild(atcBtn);
    frag.appendChild(bottomBar);

    return frag;
}

document.querySelectorAll('.productmodal').forEach(function(modalEl) {
    const productId = modalEl.id.replace('modal', '');
    const content   = buildModal(productId);
    if (content) {
        modalEl.appendChild(content);
    }
});

document.querySelectorAll('.productdiv').forEach(function(div) {
    const modal = div.querySelector('.productmodal');

    div.addEventListener('click', function(e) {
        const isOpen = modal.classList.contains('show');
        closeAllModals();
        if (!isOpen) {
            modal.classList.add('show');
            div.style.zIndex = "900";
        }
    });

    modal.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});

document.querySelectorAll('.productbtn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        const baseId     = btn.id.replace('btn', '');
        const targetDiv  = document.getElementById(baseId + 'div');
        const targetModal= document.getElementById(baseId + 'modal');

        if (targetDiv && targetModal) {
            const elementPosition = targetDiv.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition  = elementPosition - 70;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });

            closeAllModals();
            targetModal.classList.add("show");
            targetDiv.style.zIndex = "900";
        }
    });
});

document.addEventListener('click', function(e) {
    if (e.target.closest('#cart')) return;
    if (e.target.closest('#signinmodalcontainer')) return;
    if (!e.target.closest('.productdiv') && !e.target.closest('.productbtn')) {
        closeAllModals();
    }
});

}

{
    const meb = document.getElementById("meb");
    const me  = document.getElementById("menudiv");

    const gcb = document.getElementById("gcb");
    const gd  = document.getElementById("giftdiv");

    
    meb.classList.add("active");

    meb.onclick = function() {
        me.classList.remove("hide");
        gd.classList.remove("show");

        meb.classList.add("active");
        gcb.classList.remove("active");
    };

    gcb.onclick = function() {
        me.classList.add("hide");
        gd.classList.add("show");

        meb.classList.remove("active");
        gcb.classList.add("active");
    };
}

{
    
    
    const GIFT_CARDS = [
        {
            id:          "gc-coffee",
            name:        "Coffee Gift Card",
            image:       "images/coffee_img_pink.png",
            price:       500,
            description: "A perfect gift for any coffee lover. Redeemable on any drink from our menu. Valid for 12 months from purchase.",
            tag:         "Best Seller",
        },
        {
            id:          "gc-meal",
            name:        "Meal Combo Gift Card",
            image:       "images/coffee_img_red1.png",
            price:       750,
            description: "Treat someone to a full meal experience — any drink plus a food item of their choice. Great for breakfast or lunch.",
            tag:         "Popular",
        },
        {
            id:          "gc-family",
            name:        "Family Treat Gift Card",
            image:       "images/coffee_img_red2.png",
            price:       1500,
            description: "Share the JavaSip experience with the whole family. Covers drinks and bites for up to four people. Ideal for gatherings.",
            tag:         "Great Value",
        },
        {
            id:          "gc-premium",
            name:        "Premium Treat Gift Card",
            image:       "images/coffee_img_yellow.png",
            price:       2500,
            description: "An indulgent gift card for the connoisseur. Covers specialty drinks, artisan bakes, and seasonal exclusives without compromise.",
            tag:         "Premium",
        },
    ];

    
    
    GIFT_CARDS.forEach(function(gc) {
        window.PRODUCTS[gc.id] = {
            name:        gc.name,
            image:       gc.image,
            price:       gc.price,
            description: gc.description,
            tags:        [gc.tag, "Gift Card"],
            sizes:       ["Standard"],
        };
    });

    const grid = document.getElementById("gift-cards-grid");

    
    GIFT_CARDS.forEach(function(gc) {
        const card = document.createElement("div");
        card.className = "gc-card";

        
        const img = document.createElement("img");
        img.src       = gc.image;
        img.alt       = gc.name;
        img.className = "gc-card-img";
        card.appendChild(img);

        
        const tagEl = document.createElement("span");
        tagEl.className   = "gc-card-tag";
        tagEl.textContent = gc.tag;
        card.appendChild(tagEl);

        
        const nameEl = document.createElement("p");
        nameEl.className   = "gc-card-name";
        nameEl.textContent = gc.name;
        card.appendChild(nameEl);

        
        const descEl = document.createElement("p");
        descEl.className   = "gc-card-desc";
        descEl.textContent = gc.description;
        card.appendChild(descEl);

        
        const priceEl = document.createElement("p");
        priceEl.className     = "price gc-card-price";
        priceEl.dataset.price = gc.price;
        priceEl.textContent   = "₹" + gc.price;
        card.appendChild(priceEl);

        
        const atcBtn = document.createElement("button");
        atcBtn.className   = "gc-card-atc";
        atcBtn.textContent = "ADD TO CART";

        atcBtn.addEventListener("click", function() {
            atcBtn.classList.add("added");
            atcBtn.textContent = "ADDED ✓";
            
            window.addToCart(gc.id, 1, "Standard");

            
            setTimeout(function() {
                atcBtn.classList.remove("added");
                atcBtn.textContent = "ADD TO CART";
            }, 2000);
        });

        card.appendChild(atcBtn);
        grid.appendChild(card);
    });
}

{
    
    const cf            = document.getElementById("cartfooter");
    const cartPanel     = document.getElementById("cart");
    const cartItemsEl   = document.getElementById("cart-items");
    const cartCloseBtn  = document.getElementById("cartcl");
    const cfCount       = document.getElementById("cartfooter-count");
    const cfTotal       = document.getElementById("cartfooter-total");
    const cartTotalDisp = document.getElementById("cart-total-display");
    const cartIcon      = document.getElementById("carticon");
    const cartBadge     = document.getElementById("cart-header-count");

    
    let cartItems = [];

    

    function getCurrencyInfo() {
        const locText = document.getElementById("locationbtn").textContent || "";
        const isUSD   = locText.includes("USA");
        const exrate  = 91.94;
        return {
            symbol:  isUSD ? "$" : "₹",
            convert: isUSD ? function(v) { return (v / exrate).toFixed(2); }
                           : function(v) { return v; }
        };
    }

    function formatPrice(basePrice) {
        const { symbol, convert } = getCurrencyInfo();
        return symbol + convert(basePrice);
    }

    
    function calcTotal() {
        return cartItems.reduce(function(sum, item) {
            return sum + item.price * item.qty;
        }, 0);
    }

    function calcCount() {
        return cartItems.reduce(function(sum, item) {
            return sum + item.qty;
        }, 0);
    }

    

    function renderCartFooter() {
        const total = calcTotal();
        const count = calcCount();

        cfCount.textContent         = count + (count === 1 ? " item" : " items");
        cfTotal.dataset.price       = total;
        cfTotal.textContent         = formatPrice(total);
        cartTotalDisp.dataset.price = total;
        cartTotalDisp.textContent   = formatPrice(total);

        if (count > 0) {
            cf.classList.add("show");
            cartBadge.textContent = count;
            cartBadge.classList.add("visible");
        } else {
            cf.classList.remove("show");
            cartBadge.classList.remove("visible");
        }
    }

    

    function renderCartItems() {
        cartItemsEl.innerHTML = "";

        if (cartItems.length === 0) {
            const empty = document.createElement("p");
            empty.className   = "cart-empty-msg";
            empty.textContent = "Your order is empty. Add something from the menu!";
            cartItemsEl.appendChild(empty);
            return;
        }

        cartItems.forEach(function(item, index) {
            const row = document.createElement("div");
            row.className = "cart-item";

            
            const img   = document.createElement("img");
            img.src     = item.image;
            img.alt     = item.name;
            img.className = "cart-item-img";
            row.appendChild(img);

            
            const info = document.createElement("div");
            info.className = "cart-item-info";

            const nameEl = document.createElement("p");
            nameEl.className   = "cart-item-name";
            nameEl.textContent = item.name;
            info.appendChild(nameEl);

            if (item.size && item.size !== "Regular" && item.size !== "Standard") {
                const sizeEl = document.createElement("p");
                sizeEl.className   = "cart-item-size";
                sizeEl.textContent = item.size;
                info.appendChild(sizeEl);
            }

            const priceEl = document.createElement("p");
            priceEl.className      = "price cart-item-price";
            priceEl.dataset.price  = item.price;
            priceEl.textContent    = formatPrice(item.price);
            info.appendChild(priceEl);

            row.appendChild(info);

            
            const controls = document.createElement("div");
            controls.className = "cart-item-controls";

            const qtyRow = document.createElement("div");
            qtyRow.className = "cart-qty-row";

            const minusBtn = document.createElement("button");
            minusBtn.className   = "cart-qty-btn";
            minusBtn.textContent = "−";
            minusBtn.setAttribute("aria-label", "decrease quantity");

            const qtySpan = document.createElement("span");
            qtySpan.className   = "cart-qty-display";
            qtySpan.textContent = item.qty;

            const plusBtn = document.createElement("button");
            plusBtn.className   = "cart-qty-btn";
            plusBtn.textContent = "+";
            plusBtn.setAttribute("aria-label", "increase quantity");

            
            minusBtn.addEventListener("click", function(e) {
                e.stopPropagation();
                if (cartItems[index].qty > 1) {
                    cartItems[index].qty--;
                    renderCart();
                }
            });
            plusBtn.addEventListener("click", function(e) {
                e.stopPropagation();
                cartItems[index].qty++;
                renderCart();
            });

            qtyRow.appendChild(minusBtn);
            qtyRow.appendChild(qtySpan);
            qtyRow.appendChild(plusBtn);
            controls.appendChild(qtyRow);

            
            const removeBtn = document.createElement("button");
            removeBtn.className = "cart-remove-btn";
            removeBtn.setAttribute("aria-label", "remove item");
            removeBtn.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">' +
                '<path d="M224 64l0-16c0-17.7 14.3-32 32-32l128 0c17.7 0 32 14.3 32 32l0 16 ' +
                '144 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L480 128 480 448c0 35.3-28.7 64-64 ' +
                '64L224 512c-35.3 0-64-28.7-64-64L160 128 96 128c-17.7 0-32-14.3-32-32s14.3-32 ' +
                '32-32l128 0zm72 128c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 ' +
                '16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 ' +
                '16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/></svg>';

            removeBtn.addEventListener("click", function(e) {
                e.stopPropagation();
                cartItems.splice(index, 1);
                renderCart();
            });

            controls.appendChild(removeBtn);
            row.appendChild(controls);

            cartItemsEl.appendChild(row);
        });
    }

    
    function renderCart() {
        renderCartItems();
        renderCartFooter();
    }

    
    window.addToCart = function(productId, qty, size) {
        const product = window.PRODUCTS[productId];
        if (!product) return;

        
        // Calculate size multiplier
        let sizeMultiplier = 1;
        if (product.sizes.length > 1) {
            if (size === product.sizes[0]) {
                sizeMultiplier = 1;        // Tall
            } else if (size === product.sizes[1]) {
                sizeMultiplier = 1.5;      // Grande
            } else if (size === product.sizes[2]) {
                sizeMultiplier = 2;        // Venti
            }
        }
        
        const finalPrice = product.price * sizeMultiplier;

        const existing = cartItems.find(function(item) {
            return item.id === productId && item.size === size;
        });

        if (existing) {
            existing.qty += qty;
        } else {
            
            cartItems.unshift({
                id:        productId,
                name:      product.name,
                image:     product.image,
                basePrice: product.price,
                price:     finalPrice,
                size:      size,
                qty:       qty
            });
        }

        renderCart();
    };

    

    cf.addEventListener("click", function(e) {
        e.stopPropagation();
        cartPanel.classList.add("show");
        document.body.classList.add("noscroll");
    });

    cartIcon.addEventListener("click", function(e) {
        e.stopPropagation();
        cartPanel.classList.add("show");
        document.body.classList.add("noscroll");
    });

    cartCloseBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        cartPanel.classList.remove("show");
        document.body.classList.remove("noscroll");
    });

    document.addEventListener("click", function(e) {
    if (
        cartPanel.classList.contains("show") &&
        !cartPanel.contains(e.target) &&
        !cf.contains(e.target) &&
        !e.target.closest('.productdiv') &&
        !e.target.closest('.productmodal')
    ) {
        cartPanel.classList.remove("show");
        document.body.classList.remove("noscroll");
    }
});

    
    document.getElementById("india").addEventListener("click", renderCartFooter);
    document.getElementById("usa").addEventListener("click",   renderCartFooter);

    
    document.getElementById("cart-order-btn").addEventListener("click", function() {
        if (cartItems.length === 0) return;

        sessionStorage.setItem("js_cart_items",    JSON.stringify(cartItems));
        const locText = document.getElementById("locationbtn").textContent || "";
        sessionStorage.setItem("js_cart_currency", locText.includes("USA") ? "usd" : "inr");

        window.location.href = "cart.html";
    });
}
