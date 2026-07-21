


import pool from "../config/db"

export const createBooks= async(req, res)=>{
    try {
        const {title, author, isbn , price, quantity, publisher}= req.body; 
        if(!title || !author || !isbn || !price || !quantity || !publisher){
            return res.status(400).json({
                success: false,
                message:"All fields are required"
            });
        }
        const query = `
        INSERT INTO books(title,author,isbn,price,quantity,publisher)
        VALUES($1,$2,$3,$4,$5,$6)
        RETURNING *; 
        `;
        const values= [title, author, isbn, price, quantity, publisher];
        const result = await pool.query(query, values);
        if(result.rowCount ==0 ){
            return res.status(404).json({
                success: false,
                message: "Failed to create books "
            });
        }
        return res.status(201).json({
            success: true,
            message: "Successfully created books",
            books: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:"failed to create books, internal server error !"
        })
    }
}

export const updateBook= async(req, res)=>{
    try {
        const {id}= req.params; 
        const {title, author, isbn , price, quantity, publisher}= req.body; 
        if(!title || !author || !isbn || !price || !quantity || !publisher){
            return res.status(400).json({
                success: false,
                message:"All fields are required"
            });
        }
        const query = `
        UPDATE books 
        SET title= $1, 
            author= $2,
            isbn = $3,
            price= $4,
            quantity= $5,
            publisher= $6
        WHERE id=$7
        RETURNING *; 
        `;
        const values=[title, author, isbn, price, quantity,publisher,id];
        const result = await pool.query(query, values);
        if(result.rowCount == 0) return res.status(404).json({
            success: false,
            message: "Failed to update the books "
        });
        return res.status(200).json({
            success: true,
            message: "Successfully updated the books",
            book: result.rows[0]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:"Failed to update books, internal server error "
        })
    }
}


export const getBookById= async(req, res)=>{
    try {
        const {id}= req.params; 
        const query = `
        SELECT * FROM books 
        WHERE id=$1; 
        `;
        const values = [id];
        const result = await pool.query(query, values);
        if(result.rows.length == 0)return res.status(404).json({
            success: false,
            message: "Failed to get books "
        });
        return res.status(200).json({
            success :true,
            message: "successfully updated book",
            book: result.rows[0]
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update books internal server error"
        })
    }
}


export const deleteBookById= async(req, res)=>{
    try {
        const {id} = req.params; 
        const query= `
        DELETE FROM books 
        where id=$1
        RETURNING *;
        `;
        const values = [id];
        const result = await pool.query(query, values);
        if(result.rowCount == 0)return res.status(404).json({
            success: false,
            message: "Failed to delete book"
        });
        return res.status(200).json({
            success: true,
            message:"Successfullly deleted the book",
            book: result.rows[0]
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete book "
        })
    }
}