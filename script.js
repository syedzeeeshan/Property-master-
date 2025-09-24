// Property Master JavaScript Functions

// Tab switching functionality
function switchTab(event, tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Show selected tab content and mark tab as active
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Property data storage
let properties = [
    {
        id: 'P001',
        name: 'Sunrise Heights A-G-001',
        project: 'Sunrise Heights',
        type: 'Residential',
        building: 'Block A',
        unit: 'A-G-001',
        area: 1200,
        price: 250000,
        status: 'available',
        bedrooms: 2,
        bathrooms: 2
    },
    {
        id: 'P002',
        name: 'Ocean View B-1-002',
        project: 'Ocean View Residences',
        type: 'Residential',
        building: 'Block B',
        unit: 'B-1-002',
        area: 850,
        price: 180000,
        status: 'reserved',
        bedrooms: 1,
        bathrooms: 1
    },
    {
        id: 'P003',
        name: 'Downtown Plaza C-2-003',
        project: 'Downtown Plaza',
        type: 'Commercial',
        building: 'Block C',
        unit: 'C-2-003',
        area: 1500,
        price: 320000,
        status: 'sold',
        bedrooms: 0,
        bathrooms: 2
    }
];

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    const propertyForm = document.getElementById('propertyForm');
    
    if (propertyForm) {
        propertyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                propertyId: document.getElementById('propertyId').value,
                propertyName: document.getElementById('propertyName').value,
                project: document.getElementById('project').value,
                propertyType: document.getElementById('propertyType').value,
                building: document.getElementById('building').value,
                floor: document.getElementById('floor').value,
                unit: document.getElementById('unit').value,
                area: document.getElementById('area').value,
                price: document.getElementById('price').value,
                status: document.getElementById('status').value,
                bedrooms: document.getElementById('bedrooms').value,
                bathrooms: document.getElementById('bathrooms').value
            };
            
            
            if (!formData.propertyId || !formData.propertyName || !formData.project || 
                !formData.propertyType || !formData.area || !formData.price) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Show loading state
            showLoading();
            
            // Simulate API call
            setTimeout(() => {
                hideLoading();
                addPropertyToTable(formData);
                addPropertyToStorage(formData);
                showNotification('Property saved successfully!', 'success');
                resetForm();
                updateStats();
            }, 1500);
        });
    }
    
    
    initializeUploadZones();
    
    
    updateStats();
});

// Add property to storage
function addPropertyToStorage(propertyData) {
    const newProperty = {
        id: propertyData.propertyId,
        name: propertyData.propertyName,
        project: propertyData.project,
        type: propertyData.propertyType,
        building: propertyData.building,
        unit: propertyData.unit,
        area: parseInt(propertyData.area),
        price: parseInt(propertyData.price),
        status: propertyData.status,
        bedrooms: propertyData.bedrooms,
        bathrooms: parseInt(propertyData.bathrooms) || 0
    };
    
    properties.push(newProperty);
}

// Add property to table
function addPropertyToTable(propertyData) {
    const tbody = document.getElementById('propertyTableBody');
    if (!tbody) return;
    
    const row = document.createElement('tr');
    
    const statusClass = `status-${propertyData.status}`;
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(propertyData.price);
    
    row.innerHTML = `
        <td>${propertyData.propertyId}</td>
        <td>${propertyData.propertyName}</td>
        <td>${propertyData.project}</td>
        <td>${propertyData.propertyType}</td>
        <td>${propertyData.building}</td>
        <td>${propertyData.unit}</td>
        <td>${parseInt(propertyData.area).toLocaleString()}</td>
        <td>${formattedPrice}</td>
        <td><span class="status-badge ${statusClass}">${propertyData.status}</span></td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="editProperty('${propertyData.propertyId}')">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-secondary btn-sm" onclick="viewProperty('${propertyData.propertyId}')">
                <i class="fas fa-eye"></i>
            </button>
        </td>
    `;
    
    tbody.appendChild(row);
}

// Update statistics
function updateStats() {
    const available = properties.filter(p => p.status === 'available').length;
    const reserved = properties.filter(p => p.status === 'reserved').length;
    const sold = properties.filter(p => p.status === 'sold').length;
    const total = properties.length;
    
    const totalEl = document.getElementById('totalProperties');
    const availableEl = document.getElementById('availableProperties');
    const reservedEl = document.getElementById('reservedProperties');
    const soldEl = document.getElementById('soldProperties');
    
    if (totalEl) totalEl.textContent = total;
    if (availableEl) availableEl.textContent = available;
    if (reservedEl) reservedEl.textContent = reserved;
    if (soldEl) soldEl.textContent = sold;
}

