const parseAddressMiddleware = (req, res, next) => {
  if (req.body.address && typeof req.body.address === "string") {
    try {
      req.body.address = JSON.parse(req.body.address);
    } catch (err) {
      return res.status(400).json({
        success: false,
        errors: ["Invalid address JSON format"]
      });
    }
  }
  next();
};

export {parseAddressMiddleware}