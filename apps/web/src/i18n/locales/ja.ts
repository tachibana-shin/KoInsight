import type { Translation } from './en';

const ja: Translation = {
  // Navigation
  nav: {
    books: '本',
    calendar: 'カレンダー',
    stats: '読書統計',
    syncs: '進捗同期',
    plugin: 'KOReaderプラグイン',
    toggleColorScheme: 'カラースキームを切り替え',
    language: '言語',
  },

  // Upload form
  upload: {
    button: '統計DBをアップロード',
    modalTitle: 'KOReader統計データベースをアップロード',
    description: 'KOReaderのstatistics.sqlite3ファイルをアップロードしてください。',
    fileLabel: 'データベースファイルを選択',
    submit: 'アップロード',
    noFile: '送信前にファイルを選択してください。',
    success: 'ファイルが正常にアップロードおよび検証されました。',
    successTitle: '成功',
    failed: 'ファイルのアップロードに失敗しました。',
  },

  // Download plugin
  download: {
    title: 'KOReaderプラグイン',
    description: '読書の進捗を同期するためにKOReaderプラグインをダウンロードしてください。',
    button: 'プラグインをダウンロード',
  },

  // Login page
  login: {
    passwordRequired: 'パスワードが必要です',
    enterPassword: 'ダッシュボードのパスワードを入力して続行してください。',
    password: 'パスワード',
    passwordPlaceholder: 'パスワードを入力',
    signIn: 'サインイン',
    invalidPassword: 'パスワードが無効です',
    cannotConnect: 'サーバーに接続できません',
  },

  // Books page
  books: {
    title: '本',
    noBooks: '本がまだありません',
    noBooksDescription: '読書統計がまだアップロードされていないようです。',
    searchPlaceholder: '本を検索...',
    advancedFilters: '高度なフィルター',
    sortDirection: {
      ascending: '昇順',
      descending: '降順',
    },
    sortSort: '{{direction}}で並べ替え',
    sortBy: '並べ替え',
    tableView: 'テーブル表示',
    cardsView: 'カード表示',
    failedToLoad: '本の読み込みに失敗しました',
    sortOptions: {
      added: '追加日',
      title: 'タイトル',
      author: '著者',
      readTime: '読書時間',
      lastOpen: '最終閲覧',
    },
    viewHidden: '非表示の本を表示',
  },

  // Book page
  book: {
    readingProgress: '読書の進捗',
    pagesRead: 'ページ既読',
    totalReadTime: '総読書時間',
    averagePerDay: '1日平均',
    daysReading: '読書日数',
    avgTimePerPage: '1ページあたりの平均時間',
    calendar: 'カレンダー',
    annotations: '注釈',
    manageData: 'データを管理',
    rawValues: '生の値',
    advanced: '高度な設定',
    reloadBookData: '本のデータを再読み込み',
    pageNumber: 'ページ番号',
    startDate: '開始日',
    endDate: '終了日',
    changeCover: '表紙を変更',
    changeBookCover: '本の表紙を変更',
    selectCover: '表紙を選択',
    uploadCover: '表紙をアップロード',
    importedAnnotations: '{{count}}個の注釈をインポートしました',
    percentageRead: '既読率',
    hidden: 'この本は非表示です',
  },

  // Annotations
  annotations: {
    title: '注釈',
    of: '/',
    highlights: '{{count}}個のハイライト',
    notes: '{{count}}個のメモ',
    bookmarks: '{{count}}個のブックマーク',
    deleted: '{{count}}個の削除済み',
    noAnnotations: '現在のフィルターで注釈は見つかりませんでした。',
    unknownChapter: '不明な章',
    searchPlaceholder: '注釈を検索...',
    highlights_label: 'ハイライト',
    notes_label: 'メモ',
    bookmarks_label: 'ブックマーク',
    showDeleted: '削除済みを表示',
    sortBy: '並べ替え',
    groupBy: 'グループ化',
    sortNewest: '新しい順',
    sortOldest: '古い順',
    sortPageAsc: 'ページ (昇順)',
    sortPageDesc: 'ページ (降順)',
    groupNone: 'グループ化なし',
    groupType: 'タイプ別',
    groupChapter: '章別',
  },

  // Manage book
  manage: {
    deleteTitle: '本を削除',
    deleteButton: '本を削除',
    deleteConfirmTitle: '本を削除しますか？',
    deleteConfirmText:
      '<strong>{{title}}</strong>を削除してもよろしいですか？この操作は取り消せません。',
    deleteConfirmButton: '削除',
    deleteCancelButton: 'いいえ、削除しません',
    deleteSuccess: '本が削除されました',
    deleteSuccessMessage: '「{{title}}」が正常に削除されました。',
    deleteFailed: '本の削除に失敗しました',
    deleteFailedMessage: '本の削除に失敗しました。',
    hideTitle: '本を非表示にする',
    hideDescription:
      '非表示の本は本の一覧に表示されず、統計からも除外されます。',
    hideLabel: '本を非表示にする',
    hideSuccess: '本が非表示になりました',
    showSuccess: '本が表示されました',
    hideSuccessMessage: '「{{title}}」が正常に非表示になりました。',
    showSuccessMessage: '「{{title}}」が正常に表示されました。',
    hideFailed: '本の非表示に失敗しました',
    showFailed: '本の表示に失敗しました',
    hideFailedMessage: '本の非表示に失敗しました。',
    showFailedMessage: '本の表示に失敗しました。',
    referencePageTitle: '参照ページ数',
    referencePageDescription:
      'KOReaderは<em>アプリ内のページ</em>に基づいて読書の進捗を追跡しますが、フォントサイズや余白、レイアウトなどの設定によって異なる場合があります。たとえば、100ページの本でも、フォントサイズを大きくするとKOReaderでは150ページと表示されることがあります。',
    referencePageDescription2:
      '正確な読書統計を取得するには、<strong>参照ページ</strong>数（物理的な本やオリジナル版の実際のページ数）を設定できます。KoInsightは、その実際のページ数に合わせて統計を調整します。',
    updateRefPages: '参照ページを更新',
    updateRefPagesSuccess: '参照ページ数が更新されました',
    updateRefPagesSuccessMessage: '「{{title}}」の参照ページ数が正常に更新されました。',
    updateRefPagesFailed: '参照ページ数の更新に失敗しました',
  },

  // Stats page
  stats: {
    title: '読書統計',
    readThisWeek: '今週は{{duration}}読みました。その調子です！',
    noReadThisWeek: '今週はまだ読んでいないようです。始めるのに遅すぎることはありません！',
    totalReadTime: '総読書時間',
    totalPagesRead: '総読了ページ数',
    longestDay: '1日の最長読書時間',
    mostPagesInADay: '1日の最多ページ数',
    readingHistory: '読書履歴',
    weeklyStats: '週間統計',
    perDayOfWeek: '曜日別',
    monthlyReadingTime: '月間読書時間',
    readingTime: '読書時間',
    notAvailable: 'なし',
  },

  // Calendar page
  calendar: {
    title: 'カレンダー',
  },

  // Syncs page
  syncs: {
    title: '進捗同期',
    loading: '読み込み中...',
    noSyncs: '進捗同期がありません',
    noSyncsDescription: 'まだ誰も進捗を同期していないようです。',
    deviceIdTooltip: 'デバイスID: {{id}}',
    deviceId: 'デバイスID',
    username: 'ユーザー名',
    document: 'ドキュメント',
    progress: '進捗',
    percentage: 'パーセンテージ',
    md5Tooltip: 'MD5: {{md5}}',
    md5: 'MD5',
  },

  // Empty state
  emptyState: {
    defaultTitle: '何もありません',
  },

  // Common
  common: {
    pageNotFound: 'ページが見つかりません',
    loading: '読み込み中...',
    none: 'なし',
    unknownAuthor: '不明な著者',
    page: 'ページ',
    startTime: '開始時間',
    duration: '期間',
    totalPages: '総ページ数',
    device: 'デバイス',
    lastOpened: '最終閲覧',
    author: '著者',
    series: 'シリーズ',
    highlights: 'ハイライト',
    notes: 'メモ',
    read: '既読',
    pages: 'ページ',
    title: 'タイトル',
    md5: 'MD5',
    lessThanAMinute: '1分未満',
  },
};

export default ja;
