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

  // Close custom selects when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".custom-select")) {
      document
        .querySelectorAll(".custom-select")
        .forEach((el) => el.classList.remove("active"));
    }
  });
});

// === Custom Select Logic ===
function toggleSelect(id) {
  const el = document.getElementById(id);
  const isActive = el.classList.contains("active");
  document
    .querySelectorAll(".custom-select")
    .forEach((s) => s.classList.remove("active"));
  if (!isActive) el.classList.add("active");
}

function selectOption(wrapperId, value, label) {
  const wrapper = document.getElementById(wrapperId);
  wrapper.querySelector('input[type="hidden"]').value = value;
  wrapper.querySelector(".select-label").textContent = label;
  wrapper.classList.remove("active");
}

let confirmPromiseResolve = null;

function customConfirm(message) {
  document.getElementById("customConfirmMessage").textContent = message;
  document.getElementById("customConfirmModal").classList.add("active");
  return new Promise((resolve) => {
    confirmPromiseResolve = resolve;
  });
}

function closeCustomConfirm(result) {
  document.getElementById("customConfirmModal").classList.remove("active");
  if (confirmPromiseResolve) {
    confirmPromiseResolve(result);
    confirmPromiseResolve = null;
  }
}

async function resetDatabase() {
  const confirmed = await customConfirm(
    "Are you sure you want to reset all data back to the default seed state? This action cannot be undone.",
  );
  if (!confirmed) return;
  const res = await apiPost("/reset", {});
  if (res.success) {
    showToast("Database reset successfully!", "success");
    fetchStats();
    fetchBooks();
    fetchMembers();
    fetchTransactions();
  } else {
    showToast(
      res.message
        ? formatErrorMessage(res.message)
        : "Failed to reset database",
      "error",
    );
  }
}

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
      _membersList = res.data.items || res.data;
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
                <button class="btn btn-icon-small" onclick="editMember('${m.id}')" title="Edit"><i data-lucide="edit"></i></button>
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
      renderBooks(res.data.items || res.data);
    }
  } catch (e) {
    console.error(e);
  }
}

