// Xử lý menu di động và các tính năng tương tác
document.addEventListener('DOMContentLoaded', function() {
    // Thêm liên kết bỏ qua đến nội dung chính cho trình đọc màn hình
    const skipLink = document.createElement('a');
    skipLink.href = '#features';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Bỏ qua đến nội dung chính';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Hàm đánh thức server backend trước khi chuyển hướng
    const preloadBackend = async function(event, linkElement) {
        // Ngăn chặn chuyển hướng ngay lập tức
        event.preventDefault();
        
        const targetHref = linkElement.getAttribute('href');
        
        // Hiển thị hiệu ứng loading trên nút
        const originalText = linkElement.textContent;
        const originalStyles = {
            backgroundColor: linkElement.style.backgroundColor,
            cursor: linkElement.style.cursor
        };
        
        linkElement.textContent = 'Đang kết nối...';
        
        if (linkElement.classList.contains('primary-btn')) {
            linkElement.style.backgroundColor = '#6366f1'; // Màu nhạt hơn
        } else if (linkElement.classList.contains('secondary-btn')) {
            linkElement.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
        }
        linkElement.style.cursor = 'wait';
        
        try {
            // Gọi API /api/health để đánh thức server
            const backendUrl = window.location.origin + '/api/health';
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), 4000) // Timeout sau 4 giây
            );
            
            const fetchPromise = fetch(backendUrl, { method: 'GET' });
            
            // Sử dụng Promise.race để thực hiện theo hành động đầu tiên hoàn thành
            await Promise.race([fetchPromise, timeoutPromise]);
            
            // Chuyển hướng sau khi gọi API thành công hoặc timeout
            setTimeout(() => {
                window.location.href = targetHref;
            }, 200);
        } catch (error) {
            console.warn('Failed to preload backend, redirecting anyway:', error);
            
            // Nếu lỗi, vẫn chuyển hướng sau 200ms
            setTimeout(() => {
                window.location.href = targetHref;
            }, 200);
        }
    };
    
    // Thêm sự kiện cho tất cả các nút đăng nhập/đăng ký
    const authLinks = document.querySelectorAll('a[href="/login"]');
    authLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            preloadBackend(e, this);
        });
    });
    
    // Xử lý menu di động
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    let mobileMenu = null;
    
    if (menuToggle) {
        const createMobileMenu = () => {
            if (mobileMenu) return;
            
            mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu';
            
            // Sao chép các liên kết từ desktop nav
            const navLinksMobile = navLinks.cloneNode(true);
            const authButtonsMobile = authButtons.cloneNode(true);
            
            mobileMenu.appendChild(navLinksMobile);
            mobileMenu.appendChild(authButtonsMobile);
            
            document.body.appendChild(mobileMenu);
            
            // Thêm sự kiện click cho các liên kết trong menu di động
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
            
            // Tắt cuộn trang khi menu mở
            document.body.style.overflow = 'hidden';
        };
        
        const openMobileMenu = () => {
            createMobileMenu();
            mobileMenu.style.display = 'block';
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            
            // Thêm animation hiển thị
            setTimeout(() => {
                mobileMenu.style.opacity = '1';
            }, 10);
        };
        
        function closeMobileMenu() {
            if (!mobileMenu) return;
            
            mobileMenu.style.opacity = '0';
            
            setTimeout(() => {
                mobileMenu.style.display = 'none';
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                // Khôi phục cuộn trang
                document.body.style.overflow = '';
            }, 300);
        }
        
        menuToggle.addEventListener('click', function() {
            if (!mobileMenu || mobileMenu.style.display === 'none') {
                openMobileMenu();
            } else {
                closeMobileMenu();
            }
        });
        
        // Đóng menu khi bấm nút ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu && mobileMenu.style.display !== 'none') {
                closeMobileMenu();
            }
        });
        
        // Đóng menu khi bấm bên ngoài
        document.addEventListener('click', function(e) {
            if (mobileMenu && mobileMenu.style.display !== 'none' && 
                !mobileMenu.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
    }
    
    // Lazy loading cho hình ảnh
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Trình duyệt hỗ trợ lazy loading tự động
        lazyImages.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
        });
    } else {
        // Polyfill cho trình duyệt không hỗ trợ
        const lazyImageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            lazyImageObserver.observe(img);
        });
    }
    
    // Xử lý testimonial slider
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    const testimonials = document.querySelectorAll('.testimonial-card');
    
    if (dots.length > 0 && testimonials.length > 0) {
        // Ẩn tất cả testimonials và chỉ hiển thị cái đầu tiên
        testimonials.forEach((testimonial, index) => {
            testimonial.style.display = index === 0 ? 'block' : 'none';
        });
        
        // Thêm sự kiện click cho mỗi dot
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                // Đánh dấu dot hiện tại là active
                dots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                
                // Ẩn tất cả testimonials và hiển thị testimonial được chọn với hiệu ứng fade
                testimonials.forEach(testimonial => {
                    testimonial.style.opacity = '0';
                    setTimeout(() => {
                        testimonial.style.display = 'none';
                    }, 300);
                });
                
                // Hiển thị testimonial được chọn
                setTimeout(() => {
                    testimonials[index].style.display = 'block';
                    setTimeout(() => {
                        testimonials[index].style.opacity = '1';
                    }, 50);
                }, 300);
            });
        });
        
        // Thiết lập CSS cho hiệu ứng fade
        testimonials.forEach(testimonial => {
            testimonial.style.transition = 'opacity 0.3s ease';
            testimonial.style.opacity = testimonial.style.display === 'block' ? '1' : '0';
        });
        
        // Auto-rotate testimonials
        let currentTestimonial = 0;
        
        function rotateTestimonials() {
            // Chỉ thay đổi nếu người dùng không đang tương tác với trang
            if (document.visibilityState === 'visible' && !document.body.classList.contains('user-is-interacting')) {
                dots.forEach(dot => dot.classList.remove('active'));
                testimonials.forEach(testimonial => {
                    testimonial.style.opacity = '0';
                    setTimeout(() => {
                        testimonial.style.display = 'none';
                    }, 300);
                });
                
                currentTestimonial = (currentTestimonial + 1) % testimonials.length;
                
                setTimeout(() => {
                    testimonials[currentTestimonial].style.display = 'block';
                    dots[currentTestimonial].classList.add('active');
                    setTimeout(() => {
                        testimonials[currentTestimonial].style.opacity = '1';
                    }, 50);
                }, 300);
            }
        }
        
        // Chuyển testimonial mỗi 5 giây
        if (testimonials.length > 1) {
            const rotationInterval = setInterval(rotateTestimonials, 5000);
            
            // Tạm dừng rotation khi người dùng tương tác
            document.addEventListener('mousedown', function() {
                document.body.classList.add('user-is-interacting');
                setTimeout(() => {
                    document.body.classList.remove('user-is-interacting');
                }, 10000); // Khôi phục sau 10 giây
            });
            
            // Xóa interval khi người dùng rời trang
            window.addEventListener('beforeunload', function() {
                clearInterval(rotationInterval);
            });
        }
    }
    
    // Animation khi cuộn trang
    const animateOnScroll = function() {
        const elements = document.querySelectorAll(
            '.feature-card, .step, .pricing-card, .testimonial-card, .section-header'
        );
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // Thêm class visible khi phần tử hiển thị trong viewport
            if (elementPosition < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    };
    
    // CSS cho animation
    const style = document.createElement('style');
    style.textContent = `
        .feature-card, .step, .pricing-card, .testimonial-card, .section-header {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .feature-card.visible, .step.visible, .pricing-card.visible, 
        .testimonial-card.visible, .section-header.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .step:nth-child(odd) {
            transform: translateX(-20px);
        }
        
        .step:nth-child(even) {
            transform: translateX(20px);
        }
        
        .step.visible {
            transform: translateX(0);
        }
        
        .mobile-menu {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Tối ưu hiệu suất với requestAnimationFrame
    let scrollTicking = false;
    
    window.addEventListener('scroll', function() {
        if (!scrollTicking) {
            window.requestAnimationFrame(function() {
                animateOnScroll();
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });
    
    // Kích hoạt animation cho các phần tử hiển thị ngay khi tải trang
    animateOnScroll();
    
    // Smooth scroll cho các liên kết neo
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Chỉ xử lý các liên kết neo, không kích hoạt cho các liên kết khác
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Kiểm tra hỗ trợ scrollIntoView
                    if (targetElement.scrollIntoView) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    } else {
                        // Fallback cho trình duyệt không hỗ trợ
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                        window.scrollTo(0, targetPosition);
                    }
                }
            }
        });
    });
    
    // Xử lý hiển thị menu khi cuộn
    let lastScrollTop = 0;
    let headerHeight = document.querySelector('header').offsetHeight;
    
    window.addEventListener('scroll', function() {
        if (!scrollTicking) {
            window.requestAnimationFrame(function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Ẩn/hiện menu khi cuộn
                if (scrollTop > headerHeight) {
                    if (scrollTop > lastScrollTop) {
                        // Cuộn xuống, ẩn menu
                        document.querySelector('nav').style.transform = 'translateY(-100%)';
                    } else {
                        // Cuộn lên, hiện menu
                        document.querySelector('nav').style.transform = 'translateY(0)';
                    }
                } else {
                    // Luôn hiển thị menu ở đầu trang
                    document.querySelector('nav').style.transform = 'translateY(0)';
                }
                
                lastScrollTop = scrollTop;
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    });
}); 