// Filter properties in table
function filterProperties() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const tbody = document.getElementById('propertyTableBody');
    
    if (!tbody) return;
    
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Modal functions
function viewProperty(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    
    if (!property) {
        showNotification('Property not found', 'error');
        return;
    }
    
    document.getElementById('modalTitle').textContent = `Property Details - ${propertyId}`;
    document.getElementById('modalBody').innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Property ID</label>
                <input type="text" class="form-control" value="${property.id}" readonly>
            </div>
            <div class="form-group">
                <label>Name</label>
                <input type="text" class="form-control" value="${property.name}" readonly>
            </div>
            <div class="form-group">
                <label>Project</label>
                <input type="text" class="form-control" value="${property.project}" readonly>
            </div>
            <div class="form-group">
                <label>Type</label>
                <input type="text" class="form-control" value="${property.type}" readonly>
            </div>
            <div class="form-group">
                <label>Building</label>
                <input type="text" class="form-control" value="${property.building || 'N/A'}" readonly>
            </div>
            <div class="form-group">
                <label>Unit</label>
                <input type="text" class="form-control" value="${property.unit || 'N/A'}" readonly>
            </div>
            <div class="form-group">
                <label>Area (Sq Ft)</label>
                <input type="text" class="form-control" value="${property.area.toLocaleString()}" readonly>
            </div>
            <div class="form-group">
                <label>Price</label>
                <input type="text" class="form-control" value="${new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(property.price)}" readonly>
            </div>
            <div class="form-group">
                <label>Status</label>
                <input type="text" class="form-control" value="${property.status}" readonly>
            </div>
            <div class="form-group">
                <label>Bedrooms</label>
                <input type="text" class="form-control" value="${property.bedrooms || 'N/A'}" readonly>
            </div>
        </div>
        <div class="btn-group">
            <button class="btn btn-primary" onclick="editProperty('${property.id}'); closeModal();">Edit Property</button>
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        </div>
    `;
    showModal();
}

function editProperty(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    
    if (!property) {
        showNotification('Property not found', 'error');
        return;
    }
    
    
    document.querySelector('.tab[onclick*="property-form"]').click();
    
    // Populate form with property data
    document.getElementById('propertyId').value = property.id;
    document.getElementById('propertyName').value = property.name;
    document.getElementById('project').value = property.project.toLowerCase().replace(/s+/g, '-');
    document.getElementById('propertyType').value = property.type.toLowerCase();
    document.getElementById('building').value = property.building || '';
    document.getElementById('unit').value = property.unit || '';
    document.getElementById('area').value = property.area;
    document.getElementById('price').value = property.price;
    document.getElementById('status').value = property.status;
    document.getElementById('bedrooms').value = property.bedrooms || '';
    document.getElementById('bathrooms').value = property.bathrooms || '';
    
    showNotification(`Editing property ${propertyId}`, 'info');
}

function showModal() {
    document.getElementById('modal').classList.add('show');
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

// Utility functions
function resetForm() {
    const form = document.getElementById('propertyForm');
    if (form) {
        form.reset();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    if (!notification || !notificationText) return;
    
    notificationText.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function showLoading() {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading"></div> Saving...';
    submitBtn.disabled = true;
    submitBtn.setAttribute('data-original', originalText);
}

function hideLoading() {
    const submitBtn = document.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    
    const originalText = submitBtn.getAttribute('data-original');
    if (originalText) {
        submitBtn.innerHTML = originalText;
    }
    submitBtn.disabled = false;
}

// File upload handling
function handleFileUpload(input) {
    if (input.files && input.files[0]) {
        const fileName = input.files[0].name;
        const fileSize = (input.files[0].size / 1024 / 1024).toFixed(2);
        showNotification(`File selected: ${fileName} (${fileSize} MB)`, 'success');
    }
}

// Initialize drag and drop functionality
function initializeUploadZones() {
    const uploadZones = document.querySelectorAll('.upload-zone');
    
    uploadZones.forEach(zone => {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            zone.classList.add('drag-over');
        });
        
        zone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            zone.classList.remove('drag-over');
        });
        
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            zone.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const fileName = files[0].name;
                const fileSize = (files[0].size / 1024 / 1024).toFixed(2);
                showNotification(`File dropped: ${fileName} (${fileSize} MB)`, 'success');
            }
        });
    });
}

// Additional utility functions
function refreshList() {
    showNotification('Property list refreshed', 'success');
    updateStats();
}

function exportList() {
    const csv = convertToCSV(properties);
    downloadCSV(csv, 'property-list.csv');
    showNotification('Property list exported successfully', 'success');
}

function convertToCSV(data) {
    if (!data.length) return '';
    
    const headers = ['ID', 'Name', 'Project', 'Type', 'Building', 'Unit', 'Area', 'Price', 'Status', 'Bedrooms', 'Bathrooms'];
    const csvContent = [
        headers.join(','),
        ...data.map(row => [
            row.id,
            `"${row.name}"`,
            `"${row.project}"`,
            row.type,
            `"${row.building || ''}"`,
            `"${row.unit || ''}"`,
            row.area,
            row.price,
            row.status,
            row.bedrooms || '',
            row.bathrooms || ''
        ].join(','))
    ].join('
');
    
    return csvContent;
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function previewProperty() {
    const form = document.getElementById('propertyForm');
    const formData = new FormData(form);
    
    // Basic validation
    const propertyId = formData.get('propertyId') || document.getElementById('propertyId').value;
    const propertyName = formData.get('propertyName') || document.getElementById('propertyName').value;
    
    if (!propertyId || !propertyName) {
        showNotification('Please fill in Property ID and Name for preview', 'error');
        return;
    }
    
    showNotification('Opening property preview...', 'info');
}

function exportProperty() {
    showNotification('Exporting property data...', 'info');
}

function updateAttributes() {
    const propertyType = document.getElementById('propertyType').value;
    if (propertyType) {
        showNotification(`Updated attributes for ${propertyType} properties`, 'info');
    }
}
