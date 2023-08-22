const DEFAULT_PAGE_LIMIT = 0;
const DEFAULT_PAGE_NUMBER = 1;

function getPagination(query){
    const page = query.page || DEFAULT_PAGE_NUMBER;
    const limit = query.limit || DEFAULT_PAGE_LIMIT;
    const skip = (page - 1) * limit;

    return {
        skip,
        limit,
    };
}

module.exports = {
    getPagination,
}