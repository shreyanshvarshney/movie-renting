const admin = (req, res, next) => {
    if(!req.userData.isAdmin) {
        // 403 Forbidden
        return res.status(403).json({message: "Access Denied!"});
    }
    next();
}

module.exports = admin