function renderBooks(books) {
  const containerAvailable = document.getElementById("cardsAvailable");
  const containerBorrowed = document.getElementById("cardsBorrowed");
  const containerReserved = document.getElementById("cardsReserved");

  containerAvailable.innerHTML = "";
  containerBorrowed.innerHTML = "";
  containerReserved.innerHTML = "";

  let countAvailable = 0,
    countBorrowed = 0,
    countReserved = 0;

  if (books.length === 0) {
    containerAvailable.innerHTML =
      '<div class="empty-state">No books found.</div>';
    document.getElementById("countAvailable").textContent = "0";
    document.getElementById("countBorrowed").textContent = "0";
    document.getElementById("countReserved").textContent = "0";
    return;
  }

  books.forEach((b) => {
    const card = document.createElement("div");
    card.className = "book-card";

    let statusClass = "bg-maintenance";
    if (b.status === "AVAILABLE") {
      statusClass = "bg-available";
      countAvailable++;
    } else if (b.status === "BORROWED") {
      statusClass = "bg-borrowed";
      countBorrowed++;
    } else if (b.status === "RESERVED") {
      statusClass = "bg-reserved";
      countReserved++;
    }

    let datesHtml = "";
    const queueNames =
      b.reservedBy.length > 0
        ? b.reservedBy
            .map((pid) => {
              const usr = _membersList.find((m) => m.id === pid);
              return usr ? usr.firstName : pid;
            })
            .join(", ")
        : "";

    if (b.status === "BORROWED") {
      const due = new Date(b.dueDate).toLocaleDateString();
      const isOverdue = new Date() > new Date(b.dueDate);
      const borrower = b.currentBorrowerId
        ? _membersList.find((m) => m.id === b.currentBorrowerId)?.firstName
        : "";

      datesHtml = `<div class="book-dates ${isOverdue ? "due-alert" : ""}">
                <span>With: <strong>${borrower}</strong></span>
                <span>Due: ${due} ${isOverdue ? "(OVERDUE)" : ""}</span>
                ${queueNames ? `<span class="text-muted" style="font-size:0.75rem; margin-top:4px;">Queue: ${queueNames}</span>` : ""}
            </div>`;
    } else if (b.status === "RESERVED") {
      const pickupBy = b.currentBorrowerId
        ? _membersList.find((m) => m.id === b.currentBorrowerId)?.firstName
        : "";

      datesHtml = `<div class="book-dates">
                <span style="color:var(--info)">Ready for pickup by: <strong>${pickupBy}</strong></span>
                ${queueNames ? `<span class="text-muted" style="font-size:0.75rem; margin-top:4px;">Next in queue: ${queueNames}</span>` : ""}
            </div>`;
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
                <div style="padding-right: 24px;">
                    <div class="book-title">${b.title}</div>
                    <div class="book-author">by ${b.author}</div>
                </div>
                <div style="display: flex; gap: 8px; align-items: flex-start;">
                    <button class="btn btn-icon-small text-danger" style="margin-top:-4px; margin-right:-4px" onclick="deleteBook('${b.id}')" title="Delete Book">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
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
        `;

    if (b.status === "AVAILABLE") containerAvailable.appendChild(card);
    else if (b.status === "BORROWED") containerBorrowed.appendChild(card);
    else if (b.status === "RESERVED") containerReserved.appendChild(card);
    else containerAvailable.appendChild(card);
  });

  document.getElementById("countAvailable").textContent =
    countAvailable.toString();
  document.getElementById("countBorrowed").textContent =
    countBorrowed.toString();
  document.getElementById("countReserved").textContent =
    countReserved.toString();

  lucide.createIcons();
}

async function fetchTransactions() {
  try {
    const res = await apiGet("/transactions?limit=20");
    if (res.success) {
      renderTransactions(res.data.items || res.data);
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

  // Reset custom category dropdown
  selectOption("custom-bookCategory", "FICTION", "Fiction");

  openModal("bookModal");
}

async function submitBookForm() {
  const payload = {
    isbn: document.getElementById("bookIsbn").value,
    title: document.getElementById("bookTitle").value,
    author: document.getElementById("bookAuthor").value,
    publishedYear: parseInt(document.getElementById("bookYear").value, 10) || 0,
    publisher: document.getElementById("bookPublisher").value,
    category: document.getElementById("bookCategory").value,
    description: document.getElementById("bookDescription").value,
    status: "AVAILABLE",
    isAvailableForLoan: true,
  };

  document.querySelector('#bookForm button[type="submit"]').disabled = true;
  const res = await apiPost("/books", payload);
  document.querySelector('#bookForm button[type="submit"]').disabled = false;

  if (res.success) {
    closeModal("bookModal");
    showToast("Book added successfully!", "success");
    fetchBooks();
    fetchStats();
  } else {
    showToast(formatErrorMessage(res.message), "error");
  }
}

async function deleteBook(id) {
  const confirmed = await customConfirm(
    "Are you sure you want to delete this book?",
  );
  if (!confirmed) return;
  const res = await apiDelete(`/books/${id}`);
  if (res.success) {
    showToast("Book deleted", "success");
    fetchBooks();
    fetchStats();
  } else {
    showToast(formatErrorMessage(res.message), "error");
  }
}

// MEMBERS
function openMemberModal() {
  document.getElementById("memberForm").reset();
  document.getElementById("memberId").value = "";
  document.getElementById("memberModalTitle").textContent = "Add New Member";
  openModal("memberModal");
}

function editMember(id) {
  const m = _membersList.find((member) => member.id === id);
  if (!m) return;
  document.getElementById("memberForm").reset();
  document.getElementById("memberId").value = m.id;
  document.getElementById("memberModalTitle").textContent = "Edit Member";

  document.getElementById("memberFirstName").value = m.firstName;
  document.getElementById("memberLastName").value = m.lastName;
  document.getElementById("memberEmail").value = m.email;
  document.getElementById("memberPhone").value = m.phone;
  document.getElementById("memberAddress").value = m.address;

  openModal("memberModal");
}

async function submitMemberForm() {
  const id = document.getElementById("memberId").value;
  const payload = {
    firstName: document.getElementById("memberFirstName").value,
    lastName: document.getElementById("memberLastName").value,
    email: document.getElementById("memberEmail").value,
    phone: document.getElementById("memberPhone").value,
    address: document.getElementById("memberAddress").value,
    status: "ACTIVE",
    maxBooksAllowed: 5,
  };

  document.querySelector('#memberForm button[type="submit"]').disabled = true;

  let res;
  if (id) {
    res = await apiPut(`/members/${id}`, payload);
  } else {
    res = await apiPost("/members", payload);
  }

  document.querySelector('#memberForm button[type="submit"]').disabled = false;

  if (res.success) {
    closeModal("memberModal");
    showToast(`Member ${id ? "updated" : "added"} successfully!`, "success");
    fetchMembers();
    fetchStats();
  } else {
    showToast(formatErrorMessage(res.message), "error");
  }
}

async function deleteMember(id) {
  const confirmed = await customConfirm(
    "Are you sure you want to delete this member?",
  );
  if (!confirmed) return;
  const res = await apiDelete(`/members/${id}`);
  if (res.success) {
    showToast("Member deleted", "success");
    fetchMembers();
    fetchStats();
  } else {
    showToast(formatErrorMessage(res.message), "error");
  }
}

// ACTIONS (Borrow/Return/Reserve)
function updateActionMemberSelect() {
  const optionsContainer = document.getElementById("actionMemberOptions");
  optionsContainer.innerHTML = "";

  _membersList
    .filter((m) => m.status === "ACTIVE")
    .forEach((m) => {
      const label = `${m.firstName} ${m.lastName} (${m.memberCode})`;
      optionsContainer.innerHTML += `<div class="select-option" onclick="selectOption('custom-actionMemberSelect', '${m.id}', '${label}')">${label}</div>`;
    });
}

function openActionModal(bookId, actionType) {
  document.getElementById("actionBookId").value = bookId;
  document.getElementById("actionType").value = actionType;

  // Reset custom member dropdown
  selectOption("custom-actionMemberSelect", "", "-- Choose Member --");

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

  if (!memberId) {
    showToast("Please select a member.", "warning");
    return;
  }

  // Disable btn
  document.getElementById("actionConfirmBtn").disabled = true;

  const res = await apiPost(`/books/${bookId}/${actionType}`, { memberId });
  document.getElementById("actionConfirmBtn").disabled = false;

  if (res.success) {
    closeModal("actionModal");
    showToast(
      `Successfully ${actionType === "borrow" ? "borrowed" : "reserved"} book!`,
      "success",
    );
    refreshAll();
  } else {
    showToast(formatErrorMessage(res.message), "error");
    closeModal("actionModal");
  }
}

async function returnBook(bookId) {
  const confirmed = await customConfirm("Return this book?");
  if (!confirmed) return;
  const res = await apiPost(`/books/${bookId}/return`);
  if (res.success) {
    if (res.data?.fine > 0) {
      showToast(
        `Book returned! Late fine applied: ${res.data.fine} THB (${res.data.overdueDays} days overdue)`,
        "warning",
      );
    } else {
      showToast("Book returned successfully!", "success");
    }
    refreshAll();
  } else {
    showToast(formatErrorMessage(res.message), "error");
  }
}

function refreshAll() {
  fetchStats();
  fetchBooks();
  fetchMembers();
  fetchTransactions();
}

// === Utility: Toasts & Error Formatting ===
function formatErrorMessage(msg) {
  if (Array.isArray(msg)) {
    return msg.join("<br>");
  }
  return msg || "An unknown error occurred";
}

function showToast(message, type = "info") {
  let container = document.getElementById("toastWrapper");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastWrapper";
    container.className = "toast-wrapper";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let icon = "info";
  if (type === "success") icon = "check-circle";
  if (type === "error") icon = "alert-circle";
  if (type === "warning") icon = "alert-triangle";

  toast.innerHTML = `
      <i data-lucide="${icon}"></i>
      <div class="toast-message">${message}</div>
      <button class="btn-close" onclick="this.parentElement.remove()"><i data-lucide="x"></i></button>
  `;

  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 300);
    }
  }, 5000);
}

document.addEventListener("DOMContentLoaded", () => {
  // === Floating Terminal Init ===
  const apiTerminal = document.getElementById("apiTerminal");
  const apiTerminalHeader = document.getElementById("apiTerminalHeader");
  if (apiTerminal && apiTerminalHeader) {
    makeDraggable(apiTerminal, apiTerminalHeader);
  }
});

// === Floating Terminal Draggable Logic ===
function makeDraggable(element, handle) {
  let isDragging = false;
  let startX = 0;
  let startLeft = 0;
  let hasMoved = false;

  const target = handle || element;

  target.addEventListener("pointerdown", (e) => {
    // Ignore clicks on buttons inside the header
    if (e.target.closest("button")) return;

    isDragging = true;
    hasMoved = false;
    startX = e.clientX;

    // Convert CSS calc() bounds directly to inline pixel absolute to ensure clean drag math
    const rect = element.getBoundingClientRect();
    startLeft = rect.left;
    element.style.left = `${startLeft}px`;
    element.style.right = "auto";

    target.setPointerCapture(e.pointerId);
    element.classList.add("dragging");
  });

  target.addEventListener("pointermove", (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;

    // Threshold to distinguish click from drag
    if (Math.abs(deltaX) > 3) {
      hasMoved = true;
    }

    if (hasMoved) {
      // Apply new left position. Ensure it doesn't go off-screen easily.
      let newLeft = startLeft + deltaX;

      // Optional: keep within viewport bounds
      const maxLeft = window.innerWidth - element.offsetWidth;
      newLeft = Math.max(0, Math.min(newLeft, maxLeft));

      element.style.left = `${newLeft}px`;
      element.style.right = "auto"; // Override CSS right calc if any
    }
  });

  target.addEventListener("pointerup", (e) => {
    if (!isDragging) return;
    isDragging = false;
    target.releasePointerCapture(e.pointerId);
    element.classList.remove("dragging");

    // If we didn't move past the threshold, treat it as a click
    if (!hasMoved) {
      element.classList.toggle("minimized");
      element.classList.remove("fullscreen");
      // Snap it back to its original layout if click triggered
      if (!element.style.left || element.style.left.includes("px")) {
        // keep the position since we didn't actually drag
      }
    }
  });
}
