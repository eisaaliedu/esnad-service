// Utility functions
const utils = {
    // Format currency
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('ar-SA', {
            style: 'currency',
            currency: 'SAR'
        }).format(amount);
    },

    // Format date
    formatDate: (date) => {
        return new Intl.DateTimeFormat('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },

    // Show loading state
    showLoading: (element) => {
        element.classList.add('loading');
        element.disabled = true;
    },

    // Hide loading state
    hideLoading: (element) => {
        element.classList.remove('loading');
        element.disabled = false;
    },

    // Show success message
    showSuccess: (message) => {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success';
        alert.textContent = message;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
    },

    // Show error message
    showError: (message) => {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger';
        alert.textContent = message;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
    }
};

// Form validation
const validateForm = (form) => {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    });

    return isValid;
};

// Initialize form validation
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!validateForm(form)) {
                e.preventDefault();
                utils.showError('Please fill in all required fields');
            }
        });
    });

    // Initialize land selection and file upload functionality
    const landSelect = document.getElementById('landSelection');
    const customLandDetails = document.getElementById('customLandDetails');
    const customLandInput = document.getElementById('customLandInput');
    const landMapInput = document.getElementById('landMap');
    const filePreview = document.getElementById('filePreview');
    const fileUploadLabel = document.querySelector('.file-upload-label');
    let selectedFile = null;

    if (landSelect) {
        landSelect.addEventListener('change', function() {
            this.classList.remove('is-invalid');
            if (this.value) {
                this.classList.add('is-valid');
            }

            // Show/hide custom land input and file upload
            if (this.value === 'other') {
                customLandDetails.classList.remove('d-none');
                customLandInput.required = true;
                landMapInput.required = true;
                // Focus the input field
                customLandInput.focus();
            } else {
                customLandDetails.classList.add('d-none');
                customLandInput.required = false;
                landMapInput.required = false;
                // Reset file upload
                resetFileUpload();
            }
        });

        // Handle custom land input validation
        customLandInput.addEventListener('input', function() {
            validateCustomLandInput(this);
        });

        // File Upload Handling
        landMapInput.addEventListener('change', handleFileSelect);

        // Drag and Drop
        fileUploadLabel.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.parentElement.classList.add('drag-over');
        });

        fileUploadLabel.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.parentElement.classList.remove('drag-over');
        });

        fileUploadLabel.addEventListener('drop', function(e) {
            e.preventDefault();
            this.parentElement.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length) {
                landMapInput.files = files;
                handleFileSelect({ target: landMapInput });
            }
        });

        // Remove file button
        document.addEventListener('click', function(e) {
            if (e.target.closest('.remove-file')) {
                resetFileUpload();
            }
        });
    }
});

// Handle responsive navigation
const handleResponsiveNav = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
};

// Initialize responsive navigation
document.addEventListener('DOMContentLoaded', handleResponsiveNav);

// Handle payment form
const handlePaymentForm = () => {
    const paymentForm = document.querySelector('#payment-form');
    
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitButton = paymentForm.querySelector('button[type="submit"]');
            
            utils.showLoading(submitButton);
            
            // Simulate payment processing
            setTimeout(() => {
                utils.hideLoading(submitButton);
                utils.showSuccess('Payment processed successfully!');
                // Redirect to confirmation page
                window.location.href = 'confirmation.html';
            }, 2000);
        });
    }
};

// Initialize payment form handling
document.addEventListener('DOMContentLoaded', handlePaymentForm);

document.addEventListener('DOMContentLoaded', function() {
    // Get all service links and content sections
    const serviceLinks = document.querySelectorAll('.service-link');
    const contentSections = document.querySelectorAll('.content-section');

    // Function to show a specific section
    function showSection(sectionId) {
        // Hide all sections
        contentSections.forEach(section => {
            section.classList.add('d-none');
        });

        // Remove active class from all links
        serviceLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Show the selected section
        const selectedSection = document.getElementById(sectionId);
        if (selectedSection) {
            selectedSection.classList.remove('d-none');
        }

        // Add active class to the clicked link
        const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Add click event listeners to all service links
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            showSection(sectionId);
        });
    });

    // Show the about section by default
    showSection('about');
});

