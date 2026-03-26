<template>
  <div class="admin-dashboard-layout">
    <!-- Mobile Sidebar Overlay -->
    <div
      class="sidebar-overlay"
      :class="{ active: isSidebarOpen }"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside class="sidebar-wrapper" :class="{ 'mobile-open': isSidebarOpen }">
      <!-- Logo -->
      <div class="sidebar-brand">
        <h1 class="brand-text">Cochin<br/><span class="brand-highlight">Distributors</span></h1>
      </div>

      <!-- User Profile Badge -->
      <div class="sidebar-profile-badge">
        <div class="avatar-square">{{ staff.name ? staff.name.charAt(0).toUpperCase() : 'S' }}</div>
        <div class="profile-info">
          <div class="profile-name">{{ staff.name || 'Staff Member' }}</div>
          <div class="profile-role">Employee <span class="status-dot"></span></div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <!-- Dashboard item -->
        <div 
          class="nav-item dashboard-btn" 
          :class="{ active: currentTab === 'dashboard' }"
          @click="setTab('dashboard')"
        >
          <div class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </div>
          <span class="nav-text">Dashboard</span>
        </div>

        <div class="nav-section-title">MAIN</div>
        <ul class="nav-list">
          <li :class="{ active: currentTab === 'profile' }" @click="setTab('profile')">
            <svg class="nav-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Professional Profile
          </li>
          <li :class="{ active: currentTab === 'items' }" @click="setTab('items')">
            <svg class="nav-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="9" y1="2" x2="9" y2="22"></line>
              <line x1="15" y1="2" x2="15" y2="22"></line>
              <line x1="3" y1="4" x2="21" y2="4"></line>
            </svg>
            Inventory Check
          </li>
        </ul>

        <div class="nav-section-title">OPERATIONS</div>
        <ul class="nav-list">
          <li @click="toggleLeaves" class="has-submenu" :class="{ 'submenu-open': showLeaves }">
            <svg class="nav-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Shift & Leaves
          </li>
          <ul v-if="showLeaves" class="submenu-list">
            <li :class="{ active: currentTab === 'apply-leave' }" @click.stop="setTab('apply-leave')">Apply Leave</li>
            <li :class="{ active: currentTab === 'leave-status' }" @click.stop="setTab('leave-status')">Request History</li>
          </ul>

          <li :class="{ active: currentTab === 'chat' }" @click="setTab('chat')">
            <svg class="nav-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            Messages
            <span v-if="unreadMessageCount > 0" class="badge-red">{{ unreadMessageCount }}</span>
          </li>
          
          <li :class="{ active: currentTab === 'resignation' }" @click="setTab('resignation')">
            <svg class="nav-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h6v18h-6M10 17l5-5-5-5M13.8 12H3" />
            </svg>
            Career Path
          </li>
        </ul>
      </nav>

      <div class="sidebar-bottom">
        <li @click="logout" class="logout-btn">
          Sign Out
        </li>
      </div>
    </aside>

    <main class="main-content-area">
      <!-- Top header -->
      <header class="top-header">
        <button class="menu-toggle" @click="isSidebarOpen = !isSidebarOpen">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </header>

      <div class="content-wrapper">
        <!-- Dashboard Tab -->
        <div v-if="currentTab === 'dashboard'">
          
          <div class="dashboard-badge">
            <span class="badge-icon">📊</span> Dashboard Overview
          </div>

          <!-- 4 Gradient Cards -->
          <div class="gradient-cards-grid">
            
            <div class="grad-card card-peach" @click="setTab('leave-status')">
              <div class="card-content">
                <div class="card-title">Total Leaves</div>
                <div class="card-value">{{ stats.leavesTaken }}</div>
                <div class="card-subtitle">Approved over time</div>
              </div>
              <div class="card-icon">🏖️</div>
            </div>

            <div class="grad-card card-purple" @click="setTab('items')">
              <div class="card-content">
                <div class="card-title">Active Items</div>
                <div class="card-value">{{ stats.totalItems }}</div>
                <div class="card-subtitle">In Inventory</div>
              </div>
              <div class="card-icon">📦</div>
            </div>

            <div class="grad-card card-teal" @click="setTab('leave-status')">
              <div class="card-content">
                <div class="card-title">Approved Leaves</div>
                <div class="card-value">{{ stats.approvedLeaves }}</div>
                <div class="card-subtitle">Remaining allowed</div>
              </div>
              <div class="card-icon">✅</div>
            </div>

            <div class="grad-card card-blue" @click="setTab('leave-status')">
              <div class="card-content">
                <div class="card-title">Pending Leaves</div>
                <div class="card-value">{{ stats.pendingLeaves }}</div>
                <div class="card-subtitle">Awaiting approval</div>
              </div>
              <div class="card-icon">👥</div>
            </div>

          </div>

          <!-- 4 Small White Cards -->
          <div class="white-cards-grid">
            <div class="small-white-card">
              <div class="swc-title">👤 PROFILE STATUS</div>
              <div class="swc-value">Active</div>
            </div>
            <div class="small-white-card">
              <div class="swc-title">📧 MESSAGES</div>
              <div class="swc-value">{{ unreadMessageCount || 0 }}</div>
            </div>
            <div class="small-white-card">
              <div class="swc-title">📝 CURRENT TAB</div>
              <div class="swc-value">Dashboard</div>
            </div>
            <div class="small-white-card">
              <div class="swc-title">🎯 TASKS</div>
              <div class="swc-value">0</div>
            </div>
          </div>

          <!-- Alert Banner -->
          <div class="alert-banner" v-if="unreadMessageCount > 0">
            <div class="alert-content">
              <span class="alert-icon">🚫</span>
              <div class="alert-text">
                <div class="alert-title">{{ unreadMessageCount }} New Messages Available!</div>
                <div class="alert-desc">Immediate action recommended to stay updated.</div>
              </div>
            </div>
            <button class="btn-manage" @click="setTab('chat')">View Now</button>
          </div>

        </div>

        <!-- Profile Modal (When triggered from Navigation) -->
        <div v-if="showProfileModal" class="profile-modal-overlay" @click="closeProfileModal">
          <div class="profile-modal-container" @click.stop>
            <div v-if="!showEditProfile" class="profile-view-card">
              <div class="profile-photo-section">
                <img :src="staff.profilePhoto ? apiBase + staff.profilePhoto : defaultPhoto" alt="Profile Photo" class="profile-photo-large" />
              </div>
              <div class="profile-name">{{ staff.name || "—" }}</div>
              <div class="profile-info-container">
                <div class="profile-info-item"><span class="profile-info-icon">👤</span><div class="profile-info-content"><span class="profile-info-label">Gender</span><span class="profile-info-value">{{staff.gender || "—"}}</span></div></div>
                <div class="profile-info-item"><span class="profile-info-icon">📱</span><div class="profile-info-content"><span class="profile-info-label">Phone</span><span class="profile-info-value">{{staff.phone || "—"}}</span></div></div>
                <div class="profile-info-item"><span class="profile-info-icon">✉️</span><div class="profile-info-content"><span class="profile-info-label">Email</span><span class="profile-info-value">{{staff.email || "—"}}</span></div></div>
                <div class="profile-info-item"><span class="profile-info-icon">📍</span><div class="profile-info-content"><span class="profile-info-label">Address</span><span class="profile-info-value">{{staff.address || "—"}}</span></div></div>
                <div class="profile-info-item"><span class="profile-info-icon">📮</span><div class="profile-info-content"><span class="profile-info-label">Pincode</span><span class="profile-info-value">{{staff.pincode || "—"}}</span></div></div>
              </div>
              <button @click="showEditProfile = true" class="btn-edit-profile">✏️ Edit Profile</button>
              <button @click="closeProfileModal" class="btn-close-modal">✕</button>
            </div>
            
            <div v-else class="profile-edit-card">
              <h3>Edit Your Profile</h3>
              <div class="edit-photo-section">
                <img :src="staff.profilePhoto ? apiBase + staff.profilePhoto : defaultPhoto" alt="Profile Photo" class="profile-photo-edit" />
                <input type="file" @change="onFileChange" class="file-input" />
              </div>
              <form @submit.prevent="updateProfile" class="profile-edit-form">
                <div class="form-group"><label>Name</label><input v-model="staff.name" required /></div>
                <div class="form-group"><label>Email</label><input v-model="staff.email" disabled /></div>
                <div class="form-group"><label>Phone</label><input v-model="staff.phone" required /></div>
                <div class="form-group">
                  <label>Gender</label>
                  <select v-model="staff.gender">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="form-group"><label>Address</label><input v-model="staff.address" required /></div>
                <div class="form-group"><label>Pincode</label><input v-model="staff.pincode" required /></div>
                <div class="form-actions">
                  <button type="submit" class="btn-save">💾 Save Changes</button>
                  <button type="button" @click="showEditProfile = false" class="btn-cancel">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div v-if="currentTab === 'items'" class="white-box no-pad">
          <ProductList @edit="openEditProductModal" />
        </div>

        <!-- Edit Product Modal -->
        <div
          v-if="showEditProductModal"
          class="modal-backdrop"
          @click="showEditProductModal = false"
        >
          <div class="modal-panel" @click.stop>
            <div class="modal-header">
              <h3>Edit Product</h3>
              <button class="close-btn" @click="showEditProductModal = false">
                ×
              </button>
            </div>
            <div class="modal-body">
              <ProductEdit
                :product-id="editProductId"
                @updated="handleProductUpdated"
              />
            </div>
          </div>
        </div>

        <div v-if="currentTab === 'apply-leave'" class="white-box">
          <StaffLeave @leave-submitted="fetchLeaveStatus" />
        </div>

        <div v-if="currentTab === 'leave-status'" class="white-box">
          <h2>Leave Status</h2>
          <table class="modern-table">
            <thead>
              <tr>
                <th>Reason</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="leave in leaveStatus" :key="leave._id">
                <td>{{ leave.reason }}</td>
                <td>{{ formatDate(leave.date) }}</td>
                <td>
                  <span class="status-badge" :class="leave.status.toLowerCase()">{{ leave.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="currentTab === 'resignation'" class="white-box">
          <h2>Resignation Request</h2>
          <div class="resignation-content">
            <div v-if="staff.resignationStatus === 'pending'" class="status-alert alert-pending">
              <h3>Request Pending</h3>
              <p>Your resignation request is currently being reviewed by the admin.</p>
              <p>Submitted on: {{ staff.resignationDate ? formatDate(staff.resignationDate) : "—" }}</p>
            </div>
            <div v-else-if="staff.resignationStatus === 'approved'" class="status-alert alert-approved">
              <h3>Resignation Approved</h3>
              <p>Your resignation has been accepted.</p>
              <p><strong>Last Working Day:</strong> {{ staff.lastWorkingDay ? formatDate(staff.lastWorkingDay) : "—" }}</p>
              <button @click="downloadExperienceCertificate" class="btn-download-report mt-3">📄 Download Experience Certificate</button>
            </div>
            <div v-else-if="staff.resignationStatus === 'rejected'" class="status-alert alert-rejected">
              <h3>Request Rejected</h3>
              <p>Your resignation request was rejected.</p>
              <button @click="staff.resignationStatus = 'none'" class="btn-save mt-3">Apply Again</button>
            </div>
            <div v-else class="apply-box">
              <p style="margin-bottom: 12px; color: #64748b;">If you wish to resign, please provide a reason below and submit your request.</p>
              <textarea v-model="resignationReason" placeholder="Reason for resignation..." class="reason-input" rows="4"></textarea>
              <button @click="submitResignation" class="btn-manage mt-3" :disabled="!resignationReason">Submit Resignation</button>
            </div>
          </div>
        </div>

        <div v-if="currentTab === 'chat'" class="white-box no-pad">
          <ChatWindow />
        </div>

      </div>
    </main>
  </div>
</template>

<script>
import axios from "@/utils/axios";
import StaffLeave from "./StaffLeave.vue";
import ChatWindow from "./ChatWindow.vue";
import ProductList from "@/views/ProductList.vue";
import ProductEdit from "@/views/ProductEdit.vue";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default {
  components: { StaffLeave, ChatWindow, ProductList, ProductEdit },
  data() {
    return {
      currentTab: "dashboard",
      isSidebarOpen: false,
      showLeaves: false,
      staff: {
        name: "",
        email: "",
        phone: "",
        gender: "",
        address: "",
        pincode: "",
        profilePhoto: "",
        resignationStatus: "none",
        lastWorkingDay: null,
      },
      resignationReason: "",
      stats: {
        totalItems: 0,
        leavesTaken: 0,
        pendingLeaves: 0,
        approvedLeaves: 0,
      },
      leaveStatus: [],
      selectedFile: null,
      message: "",
      apiBase: process.env.VUE_APP_API_URL || "",
      defaultPhoto: "/default-avatar.png",
      showProfileModal: false,
      showEditProfile: false,
      unreadMessageCount: 0,
      messageInterval: null,
      showEditProductModal: false,
      editProductId: null,
    };
  },
  methods: {
    async fetchProfile() {
      try {
        const res = await axios.get(`/api/staff/me`);
        this.staff = res.data.staff;
      } catch {
        this.message = "Error loading profile";
      }
    },
    async fetchStats() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        let leavesRes = { data: [] };
        const productsRes = await axios.get(`/api/products/getproduct`);
        if (user && user.email) {
          try {
            leavesRes = await axios.get(`/api/leaves/my`, {
              params: { email: user.email },
            });
          } catch (err) {
            console.error(err);
            leavesRes = [];
          }
        }
        const products = productsRes.data.products || [];
        const leaves = Array.isArray(leavesRes) ? leavesRes : leavesRes.data || [];
        this.stats = {
          totalItems: products.length,
          leavesTaken: leaves.filter((l) => l.status === "Approved").length,
          pendingLeaves: leaves.filter((l) => l.status === "Pending").length,
          approvedLeaves: leaves.filter((l) => l.status === "Approved").length,
        };
      } catch (err) {
        console.error(err);
      }
    },
    onFileChange(e) {
      this.selectedFile = e.target.files[0];
    },
    async updateProfile() {
      try {
        const formData = new FormData();
        Object.keys(this.staff).forEach((key) => {
          if (key !== "email") formData.append(key, this.staff[key]);
        });
        if (this.selectedFile) formData.append("profilePhoto", this.selectedFile);

        const res = await axios.put(`/api/staff/update`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        this.message = res.data.message;
        this.fetchProfile();
        this.showEditProfile = false;
        setTimeout(() => (this.message = ""), 3000);
      } catch (err) {
        this.message = err.response?.data?.message || "Error updating profile";
        setTimeout(() => (this.message = ""), 3000);
      }
    },
    setTab(tab) {
      this.currentTab = tab;
      this.isSidebarOpen = false;
    },
    toggleLeaves() {
      this.showLeaves = !this.showLeaves;
    },
    async logout() {
      try {
        await axios.post("/api/auth/logout");
      } catch (err) {
        console.error(err);
      } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        this.$router.push("/login");
      }
    },
    async fetchLeaveStatus() {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const email = user?.email;
        if (!email) return;
        const res = await axios.get(`${this.apiBase}/api/leaves/my`, {
          params: { email },
        });
        this.leaveStatus = res.data;
      } catch (err) {
        console.error(err);
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString();
    },
    closeProfileModal() {
      this.showProfileModal = false;
      this.showEditProfile = false;
      this.currentTab = "dashboard";
    },
    async fetchUnreadMessages() {
      try {
        const res = await axios.get(`${this.apiBase}/api/messages/unread-count`);
        if (res.data.success) {
          this.unreadMessageCount = res.data.unreadCount;
        }
      } catch (err) {
        console.error(err);
      }
    },
    async submitResignation() {
      try {
        await axios.post(`${this.apiBase}/api/staff/resign`, {
          reason: this.resignationReason,
        });
        this.staff.resignationStatus = "pending";
        this.staff.resignationDate = new Date();
      } catch (err) {
        console.error(err);
      }
    },
    downloadExperienceCertificate() {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text("Experience Certificate", 105, 60, null, null, "center");
      autoTable(doc, {
        startY: 70,
        body: [
          ["Employee Name", this.staff.name],
          ["Date of Joining", new Date(this.staff.dateOfJoining).toLocaleDateString()],
          ["Last Working Day", new Date(this.staff.lastWorkingDay).toLocaleDateString()],
        ],
      });
      doc.save(`${this.staff.name}_Experience_Certificate.pdf`);
    },
    openEditProductModal(productId) {
      this.editProductId = productId;
      this.showEditProductModal = true;
    },
    handleProductUpdated() {
      this.showEditProductModal = false;
      this.fetchStats();
    },
  },
  watch: {
    currentTab(newTab) {
      if (newTab === "leave-status") this.fetchLeaveStatus();
      if (newTab === "profile") {
        this.showProfileModal = true;
      } else {
        this.showProfileModal = false;
      }
    },
  },
  mounted() {
    this.fetchProfile();
    this.fetchStats();
    this.fetchUnreadMessages();
    this.messageInterval = setInterval(() => {
      this.fetchUnreadMessages();
    }, 5000);
  },
  beforeUnmount() {
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
    }
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Inter:wght@400;500;600;700;800&display=swap');

.admin-dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Inter', sans-serif;
  color: #334155;
}

