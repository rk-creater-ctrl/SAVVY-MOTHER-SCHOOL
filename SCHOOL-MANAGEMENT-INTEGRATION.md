# Savvy Mother School (Rewa) - ERP & Management Integration

This website is integrated with the **Savvy Mother School Management System (Rewa Branch)**.

---

## 1. Features Integrated
1. **Portal Login in Navigation:**
   - Automatically injects **Admin / Staff Login** and **Student & Parent Portal** action buttons into the `.portal-dropdown-menu` and mobile navigation.
2. **Online Admission Form:**
   - Intercepts submissions on `admission-form.html` (`#onlineAdmissionForm`) and transmits all student particulars, parent contact details, and grade selection directly to `/api/website-leads` as an admission application.
3. **Campus Inquiry Form:**
   - Intercepts submissions on `admissions/inquiry.html` (`#inquiryForm`) and transmits prospective student inquiries.
4. **Contact Form:**
   - Intercepts submissions on `contact.html` (`#contactForm`) and routes messages into the admin dashboard leads pipeline.

---

## 2. Configuration (Optional Override)

By default, the integration connects to the production endpoints. To override the backend or dashboard login URL (e.g. during local development or when switching custom domains), place this snippet inside the `<head>` of any page **before** `script.js`:

```html
<script>
  window.SAVVY_ERP_CONFIG = {
    // URL of your Express API backend (e.g. Render / Cloudflare)
    apiBaseUrl: "https://your-backend-domain.onrender.com/api",

    // URL of your Admin / Parent Dashboard (e.g. Vercel / Cloudflare Pages)
    loginUrl: "https://your-dashboard-domain.vercel.app/login"
  };
</script>
```

---

## 3. Leads Management

All admissions, inquiries, and contact messages appear immediately under:
> **Admin Dashboard** $\rightarrow$ **Operations** $\rightarrow$ **Website Leads**

From there, admissions staff can:
- View applicant details, contact number, parent names, and requested class
- Update lead status (New, Contacted, Verified, Enrolled, Closed)
- Export lead reports to CSV
