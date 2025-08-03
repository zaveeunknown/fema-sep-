
// FEMA update Cloud Function
if (typeof require !== "undefined" && typeof exports !== "undefined") {
  const functions = require("firebase-functions");
  const admin = require("firebase-admin");

  admin.initializeApp();

  exports.femaUpload = functions.https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      await admin.firestore().collection("fema").doc("latest").set({
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        data: req.body,
      });

      res.status(200).send("FEMA data updated successfully");
    } catch (error) {
      console.error("Error saving FEMA data:", error);
      res.status(500).send("Server Error");
    }
  });
}

import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-functions.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

(function () {
 
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  const authModal = document.getElementById('auth-modal');
  const loginForm = document.getElementById('login-form');
  const loginEmail = document.getElementById('login-email');
  const loginPassword = document.getElementById('login-password');
  const signOutBtn = document.getElementById('sign-out-btn');
  const userInfo = document.getElementById('user-info');
  const profileDetails = document.getElementById('profile-details');

  // Lead modal elements
  const leadModal = document.getElementById('lead-modal');
  const leadForm = document.getElementById('lead-form');
  const addLeadBtn = document.getElementById('add-lead-btn');
  const cancelLeadBtn = document.getElementById('cancel-lead-btn');
  const clearLeadBtn = document.getElementById('clear-lead-btn');
  const leadFirstName = document.getElementById('lead-first-name');
  const leadLastName = document.getElementById('lead-last-name');
  const leadDOB = document.getElementById('lead-dob');
  const leadAge = document.getElementById('lead-age');
  const leadMedicare = document.getElementById('lead-medicare');
  const leadSSN = document.getElementById('lead-ssn');
  const leadPhone = document.getElementById('lead-phone');
  const leadPlan = document.getElementById('lead-plan');
  const leadSunfire = document.getElementById('lead-sunfire');
  const leadMedications = document.getElementById('lead-medications');
  const leadDoctors = document.getElementById('lead-doctors');
  const leadCallback = document.getElementById('lead-callback');
  const leadNotes = document.getElementById('lead-notes');
  const leadZip = document.getElementById('leadZip');
  // Additional lead fields
  const leadMiddleInitial = document.getElementById('lead-middle-initial');
  const leadMedicaid = document.getElementById('lead-medicaid');
  const leadState = document.getElementById('lead-state');
  const leadHospital = document.getElementById('lead-hospital');
  const leadExtraHelp = document.getElementById('lead-extra-help');
  const leadMedicaidLevel = document.getElementById('lead-medicaid-level');

  // Sold modal elements
  const soldModal = document.getElementById('sold-modal');
  const soldForm = document.getElementById('sold-form');
  const soldPlanInput = document.getElementById('sold-plan');
  const soldAncillaryInput = document.getElementById('sold-ancillary');
  const soldAncillaryDateInput = document.getElementById('sold-ancillary-date');
  const soldEffectiveDateInput = document.getElementById('sold-effective-date');
  const soldDocumentInput = document.getElementById('sold-document');
  const cancelSoldBtn = document.getElementById('cancel-sold-btn');
  const markSoldBtn = document.getElementById('mark-sold-btn');

  // Additional sales tracking fields
  const soldPremiumInput = document.getElementById('sold-premium');
  const soldCommissionInput = document.getElementById('sold-commission');
  const soldSaleDateInput = document.getElementById('sold-sale-date');

  // Lists and statistics
  const leadsTableBody = document.getElementById('leads-table-body');
  const clientsList = document.getElementById('clients-list');
  const notesList = document.getElementById('notes-list');
  const noteForm = document.getElementById('note-form');
  const noteText = document.getElementById('note-text');

  // Tasks elements
  const tasksListEl = document.getElementById('tasks-list');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskModal = document.getElementById('task-modal');
  const taskForm = document.getElementById('task-form');
  const cancelTaskBtn = document.getElementById('cancel-task-btn');
  const taskTitle = document.getElementById('task-title');
  const taskDesc = document.getElementById('task-desc');
  const taskDueDate = document.getElementById('task-due-date');
  const taskPriority = document.getElementById('task-priority');

  // Activity modal elements
  const activityModal = document.getElementById('activity-modal');
  const activityForm = document.getElementById('activity-form');
  const activityAgentName = document.getElementById('activity-agent-name');
  const activityNotes = document.getElementById('activity-notes');
  const cancelActivityBtn = document.getElementById('cancel-activity-btn');

  // Admin elements
  const adminUsersTableBody = document.getElementById('admin-users-table');
  const agentsTableBody = document.getElementById('agents-table-body');
  const addAgentBtn = document.getElementById('add-agent-btn');
  const addUserBtn = document.getElementById('add-user-btn');
  const userModal = document.getElementById('user-modal');
  const userForm = document.getElementById('user-form');
  const userEmail = document.getElementById('user-email');
  const userPassword = document.getElementById('user-password');
  const userNameEl = document.getElementById('user-name');
  const userRoleEl = document.getElementById('user-role');
  const cancelUserBtn = document.getElementById('cancel-user-btn');
  const adminTotalLeadsEl = document.getElementById('admin-total-leads');
  const adminTotalClientsEl = document.getElementById('admin-total-clients');
  const adminNotesListEl = document.getElementById('admin-notes-list');
  const exportAllLeadsBtn = document.getElementById('export-all-leads-btn');

  // Admin export buttons for clients and notes
  const exportAllClientsBtn = document.getElementById('export-all-clients-btn');
  const exportAllNotesBtn = document.getElementById('export-all-notes-btn');

  // Admin sign out button (rendered in admin section header)
  const adminSignOutBtn = document.getElementById('admin-sign-out-btn');
  // Sign out button in the admin sidebar
  const adminSidebarSignOutBtn = document.getElementById('signout-btn');

  // Analytics elements
  const analyticsTotalLeads = document.getElementById('analytics-total-leads');
  const analyticsTotalClients = document.getElementById('analytics-total-clients');

  // Chart instance for analytics (doughnut chart)
  let salesChart = null;

  const statLeadsToday = document.getElementById('stat-leads-today');
  const statFollowUps = document.getElementById('stat-follow-ups');
  const statTotalLeads = document.getElementById('stat-total-leads');

  const filterStartDate = document.getElementById('filter-start-date');
  const filterEndDate = document.getElementById('filter-end-date');
  const applyFiltersBtn = document.getElementById('apply-filters');
  const clearFiltersBtn = document.getElementById('clear-filters');
  const exportLeadsBtn = document.getElementById('export-leads-btn');
  const clientSearchInput = document.getElementById('client-search');
  const clearClientSearchBtn = document.getElementById('clear-client-search');

  // Leads search elements
  const leadSearchInput = document.getElementById('lead-search');
  const clearLeadSearchBtn = document.getElementById('clear-lead-search');

  // Firebase references
  const firebaseAuth = firebase.auth();
  const firebaseDB = firebase.firestore();

  const functions = getFunctions();
  const refreshFema = httpsCallable(functions, "refreshFemaNow");
  getAuth(); // initialize modular auth

  const refreshBtn = document.getElementById("refresh-fema-btn");

  if (refreshBtn) {
    refreshBtn.addEventListener("click", async () => {
      try {
        const result = await refreshFema();
        alert(`FEMA data refreshed! Disasters loaded: ${result.data.count}`);
        // Reload FEMA tab so data updates immediately
        loadFemaData();
      } catch (e) {
        console.error("❌ FEMA refresh failed:", e);
        alert("FEMA refresh failed. See console for details.");
      }
    });
  }

  // Show button only for admins
  firebaseAuth.onAuthStateChanged(async (user) => {
    if (user) {
      const userDoc = await firebaseDB.collection("users").doc(user.uid).get();
      if (userDoc.exists && userDoc.data().isAdmin) {
        if (refreshBtn) refreshBtn.classList.remove("hidden");
      }
    }
  });

  /* -----------------------------------------------------------------------
   *  State Variables
   *
   *  We maintain separate arrays for leads and clients so we can cleanly
   *  distinguish the two collections. When editing a record we also track
   *  both the document ID and the collection to which it belongs. This
   *  allows a single modal to be used for editing either type.
   */
  let currentUser = null;
  let editingDocId = null;
  let editingCollection = null; // 'leads' or 'clients'
  let leadsSnapshot = [];
  let clientsSnapshot = [];
  let clientSearchTerm = '';

  // Leads search term for filtering
  let leadSearchTerm = '';

  // Task management state
  let tasks = [];
  let editingTaskIndex = null;

  // Activity management state
  let activityDocId = null;

  // Carrier management state
  let carriersData = [];
  let editingCarrierIndex = null;

  /* -----------------------------------------------------------------------
   *  Admin State
   *
   *  When the admin dashboard is loaded we populate these arrays with
   *  Firestore data for all users, leads, clients and notes. These are
   *  distinct from the per‑agent arrays above. An editingUserId tracks
   *  which agent record is being edited in the admin modal.
   */
  let usersSnapshot = [];
  let editingUserId = null;
  let allLeadsSnapshot = [];
  let allClientsSnapshot = [];
  let adminSalesChart = null;

  // Sales chart instances
  let monthlySalesChart = null;
  let policySalesChart = null;

  // Keep track of the currently visible section for animated transitions
  let currentSection = 'dashboard';

  /* -----------------------------------------------------------------------
   *  UI Navigation
   */
  function showSection(sectionId) {
    // Avoid unnecessary work if the section is already visible
    if (sectionId === currentSection) return;
    const newSection =
      document.getElementById(sectionId) ||
      document.getElementById(sectionId + '-section');
    const oldSection = currentSection
      ? document.getElementById(currentSection) ||
        document.getElementById(currentSection + '-section')
      : null;
    // Animate the currently visible section out
    if (oldSection && !oldSection.classList.contains('hidden')) {
      gsap.to(oldSection, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => {
          oldSection.classList.add('hidden');
        },
      });
    }
    // Update nav active state
    // Query all nav-link elements dynamically (including injected admin links)
    const allNavLinks = document.querySelectorAll('nav .nav-link');
    allNavLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.dataset.section === sectionId) link.classList.add('active');
    });
    // Show the new section with an entrance animation
    if (newSection) {
      // Slight delay if there was an old section animating out
      const delay = oldSection && !oldSection.classList.contains('hidden') ? 0.3 : 0;
      setTimeout(() => {
        newSection.classList.remove('hidden');
        gsap.fromTo(
          newSection,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4 }
        );
      }, delay * 1000);
    }
    currentSection = sectionId;
    // Trigger any section-specific loading logic
    if (sectionId === 'tasks') {
      loadTasks();
    }
    if (sectionId === 'analytics') {
      updateAnalytics();
    }
    if (sectionId === 'sales') {
      updateSales();
    }
    if (sectionId === 'admin') {
      // For admin dashboard we need to load users, leads, clients and notes
      loadUsers();
      loadAllLeads();
      loadAllClients();
      loadAllNotes();
    }
  }

  /* ------------------ Load FEMA Disasters ------------------ */
  async function loadFemaData() {
    try {
      // Fetch active FEMA disasters from the server
      const response = await fetch("/getActiveFema");
      if (!response.ok) throw new Error("Failed to fetch FEMA data");

      const disasters = await response.json();

      const femaTable = document.getElementById("fema-table-body");
      femaTable.innerHTML = ""; // clear old rows

      disasters.forEach((d) => {
        const row = document.createElement("tr");
        row.innerHTML = `
        <td>${d.state}</td>
        <td>${d.incidentBeginDate}</td>
        <td>${d.incidentEndDate}</td>
        <td>${d.declarationDate}</td>
        <td>${d.sepStart} → ${d.sepEnd}</td>
        <td>${d.counties.join(", ")}</td>
        <td>${d.titles.join(", ")}</td>
      `;
        femaTable.appendChild(row);
      });
    } catch (error) {
      console.error("❌ Error loading FEMA data:", error);
      alert("Could not load FEMA data. Check console for details.");
    }
  }

  /* ------------------ Load Admin Overview ------------------ */
  /**
   * Loads admin overview metrics: total leads, total clients, and conversion rate.
   * Shows alerts if compliance issues or pending tasks exist.
   */
  async function loadAdminOverview() {
    if (!currentUser || !currentUser.isAdmin) return;

    try {
      // Fetch total leads
      const leadsSnapshot = await firebaseDB.collection("leads").get();
      const totalLeads = leadsSnapshot.size;

      // Fetch total clients
      const clientsSnapshot = await firebaseDB.collection("clients").get();
      const totalClients = clientsSnapshot.size;

      // Calculate conversion rate
      const conversionRate =
        totalLeads > 0 ? ((totalClients / totalLeads) * 100).toFixed(1) : 0;

      // Render values in the DOM
      document.getElementById("overview-total-leads").textContent = totalLeads;
      document.getElementById("overview-total-clients").textContent = totalClients;
      document.getElementById("overview-conversion-rate").textContent = `${conversionRate}%`;

      // Example: Alerts for compliance checks
      const flaggedLeads = leadsSnapshot.docs.filter(
        (doc) => doc.data().complianceFlag === true
      );
      if (flaggedLeads.length > 0) {
        const alertsList = document.getElementById("alerts-list");
        alertsList.innerHTML = "";
        flaggedLeads.forEach((lead) => {
          const li = document.createElement("li");
          const data = lead.data();
          li.textContent = `Compliance review needed: ${data.firstName} ${data.lastName}`;
          alertsList.appendChild(li);
        });
        document.getElementById("overview-alerts").classList.remove("hidden");
      }
    } catch (error) {
      console.error("Error loading admin overview:", error);
    }
  }

  /* ------------------ Load Policy & Compliance ------------------ */
  /**
   * Loads compliance documents, regulation changes, and flagged leads/clients.
   * Only available to Admin users.
   */
  async function loadPolicyCompliance() {
    if (!currentUser || !currentUser.isAdmin) return;

    try {
      // Fetch compliance documents
      const docsSnapshot = await firebaseDB.collection("complianceDocs").get();
      const docsList = document.getElementById("compliance-docs");
      docsList.innerHTML = "";
      docsSnapshot.forEach((doc) => {
        const li = document.createElement("li");
        const data = doc.data();
        li.innerHTML = `<a href="${data.url}" target="_blank">${data.title}</a>`;
        docsList.appendChild(li);
      });

      // Fetch recent regulation changes
      const regsSnapshot = await firebaseDB
        .collection("regulationChanges")
        .orderBy("date", "desc")
        .limit(5)
        .get();
      const regsList = document.getElementById("regulation-changes");
      regsList.innerHTML = "";
      regsSnapshot.forEach((reg) => {
        const li = document.createElement("li");
        const data = reg.data();
        li.textContent = `${data.date}: ${data.summary}`;
        regsList.appendChild(li);
      });

      // Fetch pending policy checks
      const checksSnapshot = await firebaseDB
        .collection("policyChecks")
        .where("status", "==", "pending")
        .get();
      const checksList = document.getElementById("policy-checks");
      checksList.innerHTML = "";
      checksSnapshot.forEach((check) => {
        const li = document.createElement("li");
        const data = check.data();
        li.textContent = `${data.clientName} - ${data.issue}`;
        checksList.appendChild(li);
      });

      // Highlight flagged leads/clients
      const flaggedLeads = await firebaseDB
        .collection("leads")
        .where("complianceFlag", "==", true)
        .get();
      const flaggedClients = await firebaseDB
        .collection("clients")
        .where("complianceFlag", "==", true)
        .get();

      const flaggedList = document.getElementById("flagged-list");
      flaggedList.innerHTML = "";

      let flaggedCount = 0;
      flaggedLeads.forEach((lead) => {
        flaggedCount++;
        const li = document.createElement("li");
        li.textContent = `Lead: ${lead.data().firstName} ${lead.data().lastName}`;
        flaggedList.appendChild(li);
      });
      flaggedClients.forEach((client) => {
        flaggedCount++;
        const li = document.createElement("li");
        li.textContent = `Client: ${client.data().firstName} ${client.data().lastName}`;
        flaggedList.appendChild(li);
      });

      const flaggedContainer = document.getElementById("flagged-container");
      if (flaggedCount > 0) {
        flaggedContainer.classList.remove("hidden");
      } else {
        flaggedContainer.classList.add("hidden");
      }
    } catch (error) {
      console.error("Error loading Policy & Compliance:", error);
    }
  }
  navLinks.forEach((link) => {
    if (link.id !== 'nav-fema') {
      link.addEventListener('click', () => {
        const section = link.dataset.section;
        showSection(section);
      });
    }
  });

  document.getElementById('nav-fema').addEventListener('click', () => {
    showSection('fema-section');
    loadFemaData();
  });

