

import pool from "../config/db.js";
// export const createUser = async(req, res)=>{
//     try {
//         const { email, pass, age}= req.body;
//         const result = await pool.query(
//              `
//              INSERT INTO users(email, pass, age)
//              VALUES (
//              $1, $2, $3
//              )
//              `
//             , [email, pass, age]);
//         if(result.rows.length == 0) return res.status(400).json({success: false, message:"No such user exists .."});
//         res.status(201).json({
//             success: true,
//             message : "user created successfully ", 
//             user: result.rows[0],
//         });
//     } catch (error) {
//         console.log("Error while creating user: ", error); 
//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//         });
//     }
// }

// export const getUserById = async (req, res)=>{
//     try {
//         const {id} = req.params; 
//         const result = await pool.query(
//             `
//             SELECT * FROM users
//             WHERE id = $1;
//             `,[id]
//         );
//         res.status(200).json({
//             success : true,
//             message : "user fetched successfully",
//             user: result.rows[0],
//         })
//     } catch (error) {
//         console.log("Error while getting user: ", error);
//         res.status(500).json({
//             success: false,
//             message: "Internal Server Error"
//         });
//     }
// }

export const getUserById= async(req, res)=>{
    try {
        const {id}= req.params; 
        const query= await pool.query(
            `
        SELECT * FROM users 
        WHERE id= $1;
        `,[id]
        );
        if(query.rows.length == 0) return res.status(404).json({
            success : false,
            message: "Failed to get users by id",
        });
        return res.status(200).json({
            success: true,
            message: "Successfully fetched the id",
            user:query.rows[0]
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to get the user..."
        })
    }
}

export const deleteUserById= async(req, res)=>{
    try {
        const {id}= req.params; 
        const deleteduser= await pool.query(
            `
            DELETE FROM users 
            where id=$1
            RETURNING ID, AGE, EMAIL;
            `,[id]
        );
        const {row, rowCount}= await pool.query(deleteUserById,[id]);
        if(deleteduser.rowCount == 0) return res.status(404).json({
            success: false,
            message: "No such user exists"
        });
        res.status(200).json({
            success: true,
            message:"user deleted successfully",
            user:deleteduser
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


export const createUser = async(req, res)=>{
    try {
        const {email,pass,age}= req.body; 
    if(!email || !pass || !age) return res.status(400).json({
        message: "full fields are not recieved "
    });
    const query = await pool.query(`
        insert into users(email, pass, age)
        values($1,$2,$3)
        returning *;
        `,[email,pass,age]);
    
    return res.status(201).json({
        success : true,
        message: "successfully created the user.",
        user: query.rows[0],
    });
    } catch (error) {
        return res.status(501).json({
            success: false,
            message: "internal server error"});
    }
}

export const updateUserById = async (req, res)=>{
    const {id} = req.params; 
    try {
        const {age, email, pass} = req.body; 
    if(!(age) || !email || ! pass) return res.status(400).json({
        success : false,
        message :"Please pass a proper valuse to update",
    });
    const query= `UPDATE users SET
                  age =$1, email=$2, pass=$3
                  WHERE id= $4
                  RETURNING *
                  `;

    const values = [age, email,pass,id];

    const result = await pool.query(query, values);

    if(result.rowCount ===0) return res.status(404).json({success: false, message:"Failed to updated user"});
    return res.status(200).json({
        success: true,
        message: "Successfully updated the users",
        user: result.rows[0],
    })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}