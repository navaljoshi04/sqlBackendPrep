

import pool from "../config/db"

export const createEmpl= async(req, res)=>{
    try {
        const {first_name, last_name, email,phone,hash_pass,role_id,department,salary}= req.body;
        if(!first_name || !last_name || !email || !phone || !hash_pass || !role_id || !department || !salary){
            return res.status(404).json({
                success:false,
                message:"Invalid , please send full body"
            })
        };

        const query = `
        INSERT INTO employees(first_name,last_name,email,phone, hash_pass,role_id, department, salary)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *;
        `
        const values = [first_name, last_name, email, phone, hash_pass, role_id, department, salary];
        const emp= await pool.query(query, values);
        if(emp.rowCount == 0){
            return res.status(404).json({
                success: false,
                message:"failed to create empl !"
            })
        }
        return res.status(201).json({
            success:true,
            message:"Successfully create employee !",
            employee:emp.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server error !"
        })
    }
}

export const updateEmpl= async (req, res)=>{
    try {
        const {id}= req.params;
        const {first_name, last_name,email, phone, department, salary,role_id}= req.body; 
        if(!first_name || 
           !last_name ||
           !email || 
           !phone ||
           !department ||
           !salary ||
           !role_id
        )return res.status(400).json({
            success: false,
            message:"All fields are required .."
        });
        const query =`
        UPDATE employees 
        SET first_name= $1,
            last_name= $2,
            email=$3,
            phone=$4,
            department=$5,
            salary= $6,
            role_id=$7
        WHERE id=$8
        RETURNING *;
        `
        const values = [first_name, last_name, email, phone, department, salary,role_id,id];
        const updatedEmp= await pool.query(query, values);
        if(updatedEmp.rowCount == 0)return res.status(404).json({
            success: false,
            message: "failed to update the employee",
           
        });
        return res.status(200).json({
            success: true,
            message:"Successfully updated the employee !",
            employee: updatedEmp.rows[0]
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"failed to update emp, Internal server error"
        });
    }
}