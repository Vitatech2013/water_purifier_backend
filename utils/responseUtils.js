exports.successResponse = (res, data, message, statusCode = 200) => {
  if (!data) {
    return res.status(200).json({
      status: 0,
      message: message || "No data found",
      data: null,
    });
  }

  res.status(statusCode).json({
    status: 1,
    message: message || "Success",
    data: data,
  });
};

exports.errorResponse = (res, message, statusCode = 500) => {
  res.status(statusCode).json({
    status: 0,
    message: message || "An error occurred",
    data: null,
  });
};
