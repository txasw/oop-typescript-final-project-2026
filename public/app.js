const API_BASE = window.location.origin;

// === API Interceptor for Terminal ===
const originalFetch = window.fetch;
window.fetch = async function (...args) {
  const url = typeof args[0] === "string" ? args[0] : args[0].url;
  const method = args[1]?.method || "GET";
  const timestamp = new Date().toLocaleTimeString([], {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Only log our API calls
  if (
    url.startsWith("/books") ||
    url.startsWith("/members") ||
    url.startsWith("/transactions") ||
    url.startsWith("/health")
  ) {
    try {
      const response = await originalFetch.apply(this, args);
      // Clone response to read status without consuming body
      logRequest(timestamp, method, url, response.status);
      return response;
    } catch (error) {
      logRequest(timestamp, method, url, "ERR");
      throw error;
    }
  }
  return originalFetch.apply(this, args);
};

function logRequest(time, method, url, status) {
  const logContainer = document.getElementById("apiLogContent");
  const entry = document.createElement("div");
  entry.className = "log-entry";
  let statusClass = `status-${status}`;
  if (status >= 200 && status < 300) statusClass = "status-200";
  if (status >= 400 && status < 500) statusClass = "status-400";
  if (status >= 500) statusClass = "status-500";

  entry.innerHTML = `
        <span class="log-time">[${time}]</span>
        <span class="log-method method-${method}">${method}</span>
        <span class="log-status ${statusClass}">${status}</span>
        <span class="log-url">${url}</span>
    `;
  logContainer.appendChild(entry);
  logContainer.scrollTop = logContainer.scrollHeight;
}

// === Initialize App ===
document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // Initial fetches
  fetchStats();
  fetchBooks();
  fetchMembers();
  fetchTransactions();

  // Set polling for stats every 10 seconds
  setInterval(fetchStats, 10000);
});

