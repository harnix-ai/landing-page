/**
 * Site copy, complete in both languages. Vietnamese is the source of truth —
 * it is what the design was reviewed in — and `en` must match its shape
 * exactly (the `Copy` type enforces that).
 *
 * Inline emphasis uses `**double asterisks**`; `<Rich>` in
 * `components/ui.tsx` turns those into the right element for the context
 * (a highlighter mark, a bold span, an accent span).
 *
 * Left untranslated on purpose: proper nouns (Harnix, OpenAI, LinkedIn),
 * the Run log's own event and state names (`user_message`, `completed`),
 * model names, the sample document's file name, and terms of art Vietnamese
 * uses as-is (Run, API key, widget, backend, streaming, shadow DOM, token,
 * design partner).
 */

export type Lang = "vi" | "en";

export const LANGS: Lang[] = ["vi", "en"];

const vi = {
  meta: {
    title: "Giao việc cho AI. Nắm từng bước.",
    description:
      "Harnix giúp doanh nghiệp đưa trợ lý AI vào app sẵn có, và thấy rõ từng câu trả lời: AI đã đọc tài liệu nào, làm những bước gì, tốn bao nhiêu.",
    skip: "Tới nội dung chính",
  },

  nav: {
    product: { label: "Sản phẩm", desc: "Harnix làm được gì" },
    run: { label: "Run engine", desc: "Xem AI làm từng bước" },
    pricing: { label: "Bảng giá", desc: "Từ 2,9 triệu/tháng" },
    faq: { label: "Hỏi đáp", desc: "Giải đáp nhanh" },
    blog: { label: "Blog", desc: "Nhật ký xây dựng" },
    docs: { label: "Tài liệu", desc: "Hướng dẫn tích hợp cho đội kỹ thuật" },
    docsSoon: "Sắp có",
    other: { label: "English", desc: "Switch to English" },
    cta: "Đặt lịch demo",
    menuOpen: "Mở menu",
    menuClose: "Đóng menu",
    home: "Harnix — Trang chủ",
  },

  hero: {
    kicker: "Nền tảng vận hành trợ lý AI cho",
    kickerEm: "doanh nghiệp",
    title: "Giao việc cho AI.",
    titleAccent: "Nắm từng bước.",
    sub: "Harnix giúp doanh nghiệp đưa trợ lý AI vào app sẵn có, và thấy rõ từng câu trả lời: AI đã đọc tài liệu nào, làm những bước gì, tốn bao nhiêu.",
    ctaDemo: "Đặt lịch demo",
    ctaVideo: "Xem video 40 giây",
    videoTitle: "Xem cả hành trình trong 40 giây",
    videoSub: "Từ một tổ chức trống tới trợ lý AI đang trả lời khách trong app mẫu.",
    videoAlt: "Video giới thiệu Harnix: xem cả hành trình trong 40 giây",
    play: "Phát video giới thiệu",
    soon: "Video sắp ra mắt",
    transcript: "Xem bản ghi nội dung",
  },

  proof: {
    title: "Chatbot khác chỉ trả lời.",
    titleAccent: "Harnix cho bạn thấy vì sao.",
    rows: [
      {
        title: "Câu trả lời có căn cứ",
        body: "Mỗi câu trả lời **dẫn được nguồn** từ tài liệu công ty, để đội ngũ **chủ động rà soát chất lượng** thay vì chờ phản hồi từ khách hàng.",
      },
      {
        title: "Ngân sách trong tầm kiểm soát",
        body: "Biết rõ **mỗi câu trả lời tốn bao nhiêu** là nền tảng để **lập kế hoạch chi phí** và tự tin mở rộng khi cần.",
      },
      {
        title: "Dữ liệu được bảo vệ",
        body: "Tài liệu nội bộ và hội thoại khách hàng được **lưu trữ tách biệt** và **xoá được theo yêu cầu**.",
      },
    ],
  },

  how: {
    label: "Cách hoạt động",
    title: "Tài liệu bạn đã có.",
    titleAccent: "Phần còn lại Harnix lo.",
    sub: "Không cần đội AI riêng, không cần xây hệ thống mới. Trợ lý dùng chính tài liệu công ty để trả lời khách ngay trong app bạn đang có.",
    youNeed: "Bạn chỉ cần",
    harnixDoes: "Harnix lo",
    tags: { available: "Có sẵn", soon: "Sắp có" },
    cards: [
      {
        title: "Trợ lý nắm chính sách công ty ngay từ ngày đầu",
        need: "Tải lên tài liệu đang dùng: chính sách, bảng giá, hướng dẫn (PDF, Word)",
        does: "Đọc, ghi nhớ và trả lời kèm trích dẫn đúng nguồn",
      },
      {
        title: "Trả lời nhất quán, đúng phạm vi bạn cho phép",
        need: "Mô tả vai trò trong vài câu, VD: “nhân viên CSKH, chỉ tư vấn đổi trả”",
        does: "Giữ trợ lý trong đúng phạm vi đó, không trả lời lan man",
      },
      {
        title: "Khách được phục vụ 24/7, chi phí minh bạch",
        need: "Đội kỹ thuật gắn khung chat vào app, có Harnix hỗ trợ trực tiếp",
        does: "Ghi lại từng bước và chi phí của từng câu trả lời",
      },
    ],
  },

  audiences: {
    title: "Quản AI như quản một nhân viên giỏi:",
    titleMuted: "có báo cáo, có kiểm soát, có ngân sách.",
    forLabel: "Dành cho",
    youGet: "Bạn nắm được:",
    biz: {
      name: "Ban điều hành & vận hành",
      gets: "AI đang làm gì, tốn bao nhiêu, và can thiệp lúc nào.",
      roles: ["Chủ doanh nghiệp", "Trưởng phòng CSKH", "Vận hành"],
    },
    bento: {
      report: {
        title: "Báo cáo từng việc",
        body: "Mỗi câu trả lời có biên bản riêng: AI đã đọc tài liệu nào, làm những bước gì.",
      },
      stop: {
        title: "Can thiệp tức thì",
        body: "Dừng một câu trả lời đang xử lý ngay khi thấy chưa ổn.",
      },
      cost: {
        figure: "~38đ",
        title: "Chi phí theo từng câu",
        body: "Biết chính xác mỗi câu trả lời, mỗi trợ lý tốn bao nhiêu.",
      },
      vendor: {
        title: "Không bị khoá nhà cung cấp",
        body: "Dùng OpenAI, mô hình tương thích hoặc tự triển khai, đổi khi cần.",
      },
      data: {
        title: "Dữ liệu tách riêng",
        body: "Mỗi doanh nghiệp một vùng dữ liệu; xoá dữ liệu cá nhân theo yêu cầu.",
      },
      durable: {
        title: "Không bỏ dở việc",
        body: "Hệ thống gặp sự cố, câu trả lời vẫn được hoàn thành.",
      },
    },
    dev: {
      name: "Đội kỹ thuật",
      gets: "tích hợp ra sao, an toàn thế nào, cần làm gì ở phía app.",
      roles: ["Giám đốc IT / CTO", "Developer"],
    },
    devCards: [
      {
        title: "API key chỉ ở máy chủ",
        body: "Backend đổi API key lấy token ngắn hạn cho từng người dùng. Trình duyệt không bao giờ thấy key.",
      },
      {
        title: "Streaming kèm trích dẫn",
        body: "Câu trả lời hiện dần theo thời gian thực, mỗi đoạn kèm nguồn tài liệu.",
      },
      {
        title: "Widget cách ly CSS",
        body: "Khung chat chạy trong shadow DOM, không ảnh hưởng giao diện app sẵn có.",
      },
      {
        title: "Model tuỳ chọn",
        body: "Endpoint OpenAI-compatible hoặc mô hình tự host.",
      },
    ],
    docsCta: "Đọc tài liệu tích hợp",
    runPostCta: "Vì sao mỗi câu trả lời là một Run",
  },

  run: {
    badge: "Tính năng cốt lõi · Run engine",
    title: "Mỗi câu trả lời là một",
    titleAccent: "Run",
    sub: "Run là biên bản làm việc của AI: ghi lại từng bước, đo đúng chi phí, dừng được giữa chừng và không bỏ dở kể cả khi hệ thống gặp sự cố.",
    steps: [
      {
        tag: "user_message",
        title: "Khách đặt câu hỏi",
        body: "Run được mở, ghi nhận câu hỏi và thời điểm.",
      },
      {
        tag: "tool_call · knowledge_search",
        title: "AI tra cứu tài liệu",
        body: "Tìm trong “Chính sách bảo hành.pdf”.",
      },
      {
        tag: "tool_result · 3 chunks",
        title: "Tìm thấy căn cứ",
        body: "3 đoạn liên quan, có trích dẫn nguồn.",
      },
      {
        tag: "llm_call · gpt-4o-mini",
        title: "Soạn câu trả lời",
        body: "Mô hình AI viết câu trả lời từ đúng các đoạn đó.",
      },
      {
        tag: "token_usage · 1,240 tokens",
        title: "Ghi nhận chi phí",
        body: "Chi phí của đúng câu trả lời này, tính theo lượng chữ AI đọc và viết.",
      },
      {
        tag: "state_change · completed",
        title: "Hoàn tất",
        body: "Có thể dừng giữa chừng nếu cần. Hệ thống gặp sự cố, Run vẫn chạy tiếp tới khi xong.",
      },
    ],
    viewsLabel: "Chọn góc nhìn",
    tabBiz: "Góc nhìn kinh doanh",
    tabDev: "Góc nhìn kỹ thuật",
    bizHead: "Nhật ký câu trả lời",
    sample: "Nội dung mẫu",
    bizRows: [
      { label: "“Chính sách đổi trả trong bao lâu?”", time: "0,00s" },
      { label: "Tra cứu tài liệu nội bộ", time: "0,14s" },
      { label: "Tìm thấy 3 đoạn liên quan", time: "0,61s" },
      { label: "Soạn câu trả lời", time: "0,72s" },
      { label: "1.240 lượt xử lý · ~38đ", time: "2,38s" },
      { label: "Hoàn tất", time: "2,40s" },
    ],
    citeSource: "Chính sách bảo hành.pdf · trang 4",
    citeQuote: "“Khách hàng có thể đổi trả trong 30 ngày kể từ ngày nhận hàng…”",
    devHead: "Run trace · run_8c41f2",
    devSub: "durable · cancellable",
  },

  devCallout: {
    title: "Đội kỹ thuật của bạn sẽ muốn đọc phần này",
    body: "Durable execution, trace đầy đủ, huỷ Run đang chạy, endpoint OpenAI-compatible. Gửi cho họ để cùng đánh giá.",
    post: "Vì sao mỗi câu trả lời là một Run",
    docs: "Tài liệu tích hợp",
  },

  pricing: {
    label: "Bảng giá",
    title: "Gói tháng, rõ ràng",
    sub: "Chi phí mô hình AI trả trực tiếp cho nhà cung cấp bạn chọn. Harnix không cộng thêm.",
    perMonth: "/tháng",
    popular: "Phổ biến",
    plans: [
      {
        name: "Starter",
        desc: "Thử nghiệm với một nhóm nhỏ",
        price: "2.900.000đ",
        features: ["1 trợ lý AI", "3.000 câu trả lời/tháng", "500 MB tài liệu", "Nhật ký 30 ngày"],
        cta: "Đặt lịch demo",
      },
      {
        name: "Business",
        desc: "Vận hành nhiều phòng ban",
        price: "9.900.000đ",
        features: [
          "5 trợ lý AI",
          "20.000 câu trả lời/tháng",
          "5 GB tài liệu",
          "Nhật ký 1 năm, báo cáo chi phí",
          "Hỗ trợ tích hợp trực tiếp",
        ],
        cta: "Đặt lịch demo",
      },
      {
        name: "Enterprise",
        desc: "Yêu cầu riêng về bảo mật",
        price: "Liên hệ",
        features: [
          "Không giới hạn trợ lý",
          "Triển khai trên hạ tầng riêng",
          "Cam kết chất lượng dịch vụ (SLA)",
          "Đầu mối hỗ trợ riêng",
        ],
        cta: "Liên hệ sales",
      },
    ],
    note: "Giá và giới hạn là số giả định, sẽ cập nhật.",
  },

  blog: {
    label: "Blog",
    title: "Đang xây dựng công khai",
    sub: "Vì sao chúng tôi chọn từng giải pháp, kể lại bằng ngôn ngữ dễ hiểu.",
    all: "Xem tất cả bài viết",
    latest: "Mới nhất",
    readingTime: "{N} phút đọc",
    emptyTitle: "Bài viết đầu tiên sắp ra mắt",
    emptyBody: "Chúng tôi sẽ viết lại quá trình xây dựng Harnix, từng milestone một.",
  },

  blogIndex: {
    title: "Nhật ký xây dựng Harnix",
    sub: "Vì sao chúng tôi chọn từng giải pháp, kể lại bằng ngôn ngữ dễ hiểu — cho cả người làm kinh doanh lẫn đội kỹ thuật.",
    count: "{N} bài viết",
  },

  post: {
    crumb: "Blog",
    author: "Đội ngũ Harnix",
    copyLink: "Sao chép link",
    copied: "Đã sao chép ✓",
    shareLinkedIn: "Chia sẻ LinkedIn",
    inThisPost: "Trong bài",
    seeVisualLabel: "Xem trực quan",
    seeVisualBody: "Một Run chạy từng bước trên trang chủ",
    viOnly: "Bài viết này hiện chỉ có bản tiếng Việt.",
    summaryLabel: "Tóm tắt 30 giây · cho người bận rộn",
    summaryToc: "Tóm tắt 30 giây",
    ctaLabel: "Thấy Run hoạt động thật",
    ctaTitle: "Xem một Run chạy trên chính tài liệu của bạn",
    ctaBody:
      "Buổi demo 30 phút, theo đúng bài toán của doanh nghiệp bạn. Đội ngũ Harnix gọi lại trong 1 ngày làm việc.",
    ctaDemo: "Đặt lịch demo",
    ctaDocs: "Đọc tài liệu",
    readNext: "Đọc tiếp",
    allPosts: "Tất cả bài viết",
    notFoundTitle: "Không tìm thấy bài viết",
    notFoundBody: "Bài viết này không tồn tại hoặc đã bị gỡ.",
  },

  demo: {
    title: "Sẵn sàng giao việc cho AI?",
    sub: "Để lại thông tin, đội ngũ Harnix gọi lại trong 1 ngày làm việc để hẹn buổi demo 30 phút theo đúng bài toán của bạn.",
    partnerTitle: "Trở thành design partner",
    partnerSub: "Chúng tôi tìm 1–3 doanh nghiệp dùng thử sớm.",
    perks: ["Dùng miễn phí trong thời gian pilot", "Hỗ trợ tích hợp trực tiếp", "Ảnh hưởng tới roadmap"],
    ask: "Đổi lại: một buổi feedback mỗi tuần, và cho phép viết case study (khi bạn đồng ý).",
    form: {
      name: "Họ tên",
      phone: "Số điện thoại",
      email: "Email công việc",
      emailPlaceholder: "ban@congty.vn",
      company: "Công ty",
      size: "Quy mô",
      sizeUnset: "Chọn quy mô",
      want: "Bạn muốn AI làm gì?",
      wantPlaceholder: "VD: trả lời khách về chính sách đổi trả, bảo hành",
      submit: "Gửi yêu cầu demo",
      sending: "Đang gửi…",
      privacy: "Chúng tôi chỉ dùng thông tin này để liên hệ hẹn demo.",
      successTitle: "Đã nhận yêu cầu",
      successBody: "Đội ngũ Harnix sẽ gọi cho bạn trong 1 ngày làm việc.",
      again: "Gửi yêu cầu khác",
      serverError: "Không gửi được lúc này. Vui lòng thử lại, hoặc email hello@harnix.vn.",
      errors: {
        name: "Vui lòng nhập họ tên.",
        phone: "Số điện thoại chưa đúng.",
        email: "Email không hợp lệ.",
        company: "Vui lòng nhập tên công ty.",
        want: "Mô tả ngắn công việc bạn muốn AI làm.",
      },
    },
  },

  faq: {
    title: "Câu hỏi thường gặp",
    items: [
      {
        q: "Harnix đã dùng được chưa?",
        a: "Chưa. Chúng tôi đang xây dựng và mở cho design partner trước. Đặt lịch demo để được báo khi mở.",
      },
      {
        q: "“Tự mang mô hình AI” nghĩa là gì?",
        a: "Bạn dùng tài khoản mô hình AI của chính mình (OpenAI, nhà cung cấp tương thích, hoặc mô hình tự triển khai). Chi phí mô hình trả thẳng cho nhà cung cấp.",
      },
      {
        q: "Dữ liệu của tôi lưu ở đâu, ai xem được?",
        a: "Mỗi doanh nghiệp có vùng dữ liệu riêng. Chỉ thành viên bạn cấp quyền mới xem được, và bạn xoá được dữ liệu cá nhân của khách khi có yêu cầu.",
      },
      {
        q: "Có phụ thuộc ngành không?",
        a: "Không. Trợ lý trả lời dựa trên tài liệu của chính bạn, nên dùng được cho bán lẻ, tài chính, giáo dục, dịch vụ và nhiều ngành khác.",
      },
    ],
    price: {
      q: "Giá bao nhiêu?",
      /** Shown while `siteConfig.pricingEnabled` is on; `link` becomes an anchor to the pricing section. */
      aEnabled: "Gói tháng cố định: Starter, Business và Enterprise. Xem",
      link: "bảng giá",
      /** Shown while the pricing section is hidden. */
      aDisabled:
        "Chúng tôi đang hoàn thiện bảng giá. Trong giai đoạn pilot, design partner dùng miễn phí — đặt lịch demo để được tư vấn theo quy mô của bạn.",
    },
  },

  footer: {
    tagline: "Nền tảng vận hành trợ lý AI. Mỗi câu trả lời được ghi lại từng bước.",
    partner: "Design partner",
    soon: "Sắp có",
    rights: "© {Y} Harnix",
  },

  backToTop: "Lên đầu trang",

  chat: {
    open: "Hỏi Harnix",
    close: "Đóng trợ lý",
    openLabel: "Hỏi trợ lý Harnix",
    title: "Trợ lý Harnix",
    sub: "Trả lời kèm nguồn · Bản xem trước",
    closeLabel: "Đóng",
    greeting:
      "Chào bạn. Mình có thể giải thích cách Harnix hoạt động, tư vấn gói phù hợp, hoặc giúp bạn đặt lịch demo.",
    suggestions: ["Harnix khác chatbot thông thường thế nào?", "Gói nào phù hợp với doanh nghiệp tôi?"],
    bookDemo: "Đặt lịch demo",
    placeholder: "Nhập câu hỏi của bạn…",
    send: "Gửi",
  },
};

