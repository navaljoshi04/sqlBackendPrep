import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findcurrUser = await pool.query(
      `
        SELECT e.email ,e.hash_pass
        FROM employees e
        WHERE e.email=$1`,
      [email],
    );
    if (findcurrUser.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const loggedUser = findcurrUser.rows[0];
    const isMatch = await bcrypt.compare(password, loggedUser.hash_pass);
    if (!isMatch) {
      return res.status(404).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const query = `
        SELECT 
        e.first_name,
        e.id,
        e.last_name,
        e.email,
        e.hash_pass,
        r.role_name
        FROM employees e
        JOIN roles r 
        ON  e.role_id =  r.id
        WHERE e.email=$1
        `;
    const result = await pool.query(query, [email]);
    if (result.rowCount === 0)
      return res.status(404).json({
        success: false,
        message: "user not found",
      });

    const user = result.rows[0];
    const token = jwt.sign(
      { employee_id: user.id, role: user.role_name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    return res.status(200).json({
      success: true,
      user: { email: user.email, role: user.role_name, name: user.first_name },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to login , internal server error",
    });
  }
};



export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is required."
            });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
};

export const authorize= (...allowedRoles)=>{
    return (req, res,next)=>{
      if(!allowedRoles.includes(req.user.role)){
        return res.status(403).json({
          success: false,
          message: "Failed to authorize"
        });
      }
      next();
    }
}