// Smart Search Animation
const searchExamples = [
    "فيلا حديثة بمسبح داخلي",
    "تصميم بطابق واحد و٤ غرف",
    "سعر أقل من ٩٠٠,٠٠٠ درهم"
];

const searchInput = document.getElementById('searchInput');
const searchExamplesDiv = document.getElementById('searchExamples');
let currentExampleIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingInterval;

function typeEffect() {
    const currentExample = searchExamples[currentExampleIndex];
    
    if (!isDeleting && currentCharIndex <= currentExample.length) {
        searchInput.placeholder = currentExample.substring(0, currentCharIndex);
        currentCharIndex++;
    } else if (isDeleting && currentCharIndex >= 0) {
        searchInput.placeholder = currentExample.substring(0, currentCharIndex);
        currentCharIndex--;
    }

    if (currentCharIndex === currentExample.length + 1) {
        isDeleting = true;
        clearInterval(typingInterval);
        setTimeout(() => {
            typingInterval = setInterval(typeEffect, 50);
        }, 2000);
    }

    if (currentCharIndex === 0 && isDeleting) {
        isDeleting = false;
        currentExampleIndex = (currentExampleIndex + 1) % searchExamples.length;
        clearInterval(typingInterval);
        setTimeout(() => {
            typingInterval = setInterval(typeEffect, 100);
        }, 500);
    }
}

typingInterval = setInterval(typeEffect, 100);

// Consultant Dropdown
const consultantSearch = document.getElementById('consultantSearch');
const consultantList = document.getElementById('consultantList');
const consultantItems = document.querySelectorAll('.consultant-item');

consultantSearch.addEventListener('focus', () => {
    consultantList.classList.add('active');
});

document.addEventListener('click', (e) => {
    if (!consultantSearch.contains(e.target) && !consultantList.contains(e.target)) {
        consultantList.classList.remove('active');
    }
});

consultantSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    consultantItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
});

consultantItems.forEach(item => {
    item.addEventListener('click', () => {
        consultantSearch.value = item.textContent;
        consultantList.classList.remove('active');
        item.classList.add('selected');
        setTimeout(() => item.classList.remove('selected'), 300);
    });
});

// Design Comparison
const compareCheckboxes = document.querySelectorAll('.compare-checkbox');
const comparisonBar = document.getElementById('comparisonBar');
const compareBtn = document.querySelector('.compare-btn');
const selectedCountSpan = document.querySelector('.selected-count');
const comparisonModal = new bootstrap.Modal(document.getElementById('comparisonModal'));
const comparisonGrid = document.getElementById('comparisonGrid');

let selectedDesigns = [];

compareCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const card = checkbox.closest('.design-card');
        const designData = {
            id: checkbox.id,
            title: card.querySelector('.design-title').textContent,
            price: card.querySelector('.amount').textContent,
            area: card.querySelector('[data-tooltip="المساحة الكلية"] span').textContent,
            rooms: card.querySelector('[data-tooltip="عدد الغرف"] span').textContent,
            floors: card.querySelector('[data-tooltip="عدد الطوابق"] span').textContent,
            imageId: Math.floor(Math.random() * 100) // Random seed for unique images
        };

        if (checkbox.checked) {
            if (selectedDesigns.length >= 3) {
                checkbox.checked = false;
                return;
            }
            selectedDesigns.push(designData);
        } else {
            selectedDesigns = selectedDesigns.filter(design => design.id !== checkbox.id);
        }

        updateComparisonBar();
    });
});

function updateComparisonBar() {
    const count = selectedDesigns.length;
    selectedCountSpan.textContent = `${count} تصاميم محددة`;
    
    if (count >= 2) {
        comparisonBar.classList.add('active');
        compareBtn.disabled = false;
    } else {
        comparisonBar.classList.remove('active');
        compareBtn.disabled = true;
    }
}