export type Copy = typeof vi;

const en: Copy = {
  meta: {
    title: "Hand work to AI. See every step.",
    description:
      "Harnix lets businesses put an AI assistant into the app they already have — and see every answer end to end: which documents it read, what steps it took, what it cost.",
    skip: "Skip to main content",
  },

  nav: {
    product: { label: "Product", desc: "What Harnix does" },
    run: { label: "Run engine", desc: "Watch AI work step by step" },
    pricing: { label: "Pricing", desc: "From 2.9M VND/month" },
    faq: { label: "FAQ", desc: "Quick answers" },
    blog: { label: "Blog", desc: "Build log" },
    docs: { label: "Docs", desc: "Integration guide for your tech team" },
    docsSoon: "Soon",
    other: { label: "Tiếng Việt", desc: "Chuyển sang tiếng Việt" },
    cta: "Book a demo",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    home: "Harnix — Home",
  },

  hero: {
    kicker: "The AI assistant operations platform for",
    kickerEm: "business",
    title: "Hand work to AI.",
    titleAccent: "See every step.",
    sub: "Harnix lets businesses put an AI assistant into the app they already have — and see every answer end to end: which documents it read, what steps it took, what it cost.",
    ctaDemo: "Book a demo",
    ctaVideo: "Watch the 40-second video",
    videoTitle: "The whole journey in 40 seconds",
    videoSub: "From an empty organisation to an AI assistant answering customers in a sample app.",
    videoAlt: "Harnix intro video: the whole journey in 40 seconds",
    play: "Play the intro video",
    soon: "Video coming soon",
    transcript: "Read the transcript",
  },

  proof: {
    title: "Other chatbots just answer.",
    titleAccent: "Harnix shows you why.",
    rows: [
      {
        title: "Answers with evidence",
        body: "Every answer **cites its source** in your company documents, so your team can **review quality proactively** instead of waiting for customer complaints.",
      },
      {
        title: "A budget you control",
        body: "Knowing **exactly what each answer costs** is what lets you **plan spend** and scale with confidence.",
      },
      {
        title: "Data kept safe",
        body: "Internal documents and customer conversations are **stored separately** and **deletable on request**.",
      },
    ],
  },

  how: {
    label: "How it works",
    title: "You already have the documents.",
    titleAccent: "Harnix handles the rest.",
    sub: "No in-house AI team, no new system to build. The assistant answers customers from your own company documents, right inside the app you already run.",
    youNeed: "You just",
    harnixDoes: "Harnix",
    tags: { available: "Available", soon: "Coming soon" },
    cards: [
      {
        title: "An assistant that knows company policy from day one",
        need: "Upload the documents you already use: policies, price lists, guides (PDF, Word)",
        does: "Reads, remembers, and answers with citations to the right source",
      },
      {
        title: "Consistent answers, within the scope you allow",
        need: "Describe the role in a few sentences, e.g. “support agent, returns only”",
        does: "Keeps the assistant inside that scope — no rambling",
      },
      {
        title: "Customers served 24/7, at a transparent cost",
        need: "Have your tech team embed the chat widget, with hands-on Harnix support",
        does: "Records every step and the cost of every answer",
      },
    ],
  },

  audiences: {
    title: "Manage AI like a great employee:",
    titleMuted: "with reports, with control, with a budget.",
    forLabel: "For",
    youGet: "You get:",
    biz: {
      name: "Leadership & operations",
      gets: "what the AI is doing, what it costs, and when to step in.",
      roles: ["Business owners", "Head of customer support", "Operations"],
    },
    bento: {
      report: {
        title: "A report for every task",
        body: "Every answer has its own record: which documents the AI read and what steps it took.",
      },
      stop: {
        title: "Step in instantly",
        body: "Stop an answer mid-flight the moment something looks off.",
      },
      cost: {
        figure: "~38 VND",
        title: "Cost per answer",
        body: "Know exactly what each answer, and each assistant, costs.",
      },
      vendor: {
        title: "No vendor lock-in",
        body: "Use OpenAI, a compatible model or your own deployment — and switch when you need to.",
      },
      data: {
        title: "Data kept apart",
        body: "One data space per business; personal data deleted on request.",
      },
      durable: {
        title: "Nothing left half-done",
        body: "If the system hits a fault, the answer still gets finished.",
      },
    },
    dev: {
      name: "Engineering",
      gets: "how it integrates, how it stays secure, and what your app needs to do.",
      roles: ["IT director / CTO", "Developers"],
    },
    devCards: [
      {
        title: "API key stays on the server",
        body: "Your backend exchanges the API key for a short-lived, per-user token. The browser never sees the key.",
      },
      {
        title: "Streaming with citations",
        body: "Answers stream in real time, every passage with its source document.",
      },
      {
        title: "CSS-isolated widget",
        body: "The chat widget runs in a shadow DOM and never touches your app's styles.",
      },
      {
        title: "Bring your own model",
        body: "An OpenAI-compatible endpoint, or a self-hosted model.",
      },
    ],
    docsCta: "Read the integration docs",
    runPostCta: "Why every answer is a Run",
  },

  run: {
    badge: "Core feature · Run engine",
    title: "Every answer is a",
    titleAccent: "Run",
    sub: "A Run is the AI's work record: every step logged, the exact cost measured, stoppable mid-way, and never left unfinished even when the system hits a fault.",
    steps: [
      {
        tag: "user_message",
        title: "A customer asks",
        body: "The Run opens and records the question and the time.",
      },
      {
        tag: "tool_call · knowledge_search",
        title: "The AI checks the documents",
        body: "Searches “Chính sách bảo hành.pdf”.",
      },
      {
        tag: "tool_result · 3 chunks",
        title: "Evidence found",
        body: "3 relevant passages, with source citations.",
      },
      {
        tag: "llm_call · gpt-4o-mini",
        title: "Drafting the answer",
        body: "The model writes the answer from exactly those passages.",
      },
      {
        tag: "token_usage · 1,240 tokens",
        title: "Cost recorded",
        body: "The cost of this exact answer, based on how much text the AI read and wrote.",
      },
      {
        tag: "state_change · completed",
        title: "Done",
        body: "It can be stopped mid-way if needed. If the system hits a fault, the Run carries on until it finishes.",
      },
    ],
    viewsLabel: "Choose a view",
    tabBiz: "Business view",
    tabDev: "Technical view",
    bizHead: "Answer log",
    sample: "Sample content",
    bizRows: [
      { label: "“How long is the return window?”", time: "0.00s" },
      { label: "Searching internal documents", time: "0.14s" },
      { label: "Found 3 relevant passages", time: "0.61s" },
      { label: "Drafting the answer", time: "0.72s" },
      { label: "1,240 tokens · ~38 VND", time: "2.38s" },
      { label: "Done", time: "2.40s" },
    ],
    citeSource: "Chính sách bảo hành.pdf · page 4",
    citeQuote: "“Customers may return an item within 30 days of delivery…”",
    devHead: "Run trace · run_8c41f2",
    devSub: "durable · cancellable",
  },

  devCallout: {
    title: "Your tech team will want to read this",
    body: "Durable execution, a full trace, cancelling a running Run, an OpenAI-compatible endpoint. Send it to them to evaluate together.",
    post: "Why every answer is a Run",
    docs: "Integration docs",
  },

  pricing: {
    label: "Pricing",
    title: "Simple monthly plans",
    sub: "Model costs are paid directly to the provider you choose. Harnix adds nothing on top.",
    perMonth: "/month",
    popular: "Popular",
    plans: [
      {
        name: "Starter",
        desc: "Trial with a small team",
        price: "2,900,000 VND",
        features: ["1 AI assistant", "3,000 answers/month", "500 MB of documents", "30-day log"],
        cta: "Book a demo",
      },
      {
        name: "Business",
        desc: "Run it across departments",
        price: "9,900,000 VND",
        features: [
          "5 AI assistants",
          "20,000 answers/month",
          "5 GB of documents",
          "1-year log, cost reports",
          "Hands-on integration support",
        ],
        cta: "Book a demo",
      },
      {
        name: "Enterprise",
        desc: "Custom security requirements",
        price: "Contact us",
        features: [
          "Unlimited assistants",
          "Deploy on your own infrastructure",
          "Service level agreement (SLA)",
          "Dedicated support contact",
        ],
        cta: "Contact sales",
      },
    ],
    note: "Prices and limits are placeholders and will be updated.",
  },

  blog: {
    label: "Blog",
    title: "Building in public",
    sub: "Why we chose each solution, explained in plain language.",
    all: "See all posts",
    latest: "Latest",
    readingTime: "{N} min read",
    emptyTitle: "The first post is on its way",
    emptyBody: "We will write up how Harnix gets built, one milestone at a time.",
  },

  blogIndex: {
    title: "The Harnix build log",
    sub: "Why we chose each solution, explained in plain language — for business readers and engineers alike.",
    count: "{N} posts",
  },

  post: {
    crumb: "Blog",
    author: "The Harnix team",
    copyLink: "Copy link",
    copied: "Copied ✓",
    shareLinkedIn: "Share on LinkedIn",
    inThisPost: "In this post",
    seeVisualLabel: "See it visually",
    seeVisualBody: "A Run playing step by step on the home page",
    viOnly: "This post is currently only available in Vietnamese.",
    summaryLabel: "30-second summary · for busy readers",
    summaryToc: "30-second summary",
    ctaLabel: "See a real Run",
    ctaTitle: "Watch a Run work on your own documents",
    ctaBody:
      "A 30-minute demo, built around your business's problem. The Harnix team calls you back within 1 business day.",
    ctaDemo: "Book a demo",
    ctaDocs: "Read the docs",
    readNext: "Read next",
    allPosts: "All posts",
    notFoundTitle: "Post not found",
    notFoundBody: "This post does not exist or has been removed.",
  },

  demo: {
    title: "Ready to hand work to AI?",
    sub: "Leave your details and the Harnix team will call you within 1 business day to set up a 30-minute demo built around your problem.",
    partnerTitle: "Become a design partner",
    partnerSub: "We are looking for 1–3 businesses to try it early.",
    perks: ["Free for the length of the pilot", "Hands-on integration support", "Influence on the roadmap"],
    ask: "In return: one feedback session a week, and permission to write a case study (once you agree).",
    form: {
      name: "Full name",
      phone: "Phone number",
      email: "Work email",
      emailPlaceholder: "you@company.com",
      company: "Company",
      size: "Company size",
      sizeUnset: "Select size",
      want: "What do you want the AI to do?",
      wantPlaceholder: "e.g. answer customers about returns and warranty",
      submit: "Request a demo",
      sending: "Sending…",
      privacy: "We only use this to get in touch about the demo.",
      successTitle: "Request received",
      successBody: "The Harnix team will call you within 1 business day.",
      again: "Send another request",
      serverError: "Could not send it right now. Please try again, or email hello@harnix.vn.",
      errors: {
        name: "Please enter your name.",
        phone: "That phone number does not look right.",
        email: "That email is not valid.",
        company: "Please enter your company name.",
        want: "Briefly describe what you want the AI to do.",
      },
    },
  },

  faq: {
    title: "Frequently asked questions",
    items: [
      {
        q: "Can I use Harnix yet?",
        a: "Not yet. We are still building, and opening to design partners first. Book a demo and we will tell you when it opens.",
      },
      {
        q: "What does “bring your own AI model” mean?",
        a: "You use your own AI model account (OpenAI, a compatible provider, or a self-hosted model). Model costs are paid directly to the provider.",
      },
      {
        q: "Where is my data stored, and who can see it?",
        a: "Each business has its own data space. Only members you grant access can see it, and you can delete a customer's personal data on request.",
      },
      {
        q: "Is it tied to a particular industry?",
        a: "No. The assistant answers from your own documents, so it works for retail, finance, education, services and many other industries.",
      },
    ],
    price: {
      q: "What does it cost?",
      aEnabled: "Fixed monthly plans: Starter, Business and Enterprise. See",
      link: "pricing",
      aDisabled:
        "We are finalising pricing. During the pilot, design partners use Harnix for free — book a demo and we will advise on what fits your size.",
    },
  },

  footer: {
    tagline: "The AI assistant operations platform. Every answer recorded step by step.",
    partner: "Design partner",
    soon: "Soon",
    rights: "© {Y} Harnix",
  },

  backToTop: "Back to top",

  chat: {
    open: "Ask Harnix",
    close: "Close assistant",
    openLabel: "Ask the Harnix assistant",
    title: "Harnix assistant",
    sub: "Answers with sources · Preview",
    closeLabel: "Close",
    greeting:
      "Hi there. I can explain how Harnix works, suggest a plan that fits, or help you book a demo.",
    suggestions: ["How is Harnix different from a regular chatbot?", "Which plan fits my business?"],
    bookDemo: "Book a demo",
    placeholder: "Type your question…",
    send: "Send",
  },
};

const dictionaries: Record<Lang, Copy> = { vi, en };

export function getCopy(lang: Lang): Copy {
  return dictionaries[lang];
}

export type Faq = { q: string; a: string };

/** The FAQ as plain text — the accordion and the FAQPage JSON-LD both read this. */
export function getFaqs(lang: Lang, pricingEnabled: boolean): Faq[] {
  const { items, price } = dictionaries[lang].faq;
  const a = pricingEnabled ? `${price.aEnabled} ${price.link}.` : price.aDisabled;
  return [...items, { q: price.q, a }];
}

/** Values the size select may submit; the route handler rejects anything else. */
export const companySizes = ["1-10", "11-50", "51-200", "200+"] as const;

const EN_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Formatted here rather than through `Intl` so the server and the client always
 * produce the same string regardless of the runtime's locale data.
 */
export function formatDate(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split("-");
  if (lang === "vi") return `${d}/${m}/${y}`;
  return `${EN_MONTHS[Number(m) - 1]} ${Number(d)}, ${y}`;
}

export function readingTime(copy: Copy, minutes: number): string {
  return copy.blog.readingTime.replace("{N}", String(minutes));
}
