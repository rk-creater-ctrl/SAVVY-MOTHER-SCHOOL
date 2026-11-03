/**
 * Savvy Mother School (Rewa) - School Management Integration
 * Connects website forms (Admission, Enquiry, Contact) to the School Management Backend
 * and adds Portal Login links to the navigation dropdown.
 */

(function () {
  // Configuration with fallback defaults
  const config = window.SAVVY_ERP_CONFIG || {};
  const API_BASE_URL =
    config.apiBaseUrl ||
    window.SAVVY_FORM_ENDPOINT ||
    "https://savvy-school-management-backend.onrender.com/api";
  const LOGIN_URL =
    config.loginUrl ||
    window.SCHOOL_MANAGEMENT_LOGIN_URL ||
    "https://savvy-school-management-dashboard.vercel.app/login";

  // 1. Inject Styles for Navigation Login Links
  function injectStyles() {
    if (document.getElementById("savvy-erp-nav-styles")) return;
    const style = document.createElement("style");
    style.id = "savvy-erp-nav-styles";
    style.textContent = `
      .erp-nav-divider {
        height: 1px;
        margin: 8px 6px;
        background: rgba(167, 25, 48, 0.15);
      }
      .erp-portal-actions {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 4px 0 2px 0;
      }
      .erp-portal-link {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 9px 14px;
        border-radius: 8px;
        font-family: 'Manrope', sans-serif;
        font-size: 13px;
        font-weight: 700;
        text-decoration: none;
        color: #ffffff !important;
        background: linear-gradient(135deg, #a71930, #711020);
        box-shadow: 0 4px 14px rgba(167, 25, 48, 0.25);
        transition: all 0.22s ease;
      }
      .erp-portal-link:hover {
        background: linear-gradient(135deg, #c62b45, #8a1327);
        transform: translateY(-1px);
        box-shadow: 0 6px 18px rgba(167, 25, 48, 0.35);
      }
      .erp-portal-link.secondary {
        background: #fffdf8;
        color: #711020 !important;
        border: 1.5px solid #a71930;
        box-shadow: none;
      }
      .erp-portal-link.secondary:hover {
        background: #fff1bd;
        color: #711020 !important;
      }
      .erp-submitting {
        opacity: 0.65;
        pointer-events: none;
        cursor: wait !important;
      }
    `;
    document.head.appendChild(style);
  }

  // 2. Inject Portal Login links into Navigation
  function initNavLoginLinks() {
    const portalMenus = document.querySelectorAll(
      ".portal-dropdown-menu, .nav-portal-dropdown .nav-dropdown-menu, .nav-parent-dropdown"
    );

    portalMenus.forEach((menu) => {
      if (menu.querySelector(".erp-portal-actions")) return;

      const divider = document.createElement("div");
      divider.className = "erp-nav-divider";
      menu.appendChild(divider);

      const actionWrap = document.createElement("div");
      actionWrap.className = "erp-portal-actions";

      const staffLink = document.createElement("a");
      staffLink.className = "erp-portal-link";
      staffLink.href = LOGIN_URL;
      staffLink.target = "_blank";
      staffLink.rel = "noopener noreferrer";
      staffLink.innerHTML = `<i class="fa-solid fa-lock"></i> Admin / Staff Login`;

      const studentLink = document.createElement("a");
      studentLink.className = "erp-portal-link secondary";
      studentLink.href = LOGIN_URL;
      studentLink.target = "_blank";
      studentLink.rel = "noopener noreferrer";
      studentLink.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Student & Parent Portal`;

      actionWrap.appendChild(staffLink);
      actionWrap.appendChild(studentLink);
      menu.appendChild(actionWrap);
    });
  }

  // 3. Helper to Post Lead to API
  async function submitLead(leadData) {
    const endpoint = `${API_BASE_URL.replace(/\/+$/, "")}/website-leads`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      console.warn("ERP lead dispatch notice:", err.message);
      return { success: false, offline: true, error: err.message };
    }
  }

  // 4. Connect Admission Form
  function initAdmissionForm() {
    const form = document.getElementById("onlineAdmissionForm");
    if (!form || form.dataset.erpBound) return;
    form.dataset.erpBound = "true";

    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) {
        submitBtn.classList.add("erp-submitting");
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting Application...`;
      }

      // Collect form data
      const inputs = form.querySelectorAll("input, select, textarea");
      const payload = {};
      inputs.forEach((input) => {
        const key =
          input.name ||
          input.id ||
          input.getAttribute("placeholder") ||
          input.previousElementSibling?.textContent?.trim() ||
          "field_" + Math.random().toString(36).slice(2, 6);
        if (input.value) payload[key] = input.value.trim();
      });

      // Map core fields
      const childName =
        form.querySelector('input[placeholder*="Aarav Sharma"]')?.value?.trim() ||
        payload["Student's Full Name *"] ||
        "";
      const fatherName =
        form.querySelector('input[placeholder*="Rajesh Sharma"]')?.value?.trim() ||
        payload["Father's Name *"] ||
        "";
      const motherName =
        form.querySelector('input[placeholder*="Sunita Sharma"]')?.value?.trim() ||
        payload["Mother's Name *"] ||
        "";
      const phone =
        form.querySelector('input[type="tel"]')?.value?.trim() ||
        payload["Primary Contact Mobile (WhatsApp) *"] ||
        "";
      const email =
        form.querySelector('input[type="email"]')?.value?.trim() ||
        payload["Email Address *"] ||
        "";
      const classSelect = form.querySelector("select");
      const className = classSelect ? classSelect.value : "";

      const leadData = {
        source: "savvy-mother-school-rewa",
        formType: "admission",
        childName: childName,
        parentName: fatherName || motherName,
        className: className,
        phone: phone,
        email: email,
        subject: `Online Admission Application: ${childName} (${className})`,
        payload: {
          ...payload,
          fatherName,
          motherName,
          submissionDate: new Date().toISOString(),
          portal: "Savvy Mother International School (Rewa)",
        },
      };

      await submitLead(leadData);

      // Show success message
      const successMsg = document.getElementById("admSuccessMsg");
      if (successMsg) {
        successMsg.style.display = "block";
        window.scrollTo({
          top: successMsg.offsetTop - 120,
          behavior: "smooth",
        });
      }

      form.reset();

      if (submitBtn) {
        submitBtn.classList.remove("erp-submitting");
        submitBtn.innerHTML = origText;
      }
    });
  }

  // 5. Connect Inquiry Form
  function initInquiryForm() {
    const form = document.getElementById("inquiryForm");
    if (!form || form.dataset.erpBound) return;
    form.dataset.erpBound = "true";

    form.removeAttribute("onsubmit");
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) {
        submitBtn.classList.add("erp-submitting");
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting Inquiry...`;
      }

      const childName =
        document.getElementById("childName")?.value?.trim() ||
        form.querySelector('input[name="childName"]')?.value?.trim() ||
        "";
      const parentName =
        document.getElementById("parentName")?.value?.trim() ||
        form.querySelector('input[name="parentName"]')?.value?.trim() ||
        "";
      const phone =
        document.getElementById("phone")?.value?.trim() ||
        form.querySelector('input[type="tel"]')?.value?.trim() ||
        "";
      const email =
        document.getElementById("email")?.value?.trim() ||
        form.querySelector('input[type="email"]')?.value?.trim() ||
        "";
      const grade =
        document.getElementById("grade")?.value ||
        form.querySelector("select")?.value ||
        "";
      const message =
        document.getElementById("message")?.value?.trim() ||
        form.querySelector("textarea")?.value?.trim() ||
        "";

      const leadData = {
        source: "savvy-mother-school-rewa",
        formType: "enquiry",
        childName: childName,
        parentName: parentName,
        className: grade,
        phone: phone,
        email: email,
        message: message,
        subject: `Campus Inquiry: ${childName || parentName} (${grade || "General"})`,
        payload: {
          childName,
          parentName,
          phone,
          email,
          grade,
          message,
          submissionDate: new Date().toISOString(),
        },
      };

      await submitLead(leadData);

      const successMsg =
        document.getElementById("successMessage") ||
        document.getElementById("inquirySuccess");
      if (successMsg) {
        successMsg.style.display = "block";
      }

      form.reset();

      if (submitBtn) {
        submitBtn.classList.remove("erp-submitting");
        submitBtn.innerHTML = origText;
      }
    });
  }

  // 6. Connect Contact Form
  function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form || form.dataset.erpBound) return;
    form.dataset.erpBound = "true";

    form.removeAttribute("onsubmit");
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) {
        submitBtn.classList.add("erp-submitting");
        submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...`;
      }

      const name =
        document.getElementById("cName")?.value?.trim() ||
        form.querySelector('input[name="name"]')?.value?.trim() ||
        "";
      const email =
        document.getElementById("cEmail")?.value?.trim() ||
        form.querySelector('input[type="email"]')?.value?.trim() ||
        "";
      const phone =
        document.getElementById("cPhone")?.value?.trim() ||
        form.querySelector('input[type="tel"]')?.value?.trim() ||
        "";
      const subject =
        document.getElementById("cSubject")?.value?.trim() ||
        "Website Contact Message";
      const message =
        document.getElementById("cMessage")?.value?.trim() ||
        form.querySelector("textarea")?.value?.trim() ||
        "";

      const leadData = {
        source: "savvy-mother-school-rewa",
        formType: "contact",
        parentName: name,
        phone: phone,
        email: email,
        subject: subject || `Contact Inquiry from ${name}`,
        message: message,
        payload: {
          name,
          email,
          phone,
          subject,
          message,
          submissionDate: new Date().toISOString(),
        },
      };

      await submitLead(leadData);

      const successMsg = document.getElementById("contactSuccess");
      if (successMsg) {
        successMsg.style.display = "block";
      }

      form.reset();

      if (submitBtn) {
        submitBtn.classList.remove("erp-submitting");
        submitBtn.innerHTML = origText;
      }
    });
  }

  // Initialize all connections on DOM ready
  function init() {
    injectStyles();
    initNavLoginLinks();
    initAdmissionForm();
    initInquiryForm();
    initContactForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