compareBtn.addEventListener('click', () => {
    comparisonGrid.innerHTML = selectedDesigns.map(design => `
        <div class="comparison-item">
            <img src="https://picsum.photos/seed/${design.imageId}/300/200" alt="${design.title}" class="comparison-image">
            <div class="comparison-details">
                <div class="comparison-detail">
                    <span class="detail-label">التصميم</span>
                    <span class="detail-value">${design.title}</span>
                </div>
                <div class="comparison-detail">
                    <span class="detail-label">السعر</span>
                    <span class="detail-value">${design.price} درهم</span>
                </div>
                <div class="comparison-detail">
                    <span class="detail-label">المساحة</span>
                    <span class="detail-value">${design.area}</span>
                </div>
                <div class="comparison-detail">
                    <span class="detail-label">عدد الغرف</span>
                    <span class="detail-value">${design.rooms}</span>
                </div>
                <div class="comparison-detail">
                    <span class="detail-label">عدد الطوابق</span>
                    <span class="detail-value">${design.floors}</span>
                </div>
            </div>
        </div>
    `).join('');
    
    comparisonModal.show();
});

// Design Details Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all "View Details" buttons
    const viewDetailsButtons = document.querySelectorAll('.btn-view');
    
    // Add click event listener to each button
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get design data from the card
            const card = this.closest('.design-card');
            const designTitle = card.querySelector('.design-title').textContent;
            const designPrice = card.querySelector('.amount').textContent;
            const designArea = card.querySelector('[data-tooltip="المساحة الكلية"] span').textContent;
            const designRooms = card.querySelector('[data-tooltip="عدد الغرف"] span').textContent;
            const designFloors = card.querySelector('[data-tooltip="عدد الطوابق"] span').textContent;
            
            // Update modal content with design data
            const modal = document.querySelector('.design-details-modal');
            modal.querySelector('.modal-title').textContent = designTitle;
            modal.querySelector('[data-spec="price"] .spec-value').textContent = `${designPrice} درهم`;
            modal.querySelector('[data-spec="area"] .spec-value').textContent = designArea;
            modal.querySelector('[data-spec="rooms"] .spec-value').textContent = designRooms;
            modal.querySelector('[data-spec="floors"] .spec-value').textContent = designFloors;
            
            // Show the modal
            const modalInstance = new bootstrap.Modal(modal);
            modalInstance.show();
            
            // Handle thumbnail clicks
            const thumbnails = modal.querySelectorAll('.image-thumbnails img');
            const mainImage = modal.querySelector('.main-image img');
            
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', function() {
                    // Remove active class from all thumbnails
                    thumbnails.forEach(t => t.classList.remove('active'));
                    // Add active class to clicked thumbnail
                    this.classList.add('active');
                    // Update main image
                    mainImage.src = this.src;
                    mainImage.alt = this.alt;
                });
            });
            
            // Handle continue order button
            const continueOrderBtn = modal.querySelector('.btn-continue');
            continueOrderBtn.addEventListener('click', function() {
                // Navigate to request page with design ID
                window.location.href = `request.html?design=${encodeURIComponent(designTitle)}`;
            });
        });
    });
    
    // Close modal when clicking outside
    const modal = document.querySelector('.design-details-modal');
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
        }
    });
    
    // Handle keyboard navigation for thumbnails
    const thumbnailContainer = document.querySelector('.image-thumbnails');
    if (thumbnailContainer) {
        thumbnailContainer.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const thumbnails = Array.from(this.querySelectorAll('img'));
                const currentIndex = thumbnails.findIndex(thumb => thumb === document.activeElement);
                
                let newIndex;
                if (e.key === 'ArrowRight') {
                    newIndex = currentIndex > 0 ? currentIndex - 1 : thumbnails.length - 1;
                } else {
                    newIndex = currentIndex < thumbnails.length - 1 ? currentIndex + 1 : 0;
                }
                
                thumbnails[newIndex].focus();
                thumbnails[newIndex].click();
            }
        });
    }
});

