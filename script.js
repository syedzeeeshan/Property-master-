// Property Master JavaScript

// Global variable
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
        bathrooms: 2,
        agent: 'John Doe',
        facing: 'north',
        furnished: 'semi-furnished'
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
        bathrooms: 1,
        agent: 'Jane Smith',
        facing: 'east',
        furnished: 'unfurnished'
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
        bathrooms: 2,
        agent: 'Mike Johnson',
        facing: 'south',
        furnished: 'fully-furnished'
    }
];

let filteredProperties = [...properties];
let selectedProperties = [];

// DOM 
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    bindEventListeners();
    updateStats();
    renderPropertyTable();
});

// Initialisation 
function initializeApp() {
    
    const today = new Date().toISOString().split('T')[0];
    const effectiveFromEl = document.getElementById('effectiveFrom');
    
    if (effectiveFromEl) effectiveFromEl.value = today;
    
    //  drag and drop
    initializeDragDrop();
    
    // Update price 
    const areaInput = document.getElementById('area');
    const priceInput = document.getElementById('price');
    const pricePerSqFtInput = document.getElementById('pricePerSqFt');
    
    if (areaInput && priceInput && pricePerSqFtInput) {
        [areaInput, priceInput].forEach(input => {
            input.addEventListener('input', function() {
                const area = parseFloat(areaInput.value) || 0;
                const price = parseFloat(priceInput.value) || 0;
                const pricePerSqFt = area > 0 ? (price / area).toFixed(2) : 0;
                pricePerSqFtInput.value = pricePerSqFt;
            });
        });
    }
}

// Bind Event Listeners
function bindEventListeners() {
    // Form submission
    const propertyForm = document.getElementById('propertyForm');
    if (propertyForm) {
        propertyForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterProperties, 300));
    }
}

// Tab Switching
function switchTab(event, tabName) {
    // Remove active class 
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked tab 
    event.target.classList.add('active');
    const tabContent = document.getElementById(tabName);
    if (tabContent) {
        tabContent.classList.add('active');
    }
    
    // Refresh data 
    if (tabName === 'analytics') {
        refreshAnalytics();
    }
}

// Form Handling
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = collectFormData();
    
    // Validation
    if (!validateFormData(formData)) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    showLoading();
    
    // Simulating call
    setTimeout(() => {
        hideLoading();
        
        //  editing existing property
        const existingIndex = properties.findIndex(p => p.id === formData.id);
        
        if (existingIndex !== -1) {
            properties[existingIndex] = formData;
            showNotification('Property updated successfully!', 'success');
        } else {
            properties.push(formData);
            showNotification('Property added successfully!', 'success');
        }
        
        updateStats();
        renderPropertyTable();
        resetForm();
    }, 1500);
}

function collectFormData() {
    return {
        id: document.getElementById('propertyId').value,
        name: document.getElementById('propertyName').value,
        project: document.getElementById('project').value,
        type: document.getElementById('propertyType').value,
        building: document.getElementById('building').value,
        floor: document.getElementById('floor').value,
        unit: document.getElementById('unit').value,
        area: parseFloat(document.getElementById('area').value) || 0,
        price: parseFloat(document.getElementById('price').value) || 0,
        pricePerSqFt: parseFloat(document.getElementById('pricePerSqFt').value) || 0,
        status: document.getElementById('status').value,
        bedrooms: document.getElementById('bedrooms').value,
        bathrooms: parseInt(document.getElementById('bathrooms').value) || 0,
        parking: parseInt(document.getElementById('parking').value) || 0,
        balcony: document.getElementById('balcony').value,
        facing: document.getElementById('facing').value,
        viewType: document.getElementById('viewType').value,
        furnished: document.getElementById('furnished').value,
        effectiveFrom: document.getElementById('effectiveFrom').value,
        effectiveTo: document.getElementById('effectiveTo').value,
        agent: document.getElementById('agent').value,
        contactNumber: document.getElementById('contactNumber').value,
        email: document.getElementById('email').value,
        description: document.getElementById('description').value
    };
}

function validateFormData(data) {
    return data.id && data.name && data.project && data.type && data.area && data.price;
}

// Property Table Management
function renderPropertyTable() {
    const tbody = document.getElementById('propertyTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    filteredProperties.forEach(property => {
        const row = createPropertyRow(property);
        tbody.appendChild(row);
    });
}

