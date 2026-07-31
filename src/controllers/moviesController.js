import pool from "../config/db";


export const createMovies= async(req, res)=>{
    const client = await pool.connect();
    try {
        const {title, genre, rating, duration, language, reviews=[], casts=[]} = req.body; 
        if(!title || !genre || !rating || !duration || !language){
            return res.status(404).json({
                success: false,
                message :"All Fields are required"
            });
        }

        await client.query("BEGIN");
        const query = `
        INSERT INTO movies(title,genre,rating,duration,language)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *; 
        `;
        const values = [title, genre,rating, duration, language];
        const moviesResult = await client.query(query, values);
        if(moviesResult.rows.length == 0){
            return res.status(400).json({
                success: false, 
                message :"Faield to fetch movies, Please try again !"
            })
        }
        const movie= moviesResult.rows[0].id;
        const insertedReviews =[];
        const insertedCasts = [];
        for(const review of reviews){
            const reivewQuery = `INSERT INTO reviews(movie_id, reviewer_name, review, stars)
             VALUES ($1, $2, $3, $4)
             RETURNING *; 
             `;
            const reviewVals= [movie, review.reviewer_name, review.review, review.stars];
            const reviewresult = await client.query(reivewQuery, reviewVals);
            insertedReviews.push(reviewresult.rows[0]);
        };

       for(const cast of casts){
          const castQuery = `
          INSERT INTO movie_cast(movie_id, actor_name, character_name)
          VALUES($1,$2,$3)
          RETURNING *;
          `;

          const castVals = [movie, cast.actor_name, cast.character_name];
          const castresult = await client.query(castQuery, castVals);
          insertedCasts.push(castresult.rows[0]);
       };

       await client.query("COMMIT");
       return res.status(201).json({
        success : true,
        reviews: insertedReviews,
        casts : insertedCasts
       })
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error."
        });
    }finally{
        client.release();
    }
}