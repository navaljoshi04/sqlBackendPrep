
import pool from "../config/db.js"
export const getEmployeeBYId= async(req, res)=>{
    try {
        const {id}= req.params; 
        const query= `
        SELECT id,
               first_name,
               last_name,
               email,
               department,
               salary
            FROM employees WHERE id=$1;
        `
        const result = await pool.query(query, [id]);
        if(result.rows.length == 0)return res.status(404).json({
            success:false,
            message :"No employee available try again !"
        });
        return res.status(200).json({
            success: true,
            message: "Successfully fetched the employee ...",
            employee : result.rows[0],
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get the employee, Internal server error"
        })
    }
};

export const createUser= async(req, res)=>{
    try {
        const {first_name,last_name, email,department,salary} = req.body;
        const query = `
        INSERT INTO employees
        (first_name, 
        last_name,
        email,
        department,
        salary)
        VALUES(
        $1,$2,$3,$4,$5)
        RETURNING *;
        `;
        const values = [first_name, last_name, email, department, salary];
        const result = await pool.query(query, values);
        if(result.rows.length == 0) return res.status(404).json({
            success: false,
            message: "Failed to get the employee"
        });
        return res.status(201).json({
             success : true,
             message: "Successfully created the employees",
             employee : result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message : "Failed to create employee,internal server error !"
        })
    }
}

export const updateEmployeeById= async(req, res)=>{
     try {
        const {id}= req.params; 
        const {first_name, last_name, email,department,salary}= req.body; 
        const query = `
        UPDATE employees 
        SET 
           first_name =$1,
           last_name =$2,
           email=$3,
           department= $4,
           salary=$5
        WHERE id=$6
        RETURNING 

        id,first_name, last_name, email, department, salary;
        `;
        const values= [first_name, last_name,email,department,salary,id];
        const result = await pool.query(query, values);
        if(result.rowCount ==0) return res.status(404).json({
            success: false,
            message: "Failed to update the employee "
        });
        return res.status(200).json({
             success: true,
             message: "Updated the employee",
             employee: result.rows[0]
        });
     } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update the employee"
        });
     }
}

export const deleteEmployee = async(req, res)=>{
    try {
        const {id}= req.params; 
        const query= `
        DELETE FROM 
        employees 
        WHERE id=$1
        RETURNING *;
        `;
        const result = await pool.query(query, [id]);
        if(result.rowCount ==0)return res.status(404).json({
            success: false,
            message: "Failed to update the employee"
        });
        return res.status(200).json({
            success: true,
            message: "Deleted the employee",
            employee: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete the employee"
        });
    }
}

