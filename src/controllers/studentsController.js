

import pool from "../config/db";

export const createStudentsController = async(req, res)=>{
    try {
        const {name, email, age, course, semester, cgpa}= req.body; 
        if(!name || !email || !age || !course || !semester || !cgpa){
            return res.status(400).json({
                success:false,
                message:"All fields are required here ..."
            });
        }
        const query = `
        INSERT INTO students(name, email, age, course, semester, cgpa)
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING *;
        `;
        const values = [name, email, age, course, semester, cgpa];
        const result = await pool.query(query, values);
        if(result.rows.length ==0) return res.status(400).json({
            success: false,
            message:"Failed to create employee."
        });
        return res.status(201).json({
            success: true,
            message: "Successfully created the student",
            student : result.rows[0]
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message : "Internal server error"
        })
    }
}

export const updateStudentControllerById= async(req, res)=>{
    try {
        const {id}= req.params; 
        const {name, email, age, course, semester, cgpa}= req.body; 
        const query= `
        UPDATE students 
        SET name=$1,
            email= $2, 
            age=$3,
            course=$4,
            semester=$5,
            cgpa= $6
        WHERE id=$7
        RETURNING 
           name,
           email,
           age,
           course,
           semester,
           cgpa,
           id
           `;
        const values= [name, email, age, course,semester, cgpa, id];
        const result = await pool.query(query, values);
        if(result.rowCount == 0) return res.status(404).json({
            success: false,
            message:"Student is not updated as of now,Please try again later !"
        });
        return res.status(200).json({
            success: true,
            message:"Students are updated successfully!",
            student: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Students are not updated succesfully"
        })
    }
}

export const getStudentById= async(req, res)=>{
    try {
        const {id}= req.params; 
        const query = `
        SELECT * FROM 
        students WHERE id=$1;
        `;
        const result= await pool.query(query, [id]);
        if(result.rowCount == 0)return res.status(400).json({
            success: false,
            message: "cant get student",
        })
        return res.status(200).json({
            success: true,
            message: "Successfully fetched the student",
            student: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Not able to get students, internal server error"
        });
    }
}

export const deleteStudentById = async(req, res)=>{
    try {
        const {id}= req.params; 
        const query= `
        DELETE FROM 
        students WHERE 
        id=$1
        RETURNING *;
        `;
        const result= await pool.query(query,[id]);
        if(result.rowCount == 0) return res.status(404).json({
            success: false,
            message:"Failed to delete the students"
        });
        return res.status(200).json({
            success: true,
            message: "Successfully deleted the students",
            student: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete the students "
        });
    }
}