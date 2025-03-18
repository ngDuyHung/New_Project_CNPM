import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isWakingServer, setIsWakingServer] = useState(false);
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Function to wake up the server
  const wakeUpServer = async () => {
    try {
      setIsWakingServer(true);
      const response = await fetch('/api/health');
      if (response.ok) {
        console.log('Server is awake and ready');
      }
    } catch (error) {
      console.log('Waking up the server...', error);
    } finally {
      setIsWakingServer(false);
    }
  };

  // Wake up server on page load
  useEffect(() => {
    wakeUpServer();
  }, []);

  // Navigation with server wake up
  const handleNavigation = (path) => {
    wakeUpServer();
    navigate(path);
  };

  // Testimonials data
  const testimonials = [
    {
      content: "Tôi đã thử nhiều ứng dụng học ngôn ngữ, nhưng VocabMaster thực sự nổi bật. Phương pháp cá nhân hóa đã giúp tôi cải thiện kỹ năng giao tiếp chỉ trong 3 tháng!",
      name: "Huy An",
      position: "Chuyên viên kinh doanh",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      content: "Tính năng từ điển thật tuyệt vời! Nó không chỉ cung cấp bản dịch mà còn cho thấy cách từ được sử dụng trong các ngữ cảnh khác nhau. Hoàn hảo để mở rộng vốn từ vựng.",
      name: "Linh Trần",
      position: "Sinh viên đại học",
      rating: 4.5,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      content: "Là một giáo viên, tôi khuyên tất cả học sinh của mình sử dụng VocabMaster. Tính năng theo dõi tiến độ giúp tôi xác định những lĩnh vực học sinh cần hỗ trợ thêm.",
      name: "Hoàng Phúc",
      position: "Giáo viên tiếng Anh",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/62.jpg"
    }
  ];

  const pricingPlans = [
    {
      name: "Miễn Phí",
      price: "0",
      unit: "đ",
      period: "/tháng",
      popular: false,
      features: [
        { text: "Bài tập từ vựng cơ bản", included: true },
        { text: "Truy cập từ điển giới hạn", included: true },
        { text: "Nhắc nhở luyện tập hàng ngày", included: true },
        { text: "Theo dõi tiến độ cho 1 kỹ năng", included: true },
        { text: "Luyện phát âm", included: false },
        { text: "Lộ trình học cá nhân hóa", included: false }
      ],
      buttonText: "Bắt Đầu Miễn Phí",
      buttonLink: "/register",
      secondary: true
    },
    {
      name: "Premium",
      price: "199",
      unit: "K",
      period: "/tháng",
      popular: true,
      features: [
        { text: "Tất cả tính năng miễn phí", included: true },
        { text: "Truy cập đầy đủ từ điển", included: true },
        { text: "Bài học ngữ pháp nâng cao", included: true },
        { text: "Luyện phát âm hoàn chỉnh", included: true },
        { text: "Phân tích tiến độ đầy đủ", included: true },
        { text: "Lộ trình học cá nhân hóa", included: true }
      ],
      buttonText: "Đăng Ký Premium",
      buttonLink: "/register",
      secondary: false
    },
    {
      name: "Doanh Nghiệp",
      price: "499",
      unit: "K",
      period: "/tháng",
      popular: false,
      features: [
        { text: "Tất cả tính năng Premium", included: true },
        { text: "Từ vựng chuyên ngành", included: true },
        { text: "Luyện viết email chuyên nghiệp", included: true },
        { text: "Chuẩn bị phỏng vấn", included: true },
        { text: "Hỗ trợ học nhóm", included: true },
        { text: "Dịch vụ khách hàng ưu tiên", included: true }
      ],
      buttonText: "Đăng Ký Doanh Nghiệp",
      buttonLink: "/register",
      secondary: true
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header with Glassmorphism */}
      <header className="sticky top-0 z-50 px-6 py-4 backdrop-blur-md bg-white/70 border-b border-gray-200">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-indigo-700"
          >
            VocabMaster
          </motion.div>
          
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Tính Năng</a>
            <a href="#howItWorks" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Cách Học</a>
            <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Đánh Giá</a>
            <a href="#pricing" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">Bảng Giá</a>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4 items-center"
          >
            <button 
              onClick={() => handleNavigation('/login')}
              className="px-4 py-2 text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
            >
              Đăng nhập
            </button>
            <button 
              onClick={() => handleNavigation('/login')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all duration-300 hover:shadow-lg"
            >
              Đăng ký
            </button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section with Enhanced Animation */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={staggerChildren}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <motion.div 
              variants={fadeInUp}
              className="md:w-1/2"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6">
                Master English <span className="text-indigo-600 block">Nhanh Hơn & Thông Minh Hơn</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Học tiếng Anh hiệu quả với bài học được cá nhân hóa, bài tập tương tác và phản hồi tức thì
                được hỗ trợ bởi công nghệ học tập AI tiên tiến.
              </p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                variants={fadeInUp}
              >
                <button 
                  onClick={() => handleNavigation('/login')}
                  className="group px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-center rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Bắt đầu học ngay
                  <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
                </button>
                <button 
                  onClick={() => handleNavigation('/login')}
                  className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-50 transition-all duration-300 hover:shadow-md flex items-center justify-center"
                >
                  Xem Demo
                  <i className="fas fa-play-circle ml-2"></i>
                </button>
              </motion.div>

              {/* Stats Section */}
              <motion.div 
                variants={fadeInUp}
                className="flex flex-wrap justify-start gap-10 mt-12"
              >
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-600">15k+</p>
                  <p className="text-gray-600">Người Học</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-600">500+</p>
                  <p className="text-gray-600">Bài Học</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-indigo-600">4.8/5</p>
                  <p className="text-gray-600">Đánh Giá</p>
                </div>
              </motion.div>
            </motion.div>
            <motion.div 
              variants={fadeInUp}
              className="md:w-1/2"
            >
              <motion.img 
                src="/images/vocabulary-learning.svg" 
                alt="Học từ vựng" 
                className="w-full h-auto max-w-md mx-auto drop-shadow-2xl"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/600x400?text=Vocabulary+Learning';
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Cards Animation */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Tại Sao Chọn <span className="text-indigo-600">VocabMaster</span>?
            </h2>
            <p className="text-lg text-gray-600">
              Ứng dụng của chúng tôi được thiết kế dành riêng cho bạn, kết hợp các phương pháp học ngôn ngữ tốt nhất với công nghệ hiện đại
            </p>
          </motion.div>
          
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <i className="fas fa-book-reader text-indigo-600 text-2xl"></i>,
                title: "Học Tập Cá Nhân Hóa",
                description: "Bài học thích ứng với tốc độ và phong cách học của bạn, đảm bảo tiến độ hiệu quả."
              },
              {
                icon: <i className="fas fa-headphones text-indigo-600 text-2xl"></i>,
                title: "Phát Âm Chuẩn",
                description: "Hoàn thiện giọng điệu của bạn với âm thanh từ người bản xứ và công nghệ nhận diện giọng nói."
              },
              {
                icon: <i className="fas fa-chart-line text-indigo-600 text-2xl"></i>,
                title: "Theo Dõi Tiến Độ",
                description: "Phân tích chi tiết và thông tin chi tiết để theo dõi hành trình học tập và thành tích của bạn."
              },
              {
                icon: <i className="fas fa-gamepad text-indigo-600 text-2xl"></i>,
                title: "Bài Tập Tương Tác",
                description: "Các hoạt động vui nhộn và hấp dẫn giúp việc học trở nên thú vị và hiệu quả."
              },
              {
                icon: <i className="fas fa-globe text-indigo-600 text-2xl"></i>,
                title: "Từ Điển Toàn Diện",
                description: "Cơ sở dữ liệu từ vựng mở rộng với ví dụ, định nghĩa và ngữ cảnh sử dụng."
              },
              {
                icon: <i className="fas fa-mobile-alt text-indigo-600 text-2xl"></i>,
                title: "Học Mọi Lúc, Mọi Nơi",
                description: "Truy cập bài học trên mọi thiết bị với đồng bộ hóa tiến độ liền mạch."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="p-6 bg-white rounded-xl hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="howItWorks" className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Cách <span className="text-indigo-600">VocabMaster</span> Hoạt Động
            </h2>
            <p className="text-lg text-gray-600">
              Bắt đầu chỉ với vài bước đơn giản và khởi đầu hành trình thành thạo tiếng Anh của bạn
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto">
            {[
              {
                step: 1,
                title: "Kiểm Tra Trình Độ",
                description: "Bắt đầu với bài đánh giá nhanh để xác định trình độ hiện tại và tùy chỉnh lộ trình học tập của bạn.",
                image: "https://placehold.co/600x400?text=Kiểm+Tra+Trình+Độ"
              },
              {
                step: 2,
                title: "Nhận Lộ Trình Cá Nhân",
                description: "Được cung cấp chương trình học phù hợp với nhu cầu và mục tiêu học tập cụ thể của bạn.",
                image: "https://placehold.co/600x400?text=Lộ+Trình+Cá+Nhân"
              },
              {
                step: 3,
                title: "Luyện Tập Hàng Ngày",
                description: "Tham gia các bài học tương tác kết hợp kỹ năng đọc, viết, nghe và nói tiếng Anh.",
                image: "https://placehold.co/600x400?text=Luyện+Tập+Hàng+Ngày"
              },
              {
                step: 4,
                title: "Theo Dõi Tiến Độ",
                description: "Giám sát sự tiến bộ của bạn với số liệu thống kê chi tiết và ăn mừng thành tích đạt được.",
                image: "https://placehold.co/600x400?text=Theo+Dõi+Tiến+Độ"
              }
            ].map((item, index) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                key={index}
                className={`flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 mb-20 last:mb-0`}
              >
                <div className="md:w-1/2">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                      {item.step}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">{item.title}</h3>
                  </div>
                  <p className="text-gray-600 ml-14">{item.description}</p>
                </div>
                <div className="md:w-1/2">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-auto rounded-xl shadow-lg"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-white py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Câu Chuyện <span className="text-indigo-600">Thành Công</span>
            </h2>
            <p className="text-lg text-gray-600">
              Lắng nghe từ những người dùng đã cải thiện kỹ năng tiếng Anh với VocabMaster
            </p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto relative">
            <div className="overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                key={activeTestimonial}
                className="bg-white rounded-2xl shadow-lg p-8 md:p-10"
              >
                <div className="text-indigo-500 text-2xl mb-6">
                  <i className="fas fa-quote-left"></i>
                </div>
                <p className="text-lg md:text-xl text-gray-700 italic mb-6">
                  {testimonials[activeTestimonial].content}
                </p>
                <div className="flex items-center">
                  <img 
                    src={testimonials[activeTestimonial].avatar} 
                    alt={testimonials[activeTestimonial].name}
                    className="w-14 h-14 rounded-full mr-4 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/100x100?text=User';
                    }}
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-gray-600 text-sm">{testimonials[activeTestimonial].position}</p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`${
                            i < Math.floor(testimonials[activeTestimonial].rating) 
                              ? 'fas fa-star text-yellow-400' 
                              : i < testimonials[activeTestimonial].rating 
                                ? 'fas fa-star-half-alt text-yellow-400' 
                                : 'far fa-star text-yellow-400'
                          } mr-1`}
                        ></i>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="flex justify-center mt-10 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    activeTestimonial === index 
                      ? 'bg-indigo-600 w-10' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Testimonial ${index + 1}`}
                ></button>
              ))}
            </div>
            
            <div className="flex justify-center mt-8 gap-4">
              <button 
                onClick={() => setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Previous testimonial"
              >
                <i className="fas fa-chevron-left text-gray-600"></i>
              </button>
              <button 
                onClick={() => setActiveTestimonial((prev) => (prev + 1) % testimonials.length)}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Next testimonial"
              >
                <i className="fas fa-chevron-right text-gray-600"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Bảng Giá <span className="text-indigo-600">Minh Bạch</span>
            </h2>
            <p className="text-lg text-gray-600">
              Chọn gói phù hợp với nhu cầu học tập của bạn
            </p>
          </motion.div>
          
          <div className="flex flex-wrap justify-center gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                key={index}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden max-w-sm w-full relative ${
                  plan.popular ? 'border-2 border-indigo-500 md:scale-110 z-10' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-indigo-500 text-white px-4 py-1 text-sm font-medium rounded-bl-lg">
                    Phổ Biến Nhất
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{plan.name}</h3>
                  <div className="flex items-end mb-8">
                    <div className="flex items-start">
                      <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                      <span className="text-xl font-semibold text-gray-800 ml-1">{plan.unit}</span>
                    </div>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <i className={`${
                          feature.included 
                            ? 'fas fa-check text-green-500' 
                            : 'fas fa-times text-gray-400'
                        } mt-1 mr-3`}></i>
                        <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    onClick={() => handleNavigation(plan.buttonLink)}
                    className={`block w-full py-3 px-4 rounded-full text-center font-semibold transition-all duration-300 ${
                      plan.secondary
                        ? 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action with Gradient */}
      <section className="py-20 bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container mx-auto px-6 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng nâng cao vốn từ vựng của bạn?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Tham gia cùng hàng nghìn học viên đã cải thiện kỹ năng ngôn ngữ với nền tảng của chúng tôi.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => handleNavigation('/register')}
              className="px-8 py-4 bg-white text-indigo-600 rounded-full hover:shadow-lg transition-all duration-300 inline-block font-semibold"
              disabled={isWakingServer}
            >
              {isWakingServer ? (
                <>
                  <span className="inline-block mr-2 animate-spin">⟳</span>
                  Đang chuẩn bị...
                </>
              ) : (
                'Bắt đầu học ngay'
              )}
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer with Modern Design */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
            <div className="md:col-span-2 space-y-6">
              <div className="text-2xl font-bold">VocabMaster</div>
              <p className="text-gray-400 max-w-md">
                Học tiếng Anh hiệu quả với các bài học được cá nhân hóa, bài tập tương tác và phản hồi tức thì được 
                hỗ trợ bởi công nghệ học tập tiên tiến.
              </p>
              <div className="flex space-x-5">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Sản phẩm</h3>
              <ul className="space-y-4">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Tính Năng</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Bảng Giá</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Dành Cho Giáo Viên</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Dành Cho Trường Học</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Công ty</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Về Chúng Tôi</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Tuyển Dụng</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Báo Chí</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Hỗ trợ</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Trung Tâm Hỗ Trợ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Câu Hỏi Thường Gặp</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Liên Hệ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Điều Khoản Sử Dụng</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Chính Sách Bảo Mật</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 VocabMaster. Bản quyền thuộc về VocabMaster</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 
