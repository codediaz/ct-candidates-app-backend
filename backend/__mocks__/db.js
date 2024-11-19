const mockQuery = jest.fn();

module.exports = {
    query: mockQuery,
    promise: () => ({
        query: mockQuery,
    }),
};