// Action buttons functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize action buttons for all design cards
    const designCards = document.querySelectorAll('.design-card');
    
    designCards.forEach(card => {
        const favoriteBtn = card.querySelector('.btn-favorite');
        const shareBtn = card.querySelector('.btn-share');
        const compareBtn = card.querySelector('.btn-compare');
        
        // Favorite button functionality
        favoriteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const icon = this.querySelector('i');
            
            // Toggle favorite state
            this.classList.toggle('active');
            
            // Toggle between far (outlined) and fas (filled) classes
            if (this.classList.contains('active')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = '#dc3545'; // Red color for filled heart
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '#333'; // Default color for outlined heart
            }
            
            // Show toast notification
            showToast(
                this.classList.contains('active') 
                    ? 'تمت الإضافة إلى المفضلة' 
                    : 'تمت الإزالة من المفضلة',
                'success'
            );
        });
        
        // Share button functionality
        shareBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const designTitle = card.querySelector('.design-title').textContent;
            const designImage = card.querySelector('img').src;
            
            // Create share data
            const shareData = {
                title: designTitle,
                text: 'تحقق من هذا التصميم الرائع!',
                url: window.location.href,
                image: designImage
            };
            
            // Try to use Web Share API
            if (navigator.share) {
                navigator.share(shareData)
                    .then(() => showToast('تمت المشاركة بنجاح', 'success'))
                    .catch(() => showToast('تم إلغاء المشاركة', 'info'));
            } else {
                // Fallback for browsers that don't support Web Share API
                const tempInput = document.createElement('input');
                document.body.appendChild(tempInput);
                tempInput.value = window.location.href;
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showToast('تم نسخ رابط التصميم', 'success');
            }
        });
        
        // Compare button functionality
        compareBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const icon = this.querySelector('i');
            
            // Toggle compare state
            this.classList.toggle('active');
            
            // Show toast notification
            showToast(
                this.classList.contains('active') 
                    ? 'تمت إضافة التصميم إلى المقارنة' 
                    : 'تمت إزالة التصميم من المقارنة',
                'info'
            );
            
            // Update comparison bar
            updateComparisonBar();
        });

        // Card click handler
        card.addEventListener('click', function(e) {
            // Only trigger if not clicking on action buttons
            if (!e.target.closest('.design-actions')) {
                // Get design data from the card
                const designTitle = this.querySelector('.design-title').textContent;
                
                // Navigate directly to request page
                window.location.href = `request.html?design=${encodeURIComponent(designTitle)}`;
            }
        });
    });
    
    // Comparison bar functionality
    function updateComparisonBar() {
        const selectedCards = document.querySelectorAll('.btn-compare.active');
        const comparisonBar = document.querySelector('.comparison-bar');
        
        if (selectedCards.length >= 2) {
            comparisonBar.classList.add('show');
            comparisonBar.querySelector('.selected-count').textContent = 
                `${selectedCards.length} تصاميم محددة`;
        } else {
            comparisonBar.classList.remove('show');
        }
    }
    
    // Toast notification function
    function showToast(message, type = 'info') {
        const toastContainer = document.querySelector('.toast-container') || createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        toastContainer.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    function createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }
});

// Add necessary styles
const style = document.createElement('style');
style.textContent = `
    .transition-all {
        transition: all 0.3s ease;
    }
    
    .hover-shadow:hover {
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }
    
    .thumbnail-btn {
        cursor: pointer;
        transition: all 0.3s ease;
        opacity: 0.7;
    }
    
    .thumbnail-btn:hover,
    .thumbnail-btn.active {
        opacity: 1;
        transform: scale(1.05);
    }
    
    .thumbnail-btn:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
    }
    
    .image-overlay {
        background: rgba(0, 0, 0, 0.5);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .design-image:hover .image-overlay {
        opacity: 1 !important;
    }
    
    .feature-item {
        transition: all 0.3s ease;
    }
    
    .feature-item:hover {
        background: rgba(255, 255, 255, 0.5);
        transform: translateX(-5px);
    }
    
    #mainDesignImage {
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);

// Add necessary styles
const modalStyles = document.createElement('style');
modalStyles.textContent = `
    .design-details-modal {
        --modal-animation-duration: 0.3s;
    }

    .fade-scale-in {
        animation: fadeScaleIn var(--modal-animation-duration) ease-out;
    }

    @keyframes fadeScaleIn {
        from {
            opacity: 0;
            transform: scale(0.95);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    .transition-rotate:hover {
        transform: rotate(90deg);
        transition: transform 0.3s ease;
    }

    .hover-scale {
        transition: transform 0.2s ease;
    }

    .hover-scale:hover:not(:disabled) {
        transform: scale(1.02);
    }

    .thumb-img {
        cursor: pointer;
        transition: transform 0.2s ease-in-out, border 0.2s, opacity 0.2s;
        border: 2px solid transparent;
        opacity: 0.7;
    }

    .thumb-img:hover {
        transform: scale(1.05);
        opacity: 1;
    }

    .thumb-img.active {
        border: 2px solid #f4a261;
        box-shadow: 0 0 5px rgba(244, 162, 97, 0.7);
        opacity: 1;
    }

    .floor-plans-scroll::-webkit-scrollbar {
        height: 6px;
    }

    .floor-plans-scroll::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 5px;
    }

    .spec-item, .feature-item {
        transition: transform 0.2s ease;
    }

    .spec-item:hover, .feature-item:hover {
        transform: translateX(-5px);
    }

    #mainDesignImage {
        transition: opacity 0.3s ease;
    }

    .image-loading-overlay {
        transition: opacity 0.3s ease;
    }

    @media (max-width: 991.98px) {
        .modal-body {
            padding: 1rem !important;
        }
    }
