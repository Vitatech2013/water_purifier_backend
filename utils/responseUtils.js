const successResponse = (res, data) => {
    res.status(200).json({
        status: 1,
        data
    });
};

const errorResponse = (res, error) => {
    res.status(500).json({
        status: 0,
        error
    });
};

module.exports = { successResponse, errorResponse };