/* Sidebar Styling */
.sidebar-wrapper {
  width: 270px;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  transition: transform 0.3s ease;
}

.sidebar-brand {
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
}

.brand-text {
  font-family: 'Dancing Script', cursive;
  font-size: 28px;
  color: #1e293b;
  margin: 0;
  line-height: 0.9;
}

.brand-highlight {
  color: #f59e0b;
  font-size: 26px;
}

/* Profile Badge */
.sidebar-profile-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  margin: 20px;
  background: #f8fafc;
  border-radius: 12px;
}

.avatar-square {
  width: 40px;
  height: 40px;
  background: #a855f7;
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-weight: 700;
  font-size: 14px;
  color: #0f172a;
}

.profile-role {
  font-size: 11px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #22c55e;
  border-radius: 50%;
}

/* Navigation */
.sidebar-nav {
  padding: 0 20px;
  flex: 1;
  overflow-y: auto;
}

.nav-item.dashboard-btn {
  background: #8b5cf6;
  color: white;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  margin-bottom: 24px;
  font-weight: 600;
  font-size: 14px;
}

.nav-item.dashboard-btn .nav-icon svg {
  width: 18px;
  height: 18px;
}

.nav-section-title {
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  margin-top: 16px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #475569;
  font-size: 14px;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 2px;
  transition: all 0.2s;
}