function createPropertyRow(property) {
    const row = document.createElement('tr');
    const statusClass = `status-${property.status}`;
    const formattedPrice = formatCurrency(property.price);
    
    row.innerHTML = `
        <td><input type="checkbox" class="property-select" data-id="${property.id}" onchange="togglePropertySelection('${property.id}')"></td>
        <td>${property.id}</td>
        <td>${property.name}</td>
        <td>${property.project}</td>
        <td>${property.type}</td>
        <td>${property.building || 'N/A'}</td>
        <td>${property.unit || 'N/A'}</td>
        <td>${property.area.toLocaleString()}</td>
        <td>${formattedPrice}</td>
        <td><span class="status-badge ${statusClass}">${property.status}</span></td>
        <td>${property.agent || 'N/A'}</td>
        <td>
            <button class="btn btn-primary btn-sm" onclick="editProperty('${property.id}')" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-secondary btn-sm" onclick="viewProperty('${property.id}')" title="View">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteProperty('${property.id}')" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    return row;
}

// Property Operations
function editProperty(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) {
        showNotification('Property not found', 'error');
        return;
    }
    
    // form tab switching 
    document.querySelector('.tab[onclick*="property-form"]').click();
    
    // Populate form
    populateForm(property);
    
    showNotification(`Editing property ${propertyId}`, 'info');
}

function populateForm(property) {
    Object.keys(property).forEach(key => {
        const element = document.getElementById(key === 'id' ? 'propertyId' : key);
        if (element) {
            element.value = property[key];
        }
    });
}

function viewProperty(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) {
        showNotification('Property not found', 'error');
        return;
    }
    
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (modalTitle && modalBody) {
        modalTitle.textContent = `Property Details - ${property.id}`;
        modalBody.innerHTML = createPropertyDetailsHTML(property);
        showModal();
    }
}

function createPropertyDetailsHTML(property) {
    return `
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
                <label>Area (Sq Ft)</label>
                <input type="text" class="form-control" value="${property.area.toLocaleString()}" readonly>
            </div>
            <div class="form-group">
                <label>Price</label>
                <input type="text" class="form-control" value="${formatCurrency(property.price)}" readonly>
            </div>
            <div class="form-group">
                <label>Status</label>
                <input type="text" class="form-control" value="${property.status}" readonly>
            </div>
            <div class="form-group">
                <label>Agent</label>
                <input type="text" class="form-control" value="${property.agent || 'N/A'}" readonly>
            </div>
        </div>
        <div class="btn-group">
            <button class="btn btn-primary" onclick="editProperty('${property.id}'); closeModal();">Edit Property</button>
            <button class="btn btn-secondary" onclick="closeModal()">Close</button>
        </div>
    `;
}

function deleteProperty(propertyId) {
    if (confirm('Are you sure you want to delete this property?')) {
        const index = properties.findIndex(p => p.id === propertyId);
        if (index !== -1) {
            properties.splice(index, 1);
            updateStats();
            renderPropertyTable();
            showNotification('Property deleted successfully', 'success');
        }
    }
}

// Filtering , Search
function filterProperties() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter') ? document.getElementById('statusFilter').value : '';
    const typeFilter = document.getElementById('typeFilter') ? document.getElementById('typeFilter').value : '';
    
    filteredProperties = properties.filter(property => {
        const matchesSearch = !searchTerm || 
            property.name.toLowerCase().includes(searchTerm) ||
            property.id.toLowerCase().includes(searchTerm) ||
            property.project.toLowerCase().includes(searchTerm);
            
        const matchesStatus = !statusFilter || property.status === statusFilter;
        const matchesType = !typeFilter || property.type.toLowerCase() === typeFilter;
        
        return matchesSearch && matchesStatus && matchesType;
    });
    
    renderPropertyTable();
}

function filterByStatus() {
    filterProperties();
}

function filterByType() {
    filterProperties();
}

// Bulk Operations
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.property-select');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
        togglePropertySelection(checkbox.dataset.id);
    });
}

function togglePropertySelection(propertyId) {
    const checkbox = document.querySelector(`[data-id="${propertyId}"]`);
    
    if (checkbox && checkbox.checked) {
        if (!selectedProperties.includes(propertyId)) {
            selectedProperties.push(propertyId);
        }
    } else {
        selectedProperties = selectedProperties.filter(id => id !== propertyId);
    }
    
    // Update select all checkbox
    const selectAll = document.getElementById('selectAll');
    const allCheckboxes = document.querySelectorAll('.property-select');
    const checkedBoxes = document.querySelectorAll('.property-select:checked');
    
    if (selectAll) {
        selectAll.checked = allCheckboxes.length === checkedBoxes.length;
        selectAll.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < allCheckboxes.length;
    }
}

function bulkEdit() {
    if (selectedProperties.length === 0) {
        showNotification('Please select properties to edit', 'warning');
        return;
    }
    
    showNotification(`Bulk editing ${selectedProperties.length} properties`, 'info');
}

function bulkDelete() {
    if (selectedProperties.length === 0) {
        showNotification('Please select properties to delete', 'warning');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${selectedProperties.length} properties?`)) {
        properties = properties.filter(p => !selectedProperties.includes(p.id));
        selectedProperties = [];
        updateStats();
        renderPropertyTable();
        showNotification('Selected properties deleted successfully', 'success');
    }
}

