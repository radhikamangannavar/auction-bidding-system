const baseUrl = "http://localhost:8080";

let currentUserId = localStorage.getItem("userId");


// 🔹 REGISTER
function register() {
    fetch(baseUrl + "/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: document.getElementById("name").value,
            email: document.getElementById("regEmail").value,
            password: document.getElementById("regPass").value
        })
    })
    .then(res => res.json())
    .then(data => {
        alert("Registered! ID: " + data.id);
    });
}


// 🔹 LOGIN
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(`${baseUrl}/users/login?email=${email}&password=${password}`, {
        method: "POST"
    })
    .then(res => res.json())
    .then(data => {
        if (data && data.id) {
            localStorage.setItem("userId", data.id);
            currentUserId = data.id; // 🔥 FIX
            window.location.href = "dashboard.html";
        } else {
            alert("Invalid login");
        }
    });
}


// 🔹 LOAD AUCTIONS (FINAL CLEAN VERSION)
function loadAuctions() {
    fetch(baseUrl + "/auctions") // 🔥 FIXED
    .then(res => res.json())
    .then(data => {
        const grid = document.getElementById("auctionGrid");
        grid.innerHTML = "";

        data.forEach(a => {
            const card = document.createElement("div");
            card.className = "bg-white rounded-xl shadow-md p-4";

            card.innerHTML = `
                <h2 class="text-xl font-bold mb-2">${a.itemName}</h2>

                <p class="text-gray-600">Current Price:</p>
                <p class="text-2xl font-bold text-blue-600 mb-2">${"\u20B9"}${a.currentPrice}</p>

                <p class="text-sm mb-2">
                    Status:
                    <span class="${a.status === 'OPEN' ? 'text-green-600' : 'text-red-600'} font-semibold">
                        ${a.status}
                    </span>
                </p>

                <p class="text-sm text-gray-500 mb-2">
                    Ends in: <span id="time-${a.id}">Loading...</span>
                </p>

                <input id="bid-${a.id}"
                       class="w-full border p-2 rounded mb-2"
                       placeholder="Enter bid amount"
                       ${a.status === 'CLOSED' ? 'disabled' : ''}>

                <button onclick="placeBid(${a.id})"
                    class="w-full p-2 rounded mb-2 ${
                        a.status === 'OPEN'
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-400 text-white cursor-not-allowed'
                    }"
                    ${a.status === 'CLOSED' ? 'disabled' : ''}>
                    Place Bid
                </button>

                <button onclick="viewBids(${a.id})"
                        class="w-full bg-gray-200 p-2 rounded hover:bg-gray-300">
                    View Bids
                </button>
            `;

            grid.appendChild(card);

            // 🔥 countdown
            startCountdown(a.id, a.endTime);
        });
    });
}


// 🔹 PLACE BID
function placeBid(auctionId) {
    const amount = document.getElementById(`bid-${auctionId}`).value;

    if (!amount) {
        alert("Enter bid amount");
        return;
    }

    fetch(`${baseUrl}/bids/place?userId=${currentUserId}&auctionId=${auctionId}&amount=${amount}`, {
        method: "POST"
    })
    .then(res => res.text())
    .then(data => {
        alert(data);
        loadAuctions();
    });
}


// 🔹 COUNTDOWN
function startCountdown(id, endTime) {
    function update() {
        const now = new Date();
const end = new Date(endTime);
if (isNaN(end.getTime())) {
    console.error("Invalid endTime:", endTime);
    return;
}
        const diff = end - now;

        const el = document.getElementById(`time-${id}`);
        if (!el) return;

        if (diff <= 0) {
            el.innerText = "Ended";

            // 🔥 update status visually
            const statusEl = el.closest("div").querySelector("span");
            if (statusEl) {
                statusEl.innerText = "CLOSED";
                statusEl.className = "text-red-600 font-semibold";
            }

            return;
        }

        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);

        el.innerText = `${mins}m ${secs}s`;
    }

    update();
    setInterval(update, 1000);
}


// 🔹 VIEW BID HISTORY (MODAL)
function viewBids(auctionId) {
    fetch(`${baseUrl}/bids/${auctionId}`) // 🔥 FIXED
    .then(res => res.json())
    .then(data => {
        const list = document.getElementById("bidList");
        list.innerHTML = "";

        data.forEach(b => {
            const li = document.createElement("li");
            li.innerText = `${b.user.name} -> \u20B9${b.amount}`;
            list.appendChild(li);
        });

        document.getElementById("bidModal").classList.remove("hidden");
    });
}

function closeModal() {
    document.getElementById("bidModal").classList.add("hidden");
}


// 🔹 CREATE AUCTION
function createAuction() {
    const itemName = document.getElementById("itemName").value;
    const price = parseFloat(document.getElementById("price").value);

    if (!itemName || isNaN(price)) {
        alert("Enter valid details");
        return;
    }

    // 🔥 AUTO 5-MINUTE AUCTION
    const endDate = new Date();
    endDate.setMinutes(endDate.getMinutes() + 5);

const formattedEndTime =
    endDate.getFullYear() + "-" +
    String(endDate.getMonth() + 1).padStart(2, '0') + "-" +
    String(endDate.getDate()).padStart(2, '0') + "T" +
    String(endDate.getHours()).padStart(2, '0') + ":" +
    String(endDate.getMinutes()).padStart(2, '0') + ":" +
    String(endDate.getSeconds()).padStart(2, '0');
    fetch(baseUrl + "/auctions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            itemName: itemName,
            startingPrice: price,
            endTime: formattedEndTime
        })
    })
    .then(res => res.json())
    .then(() => {
        alert("Auction created!");
        window.location.href = "dashboard.html";
    })
    .catch(err => {
        console.error(err);
        alert("Error creating auction");
    });
}