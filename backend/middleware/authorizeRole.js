export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next({
        status: 403,
        message: "Akses ditolak: role tidak diizinkan"
      });
    }
    next();
  };
};