function bulkExport() {
    if (selectedProperties.length === 0) {
        showNotification('Please select properties to export', 'warning');
        return;
    }
    
    const selectedData = properties.filter(p => selectedProperties.includes(p.id));
    exportToCSV(selectedData, 'selected-properties.csv');
    showNotification('Selected properties exported successfully', 'success');
}

// Statistics Update
function updateStats() {
    const total = properties.length;
    const available = properties.filter(p => p.status === 'available').length;
    const reserved = properties.filter(p => p.status === 'reserved').length;
    const sold = properties.filter(p => p.status === 'sold').length;
    
    updateStatElement('totalProperties', total);
    updateStatElement('availableProperties', available);
    updateStatElement('reservedProperties', reserved);
    updateStatElement('soldProperties', sold);
}

function updateStatElement(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    }
}

// File Upload Handling
function initializeDragDrop() {
    const uploadZones = document.querySelectorAll('.upload-zone');
    
    uploadZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('dragleave', handleDragLeave);
        zone.addEventListener('drop', handleDrop);
    });
}

function handleDragOver(e) {
    e.preventDefault();
    this.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    this.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileUpload({ files: files });
    }
}

function handleFileUpload(input) {
    const files = input.files;
    if (files && files[0]) {
        const file = files[0];
        const fileName = file.name;
        const fileSize = (file.size / 1024 / 1024).toFixed(2);
        
        showNotification(`File selected: ${fileName} (${fileSize} MB)`, 'success');
        
        // upload progress 
        showUploadProgress();
        
        // file processing 
        simulateFileProcessing(fileName);
    }
}

function showUploadProgress() {
    const progressEl = document.getElementById('uploadProgress');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressEl) {
        progressEl.style.display = 'block';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                setTimeout(() => {
                    progressEl.style.display = 'none';
                    showNotification('File uploaded and processed successfully!', 'success');
                }, 1000);
            }
            
            if (progressFill) progressFill.style.width = progress + '%';
            if (progressText) progressText.textContent = `Uploading... ${Math.round(progress)}%`;
        }, 200);
    }
}

function simulateFileProcessing(fileName) {
    // Simulate adding data from uploaded file
    const newProperty = {
        id: 'P' + String(properties.length + 1).padStart(3, '0'),
        name: `Property from ${fileName}`,
        project: 'Uploaded Project',
        type: 'Residential',
        building: 'Upload Building',
        area: 1000,
        price: 200000,
        status: 'available',
        agent: 'System Import'
    };
    
    setTimeout(() => {
        properties.push(newProperty);
        updateStats();
        renderPropertyTable();
    }, 2000);
}

// Export Functions
function exportList() {
    exportToCSV(properties, 'property-list.csv');
    showNotification('Property list exported successfully', 'success');
}

function exportToCSV(data, filename) {
    if (!data.length) return;
    
    const headers = ['ID', 'Name', 'Project', 'Type', 'Building', 'Unit', 'Area', 'Price', 'Status', 'Agent'];
    const csvContent = [
        headers.join(','),
        ...data.map(property => [
            property.id,
            `"${property.name}"`,
            `"${property.project}"`,
            property.type,
            `"${property.building || ''}"`,
            `"${property.unit || ''}"`,
            property.area,
            property.price,
            property.status,
            `"${property.agent || ''}"`
        ].join(','))
    ].join('
');
    
    downloadFile(csvContent, filename, 'text/csv');
}

function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
}

// Modal Functions
function showModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal() {
    const modal = document.getElementById('    
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