`;
document.head.appendChild(modalStyles);

// Add the updateMainImage function to the window object
window.updateMainImage = function(thumbnail) {
    const mainImage = document.getElementById("mainDesignImage");
    mainImage.src = thumbnail.src.replace("/100/100", "/600/400");

    // Remove active from all thumbnails
    document.querySelectorAll('.thumb-img').forEach(img => img.classList.remove('active'));
    // Add active to clicked one
    thumbnail.classList.add('active');
};

// Image Gallery Navigation
document.addEventListener('DOMContentLoaded', function() {
    const mainImage = document.querySelector('.main-image-container img');
    const thumbnails = document.querySelectorAll('.image-thumbnails .thumbnail');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    const imageCounter = document.querySelector('.image-counter');
    
    let currentImageIndex = 0;

    // Function to update the main image and counter
    function updateMainImage(index) {
        // Update main image
        mainImage.src = thumbnails[index].src;
        mainImage.alt = thumbnails[index].alt;
        
        // Update active thumbnail
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[index].classList.add('active');
        
        // Update counter
        imageCounter.textContent = `${index + 1}/${thumbnails.length}`;
    }

    // Previous button click handler
    prevBtn.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex - 1 + thumbnails.length) % thumbnails.length;
        updateMainImage(currentImageIndex);
    });

    // Next button click handler
    nextBtn.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex + 1) % thumbnails.length;
        updateMainImage(currentImageIndex);
    });

    // Thumbnail click handler
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', function() {
            currentImageIndex = index;
            updateMainImage(currentImageIndex);
        });
    });

    // Initialize the gallery
    updateMainImage(0);
});

// Floor Plans Functionality
document.addEventListener('DOMContentLoaded', function() {
    const floorTabs = document.querySelectorAll('.floor-tab');
    const floorPlanImage = document.querySelector('.floor-plans .main-image-container img');
    const floorCounter = document.querySelector('.floor-counter');
    
    let currentFloorIndex = 0;

    // Function to update floor plan
    function updateFloorPlan(index) {
        // Update active tab
        floorTabs.forEach(tab => tab.classList.remove('active'));
        floorTabs[index].classList.add('active');
        
        // Update floor counter
        floorCounter.textContent = `الطابق ${index + 1}/${floorTabs.length}`;
        
        // Update floor plan image
        // Note: In a real application, you would update the image source here
        // For now, we'll just toggle a class to show which floor is selected
        floorPlanImage.classList.remove('ground-floor', 'first-floor');
        floorPlanImage.classList.add(index === 0 ? 'ground-floor' : 'first-floor');
    }

    // Add click event listeners to floor tabs
    floorTabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            currentFloorIndex = index;
            updateFloorPlan(currentFloorIndex);
        });
    });

    // Initialize floor plan
    updateFloorPlan(0);
});

// Handle "متابعة الطلب" button click
document.addEventListener('DOMContentLoaded', function() {
    const continueButton = document.querySelector('.modal-footer .btn-primary');
    if (continueButton) {
        continueButton.addEventListener('click', function() {
            // Redirect to fill_info.html
            window.location.href = 'fill_info.html';
        });
    }
});

// Request Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const requestForm = document.getElementById('request-form');
    const backButton = document.getElementById('backButton');
    const notesTextarea = document.getElementById('notes');
    const charCount = document.getElementById('charCount');
    const submitButton = requestForm.querySelector('button[type="submit"]');

    // Character counter for notes
    if (notesTextarea && charCount) {
        notesTextarea.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            
            // Visual feedback when approaching limit
            if (count > 450) {
                charCount.style.color = '#dc3545';
            } else if (count > 400) {
                charCount.style.color = '#ffc107';
            } else {
                charCount.style.color = '#6c757d';
            }
        });

        // Auto-expand textarea
        notesTextarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }

    // Land selection enhancement
    const landSelect = document.getElementById('landSelection');
    const customLandDetails = document.getElementById('customLandDetails');
    const customLandInput = document.getElementById('customLandInput');
    const landMapInput = document.getElementById('landMap');
    const filePreview = document.getElementById('filePreview');
    const fileUploadLabel = document.querySelector('.file-upload-label');
    let selectedFile = null;

    if (landSelect) {
        landSelect.addEventListener('change', function() {
            this.classList.remove('is-invalid');
            if (this.value) {
                this.classList.add('is-valid');
            }

            // Show/hide custom land input and file upload
            if (this.value === 'other') {
                customLandDetails.classList.remove('d-none');
                customLandInput.required = true;
                landMapInput.required = true;
                // Focus the input field
                customLandInput.focus();
            } else {
                customLandDetails.classList.add('d-none');
                customLandInput.required = false;
                landMapInput.required = false;
                // Reset file upload
                resetFileUpload();
            }
        });

        // Handle custom land input validation
        customLandInput.addEventListener('input', function() {
            validateCustomLandInput(this);
        });

        // File Upload Handling
        landMapInput.addEventListener('change', handleFileSelect);

        // Drag and Drop
        fileUploadLabel.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.parentElement.classList.add('drag-over');
        });

        fileUploadLabel.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.parentElement.classList.remove('drag-over');
        });

        fileUploadLabel.addEventListener('drop', function(e) {
            e.preventDefault();
            this.parentElement.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length) {
                landMapInput.files = files;
                handleFileSelect({ target: landMapInput });
            }
        });

        // Remove file button
        document.addEventListener('click', function(e) {
            if (e.target.closest('.remove-file')) {
                resetFileUpload();
            }
        });
    }

    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                showError('يرجى تحميل ملف PDF أو صورة');
                resetFileUpload();
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showError('حجم الملف يجب أن لا يتجاوز 5 ميجابايت');
                resetFileUpload();
                return;
            }

            // Generate a unique filename
            const timestamp = new Date().getTime();
            const extension = file.name.split('.').pop();
            const safeFileName = `land-map-${timestamp}.${extension}`;

            selectedFile = {
                file: file,
                originalName: file.name,
                savedName: safeFileName,
                path: `/public/uploads/land-maps/${safeFileName}`
            };

            showFilePreview(selectedFile);
        }
    }

    function showFilePreview(fileData) {
        const fileName = document.querySelector('.file-name');
        fileName.textContent = fileData.originalName;
        filePreview.classList.remove('d-none');
        validateFileUpload();
    }

    function resetFileUpload() {
        landMapInput.value = '';
        selectedFile = null;
        filePreview.classList.add('d-none');
        validateFileUpload();
    }

    function validateFileUpload() {
        if (landMapInput.required && !selectedFile) {
            landMapInput.classList.add('is-invalid');
            return false;
        }
        landMapInput.classList.remove('is-invalid');
        return true;
    }

    function validateCustomLandInput(input) {
        if (input.required && !input.value.trim()) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            return false;
        }
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        return true;
    }

    function showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
        alert.style.zIndex = '1050';
        alert.innerHTML = `
            <i class="fas fa-exclamation-circle me-2"></i>
            ${message}
        `;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
    }

    // Update form submission to handle file upload
    if (requestForm) {
        requestForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Additional validation for custom land option
            if (landSelect.value === 'other') {
                if (!validateCustomLandInput(customLandInput) || !validateFileUpload()) {
                    this.classList.add('was-validated');
                    return;
                }
            }

            if (!this.checkValidity()) {
                e.stopPropagation();
                this.classList.add('was-validated');
                return;
            }

            // Show loading state
            submitButton.disabled = true;
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> جارٍ التحميل...';

            try {
                // Create FormData object
                const formData = new FormData();
                formData.append('designType', document.querySelector('input[name="designType"]:checked').value);
                formData.append('landSelection', landSelect.value);
                formData.append('landDetails', landSelect.value === 'other' ? customLandInput.value.trim() : '');
                formData.append('notes', document.getElementById('notes').value.trim());
                
                if (selectedFile) {
                    formData.append('landMap', selectedFile.file);
                    formData.append('landMapPath', selectedFile.path);
                }

                // Store in session storage (except file)
                const storageData = {
                    designType: formData.get('designType'),
                    landSelection: formData.get('landSelection'),
                    landDetails: formData.get('landDetails'),
                    notes: formData.get('notes'),
                    landMapInfo: selectedFile ? {
                        originalName: selectedFile.originalName,
                        savedName: selectedFile.savedName,
                        path: selectedFile.path
                    } : null
                };
                sessionStorage.setItem('requestData', JSON.stringify(storageData));

                // Show success message
                const alert = document.createElement('div');
                alert.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
                alert.style.zIndex = '1050';
                alert.innerHTML = `
                    <i class="fas fa-check-circle me-2"></i>
                    تم حفظ البيانات بنجاح
                `;
                document.body.appendChild(alert);

                // Remove alert and redirect
                setTimeout(() => {
                    alert.remove();
                    window.location.href = 'request.html';
                }, 1500);

            } catch (error) {
                console.error('Error submitting form:', error);
                showError('حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.');
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        });
    }

    // Back button handler
    if (backButton) {
        backButton.addEventListener('click', function() {
            // Show confirmation if form has been modified
            if (requestForm.classList.contains('was-validated') || notesTextarea.value.trim() !== '') {
                if (confirm('هل أنت متأكد من الرجوع؟ سيتم فقدان البيانات المدخلة.')) {
                    window.history.back();
                }
            } else {
                window.history.back();
            }
        });
    }

    // Design type radio button enhancement
    const designTypeRadios = document.querySelectorAll('input[name="designType"]');
    designTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Remove active class from all labels
            designTypeRadios.forEach(r => {
                r.nextElementSibling.classList.remove('active');
            });
            
            // Add active class to selected label
            if (this.checked) {
                this.nextElementSibling.classList.add('active');
            }
        });
    });
});

// Payment Button Handling
document.addEventListener('DOMContentLoaded', function() {
    const paymentButton = document.getElementById('paymentButton');
    const proceedButton = document.getElementById('proceedButton');
    if (!paymentButton || !proceedButton) return;

    let paymentSelected = false;

    paymentButton.addEventListener('click', function() {
        if (!paymentSelected) {
            // Show success state for payment selection
            showSuccessMessage('تم اختيار طريقة الدفع بنجاح');
            
            // Enable proceed button with animation
            proceedButton.disabled = false;
            proceedButton.classList.add('enabled');
            
            // Update payment button state
            this.classList.add('selected');
            paymentSelected = true;
        }
    });

    proceedButton.addEventListener('click', async function() {
        if (!paymentSelected) return;

        // Show loading state
        this.disabled = true;
        const originalHtml = this.innerHTML;
        this.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            جارٍ المعالجة...
        `;

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            showSuccessMessage('تم الدفع بنجاح');

            // Redirect after success
            setTimeout(() => {
                window.location.href = 'confirmation.html';
            }, 1500);

        } catch (error) {
            // Show error message
            showErrorMessage('حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.');
            
            // Re-enable button
            this.disabled = false;
            this.innerHTML = originalHtml;
        }
    });

    function showSuccessMessage(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
        alert.style.zIndex = '1050';
        alert.innerHTML = `
            <i class="fas fa-check-circle me-2"></i>
            ${message}
        `;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
    }

    function showErrorMessage(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
        alert.style.zIndex = '1050';
        alert.innerHTML = `
            <i class="fas fa-exclamation-circle me-2"></i>
            ${message}
        `;
        document.body.appendChild(alert);
        setTimeout(() => alert.remove(), 3000);
    }
});