/* -----------------------------------------------------------------------
 *  Authentication Flow
 */
function updateUserInfo() {
  if (currentUser) {
    userInfo.innerHTML = `<span>${currentUser.email}</span>`;
    profileDetails.innerHTML = `
      <div>Email: ${currentUser.email}</div>
      <div>Status: <span class="text-green-400">Online</span></div>
    `;
  } else {
    userInfo.innerHTML = '';
    profileDetails.innerHTML = '';
  }
}

const loginDots = document.getElementById('login-dots');
const loginBg   = document.getElementById('login-bg');
const sidebar   = document.getElementById('sidebar');
let justSignedOut = false;

firebaseAuth.onAuthStateChanged(async (user) => {
  currentUser = user;

  const nav = document.querySelector('nav');
  const sidebar = document.getElementById('sidebar');
  

  if (!authModal) {
    return;
  }

  if (user) {
    console.log('Logged in as:', user.uid);

    try {
      // Fetch Firestore user data
      const userDoc = await firebaseDB.collection("users").doc(user.uid).get();
      const userData = userDoc.exists ? userDoc.data() : {};

      // Store isAdmin on currentUser for later checks
      currentUser.isAdmin = !!userData.isAdmin;

       // Animate away login modal
      gsap.to('#auth-modal', { opacity: 0, duration: 0.5, onComplete: () => authModal.classList.add('hidden') });
      gsap.to('#login-bg', { opacity: 0, duration: 0.7, onComplete: () => loginBg.classList.add('hidden', 'pointer-events-none') });
      gsap.to('#login-dots', { opacity: 0, duration: 0.7, onComplete: () => { 
        loginDots.classList.add('hidden', 'pointer-events-none'); 
        loginDots.innerHTML = ''; 
      } });

      updateUserInfo();

      // =============================
// ADMIN VS AGENT DASHBOARD LOGIC
// =============================
if (userData.isAdmin === true) {
  // --- Admin Dashboard ---
  // Hide all sections, show only the Admin Overview
  document.querySelectorAll('.section').forEach((sec) => sec.classList.add('hidden'));
  const adminOverviewEl = document.getElementById('admin-overview');
  if (adminOverviewEl) adminOverviewEl.classList.remove('hidden');

  // Swap out the agent sidebar for the admin sidebar: hide the generic sidebar and
  // reveal the admin-specific sidebar if it exists
  if (sidebar) sidebar.classList.add('hidden');
  const adminSidebarEl = document.getElementById('admin-sidebar');
  if (adminSidebarEl) adminSidebarEl.classList.remove('hidden');

  // Offset main content so the admin sidebar doesn't overlap it
  const adminContentEl = document.getElementById('admin-content');
  const mainContentEl = document.getElementById('main-content');
  if (adminContentEl) adminContentEl.classList.add('ml-64');
  if (mainContentEl) mainContentEl.classList.add('ml-64');

  // Load admin-specific data
  showSection('admin-overview');
  loadAdminOverview();
  if (typeof loadUsers === 'function') loadUsers();
  if (typeof loadAllLeads === 'function') loadAllLeads();
  if (typeof loadAllClients === 'function') loadAllClients();
  if (typeof loadAllNotes === 'function') loadAllNotes();

  showSection('admin-policy');
  loadPolicyCompliance();

  showSection('admin-analytics');
  loadAnalytics();

  showSection('admin-manage-agents');
  if (typeof loadAgents === 'function') loadAgents();

  // Ensure Admin button exists in the header nav
  let adminBtn = document.getElementById('admin-nav-btn');
  if (!adminBtn) {
    adminBtn = document.createElement('button');
    adminBtn.className = 'nav-link';
    adminBtn.id = 'admin-nav-btn';
    adminBtn.dataset.section = 'admin';
    adminBtn.textContent = 'Admin';
    adminBtn.onclick = () => showSection('admin');
    nav.appendChild(adminBtn);
  }

  // Hide all other header nav links except the Admin button when an admin logs in
  document.querySelectorAll('.nav-link').forEach((link) => {
    if (link.id !== 'admin-nav-btn') {
      link.classList.add('hidden');
    } else {
      link.classList.remove('hidden');
    }
  });
  
} else {
  // --- Agent Dashboard ---
  // Hide all sections, show only Dashboard
  document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
  const dashboardSection = document.getElementById('dashboard-section');
  if (dashboardSection) dashboardSection.classList.remove('hidden');

  // Show sidebar for agents
  if (sidebar) sidebar.classList.remove('hidden');


      // Ensure the admin sidebar (if any) is hidden when a non‑admin user logs in
      const adminSidebarForAgent = document.getElementById('admin-sidebar');
      if (adminSidebarForAgent) adminSidebarForAgent.classList.add('hidden');

      // Remove sidebar offset when not in admin view
      const adminContentEl = document.getElementById('admin-content');
      const mainContentEl = document.getElementById('main-content');
      if (adminContentEl) adminContentEl.classList.remove('ml-64');
      if (mainContentEl) mainContentEl.classList.remove('ml-64');

      // Remove any lingering admin navigation button from the header nav
      const adminNavBtnExisting = document.getElementById('admin-nav-btn');
      if (adminNavBtnExisting) adminNavBtnExisting.remove();

      // Hide the overview navigation link for agents and make other nav links visible
      document.querySelectorAll('.nav-link').forEach((link) => {
        if (link.dataset.section === 'overview') {
          link.classList.add('hidden');
        } else {
          link.classList.remove('hidden');
        }
      });
 
  // Load agent-specific data
  showSection('dashboard');
  if (typeof loadLeads === 'function') loadLeads();
  if (typeof loadClients === 'function') loadClients();
  if (typeof loadNotes === 'function') loadNotes();
  if (typeof updateStats === 'function') updateStats();
}
    } catch (err) {
      console.error("Error checking admin status:", err);
      alert("Could not verify user role. Contact support.");
    }

  } else {
    // LOGOUT/UI CLEANUP
    console.log('No user logged in');

    // Remove Overview button if present
    const overviewBtn = document.getElementById('overview-nav-btn');
    if (overviewBtn) overviewBtn.remove();

    if (justSignedOut) {
      window.location.reload();
      return;
    }

    if (sidebar) sidebar.classList.add('hidden');
    authModal.classList.remove('hidden');
    loginBg.classList.remove('hidden', 'pointer-events-none');
    loginDots.classList.remove('hidden', 'pointer-events-none');
    gsap.set('#login-dots', { opacity: 1 });
    updateUserInfo();

    gsap.fromTo('#auth-modal > div',
      { opacity: 0, y: -40 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    if (!loginDots.hasChildNodes()) {
      for (let i = 0; i < 20; i++) {
        const dot = document.createElement('div');
        dot.className = 'absolute rounded-full bg-green-400 opacity-60';
        const size = 120 + Math.random() * 150;
        dot.style.width = `${size}px`;
        dot.style.height = `${size}px`;
        dot.style.top = `${Math.random() * 100}%`;
        dot.style.left = `${Math.random() * 100}%`;
        loginDots.appendChild(dot);

        gsap.to(dot, {
          x: 'random(-200,200)',
          y: 'random(-200,200)',
          scale: 1,
          duration: 'random(8,14)',
          repeat: -1,
          ease: 'sine.inOut'
        });
      }
    }
  }
});





// Attach login handler only if the login form exists.  On pages like
// the admin dashboard there is no login form, and attempting to
// register an event listener on a null element would throw an error.
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = loginEmail.value;
    const password = loginPassword.value;
    try {
      await firebaseAuth.signInWithEmailAndPassword(email, password);
      loginForm.reset();
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    }
  });
}

