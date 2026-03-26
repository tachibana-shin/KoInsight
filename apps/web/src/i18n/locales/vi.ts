import type { Translation } from './en';

const vi: Translation = {
  // Navigation
  nav: {
    books: 'Sách',
    calendar: 'Lịch',
    stats: 'Thống kê đọc sách',
    syncs: 'Đồng bộ tiến độ',
    plugin: 'Plugin KOReader',
    toggleColorScheme: 'Chuyển đổi giao diện',
    language: 'Ngôn ngữ',
  },

  // Upload form
  upload: {
    button: 'Tải lên DB thống kê',
    modalTitle: 'Tải lên cơ sở dữ liệu thống kê KOReader',
    description: 'Tải lên file statistics.sqlite3 từ KOReader của bạn.',
    fileLabel: 'Chọn file cơ sở dữ liệu',
    submit: 'Tải lên',
    noFile: 'Vui lòng chọn file trước khi gửi.',
    success: 'File đã được tải lên và xác thực thành công.',
    successTitle: 'Thành công',
    failed: 'Tải lên file thất bại.',
  },

  // Download plugin
  download: {
    title: 'Plugin KOReader',
    description: 'Tải plugin KOReader để đồng bộ tiến độ đọc sách của bạn.',
    button: 'Tải plugin',
  },

  // Login page
  login: {
    passwordRequired: 'Yêu cầu mật khẩu',
    enterPassword: 'Nhập mật khẩu để truy cập bảng điều khiển.',
    password: 'Mật khẩu',
    passwordPlaceholder: 'Nhập mật khẩu',
    signIn: 'Đăng nhập',
    invalidPassword: 'Mật khẩu không đúng',
    cannotConnect: 'Không thể kết nối đến máy chủ',
  },

  // Books page
  books: {
    title: 'Sách',
    noBooks: 'Chưa có sách nào',
    noBooksDescription: 'Có vẻ như bạn chưa tải lên dữ liệu thống kê đọc sách nào.',
    searchPlaceholder: 'Tìm kiếm sách...',
    advancedFilters: 'Bộ lọc nâng cao',
    sortDirection: {
      ascending: 'tăng dần',
      descending: 'giảm dần',
    },
    sortSort: 'Sắp xếp {{direction}}',
    sortBy: 'Sắp xếp theo',
    tableView: 'Xem dạng bảng',
    cardsView: 'Xem dạng thẻ',
    failedToLoad: 'Không thể tải danh sách sách',
    sortOptions: {
      added: 'Ngày thêm',
      title: 'Tiêu đề',
      author: 'Tác giả',
      readTime: 'Thời gian đọc',
      lastOpen: 'Mở gần nhất',
    },
    viewHidden: 'Hiển thị sách đã ẩn',
  },

  // Book page
  book: {
    readingProgress: 'Tiến độ đọc',
    pagesRead: 'trang đã đọc',
    totalReadTime: 'Tổng thời gian đọc',
    averagePerDay: 'Trung bình mỗi ngày',
    daysReading: 'Số ngày đọc',
    avgTimePerPage: 'Thời gian TB mỗi trang',
    calendar: 'Lịch',
    annotations: 'Chú thích',
    manageData: 'Quản lý dữ liệu',
    rawValues: 'Dữ liệu thô',
    advanced: 'Nâng cao',
    reloadBookData: 'Tải lại dữ liệu sách',
  },

  // Annotations
  annotations: {
    title: 'Chú thích',
    of: 'trong',
    highlights: '{{count}} đánh dấu',
    notes: '{{count}} ghi chú',
    bookmarks: '{{count}} bookmark',
    deleted: '{{count}} đã xoá',
    noAnnotations: 'Không tìm thấy chú thích nào với bộ lọc hiện tại.',
    unknownChapter: 'Chương không xác định',
    searchPlaceholder: 'Tìm kiếm chú thích...',
    highlights_label: 'Đánh dấu',
    notes_label: 'Ghi chú',
    bookmarks_label: 'Bookmark',
    showDeleted: 'Hiện đã xoá',
    sortBy: 'Sắp xếp theo',
    groupBy: 'Nhóm theo',
    sortNewest: 'Mới nhất trước',
    sortOldest: 'Cũ nhất trước',
    sortPageAsc: 'Trang (tăng dần)',
    sortPageDesc: 'Trang (giảm dần)',
    groupNone: 'Không nhóm',
    groupType: 'Theo loại',
    groupChapter: 'Theo chương',
  },

  // Manage book
  manage: {
    deleteTitle: 'Xoá sách',
    deleteButton: 'Xoá sách',
    deleteConfirmTitle: 'Xoá sách?',
    deleteConfirmText:
      'Bạn có chắc chắn muốn xoá <strong>{{title}}</strong>? Hành động này không thể hoàn tác.',
    deleteConfirmButton: 'Xoá',
    deleteCancelButton: 'Không, đừng xoá',
    deleteSuccess: 'Đã xoá sách',
    deleteSuccessMessage: '"{{title}}" đã được xoá thành công.',
    deleteFailed: 'Xoá sách thất bại',
    deleteFailedMessage: 'Không thể xoá sách.',
    hideTitle: 'Ẩn sách',
    hideDescription: 'Sách bị ẩn sẽ không hiển thị trong danh sách và bị loại khỏi thống kê.',
    hideLabel: 'Ẩn sách',
    hideSuccess: 'Đã ẩn sách',
    showSuccess: 'Đã hiện sách',
    hideSuccessMessage: '"{{title}}" đã được ẩn thành công.',
    showSuccessMessage: '"{{title}}" đã được hiện thành công.',
    hideFailed: 'Ẩn sách thất bại',
    showFailed: 'Hiện sách thất bại',
    hideFailedMessage: 'Không thể ẩn sách.',
    showFailedMessage: 'Không thể hiện sách.',
    referencePageTitle: 'Số trang tham chiếu',
    referencePageDescription:
      'KOReader theo dõi tiến độ đọc dựa trên <em>số trang trong ứng dụng</em>, có thể khác nhau tùy thuộc vào cài đặt như cỡ chữ, lề và bố cục. Ví dụ, một cuốn sách 100 trang có thể hiện 150 trang trong KOReader nếu bạn tăng cỡ chữ.',
    referencePageDescription2:
      'Để có thống kê đọc chính xác, bạn có thể đặt số trang <strong>tham chiếu</strong> — số trang thực tế trong phiên bản vật lý hoặc gốc của sách. KoInsight sẽ điều chỉnh thống kê theo số trang thực tế đó.',
    updateRefPages: 'Cập nhật số trang tham chiếu',
    updateRefPagesSuccess: 'Đã cập nhật số trang tham chiếu',
    updateRefPagesSuccessMessage: '"{{title}}" đã cập nhật số trang tham chiếu thành công.',
    updateRefPagesFailed: 'Cập nhật số trang tham chiếu thất bại',
  },

  // Stats page
  stats: {
    title: 'Thống kê đọc sách',
    readThisWeek: 'Bạn đã đọc {{duration}} tuần này. Tiếp tục cố gắng!',
    noReadThisWeek: 'Bạn chưa đọc sách tuần này. Không có lúc nào tốt hơn để bắt đầu!',
    totalReadTime: 'Tổng thời gian đọc',
    totalPagesRead: 'Tổng số trang đã đọc',
    longestDay: 'Thời gian đọc dài nhất trong ngày',
    mostPagesInADay: 'Nhiều trang nhất trong ngày',
    readingHistory: 'Lịch sử đọc sách',
    weeklyStats: 'Thống kê tuần',
    perDayOfWeek: 'Theo ngày trong tuần',
    monthlyReadingTime: 'Thời gian đọc theo tháng',
    readingTime: 'Thời gian đọc',
    notAvailable: 'N/A',
  },

  // Calendar page
  calendar: {
    title: 'Lịch',
  },

  // Syncs page
  syncs: {
    title: 'Đồng bộ tiến độ',
    loading: 'Đang tải...',
    noSyncs: 'Chưa có đồng bộ tiến độ',
    noSyncsDescription: 'Có vẻ như chưa ai đồng bộ tiến độ của họ.',
    deviceIdTooltip: 'ID thiết bị: {{id}}',
    username: 'Tên người dùng',
    document: 'Tài liệu',
    progress: 'Tiến độ',
    percentage: 'Phần trăm',
    md5Tooltip: 'MD5: {{md5}}',
  },

  // Empty state
  emptyState: {
    defaultTitle: 'Không có gì ở đây',
  },

  // Common
  common: {
    pageNotFound: 'Không tìm thấy trang',
  },
};

export default vi;