// === API Helpers ===
async function apiGet(endpoint) {
  const res = await fetch(endpoint);
  return res.json();
}
async function apiPost(endpoint, body) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}
async function apiPut(endpoint, body) {
  const res = await fetch(endpoint, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}
async function apiDelete(endpoint) {
  const res = await fetch(endpoint, { method: "DELETE" });
  return res.json();
}

// === Fetchers & Renderers ===
async function fetchStats() {
  try {
    const bookStats = await apiGet("/books/stats");
    const memberStats = await apiGet("/members/stats");

    if (bookStats.success) {
      document.getElementById("statTotalBooks").textContent =
        bookStats.data.totalBooks;
    }
    if (memberStats.success) {
      document.getElementById("statTotalMembers").textContent =
        memberStats.data.totalMembers;
    }
  } catch (e) {
    console.error("Failed to fetch stats");
  }
}

// Global cached members for dropdowns
let _membersList = [];

async function fetchMembers() {
  try {
    const res = await apiGet("/members");
    if (res.success) {
      _membersList = res.data;
      renderMembers(_membersList);
      updateActionMemberSelect();
    }
  } catch (e) {
    console.error(e);
  }
}

function renderMembers(members) {
  const tbody = document.getElementById("membersTableBody");
  tbody.innerHTML = "";

  if (members.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="4" class="text-center text-muted py-4">No members found</td></tr>';
    return;
  }

  members.forEach((m) => {
    const tr = document.createElement("tr");

    let statusBadge = "";
    if (m.status === "ACTIVE")
      statusBadge = '<span class="status-badge bg-available">ACTIVE</span>';
    else if (m.status === "INACTIVE")
      statusBadge = '<span class="status-badge bg-maintenance">INACTIVE</span>';
    else
      statusBadge = '<span class="status-badge bg-borrowed">SUSPENDED</span>';

    tr.innerHTML = `
            <td><code>${m.memberCode}</code></td>
            <td>
                <div style="font-weight:500">${m.firstName} ${m.lastName}</div>
                <div class="text-muted" style="font-size:0.75rem">${m.email}</div>
            </td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-icon-small" onclick="deleteMember('${m.id}')" title="Delete"><i data-lucide="trash-2"></i></button>
            </td>
        `;
    tbody.appendChild(tr);
  });
  lucide.createIcons();
}

async function fetchBooks() {
  const search = document.getElementById("bookSearch").value;
  const url = search ? `/books?search=${encodeURIComponent(search)}` : "/books";

  try {
    const res = await apiGet(url);
    if (res.success) {
      renderBooks(res.data);
    }
  } catch (e) {
    console.error(e);
  }
}

function renderBooks(books) {
  const container = document.getElementById("booksContainer");
  container.innerHTML = "";

  if (books.length === 0) {
    container.innerHTML = '<div class="empty-state">No books found.</div>';
    return;
  }

  const grid = document.createElement("div");
  grid.className = "books-grid";

  books.forEach((b) => {
    const card = document.createElement("div");
    card.className = "book-card";

    let statusClass = "bg-maintenance";
    if (b.status === "AVAILABLE") statusClass = "bg-available";
    else if (b.status === "BORROWED") statusClass = "bg-borrowed";
    else if (b.status === "RESERVED") statusClass = "bg-reserved";

    let datesHtml = "";
    if (b.status === "BORROWED") {
      const due = new Date(b.dueDate).toLocaleDateString();
      const isOverdue = new Date() > new Date(b.dueDate);
      datesHtml = `<div class="book-dates ${isOverdue ? "due-alert" : ""}">
                <span>Due: ${due} ${isOverdue ? "(OVERDUE)" : ""}</span>
            </div>`;
    } else if (b.status === "RESERVED") {
      datesHtml = `<div class="book-dates"><span>Reserved: ${b.reservedBy.length} in queue</span></div>`;
    }

    let buttonsHtml = "";
    if (b.status === "AVAILABLE") {
      buttonsHtml = `<button class="btn btn-primary" onclick="openActionModal('${b.id}', 'borrow')">Borrow</button>`;
    } else if (b.status === "BORROWED") {
      buttonsHtml = `
                <button class="btn btn-secondary" style="font-size:0.7rem; padding: 4px 8px" onclick="openActionModal('${b.id}', 'reserve')">Reserve</button>
                <button class="btn btn-primary" onclick="returnBook('${b.id}')">Return</button>
            `;
    } else if (b.status === "RESERVED") {
      buttonsHtml = `
                <button class="btn btn-secondary" style="font-size:0.7rem; padding: 4px 8px" onclick="openActionModal('${b.id}', 'reserve')">Reserve</button>
                <button class="btn btn-primary" onclick="openActionModal('${b.id}', 'borrow')">Borrow</button>
            `;
    }

    card.innerHTML = `
            <div class="book-header">
                <div>
                    <div class="book-title">${b.title}</div>
                    <div class="book-author">by ${b.author}</div>
                </div>
                <span class="status-badge ${statusClass}">${b.status}</span>
            </div>
            <div class="book-meta">
                <span class="book-isbn">${b.isbn}</span>
                <span>•</span>
                <span>${b.publishedYear}</span>
            </div>
            <div class="book-details">${b.description}</div>
            <div class="book-footer">
                ${datesHtml}
                <div style="display:flex; gap:8px;">${buttonsHtml}</div>
            </div>
            <button class="btn btn-icon-small" style="position:absolute; bottom:16px; left:16px; opacity: 0.5" onclick="deleteBook('${b.id}')" title="Delete">
                <i data-lucide="trash-2"></i>
            </button>
        `;
    // Make card position relative for absolute trash pos
    card.style.position = "relative";
    grid.appendChild(card);
  });

  container.appendChild(grid);
  lucide.createIcons();
}

async function fetchTransactions() {
  try {
    const res = await apiGet("/transactions?limit=20");
    if (res.success) {
      renderTransactions(res.data);
    }
  } catch (e) {
    console.error(e);
  }
}

function renderTransactions(txs) {
  const timeline = document.getElementById("transactionsTimeline");
  timeline.innerHTML = "";

  if (txs.length === 0) {
    timeline.innerHTML =
      '<div class="empty-state">No recorded transactions.</div>';
    return;
  }

  txs.forEach((t) => {
    const item = document.createElement("div");
    item.className = "timeline-item";

    const isBorrow = t.action === "BORROW";
    const iconClass = isBorrow ? "icon-borrow" : "icon-return";
    const iconName = isBorrow ? "log-out" : "log-in";
    const date = new Date(t.createdAt).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    let fineStr = "";
    if (!isBorrow && t.fine && t.fine > 0) {
      fineStr = `<span class="fine-badge">Fine: ${t.fine} THB</span>`;
    }

    item.innerHTML = `
            <div class="timeline-icon ${iconClass}"><i data-lucide="${iconName}"></i></div>
            <div class="timeline-content">
                <div><strong>${t.memberName}</strong> ${isBorrow ? "borrowed" : "returned"} <strong>${t.bookTitle}</strong></div>
                <div class="timeline-meta">
                    <span>${date}</span>
                    ${fineStr}
                </div>
            </div>
        `;
    timeline.appendChild(item);
  });
  lucide.createIcons();
}

// === Modals & Forms ===
function openModal(id) {
  document.getElementById(id).classList.add("active");
}
function closeModal(id) {
  document.getElementById(id).classList.remove("active");
}

// BOOKS
function openBookModal() {
  document.getElementById("bookForm").reset();
  document.getElementById("bookId").value = "";
  document.getElementById("bookModalTitle").textContent = "Add New Book";
  document.getElementById("bookIsbn").value =
    "978-" + Math.floor(Math.random() * (9999999999 - 1000000000) + 1000000000);
  openModal("bookModal");
}

async function submitBookForm() {
  const payload = {
    isbn: document.getElementById("bookIsbn").value,
    title: document.getElementById("bookTitle").value,
    author: document.getElementById("bookAuthor").value,
    publishedYear: parseInt(document.getElementById("bookYear").value, 10),
    publisher: document.getElementById("bookPublisher").value,
    category: document.getElementById("bookCategory").value,
    description: document.getElementById("bookDescription").value,
    status: "AVAILABLE",
    isAvailableForLoan: true,
  };

  const res = await apiPost("/books", payload);
  if (res.success) {
    closeModal("bookModal");
    fetchBooks();
    fetchStats();
  } else {
    alert("Failed: " + JSON.stringify(res.message));
  }
}

async function deleteBook(id) {
  if (!confirm("Are you sure you want to delete this book?")) return;
  await apiDelete(`/books/${id}`);
  fetchBooks();
  fetchStats();
}

// MEMBERS
function openMemberModal() {
  document.getElementById("memberForm").reset();
  openModal("memberModal");
}

async function submitMemberForm() {
  const payload = {
    firstName: document.getElementById("memberFirstName").value,
    lastName: document.getElementById("memberLastName").value,
    email: document.getElementById("memberEmail").value,
    phone: document.getElementById("memberPhone").value,
    address: document.getElementById("memberAddress").value,
    status: "ACTIVE",
    maxBooksAllowed: 5,
  };

  const res = await apiPost("/members", payload);
  if (res.success) {
    closeModal("memberModal");
    fetchMembers();
    fetchStats();
  } else {
    alert("Failed: " + JSON.stringify(res.message));
  }
}

async function deleteMember(id) {
  if (!confirm("Are you sure you want to delete this member?")) return;
  await apiDelete(`/members/${id}`);
  fetchMembers();
  fetchStats();
}

// ACTIONS (Borrow/Return/Reserve)
function updateActionMemberSelect() {
  const select = document.getElementById("actionMemberSelect");
  select.innerHTML = '<option value="">-- Choose Member --</option>';
  _membersList
    .filter((m) => m.status === "ACTIVE")
    .forEach((m) => {
      select.innerHTML += `<option value="${m.id}">${m.firstName} ${m.lastName} (${m.memberCode})</option>`;
    });
}

function openActionModal(bookId, actionType) {
  document.getElementById("actionBookId").value = bookId;
  document.getElementById("actionType").value = actionType;
  document.getElementById("actionMemberSelect").value = "";

  const title = actionType === "borrow" ? "Borrow Book" : "Reserve Book";
  const desc =
    actionType === "borrow"
      ? "Select a member to borrow this book."
      : "Select a member to join the reservation queue.";

  document.getElementById("actionModalTitle").textContent = title;
  document.getElementById("actionDescription").textContent = desc;

  openModal("actionModal");
}

async function confirmAction() {
  const bookId = document.getElementById("actionBookId").value;
  const actionType = document.getElementById("actionType").value;
  const memberId = document.getElementById("actionMemberSelect").value;

  if (!memberId) return alert("Please select a member.");

  // Disable btn
  document.getElementById("actionConfirmBtn").disabled = true;

  const res = await apiPost(`/books/${bookId}/${actionType}`, { memberId });
  document.getElementById("actionConfirmBtn").disabled = false;

  if (res.success) {
    closeModal("actionModal");
    refreshAll();
  } else {
    alert("Action failed: " + (res.message || "Unknown error"));
    closeModal("actionModal");
  }
}

async function returnBook(bookId) {
  if (!confirm("Return this book?")) return;
  const res = await apiPost(`/books/${bookId}/return`);
  if (res.success) {
    if (res.data?.fine > 0) {
      alert(
        `Book returned! Late fine applied: ${res.data.fine} THB (${res.data.overdueDays} days overdue)`,
      );
    }
    refreshAll();
  } else {
    alert("Failed: " + (res.message || "Error"));
  }
}

function refreshAll() {
  fetchStats();
  fetchBooks();
  fetchMembers();
  fetchTransactions();
}