// Sign-out events are handled in a centralized function later in the file


  /* -----------------------------------------------------------------------
   *  Lead & Client Form Utilities
   */
  function calculateAge(dateStr) {
    if (!dateStr) return '';
    const dobDate = new Date(dateStr);
    const now = new Date();
    let age = now.getFullYear() - dobDate.getFullYear();
    const m = now.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dobDate.getDate())) {
      age--;
    }
    return age;
  }
  leadDOB.addEventListener('change', () => {
    leadAge.value = calculateAge(leadDOB.value);
  });

  // Auto-populate state abbreviation based on ZIP code
  if (leadZip) {
    leadZip.addEventListener('blur', async () => {
      const zip = leadZip.value.trim();
      if (!zip || zip.length < 5) {
        if (leadState) leadState.value = '';
        return;
      }
      try {
        const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
        if (!res.ok) {
          if (leadState) leadState.value = '';
          return;
        }
        const data = await res.json();
        const stateAbbr = data.places && data.places[0] && data.places[0]['state abbreviation'];
        if (stateAbbr && leadState) {
          leadState.value = stateAbbr;
        } else if (leadState) {
          leadState.value = '';
        }
      } catch (err) {
        console.error('Error fetching state for ZIP', err);
      }
    });
  }

  // Open lead modal for adding a new record
  if (addLeadBtn) {
    addLeadBtn.addEventListener('click', () => {
      editingDocId = null;
      editingCollection = null;
      leadForm.reset();
      leadAge.value = '';
      // Hide sold button when adding a new lead
      if (markSoldBtn) markSoldBtn.classList.add('hidden');
      leadModal.classList.remove('hidden');
      // Animate modal opening
      gsap.fromTo(
        '#lead-modal > div',
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.3 }
      );
    });
  }

  // Cancel lead modal
  cancelLeadBtn.addEventListener('click', () => {
    leadModal.classList.add('hidden');
  });

  // Clear lead form
  clearLeadBtn.addEventListener('click', () => {
    editingDocId = null;
    editingCollection = null;
    leadForm.reset();
    leadAge.value = '';
    if (markSoldBtn) markSoldBtn.classList.add('hidden');
  });

  // Save lead or client (create or update).  Wrap the event handler
  // registration so it only executes when the lead form exists (e.g., on
  // the main agent dashboard).  The admin dashboard does not include
  // this form.
  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!currentUser) return;
      const data = {
    firstName: leadFirstName.value.trim(),
    lastName: leadLastName.value.trim(),
    dob: leadDOB.value,
    age: parseInt(leadAge.value) || null,
    medicare: leadMedicare.value.trim(),
    medicaid: leadMedicaid.value.trim(),
    ssn: leadSSN.value.trim(),
    phone: leadPhone.value.trim(),
    plan: leadPlan.value.trim(),
    sunfire: leadSunfire.value.trim(),
    medications: leadMedications.value.trim(),
    doctors: leadDoctors.value.trim(),
    callback: leadCallback.value,
    notes: leadNotes.value.trim(),
    middleInitial: leadMiddleInitial.value.trim(),
    state: leadState.value.trim(),
    hospital: leadHospital.value.trim(),
    extraHelpLevel: leadExtraHelp.value,
    medicaidLevel: leadMedicaidLevel.value,
    zipcode: leadZip.value.trim(), // <-- correct reference
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    userId: currentUser ? currentUser.uid : null,
  };
      // createdAt only on creation
      if (!editingDocId) {
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      }
	  console.log("Saving lead data:", data);
      try {
        if (editingDocId && editingCollection) {
          // Update existing document in the appropriate collection
          await firebaseDB.collection(editingCollection).doc(editingDocId).set(data, { merge: true });
        } else {
          // New record always goes into leads collection
          await firebaseDB.collection('leads').add(data);
        }
        leadModal.classList.add('hidden');
        leadForm.reset();
        editingDocId = null;
        editingCollection = null;
        // Hide sold button after save
        if (markSoldBtn) markSoldBtn.classList.add('hidden');
      } catch (err) {
        console.error('Error saving record:', err);
        alert('Failed to save.');
      }
    });
  }
    
  // Centralized sign-out handler to avoid duplicate logic
  const signOutBtnBottom = document.getElementById('sign-out-btn-bottom');

  async function handleSignOut(context = '') {
    try {
      justSignedOut = true;
      await firebaseAuth.signOut();
      showSection('dashboard');
    } catch (error) {
      console.error(`Sign out error${context ? ` (${context})` : ''}`, error);
    }
  }

  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => handleSignOut());
  }

  if (signOutBtnBottom) {
    signOutBtnBottom.addEventListener('click', () => handleSignOut('bottom'));
  }

  if (adminSignOutBtn) {
    adminSignOutBtn.addEventListener('click', () => handleSignOut('admin'));
  }
  if (adminSidebarSignOutBtn) {
    adminSidebarSignOutBtn.addEventListener('click', () => handleSignOut('admin'));
  }
  /* -----------------------------------------------------------------------
   *  Sold Workflow
   */
  // Open sold modal prefilled with plan pitched
  if (markSoldBtn) {
    markSoldBtn.addEventListener('click', () => {
      // Pre-fill the sold plan with whatever is in the lead plan input
      soldPlanInput.value = leadPlan.value || '';
      soldAncillaryInput.value = '';
      soldAncillaryDateInput.value = '';
      soldModal.classList.remove('hidden');
      gsap.fromTo(
        '#sold-modal > div',
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.3 }
      );
    });
  }
  // Cancel sold modal only if the cancel button exists (not present on admin page)
  if (cancelSoldBtn) {
    cancelSoldBtn.addEventListener('click', () => {
      soldModal.classList.add('hidden');
      soldForm.reset();
    });
  }
  // Handle sold form submission
  if (soldForm) {
    soldForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!currentUser) return;
      // Only proceed if editing a lead
      if (!editingDocId || editingCollection !== 'leads') {
        soldModal.classList.add('hidden');
        soldForm.reset();
        return;
      }
      // Capture sold details
      const soldData = {
        planSold: soldPlanInput.value.trim(),
        ancillaryPlan: soldAncillaryInput.value.trim(),
        ancillaryDate: soldAncillaryDateInput.value || null,
        effectiveDate: soldEffectiveDateInput ? soldEffectiveDateInput.value || null : null,
        premiumAmount: soldPremiumInput && soldPremiumInput.value ? parseFloat(soldPremiumInput.value) : null,
        commission: soldCommissionInput && soldCommissionInput.value ? parseFloat(soldCommissionInput.value) : null,
        saleDate: soldSaleDateInput && soldSaleDateInput.value ? soldSaleDateInput.value : null,
        document: soldDocumentInput && soldDocumentInput.files && soldDocumentInput.files[0] ? soldDocumentInput.files[0].name : null,
        soldAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      // Find the lead in our local snapshot so we can copy its fields
      const lead = leadsSnapshot.find((l) => l.id === editingDocId);
      if (!lead) {
        alert('Could not locate lead data.');
        return;
      }
      // Build client document by merging lead fields and sold details
      const clientData = Object.assign({}, lead, soldData);
      // Remove the id field from the copy; Firestore will assign a new one
      delete clientData.id;
      // Update timestamps
      clientData.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
      clientData.userId = currentUser.uid;
      try {
        // Create new client document
        await firebaseDB.collection('clients').add(clientData);
        // Delete the original lead document
        await firebaseDB.collection('leads').doc(editingDocId).delete();
        // Reset state and close modals
        soldModal.classList.add('hidden');
        soldForm.reset();
        leadModal.classList.add('hidden');
        leadForm.reset();
        editingDocId = null;
        editingCollection = null;
        if (markSoldBtn) markSoldBtn.classList.add('hidden');
      } catch (err) {
        console.error('Failed to convert lead to client:', err);
        alert('Failed to mark sold.');
      }
    });
  }

  /* -----------------------------------------------------------------------
   *  Activity Modal Logic
   */
  // Cancel activity modal
  if (cancelActivityBtn) {
    cancelActivityBtn.addEventListener('click', () => {
      if (activityModal) activityModal.classList.add('hidden');
      if (activityForm) activityForm.reset();
      activityDocId = null;
    });
  }
  // Handle activity form submission
  if (activityForm) {
    activityForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!currentUser) return;
      if (!activityDocId) {
        if (activityModal) activityModal.classList.add('hidden');
        if (activityForm) activityForm.reset();
        return;
      }
      const update = {
        activityAgentName: activityAgentName.value.trim(),
        activityNotes: activityNotes.value.trim(),
        activityUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      try {
        await firebaseDB.collection('leads').doc(activityDocId).set(update, { merge: true });
        if (activityModal) activityModal.classList.add('hidden');
        if (activityForm) activityForm.reset();
        activityDocId = null;
      } catch (err) {
        console.error('Failed to save activity:', err);
        alert('Failed to save activity.');
      }
    });
  }

  /* -----------------------------------------------------------------------
   *  Firestore Listeners
   */
  function loadLeads(startDate, endDate) {
    if (!currentUser || !currentUser.uid) {
      return;
    }
    let query = firebaseDB
      .collection('leads')
      .where('userId', '==', currentUser.uid)
      .orderBy('createdAt', 'desc');
    if (startDate) {
      const startTimestamp = new Date(startDate);
      query = query.where('createdAt', '>=', startTimestamp);
    }
    if (endDate) {
      const endTimestamp = new Date(endDate);
      endTimestamp.setHours(23, 59, 59, 999);
      query = query.where('createdAt', '<=', endTimestamp);
    }
    try {
   query.onSnapshot(snapshot => {
      leadsSnapshot = [];
      snapshot.forEach((doc) => {
        leadsSnapshot.push({ id: doc.id, ...doc.data() });
      });
      renderLeadsTable();
      updateStats();
    });
	} catch (err) {
   console.error("Snapshot failed:", err.message);
   alert("A Firestore index is missing. Check console for the link.");
}
  }
  function loadClients() {
    if (!currentUser || !currentUser.uid) {
      return;
    }
    firebaseDB
      .collection('clients')
      .where('userId', '==', currentUser.uid)
      .orderBy('soldAt', 'desc')
      .onSnapshot((snapshot) => {
        clientsSnapshot = [];
        snapshot.forEach((doc) => {
          clientsSnapshot.push({ id: doc.id, ...doc.data() });
        });
        renderClientsList();
        // Update sales metrics when client data changes
        updateSales();
      });
  }
  function loadNotes() {
    firebaseDB
      .collection('notes')
      .where('userId', '==', currentUser ? currentUser.uid : null)
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        notesList.innerHTML = '';
        snapshot.forEach((doc) => {
          const note = doc.data();
          const li = document.createElement('li');
          li.classList.add('p-2', 'bg-gray-800', 'rounded');
          const date = note.createdAt && note.createdAt.toDate ? note.createdAt.toDate() : new Date();
          li.textContent = `${date.toLocaleString()}: ${note.text}`;
          notesList.appendChild(li);
        });
      });
  }

  /* -----------------------------------------------------------------------
   *  Rendering Helpers
   */
  function renderLeadsTable() {
    leadsTableBody.innerHTML = '';
    // Filter, score, and sort leads
    const term = leadSearchTerm ? leadSearchTerm.trim().toLowerCase() : '';
    const processed = leadsSnapshot
      .map((lead) => {
        // Compute a simple score based on age and callback urgency
        let score = 0;
        const ageVal = parseInt(lead.age);
        if (!isNaN(ageVal)) {
          score += ageVal;
        }
        if (lead.callback) {
          const now = new Date();
          const cbDate = new Date(lead.callback);
          const daysUntil = Math.ceil((cbDate - now) / (1000 * 60 * 60 * 24));
          if (!isNaN(daysUntil)) {
            // More urgent callbacks (sooner) increase score; limit to positive range
            const urgency = Math.max(0, 30 - daysUntil);
            score += urgency;
          }
        }
        return { lead, score };
      })
      .filter(({ lead }) => {
        if (!term) return true;
        const name = `${lead.firstName || ''} ${lead.lastName || ''}`.toLowerCase();
        const phone = (lead.phone || '').toLowerCase();
        const zip = (lead.zipcode || '').toLowerCase();
        return name.includes(term) || phone.includes(term) || zip.includes(term);
      })
      .sort((a, b) => b.score - a.score);
    processed.forEach(({ lead, score }) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="py-2 px-3">${lead.firstName || ''} ${lead.lastName || ''}</td>
        <td class="py-2 px-3">${lead.dob || ''}</td>
        <td class="py-2 px-3">${lead.phone || ''}</td>
        <td class="py-2 px-3">${lead.plan || ''}</td>
        <td class="py-2 px-3">${lead.callback ? new Date(lead.callback).toLocaleString() : ''}</td>
        <td class="py-2 px-3">${score}</td>
        <td class="py-2 px-3 space-x-2">
          <button class="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs" data-id="${lead.id}" data-action="edit">Edit</button>
          <button class="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs" data-id="${lead.id}" data-action="delete">Delete</button>
          <button class="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-xs" data-id="${lead.id}" data-action="activity">Activity</button>
        </td>
      `;
      leadsTableBody.appendChild(tr);
      // Animate each lead row into view
      gsap.fromTo(
        tr,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
    });
  }
  function renderClientsList() {
    clientsList.innerHTML = '';
    const term = clientSearchTerm.trim().toLowerCase();
    const filtered = clientsSnapshot.filter((client) => {
      if (!term) return true;
      const name = `${client.firstName || ''} ${client.lastName || ''}`.toLowerCase();
      const phone = (client.phone || '').toLowerCase();
      const plan = (client.planSold || client.plan || '').toLowerCase();
      return name.includes(term) || phone.includes(term) || plan.includes(term);
    });
    filtered.forEach((client) => {
      const div = document.createElement('div');
      div.classList.add('bg-gray-800', 'p-4', 'rounded', 'shadow', 'space-y-1');
      div.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <h4 class="font-semibold text-lg">${client.firstName || ''} ${client.lastName || ''}</h4>
          <button
            class="edit-client-btn px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs"
            data-id="${client.id}"
          >
            Edit
          </button>
        </div>
        <p class="text-sm text-gray-400">Phone: ${client.phone || 'N/A'}</p>
        <p class="text-sm text-gray-400">DOB: ${client.dob || ''} | Age: ${client.age || ''}</p>
        <p class="text-sm text-gray-400">Plan Sold: ${client.planSold || client.plan || 'N/A'}</p>
        <p class="text-sm text-gray-400">Premium: ${typeof client.premiumAmount === 'number' ? ('$' + client.premiumAmount.toFixed(2)) : 'N/A'}</p>
        <p class="text-sm text-gray-400">Commission: ${typeof client.commission === 'number' ? ('$' + client.commission.toFixed(2)) : 'N/A'}</p>
        <p class="text-sm text-gray-400">Sale Date: ${client.saleDate || ''}</p>
        <p class="text-sm text-gray-400">Ancillary: ${client.ancillaryPlan || 'None'}</p>
        <p class="text-sm text-gray-400">Ancillary Date: ${client.ancillaryDate || ''}</p>
        <p class="text-sm text-gray-400">Medications: ${client.medications || ''}</p>
        <p class="text-sm text-gray-400">Doctors: ${client.doctors || ''}</p>
        <p class="text-sm text-gray-400">Notes: ${client.notes || ''}</p>
      `;
      clientsList.appendChild(div);
      // Animate client card appearance
      gsap.fromTo(
        div,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
    });
    if (filtered.length === 0) {
      const empty = document.createElement('p');
      empty.classList.add('text-sm', 'text-gray-500');
      empty.textContent = 'No clients found.';
      clientsList.appendChild(empty);
    }
  }
  function updateStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let leadsTodayCount = 0;
    let followUpsCount = 0;
    leadsSnapshot.forEach((lead) => {
      if (lead.createdAt && lead.createdAt.toDate) {
        const createdAtDate = lead.createdAt.toDate();
        if (createdAtDate >= today) {
          leadsTodayCount++;
        }
      }
      if (lead.callback) {
        const callbackDate = new Date(lead.callback);
        if (callbackDate >= today) {
          followUpsCount++;
        }
      }
    });
    // Update statistic text
    statLeadsToday.textContent = leadsTodayCount;
    statFollowUps.textContent = followUpsCount;
    statTotalLeads.textContent = leadsSnapshot.length;
    // Trigger a small bounce animation when the numbers change
    gsap.fromTo(
      statLeadsToday,
      { scale: 1.3 },
      { scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
    );
    gsap.fromTo(
      statFollowUps,
      { scale: 1.3 },
      { scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
    );
    gsap.fromTo(
      statTotalLeads,
      { scale: 1.3 },
      { scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
    );
    // Update analytics if its section is loaded
    updateAnalytics();
  }

  /* -----------------------------------------------------------------------
   *  UI Interactions
   */
// Lead table actions (edit/delete)
leadsTableBody.addEventListener('click', async (e) => {
  const target = e.target;
  if (target.tagName !== 'BUTTON') return;
  
  const id = target.getAttribute('data-id');
  const action = target.getAttribute('data-action');
  if (!id || !action) return;

  if (action === 'edit') {
    // Find lead data
    const lead = leadsSnapshot.find((l) => l.id === id);
    if (!lead) return;

    editingDocId = id;
    editingCollection = 'leads';

    // Prefill form
    leadFirstName.value = lead.firstName || '';
    leadLastName.value = lead.lastName || '';
    leadDOB.value = lead.dob || '';
    leadAge.value = lead.age || '';
    leadMedicare.value = lead.medicare || '';
    leadMedicaid.value = lead.medicaid || '';
    leadSSN.value = lead.ssn || '';
    leadPhone.value = lead.phone || '';
	leadZip.value = lead.zipcode || ''; 
    leadState.value = lead.state || '';
    leadMiddleInitial.value = lead.middleInitial || '';
    leadHospital.value = lead.hospital || '';
    leadExtraHelp.value = lead.extraHelpLevel || '';
    leadMedicaidLevel.value = lead.medicaidLevel || '';
    leadPlan.value = lead.plan || '';
    leadSunfire.value = lead.sunfire || '';
    leadMedications.value = lead.medications || '';
    leadDoctors.value = lead.doctors || '';
    leadCallback.value = lead.callback
      ? new Date(lead.callback).toISOString().slice(0, 16)
      : '';
    leadNotes.value = lead.notes || '';
     

    // Show sold button when editing a lead
    if (markSoldBtn) markSoldBtn.classList.remove('hidden');

    // Show the modal with GSAP animation
    leadModal.classList.remove('hidden');
    gsap.fromTo(
      '#lead-modal > div',
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.3 }
    );

  } else if (action === 'delete') {
    if (confirm('Delete this lead?')) {
      try {
        await firebaseDB.collection('leads').doc(id).delete();
      } catch (err) {
        console.error('Delete failed', err);
      }
    }
  } else if (action === 'activity') {
    // Open activity modal for this lead
    const lead = leadsSnapshot.find((l) => l.id === id);
    if (!lead) return;
    activityDocId = id;
    // Prefill fields if stored on lead
    if (activityAgentName) {
      activityAgentName.value = lead.activityAgentName || '';
    }
    if (activityNotes) {
      activityNotes.value = lead.activityNotes || '';
    }
    if (activityModal) {
      activityModal.classList.remove('hidden');
      gsap.fromTo(
        '#activity-modal > div',
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.3 }
      );
    }
  }
});

  
  // Client edit
  if (clientsList) {
    clientsList.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.edit-client-btn');
      if (!editBtn) return;
      const id = editBtn.getAttribute('data-id');
      const client = clientsSnapshot.find((c) => c.id === id);
      if (!client) return;
      editingDocId = id;
      editingCollection = 'clients';
      // Prefill form using client date
      leadFirstName.value = client.firstName || '';
      leadLastName.value = client.lastName || '';
      leadDOB.value = client.dob || '';
      leadAge.value = client.age || '';
      leadMedicare.value = client.medicare || '';
      leadSSN.value = client.ssn || '';
      leadPhone.value = client.phone || '';
	  leadZip.value = lead.zipcode || '';
      // For clients we store planSold and plan; prefer planSold
      leadPlan.value = client.planSold || client.plan || '';
      leadSunfire.value = client.sunfire || '';
      leadMedications.value = client.medications || '';
      leadDoctors.value = client.doctors || '';
      leadCallback.value = client.callback
        ? new Date(client.callback).toISOString().slice(0, 16)
        : '';
      leadNotes.value = client.notes || '';
      // Hide sold button when editing a client
      if (markSoldBtn) markSoldBtn.classList.add('hidden');
      leadModal.classList.remove('hidden');
      gsap.fromTo(
        '#lead-modal > div',
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.3 }
      );
    });
  }

  // Note form submission (only attach if the note form exists)
  if (noteForm) {
    noteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = noteText.value.trim();
      if (!text || !currentUser) return;
      try {
        await firebaseDB.collection('notes').add({
          text,
          userId: currentUser.uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        noteForm.reset();
      } catch (err) {
        console.error('Failed to save note', err);
      }
    });
  }

  /* -----------------------------------------------------------------------
   *  Filtering, Searching & Exporting
   */
  // Filtering, searching & exporting are only available on the agent dashboard
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
      const start = filterStartDate.value;
      const end = filterEndDate.value;
      loadLeads(start, end);
    });
  }
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      filterStartDate.value = '';
      filterEndDate.value = '';
      loadLeads();
    });
  }
  if (exportLeadsBtn) {
    exportLeadsBtn.addEventListener('click', async () => {
      const rows = [
        [
          'First Name',
          'Last Name',
          'DOB',
          'Age',
          'Phone',
		  'Zipcode',
          'Medicare #',
          'SSN',
          'Plan',
          'Sunfire Code',
          'Medications',
          'Doctors',
          'Callback',
          'Notes',
          'Created At',
        ],
      ];
      leadsSnapshot.forEach((lead) => {
        rows.push([
          lead.firstName || '',
          lead.lastName || '',
          lead.dob || '',
          lead.age || '',
          lead.phone || '',
		  lead.zipcode || '',
          lead.medicare || '',
          lead.ssn || '',
          lead.plan || '',
          lead.sunfire || '',
          lead.medications || '',
          lead.doctors || '',
          lead.callback ? new Date(lead.callback).toLocaleString() : '',
          (lead.notes || '').replace(/\n/g, ' '),
          lead.createdAt && lead.createdAt.toDate ? lead.createdAt.toDate().toLocaleString() : '',
        ]);
      });
      const csvContent = rows
        .map((r) => r.map((field) => '"' + field.replace(/"/g, '""') + '"').join(','))
        .join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }
  // Client search
  if (clientSearchInput) {
    clientSearchInput.addEventListener('input', (e) => {
      clientSearchTerm = e.target.value || '';
      renderClientsList();
    });
  }
  if (clearClientSearchBtn) {
    clearClientSearchBtn.addEventListener('click', () => {
      clientSearchTerm = '';
      clientSearchInput.value = '';
      renderClientsList();
    });
  }

  // Leads search
  if (leadSearchInput) {
    leadSearchInput.addEventListener('input', (e) => {
      leadSearchTerm = e.target.value || '';
      renderLeadsTable();
    });
  }
  if (clearLeadSearchBtn) {
    clearLeadSearchBtn.addEventListener('click', () => {
      leadSearchTerm = '';
      if (leadSearchInput) leadSearchInput.value = '';
      renderLeadsTable();
    });
  }

  /* -----------------------------------------------------------------------
   *  Task Management
   *
   *  Simple client‑side task management stored in localStorage. Users can
   *  create personal to‑dos with a title, description, due date and
   *  priority. Tasks are persisted locally and can be edited or deleted.
   *  Opening the task modal resets the editing index; submitting the form
   *  creates or updates the appropriate task. Each list item animates
   *  when added for a fluid feel.
   */
  function loadTasks() {
    try {
      const stored = localStorage.getItem('crm_tasks');
      tasks = stored ? JSON.parse(stored) : [];
    } catch (err) {
      tasks = [];
    }
    renderTasks();
  }
  function saveTasks() {
    try {
      localStorage.setItem('crm_tasks', JSON.stringify(tasks));
    } catch (err) {
      console.warn('Could not save tasks to localStorage:', err);
    }
  }
  function renderTasks() {
    if (!tasksListEl) return;
    tasksListEl.innerHTML = '';
    if (!tasks || tasks.length === 0) {
      const empty = document.createElement('p');
      empty.classList.add('text-sm', 'text-gray-500');
      empty.textContent = 'No tasks yet. Use the button above to add one.';
      tasksListEl.appendChild(empty);
      return;
    }
    tasks.forEach((task, index) => {
      const div = document.createElement('div');
      div.classList.add('bg-gray-800', 'p-4', 'rounded', 'shadow', 'space-y-2', 'relative');
      div.innerHTML = `
        <div class="flex justify-between items-center">
          <h4 class="font-semibold text-lg">${task.title}</h4>
          <div class="space-x-2">
            <button class="edit-task-btn px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs" data-index="${index}">Edit</button>
            <button class="delete-task-btn px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs" data-index="${index}">Delete</button>
          </div>
        </div>
        <p class="text-sm text-gray-400">${task.description || ''}</p>
        <p class="text-xs text-gray-500">Due: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</p>
        <p class="text-xs text-gray-500">Priority: ${task.priority}</p>
      `;
      tasksListEl.appendChild(div);
      // Animate each task item in from the right
      gsap.fromTo(
        div,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
    });
  }
  // Open task modal
  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', () => {
      editingTaskIndex = null;
      if (taskForm) taskForm.reset();
      if (taskModal) {
        taskModal.classList.remove('hidden');
        gsap.fromTo(
          '#task-modal > div',
          { opacity: 0, y: -50 },
          { opacity: 1, y: 0, duration: 0.3 }
        );
      }
    });
  }
  // Cancel task modal
  if (cancelTaskBtn) {
    cancelTaskBtn.addEventListener('click', () => {
      if (taskModal) taskModal.classList.add('hidden');
    });
  }
  // Submit task form
  if (taskForm) {
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = taskTitle ? taskTitle.value.trim() : '';
      const description = taskDesc ? taskDesc.value.trim() : '';
      const dueDate = taskDueDate ? taskDueDate.value : '';
      const priority = taskPriority ? taskPriority.value : 'Medium';
      if (!title) {
        showToast('Please provide a task title.', 'error');
        return;
      }
      const taskData = { title, description, dueDate, priority };
      if (editingTaskIndex !== null && editingTaskIndex >= 0 && editingTaskIndex < tasks.length) {
        tasks[editingTaskIndex] = taskData;
      } else {
        tasks.push(taskData);
      }
      saveTasks();
      renderTasks();
      if (taskModal) taskModal.classList.add('hidden');
      editingTaskIndex = null;
    });
  }
  // Handle edit/delete clicks on tasks
  if (tasksListEl) {
    tasksListEl.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.edit-task-btn');
      const deleteBtn = e.target.closest('.delete-task-btn');
      if (editBtn) {
        const idx = parseInt(editBtn.getAttribute('data-index'), 10);
        const task = tasks[idx];
        if (!task) return;
        editingTaskIndex = idx;
        // Prefill form
        if (taskTitle) taskTitle.value = task.title || '';
        if (taskDesc) taskDesc.value = task.description || '';
        if (taskDueDate) taskDueDate.value = task.dueDate || '';
        if (taskPriority) taskPriority.value = task.priority || 'Medium';
        if (taskModal) {
          taskModal.classList.remove('hidden');
          gsap.fromTo(
            '#task-modal > div',
            { opacity: 0, y: -50 },
            { opacity: 1, y: 0, duration: 0.3 }
          );
        }
      } else if (deleteBtn) {
        const idx = parseInt(deleteBtn.getAttribute('data-index'), 10);
        if (isNaN(idx)) return;
        if (confirm('Delete this task?')) {
          tasks.splice(idx, 1);
          saveTasks();
          renderTasks();
        }
      }
    });
  }

  /* -----------------------------------------------------------------------
   *  Analytics
   *
   *  The analytics section gives a quick overview of leads and clients. A
   *  doughnut chart compares sold versus unsold leads using Chart.js. This
   *  function should be called whenever leads or clients snapshots are
   *  updated. It updates counts and either instantiates or refreshes the
   *  chart instance.
   */
  function updateAnalytics() {
    if (!analyticsTotalLeads || !analyticsTotalClients) return;
    analyticsTotalLeads.textContent = leadsSnapshot.length;
    analyticsTotalClients.textContent = clientsSnapshot.length;
    const soldCount = clientsSnapshot.length;
    const unsoldCount = leadsSnapshot.length;
    const ctxEl = document.getElementById('sales-chart');
    if (!ctxEl) return;
    const ctx = ctxEl.getContext('2d');
    const data = {
      labels: ['Sold', 'Unsold'],
      datasets: [
        {
          data: [soldCount, unsoldCount],
          backgroundColor: ['#34d399', '#60a5fa'],
          borderColor: ['#34d399', '#60a5fa'],
          borderWidth: 1,
        },
      ],
    };
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#d1d5db',
          },
        },
      },
    };
    if (!salesChart) {
      salesChart = new Chart(ctx, {
        type: 'doughnut',
        data,
        options,
      });
    } else {
      salesChart.data = data;
      salesChart.options = options;
      salesChart.update();
    }
  }

  /* -----------------------------------------------------------------------
   *  Sales Analytics
   *
   *  This function computes total premium and commission from client
   *  documents, aggregates sales by month and policy type, and renders
   *  the corresponding charts using Chart.js. It determines whether
   *  the current user is an admin to choose between per‑agent or
   *  global datasets. Charts are stored globally to allow updates
   *  without recreating them on every call.
   */
  function updateSales() {
    // Only run if the sales section exists
    const premiumEl =
      document.getElementById('sales-total-premium') ||
      document.getElementById('admin-sales-total-premium');
    const commissionEl =
      document.getElementById('sales-total-commission') ||
      document.getElementById('admin-sales-total-commission');
    const monthlyCanvas =
      document.getElementById('monthly-sales-chart') ||
      document.getElementById('admin-monthly-sales-chart');
    const policyCanvas =
      document.getElementById('policy-sales-chart') ||
      document.getElementById('admin-policy-sales-chart');
    if (!premiumEl || !commissionEl || !monthlyCanvas || !policyCanvas) {
      return;
    }
    const isAdmin = currentUser && currentUser.isAdmin;
    const clients = isAdmin ? allClientsSnapshot : clientsSnapshot;
    let totalPremium = 0;
    let totalCommission = 0;
    const monthlyMap = {};
    const policyCount = {};
    clients.forEach((client) => {
      const premium = typeof client.premiumAmount === 'number' ? client.premiumAmount : 0;
      const commission = typeof client.commission === 'number' ? client.commission : 0;
      totalPremium += premium;
      totalCommission += commission;
      // Determine sale date: prefer explicit saleDate, fall back to soldAt timestamp
      let saleDate = null;
      if (client.saleDate) {
        saleDate = new Date(client.saleDate);
      } else if (client.soldAt && client.soldAt.toDate) {
        saleDate = client.soldAt.toDate();
      }
      if (saleDate && !isNaN(saleDate)) {
        const key = saleDate.getFullYear() + '-' + String(saleDate.getMonth() + 1).padStart(2, '0');
        monthlyMap[key] = (monthlyMap[key] || 0) + premium;
      }
      const plan = client.planSold || client.plan || 'Unknown';
      policyCount[plan] = (policyCount[plan] || 0) + 1;
    });
    // Update stats display
    premiumEl.textContent = totalPremium.toFixed(2);
    commissionEl.textContent = totalCommission.toFixed(2);
    // Prepare monthly sales data
    const sortedMonths = Object.keys(monthlyMap).sort();
    const monthlyLabels = sortedMonths;
    const monthlyValues = sortedMonths.map((key) => monthlyMap[key]);
    // Prepare policy sales data
    const policyLabels = Object.keys(policyCount);
    const policyValues = policyLabels.map((key) => policyCount[key]);
    // Monthly sales chart
    const monthlyCtx = monthlyCanvas.getContext('2d');
    const monthlyData = {
      labels: monthlyLabels,
      datasets: [
        {
          label: 'Premium by Month',
          data: monthlyValues,
          borderColor: '#60a5fa',
          backgroundColor: 'rgba(96,165,250,0.4)',
          fill: true,
        },
      ],
    };
    const monthlyOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#d1d5db' },
        },
      },
      scales: {
        x: {
          ticks: { color: '#d1d5db' },
          grid: { color: '#374151' },
        },
        y: {
          ticks: { color: '#d1d5db' },
          grid: { color: '#374151' },
          title: { display: true, text: 'Premium ($)', color: '#d1d5db' },
        },
      },
    };
    if (!monthlySalesChart) {
      monthlySalesChart = new Chart(monthlyCtx, {
        type: 'line',
        data: monthlyData,
        options: monthlyOptions,
      });
    } else {
      monthlySalesChart.data = monthlyData;
      monthlySalesChart.options = monthlyOptions;
      monthlySalesChart.update();
    }
    // Policy type chart
    const policyCtx = policyCanvas.getContext('2d');
    const policyData = {
      labels: policyLabels,
      datasets: [
        {
          label: 'Number of Sales',
          data: policyValues,
          backgroundColor: policyLabels.map(() => '#34d399'),
          borderColor: policyLabels.map(() => '#34d399'),
          borderWidth: 1,
        },
      ],
    };
    const policyOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        x: {
          ticks: { color: '#d1d5db' },
          grid: { color: '#374151' },
        },
        y: {
          ticks: { color: '#d1d5db' },
          grid: { color: '#374151' },
          title: { display: true, text: 'Sales Count', color: '#d1d5db' },
        },
      },
    };
    if (!policySalesChart) {
      policySalesChart = new Chart(policyCtx, {
        type: 'bar',
        data: policyData,
        options: policyOptions,
      });
    } else {
      policySalesChart.data = policyData;
      policySalesChart.options = policyOptions;
      policySalesChart.update();
    }
  }

  /* -----------------------------------------------------------------------
   *  Admin Dashboard Helpers
   *
   *  The admin dashboard surfaces a global view of your agency: user
   *  profiles, all leads/clients across agents, reporting and notes. These
   *  helpers mirror the per‑agent logic but remove the userId filter.
   */
  function loadUsers() {
    if (!firebaseDB) return;
    firebaseDB
      .collection('users')
      .onSnapshot((snapshot) => {
        usersSnapshot = [];
        snapshot.forEach((doc) => {
          usersSnapshot.push({ id: doc.id, ...doc.data() });
        });
        renderUsersTable();
      });
  }

  function renderUsersTable() {
    if (!adminUsersTableBody) return;
    adminUsersTableBody.innerHTML = '';
    usersSnapshot.forEach((user) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="py-2 px-3">${user.name || ''}</td>
        <td class="py-2 px-3">${user.email || ''}</td>
        <td class="py-2 px-3">${user.role || 'agent'}</td>
        <td class="py-2 px-3 space-x-2">
          <button class="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs" data-id="${user.id}" data-action="edit-user">Edit</button>
          <button class="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs" data-id="${user.id}" data-action="delete-user">Delete</button>
        </td>
      `;
      adminUsersTableBody.appendChild(tr);
    });
    if (usersSnapshot.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="4" class="py-3 px-3 text-sm text-gray-500">No agents found.</td>`;
      adminUsersTableBody.appendChild(tr);
    }
  }

  function loadAllLeads() {
    firebaseDB
      .collection('leads')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        allLeadsSnapshot = [];
        snapshot.forEach((doc) => {
          allLeadsSnapshot.push({ id: doc.id, ...doc.data() });
        });
        loadAnalytics();
      });
  }

  function loadAllClients() {
    firebaseDB
      .collection('clients')
      .orderBy('soldAt', 'desc')
      .onSnapshot((snapshot) => {
        allClientsSnapshot = [];
        snapshot.forEach((doc) => {
          allClientsSnapshot.push({ id: doc.id, ...doc.data() });
        });
        loadAnalytics();
        updateSales();
      });
  }

  function loadAllNotes() {
    firebaseDB
      .collection('notes')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        if (!adminNotesListEl) return;
        adminNotesListEl.innerHTML = '';
        snapshot.forEach((doc) => {
          const note = doc.data();
          const li = document.createElement('li');
          li.classList.add('p-2', 'bg-gray-800', 'rounded');
          const date = note.createdAt && note.createdAt.toDate ? note.createdAt.toDate() : new Date();
          const userLabel = note.userId ? `[${note.userId.slice(0, 6)}] ` : '';
          li.textContent = `${userLabel}${date.toLocaleString()}: ${note.text}`;
          adminNotesListEl.appendChild(li);
        });
        if (adminNotesListEl.childElementCount === 0) {
          const li = document.createElement('li');
          li.classList.add('text-sm', 'text-gray-500');
          li.textContent = 'No notes available.';
          adminNotesListEl.appendChild(li);
        }
      });
  }

  /* ------------------ Load Agents ------------------ */
  async function loadAgents() {
    if (!currentUser || !currentUser.isAdmin) return;

    try {
      const usersSnapshot = await firebaseDB
        .collection("users")
        .where("role", "==", "agent")
        .get();
      if (!agentsTableBody) return;
      agentsTableBody.innerHTML = "";

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();

        const leadsSnapshot = await firebaseDB
          .collection("leads")
          .where("userId", "==", userDoc.id)
          .get();
        const leadCount = leadsSnapshot.size;

        const clientsSnapshot = await firebaseDB
          .collection("clients")
          .where("userId", "==", userDoc.id)
          .get();
        const clientCount = clientsSnapshot.size;

        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td class="p-2">${userData.name || "N/A"}</td>
        <td class="p-2">${userData.email}</td>
        <td class="p-2">${leadCount}</td>
        <td class="p-2">${clientCount}</td>
        <td class="p-2">${userData.role}</td>
        <td class="p-2">
          <button class="bg-blue-600 px-2 py-1 rounded edit-agent-btn" data-id="${userDoc.id}">Edit</button>
          <button class="bg-red-600 px-2 py-1 rounded delete-agent-btn" data-id="${userDoc.id}">Delete</button>
        </td>`;
        agentsTableBody.appendChild(tr);
      }

      document.querySelectorAll(".edit-agent-btn").forEach((btn) => {
        btn.addEventListener("click", () => editAgent(btn.dataset.id));
      });
      document.querySelectorAll(".delete-agent-btn").forEach((btn) => {
        btn.addEventListener("click", () => deleteAgent(btn.dataset.id));
      });
    } catch (error) {
      console.error("Error loading agents:", error);
    }
  }

  async function editAgent(agentId) {
    const userDoc = await firebaseDB.collection("users").doc(agentId).get();
    if (!userDoc.exists) return alert("Agent not found");

    const userData = userDoc.data();
    const newRole = prompt(
      `Edit role for ${userData.name} (current: ${userData.role})`,
      userData.role
    );
    if (newRole && newRole !== userData.role) {
      await firebaseDB.collection("users").doc(agentId).update({ role: newRole });
      loadAgents();
    }
  }

  async function deleteAgent(agentId) {
    if (
      confirm("Are you sure you want to delete this agent? This cannot be undone.")
    ) {
      await firebaseDB.collection("users").doc(agentId).delete();
      loadAgents();
    }
  }

  if (addAgentBtn) {
    addAgentBtn.addEventListener("click", async () => {
      const name = prompt("Enter new agent's name:");
      const email = prompt("Enter new agent's email:");
      if (!name || !email) return alert("Name and email are required.");

      await firebaseDB.collection("users").add({
        name,
        email,
        role: "agent",
        createdAt: new Date(),
      });

      loadAgents();
    });
  }

  function updateAdminAnalytics() {
    if (!adminTotalLeadsEl || !adminTotalClientsEl) return;
    adminTotalLeadsEl.textContent = allLeadsSnapshot.length;
    adminTotalClientsEl.textContent = allClientsSnapshot.length;
    const soldCount = allClientsSnapshot.length;
    const unsoldCount = allLeadsSnapshot.length;
    const ctxEl = document.getElementById('admin-sales-chart');
    if (!ctxEl) return;
    const ctx = ctxEl.getContext('2d');
    const data = {
      labels: ['Sold', 'Unsold'],
      datasets: [
        {
          data: [soldCount, unsoldCount],
          backgroundColor: ['#34d399', '#60a5fa'],
          borderColor: ['#34d399', '#60a5fa'],
          borderWidth: 1,
        },
      ],
    };
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#d1d5db',
          },
        },
      },
    };
    if (!adminSalesChart) {
      adminSalesChart = new Chart(ctx, {
        type: 'doughnut',
        data,
        options,
      });
    } else {
      adminSalesChart.data = data;
      adminSalesChart.options = options;
      adminSalesChart.update();
    }
  }

  /* ------------------ Load Analytics ------------------ */
  /**
   * Renders charts for lead sources, agent performance, and sales trends.
   * Supports filtering by date, agent, and product.
   */
  async function loadAnalytics() {
    if (!currentUser || !currentUser.isAdmin) return;

    try {
      // Grab filter values
      const dateFilter = document.getElementById('analytics-date').value;
      const agentFilter = document.getElementById('analytics-agent').value;
      const productFilter = document.getElementById('analytics-product').value;

      // Query leads
      let query = firebaseDB.collection('leads');

      if (agentFilter !== 'all') query = query.where('userId', '==', agentFilter);
      if (productFilter !== 'all') query = query.where('product', '==', productFilter);
      if (dateFilter) {
        const [year, month] = dateFilter.split('-');
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);
        query = query.where('createdAt', '>=', startDate).where('createdAt', '<=', endDate);
      }

      const snapshot = await query.get();
      const leads = snapshot.docs.map((doc) => doc.data());

      /* -------- Lead Sources Chart -------- */
      const leadSources = {};
      leads.forEach((l) => {
        leadSources[l.source] = (leadSources[l.source] || 0) + 1;
      });

      new Chart(document.getElementById('lead-sources-chart'), {
        type: 'pie',
        data: {
          labels: Object.keys(leadSources),
          datasets: [
            {
              data: Object.values(leadSources),
              backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'],
            },
          ],
        },
      });

      /* -------- Agent Performance Chart -------- */
      const agentPerf = {};
      leads.forEach((l) => {
        agentPerf[l.agentName] = (agentPerf[l.agentName] || 0) + 1;
      });

      new Chart(document.getElementById('agent-performance-chart'), {
        type: 'bar',
        data: {
          labels: Object.keys(agentPerf),
          datasets: [
            {
              label: 'Leads',
              data: Object.values(agentPerf),
              backgroundColor: '#3b82f6',
            },
          ],
        },
        options: { responsive: true, plugins: { legend: { display: false } } },
      });

      /* -------- Sales Trends Chart -------- */
      const trends = {};
      leads.forEach((l) => {
        const dateKey = new Date(l.createdAt.toDate()).toLocaleDateString();
        trends[dateKey] = (trends[dateKey] || 0) + 1;
      });

      new Chart(document.getElementById('sales-trends-chart'), {
        type: 'line',
        data: {
          labels: Object.keys(trends),
          datasets: [
            {
              label: 'Leads Over Time',
              data: Object.values(trends),
              borderColor: '#10b981',
              fill: false,
            },
          ],
        },
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  }

  // Expose to global scope for handlers outside this module
  window.loadAnalytics = loadAnalytics;
/* -----------------------------------------------------------------------
 *  Profile + Carrier Modal Logic (Side-by-Side Tailwind version)
 * ---------------------------------------------------------------------*/

// Main Overlay
const overlay = document.getElementById("profileCarrierOverlay");
const profileBtn = document.querySelector('[data-section="profile"]');
const profileModalContent = document.getElementById("profileModalContent");
const carrierModalContent = document.getElementById("carrierModalContent");

// Buttons & Elements
const closeProfile = document.getElementById("closeProfile");
const cancelProfile = document.getElementById("cancelProfile");
const viewCarriersBtn = document.getElementById("viewCarriersBtn");
const closeCarrier = document.getElementById("closeCarrier");
const carrierList = document.getElementById("carrierList");
const carrierInputsContainer = document.getElementById("carrierInputs");
const addCarrierBtn = document.getElementById("addCarrierBtn");
const carrierEditModal = document.getElementById("carrierEditModal");
const carrierEditForm = document.getElementById("carrierEditForm");
const editCarrierName = document.getElementById("editCarrierName");
const editCarrierNotes = document.getElementById("editCarrierNotes");
const cancelEditCarrier = document.getElementById("cancelEditCarrier");

/* -----------------------------------------------------------------------
 *  Create Carrier Input Block
 * ---------------------------------------------------------------------*/
function createCarrierInputGroup(carrier = { name: "", notes: "" }) {
  const wrapper = document.createElement("div");
  wrapper.className = "bg-gray-800 p-3 rounded relative";

  wrapper.innerHTML = `
    <input type="text" class="carrier-name w-full p-2 mb-2 rounded bg-gray-700 text-gray-100" 
           placeholder="Carrier Name" value="${carrier.name || ""}">
    <textarea class="carrier-notes w-full p-2 rounded bg-gray-700 text-gray-100" 
              placeholder="Carrier Notes">${carrier.notes || ""}</textarea>
    <button type="button" 
            class="deleteCarrierBtn absolute top-2 right-2 px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">
      Delete
    </button>
  `;

  // Delete handler
  wrapper.querySelector(".deleteCarrierBtn").addEventListener("click", () => {
    wrapper.remove();
  });

  return wrapper;
}

/* -----------------------------------------------------------------------
 *  Load Profile Info
 * ---------------------------------------------------------------------*/
async function loadUserProfile() {
  if (!currentUser) return;

  try {
    const doc = await firebaseDB.collection("users").doc(currentUser.uid).get();
    if (doc.exists) {
      const data = doc.data();
      document.getElementById("profileName").value = data.name || "";

      // Always start with a single empty carrier input; existing carriers are managed separately
      carrierInputsContainer.innerHTML = "";
      carrierInputsContainer.appendChild(createCarrierInputGroup());

      if (data.profilePic) {
        document.getElementById("profilePreview").src = data.profilePic;
      }
    }
  } catch (err) {
    console.error("Error loading profile:", err);
    showToast("Could not load profile data.", "error");
  }
}

/* -----------------------------------------------------------------------
 *  Add Carrier Button
 * ---------------------------------------------------------------------*/
if (addCarrierBtn) {
  addCarrierBtn.addEventListener("click", () => {
    carrierInputsContainer.appendChild(createCarrierInputGroup());
  });
}

/* -----------------------------------------------------------------------
 *  Open Profile Modal
 * ---------------------------------------------------------------------*/
if (profileBtn) {
  profileBtn.addEventListener("click", () => {
    loadUserProfile();
    overlay.classList.remove("hidden");
    carrierModalContent.classList.add("hidden"); // hide carriers initially
  });
}

/* -----------------------------------------------------------------------
 *  Save Profile Updates
 * ---------------------------------------------------------------------*/
document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentUser) {
    showToast("You must be logged in.", "error");
    return;
  }

  const name = document.getElementById("profileName").value.trim();
  const newPassword = document.getElementById("newPassword").value;
  const fileInput = document.getElementById("profilePic");

  // Collect carriers entered in the profile modal (treated as new additions)
  const newCarriers = [];
  carrierInputsContainer.querySelectorAll("div").forEach(wrapper => {
    const carrierName = wrapper.querySelector(".carrier-name").value.trim();
    const carrierNotes = wrapper.querySelector(".carrier-notes").value.trim();
    if (carrierName || carrierNotes) {
      newCarriers.push({ name: carrierName, notes: carrierNotes });
    }
  });

  try {
    let profilePicUrl = null;

    if (fileInput && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const storageRef = firebase.storage().ref(`profilePics/${currentUser.uid}`);
      await storageRef.put(file);
      profilePicUrl = await storageRef.getDownloadURL();
    }

    const updates = { name, ...(profilePicUrl ? { profilePic: profilePicUrl } : {}) };

    if (newCarriers.length > 0) {
      const userDoc = await firebaseDB.collection("users").doc(currentUser.uid).get();
      const existing = userDoc.exists && Array.isArray(userDoc.data().carriers) ? userDoc.data().carriers : [];
      updates.carriers = existing.concat(newCarriers);
    }

    await firebaseDB.collection("users").doc(currentUser.uid).set(updates, { merge: true });

    if (newPassword) {
      try {
        await currentUser.updatePassword(newPassword);
        showToast("Password updated successfully!");
      } catch (err) {
        if (err.code === "auth/requires-recent-login") {
          showToast("Please re-login before changing password.", "error");
        } else {
          showToast("Password update failed: " + err.message, "error");
        }
      }
    }

    // Clear carrier inputs so they don't remain on the profile modal
    carrierInputsContainer.innerHTML = "";
    carrierInputsContainer.appendChild(createCarrierInputGroup());

    // Refresh carrier list in case the modal is open
    loadCarrierList();

    showToast("Profile updated successfully!");
    overlay.classList.add("hidden");

  } catch (err) {
    console.error("Error saving profile:", err);
    showToast("Could not update profile. Try again.", "error");
  }
});

/* -----------------------------------------------------------------------
 *  Carrier Modal Logic (opens next to profile)
 * ---------------------------------------------------------------------*/
async function loadCarrierList() {
  if (!currentUser) return;
  try {
    const userDoc = await firebaseDB.collection("users").doc(currentUser.uid).get();
    if (userDoc.exists) {
      const data = userDoc.data();
      const carriers = Array.isArray(data.carriers) ? data.carriers : [];
      carriersData = carriers;

      carrierList.innerHTML = "";

      if (carriers.length > 0) {
        carriers.forEach((carrier, index) => {
          const li = document.createElement("li");
          li.className = "bg-gray-800 p-3 rounded shadow";
          li.innerHTML = `
            <strong>${carrier.name}</strong><br>
            <span class="text-sm text-gray-400">${carrier.notes || "No notes provided"}</span>
            <div class="mt-2 space-x-2">
              <button data-index="${index}" class="editCarrierBtn px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs">Edit</button>
              <button data-index="${index}" class="removeCarrierBtn px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs">Delete</button>
            </div>
          `;
          carrierList.appendChild(li);
        });

        // Delete handlers
        carrierList.querySelectorAll('.removeCarrierBtn').forEach(btn => {
          btn.addEventListener('click', async () => {
            const idx = parseInt(btn.dataset.index, 10);
            carriersData.splice(idx, 1);
            await firebaseDB.collection("users").doc(currentUser.uid).update({ carriers: carriersData });
            loadCarrierList();
          });
        });

        // Edit handlers
        carrierList.querySelectorAll('.editCarrierBtn').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index, 10);
            editingCarrierIndex = idx;
            const currentCarrier = carriersData[idx];
            editCarrierName.value = currentCarrier.name || '';
            editCarrierNotes.value = currentCarrier.notes || '';
            carrierEditModal.classList.remove('hidden');
            gsap.fromTo('#carrierEditModal > div', { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 0.3 });
          });
        });
      } else {
        carrierList.innerHTML = `<li class="text-gray-400">No carriers saved yet.</li>`;
      }
    }
  } catch (err) {
    console.error("Error loading carriers:", err);
    carrierList.innerHTML = `<li class="text-red-400">Failed to load carriers.</li>`;
  }
}

if (viewCarriersBtn) {
  viewCarriersBtn.addEventListener("click", async () => {
    if (!currentUser) {
      showToast("Please log in first.", "error");
      return;
    }

    await loadCarrierList();
    carrierModalContent.classList.remove("hidden");
  });
}

if (carrierEditForm) {
  carrierEditForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (editingCarrierIndex === null) return;
    const updated = {
      name: editCarrierName.value.trim(),
      notes: editCarrierNotes.value.trim()
    };
    carriersData[editingCarrierIndex] = updated;
    await firebaseDB.collection("users").doc(currentUser.uid).update({ carriers: carriersData });
    gsap.to('#carrierEditModal > div', {
      opacity: 0,
      y: -50,
      duration: 0.2,
      onComplete: () => {
        carrierEditModal.classList.add('hidden');
      }
    });
    editingCarrierIndex = null;
    loadCarrierList();
  });
}

if (cancelEditCarrier) {
  cancelEditCarrier.addEventListener('click', () => {
    gsap.to('#carrierEditModal > div', {
      opacity: 0,
      y: -50,
      duration: 0.2,
      onComplete: () => {
        carrierEditModal.classList.add('hidden');
        editingCarrierIndex = null;
      }
    });
  });
}

/* -----------------------------------------------------------------------
 *  Close Logic
 * ---------------------------------------------------------------------*/
if (closeProfile) {
  closeProfile.addEventListener("click", () => overlay.classList.add("hidden"));
}
if (cancelProfile) {
  cancelProfile.addEventListener("click", () => overlay.classList.add("hidden"));
}
if (closeCarrier) {
  closeCarrier.addEventListener("click", () => carrierModalContent.classList.add("hidden"));
}
window.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.classList.add("hidden");
  }
});

  /* -----------------------------------------------------------------------
   *  Admin Event Listeners
   *
   *  Provide UI interactivity for the admin dashboard. These listeners
   *  handle opening and closing the agent modal, saving agent
   *  information, editing/deleting agents, and exporting all leads.
   */
  // Open the user modal for creating a new agent
  if (addUserBtn) {
    addUserBtn.addEventListener('click', () => {
      editingUserId = null;
      if (userForm) userForm.reset();
      if (userModal) {
        userModal.classList.remove('hidden');
        // Animate modal entrance for a polished feel
        gsap.fromTo(
          '#user-modal > div',
          { opacity: 0, y: -50 },
          { opacity: 1, y: 0, duration: 0.3 }
        );
      }
    });
  }
  // Cancel/close the user modal
  if (cancelUserBtn) {
    cancelUserBtn.addEventListener('click', () => {
      if (userModal) userModal.classList.add('hidden');
      editingUserId = null;
    });
  }
  // Save agent (create or update)
  if (userForm) {
    userForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = userEmail ? userEmail.value.trim() : '';
      const password = userPassword ? userPassword.value.trim() : '';
      const nameVal = userNameEl ? userNameEl.value.trim() : '';
      const roleVal = userRoleEl ? userRoleEl.value : 'agent';
      if (!email) {
        showToast('Email is required.', 'error');
        return;
      }
      try {
        if (editingUserId) {
          // Update existing document
          const updateData = { email, name: nameVal, role: roleVal };
          if (password) {
            updateData.password = password;
          }
          await firebaseDB.collection('users').doc(editingUserId).set(updateData, { merge: true });
          showToast('Agent updated successfully!');
        } else {
          // Create new user document
          const newData = { email, name: nameVal, role: roleVal };
          if (password) {
            newData.password = password;
          }
          await firebaseDB.collection('users').add(newData);
          showToast('Agent created successfully!');
        }
        if (userForm) userForm.reset();
        editingUserId = null;
        if (userModal) userModal.classList.add('hidden');
      } catch (err) {
        console.error('Failed to save user', err);
        showToast('Could not save agent.', 'error');
      }
    });
  }
  // Handle edit/delete clicks on the user table
  if (adminUsersTableBody) {
    adminUsersTableBody.addEventListener('click', async (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const id = btn.getAttribute('data-id');
      const action = btn.getAttribute('data-action');
      if (!id || !action) return;
      if (action === 'edit-user') {
        const user = usersSnapshot.find((u) => u.id === id);
        if (!user) return;
        editingUserId = id;
        if (userEmail) userEmail.value = user.email || '';
        if (userPassword) userPassword.value = '';
        if (userNameEl) userNameEl.value = user.name || '';
        if (userRoleEl) userRoleEl.value = user.role || 'agent';
        if (userModal) {
          userModal.classList.remove('hidden');
          gsap.fromTo(
            '#user-modal > div',
            { opacity: 0, y: -50 },
            { opacity: 1, y: 0, duration: 0.3 }
          );
        }
      } else if (action === 'delete-user') {
        if (confirm('Delete this agent?')) {
          try {
            await firebaseDB.collection('users').doc(id).delete();
            showToast('Agent deleted.');
          } catch (err) {
            console.error('Delete user failed', err);
            showToast('Could not delete agent.', 'error');
          }
        }
      }
    });
  }
  // Export all leads across agents as CSV
  if (exportAllLeadsBtn) {
    exportAllLeadsBtn.addEventListener('click', async () => {
      const rows = [
        [
          'First Name',
          'Last Name',
          'DOB',
          'Age',
          'Phone',
          'Medicare #',
          'SSN',
          'Plan',
          'Sunfire Code',
          'Medications',
          'Doctors',
          'Callback',
          'Notes',
          'Created At',
          'Agent ID',
        ],
      ];
      allLeadsSnapshot.forEach((lead) => {
        rows.push([
          lead.firstName || '',
          lead.lastName || '',
          lead.dob || '',
          lead.age || '',
          lead.phone || '',
          lead.medicare || '',
          lead.ssn || '',
          lead.plan || '',
          lead.sunfire || '',
          lead.medications || '',
          lead.doctors || '',
          lead.callback ? new Date(lead.callback).toLocaleString() : '',
          (lead.notes || '').replace(/\n/g, ' '),
          lead.createdAt && lead.createdAt.toDate ? lead.createdAt.toDate().toLocaleString() : '',
          lead.userId || '',
        ]);
      });
      const csvContent = rows
        .map((r) => r.map((field) => '"' + field.replace(/"/g, '""') + '"').join(','))
        .join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `all_leads_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Export all clients across agents as CSV (admin)
  if (exportAllClientsBtn) {
    exportAllClientsBtn.addEventListener('click', async () => {
      const rows = [
        [
          'First Name',
          'Last Name',
          'DOB',
          'Age',
          'Phone',
          'Plan Sold',
          'Ancillary Plan',
          'Ancillary Date',
          'Effective Date',
          'Notes',
          'Sold At',
          'Agent ID',
        ],
      ];
      if (typeof allClientsSnapshot !== 'undefined' && allClientsSnapshot.length) {
        allClientsSnapshot.forEach((client) => {
          rows.push([
            client.firstName || '',
            client.lastName || '',
            client.dob || '',
            client.age || '',
            client.phone || '',
            client.planSold || client.plan || '',
            client.ancillaryPlan || '',
            client.ancillaryDate || '',
            client.effectiveDate || '',
            (client.notes || '').replace(/\n/g, ' '),
            client.soldAt && client.soldAt.toDate ? client.soldAt.toDate().toLocaleString() : '',
            client.userId || '',
          ]);
        });
      }
      const csvContent = rows
        .map((r) => r.map((field) => '"' + String(field).replace(/"/g, '""') + '"').join(','))
        .join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `all_clients_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Clients CSV exported.');
    });
  }

  // Export all notes across agents as CSV (admin)
  if (exportAllNotesBtn) {
    exportAllNotesBtn.addEventListener('click', async () => {
      const rows = [
        ['User ID', 'Note', 'Created At'],
      ];
      try {
        const snapshot = await firebaseDB.collection('notes').orderBy('createdAt', 'desc').get();
        snapshot.forEach((doc) => {
          const note = doc.data();
          rows.push([
            note.userId || '',
            (note.text || '').replace(/\n/g, ' '),
            note.createdAt && note.createdAt.toDate ? note.createdAt.toDate().toLocaleString() : '',
          ]);
        });
        const csvContent = rows
          .map((r) => r.map((field) => '"' + String(field).replace(/"/g, '""') + '"').join(','))
          .join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `all_notes_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Notes CSV exported.');
      } catch (err) {
        console.error('Export notes failed', err);
        showToast('Could not export notes.', 'error');
      }
    });
  }

/* -----------------------------------------------------------------------
 *  Toast Notifications
 * ---------------------------------------------------------------------*/
function showToast(message, type="success") {
  const toast = document.createElement("div");
  toast.className = `fixed bottom-5 right-5 px-4 py-2 rounded-lg text-white shadow-lg 
                     ${type === "success" ? "bg-green-600" : "bg-red-600"}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}




  /* -----------------------------------------------------------------------
   *  Initialization
   */
  // Show dashboard by default; auth listener will override for logged out users
  // Load tasks from localStorage on startup
  loadTasks();
  // Initialize analytics with empty data
  updateAnalytics();
  // Show dashboard by default; auth listener will override for logged out users
showSection('dashboard');
})();

// Analytics filter apply handler
const analyticsApplyBtn = document.getElementById('analytics-apply');
if (analyticsApplyBtn) {
  analyticsApplyBtn.addEventListener('click', () => {
    loadAnalytics();
  });
}
// Ensure a semicolon here so that the immediately following IIFE is not
// accidentally treated as an argument to the previous call due to
// JavaScript's automatic semicolon insertion rules.
;

/*
 * -----------------------------------------------------------------------
 *  Admin Dashboard Integration
 *
 *  The stand‑alone admin dashboard (`admin.html`) previously relied on a
 *  separate `admin.js` file for its functionality.  To simplify the
 *  deployment and allow all pages to run off of a single script, the
 *  admin dashboard logic has been folded into this file.  The code
 *  below executes only when the admin dashboard's sidebar element is
 *  present on the page (`#admin-sidebar`).  It reproduces the data
 *  seeding, navigation and rendering logic from the original admin
 *  module.  If your project does not include `admin.html`, this code
 *  will have no effect.
 */

(() => {
  // Detect if we are on the admin dashboard by checking for the sidebar
  if (!document.getElementById('admin-sidebar')) return;

  /**
   * Cache DOM elements up front.  These selectors mirror those used in
   * the original admin dashboard.  If you modify the admin HTML
   * structure, update these queries accordingly.
   */
  const navButtons = document.querySelectorAll('.admin-nav-btn');
  const sections = document.querySelectorAll('.admin-section');
  const adminContentEl = document.getElementById('admin-content');
  const adminOverviewEl = document.getElementById('admin-overview');
  // Use a local Firebase auth instance for admin functions.  If the
  // Firebase SDK is not available (e.g. when working offline or
  // Firebase scripts failed to load), fall back to a stub object so
  // the rest of the admin dashboard logic can run without errors.
  const firebaseAuth = (typeof firebase !== 'undefined' && firebase.auth) ? firebase.auth() : {
    // Provide a no‑op signOut method so calls to signOut() do not
    // throw.  Additional methods can be stubbed here if needed.
    async signOut() {
      return Promise.resolve();
    },
  };
  // Overview stats elements
  const overviewTotalLeadsEl = document.getElementById('overview-total-leads');
  const overviewTotalClientsEl = document.getElementById('overview-total-clients');
  const overviewTopAgentEl = document.getElementById('overview-top-agent');
  // User management table body and activity logs
  const usersTableBody = document.getElementById('users-table-body');
  const userActivityLogsEl = document.getElementById('user-activity-logs');
  // Client/Lead oversight table body
  const adminLeadsTableBody = document.getElementById('admin-leads-table-body');
  // Analytics elements
  const analyticsTotalLeadsEl = document.getElementById('admin-analytics-total-leads');
  const analyticsTotalAppsEl = document.getElementById('admin-analytics-total-apps');
  const analyticsTotalPoliciesEl = document.getElementById('admin-analytics-total-policies');
  const agentLeaderboardEl = document.getElementById('agent-leaderboard');
  // Messaging and tasks
  const messagesListEl = document.getElementById('messages-list');
  const messageInputEl = document.getElementById('message-input');
  const sendMessageBtn = document.getElementById('send-message');
  const adminTasksListEl = document.getElementById('admin-tasks-list');
  const newTaskTitleEl = document.getElementById('new-task-title');
  const addAdminTaskBtn = document.getElementById('add-admin-task');
  // Alerts section
  const alertsListEl = document.getElementById('alerts-list');
  // Docs section
  const docsListEl = document.getElementById('docs-list');
  // Keep some in‑memory arrays for demonstration
  let users = [];
  let activityLogs = [];
  let leads = [];
  let messages = [];
  let tasks = [];
  let docs = [];

  /**
   * Utility to show a given section and hide all others.  It also
   * highlights the active navigation button based on the data target.
   *
   * @param {string} sectionId The section identifier (e.g. 'overview')
   */
  function adminShowSection(sectionId) {
    if (sectionId === 'overview') {
      if (adminOverviewEl) adminOverviewEl.classList.remove('hidden');
      if (adminContentEl) adminContentEl.classList.add('hidden');
      sections.forEach((section) => section.classList.add('hidden'));
    } else {
      if (adminOverviewEl) adminOverviewEl.classList.add('hidden');
      if (adminContentEl) adminContentEl.classList.remove('hidden');
      sections.forEach((section) => {
        if (section.id === `${sectionId}-section` || section.id === sectionId) {
          section.classList.remove('hidden');
        } else {
          section.classList.add('hidden');
        }
      });
    }
    navButtons.forEach((btn) => {
      if (btn.dataset.target === sectionId) {
        btn.classList.add('bg-gray-700');
      } else {
        btn.classList.remove('bg-gray-700');
      }
    });
  }

  /**
   * Populate the overview cards with aggregate counts.  Replace the
   * dummy values below with real data from your backend as needed.
   */
  function updateOverview() {
    const totalLeads = leads.length;
    const totalClients = leads.filter((l) => l.status === 'Client').length;
    if (overviewTotalLeadsEl) overviewTotalLeadsEl.textContent = totalLeads.toString();
    if (overviewTotalClientsEl) overviewTotalClientsEl.textContent = totalClients.toString();
    // Determine top agent by number of leads assigned
    const agentCounts = {};
    leads.forEach((l) => {
      agentCounts[l.agent] = (agentCounts[l.agent] || 0) + 1;
    });
    const topAgent = Object.entries(agentCounts).sort((a, b) => b[1] - a[1])[0];
    if (overviewTopAgentEl) overviewTopAgentEl.textContent = topAgent ? topAgent[0] : '—';
  }

  /**
   * Render the user management table and activity logs.  In a real app
   * you would fetch this data from your database.
   */
  function renderUsers() {
    if (!usersTableBody) return;
    usersTableBody.innerHTML = '';
    users.forEach((user) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="py-2 px-3">${user.name}</td>
        <td class="py-2 px-3">${user.email}</td>
        <td class="py-2 px-3">${user.role}</td>
        <td class="py-2 px-3">${user.active ? 'Active' : 'Inactive'}</td>
        <td class="py-2 px-3 space-x-2">
          <button class="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs">Edit</button>
          <button class="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs">Disable</button>
        </td>
      `;
      usersTableBody.appendChild(tr);
    });
    // Render activity logs
    if (userActivityLogsEl) {
      userActivityLogsEl.innerHTML = '';
      activityLogs.forEach((log) => {
        const div = document.createElement('div');
        div.textContent = log;
        userActivityLogsEl.appendChild(div);
      });
    }
  }

  /**
   * Render the lead oversight table.  This function merges leads and
   * clients into a single view.  Replace this logic with your own.
   */
  function renderLeads() {
    if (!adminLeadsTableBody) return;
    adminLeadsTableBody.innerHTML = '';
    leads.forEach((lead) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="py-2 px-3">${lead.name}</td>
        <td class="py-2 px-3">${lead.dob}</td>
        <td class="py-2 px-3">${lead.status}</td>
        <td class="py-2 px-3">${lead.agent}</td>
        <td class="py-2 px-3">${lead.lastContact}</td>
        <td class="py-2 px-3 space-x-2">
          <button class="px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs">View</button>
          <button class="px-2 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs">Reassign</button>
        </td>
      `;
      adminLeadsTableBody.appendChild(tr);
    });
  }

  /**
   * Render the messages list.  Newest messages appear at the bottom.
   */
  function renderMessages() {
    if (!messagesListEl) return;
    messagesListEl.innerHTML = '';
    messages.forEach((msg) => {
      const div = document.createElement('div');
      div.className = 'px-2 py-1 rounded bg-gray-700 mb-1';
      div.textContent = msg;
      messagesListEl.appendChild(div);
    });
  }

  /**
   * Render the tasks list.  Completed tasks can be ticked off (not
   * implemented fully here).
   */
  function renderTasks() {
    if (!adminTasksListEl) return;
    adminTasksListEl.innerHTML = '';
    tasks.forEach((task, idx) => {
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between px-2 py-1 bg-gray-700 rounded';
      li.innerHTML = `
        <span>${task}</span>
        <button class="text-xs text-red-400" data-index="${idx}">Remove</button>
      `;
      adminTasksListEl.appendChild(li);
    });
  }

  /**
   * Render uploaded document list.  This just displays file names stored
   * locally; you could integrate it with cloud storage.
   */
  function renderDocs() {
    if (!docsListEl) return;
    docsListEl.innerHTML = '';
    docs.forEach((file) => {
      const div = document.createElement('div');
      div.className = 'px-2 py-1 rounded bg-gray-700 mb-1';
      div.textContent = file.name;
      docsListEl.appendChild(div);
    });
  }

  /**
   * Bind event listeners for navigation and interactive elements.
   */
  function bindEvents() {
    navButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        adminShowSection(btn.dataset.target);
        // On switching to analytics, rerender charts
        if (btn.dataset.target === 'admin-analytics') {
          loadAnalytics();
        }
        if (btn.dataset.target === 'admin-manage-agents') {
          loadAgents();
        }
      });
    });

    // Add new user to the table with dummy values
    const addUserBtn = document.getElementById('add-user');
    if (addUserBtn) {
      addUserBtn.addEventListener('click', () => {
        const id = users.length + 1;
        users.push({
          name: `Agent ${id}`,
          email: `agent${id}@example.com`,
          role: id % 3 === 0 ? 'Manager' : 'Agent',
          active: true,
        });
        activityLogs.unshift(`Created new user Agent ${id}`);
        renderUsers();
      });
    }

    // Messaging
    if (sendMessageBtn && messageInputEl) {
      sendMessageBtn.addEventListener('click', () => {
        const msg = messageInputEl.value.trim();
        if (!msg) return;
        messages.push(msg);
        messageInputEl.value = '';
        renderMessages();
      });
    }

    // Tasks
    if (addAdminTaskBtn && newTaskTitleEl) {
      addAdminTaskBtn.addEventListener('click', () => {
        const t = newTaskTitleEl.value.trim();
        if (!t) return;
        tasks.push(t);
        newTaskTitleEl.value = '';
        renderTasks();
      });
    }
    // Remove task on click of remove button
    if (adminTasksListEl) {
      adminTasksListEl.addEventListener('click', (e) => {
        if (e.target && e.target.dataset.index !== undefined) {
          const idx = parseInt(e.target.dataset.index, 10);
          tasks.splice(idx, 1);
          renderTasks();
        }
      });
    }

    // Alerts triggers (placeholder)
    const triggerAlertsBtn = document.getElementById('trigger-alerts');
    if (triggerAlertsBtn) {
      triggerAlertsBtn.addEventListener('click', () => {
        const stale = leads.filter(
          (l) => new Date(l.lastContact) < new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        );
        if (alertsListEl) alertsListEl.innerHTML = '';
        stale.forEach((l) => {
          const div = document.createElement('div');
          div.className = 'px-2 py-1 bg-gray-700 rounded mb-1';
          div.textContent = `${l.name} has not been contacted in over 3 days.`;
          if (alertsListEl) alertsListEl.appendChild(div);
        });
      });
    }
    const triggerRenewalsBtn = document.getElementById('trigger-renewals');
    if (triggerRenewalsBtn) {
      triggerRenewalsBtn.addEventListener('click', () => {
        const upcoming = leads.filter(
          (l) => new Date(l.renewal) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        );
        if (alertsListEl) alertsListEl.innerHTML = '';
        upcoming.forEach((l) => {
          const div = document.createElement('div');
          div.className = 'px-2 py-1 bg-gray-700 rounded mb-1';
          div.textContent = `${l.name}'s policy renewal is coming up soon.`;
          if (alertsListEl) alertsListEl.appendChild(div);
        });
      });
    }

    // Document uploads
    const uploadDocsInput = document.getElementById('upload-docs');
    if (uploadDocsInput) {
      uploadDocsInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        files.forEach((file) => docs.push(file));
        renderDocs();
        // Reset the input so same file can be uploaded again if needed
        uploadDocsInput.value = '';
      });
    }

    // Example: run risk assessment (placeholder)
    const runRiskBtn = document.getElementById('run-risk-score');
    if (runRiskBtn) {
      runRiskBtn.addEventListener('click', () => {
        alert('Running client risk scoring... (placeholder)');
      });
    }
    // Export buttons (placeholders)
    const exportCsvBtn = document.getElementById('export-csv');
    if (exportCsvBtn) {
      exportCsvBtn.addEventListener('click', () => {
        alert('Exporting CSV... (placeholder)');
      });
    }
    const exportPdfBtn = document.getElementById('export-pdf');
    if (exportPdfBtn) {
      exportPdfBtn.addEventListener('click', () => {
        alert('Exporting PDF... (placeholder)');
      });
    }
  }

  /**
   * Populate some dummy data on initial load so that the dashboard
   * doesn't appear empty.  Replace this with calls to your backend.
   */
  function seedDummyData() {
    users = [
      { name: 'Alice Johnson', email: 'alice@example.com', role: 'Agent', active: true },
      { name: 'Bob Smith', email: 'bob@example.com', role: 'Manager', active: true },
    ];
    activityLogs = ['Alice logged in', 'Bob updated a lead'];
    leads = [
      {
        name: 'John Doe',
        dob: '1950-01-01',
        status: 'Lead',
        agent: 'Alice Johnson',
        lastContact: '2025-07-28',
        renewal: '2025-08-15',
      },
      {
        name: 'Jane Smith',
        dob: '1955-05-10',
        status: 'Application',
        agent: 'Bob Smith',
        lastContact: '2025-07-30',
        renewal: '2025-09-01',
      },
      {
        name: 'Bill Davis',
        dob: '1947-11-23',
        status: 'Client',
        agent: 'Alice Johnson',
        lastContact: '2025-07-25',
        renewal: '2025-08-05',
      },
    ];
    messages = ['Welcome to the admin dashboard!'];
    tasks = ['Review new leads'];
  }

  /**
   * Initialise the dashboard on page load.  This seeds dummy data,
   * binds event listeners, and displays the initial section.
   */
  function initAdmin() {
    seedDummyData();
    renderUsers();
    renderLeads();
    loadAnalytics();
    renderMessages();
    renderTasks();
    renderDocs();
    updateOverview();
    bindEvents();
    // Default to Overview section
    adminShowSection('overview');
  }

  // Run the admin initialisation once the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdmin);
  } else {
    initAdmin();
  }
  
})();
