  document.addEventListener('DOMContentLoaded', function() {
            // QR Type Button Click Handler
            document.querySelectorAll('.qr-type-btn').forEach(button => {
                button.addEventListener('click', function() {
                    // Remove active class from all buttons
                    document.querySelectorAll('.qr-type-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Hide all form sections
                    document.querySelectorAll('.qr-form-section').forEach(section => {
                        section.classList.remove('active');
                    });
                    
                    // Update section title based on selected type
                    const sectionTitle = document.querySelector('.url-section-title');
                    const type = this.getAttribute('data-type');
                    
                    switch(type) {
                        case 'url':
                            sectionTitle.textContent = 'Enter your URL Here';
                            document.getElementById('url-form').classList.add('active');
                            break;
                        case 'text':
                            sectionTitle.textContent = 'Enter your Text Here';
                            document.getElementById('text-form').classList.add('active');
                            break;
                        case 'vcard':
                            sectionTitle.textContent = 'VCard QR Code';
                            document.getElementById('vcard-form').classList.add('active')
                            break;
                        case 'email':
                            sectionTitle.textContent = 'Email QR Code';
                            document.getElementById('email-form').classList.add('active');
                            break;
                        case 'sms':
                            sectionTitle.textContent = 'SMS QR Code';
                            document.getElementById('sms-form').classList.add('active');
                            break;
                    }
                });
            });
            
            // Generate QR Code Button Handler
            document.getElementById('generateQRBtn').addEventListener('click', function() {
                const activeType = document.querySelector('.qr-type-btn.active').getAttribute('data-type');
                
                let qrData = '';
                let isEmpty = true;
                
                switch(activeType) {
                    case 'email':
                        const emailTo = document.getElementById('email-to').value;
                        const emailSubject = document.getElementById('email-subject').value;
                        const emailMessage = document.getElementById('email-message').value;
                        
                        if (emailTo.trim()) {
                            isEmpty = false;
                            qrData = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailMessage)}`;
                        }
                        break;
                        
                    case 'url':
                        const url = document.getElementById('url-input').value;
                        if (url.trim()) {
                            isEmpty = false;
                            qrData = url.startsWith('http') ? url : 'https://' + url;
                        }
                        break;
                        
                    case 'text':
                        const text = document.getElementById('text-input').value;
                        if (text.trim()) {
                            isEmpty = false;
                            qrData = text;
                        }
                        break;
                        
                    case 'vcard':
                        const firstName = document.getElementById('vcard-firstname').value;
                        const lastName = document.getElementById('vcard-lastname').value;
                        const mobile = document.getElementById('vcard-mobile').value;
                        const phone = document.getElementById('vcard-phone').value;
                        const fax = document.getElementById('vcard-fax').value;
                        const email = document.getElementById('vcard-email').value;
                        const company = document.getElementById('vcard-company').value;
                        const job = document.getElementById('vcard-job').value;
                        const street = document.getElementById('vcard-street').value;
                        const city = document.getElementById('vcard-city').value;
                        const zip = document.getElementById('vcard-zip').value;
                        const state = document.getElementById('vcard-state').value;
                        const country = document.getElementById('vcard-country').value;
                        const website = document.getElementById('vcard-website').value;
                        
                        if (firstName.trim() || lastName.trim() || email.trim() || mobile.trim()) {
                            isEmpty = false;
                            qrData = `BEGIN:VCARD\nVERSION:3.0\nFN:${firstName} ${lastName}\nN:${lastName};${firstName};;;\n`;
                            if (mobile) qrData += `TEL;TYPE=CELL:${mobile}\n`;
                            if (phone) qrData += `TEL;TYPE=WORK:${phone}\n`;
                            if (fax) qrData += `TEL;TYPE=FAX:${fax}\n`;
                            if (email) qrData += `EMAIL:${email}\n`;
                            if (company) qrData += `ORG:${company}\n`;
                            if (job) qrData += `TITLE:${job}\n`;
                            if (street || city || state || zip || country) {
                                qrData += `ADR;TYPE=WORK:;;${street};${city};${state};${zip};${country}\n`;
                            }
                            if (website) qrData += `URL:${website}\n`;
                            qrData += 'END:VCARD';
                        }
                        break;
                        
                    case 'sms':
                        const smsPhone = document.getElementById('sms-phone').value;
                        const smsMessage = document.getElementById('sms-message').value;
                        
                        if (smsPhone.trim()) {
                            isEmpty = false;
                            qrData = `sms:${smsPhone}?body=${encodeURIComponent(smsMessage)}`;
                        }
                        break;
                }
                
                if (isEmpty) {
                    alert('Please enter some content to generate QR code');
                    return;
                }
                
                // Generate QR Code
                generateQRCode(qrData);
            });

            // QR Code Generation Function
            function generateQRCode(data) {
                const qrCodeDisplay = document.getElementById('qrCodeDisplay');
                const downloadBtn = document.getElementById('downloadBtn');
                
                // Clear previous QR code
                qrCodeDisplay.innerHTML = '';
                
                // Generate new QR code
                QRCode.toCanvas(qrCodeDisplay, data, {
                    width: 200,
                    height: 200,
                    margin: 2,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                }, function (error) {
                    if (error) {
                        console.error(error);
                        qrCodeDisplay.innerHTML = '<p style="color: red;">Error generating QR code</p>';
                        downloadBtn.disabled = true;
                    } else {
                        console.log('QR code generated successfully!');
                        downloadBtn.disabled = false;
                        
                        // Add download functionality
                        downloadBtn.onclick = function() {
                            const canvas = qrCodeDisplay.querySelector('canvas');
                            if (canvas) {
                                const link = document.createElement('a');
                                link.download = 'qrcode.png';
                                link.href = canvas.toDataURL();
                                link.click();
                            }
                        };
                    }
                });
            }
        });