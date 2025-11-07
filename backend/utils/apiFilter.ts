class APIFilter {
  query: any;
  queryStr: any;

  constructor(query: any, queryStr: any) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    // ✅ Also remove 'limit', 'sort', and 'order' from filters
    const removeFields = ["page", "limit", "sort", "order"];
    removeFields.forEach((el) => delete queryCopy[el]);
    this.query = this.query.find(queryCopy);
    return this;
  }

  // ✅ NEW: Sort functionality
  sort() {
    // Get sort field from query (default: createdAt)
    const sortField = this.queryStr.sort || "createdAt";

    // Get sort order from query (default: desc = newest first)
    // Accepts: 'asc', 'desc', '1', '-1'
    let sortOrder = this.queryStr.order || "desc";

    // Normalize sort order
    if (sortOrder === "asc" || sortOrder === "1") {
      sortOrder = 1;
    } else if (sortOrder === "desc" || sortOrder === "-1") {
      sortOrder = -1;
    } else {
      sortOrder = -1; // Default to descending
    }

    // Build sort object
    const sortObj: { [key: string]: 1 | -1 } = {};
    sortObj[sortField] = sortOrder as 1 | -1;

    this.query = this.query.sort(sortObj);
    return this;
  }

  pagination(resultPerPage: number) {
    // ✅ Validate and sanitize page number
    let currentPage = Number(this.queryStr.page);

    // ✅ Handle invalid page numbers (NaN, negative, zero)
    if (isNaN(currentPage) || currentPage < 1) {
      currentPage = 1;
    }

    // Calculate skip with validated page number
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }

  // ✅ Get total count efficiently without fetching documents
  async getCount(): Promise<number> {
    return await this.query.model.countDocuments(this.query.getFilter());
  }
}

export default APIFilter;
