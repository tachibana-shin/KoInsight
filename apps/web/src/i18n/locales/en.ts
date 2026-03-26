const en = {
  // Navigation
  nav: {
    books: 'Books',
    calendar: 'Calendar',
    stats: 'Reading stats',
    syncs: 'Progress syncs',
    plugin: 'KOReader Plugin',
    toggleColorScheme: 'Toggle color scheme',
    language: 'Language',
  },

  // Upload form
  upload: {
    button: 'Upload Statistics DB',
    modalTitle: 'Upload KOReader statistics database',
    description: 'Upload your KOReader statistics.sqlite3 file.',
    fileLabel: 'Choose Database file',
    submit: 'Upload',
    noFile: 'Please select a file before submitting.',
    success: 'File uploaded and validated successfully.',
    successTitle: 'Success',
    failed: 'Failed to upload file.',
  },

  // Download plugin
  download: {
    title: 'KOReader Plugin',
    description: 'Download the KOReader plugin to sync your reading progress.',
    button: 'Download plugin',
  },

  // Login page
  login: {
    passwordRequired: 'Password required',
    enterPassword: 'Enter the dashboard password to continue.',
    password: 'Password',
    passwordPlaceholder: 'Enter password',
    signIn: 'Sign in',
    invalidPassword: 'Invalid password',
    cannotConnect: 'Cannot connect to the server',
  },

  // Books page
  books: {
    title: 'Books',
    noBooks: 'No books yet',
    noBooksDescription: "It seems like you haven't uploaded any reading statistics yet.",
    searchPlaceholder: 'Search books...',
    advancedFilters: 'Advanced filters',
    sortDirection: {
      ascending: 'ascending',
      descending: 'descending',
    },
    sortSort: 'Sort {{direction}}',
    sortBy: 'Sort by',
    tableView: 'Table view',
    cardsView: 'Cards view',
    failedToLoad: 'Failed to load books',
    sortOptions: {
      added: 'Added',
      title: 'Title',
      author: 'Author',
      readTime: 'Read time',
      lastOpen: 'Last open',
    },
    viewHidden: 'View hidden books',
  },

  // Book page
  book: {
    readingProgress: 'Reading progress',
    pagesRead: 'pages read',
    totalReadTime: 'Total read time',
    averagePerDay: 'Average per day',
    daysReading: 'Days reading',
    avgTimePerPage: 'Avg time per page',
    calendar: 'Calendar',
    annotations: 'Annotations',
    manageData: 'Manage data',
    rawValues: 'Raw Values',
    advanced: 'Advanced',
    reloadBookData: 'Reload book data',
  },

  // Annotations
  annotations: {
    title: 'Annotations',
    of: 'of',
    highlights: '{{count}} highlights',
    notes: '{{count}} notes',
    bookmarks: '{{count}} bookmarks',
    deleted: '{{count}} deleted',
    noAnnotations: 'No annotations found with the current filters.',
    unknownChapter: 'Unknown chapter',
    searchPlaceholder: 'Search annotations...',
    highlights_label: 'Highlights',
    notes_label: 'Notes',
    bookmarks_label: 'Bookmarks',
    showDeleted: 'Show deleted',
    sortBy: 'Sort by',
    groupBy: 'Group by',
    sortNewest: 'Newest first',
    sortOldest: 'Oldest first',
    sortPageAsc: 'Page (ascending)',
    sortPageDesc: 'Page (descending)',
    groupNone: 'No grouping',
    groupType: 'By type',
    groupChapter: 'By chapter',
  },

  // Manage book
  manage: {
    deleteTitle: 'Delete book',
    deleteButton: 'Delete book',
    deleteConfirmTitle: 'Delete Book?',
    deleteConfirmText:
      'Are you sure you want to delete <strong>{{title}}</strong>? This action is destructive and cannot be reverted.',
    deleteConfirmButton: 'Delete',
    deleteCancelButton: "No, don't delete it",
    deleteSuccess: 'Book deleted',
    deleteSuccessMessage: '"{{title}}" deleted successfully.',
    deleteFailed: 'Failed to delete the book',
    deleteFailedMessage: 'Failed to delete the book.',
    hideTitle: 'Hide book',
    hideDescription:
      'Hidden books are not shown in the book list and are excluded from statistics.',
    hideLabel: 'Hide book',
    hideSuccess: 'Book hidden',
    showSuccess: 'Book shown',
    hideSuccessMessage: '"{{title}}" hidden successfully.',
    showSuccessMessage: '"{{title}}" shown successfully.',
    hideFailed: 'Failed to hide the book',
    showFailed: 'Failed to show the book',
    hideFailedMessage: 'Failed to hide the book.',
    showFailedMessage: 'Failed to show the book.',
    referencePageTitle: 'Reference page count',
    referencePageDescription:
      'KOReader tracks your reading progress based on <em>pages in the app</em>, which can vary depending on settings like font size, margins, and layout. For example, a 100-page book might show up as 150 pages in KOReader if you increase the font size.',
    referencePageDescription2:
      'To get accurate reading stats, you can set the <strong>reference page</strong> count — the actual number of pages in the physical or original version of the book. KoInsight will then adjust your stats to match that real-world page count.',
    updateRefPages: 'Update reference pages',
    updateRefPagesSuccess: 'Reference page count updated',
    updateRefPagesSuccessMessage: '"{{title}}" reference page count updated successfully.',
    updateRefPagesFailed: 'Failed to update reference page count',
  },

  // Stats page
  stats: {
    title: 'Reading statistics',
    readThisWeek: 'You read for {{duration}} this week. Keep it up!',
    noReadThisWeek: "You haven't read this week yet. No better time to start!",
    totalReadTime: 'Total read time',
    totalPagesRead: 'Total pages read',
    longestDay: 'Longest time reading in a day',
    mostPagesInADay: 'Most pages in a day',
    readingHistory: 'Reading history',
    weeklyStats: 'Weekly stats',
    perDayOfWeek: 'Per day of the week',
    monthlyReadingTime: 'Monthly reading time',
    readingTime: 'Reading time',
    notAvailable: 'N/A',
  },

  // Calendar page
  calendar: {
    title: 'Calendar',
  },

  // Syncs page
  syncs: {
    title: 'Progress syncs',
    loading: 'Loading...',
    noSyncs: 'No progress syncs',
    noSyncsDescription: "It seems like no one has synced their progress yet.",
    deviceIdTooltip: 'Device ID: {{id}}',
    username: 'Username',
    document: 'Document',
    progress: 'Progress',
    percentage: 'Percentage',
    md5Tooltip: 'MD5: {{md5}}',
  },

  // Empty state
  emptyState: {
    defaultTitle: 'Nothing here',
  },

  // Common
  common: {
    pageNotFound: 'Page not found',
  },
};

export type Translation = typeof en;
export default en;