// Timeline Steps Animation
function initializeTimeline() {
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;

    function activateStep(index) {
        steps.forEach((step, i) => {
            if (i <= index) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    // Animate steps one by one
    function animateSteps() {
        if (currentStep < steps.length) {
            activateStep(currentStep);
            currentStep++;
            setTimeout(animateSteps, 800);
        }
    }

    // Start animation after a short delay
    setTimeout(animateSteps, 500);
}

// Next Steps Collapse
function initializeNextSteps() {
    const toggleBtn = document.querySelector('.next-steps-toggle');
    const nextStepsContent = document.querySelector('.next-steps-content');
    
    if (toggleBtn && nextStepsContent) {
        toggleBtn.addEventListener('click', () => {
            const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            toggleBtn.setAttribute('aria-expanded', !isExpanded);
            nextStepsContent.classList.toggle('show');
            
            // Update icon
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                icon.className = isExpanded ? 'fas fa-chevron-down' : 'fas fa-chevron-up';
            }
        });
    }
}

// Star Rating Handler
function initializeStarRating() {
    const stars = document.querySelectorAll('.star-rating input');
    const feedbackSection = document.querySelector('.feedback-section');
    const googleReviewPrompt = document.getElementById('googleReviewPrompt');
    const submitFeedbackBtn = document.getElementById('submitFeedback');
    const feedbackText = document.getElementById('feedbackText');
    const googleReviewUrl = 'https://g.page/r/YOUR-GOOGLE-REVIEW-URL'; // Replace with your Google review URL
    
    stars.forEach(star => {
        star.addEventListener('change', (e) => {
            const rating = parseInt(e.target.value);
            
            // Show feedback section only for ratings less than 4
            if (rating < 4) {
                feedbackSection.style.display = 'block';
                googleReviewPrompt.style.display = 'none';
            } else {
                // For 4-5 stars, show Google review prompt
                feedbackSection.style.display = 'none';
                googleReviewPrompt.style.display = 'block';
            }
        });
    });

    // Handle feedback submission
    submitFeedbackBtn.addEventListener('click', () => {
        const feedback = feedbackText.value.trim();
        const rating = document.querySelector('input[name="rating"]:checked').value;
        
        if (feedback) {
            // Here you would typically send the feedback to your server
            console.log('Feedback submitted:', { rating, feedback });
            
            // Show success message
            showSuccess('شكراً لتعليقك! تم إرسال ملاحظاتك بنجاح.');
            
            // Reset form
            feedbackText.value = '';
            feedbackSection.style.display = 'none';
            document.querySelectorAll('input[name="rating"]').forEach(radio => radio.checked = false);
        } else {
            showError('يرجى إدخال تعليقك قبل الإرسال');
        }
    });
}

// Google Review Functions
function redirectToGoogleReview() {
    window.open(googleReviewUrl, '_blank');
    submitFeedbackOnly();
}

function submitFeedbackOnly() {
    const feedback = document.getElementById('feedbackText').value.trim();
    const rating = document.querySelector('input[name="rating"]:checked').value;
    
    if (feedback) {
        // Here you would typically send the feedback to your server
        console.log('Feedback submitted:', { rating, feedback });
        showSuccess('شكراً لتعليقك! تم إرسال ملاحظاتك بنجاح.');
    }
    
    // Reset form
    document.getElementById('feedbackText').value = '';
    document.querySelector('.feedback-section').style.display = 'none';
    document.querySelectorAll('input[name="rating"]').forEach(radio => radio.checked = false);
}

// Initialize confirmation page features
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.timeline-steps')) {
        initializeTimeline();
    }
    
    if (document.querySelector('.next-steps')) {
        initializeNextSteps();
    }
    
    if (document.querySelector('.star-rating')) {
        initializeStarRating();
    }
}); 