.nav-list li:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.nav-list li.active {
  color: #8b5cf6;
  font-weight: 600;
}

.nav-icon-small {
  width: 18px;
  height: 18px;
  color: #94a3b8;
}

.nav-list li.active .nav-icon-small {
  color: #8b5cf6;
}

.submenu-list {
  padding-left: 36px;
  list-style: none;
  margin-bottom: 8px;
}

.submenu-list li {
  padding: 8px 0;
  font-size: 13px;
  color: #64748b;
}

.badge-red {
  background: #ef4444;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: 800;
  margin-left: auto;
}

.sidebar-bottom {
  padding: 20px;
  border-top: 1px solid #f1f5f9;
}

.logout-btn {
  color: #ef4444;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  padding: 10px;
  list-style: none;
}

/* Main Area */
.main-content-area {
  flex: 1;
  margin-left: 270px;
  display: flex;
  flex-direction: column;
}

.top-header {
  height: 70px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  padding: 0 30px;
}

.menu-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: #475569;
}

.content-wrapper {
  padding: 0 30px 40px 30px;
}

/* Badges & Cards */
.dashboard-badge {
  background: linear-gradient(90deg, #7c3aed, #8b5cf6);
  color: white;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 24px;
}

.gradient-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.grad-card {
  border-radius: 16px;
  padding: 24px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.card-peach { background: linear-gradient(135deg, #fb923c, #f43f5e); }
.card-purple { background: linear-gradient(135deg, #c084fc, #9333ea); }
.card-teal { background: linear-gradient(135deg, #4ade80, #0d9488); }
.card-blue { background: linear-gradient(135deg, #60a5fa, #2563eb); }

.card-content { z-index: 2; }

.card-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  opacity: 0.9;
}

.card-value {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 8px;
}

.card-subtitle {
  font-size: 11px;
  opacity: 0.8;
}

.card-icon {
  font-size: 24px;
  z-index: 2;
  opacity: 0.8;
}

/* White small cards */
.white-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.small-white-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.swc-title {
  color: #94a3b8;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.swc-value {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
}

/* Alert Banner */
.alert-banner {
  background: #fef2f2;
  border-left: 4px solid #ef4444;
  padding: 16px 24px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.alert-content {
  display: flex;
  gap: 16px;
  align-items: center;
}

.alert-title {
  font-weight: 700;
  color: #0f172a;
  font-size: 14px;
}

.alert-desc {
  color: #64748b;
  font-size: 13px;
}

.btn-manage {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  color: #0f172a;
}

/* Tabs & White Boxes */
.white-box {
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.no-pad { padding: 0; }

.white-box h2 {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 16px;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
}

.modern-table th {
  text-align: left;
  padding: 12px 16px;
  color: #64748b;
  font-size: 12px;
  text-transform: uppercase;
  border-bottom: 1px solid #e2e8f0;
}

.modern-table td {
  padding: 16px;
  color: #334155;
  font-size: 14px;
  font-weight: 500;
  border-bottom: 1px solid #f1f5f9;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.status-badge.approved { background: #dcfce7; color: #166534; }
.status-badge.pending { background: #fef3c7; color: #92400e; }
.status-badge.rejected { background: #fee2e2; color: #991b1b; }

.mt-3 { margin-top: 16px; }

/* Modal overlays (re-used logic) */
.profile-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
}

.profile-modal-container {
  background: white;
  border-radius: 24px;
  width: 90%; max-width: 440px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.profile-view-card { padding: 32px; text-align: center; position: relative; }
.profile-photo-large { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 4px solid #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.profile-name { font-size: 22px; font-weight: 800; margin: 16px 0; }
.profile-info-container { text-align: left; background: #f8fafc; padding: 16px; border-radius: 12px; margin-bottom: 24px; }
.profile-info-item { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; font-size: 14px;}
.profile-info-item:last-child { margin-bottom: 0; }

.btn-edit-profile { background: #0f172a; color: white; width: 100%; padding: 12px; border-radius: 12px; border: none; font-weight: 600; cursor: pointer; }
.btn-close-modal { position: absolute; top: 16px; right: 16px; background: none; border: none; font-size: 20px; cursor: pointer; color: #64748b; }

.profile-edit-card { padding: 32px; }
.profile-edit-form { display: flex; flex-direction: column; gap: 16px; }
.form-group label { font-size: 12px; font-weight: 600; color: #64748b; }
.form-group input, .form-group select { padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 8px; width: 100%; }
.form-actions { display: flex; gap: 12px; margin-top: 16px; }
.btn-save { background: #0f172a; color: white; flex: 1; padding: 10px; border-radius: 8px; border: none; cursor: pointer; }
.btn-cancel { background: #f1f5f9; color: #64748b; flex: 1; padding: 10px; border-radius: 8px; border: none; cursor: pointer; }

/* Responsive */
@media (max-width: 1024px) {
  .gradient-cards-grid, .white-cards-grid { grid-template-columns: repeat(2, 1fr); }
  .sidebar-wrapper { transform: translateX(-100%); }
  .sidebar-wrapper.mobile-open { transform: translateX(0); }
  .main-content-area { margin-left: 0; }
  .sidebar-overlay.active { display: block; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 90; }
}

@media (max-width: 640px) {
  .gradient-cards-grid, .white-cards-grid { grid-template-columns: 1fr; }
}

/* Modal styles for Edit Product */
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(8px);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000;
}

.modal-panel {
  background: white;
  border-radius: 24px;
  width: 90%; max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 24px 32px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  line-height: 1;
  color: #64748b;
  cursor: pointer;
}

.modal-body {
  padding: 32px;
}
</style>
