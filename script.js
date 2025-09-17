// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handler
function handleSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const gender = formData.get('gender');
    let location = formData.get('location');
    const otherLocation = formData.get('other_location');
    const sizes = formData.get('sizes');
    const quantity = formData.get('quantity');
    
    // If location is "other" and there's a value in the other location field, use that
    if (location === 'other' && otherLocation) {
        location = otherLocation;
    }
    
    // Get selected clothes types
    const clothesTypes = [];
    const clothesCheckboxes = document.querySelectorAll('input[name="clothes_type"]:checked');
    clothesCheckboxes.forEach(checkbox => {
        clothesTypes.push(checkbox.value);
    });
    
    // Add other clothes types if specified
    const otherClothes = formData.get('other_clothes');
    if (otherClothes && clothesTypes.includes('others')) {
        // Replace 'others' with the actual specified clothes
        const othersIndex = clothesTypes.indexOf('others');
        clothesTypes[othersIndex] = otherClothes;
    }
    
    // Create WhatsApp message
    let whatsappMessage = `*New Clothing Donation from BBAXSHA*\n\n`;
    whatsappMessage += `*Name:* ${name}\n`;
    whatsappMessage += `*Phone:* ${phone}\n`;
    whatsappMessage += `*Gender:* ${gender}\n`;
    whatsappMessage += `*Location:* ${location}\n`;
    whatsappMessage += `*Types of Clothes:* ${clothesTypes.length > 0 ? clothesTypes.join(', ') : 'Not specified'}\n`;
    if (sizes) whatsappMessage += `*Sizes:* ${sizes}\n`;
    whatsappMessage += `*Quantity:* ${quantity}\n`;
    
    // Replace with your actual WhatsApp number (including country code, no + sign)
    const whatsappNumber = '9647511762295'; // Replace this with your actual WhatsApp number
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Show confirmation and reset form
    alert('Thank you for your generous donation! You will be redirected to WhatsApp to send your details.');
    event.target.reset();
    
    // Hide the other location field after form reset
    document.getElementById('other-location-group').style.display = 'none';
    // Hide the other clothes field after form reset
    document.getElementById('other-clothes-group').style.display = 'none';
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide floating action button based on scroll position
window.addEventListener('scroll', function() {
    const fab = document.querySelector('.fab');
    if (window.pageYOffset > 300) {
        fab.style.opacity = '1';
        fab.style.visibility = 'visible';
    } else {
        fab.style.opacity = '0';
        fab.style.visibility = 'hidden';
    }
});

// Add scroll-based header background opacity
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.pageYOffset > 100) {
        header.style.background = 'rgba(45, 80, 22, 0.95)';
    } else {
        header.style.background = 'linear-gradient(135deg, #2d5016, #4a7c59)';
    }
});

// Animate stats when they come into view
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const finalNumber = parseInt(stat.textContent.replace(/[^0-9]/g, ''));
        let currentNumber = 0;
        const increment = finalNumber / 100;
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                currentNumber = finalNumber;
                clearInterval(timer);
            }
            const suffix = stat.textContent.includes('+') ? '+' : 
                          stat.textContent.includes('%') ? '%' : '';
            stat.textContent = Math.floor(currentNumber) + suffix;
        }, 20);
    });
}

// Intersection Observer for stats animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
});

const impactSection = document.querySelector('.impact');
if (impactSection) {
    statsObserver.observe(impactSection);
}

// Add visual feedback for radio and checkbox selections
document.addEventListener('DOMContentLoaded', function() {
    const radioOptions = document.querySelectorAll('.radio-option, .checkbox-option');
    
    radioOptions.forEach(option => {
        option.addEventListener('click', function() {
            const input = this.querySelector('input');
            if (input.type === 'radio') {
                // Remove active state from other radio options in the same group
                const groupName = input.name;
                document.querySelectorAll(`input[name="${groupName}"]`).forEach(radio => {
                    radio.closest('.radio-option').classList.remove('active');
                });
            }
            
            if (input.checked || input.type === 'radio') {
                this.classList.add('active');
            } else {
                this.classList.remove('active');
            }
        });
    });
    
    // Handle "Other" location selection
    const locationRadios = document.querySelectorAll('input[name="location"]');
    const otherLocationGroup = document.getElementById('other-location-group');
    
    locationRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'other' && this.checked) {
                otherLocationGroup.style.display = 'block';
                otherLocationGroup.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                otherLocationGroup.style.display = 'none';
                // Clear the textarea when hiding
                document.getElementById('other-location').value = '';
            }
        });
    });
    
    // Handle "Others" clothing type selection
    const othersClothesCheckbox = document.querySelector('input[name="clothes_type"][value="others"]');
    const otherClothesGroup = document.getElementById('other-clothes-group');
    
    if (othersClothesCheckbox) {
        othersClothesCheckbox.addEventListener('change', function() {
            if (this.checked) {
                otherClothesGroup.style.display = 'block';
                otherClothesGroup.style.animation = 'fadeIn 0.3s ease-in';
            } else {
                otherClothesGroup.style.display = 'none';
                // Clear the textarea when hiding
                document.getElementById('other-clothes').value = '';
            }
        });
    }
});
